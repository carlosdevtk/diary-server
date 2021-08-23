import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/Auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/users.entity';
import { CreateNoteDto } from './dtos/create-note.dto';
import { NoteDto } from './dtos/note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';
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

  @Get('/:username/notes')
  @HttpCode(200)
  findUserPublicNotes(@Param('username') username: string) {
    return this.notesServices.findUserPublicNotes(username);
  }

  @Get('/my-notes')
  @HttpCode(200)
  findAllUserNotes(@CurrentUser() user: User) {
    return this.notesServices.findAllFromUser(user);
  }

  @Get('/:username/:noteId')
  @HttpCode(200)
  showUserNote(
    @Param('username') username: string,
    @Param('noteId') noteId: string,
    @CurrentUser() user: User,
  ) {
    return this.notesServices.findUserNote(username, parseInt(noteId), user);
  }

  @Patch('/:username/:noteId')
  @HttpCode(200)
  updateUserNote(
    @Param('username') username: string,
    @Param('noteId') noteId: string,
    @CurrentUser() user: User,
    @Body() attrs: UpdateNoteDto,
  ) {
    return this.notesServices.updateUserNote(
      username,
      parseInt(noteId),
      user,
      attrs,
    );
  }
}
