import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('/api')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/auth/register')
  @HttpCode(201)
  registerUser(@Body() user: CreateUserDto) {
    return this.authService.registerUser(user);
  }

  @Post('/auth/login')
  @HttpCode(200)
  loginUser(@Body() dto: CreateUserDto) {
    return this.authService.loginUser(dto);
  }
}
