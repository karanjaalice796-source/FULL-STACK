export type ReadingStatus = 'to-read' | 'reading' | 'read';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  status: ReadingStatus;
  rating: number;
  addedAt: string;
  coverIsbn?: string;
  note?: string;
}

export type NewBook = Omit<Book, 'id' | 'addedAt'>;

export class BookItem implements Book {
  readonly id: string;
  readonly addedAt: string;
  title: string;
  author: string;
  category: string;
  status: ReadingStatus;
  rating: number;
  coverIsbn?: string;
  note?: string;

  constructor(data: NewBook, id: string = crypto.randomUUID(), addedAt = new Date().toISOString()) {
    this.id = id;
    this.addedAt = addedAt;
    this.title = data.title.trim();
    this.author = data.author.trim();
    this.category = data.category.trim();
    this.status = data.status;
    this.rating = data.rating;
    this.coverIsbn = data.coverIsbn;
    this.note = data.note?.trim() || undefined;
  }

  toJSON(): Book {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      category: this.category,
      status: this.status,
      rating: this.rating,
      addedAt: this.addedAt,
      ...(this.coverIsbn ? { coverIsbn: this.coverIsbn } : {}),
      ...(this.note ? { note: this.note } : {}),
    };
  }

  static fromJSON(book: Book): BookItem {
    return new BookItem(
      {
        title: book.title,
        author: book.author,
        category: book.category,
        status: book.status,
        rating: book.rating,
        coverIsbn: book.coverIsbn,
        note: book.note,
      },
      book.id,
      book.addedAt
    );
  }
}
