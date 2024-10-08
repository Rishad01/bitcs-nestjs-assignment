import { Controller, Get, Post, Put,Req, Body, Query, Param, Delete,UsePipes,UseGuards, BadRequestException  } from '@nestjs/common';
import { CatsService } from './cats.service';
import { Cat } from './cats.entity';
import { CreateCatDto } from './create-cat.dto';
import { UpdateCatDto } from './update-cat.dto';
import { JoiValidationPipe } from 'src/pipes/validation.pipe';
import { createCatSchema } from './create-cat.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as Joi from 'joi';

const updateCatSchema = Joi.object({
  name: Joi.string().optional(),
  age: Joi.number().optional(),
  breed: Joi.string().optional(),  
});

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,     
    @Query('limit') limit: number = 10,  
  ): Promise<Cat[]> {
    return this.catsService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Cat> {
    return this.catsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new JoiValidationPipe(createCatSchema))
  create(@Body() createCatDto: CreateCatDto, @Req() request: Request) {
    return this.catsService.create(createCatDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.catsService.remove(+id); 
  }

  @Get('search')
async findByAgeRange(
  @Query('age_lte') ageLte: string,
  @Query('age_gte') ageGte: string,  
): Promise<Cat[]> {
  const parsedAgeLte = ageLte ? parseInt(ageLte, 10) : null;
  const parsedAgeGte = ageGte ? parseInt(ageGte, 10) : null;

  if (isNaN(parsedAgeLte) || isNaN(parsedAgeGte)) {
    throw new BadRequestException('Invalid age query parameters');
  }

  return this.catsService.findByAgeRange(parsedAgeLte, parsedAgeGte);
}

  @UseGuards(JwtAuthGuard)
@Put(':id')
@UsePipes(new JoiValidationPipe(updateCatSchema)) 
async updateCat(
  @Param('id') id: string, 
  @Body() updateCatDto: UpdateCatDto
) {
  console.log('Received DTO:', updateCatDto); 
  const { error } = updateCatSchema.validate(updateCatDto);
  if (error) {
    throw new BadRequestException(`Validation failed: ${error.message}`);
  }

  return this.catsService.update(+id, updateCatDto);
}
}