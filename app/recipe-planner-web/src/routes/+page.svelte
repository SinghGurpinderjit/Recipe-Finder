<script lang="ts">
  import { goto } from "$app/navigation";
  import { recipes } from "$lib/state/recipes.svelte";
  import { favorites } from "$lib/state/favorites.svelte";
  import { toasts } from "$lib/state/toast.svelte";
  import type { Recipe } from "$lib/types";
  import { onMount } from "svelte";
  import { recipeCatalog } from "$lib/state/recipeCatalog.svelte";

  let activeCategory = $state("");
  let query = $state("");
  let cuisineQuery = $state("All");
  const PAGE_SIZE = 28;
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

  let pageLoading = $derived(
    recipeCatalog.status === "loading" && recipeCatalog.recipes.length === 0,
  );

  onMount(() => {
    recipeCatalog.initialize();
  });
</script>

<svelte:head>
  <title>Recipe Finder & Meal Planner</title>
</svelte:head>

<h1>Discover Recipes</h1>

{#if pageLoading}
  <div class="loader" role="status" aria-live="polite">
    <span class="spinner" aria-hidden="true"></span>
    <p>Loading recipes…</p>
  </div>
  <div class="grid">
    {#each Array(PAGE_SIZE) as _}
      <div class="skeleton-card" aria-hidden="true">
        <div class="skeleton-img"></div>
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-line skeleton-sub"></div>
      </div>
    {/each}
  </div>
{:else if recipeCatalog.status === "error"}
  <p class="empty-state">
    Couldn't load recipes: {recipeCatalog.error}
    <button class="btn secondary" onclick={() => recipeCatalog.refresh()}
      >Try again</button
    >
  </p>
{:else}
  <div>
    <!-- Recipe Name filter -->
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

      <!-- Cuisine filter -->
      <div class="cuisine-filter">
        <span class="label">Cuisine:</span>
        <select class="cuisine-select" bind:value={cuisineQuery}>
          <option value={"All"}>{"All"}</option>
          {#each recipes.cuisines as cuisine}
            <option value={cuisine}>{cuisine}</option>
          {/each}
        </select>
      </div>
    </div>

    <!-- Categories filter -->
    <fieldset class="filters-block">
      <legend>Categories</legend>
      <div class="category-filter">
        <recipe-filter-bar
          categories={recipes.categories}
          active={activeCategory}
          onfilterChange={onFilterChange}
        ></recipe-filter-bar>
      </div>
    </fieldset>

    <!-- Show recipies -->
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

      <!-- Show pages -->
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
  </div>
{/if}

<style>
  .filters-block {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.25rem 1.25rem 0.75rem;
    margin: 0 0 1.5rem;
    background: #fff;
  }
  .filters-block legend {
    padding: 0 0.6rem;
    margin-left: 0.4rem;
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    color: rgb(255, 107, 53);
  }
  .loader {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    padding: 1.5rem 0 1rem;
    color: #6b7280;
    font-size: 0.95rem;
  }
  .spinner {
    width: 20px;
    height: 20px;
    border: 3px solid #e5e7eb;
    border-top-color: rgb(235, 98, 48);
    border-radius: 50%;
    display: inline-block;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  .skeleton-card {
    border: 1px solid #eee;
    border-radius: 12px;
    overflow: hidden;
  }
  .skeleton-img {
    aspect-ratio: 4 / 3;
    background: #eee;
  }
  .skeleton-line {
    height: 12px;
    margin: 10px 12px 0;
    border-radius: 6px;
    background: #eee;
  }
  .skeleton-title {
    width: 70%;
  }
  .skeleton-sub {
    width: 45%;
    margin-bottom: 12px;
  }
  .skeleton-img,
  .skeleton-line {
    background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
    background-size: 200% 100%;
    animation: shimmer 1.3s ease-in-out infinite;
  }
  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
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
    background: rgb(235, 98, 48);
    border-color: rgb(235, 98, 48);
    color: white;
  }
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .cuisine-select {
    width: 100%;
    padding: 0.5rem 2.5rem 0.65rem 0.5rem;
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
    border-color: rgb(235, 98, 48);
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
    flex: 1;
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
    span,
    .label {
      color: rgb(235, 98, 48);
      padding: 3px 15px 3px 0px;
      font-size: 1rem;
      text-wrap: nowrap;
      font-weight: 500;
      border-radius: 5px;
    }
  }
  .recipe-name-filter :global(recipe-search-bar) {
    display: block;
    width: 100%;
  }
</style>
