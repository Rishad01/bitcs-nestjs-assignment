import {
  Controller,
  Get,
  Post,
  Put,
  Req,
  Body,
  Query,
  Param,
  Delete,
  UsePipes,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
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
  ): Promise<{ cats: Cat[]; total: number }> {
    return this.catsService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Cat> {
    return this.catsService.findOne(+id);
  }

  @Get('get')
  findOnenew(): Promise<Cat> {
    return this.catsService.findOne(1);
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

  // @Get('search')
  // async findByAgeRange(
  //   @Query('age_lte') ageLte: number,
  //   @Query('age_gte') ageGte: number,
  // ): Promise<Cat[]> {
  //   // const parsedAgeLte = ageLte ? parseInt(ageLte, 10) : null;
  //   // const parsedAgeGte = ageGte ? parseInt(ageGte, 10) : null;

  //   // if (isNaN(parsedAgeLte) || isNaN(parsedAgeGte)) {
  //   //   throw new BadRequestException('Invalid age query parameters');
  //   // }

  //   console.log(ageLte, ageGte);
  //   return this.catsService.findByAgeRange(ageLte, ageGte);
  // }

  // @Get('/fetch')
  // async fetchByAgeRange(
  //   @Query('age_lte') ageLte: number,
  //   @Query('age_gte') ageGte: number,
  // ): Promise<Cat[]> {
  //   // const parsedAgeLte = ageLte ? parseInt(ageLte, 10) : null;
  //   // const parsedAgeGte = ageGte ? parseInt(ageGte, 10) : null;

  //   // if (isNaN(parsedAgeLte) || isNaN(parsedAgeGte)) {
  //   //   throw new BadRequestException('Invalid age query parameters');
  //   // }

  //   console.log(ageLte, ageGte);
  //   return this.catsService.findByAgeRange(ageLte, ageGte);
  // }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(updateCatSchema)) updateCatDto: UpdateCatDto,
  ) {
    const parsedId = Number(id);
    
    return this.catsService.update(parsedId, updateCatDto);
  }
}