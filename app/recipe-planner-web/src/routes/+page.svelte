<script lang="ts">
  import { goto } from "$app/navigation";
  import { recipes } from "$lib/state/recipes.svelte";
  import { favorites } from "$lib/state/favorites.svelte";
  import { toasts } from "$lib/state/toast.svelte";
  import type { Recipe } from "$lib/types";
  import { DEFAULT_AREAS } from "$lib/data/default-areas";

  let activeCategory = $state("");
  let query = $state("");
  let cuisineQuery = $state("All");
  const PAGE_SIZE = 8;
  let currentPage = $state(1);

  function onFilterChange(e: CustomEvent<{ value: string }>) {
    activeCategory = e.detail.value;
    query = "";
    currentPage = 1;
  }
  function openRecipe(id: string) {
    goto(`/recipe/${id}`);
  }

  function onFavoriteToggle(recipe: Recipe) {
    favorites.toggle(recipe);
    toasts.show(
      favorites.isFavorite(recipe.id)
        ? `Added "${recipe.title}" to favorites`
        : `Removed "${recipe.title}"`,
      "success",
    );
  }

  let combined = $derived(
    recipes.filter(
      query,
      activeCategory,
      cuisineQuery == "All" ? "" : cuisineQuery,
    ),
  );

  let totalPages = $derived(
    Math.max(1, Math.ceil(combined.length / PAGE_SIZE)),
  );
  let pageItems = $derived(
    combined.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
  );

  $effect(() => {
    combined;
    currentPage = 1;
  });

  function goToPage(p: number) {
    currentPage = Math.min(Math.max(1, p), totalPages);
  }
</script>

<svelte:head>
  <title>Recipe Finder & Meal Planner</title>
</svelte:head>

<h1>Discover Recipes</h1>

<div class="toolbar">
  <div class="recipe-name-filter">
    <span class="label">Recipe Name:</span>
    <recipe-search-bar
      placeholder="Search by Recipe Name"
      value={query}
      showSearchButton={false}
      onsearch={(e: CustomEvent<{ value: string }>) => {
        query = e.detail.value;
        currentPage = 1;
      }}
    ></recipe-search-bar>
  </div>
  <div class="cuisine-filter">
    <span class="label">Cuisine:</span>
    <select class="cuisine-select" bind:value={cuisineQuery}>
      <!-- <option value="" selected={cuisineQuery === ""}>Select a cuisine…</option> -->
      <option value={"All"}>{"All"}</option>
      {#each DEFAULT_AREAS as area}
        <option value={area}>{area}</option>
      {/each}
    </select>
  </div>
</div>
<div class="category-filter">
  <span>Categories: </span>
  <recipe-filter-bar
    categories={recipes.categories}
    active={activeCategory}
    onfilterChange={onFilterChange}
  ></recipe-filter-bar>
</div>

{#if combined.length === 0}
  <p class="empty-state">No recipes found. Try a different search.</p>
{:else}
  <div class="grid">
    {#each pageItems as r (r.id)}
      <recipe-card
        recipe-title={r.title}
        image={r.image}
        category={r.category}
        cuisine={r.cuisine}
        favorite={favorites.isFavorite(r.id)}
        oncardClick={() => openRecipe(r.id)}
        onfavoriteToggle={() => onFavoriteToggle(r)}
      >
      </recipe-card>
    {/each}
  </div>

  {#if totalPages >= 1}
    <nav class="pagination" aria-label="Recipe pages">
      <button
        class="btn secondary"
        onclick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &larr; Prev
      </button>

      {#each Array(totalPages) as _, i}
        <button
          class={{ "page-btn": true, active: currentPage === i + 1 }}
          onclick={() => goToPage(i + 1)}
          aria-current={currentPage === i + 1 ? "page" : undefined}
        >
          {i + 1}
        </button>
      {/each}

      <button
        class="btn secondary"
        onclick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next &rarr;
      </button>
    </nav>
  {/if}
{/if}

<style>
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
  }
  .page-btn {
    border: 1px solid #d1d5db;
    background: white;
    color: #111827;
    border-radius: 6px;
    padding: 0.4rem 0.75rem;
    font-size: 0.9rem;
    min-width: 2.25rem;
  }
  .page-btn:hover {
    background: #f3f4f6;
  }
  .page-btn.active {
    background: rgb(255, 107, 53);
    border-color: rgb(255, 107, 53);
    color: white;
  }
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .cuisine-select {
    width: 100%;
    min-width: 200px;
    max-width: 380px;
    padding: 0.5rem 2.5rem 0.65rem 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background-color: white;
    color: #6f7175;
    font-size: 0.9rem;
    cursor: pointer;
    outline: none;
    appearance: auto;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .cuisine-select:hover {
    border-color: #9ca3af;
  }

  .cuisine-select:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }

  .cuisine-select option {
    color: #111827;
    background: white;
  }
  .toolbar {
    display: flex;
    gap: 15px;
  }
  .category-filter,
  .cuisine-filter,
  .recipe-name-filter {
    display: flex;
    gap: 15px;
    justify-content: flex-start;
    span,
    .label {
      color: rgb(255, 107, 53);
      padding: 3px 15px;
      font-size: 1rem;
      font-weight: 500;
      /* color: white; */
      border-radius: 5px;
    }
  }
</style>
