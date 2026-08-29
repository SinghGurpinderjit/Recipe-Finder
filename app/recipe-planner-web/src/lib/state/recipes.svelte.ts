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
    filterByCuisine(cuisine: string): Recipe[] {
        const q = cuisine.trim().toLowerCase();

        if (!q) return this.items;

        return this.items.filter((r) =>
            r.cuisine?.toLowerCase().includes(q)
        );
    },
    filter(
        query: string,
        category: string,
        cuisine: string
    ): Recipe[] {
        const searchQuery = query.trim().toLowerCase();
        const cuisineQuery = cuisine.trim().toLowerCase();
        const categoryQuery = category.trim().toLowerCase();

        return this.items.filter((r) => {
            const matchesQuery =
                !searchQuery ||
                r.title.toLowerCase().includes(searchQuery);

            const matchesCategory =
                !categoryQuery ||
                r.category?.toLowerCase() === categoryQuery;

            const matchesCuisine =
                !cuisineQuery ||
                r.cuisine?.toLowerCase().includes(cuisineQuery);

            return (
                matchesQuery &&
                matchesCategory &&
                matchesCuisine
            );
        });
    }
};