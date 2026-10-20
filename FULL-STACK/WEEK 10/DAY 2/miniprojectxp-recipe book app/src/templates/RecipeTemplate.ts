import type { RecipeItem } from '../model/RecipeItem';

export class RecipeTemplate {
  constructor(private readonly container: HTMLElement) {}

  render(recipes: readonly RecipeItem[]): void {
    this.container.replaceChildren();

    if (recipes.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty-state';
      empty.textContent = 'Your recipe book is empty. Add your first recipe above.';
      this.container.append(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    recipes.forEach((recipe) => fragment.append(this.createCard(recipe)));
    this.container.append(fragment);
  }

  private createCard(recipe: RecipeItem): HTMLElement {
    const card = document.createElement('article');
    card.className = 'recipe-card';
    card.dataset.recipeId = recipe.id;

    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';

    const title = document.createElement('h3');
    title.textContent = recipe.title;
    cardHeader.append(title);

    if (recipe.isFavorite) {
      const badge = document.createElement('span');
      badge.className = 'favorite-badge';
      badge.textContent = 'Favorite';
      cardHeader.append(badge);
    }

    const details = document.createElement('details');
    details.className = 'recipe-details';

    const summary = document.createElement('summary');
    summary.textContent = 'View recipe';
    details.append(summary);

    const ingredientsHeading = document.createElement('h4');
    ingredientsHeading.textContent = 'Ingredients';
    details.append(ingredientsHeading);

    const ingredientsList = document.createElement('ul');
    recipe.ingredients.forEach((ingredient) => {
      const listItem = document.createElement('li');
      listItem.textContent = ingredient;
      ingredientsList.append(listItem);
    });
    details.append(ingredientsList);

    const instructionsHeading = document.createElement('h4');
    instructionsHeading.textContent = 'Instructions';
    details.append(instructionsHeading);

    const instructions = document.createElement('p');
    instructions.className = 'instructions';
    instructions.textContent = recipe.instructions;
    details.append(instructions);

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const favoriteButton = document.createElement('button');
    favoriteButton.type = 'button';
    favoriteButton.className = 'secondary-button';
    favoriteButton.dataset.action = 'favorite';
    favoriteButton.textContent = recipe.isFavorite ? 'Remove favorite' : 'Mark favorite';
    favoriteButton.setAttribute(
      'aria-label',
      `${recipe.isFavorite ? 'Remove' : 'Mark'} ${recipe.title} ${recipe.isFavorite ? 'from' : 'as'} favorites`
    );

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button';
    deleteButton.dataset.action = 'delete';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('aria-label', `Delete ${recipe.title}`);

    actions.append(favoriteButton, deleteButton);
    card.append(cardHeader, details, actions);
    return card;
  }
}
