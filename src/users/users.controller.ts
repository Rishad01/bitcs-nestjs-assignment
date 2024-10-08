// src/users/users.controller.ts
import { Body, Controller, Post, BadRequestException, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';
import { LoginUserDto } from './create-user.dto';
import { createUserSchema, loginUserSchema } from './create-user.schema';
import {JoiValidationPipe} from '../pipes/validation.pipe';
import * as Joi from 'joi';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @UsePipes(new JoiValidationPipe(createUserSchema))
  async signUp(@Body() createUserDto: CreateUserDto) {
    const { error } = createUserSchema.validate(createUserDto);
    if (error) {
      throw new BadRequestException('Validation failed');
    }
    return this.usersService.createUser(createUserDto.email, createUserDto.password);
  }

  @Post('login')
  @UsePipes(new JoiValidationPipe(loginUserSchema))
  async login(@Body() loginUserDto: LoginUserDto) {
    const { error } = loginUserSchema.validate(loginUserDto);
    if (error) {
      throw new BadRequestException('Validation failed');
    }
    const user = await this.usersService.validateUser(loginUserDto.email, loginUserDto.password);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    return this.usersService.login(user);
  }
}
