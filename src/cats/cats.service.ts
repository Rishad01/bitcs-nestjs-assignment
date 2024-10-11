import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { UpdateCatDto } from './update-cat.dto';
import { Cat } from './cats.entity';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private catsRepository: Repository<Cat>,
  ) {}

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ cats: Cat[]; total: number }> {
    const offset = (page - 1) * limit;

    const [cats, total] = await this.catsRepository.findAndCount({
      skip: offset,
      take: limit,
    });

    if (total === 0) {
      throw new NotFoundException('No cats found in the database');
    }

    if (cats.length === 0) {
      throw new NotFoundException(`No cats found on page ${page}`);
    }

    return { cats, total };
  }

  async findOne(id: number): Promise<Cat> {
    const cat = await this.catsRepository.findOneBy({ id });

    if (!cat) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }

    return cat;
  }

  async create(cat: Cat): Promise<Cat> {
    return this.catsRepository.save(cat);
  }

  async remove(id: number): Promise<any> {
    const result = await this.catsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    } else {
      return 'deleted';
    }
  }

  async findByAgeRange(ageLte: number, ageGte: number): Promise<Cat[]> {
    return this.catsRepository.find({
      where: {
        age: Between(ageGte, ageLte),
      },
    });
  }

  async update(id: number, updateCatDto: UpdateCatDto): Promise<Cat> {
    await this.catsRepository.update(id, updateCatDto);
    return this.catsRepository.findOneBy({ id });
  }
}
