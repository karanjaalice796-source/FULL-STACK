import { RecipeItem, type RecipeData } from './RecipeItem';

const STORAGE_KEY = 'recipe-book-recipes';

function isRecipeData(value: unknown): value is RecipeData {
  if (typeof value !== 'object' || value === null) return false;

  const recipe = value as Record<string, unknown>;
  return (
    typeof recipe.id === 'string' &&
    typeof recipe.title === 'string' &&
    Array.isArray(recipe.ingredients) &&
    recipe.ingredients.every((ingredient) => typeof ingredient === 'string') &&
    typeof recipe.instructions === 'string' &&
    typeof recipe.isFavorite === 'boolean'
  );
}

export class RecipeCollection {
  private recipes: RecipeItem[] = [];

  getAll(): readonly RecipeItem[] {
    return this.recipes;
  }

  add(recipe: RecipeItem): void {
    this.recipes.unshift(recipe);
    try {
      this.save();
    } catch (error) {
      this.recipes.shift();
      throw error;
    }
  }

  remove(id: string): boolean {
    const recipeIndex = this.recipes.findIndex((recipe) => recipe.id === id);
    if (recipeIndex === -1) return false;

    const [recipe] = this.recipes.splice(recipeIndex, 1);
    try {
      this.save();
    } catch (error) {
      this.recipes.splice(recipeIndex, 0, recipe);
      throw error;
    }
    return true;
  }

  toggleFavorite(id: string): boolean | null {
    const recipe = this.recipes.find((item) => item.id === id);
    if (!recipe) return null;

    recipe.isFavorite = !recipe.isFavorite;
    try {
      this.save();
    } catch (error) {
      recipe.isFavorite = !recipe.isFavorite;
      throw error;
    }
    return recipe.isFavorite;
  }

  clear(): void {
    const previousRecipes = this.recipes;
    this.recipes = [];
    try {
      this.save();
    } catch (error) {
      this.recipes = previousRecipes;
      throw error;
    }
  }

  load(): void {
    const storedRecipes = localStorage.getItem(STORAGE_KEY);
    if (storedRecipes === null) {
      this.recipes = [];
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(storedRecipes);
    } catch {
      throw new Error('Saved recipes could not be read. Clear the browser storage and reload.');
    }

    if (!Array.isArray(parsed) || !parsed.every(isRecipeData)) {
      throw new Error('Saved recipes have an invalid format and could not be loaded.');
    }

    this.recipes = parsed.map(RecipeItem.fromData);
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.recipes));
  }
}
