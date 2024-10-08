import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateCatDto } from './update-cat.dto'
import { Cat } from './cats.entity';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private catsRepository: Repository<Cat>,
  ) {}

  async findAll(page: number, limit: number): Promise<Cat[]> {
    const offset = (page - 1) * limit;

    const cats = await this.catsRepository.find({
      skip: offset,
      take: limit,
    });

    return cats;
  }

  findOne(id: number): Promise<Cat> {
    return this.catsRepository.findOneBy({ id });
  }

  async create(cat: Cat): Promise<Cat> {
    return this.catsRepository.save(cat);
  }

  

  async remove(id: number): Promise<void> {
    await this.catsRepository.delete(id);
  }

  async findByAgeRange(ageLte: number, ageGte: number): Promise<Cat[]> {
    const query = this.catsRepository.createQueryBuilder('cat');

    if (ageLte) {
      query.where('cat.age <= :ageLte', { ageLte });
    }
    if (ageGte) {
      query.andWhere('cat.age >= :ageGte', { ageGte });
    }

    return await query.getMany();
  }

  async update(id: number, updateCatDto: UpdateCatDto): Promise<Cat> {
    await this.catsRepository.update(id, updateCatDto);
    return this.catsRepository.findOneBy({ id });
  }

}