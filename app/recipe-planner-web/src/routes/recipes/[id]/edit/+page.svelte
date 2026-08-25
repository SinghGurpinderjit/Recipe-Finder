<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { userRecipes, type RecipeInput } from "$lib/state/userRecipes.svelte";
  import { toasts } from "$lib/state/toast.svelte";
  import { recipes } from "$lib/state/recipes.svelte";

  let id = $derived(page.params.id);
  let recipe = $derived(recipes.getById(id ?? ""));

  
  function onSave(e: CustomEvent<RecipeInput>) {
    try {
      userRecipes.update(id ?? "", e.detail);
      toasts.show("Recipe updated!", "success");
      goto(`/recipe/${id}`);
    } catch (err) {
      toasts.show((err as Error).message, "error");
    }
  }

  function onCancel() {
    goto(`/recipe/${id}`);
  }
</script>

<svelte:head>
  <title>Edit Recipe — Recipe Finder</title>
</svelte:head>

{#if !recipe}
  <p class="empty-state">
    This recipe can't be edited — either it doesn't exist or it's a public API
    recipe (only your own created recipes are editable).
  </p>
{:else}
  <h1>Edit Recipe</h1>
  <recipe-form initialData={recipe} onsave={onSave} oncancel={onCancel}>
    <h3 slot="header">Update Details</h3>
  </recipe-form>
{/if}

<style>
  h1{
    text-align: center;
  }
</style>
