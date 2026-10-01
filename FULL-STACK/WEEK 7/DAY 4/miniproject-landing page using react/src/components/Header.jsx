import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faBars, faXmark } from '@fortawesome/free-solid-svg-icons'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="site-header" id="top">
      <nav className="container header-inner" aria-label="Main navigation">
        <a className="brand" href="#top" onClick={closeMenu}>
          morrow<span>®</span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
        </button>
        <div className={`header-links${menuOpen ? ' is-open' : ''}`}>
          <a href="#services" onClick={closeMenu}>What we do</a>
          <a href="#contact" onClick={closeMenu}>Studio notes</a>
          <a className="header-contact" href="#contact" onClick={closeMenu}>
            Start a conversation
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" />
          </a>
        </div>
      </nav>
    </header>
  )
}

export default Header