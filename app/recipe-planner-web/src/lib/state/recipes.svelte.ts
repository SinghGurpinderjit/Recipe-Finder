import { seedRecipes } from '$lib/data/seed-recipes';
import { userRecipes } from '$lib/state/userRecipes.svelte';
import type { Recipe } from '$lib/types';

// Central recipe store: seed (predefined) recipes + anything the user has
// created locally, combined into one browsable list. No external API calls.
export const recipes = {
    get items(): Recipe[] {
        return [...userRecipes.items, ...seedRecipes];
    },
    getById(id: string): Recipe | undefined {
        // return this.items.find((r) => r.id === id);
        const found = this.items.find((r) => r.id === id);
        return found ? $state.snapshot(found) : undefined;
    },
    get categories(): string[] {
        return [...new Set(this.items.map((r) => r.category).filter(Boolean))].sort();
    },
    search(query: string): Recipe[] {
        const q = query.trim().toLowerCase();
        if (!q) return this.items;
        return this.items.filter((r) => r.title.toLowerCase().includes(q));
    },
    filterByCategory(category: string): Recipe[] {
        if (!category) return this.items;
        return this.items.filter((r) => r.category === category);
    },
};