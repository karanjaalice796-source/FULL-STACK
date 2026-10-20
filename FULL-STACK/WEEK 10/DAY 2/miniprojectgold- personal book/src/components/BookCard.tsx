import { useState } from 'react';
import type { Book, ReadingStatus } from '../model/Book';

interface BookCardProps {
  book: Book;
  onRemove: (id: string) => void;
  onStatusChange: (id: string, status: ReadingStatus) => void;
}

const statusLabels: Record<ReadingStatus, string> = {
  'to-read': 'Want to read',
  reading: 'Reading now',
  read: 'Finished',
};

const palettes = [
  'cover-olive',
  'cover-rust',
  'cover-blue',
  'cover-plum',
  'cover-sand',
  'cover-forest',
];

export function BookCard({ book, onRemove, onStatusChange }: BookCardProps) {
  const [coverFailed, setCoverFailed] = useState(false);
  const palette = palettes[book.title.length % palettes.length];
  return (
    <article className="book-card">
      <div className={`book-cover ${palette}`} aria-hidden="true">
        <div className="cover-spine" />
        <div className="cover-decoration">✳</div>
        <div className="cover-title">{book.title}</div>
        <div className="cover-author">{book.author}</div>
        <span className="cover-mark">P&amp;P</span>
        {book.coverIsbn && !coverFailed && (
          <img
            className="book-cover-image"
            src={`https://covers.openlibrary.org/b/isbn/${encodeURIComponent(book.coverIsbn)}-M.jpg?default=false`}
            alt=""
            loading="lazy"
            onError={() => setCoverFailed(true)}
          />
        )}
      </div>
      <div className="book-info">
        <div className="book-heading">
          <div>
            <h3>{book.title}</h3>
            <p className="book-author">by {book.author}</p>
          </div>
          <button
            className="icon-button"
            type="button"
            aria-label={`Remove ${book.title} from library`}
            title="Remove book"
            onClick={() => onRemove(book.id)}
          >
            ×
          </button>
        </div>
        <div className="book-meta">
          <span className="category-tag">{book.category}</span>
          {book.rating > 0 && (
            <span className="rating" aria-label={`${book.rating} out of 5 stars`}>
              {'★'.repeat(book.rating)}<span>{'★'.repeat(5 - book.rating)}</span>
            </span>
          )}
        </div>
        {book.note && <p className="book-note"><span>A little about it</span>{book.note}</p>}
        <label className="status-select-label">
          <span className={`status-dot status-${book.status}`} />
          <select
            aria-label={`Reading status for ${book.title}`}
            value={book.status}
            onChange={(event) => onStatusChange(book.id, event.target.value as ReadingStatus)}
          >
            {(Object.keys(statusLabels) as ReadingStatus[]).map((status) => (
              <option value={status} key={status}>{statusLabels[status]}</option>
            ))}
          </select>
          <span className="select-chevron" aria-hidden="true">⌄</span>
        </label>
      </div>
    </article>
  );
}
