import { loadJSON, saveJSON } from '$lib/storage';

const STORAGE_KEY = 'recipe-finder:custom-areas';

const state = $state<{ items: string[] }>({
  items: loadJSON<string[]>(STORAGE_KEY, []),
});

function persist() {
  saveJSON(STORAGE_KEY, state.items);
}

export const customAreas = {
  get items() {
    return state.items;
  },
  add(area: string) {
    const trimmed = area.trim();
    if (!trimmed) return;
    const alreadyKnown = state.items.some((a) => a.toLowerCase() === trimmed.toLowerCase());
    if (alreadyKnown) return;
    state.items = [...state.items, trimmed].sort((a, b) => a.localeCompare(b));
    persist();
  },
};