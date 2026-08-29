import { loadJSON, saveJSON } from '$lib/storage';

const STORAGE_KEY = 'recipe-finder:custom-categories';

const state = $state<{ items: string[] }>({
  items: loadJSON<string[]>(STORAGE_KEY, []),
});

function persist() {
  saveJSON(STORAGE_KEY, state.items);
}

export const customCategories = {
  get items() {
    return state.items;
  },
  add(category: string) {
    const trimmed = category.trim();
    if (!trimmed) return;
    const alreadyKnown = state.items.some((c) => c.toLowerCase() === trimmed.toLowerCase());
    if (alreadyKnown) return;
    state.items = [...state.items, trimmed].sort((a, b) => a.localeCompare(b));
    persist();
  },
};