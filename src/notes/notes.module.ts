import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { NotesController } from './notes.controller';
import { Note } from './notes.entity';
import { NotesService } from './notes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Note, User])],
  controllers: [NotesController],
  providers: [NotesService, UsersService],
})
export class NotesModule {}
