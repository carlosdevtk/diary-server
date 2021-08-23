import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dtos/create-note.dto';
import { Note } from './notes.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private notesRepo: Repository<Note>,
    private usersService: UsersService,
  ) {}

  async createNote(dto: CreateNoteDto, user: User) {
    const note = this.notesRepo.create({ ...dto });
    note.user = user;

    return this.notesRepo.save(note);
  }

  async findAllPublics() {
    return this.notesRepo
      .createQueryBuilder()
      .where('isPublic IS TRUE')
      .getMany();
  }

  async findAllFromUser(user: User) {
    const notes: Note[] = await this.notesRepo.find({
      where: { user },
      relations: ['user'],
    });

    return notes;
  }

  async findUserPublicNotes(username: string) {
    const [user] = await this.usersService.findByUsername(username);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const notes: Note[] = await this.notesRepo.find({
      where: { user, isPublic: true },
      relations: ['user'],
    });

    return notes;
  }

  async findUserNote(username: string, id: number, currentUser: User) {
    const [user] = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (!id) {
      return null;
    }
    const note = await this.notesRepo.findOne({
      where: { id, user },
      relations: ['user'],
    });

    if (!note) {
      throw new NotFoundException('Esse diário não existe!');
    }

    if (!note.isPublic) {
      if (currentUser !== user) {
        throw new BadRequestException(
          'Você não pode bisbilhotar um diário alheio',
        );
      }
      return note;
    } else {
      if (currentUser === user) {
        return note;
      }
      note.views += 1;
      await this.notesRepo.save(note);
      return note;
    }
  }

  async updateUserNote(
    username: string,
    noteId: number,
    currentUser: User,
    attrs: Partial<Note>,
  ) {
    const note = await this.notesRepo.findOne(noteId);
    if (!note) {
      throw new NotFoundException('Esse diário não existe!');
    }

    if (note.user.id !== currentUser.id) {
      throw new BadRequestException(
        'Você não pode alterar o diário de outra pessoa >:(',
      );
    }
    Object.assign(note, attrs);

    return this.notesRepo.save(note);
  }
}
