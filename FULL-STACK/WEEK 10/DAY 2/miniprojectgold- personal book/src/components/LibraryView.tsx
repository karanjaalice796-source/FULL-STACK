import { useRef, useState, type ChangeEvent } from 'react';
import { importBooks, isBook } from '../app/booksSlice';
import { useAppDispatch, useAppSelector } from '../app/store';
import { useBooks } from '../hooks/useBooks';
import type { BookFilter, BookSort } from '../app/booksSlice';
import { BookCard } from './BookCard';
import { BookForm } from './BookForm';

const filters: { value: BookFilter; label: string }[] = [
  { value: 'all', label: 'All books' },
  { value: 'to-read', label: 'Want to read' },
  { value: 'reading', label: 'Reading' },
  { value: 'read', label: 'Finished' },
];

export function LibraryView() {
  const library = useBooks();
  const dispatch = useAppDispatch();
  const persistenceError = useAppSelector((state) => state.books.persistenceError);
  const importInput = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState('');
  const progress = library.stats.total
    ? Math.round((library.stats.read / library.stats.total) * 100)
    : 0;

  function handleExport() {
    const blob = new Blob([JSON.stringify(library.books, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'page-and-pine-library.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!Array.isArray(parsed) || !parsed.every(isBook)) {
        throw new Error('The selected file is not a valid library export.');
      }
      dispatch(importBooks(parsed));
      setImportError('');
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Could not import that file.');
    }
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Page and Pine home">
          <span className="brand-mark" aria-hidden="true">P<span>&amp;</span>P</span>
          <span className="brand-name">page <i>&amp;</i> pine</span>
        </a>
        <div className="topbar-actions">
          <button className="button button-light" onClick={handleExport} type="button">Export library <span aria-hidden="true">↗</span></button>
          <button className="button button-light" onClick={() => importInput.current?.click()} type="button">Import</button>
          <input ref={importInput} className="visually-hidden" type="file" accept="application/json,.json" onChange={handleImport} />
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">A LITTLE SPACE FOR BIG STORIES</p>
          <h1>Your next chapter<br />starts <em>here.</em></h1>
          <p className="hero-description">This is your quiet corner for books you’ve finished, stories you’re halfway through, and the ones you can’t wait to start. We’ve added recent 2025–26 releases to help you settle in—keep them or make the shelf your own.</p>
        </div>
        <div className="hero-art" role="group" aria-label="Featured recent books">
          <div className="sun-disc" />
          <img
            className="hero-cover hero-cover-one"
            src="https://covers.openlibrary.org/b/isbn/9780593441299-L.jpg?default=false"
            alt="Cover of Great Big Beautiful Life by Emily Henry"
          />
          <img
            className="hero-cover hero-cover-two"
            src="https://covers.openlibrary.org/b/isbn/9781649374189-L.jpg?default=false"
            alt="Cover of Onyx Storm by Rebecca Yarros"
          />
          <img
            className="hero-cover hero-cover-three"
            src="https://covers.openlibrary.org/b/isbn/9780593158715-L.jpg?default=false"
            alt="Cover of Atmosphere by Taylor Jenkins Reid"
          />
          <span className="art-spark spark-one">✳</span>
          <span className="art-spark spark-two">✧</span>
        </div>
      </section>

      <section className="stats-row" aria-label="Reading statistics">
        <div className="stat-card">
          <span className="stat-icon stat-icon-ink" aria-hidden="true">▤</span>
          <div><strong>{library.stats.total}</strong><span>In your library</span></div>
        </div>
        <div className="stat-card">
          <span className="stat-icon stat-icon-green" aria-hidden="true">✓</span>
          <div><strong>{library.stats.read}</strong><span>Books finished</span></div>
        </div>
        <div className="stat-card progress-stat">
          <div className="progress-copy"><strong>{progress}%</strong><span>Reading journey</span></div>
          <div className="progress-track" role="progressbar" aria-label="Reading journey complete" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <span style={{ width: `${progress}%` }} />
          </div>
          <small>{library.stats.read} of {library.stats.total} finished</small>
        </div>
      </section>

      {(persistenceError || importError) && (
        <p className="notice" role="alert">{persistenceError ?? importError}</p>
      )}

      <div className="library-layout">
        <aside className="sidebar">
          <BookForm onAdd={library.add} />
          <div className="category-panel">
            <div className="sidebar-title"><h2>Collections</h2><span>{library.categories.length}</span></div>
            <button className={`category-choice ${library.category === 'all' ? 'selected' : ''}`} onClick={() => library.updateCategory('all')} type="button">
              <span className="category-emoji">✦</span><span>All categories</span><b>{library.stats.total}</b>
            </button>
            {library.categories.map((category, index) => (
              <button className={`category-choice ${library.category === category ? 'selected' : ''}`} onClick={() => library.updateCategory(category)} type="button" key={category}>
                <span className={`category-emoji category-color-${index % 5}`}>◈</span><span>{category}</span>
                <b>{library.books.filter((book) => book.category === category).length}</b>
              </button>
            ))}
            {library.categories.length === 0 && <p className="category-hint">Your categories appear here as you add books.</p>}
          </div>
        </aside>

        <section className="library-content" aria-labelledby="libraryHeading">
          <div className="library-heading">
            <div>
              <p className="eyebrow">THE PERSONAL LIBRARY</p>
              <h2 id="libraryHeading">Your bookshelf <span>{library.visibleBooks.length}</span></h2>
            </div>
            <label className="sort-control">
              <span>Sort:</span>
              <select value={library.sort} onChange={(event) => library.updateSort(event.target.value as BookSort)}>
                <option value="date">Recently added</option>
                <option value="title">Title</option>
                <option value="author">Author</option>
              </select>
              <button className="sort-direction" type="button" aria-label={`Sort ${library.sortDirection === 'asc' ? 'descending' : 'ascending'}`} onClick={() => library.updateSort(library.sort)}>
                {library.sortDirection === 'asc' ? '↑' : '↓'}
              </button>
            </label>
          </div>

          <div className="library-controls">
            <div className="filter-tabs" role="group" aria-label="Filter by reading status">
              {filters.map((item) => (
                <button
                  className={`filter-tab ${library.filter === item.value ? 'active' : ''}`}
                  onClick={() => library.updateFilter(item.value)}
                  type="button"
                  key={item.value}
                >
                  {item.label}
                  {item.value === 'all' && <span>{library.stats.total}</span>}
                </button>
              ))}
            </div>
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <span className="visually-hidden">Search books</span>
              <input value={library.search} onChange={(event) => library.updateSearch(event.target.value)} placeholder="Search title or author" />
              {library.search && <button type="button" aria-label="Clear search" onClick={() => library.updateSearch('')}>×</button>}
            </label>
          </div>

          {library.visibleBooks.length > 0 ? (
            <div className="book-grid">
              {library.visibleBooks.map((book) => (
                <BookCard book={book} onRemove={library.remove} onStatusChange={library.updateStatus} key={book.id} />
              ))}
            </div>
          ) : (
            <div className="empty-library">
              <span aria-hidden="true">✧</span>
              <h3>{library.books.length ? 'No books match those filters' : 'Your bookshelf is waiting'}</h3>
              <p>{library.books.length ? 'Try a different search or select another collection.' : 'Add your first book and start building a reading list that feels like you.'}</p>
            </div>
          )}
        </section>
      </div>

      <footer className="footer"><span>Made for the love of a good story.</span><span>PAGE &amp; PINE · YOUR READING LIFE, GENTLY ORGANIZED</span></footer>
    </main>
  );
}
