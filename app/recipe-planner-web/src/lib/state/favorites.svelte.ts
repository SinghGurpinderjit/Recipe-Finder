import { loadJSON, saveJSON } from '$lib/storage';
import type { Recipe } from '$lib/types';

const STORAGE_KEY = 'recipe-finder:favorites';

// Store full recipe snapshots (not just ids) so the Favorites page can
// render without needing to re-fetch from the API.
const state = $state<{ items: Recipe[] }>({
  items: loadJSON<Recipe[]>(STORAGE_KEY, []),
});

function persist() {
  saveJSON(STORAGE_KEY, state.items);
}

export const favorites = {
  get items() {
    return state.items;
  },
  isFavorite(id: string): boolean {
    return state.items.some((r) => r.id === id);
  },
  add(recipe: Recipe) {
    if (this.isFavorite(recipe.id)) return;
    state.items = [...state.items, recipe];
    persist();
  },
  remove(id: string) {
    state.items = state.items.filter((r) => r.id !== id);
    persist();
  },
  toggle(recipe: Recipe) {
    if (this.isFavorite(recipe.id)) {
      this.remove(recipe.id);
    } else {
      this.add(recipe);
    }
  },
};
