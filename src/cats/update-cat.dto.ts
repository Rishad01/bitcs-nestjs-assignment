import { IsString, IsNumber, IsOptional } from 'class-validator';
export class UpdateCatDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  age?: number;

  @IsString()
  @IsOptional()
  breed?: string;
}
