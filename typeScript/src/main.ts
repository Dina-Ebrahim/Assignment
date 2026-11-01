class User {
  private _age: number;
  public notebooks: NoteBook[] = [];
  constructor(
    public Id: number,
    public name: string,
    public email: string,
    private password: string,
    protected Phone: string,
    age: number,
  ) {
    this.validateAge(age);
    this._age = age;
  }
  private validateAge(age: number): void {
    if (age < 18 || age > 60) {
      throw new Error("Age must be between 18 and 60");
    }
  }
  public get age(): number {
    return this._age;
  }
  public set age(value: number) {
    this.validateAge(value);
    this._age = value;
  }
  public displayInfo(): void {
    console.log(
      `ID:${this.Id},Name:${this.name},Email:${this.email},phone:${this.Phone},Age:${this.age}`,
    );
  }
  public addNoteBooks(notebook: NoteBook): void {
    this.notebooks.push(notebook);
  }
}
class Admin extends User {
  public manageNotes(notebook: NoteBook, noteId: number): void {
    notebook.removeNote(noteId);
    console.log("Admin is managing notes");
  }
}

class Note {
  constructor(
    public Id: number,
    public title: string,
    public content: string,
    public author: User,
  ) {}
  public preview(): string {
    return this.content.slice(0, 30) + "...";
  }
}

class NoteBook {
  private notes: Note[] = [];
  private nextId = 1;

  constructor(public title: string) {}

  public addNote(title: string, content: string, author: User): Note {
    const note = new Note(this.nextId++, title, content, author);
    this.notes.push(note);
    return note;
  }

  public removeNote(noteId: number): void {
    this.notes = this.notes.filter((n) => n.Id !== noteId);
  }

  public getNotes(): Note[] {
    return this.notes;
  }
}
//Generics
class Storage<T> {
  private item: T[] = [];
  public addItem(Item: T) {
    this.item.push(Item);
  }
  public removeItem(Item: T) {
    this.item = this.item.filter((currentItem) => currentItem !== Item);
  }
  public getAllItems(): T[] {
    return this.item;
  }
}
