import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}
  async createUser(username: string, password: string) {
    const user = this.usersRepo.create({
      username,
      password,
    });

    return this.usersRepo.save(user);
  }

  findById(id: number) {
    if (!id) {
      return null;
    }
    return this.usersRepo.findOne(id);
  }

  findByUsername(username: string) {
    if (!username) {
      return null;
    }
    return this.usersRepo.find({ username });
  }

  async updateUser(id: number, currentUser: User, attrs: Partial<User>) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    if (currentUser.id !== user.id) {
      throw new BadRequestException(
        'Você não pode alterar dados de outro usuário >:(',
      );
    }
    Object.assign(user, attrs);
    return this.usersRepo.save(user);
  }

  async deleteUser(id: number, currentUser: User) {
    if (currentUser.id !== id) {
      throw new BadRequestException('Você não pode deletar outro usuário >:(');
    }
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.usersRepo.remove(user);
  }
}
