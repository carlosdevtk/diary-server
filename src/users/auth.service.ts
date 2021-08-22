import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async registerUser(username: string, password: string) {
    username = username.toLowerCase();
    const users = await this.usersService.findByUsername(username);

    if (users.length) {
      throw new BadRequestException(
        'O nome de usuário já esta sendo utilizado',
      );
    }
    const salt = randomBytes(8).toString('hex');

    const hashedPassword = await this.usersService.hashPassword(password, salt);

    const user = await this.usersService.createUser(username, hashedPassword);

    return user;
  }

  async loginUser(dto: CreateUserDto) {
    const [user] = await this.usersService.findByUsername(dto.username);

    if (!user) {
      throw new BadRequestException('Credenciais inválidas');
    }

    const [salt, hashedPassInDB] = user.password.split('.');
    const hash = await this.usersService.hashPassword(dto.password, salt);
    if (salt + '.' + hashedPassInDB !== hash) {
      throw new BadRequestException('Credenciais inválidas');
    }

    return user;
  }
}
