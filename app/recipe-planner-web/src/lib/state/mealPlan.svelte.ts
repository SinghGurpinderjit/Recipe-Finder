import { loadJSON, saveJSON } from '$lib/storage';
import { WEEK_DAYS, MEAL_TIMES, type MealPlan, type MealPlanEntry, type MealTime, type DayPlan } from '$lib/types';

const STORAGE_KEY = 'recipe-finder:meal-plan';

function emptyDayPlan(): DayPlan {
  return { Breakfast: [], Lunch: [], Dinner: [] };
}

function emptyPlan(): MealPlan {
  return Object.fromEntries(WEEK_DAYS.map((d) => [d, emptyDayPlan()])) as MealPlan;
}

function isValidPlan(plan: unknown): plan is MealPlan {
  if (!plan || typeof plan !== 'object') return false;
  return WEEK_DAYS.every((day) => {
    const dayPlan = (plan as Record<string, unknown>)[day];
    return (
      dayPlan &&
      typeof dayPlan === 'object' &&
      !Array.isArray(dayPlan) &&
      MEAL_TIMES.every((mt) => Array.isArray((dayPlan as Record<string, unknown>)[mt]))
    );
  });
}

const loaded = loadJSON<MealPlan>(STORAGE_KEY, emptyPlan());

const state = $state<{ plan: MealPlan }>({
  plan: isValidPlan(loaded) ? loaded : emptyPlan(),
});

function persist() {
  saveJSON(STORAGE_KEY, state.plan);
}

export const mealPlan = {
  get plan() {
    return state.plan;
  },
  assign(day: string, mealTime: MealTime, entry: MealPlanEntry) {
    const dayPlan = state.plan[day] ?? emptyDayPlan();
    const current = dayPlan[mealTime] ?? [];
    // avoid duplicate assignment of the same recipe in the same slot
    if (current.some((m) => m.id === entry.id)) return;
    state.plan = {
      ...state.plan,
      [day]: { ...dayPlan, [mealTime]: [...current, entry] },
    };
    persist();
  },
  remove(day: string, mealTime: MealTime, mealId: string) {
    const dayPlan = state.plan[day] ?? emptyDayPlan();
    const current = dayPlan[mealTime] ?? [];
    state.plan = {
      ...state.plan,
      [day]: { ...dayPlan, [mealTime]: current.filter((m) => m.id !== mealId) },
    };
    persist();
  },
  clearDay(day: string) {
    state.plan = { ...state.plan, [day]: emptyDayPlan() };
    persist();
  },
  clearAll() {
    state.plan = emptyPlan();
    persist();
  },
};
