// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { NotebookHomeComponent } from './notebook-home.component';
// import { NotesService } from '../notebook-home/notes.services';
// import { Note } from './note.model';
// import { of } from 'rxjs';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ReverseTitlePipe } from '../reverse-title.pipe';

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from '../app.component';
import { NotebookHomeComponent } from '../notebook-home/notebook-home.component';
import { NotesService } from '../notebook-home/notes.services';
import { Note } from '../notebook-home/note.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReverseTitlePipe } from '../reverse-title.pipe';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('AppComponent', () => {
  let appFixture: ComponentFixture<AppComponent>;
  let appComponent: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      declarations: [AppComponent],
    }).compileComponents();

    appFixture = TestBed.createComponent(AppComponent);
    appComponent = appFixture.componentInstance;
  });

  it('should create the app', () => {
    expect(appComponent).toBeTruthy();
  });

  it(`should have as title 'Notebook'`, () => {
    expect(appComponent.title).toEqual('Notebook');
  });

  it('should render title', () => {
    appFixture.detectChanges();
    const compiled = appFixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('Notebook app is running!');
  });
});






describe('NotebookHomeComponent', () => {
  let notebookFixture: ComponentFixture<NotebookHomeComponent>;
  let notebookComponent: NotebookHomeComponent;
  let notesService: jasmine.SpyObj<NotesService>;
  let el: DebugElement;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('NotesService', ['getNotes', 'addNote', 'updateNote', 'deleteNote']);

    await TestBed.configureTestingModule({
      declarations: [NotebookHomeComponent, ReverseTitlePipe],
      imports: [CommonModule, FormsModule],
      providers: [
        { provide: NotesService, useValue: spy }
      ]
    }).compileComponents();

    notebookFixture = TestBed.createComponent(NotebookHomeComponent);
    notebookComponent = notebookFixture.componentInstance;
    notesService = TestBed.inject(NotesService) as jasmine.SpyObj<NotesService>;
    el = notebookFixture.debugElement;
  });

  it('should create', () => {
    expect(notebookComponent).toBeTruthy();
  });

  it('should load notes on initialization', () => {
    const notes: Note[] = [{ id: 1, title: 'Test Note', content: 'Content' }];
    notesService.getNotes.and.returnValue(notes);

    notebookComponent.loadNotes();

    expect(notebookComponent.notes).toEqual(notes);
    expect(notesService.getNotes).toHaveBeenCalled();
  });

  it('should add a note', () => {
    const newNote: Note = { id: 1, title: 'New Note', content: 'New Content' };
    notebookComponent.newNote = newNote;

    notebookComponent.addNote();

    expect(notesService.addNote).toHaveBeenCalledWith(newNote);
    expect(notebookComponent.newNote).toEqual({ id: 0, title: '', content: '' });
    expect(notesService.getNotes).toHaveBeenCalled();
  });

  it('should edit a note', () => {
    const note: Note = { id: 1, title: 'Test Note', content: 'Content' };

    notebookComponent.editNote(note);

    expect(notebookComponent.editingNote).toEqual(note);
  });

  it('should update a note', () => {
    const note: Note = { id: 1, title: 'Updated Note', content: 'Updated Content' };
    notebookComponent.editingNote = note;

    notebookComponent.updateNote();

    expect(notesService.updateNote).toHaveBeenCalledWith(note);
    expect(notebookComponent.editingNote).toBeNull();
    expect(notesService.getNotes).toHaveBeenCalled();
  });

  it('should delete a note', () => {
    const id = 1;

    notebookComponent.deleteNote(id);

    expect(notesService.deleteNote).toHaveBeenCalledWith(id);
    expect(notesService.getNotes).toHaveBeenCalled();
  });

  it('should display notes', () => {
    const notes = [{ id: 1, title: 'Note 1', content: 'Content 1' }];
    notesService.getNotes.and.returnValue(notes);

    notebookFixture.detectChanges();

    const noteElements = el.queryAll(By.css('.note'));
    expect(noteElements.length).toBe(1);
    expect(noteElements[0].nativeElement.textContent).toContain('Note 1');
  });

  it('should call addNote on button click', () => {
    notesService.getNotes.and.returnValue([]);
    notebookFixture.detectChanges();

    const newNote: Note = { id: 1, title: 'New Note', content: 'New Content' };
    notebookComponent.newNote = newNote;

    const button = el.query(By.css('button.add-note'));
    button.triggerEventHandler('click', null);

    expect(notesService.addNote).toHaveBeenCalledWith(newNote);
  });
});
