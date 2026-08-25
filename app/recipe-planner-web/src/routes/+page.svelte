<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { recipes } from "$lib/state/recipes.svelte";
  import { favorites } from "$lib/state/favorites.svelte";
  import { toasts } from "$lib/state/toast.svelte";
  import type { Recipe } from "$lib/types";

  let activeCategory = $state("");
  let query = $state("");
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
    query.trim()
      ? recipes.search(query)
      : recipes.filterByCategory(activeCategory),
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
  <recipe-search-bar
    placeholder="Search recipes (e.g. chicken, pasta)..."
    value={query}
    onsearch={(e: CustomEvent<{ value: string }>) => {
      query = e.detail.value;
      // runSearch();
      currentPage = 1;
    }}
  ></recipe-search-bar>
</div>

<recipe-filter-bar
  categories={recipes.categories}
  active={activeCategory}
  onfilterChange={onFilterChange}
></recipe-filter-bar>

<!-- {#if loading}
  <p class="empty-state">Loading recipes…</p>
{:else if combined.length === 0} -->
{#if combined.length === 0}
  <p class="empty-state">No recipes found. Try a different search.</p>
{:else}
  <div class="grid">
    {#each pageItems as r (r.id)}
      <recipe-card
        recipe-title={r.title}
        image={r.image}
        category={r.category}
        favorite={favorites.isFavorite(r.id)}
        oncardClick={() => openRecipe(r.id)}
        onfavoriteToggle={() => onFavoriteToggle(r)}
      >
        <!-- <span slot="actions" class="source-tag"
          >{r.source === "user" ? "My recipe" : ""}</span
        > -->
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
  .source-tag {
    font-size: 0.75rem;
    color: #2563eb;
    font-weight: 600;
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
    background: #2563eb;
    border-color: #2563eb;
    color: white;
  }
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
