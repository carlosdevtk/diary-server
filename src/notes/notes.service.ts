import { Injectable } from '@nestjs/common';
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
}
