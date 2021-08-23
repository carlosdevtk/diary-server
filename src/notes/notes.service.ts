import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dtos/create-note.dto';
import { Note } from './notes.entity';

@Injectable()
export class NotesService {
  constructor(@InjectRepository(Note) private notesRepo: Repository<Note>) {}

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

  async findUserNote(username: string, id: number, currentUser: User) {
    if (!id) {
      return null;
    }
    const note = await this.notesRepo.findOne(id);

    if (!note.isPublic) {
      if (currentUser.username !== username) {
        throw new BadRequestException(
          'Você não pode bisbilhotar um diário alheio',
        );
      }
      return note;
    } else {
      if (currentUser.username === username) {
        return note;
      }
      note.views += 1;
      await this.notesRepo.save(note);
      return note;
    }
  }
}
