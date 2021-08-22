import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const crypt = promisify(scrypt);

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
    const hash = (await crypt(password, salt, 32)) as Buffer;
    const hashedPassword = salt + '.' + hash.toString('hex');

    const user = await this.usersService.createUser(username, hashedPassword);

    return user;
  }

  async loginUser(dto: CreateUserDto) {
    const [user] = await this.usersService.findByUsername(dto.username);

    if (!user) {
      throw new BadRequestException('Credenciais inválidas');
    }

    const [salt, hashedPassInDB] = user.password.split('.');
    const hash = (await crypt(dto.password, salt, 32)) as Buffer;

    if (hashedPassInDB !== hash.toString('hex')) {
      throw new BadRequestException('Credenciais inválidas');
    }

    return user;
  }
}
