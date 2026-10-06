import { Component } from 'react'
import countries from './countries.js'

export default class AutoCompletedText extends Component {
  state = {
    suggestions: [],
    text: '',
    activeIndex: -1,
    hasTyped: false,
  }

  handleChange = (event) => {
    const text = event.target.value
    const query = text.trim().toLocaleLowerCase()
    const suggestions = query
      ? countries
        .filter((country) => country.toLocaleLowerCase().includes(query))
        .slice(0, 8)
      : []

    this.setState({
      text,
      suggestions,
      activeIndex: -1,
      hasTyped: Boolean(query),
    })
  }

  handleSelect = (country) => {
    this.setState({
      text: country,
      suggestions: [],
      activeIndex: -1,
      hasTyped: false,
    })
  }

  handleClear = () => {
    this.setState({
      text: '',
      suggestions: [],
      activeIndex: -1,
      hasTyped: false,
    })
    this.inputRef?.focus()
  }

  handleKeyDown = (event) => {
    const { suggestions, activeIndex } = this.state

    if (event.key === 'ArrowDown' && suggestions.length > 0) {
      event.preventDefault()
      this.setState({ activeIndex: (activeIndex + 1) % suggestions.length })
    } else if (event.key === 'ArrowUp' && suggestions.length > 0) {
      event.preventDefault()
      this.setState({ activeIndex: activeIndex <= 0 ? suggestions.length - 1 : activeIndex - 1 })
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault()
      this.handleSelect(suggestions[activeIndex])
    } else if (event.key === 'Escape') {
      this.setState({ suggestions: [], activeIndex: -1 })
    }
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const { suggestions, activeIndex } = this.state
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      this.handleSelect(suggestions[activeIndex])
    }
  }

  render() {
    const { suggestions, text, activeIndex, hasTyped } = this.state
    const showEmptyState = hasTyped && suggestions.length === 0

    return (
      <form className="search-card" aria-label="Country autocomplete" onSubmit={this.handleSubmit}>
        <div className="card-topline">
          <span className="card-label"><span className="card-number">01</span> FIND YOUR PLACE</span>
          <span className="data-source"><span /> 195 COUNTRIES</span>
        </div>

        <label className="search-label" htmlFor="country-search">WHERE HAVE YOU BEEN THINKING ABOUT?</label>
        <div className={`search-box${suggestions.length ? ' search-box-open' : ''}`}>
          <span className="search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="10.8" cy="10.8" r="6.3" />
              <path d="m15.4 15.4 4.1 4.1" />
            </svg>
          </span>
          <input
            ref={(node) => { this.inputRef = node }}
            id="country-search"
            type="text"
            autoComplete="off"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={suggestions.length > 0}
            aria-controls="country-suggestions"
            aria-activedescendant={activeIndex >= 0 ? `country-option-${activeIndex}` : undefined}
            placeholder="Start typing a country…"
            value={text}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
          />
          {text && (
            <button className="clear-button" type="button" onClick={this.handleClear} aria-label="Clear search">
              <span aria-hidden="true">×</span>
            </button>
          )}
          <kbd className="keyboard-hint">ESC</kbd>
        </div>

        {suggestions.length > 0 && (
          <ul className="suggestion-list" id="country-suggestions" role="listbox" aria-label="Country suggestions">
            {suggestions.map((country, index) => (
              <li
                id={`country-option-${index}`}
                className={`suggestion-item${activeIndex === index ? ' suggestion-active' : ''}`}
                key={country}
                role="option"
                aria-selected={activeIndex === index}
              >
                <button type="button" onClick={() => this.handleSelect(country)} tabIndex={-1}>
                  <span className="country-marker" aria-hidden="true"><span /></span>
                  <span className="country-name">{this.highlightMatch(country)}</span>
                  <span className="suggestion-action">SELECT <i aria-hidden="true">↵</i></span>
                </button>
              </li>
            ))}
            <li className="suggestion-footer" aria-hidden="true">
              <span>↑↓ TO BROWSE</span><span>ENTER TO SELECT</span>
            </li>
          </ul>
        )}

        {showEmptyState && (
          <div className="empty-state" role="status">
            <span className="empty-mark" aria-hidden="true">?</span>
            <span>No countries found for <strong>“{text.trim()}”</strong>. Try another spelling.</span>
          </div>
        )}

        <div className={`selection-card${text && suggestions.length === 0 && !hasTyped ? ' selection-complete' : ''}`} aria-live="polite">
          {text && suggestions.length === 0 && !hasTyped ? (
            <>
              <span className="selection-marker" aria-hidden="true">✓</span>
              <div className="selection-copy">
                <span>YOUR PLACE, FOR NOW</span>
                <strong>{text}</strong>
              </div>
              <span className="selection-status">SELECTED</span>
            </>
          ) : (
            <>
              <span className="selection-placeholder-mark" aria-hidden="true">✳</span>
              <p>Your pick will appear here. No rush — the world can wait.</p>
            </>
          )}
        </div>

        <div className="search-footnote">
          <span>TIP <i>·</i> Search by any part of a country name</span>
          <span>MADE FOR CURIOUS MINDS <b>✳</b></span>
        </div>
      </form>
    )
  }

  highlightMatch(country) {
    const query = this.state.text.trim()
    const start = country.toLocaleLowerCase().indexOf(query.toLocaleLowerCase())
    if (!query || start === -1) return country

    return (
      <>
        {country.slice(0, start)}
        <mark>{country.slice(start, start + query.length)}</mark>
        {country.slice(start + query.length)}
      </>
    )
  }
}
