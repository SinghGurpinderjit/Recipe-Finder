<script lang="ts">
  import { goto } from '$app/navigation';
  import { userRecipes, type RecipeInput } from '$lib/state/userRecipes.svelte';
  import { toasts } from '$lib/state/toast.svelte';

  function onSave(e: CustomEvent<RecipeInput>) {
    try {
      const recipe = userRecipes.create(e.detail);
      toasts.show('Recipe created!', 'success');
      goto(`/recipe/${recipe.id}`);
    } catch (err) {
      toasts.show((err as Error).message, 'error');
    }
  }

  function onCancel() {
    goto('/');
  }
</script>

<svelte:head>
  <title>New Recipe — Recipe Finder</title>
</svelte:head>

<h1>Create a Recipe</h1>
<p class="subtitle">Fields are validated before saving — title, at least one ingredient, and instructions are required.</p>

<recipe-form onsave={onSave} oncancel={onCancel}>
  <h2 slot="header">Recipe Details</h2>
</recipe-form>

<style>
  .subtitle {
    color: #6b7280;
    margin-top: -0.25rem;
    margin-bottom: 1rem;
  }
</style>
