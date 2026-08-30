<script lang="ts">
  import { mealPlan } from "$lib/state/mealPlan.svelte";
  import { toasts } from "$lib/state/toast.svelte";
  import { WEEK_DAYS, MEAL_TIMES, type MealTime } from "$lib/types";
  import { recipes } from "$lib/state/recipes.svelte";

  let showPicker = $state(false);
  let pickerDay = $state<string>("");
  let pickerMealTime = $state<MealTime>("Breakfast");
  let query = $state<string>("");

  // all recipes available to pick from
  let pickable = $derived(recipes.filter(query, "", ""));

  function openPicker(day: string, mealTime: MealTime) {
    pickerDay = day;
    query = "";
    pickerMealTime = mealTime;
    showPicker = true;
  }

  function assign(recipeId: string) {
    const recipe = pickable.find((r) => r.id === recipeId);
    if (!recipe) return;
    mealPlan.assign(pickerDay, pickerMealTime, {
      recipeId: recipe.id,
      title: recipe.title,
      image: recipe.image,
    });
    toasts.show(
      `Added "${recipe.title}" to ${pickerMealTime} on ${pickerDay}`,
      "success",
    );

    // showPicker = false;
  }

  function onRemoveMeal(
    day: string,
    mealTime: MealTime,
    e: CustomEvent<{ mealId: string }>,
  ) {
    mealPlan.remove(day, mealTime, e.detail.mealId);
  }

  function clearDay(day: string) {
    const dayPlan = mealPlan.plan[day];
    const hasAny = dayPlan && MEAL_TIMES.some((mt) => dayPlan[mt]?.length);
    if (!hasAny) return;
    if (!confirm(`Clear all meals planned for ${day}?`)) return;
    mealPlan.clearDay(day);
    toasts.show(`Cleared ${day}`, "info");
  }
  // ----- Today highlighting + real calendar dates for the current week -----
  const JS_DAY_TO_INDEX = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]; 
  const today = new Date();
  const todayLabel = JS_DAY_TO_INDEX[today.getDay()];
  const todayIndexInWeek = (today.getDay() + 6) % 7; // convert to Mon=0..Sun=6, matching WEEK_DAYS order
  const monday = new Date(today);
  monday.setDate(today.getDate() - todayIndexInWeek);

  function dateForDay(dayLabel: string): Date {
    const i = WEEK_DAYS.indexOf(dayLabel as (typeof WEEK_DAYS)[number]);
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  }

  function formatDate(d: Date): string {
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  export function onNativeClick(
    node: HTMLElement,
    handler: (event: MouseEvent) => void,
  ) {
    node.addEventListener("click", handler);

    return {
      update(newHandler: (event: MouseEvent) => void) {
        node.removeEventListener("click", handler);
        handler = newHandler;
        node.addEventListener("click", handler);
      },

      destroy() {
        node.removeEventListener("click", handler);
      },
    };
  }
</script>

<svelte:head>
  <title>Meal Planner — Recipe Finder</title>
</svelte:head>

<h1>Weekly Meal Plan</h1>
<p class="subtitle">
  Assign recipes to each day. Pick from your favorites or your own created
  recipes.
</p>

<div class="week">
  {#each WEEK_DAYS as day}
    <div class="day-wrap">
      <div class={{ "day-header": true, today: day === todayLabel }}>
        <span class="day-name">{day}</span>
        {#if day === todayLabel}
          <span class="today-badge">Today</span>
        {/if}
        <span class="day-date">{formatDate(dateForDay(day))}</span>
      </div>

      {#each MEAL_TIMES as mealTime}
        <meal-plan-day
          day={mealTime}
          meals={mealPlan.plan[day]?.[mealTime] ?? []}
          onassignMeal={() => openPicker(day, mealTime)}
          onremoveMeal={(e: CustomEvent<{ mealId: string }>) =>
            onRemoveMeal(day, mealTime, e)}
        ></meal-plan-day>
      {/each}

      {#if MEAL_TIMES.some((mt) => mealPlan.plan[day]?.[mt]?.length)}
        <button class="clear-day-btn" onclick={() => clearDay(day)}
          >Clear day</button
        >
      {/if}
    </div>
  {/each}
</div>

<app-modal
  open={showPicker}
  modal-title={`Add ${pickerMealTime} for ${pickerDay}`}
  onclose={() => (showPicker = false)}
>
  <br />
  <recipe-search-bar
    placeholder="Search by Recipe Name"
    value={query}
    showSearchButton={false}
    onsearch={(e: CustomEvent<{ value: string }>) => {
      query = e.detail.value;
    }}
  ></recipe-search-bar>

  <br />

  {#if pickable.length === 0}
    <p class="empty-state">
      No recipes to choose from yet. Add some favorites or create your own
      recipe first.
    </p>
  {:else}
    <div class="picker-list">
      {#each pickable as r (r.id)}
        <button
          type="button"
          class="picker-item"
          use:onNativeClick={() => {
            console.log("CLICKED", r);
            assign(r.id);
          }}
        >
          <img src={r.image} alt={r.title} />
          <span>{r.title}</span>
        </button>
      {/each}
    </div>
  {/if}
</app-modal>

<style>
  .subtitle {
    color: #6b7280;
    margin-top: -0.25rem;
  }
  .week {
    display: grid;
    grid-template-columns: auto auto auto;
    gap: 1rem;
    overflow-x: auto;
    margin-top: 1.25rem;
    padding-bottom: 0.5rem;
  }
  .picker-list {
    display: grid;
    gap: 0.5rem;
    max-height: 340px;
    overflow-y: auto;
  }
  .picker-item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: white;
    text-align: left;
  }
  .picker-item img {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    object-fit: cover;
  }
  .picker-item:hover {
    background: #f3f4f6;
  }
  .day-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    border: 1px solid #bfc2c4;
    border-radius: 14px;
    padding: 0.75rem;
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
    background: #ffffff;
    transition:
      background 0.12s ease,
      box-shadow 0.12s ease,
      transform 0.12s ease;
  }
  .day-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;
    padding: 0.5rem 0.4rem;
    border-radius: 10px;
    background: #f9fafb;
  }
  .day-header.today {
    background: linear-gradient(135deg, #4f46e5, #6366f1);
  }
  .day-header.today .day-name,
  .day-header.today .day-date {
    color: white;
  }
  .day-name {
    font-weight: 700;
    font-size: 0.95rem;
    letter-spacing: 0.02em;
  }
  .today-badge {
    background: rgba(255, 255, 255, 0.25);
    color: white;
    font-size: 0.65rem;
    font-weight: 700;
    padding: 0.05rem 0.5rem;
    border-radius: 999px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .day-date {
    font-size: 0.75rem;
    color: #6b7280;
  }
  .clear-day-btn {
    border: none;
    background: none;
    color: #dc2626;
    font-size: 0.8rem;
    cursor: pointer;
    padding: 0.2rem;
  }
  .clear-day-btn:hover {
    text-decoration: underline;
  }
  @media (max-width: 900px) {
    .week {
      grid-template-columns: auto auto;
    }
  }
</style>
