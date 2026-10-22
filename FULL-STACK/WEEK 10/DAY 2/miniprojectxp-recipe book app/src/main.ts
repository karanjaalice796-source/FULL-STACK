import { RecipeCollection } from './model/RecipeCollection';
import { RecipeItem } from './model/RecipeItem';
import { RecipeTemplate } from './templates/RecipeTemplate';
import './style.css';

const form = document.querySelector<HTMLFormElement>('#recipeEntryForm');
const titleInput = document.querySelector<HTMLInputElement>('#recipeTitle');
const ingredientsInput = document.querySelector<HTMLTextAreaElement>('#ingredients');
const instructionsInput = document.querySelector<HTMLTextAreaElement>('#instructions');
const recipeContainer = document.querySelector<HTMLDivElement>('#recipeContainer');
const clearButton = document.querySelector<HTMLButtonElement>('#clearRecipesButton');
const statusMessage = document.querySelector<HTMLParagraphElement>('#statusMessage');

if (
  !form ||
  !titleInput ||
  !ingredientsInput ||
  !instructionsInput ||
  !recipeContainer ||
  !clearButton ||
  !statusMessage
) {
  throw new Error('The recipe book page is missing a required element.');
}

const collection = new RecipeCollection();
const template = new RecipeTemplate(recipeContainer);
const statusElement = statusMessage;

function setStatus(message: string, isError = false): void {
  statusElement.textContent = message;
  statusElement.classList.toggle('is-error', isError);
}

function renderRecipes(): void {
  template.render(collection.getAll());
}

try {
  collection.load();
} catch (error) {
  setStatus(
    error instanceof Error ? error.message : 'Recipes could not be loaded from browser storage.',
    true
  );
}
renderRecipes();

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const ingredients = ingredientsInput.value
    .split('\n')
    .map((ingredient) => ingredient.trim())
    .filter(Boolean);
  const instructions = instructionsInput.value.trim();

  if (!title || ingredients.length === 0 || !instructions) {
    setStatus('Please enter a title, at least one ingredient, and the instructions.', true);
    return;
  }

  try {
    collection.add(new RecipeItem(title, ingredients, instructions));
    renderRecipes();
    form.reset();
    setStatus(`“${title}” was added to your recipe book.`);
  } catch (error) {
    setStatus(
      error instanceof Error ? `Recipe could not be saved: ${error.message}` : 'Recipe could not be saved.',
      true
    );
  }
});

recipeContainer.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const button = target.closest<HTMLButtonElement>('button[data-action]');
  const card = button?.closest<HTMLElement>('[data-recipe-id]');
  const recipeId = card?.dataset.recipeId;
  const action = button?.dataset.action;
  if (!recipeId || !action) return;

  try {
    if (action === 'favorite') {
      const isFavorite = collection.toggleFavorite(recipeId);
      if (isFavorite === null) return;

      const recipe = collection.getAll().find((item) => item.id === recipeId);
      renderRecipes();
      setStatus(
        recipe
          ? `“${recipe.title}” ${isFavorite ? 'added to' : 'removed from'} favorites.`
          : 'Favorite status updated.'
      );
    } else if (action === 'delete') {
      const title = collection.getAll().find((item) => item.id === recipeId)?.title;
      if (collection.remove(recipeId)) {
        renderRecipes();
        setStatus(title ? `“${title}” was deleted.` : 'Recipe deleted.');
      }
    }
  } catch (error) {
    setStatus(
      error instanceof Error ? `Your change could not be saved: ${error.message}` : 'Your change could not be saved.',
      true
    );
    renderRecipes();
  }
});

clearButton.addEventListener('click', () => {
  if (collection.getAll().length === 0) {
    setStatus('Your recipe book is already empty.');
    return;
  }

  if (!window.confirm('Delete all recipes from your recipe book?')) return;

  try {
    collection.clear();
    renderRecipes();
    setStatus('All recipes were deleted.');
  } catch (error) {
    setStatus(
      error instanceof Error ? `Recipes could not be cleared: ${error.message}` : 'Recipes could not be cleared.',
      true
    );
  }
});
