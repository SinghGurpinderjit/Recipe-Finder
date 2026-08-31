export interface Recipe {
  id: string;
  title: string;
  image: string;
  category?: string;
  cuisine?: string;
  ingredients?: string[];
  instructions?: string;
  source: 'api' | 'user';
}

export interface MealPlanEntry {
  recipeId: string;
  title: string;
  image?: string;
}

export const MEAL_TIMES = ['Breakfast', 'Lunch', 'Dinner'] as const;

export type MealTime = (typeof MEAL_TIMES)[number];

export type DayPlan = Record<MealTime, MealPlanEntry[]>;

export type MealPlan = Record<string, DayPlan>;

export const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

