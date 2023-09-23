import {
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
  Body,
  Post,
  Delete,
  Put,
} from '@nestjs/common';
import { Note } from 'src/entities/note.entity';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('note')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @Get('list/:userId')
  @HttpCode(200)
  listNotes(
    @Param('userId') userId: string,
    @Query()
    {
      query,
      orderBy,
    }: { query?: string; orderBy?: 'newest' | 'oldest' | 'recentlyUpdated' },
  ): Promise<Note[]> {
    return this.noteService.listNotes({ userId, query, orderBy });
  }

  @Get(':noteId')
  @HttpCode(200)
  readNote(@Param('noteId') noteId: string): Promise<Note> {
    return this.noteService.readNote({ noteId });
  }

  @Post()
  @HttpCode(201)
  createNote(@Body() { note, userId, title }: CreateNoteDto): Promise<void> {
    return this.noteService.createNote({ note, userId, title });
  }

  @Delete(':noteId')
  @HttpCode(204)
  deleteNote(@Param('noteId') noteId: string): Promise<void> {
    return this.noteService.deleteNote({ noteId });
  }

  @Put(':noteId')
  @HttpCode(202)
  updateNote(
    @Param('noteId') noteId: string,
    @Body() { title, note }: UpdateNoteDto,
  ): Promise<Note> {
    return this.noteService.updateNote({ noteId, title, note });
  }
}
