<script lang="ts">
  import { goto } from "$app/navigation";
  import { userRecipes } from "$lib/state/userRecipes.svelte";
  import { favorites } from "$lib/state/favorites.svelte";
  import { toasts } from "$lib/state/toast.svelte";
  import type { Recipe } from "$lib/types";

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

  function deleteRecipe(recipe: Recipe, e: MouseEvent) {
    e.stopPropagation();
    if (!confirm(`Delete "${recipe.title}" permanently?`)) return;
    userRecipes.remove(recipe.id);
    toasts.show("Recipe deleted", "info");
  }
</script>

<svelte:head>
  <title>My Recipes — Recipe Finder</title>
</svelte:head>

<div class="page-header">
  <h1>My Recipes</h1>
  <a class="btn" href="/recipes/new">Add New Recipe</a>
</div>

{#if userRecipes.items.length === 0}
  <p class="empty-state">
    You haven't created any recipes yet. <a href="/recipes/new"
      >Create your first one</a
    >.
  </p>
{:else}
  <div class="grid">
    {#each userRecipes.items as r (r.id)}
      <recipe-card
        recipe-title={r.title}
        image={r.image}
        category={r.category}
        cuisine={r.cuisine}
        favorite={favorites.isFavorite(r.id)}
        oncardClick={() => openRecipe(r.id)}
        onfavoriteToggle={() => onFavoriteToggle(r)}
      >
        <div slot="actions" class="card-actions">
          <a
            class="mini-link"
            href={`/recipes/${r.id}/edit`}
            onclick={(e) => e.stopPropagation()}>Edit</a
          >
          <button class="mini-link danger" onclick={(e) => deleteRecipe(r, e)}
            >Delete</button
          >
        </div>
      </recipe-card>
    {/each}
  </div>
{/if}

<style>
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;

    .btn {
      background: rgb(255, 107, 53);
      color: rgb(255, 255, 255);
    }
  }
  .card-actions {
    display: flex;
    gap: 0.6rem;
  }
  .mini-link {
    font-size: 0.75rem;
    color: #2563eb;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-decoration: none;
  }
  .mini-link:hover {
    text-decoration: underline;
  }
  .mini-link.danger {
    color: #dc2626;
  }
</style>
