import type { Recipe } from '$lib/types';

const API_BASE = 'https://www.themealdb.com/api/json/v1/1';

const SEED_LETTERS = ['a', 'b', 'c', 'p', 's'] as const;

export interface RecipeDetail extends Recipe {
  ingredients: string[]; 
  instructions: string;
}

interface MealDbMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  [key: `strIngredient${number}`]: string | undefined;
  [key: `strMeasure${number}`]: string | undefined;
}

function mapMeal(meal: MealDbMeal): Recipe {
  return {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory,
    cuisine: meal.strArea,
    source: 'api',
  };
}

function extractIngredients(meal: MealDbMeal): string[] {
  const out: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (name && name.trim()) {
      out.push(measure && measure.trim() ? `${measure.trim()} ${name.trim()}` : name.trim());
    }
  }
  return out;
}

function mapMealDetail(meal: MealDbMeal): RecipeDetail {
  return {
    ...mapMeal(meal),
    instructions: meal.strInstructions ?? '',
    ingredients: extractIngredients(meal),
  };
}

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Recipe API request failed (${res.status})`);
  }
  return res.json();
}

/** Fetch all meals whose name starts with a given letter (deterministic). */
export async function fetchRecipesByLetter(letter: string): Promise<Recipe[]> {
  const data = await fetchJson(`${API_BASE}/search.php?f=${letter}`);
  const meals: MealDbMeal[] = data.meals ?? [];
  return meals.map(mapMeal);
}

/**
 * Builds the initial browse catalog from a fixed set of letter searches,
 * de-duplicated. Deterministic: calling this twice returns the same
 * recipes in the same order every time, which is what makes it safe to
 * cache in recipeCatalog.svelte.ts.
 */
export async function fetchInitialCatalog(): Promise<Recipe[]> {
  const results = await Promise.all(SEED_LETTERS.map(fetchRecipesByLetter));
  const merged = results.flat();

  const seen = new Set<string>();
  return merged.filter((recipe) => {
    if (seen.has(recipe.id)) return false;
    seen.add(recipe.id);
    return true;
  });
}

/** Free-text search, used by the search bar. */
export async function searchRecipesByName(query: string): Promise<Recipe[]> {
  const data = await fetchJson(`${API_BASE}/search.php?s=${encodeURIComponent(query)}`);
  const meals: MealDbMeal[] = data.meals ?? [];
  return meals.map(mapMeal);
}

/** Full recipe detail (ingredients + instructions) for the detail page. */
export async function fetchRecipeById(id: string): Promise<RecipeDetail | null> {
  const data = await fetchJson(`${API_BASE}/lookup.php?i=${encodeURIComponent(id)}`);
  const meal: MealDbMeal | undefined = data.meals?.[0];
  return meal ? mapMealDetail(meal) : null;
}

/** All available categories, for the filter UI. */
export async function fetchCategories(): Promise<string[]> {
  const data = await fetchJson(`${API_BASE}/list.php?c=list`);
  return (data.meals ?? []).map((m: { strCategory: string }) => m.strCategory);
}

/** All available areas/cuisines, for the filter UI. */
export async function fetchAreas(): Promise<string[]> {
  const data = await fetchJson(`${API_BASE}/list.php?a=list`);
  return (data.meals ?? []).map((m: { strArea: string }) => m.strArea); // was strCategory — bug fix
}

/** All recipes belonging to a given area/cuisine (summary fields only). */
export async function fetchRecipesByArea(area: string): Promise<Recipe[]> {
  const data = await fetchJson(`${API_BASE}/filter.php?a=${encodeURIComponent(area)}`);
  const meals: MealDbMeal[] = data.meals ?? [];
  return meals.map(mapMeal);
}
