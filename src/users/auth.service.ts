import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const crypt = promisify(scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async registerUser(dto: CreateUserDto) {
    const users = await this.usersService.findByUsername(dto.username);

    if (users.length) {
      throw new BadRequestException(
        'O nome de usuário já esta sendo utilizado',
      );
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await crypt(dto.password, salt, 32)) as Buffer;
    const hashedPassword = salt + '.' + hash.toString('hex');

    const user = await this.usersService.createUser({
      username: dto.username,
      password: hashedPassword,
    });

    return user;
  }
}