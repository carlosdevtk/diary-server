import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const crypt = promisify(scrypt);

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

  async hashPassword(password: string, salt: string) {
    const hash = (await crypt(password, salt, 32)) as Buffer;
    return salt + '.' + hash.toString('hex');
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
    if (attrs.password) {
      const salt = randomBytes(8).toString('hex');
      attrs.password = await this.hashPassword(attrs.password, salt);
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
