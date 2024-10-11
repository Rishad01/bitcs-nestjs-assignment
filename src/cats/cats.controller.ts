import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Query,
  Param,
  Delete,
  UsePipes,
  UseGuards,
  BadRequestException,
  NotFoundException,
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

  // @Get('check')
  // checkRoute() {
  //   console.log('Check route called'); // Log to ensure the route is hit
  //   return { message: 'Route was called successfully' }; // Respond with a message
  // }

  @Get('search')
  async findByAgeRange(
    @Query('age_lte') ageLte: number,
    @Query('age_gte') ageGte: number,
  ): Promise<{ message: string; cats?: Cat[] }> {
    const parsedAgeLte = ageLte ? parseInt(ageLte.toString(), 10) : null;
    const parsedAgeGte = ageGte ? parseInt(ageGte.toString(), 10) : null;

    if (!ageGte || !ageLte) {
      throw new BadRequestException('Mention proper Range of Age');
    }
    if (isNaN(parsedAgeLte) || isNaN(parsedAgeGte)) {
      throw new BadRequestException('Invalid age query parameters');
    }

    const cats = await this.catsService.findByAgeRange(
      parsedAgeLte,
      parsedAgeGte,
    );

    if (!cats.length) {
      throw new NotFoundException(
        'No cats found within the specified age range',
      );
    }

    return { message: 'Cats found', cats };
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Cat> {
    return this.catsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new JoiValidationPipe(createCatSchema))
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.catsService.remove(+id);
  }

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
