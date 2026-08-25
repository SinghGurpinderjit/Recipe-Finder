<script lang="ts">
  import { goto } from '$app/navigation';
  import { favorites } from '$lib/state/favorites.svelte';
  import { toasts } from '$lib/state/toast.svelte';
  import type { Recipe } from '$lib/types';

  function remove(recipe: Recipe) {
    favorites.remove(recipe.id);
    toasts.show(`Removed "${recipe.title}" from favorites`, 'info');
  }
</script>

<svelte:head>
  <title>Favorites — Recipe Finder</title>
</svelte:head>

<h1>Your Favorites</h1>

{#if favorites.items.length === 0}
  <p class="empty-state">No favorites yet. Browse recipes and tap ☆ to save them here.</p>
{:else}
  <div class="grid">
    {#each favorites.items as r (r.id)}
      <recipe-card
        recipe-title={r.title}
        image={r.image}
        category={r.category}
        favorite={true}
        oncardClick={() => goto(`/recipe/${r.id}`)}
        onfavoriteToggle={() => remove(r)}
      ></recipe-card>
    {/each}
  </div>
{/if}
