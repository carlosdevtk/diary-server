import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/Auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/users.entity';
import { CreateNoteDto } from './dtos/create-note.dto';
import { NoteDto } from './dtos/note.dto';
import { NotesService } from './notes.service';

@Controller('/api')
@UseGuards(AuthGuard)
@Serialize(NoteDto)
export class NotesController {
  constructor(private notesServices: NotesService) {}

  @Post('/note')
  @HttpCode(201)
  createNote(@Body() dto: CreateNoteDto, @CurrentUser() user: User) {
    return this.notesServices.createNote(dto, user);
  }

  @Get('/notes')
  @HttpCode(200)
  findAllPublicNotes() {
    return this.notesServices.findAllPublics();
  }
}
