import type { Recipe } from '$lib/types';

// TheMealDB free test API key ("1") — no signup required, generous limits.
const BASE = 'https://www.themealdb.com/api/json/v1/1';

interface RawMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  [key: string]: string | undefined;
}

function extractIngredients(meal: RawMeal): string[] {
  const out: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      out.push(measure && measure.trim() ? `${measure.trim()} ${ing.trim()}` : ing.trim());
    }
  }
  return out;
}

function toRecipe(meal: RawMeal): Recipe {
  return {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory ?? '',
    area: meal.strArea ?? '',
    ingredients: extractIngredients(meal),
    instructions: meal.strInstructions ?? '',
    source: 'api',
  };
}

async function safeFetch(url: string): Promise<any> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  if (!query.trim()) return browseRandomSelection();
  const data = await safeFetch(`${BASE}/search.php?s=${encodeURIComponent(query)}`);
  return (data.meals ?? []).map(toRecipe);
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const data = await safeFetch(`${BASE}/lookup.php?i=${encodeURIComponent(id)}`);
  const meal = data.meals?.[0];
  return meal ? toRecipe(meal) : null;
}

export async function filterByCategory(category: string): Promise<Recipe[]> {
  if (!category) return browseRandomSelection();
  const data = await safeFetch(`${BASE}/filter.php?c=${encodeURIComponent(category)}`);
  return (data.meals ?? []).map((m: RawMeal) => ({
    id: m.idMeal,
    title: m.strMeal,
    image: m.strMealThumb,
    category,
    ingredients: [],
    instructions: '',
    source: 'api' as const,
  }));
}

export async function listCategories(): Promise<string[]> {
  const data = await safeFetch(`${BASE}/list.php?c=list`);
  return (data.meals ?? []).map((m: { strCategory: string }) => m.strCategory);
}

/** Used as a default "browse" view when there's no search/filter active. */
export async function browseRandomSelection(): Promise<Recipe[]> {
  // TheMealDB has no "list all" endpoint, so pull several randoms in parallel
  // to populate the initial browse grid.
  const calls = Array.from({ length: 8 }, () => safeFetch(`${BASE}/random.php`));
  const results = await Promise.all(calls);
  const seen = new Set<string>();
  const meals: Recipe[] = [];
  for (const r of results) {
    const m = r.meals?.[0];
    if (m && !seen.has(m.idMeal)) {
      seen.add(m.idMeal);
      meals.push(toRecipe(m));
    }
  }
  return meals;
}
