import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}
  async createUser(dto: CreateUserDto) {
    const user = this.usersRepo.create({
      username: dto.username,
      password: dto.password,
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
