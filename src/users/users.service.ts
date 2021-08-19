import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './users.entity';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const crypt = promisify(scrypt);

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}
  async createUser(dto: CreateUserDto) {
    const users = await this.findByUsername(dto.username);
    if (users.length) {
      throw new BadRequestException('Já existe um usário com esse nome');
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await crypt(dto.password, salt, 32)) as Buffer;
    const hashedPassword = salt + '.' + hash.toString('hex');

    const user = this.usersRepo.create({
      username: dto.username,
      password: hashedPassword,
    });

    return this.usersRepo.save(user);
  }

  findByUsername(username: string) {
    if (!username) {
      return null;
    }
    return this.usersRepo.find({ username });
  }
}
