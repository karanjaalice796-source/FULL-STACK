import { useMemo, useState, type FormEvent } from 'react'
import List from './components/List'

interface Book {
  id: number
  title: string
  author: string
}

const starterBooks: Book[] = [
  { id: 1, title: 'The Midnight Library', author: 'Matt Haig' },
  { id: 2, title: 'Braiding Sweetgrass', author: 'Robin Wall Kimmerer' },
  { id: 3, title: 'Pride and Prejudice', author: 'Jane Austen' },
  { id: 4, title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin' },
]

const coverStyles = ['cover-sage', 'cover-clay', 'cover-blue', 'cover-rose', 'cover-ochre']
const coverMarks = ['✳', '◒', '✺', '❋', '✦']

function BookApp() {
  const [books, setBooks] = useState<Book[]>(starterBooks)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [query, setQuery] = useState('')
  const [formMessage, setFormMessage] = useState('')

  const filteredBooks = useMemo(() => {
    const searchTerm = query.trim().toLocaleLowerCase()
    if (!searchTerm) return books

    return books.filter((book) =>
      `${book.title} ${book.author}`.toLocaleLowerCase().includes(searchTerm),
    )
  }, [books, query])

  function addBook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanTitle = title.trim()
    const cleanAuthor = author.trim()

    if (!cleanTitle || !cleanAuthor) {
      setFormMessage('Add both a title and an author to save your book.')
      return
    }

    setBooks((currentBooks) => [
      ...currentBooks,
      { id: Date.now(), title: cleanTitle, author: cleanAuthor },
    ])
    setTitle('')
    setAuthor('')
    setFormMessage(`“${cleanTitle}” is on your shelf.`)
  }

  function removeBook(id: number) {
    setBooks((currentBooks) => currentBooks.filter((book) => book.id !== id))
    setFormMessage('Book removed from your shelf.')
  }

  return (
    <div className="page">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="The Reading Room home">
          <span className="brand-icon" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M5.5 8.5c4.1-.8 7.6.1 10.5 2.5v14c-2.9-2.4-6.4-3.3-10.5-2.5v-14ZM26.5 8.5c-4.1-.8-7.6.1-10.5 2.5v14c2.9-2.4 6.4-3.3 10.5-2.5v-14Z" />
              <path d="M8.5 12.5c2-.2 3.6.2 5 1M8.5 16c2-.2 3.6.2 5 1M23.5 12.5c-2-.2-3.6.2-5 1M23.5 16c-2-.2-3.6.2-5 1" />
            </svg>
          </span>
          <span>The Reading Room</span>
        </a>
        <div className="topbar-note"><span /> YOUR PERSONAL BOOK NOOK</div>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><span /> A LITTLE SPACE FOR BIG STORIES</p>
            <h1>Every book<br />has a <em>place.</em></h1>
            <p className="hero-description">
              Keep the stories you love close. Add a book to your shelf, find an old favourite,
              and make room for the next one.
            </p>
            <a href="#my-shelf" className="hero-link">Wander through your shelf <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-circle circle-back" />
            <div className="art-circle circle-front" />
            <div className="book-stack">
              <div className="stack-book stack-book-back"><span>THE<br />WILD<br />PLACES</span></div>
              <div className="stack-book stack-book-middle"><span>GROW<br />SLOW</span></div>
              <div className="stack-book stack-book-front"><span>THE<br />QUIET<br />HOUR</span><i>✳</i></div>
            </div>
            <span className="art-sparkle sparkle-one">✳</span>
            <span className="art-sparkle sparkle-two">✦</span>
            <span className="art-caption">a good story<br />is always in season</span>
          </div>
          <div className="hero-bottom">
            <span>COLLECTED WITH CARE</span><i /><span>READ AT YOUR OWN PACE</span><i /><span>ALWAYS ROOM FOR ONE MORE</span>
          </div>
        </section>

        <section className="content-grid">
          <div className="shelf-column" id="my-shelf">
            <div className="section-heading">
              <div>
                <p className="eyebrow-small">THE GOOD READS</p>
                <h2>Your bookshelf<span className="heading-period">.</span></h2>
              </div>
              <span className="book-count">{books.length} {books.length === 1 ? 'BOOK' : 'BOOKS'}</span>
            </div>

            <div className="shelf-toolbar">
              <label className="search-box">
                <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.8" cy="8.8" r="5.8" /><path d="m13.2 13.2 4 4" /></svg>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Find a title or author..."
                  aria-label="Search books by title or author"
                />
                <span className="search-shortcut">⌕</span>
              </label>
              <span className="sort-label"><span className="sort-dot" /> YOUR COLLECTION</span>
            </div>

            <List
              items={filteredBooks}
              getKey={(book) => book.id}
              emptyMessage={query ? 'No books match that search. Try another title or author.' : 'Your shelf is waiting for its first story.'}
              renderItem={(book, index) => (
                <article className="book-row">
                  <div className={`book-cover ${coverStyles[index % coverStyles.length]}`}>
                    <span className="cover-mark">{coverMarks[index % coverMarks.length]}</span>
                    <span className="cover-rule" />
                    <span className="cover-initials">
                      {book.title.split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase()}
                    </span>
                    <span className="cover-spine" />
                  </div>
                  <div className="book-details">
                    <span className="book-index">ON YOUR SHELF · {String(index + 1).padStart(2, '0')}</span>
                    <h3>{book.title}</h3>
                    <p>by {book.author}</p>
                  </div>
                  <button
                    className="remove-button"
                    type="button"
                    onClick={() => removeBook(book.id)}
                    aria-label={`Remove ${book.title} from your shelf`}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </article>
              )}
            />

            {books.length > 0 && (
              <p className="shelf-footer">
                <span className="footer-flower" aria-hidden="true">✿</span>
                {query ? `Showing ${filteredBooks.length} of ${books.length} books` : 'A shelf full of somewhere else'}
              </p>
            )}
          </div>

          <aside className="add-panel">
            <div className="add-panel-heading">
              <span className="add-icon" aria-hidden="true">＋</span>
              <p className="eyebrow-small">MAKE A LITTLE ROOM</p>
            </div>
            <h2>Add to<br />your shelf<span>.</span></h2>
            <p className="add-intro">Found a new favourite? Give it a home here.</p>

            <form className="book-form" onSubmit={addBook} noValidate>
              <label htmlFor="book-title">BOOK TITLE</label>
              <input
                id="book-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. The Secret Garden"
                maxLength={100}
              />
              <label htmlFor="book-author">AUTHOR</label>
              <input
                id="book-author"
                type="text"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                placeholder="e.g. Frances Hodgson Burnett"
                maxLength={80}
              />
              <button type="submit" className="add-button">
                <span>Add this book</span><span aria-hidden="true">↗</span>
              </button>
              <p className="form-message" aria-live="polite">{formMessage || 'A good book deserves a spot on the shelf.'}</p>
            </form>
            <div className="panel-decoration" aria-hidden="true">
              <span>❋</span>
              <i />
              <span>✦</span>
            </div>
          </aside>
        </section>

        <footer className="page-footer">
          <span>THE READING ROOM <i>·</i> A PLACE FOR STORIES</span>
          <a href="#home">Back to the top ↑</a>
        </footer>
      </main>
    </div>
  )
}

export default BookApp
