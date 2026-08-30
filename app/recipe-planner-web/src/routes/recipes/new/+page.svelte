<script lang="ts">
  import { goto } from "$app/navigation";
  import { userRecipes, type RecipeInput } from "$lib/state/userRecipes.svelte";
  import { toasts } from "$lib/state/toast.svelte";
  import { customAreas } from "$lib/state/customAreas.svelte";
  import { customCategories } from "$lib/state/customCategories.svelte";
  import { recipes } from "$lib/state/recipes.svelte";

  function onSave(e: CustomEvent<RecipeInput>) {
    try {
      if (
        e.detail.category &&
        !recipes.categories.includes(e.detail.category)
      ) {
        customCategories.add(e.detail.category);
      }
      if (e.detail.cuisine && !recipes.cuisines.includes(e.detail.cuisine)) {
        customAreas.add(e.detail.cuisine);
      }
      const recipe = userRecipes.create(e.detail);
      toasts.show("Recipe created!", "success");
      goto(`/recipe/${recipe.id}`);
    } catch (err) {
      toasts.show((err as Error).message, "error");
    }
  }

  function onCancel() {
    goto("/");
  }
</script>

<svelte:head>
  <title>New Recipe — Recipe Finder</title>
</svelte:head>

<h1>Create a Recipe</h1>
<p class="subtitle">
  Fields are validated before saving — title, at least one ingredient, and
  instructions are required.
</p>

<recipe-form
  extraCategories={customCategories.items}
  extraAreas={customAreas.items}
  onsave={onSave}
  oncancel={onCancel}
>
  <h2 slot="header">Recipe Details</h2>
</recipe-form>

<style>
  .subtitle {
    color: #6b7280;
    margin-top: -0.25rem;
    margin-bottom: 1rem;
  }
</style>
