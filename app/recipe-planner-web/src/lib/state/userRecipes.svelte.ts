import { loadJSON, saveJSON } from '$lib/storage';
import type { Recipe } from '$lib/types';

const STORAGE_KEY = 'recipe-finder:user-recipes';

function makeId(): string {
  return `my-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const state = $state<{ items: Recipe[] }>({
  items: loadJSON<Recipe[]>(STORAGE_KEY, []),
});

function persist() {
  saveJSON(STORAGE_KEY, state.items);
}

export interface RecipeInput {
  id?: string;
  title: string;
  image: string;
  cuisine: string;
  category: string;
  ingredients: string[];
  instructions: string;
}

export const userRecipes = {
  get items() {
    return state.items;
  },
  getById(id: string): Recipe | undefined {
    return state.items.find((r) => r.id === id);
  },
  /** Basic server-side-of-truth validation, mirrors <recipe-form> client validation. */
  validate(input: RecipeInput): string[] {
    const errors: string[] = [];
    if (!input.title?.trim()) errors.push('Title is required.');
    if (!input.ingredients?.filter((i) => i.trim()).length) {
      errors.push('At least one ingredient is required.');
    }
    if (!input.instructions?.trim()) errors.push('Instructions are required.');
    return errors;
  },
  create(input: RecipeInput): Recipe {
    const errors = this.validate(input);
    if (errors.length) throw new Error(errors.join(' '));
    const recipe: Recipe = {
      id: makeId(),
      title: input.title.trim(),
      image: input.image?.trim() || 'https://placehold.co/400x300?text=Recipe',
      category: input.category.trim(),
      cuisine: input.cuisine.trim(),
      ingredients: input.ingredients.map((i) => i.trim()).filter(Boolean),
      instructions: input.instructions.trim(),
      source: 'user',
    };
    state.items = [...state.items, recipe];
    persist();
    return recipe;
  },
  update(id: string, input: RecipeInput): Recipe {
    const errors = this.validate(input);
    if (errors.length) throw new Error(errors.join(' '));
    const idx = state.items.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Recipe not found.');
    const updated: Recipe = {
      ...state.items[idx],
      title: input.title.trim(),
      image: input.image?.trim() || state.items[idx].image,
      category: input.category?.trim() || 'Uncategorized',
      cuisine: input.cuisine.trim(),
      ingredients: input.ingredients.map((i) => i.trim()).filter(Boolean),
      instructions: input.instructions.trim(),
    };
    state.items = state.items.map((r, i) => (i === idx ? updated : r));
    persist();
    return updated;
  },
  remove(id: string) {
    state.items = state.items.filter((r) => r.id !== id);
    persist();
  },
};
