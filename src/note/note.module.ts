import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { noteProviders } from './note.providers';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [NoteController],
  providers: [...noteProviders, NoteService],
})
export class NoteModule {}
