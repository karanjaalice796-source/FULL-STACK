import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  selectAvailableBooks,
  selectBooks,
  selectFantasyBooks,
  selectHorrorBooks,
  selectScienceFictionBooks,
} from './booksSelectors.js'

const shelves = [
  { label: 'Everything', key: 'all' },
  { label: 'Horror', key: 'Horror' },
  { label: 'Fantasy', key: 'Fantasy' },
  { label: 'Science fiction', key: 'Science Fiction' },
]

const genreSelectors = {
  Horror: selectHorrorBooks,
  Fantasy: selectFantasyBooks,
  'Science Fiction': selectScienceFictionBooks,
}

function BookCard({ book, onAdd }) {
  const [coverFailed, setCoverFailed] = useState(false)

  return (
    <article className="book-card">
      <button
        className="book-cover-button"
        type="button"
        onClick={() => onAdd(book)}
        disabled={!book.available}
        aria-label={book.available ? `Add ${book.title} to basket` : `${book.title} is out of stock`}
      >
        <div className={`book-cover ${coverFailed ? 'cover-fallback' : ''}`}>
          {!coverFailed && (
            <img
              src={`https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`}
              alt={`Cover of ${book.title}`}
              loading="lazy"
              onError={() => setCoverFailed(true)}
            />
          )}
          {coverFailed && (
            <>
              <span className="cover-mark" aria-hidden="true">THE READING ROOM</span>
              <span className="cover-title">{book.title}</span>
              <span className="cover-author">{book.author}</span>
            </>
          )}
        </div>
        <span className="quick-add">{book.available ? 'Quick add' : 'Out of stock'} <span aria-hidden="true">{book.available ? '+' : '—'}</span></span>
      </button>
      <div className="book-details">
        <span className="genre-label">{book.genre}</span>
        <h3>{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        <div className="book-footer">
          <span className="book-price">KSh {book.price.toLocaleString('en-KE')}</span>
          <button
            className="add-button"
            type="button"
            disabled={!book.available}
            onClick={() => onAdd(book)}
          >
            {book.available ? 'Add to basket' : 'Out of stock'}
          </button>
        </div>
        <span className="visually-hidden">ISBN {book.isbn} · {book.year} edition</span>
      </div>
    </article>
  )
}

export default function BookList({ genre, search, onAdd }) {
  const availableBooks = useSelector(selectAvailableBooks)
  const booksForGenre = useSelector(genre === 'all' ? selectBooks : genreSelectors[genre])
  const visibleBooks = useMemo(() => {
    const query = search.trim().toLowerCase()
    return booksForGenre.filter((book) => (
      !query || `${book.title} ${book.author} ${book.genre}`.toLowerCase().includes(query)
    ))
  }, [booksForGenre, search])
  const availableCount = availableBooks.length

  return (
    <>
      <div className="results-line" aria-live="polite">
        <p>
          {visibleBooks.length} {visibleBooks.length === 1 ? 'book' : 'books'}
        </p>
        <p className="availability-note">{availableCount} available to order</p>
      </div>
      {visibleBooks.length > 0 ? (
        <div className="book-grid">
          {visibleBooks.map((book) => <BookCard key={book.id} book={book} onAdd={onAdd} />)}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No books found</h3>
          <p>Try a different search or browse another genre.</p>
        </div>
      )}
    </>
  )
}

export { shelves }
