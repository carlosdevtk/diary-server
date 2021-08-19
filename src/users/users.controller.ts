import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('/api')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post('/register')
  @HttpCode(201)
  registerUser(@Body() user: CreateUserDto) {
    return this.usersService.createUser(user);
  }
}
