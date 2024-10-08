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

  async findAll(page: number, limit: number): Promise<{ cats: Cat[]; total: number }> {
    const offset = (page - 1) * limit;

    const [cats, total] = await this.catsRepository.findAndCount({
      skip: offset,
      take: limit,
    });

    return {cats,total};
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

  async findByAgeRange(ageLte: number, ageGte: number): Promise<any> {
    // const query = this.catsRepository.createQueryBuilder('cat');

    // if (ageLte) {
    //   query.andWhere('cat.age <= :ageLte', { ageLte });
    // }
    // if (ageGte) {
    //   query.andWhere('cat.age >= :ageGte', { ageGte });
    // }

    // return await query.getMany();
    return "fetched";
  }

  async update(id: number, updateCatDto: UpdateCatDto): Promise<Cat> {
    await this.catsRepository.update(id, updateCatDto);
    return this.catsRepository.findOneBy({ id });
  }

}