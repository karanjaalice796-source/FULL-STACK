import { useState, type FormEvent } from 'react';
import { DataFetcher } from './components/DataFetcher';
import type { Recipe, RecipeSearchResponse } from './types/types';
import './App.css';

function isRecipe(value: unknown): value is Recipe {
  if (typeof value !== 'object' || value === null) return false;

  const recipe = value as Record<string, unknown>;
  return (
    typeof recipe.id === 'number' &&
    typeof recipe.title === 'string' &&
    typeof recipe.image === 'string'
  );
}

function isRecipeSearchResponse(value: unknown): value is RecipeSearchResponse {
  if (typeof value !== 'object' || value === null) return false;

  const response = value as Record<string, unknown>;
  return (
    Array.isArray(response.results) &&
    response.results.every(isRecipe) &&
    typeof response.offset === 'number' &&
    typeof response.number === 'number' &&
    typeof response.totalResults === 'number'
  );
}

function App() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const searchTerm = input.trim();
    if (searchTerm) setQuery(searchTerm);
  }

  return (
    <main className="app">
      <header className="app-header">
        <p className="eyebrow">SPOONACULAR RECIPE SEARCH</p>
        <h1>Find something delicious.</h1>
        <p className="intro">Search recipes by ingredient, dish, or craving.</p>
      </header>

      <form className="search-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="recipe-query">Search recipes</label>
        <input
          id="recipe-query"
          type="search"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Try pasta, avocado, or soup"
          required
        />
        <button type="submit">Search recipes</button>
      </form>

      {query ? (
        <section aria-label={`Recipes for ${query}`}>
          <h2 className="results-heading">Results for “{query}”</h2>
          <DataFetcher<RecipeSearchResponse>
            cacheKey={`recipe-search:${query.toLowerCase()}`}
            endpoint="/recipes/complexSearch"
            params={{ query, number: 12 }}
            isData={isRecipeSearchResponse}
            renderData={(response) =>
              response.results.length > 0 ? (
                <>
                  <ul className="recipe-list">
                    {response.results.map((recipe) => (
                      <li className="recipe-card" key={recipe.id}>
                        <img src={recipe.image} alt="" loading="lazy" />
                        <h3>{recipe.title}</h3>
                      </li>
                    ))}
                  </ul>
                  <p className="result-count">
                    Showing {response.results.length} of {response.totalResults} recipes
                  </p>
                </>
              ) : (
                <p className="message">No recipes found. Try another search.</p>
              )
            }
          />
        </section>
      ) : (
        <p className="message empty-state">Enter a search term to get started.</p>
      )}
    </main>
  );
}

export default App;
