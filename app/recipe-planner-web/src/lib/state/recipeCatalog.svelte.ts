import { fetchInitialCatalog } from '$lib/data/recipeSource';
import { loadJSON, saveJSON } from '$lib/storage';
import type { Recipe } from "$lib/types"

const CACHE_KEY = 'catalog:v1';

function readCache(): Recipe[] | null {
    if (typeof localStorage === 'undefined') return null; // SSR guard
    try {
        return loadJSON(CACHE_KEY, null);
    } catch {
        return null;
    }
}

function writeCache(recipes: Recipe[]) {
    if (typeof localStorage === 'undefined') return;
    try {
        saveJSON(CACHE_KEY, JSON.stringify(recipes));
    } catch {
    }
}

class RecipeCatalog {
    recipes = $state<Recipe[]>([]);
    status = $state<'idle' | 'loading' | 'ready' | 'error'>('idle');
    error = $state<string | null>(null);

    async initialize(enableCaching: boolean = false) {
        if (this.status === 'ready' && !enableCaching) return;

        if (enableCaching) {
            const cached = readCache();
            if (cached && cached.length > 0) {
                this.recipes = cached;
                this.status = 'ready';
                return;
            }
        }

        this.status = 'loading';
        this.error = null;
        try {
            const recipes = await fetchInitialCatalog();
            this.recipes = recipes;
            writeCache(recipes);
            this.status = 'ready';
        } catch (err) {
            this.error = err instanceof Error ? err.message : 'Failed to load recipes.';
            this.status = 'error';
        }
    }

    refresh() {
        return this.initialize(true);
    }
}

export const recipeCatalog = new RecipeCatalog();