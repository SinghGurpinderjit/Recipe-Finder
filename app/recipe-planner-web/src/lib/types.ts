export interface Recipe {
  id: string;
  title: string;
  image: string;
  category: string;
  area?: string;
  ingredients: string[];
  instructions: string;
  source: 'api' | 'user' | 'seed';
}

export interface MealPlanEntry {
  id: string; // recipe id
  title: string;
  image?: string;
}

export interface Recipe {
  id: string;
  title: string;
  image: string;
  category: string;
  area?: string;
  ingredients: string[];
  instructions: string;
  source: 'api' | 'user' | 'seed';
}

export interface MealPlanEntry {
  id: string; // recipe id
  title: string;
  image?: string;
}

export const MEAL_TIMES = ['Breakfast', 'Lunch', 'Dinner'] as const;

export type MealTime = (typeof MEAL_TIMES)[number];

export type DayPlan = Record<MealTime, MealPlanEntry[]>;

export type MealPlan = Record<string, DayPlan>;

export const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

