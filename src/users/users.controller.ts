import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/Auth.guard';
import { GuestGuard } from 'src/guards/Guest.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller('/api')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/auth/current-user')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  currentUser(@CurrentUser() user: User) {
    return user;
  }

  @Post('/auth/register')
  @UseGuards(GuestGuard)
  @HttpCode(201)
  registerUser(@Body() user: CreateUserDto) {
    return this.authService.registerUser(user.username, user.password);
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

  @Delete('/user/:id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async deleteUser(
    @Param('id') id: string,
    @Session() session: any,
    @CurrentUser() currentUser: User,
  ) {
    await this.usersService.deleteUser(parseInt(id), currentUser);
    session.userId = null;
  }

  @Patch('/user/:id')
  @UseGuards(AuthGuard)
  @HttpCode(201)
  updateUser(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() attrs: UpdateUserDto,
  ) {
    return this.usersService.updateUser(parseInt(id), user, attrs);
  }
}
