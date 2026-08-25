<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { recipes } from "$lib/state/recipes.svelte";
  import { favorites } from "$lib/state/favorites.svelte";
  import { userRecipes } from "$lib/state/userRecipes.svelte";
  import { mealPlan } from "$lib/state/mealPlan.svelte";
  import { toasts } from "$lib/state/toast.svelte";
  import {
    WEEK_DAYS,
    MEAL_TIMES,
    type MealTime,
    type Recipe,
  } from "$lib/types";

  let id = $derived(page.params.id ?? "");
  let recipe = $state<Recipe | null>(null);
  let loading = $state(true);
  let notFound = $state(false);
  let showPlanModal = $state(false);
  let selectedDay = $state<string>(WEEK_DAYS[0]);
  let selectedMealTime = $state<MealTime>("Breakfast");

  function load(recipeId: string) {
    loading = true;
    notFound = false;
    const found = recipes.getById(recipeId);
    if (found) {
      recipe = found;
    } else {
      recipe = null;
      notFound = true;
    }
    loading = false;
  }

  onMount(() => load(id));
  $effect(() => {
    load(id);
  });

  function toggleFavorite() {
    if (!recipe) return;
    favorites.toggle(recipe);
    toasts.show(
      favorites.isFavorite(recipe.id)
        ? "Added to favorites"
        : "Removed from favorites",
      "success",
    );
  }

  function openPlanModal() {
    selectedDay = WEEK_DAYS[0];
    selectedMealTime = "Breakfast";
    showPlanModal = true;
  }

  function addToPlan() {
    if (!recipe) return;
    mealPlan.assign(selectedDay, selectedMealTime, {
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
    });
    toasts.show(
      `Added "${recipe.title}" to ${selectedMealTime} on ${selectedDay}`,
      "success",
    );
    showPlanModal = false;
  }

  function deleteRecipe() {
    if (!recipe || recipe.source !== "user") return;
    if (!confirm("Delete this recipe permanently?")) return;
    userRecipes.remove(recipe.id);
    toasts.show("Recipe deleted", "info");
    goto("/");
  }

  function onNativeClick(
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
  <title>{recipe ? recipe.title : "Recipe"} — Recipe Finder</title>
</svelte:head>

{#if loading}
  <p class="empty-state">Loading recipe…</p>
{:else if notFound}
  <p class="empty-state">Recipe not found.</p>
{:else if recipe}
  <a href="/" class="back-link">&larr; Back to browse</a>

  <div class="detail">
    <img src={recipe.image} alt={recipe.title} class="hero" />
    <div class="info">
      <h1>{recipe.title}</h1>
      <div class="badges">
        {#if recipe.category}<span class="badge">{recipe.category}</span>{/if}
        {#if recipe.area}<span class="badge">{recipe.area}</span>{/if}
        {#if recipe.source === "user"}<span class="badge user">My Recipe</span
          >{/if}
      </div>

      <div class="actions">
        <button class="btn" onclick={toggleFavorite}>
          {favorites.isFavorite(recipe.id)
            ? "★ Remove Favorite"
            : "☆ Add to Favorites"}
        </button>
        <button class="btn secondary" onclick={openPlanModal}
          >+ Add to Meal Plan</button
        >
        {#if recipe.source === "user"}
          <a class="btn secondary" href={`/recipes/${recipe.id}/edit`}>Edit</a>
          <button class="btn danger" onclick={deleteRecipe}>Delete</button>
        {/if}
      </div>

      <h2>Ingredients</h2>
      {#if recipe.ingredients.length}
        <ul class="ingredients">
          {#each recipe.ingredients as ing}
            <li>{ing}</li>
          {/each}
        </ul>
      {:else}
        <p class="empty-state">No ingredients listed.</p>
      {/if}

      <h2>Instructions</h2>
      <p class="instructions">
        {recipe.instructions || "No instructions provided."}
      </p>
    </div>
  </div>

  <app-modal
    open={showPlanModal}
    modal-title="Add to the weekly plan"
    onclose={() => (showPlanModal = false)}
  >
    <p class="modal-subtitle">for {recipe.title}</p>

    <div class="field">
      <label for="plan-day" class="field-label">Day</label>
      <select id="plan-day" class="day-select" bind:value={selectedDay}>
        {#each WEEK_DAYS as day}
          <option value={day}>{day}</option>
        {/each}
      </select>
    </div>

    <div class="field">
      <span class="field-label">Meal</span>
      <div class="meal-toggle-group">
        {#each MEAL_TIMES as mealTime}
          <button
            type="button"
            class={{
              "meal-toggle": true,
              active: selectedMealTime === mealTime,
            }}
            use:onNativeClick={() => (selectedMealTime = mealTime)}
          >
            {mealTime}
          </button>
        {/each}
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn secondary" use:onNativeClick={() => (showPlanModal = false)}
        >Cancel</button
      >
      <button class="btn" use:onNativeClick={addToPlan}>Add to plan</button>
    </div>
  </app-modal>
{/if}

<style>
  .back-link {
    display: inline-block;
    margin-bottom: 1rem;
    color: #2563eb;
    text-decoration: none;
  }
  .detail {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 1.5rem;
  }
  .hero {
    width: 100%;
    border-radius: 10px;
    object-fit: cover;
  }
  .badges {
    display: flex;
    gap: 0.4rem;
    margin: 0.4rem 0 1rem;
  }
  .badge {
    background: #e5e7eb;
    border-radius: 999px;
    padding: 0.2rem 0.7rem;
    font-size: 0.8rem;
  }
  .badge.user {
    background: #dbeafe;
    color: #1d4ed8;
  }
  .actions {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
    margin-bottom: 1.25rem;
  }
  .ingredients {
    padding-left: 1.1rem;
  }
  .instructions {
    white-space: pre-line;
    line-height: 1.6;
  }
  .modal-subtitle {
    color: #6b7280;
    margin: -0.5rem 0 1rem;
    font-size: 0.9rem;
  }
  .field {
    margin-bottom: 1.1rem;
  }
  .field-label {
    display: block;
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 0.4rem;
  }
  .day-select {
    width: 100%;
    padding: 0.6rem 0.7rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.95rem;
    background: white;
  }
  .meal-toggle-group {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  .meal-toggle {
    padding: 0.6rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: white;
    font-size: 0.9rem;
    cursor: pointer;
  }
  .meal-toggle:hover {
    background: #f3f4f6;
  }
  .meal-toggle.active {
    border-color: #2563eb;
    background: #eff6ff;
    color: #2563eb;
    font-weight: 600;
  }
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.6rem;
    margin-top: 1.25rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }
  @media (max-width: 640px) {
    .detail {
      grid-template-columns: 1fr;
    }
  }
</style>
