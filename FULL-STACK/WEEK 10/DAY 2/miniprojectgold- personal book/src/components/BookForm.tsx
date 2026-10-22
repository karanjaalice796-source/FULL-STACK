import { useState, type FormEvent } from 'react';
import type { NewBook, ReadingStatus } from '../model/Book';

interface BookFormProps {
  onAdd: (book: NewBook) => void;
}

const initialStatus: ReadingStatus = 'to-read';

export function BookForm({ onAdd }: BookFormProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [coverIsbn, setCoverIsbn] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<ReadingStatus>(initialStatus);
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanAuthor = author.trim();
    const cleanCategory = category.trim();
    if (!cleanTitle || !cleanAuthor || !cleanCategory) {
      setError('Please complete the title, author, and category fields.');
      return;
    }

    onAdd({
      title: cleanTitle,
      author: cleanAuthor,
      category: cleanCategory,
      status,
      rating: status === 'read' ? rating : 0,
      ...(coverIsbn.trim() ? { coverIsbn: coverIsbn.trim().replaceAll('-', '') } : {}),
      ...(note.trim() ? { note: note.trim() } : {}),
    });
    setTitle('');
    setAuthor('');
    setCategory('');
    setCoverIsbn('');
    setNote('');
    setStatus(initialStatus);
    setRating(0);
    setError('');
  }

  return (
    <form className="book-form" onSubmit={submit}>
      <div className="form-heading">
        <span className="form-icon" aria-hidden="true">＋</span>
        <div>
          <h2>Add a book</h2>
          <p>Make room for your next favorite.</p>
        </div>
      </div>
      <label>
        Book title
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. The Secret Garden"
          maxLength={120}
          required
        />
      </label>
      <label>
        Author
        <input
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          placeholder="e.g. Frances Hodgson Burnett"
          maxLength={100}
          required
        />
      </label>
      <label>
        Category
        <input
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="e.g. Fiction"
          maxLength={40}
          required
        />
      </label>
      <label>
        ISBN <span>(optional, for the real cover)</span>
        <input
          value={coverIsbn}
          onChange={(event) => setCoverIsbn(event.target.value)}
          placeholder="e.g. 9780141439518"
          maxLength={17}
          inputMode="numeric"
        />
      </label>
      <label>
        A note to yourself <span>(optional)</span>
        <input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Why is this one on your list?"
          maxLength={140}
        />
      </label>
      <div className="form-row">
        <label>
          Reading status
          <select value={status} onChange={(event) => setStatus(event.target.value as ReadingStatus)}>
            <option value="to-read">Want to read</option>
            <option value="reading">Currently reading</option>
            <option value="read">Finished</option>
          </select>
        </label>
        {status === 'read' && (
          <label>
            Rating
            <select value={rating} onChange={(event) => setRating(Number(event.target.value))}>
              <option value={0}>No rating</option>
              {[1, 2, 3, 4, 5].map((star) => (
                <option value={star} key={star}>{star} {star === 1 ? 'star' : 'stars'}</option>
              ))}
            </select>
          </label>
        )}
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-dark form-submit" type="submit">Add to my library <span aria-hidden="true">↗</span></button>
    </form>
  );
}
