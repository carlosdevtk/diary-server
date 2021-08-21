import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/Auth.guard';
import { GuestGuard } from 'src/guards/Guest.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Controller('/api')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/auth/register')
  @UseGuards(GuestGuard)
  @HttpCode(201)
  registerUser(@Body() user: CreateUserDto) {
    return this.authService.registerUser(user);
  }

  @Post('/auth/login')
  @UseGuards(GuestGuard)
  @HttpCode(200)
  async loginUser(@Body() dto: CreateUserDto, @Session() session: any) {
    const user = await this.authService.loginUser(dto);
    session.userId = user.id;
    return user;
  }

  @Post('/auth/logout')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  logoutUser(@Session() session: any) {
    session.userId = null;
  }
}
