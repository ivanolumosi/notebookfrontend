import { Component } from '@angular/core';
import { NotesService } from '../notebook-home/notes.services';
import { Note } from './note.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-notebook-home',
  standalone: true,
  imports: [ CommonModule,
    FormsModule],
  templateUrl: './notebook-home.component.html',
  styleUrls: ['./notebook-home.component.css']
})


export class NotebookHomeComponent {
  notes: Note[] = [];
  newNote: Note = { id: 0, title: '', content: '' };
  editingNote: Note | null = null;

  constructor(private notesService: NotesService) {
    this.loadNotes();
  }

  loadNotes(): void {
    this.notes = this.notesService.getNotes();
  }

  addNote(): void {
    this.notesService.addNote({ ...this.newNote });
    this.newNote = { id: 0, title: '', content: '' };
    this.loadNotes();
  }

  editNote(note: Note): void {
    this.editingNote = { ...note };
  }

  updateNote(): void {
    if (this.editingNote) {
      this.notesService.updateNote(this.editingNote);
      this.editingNote = null;
      this.loadNotes();
    }
  }

  deleteNote(id: number): void {
    this.notesService.deleteNote(id);
    this.loadNotes();
  }
}
