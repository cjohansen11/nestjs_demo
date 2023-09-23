import { Injectable, Inject } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { Note } from 'src/entities/note.entity';

@Injectable()
export class NoteService {
  constructor(
    @Inject('NOTE_REPOSITORY') private noteRepository: Repository<Note>,
  ) {}

  async listNotes({
    userId,
    query,
    orderBy,
  }: {
    userId: string;
    query?: string;
    orderBy?: 'newest' | 'oldest' | 'recentlyUpdated';
  }): Promise<Note[]> {
    let queryBuilder = this.noteRepository.createQueryBuilder('note');

    queryBuilder = queryBuilder.where('note.userId = :userId', { userId });

    if (query) {
      queryBuilder = queryBuilder.andWhere(
        'to_tsvector(note.note) @@ plainto_tsquery(:query)',
        {
          query,
        },
      );
    }

    if (orderBy) {
      switch (orderBy) {
        case 'oldest':
          queryBuilder.orderBy('note.createDate', 'ASC');
          break;
        case 'recentlyUpdated':
          queryBuilder.orderBy('note.updateDate', 'DESC');
        default:
          queryBuilder.orderBy('note.createDate', 'DESC');
          break;
      }
    }

    return await queryBuilder.getMany();
  }

  async readNote({ noteId }: { noteId: string }): Promise<Note> {
    return await this.noteRepository.findOneByOrFail({ id: noteId });
  }

  async createNote({
    note,
    userId,
    title,
  }: {
    note: string;
    userId: string;
    title?: string;
  }): Promise<void> {
    const newNote = this.noteRepository.create({
      note,
      userId,
      title,
    });
    await this.noteRepository.save(newNote);
  }

  async deleteNote({ noteId }: { noteId: string }): Promise<void> {
    await this.noteRepository.delete({ id: noteId });
  }

  async updateNote({
    noteId,
    title,
    note,
  }: {
    noteId: string;
    title?: string;
    note?: string;
  }): Promise<Note> {
    await this.noteRepository.update(noteId, {
      note,
      title,
    });

    return await this.noteRepository.findOneByOrFail({ id: noteId });
  }
}
