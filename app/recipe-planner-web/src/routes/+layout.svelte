<script lang="ts">
  import { onMount } from "svelte";
  import { registerComponents } from "$lib/register-components";
  import { toasts } from "$lib/state/toast.svelte";
  import { favorites } from "$lib/state/favorites.svelte";
  import { mealPlan } from "$lib/state/mealPlan.svelte";
  import "../app.css";

  let { children } = $props();
  let ready = $state(false);

  const mealPlanCount = $derived(Object.values(mealPlan.plan).filter(
    (x) => x.Breakfast.length > 0 || x.Lunch.length > 0 || x.Dinner.length > 0
  ).length);

  onMount(async () => {
    await registerComponents();
    ready = true;
  });
</script>

<div class="app-shell">
  <header class="nav">
    <a href="/" class="brand">
      Recipe<span>Finder</span></a>
    <nav>
      <a href="/">Browse</a>
      <a href="/favorites" class="nav-link-badge">
        Favorites
        {#if favorites.items.length > 0}
          <span class="badge-count">{favorites.items.length}</span>
        {/if}
      </a>
      <a href="/planner">
        Meal Planner
        {#if mealPlanCount > 0}
          <span class="badge-count">{mealPlanCount}</span>
        {/if}
      </a>
      <a href="/my-recipes">My Recipes</a>
      <a href="/recipes/new">
        <span class="new-recipe-icon">+</span> New Recipe
      </a>
    </nav>
  </header>

  <main>
    {#if ready}
      {@render children()}
    {:else}
      <p class="loading">Loading…</p>
    {/if}
  </main>

  <div class="toast-stack">
    {#each toasts.items as t (t.id)}
      <app-toast
        message={t.message}
        type={t.type}
        ondismiss={() => toasts.dismiss(t.id)}
      ></app-toast>
    {/each}
  </div>
</div>

<style>
  .app-shell {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    background: #1f2937;
    color: white;
  }
  .brand {
    color: white;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.3rem;
    align-items: center;
    font-style: italic;
    
    span {
      color: rgb(255, 107, 53);
    }
  }
  .nav nav a {
    color: #e5e7eb;
    text-decoration: none;
    margin-left: 1.25rem;
    font-size: 0.95rem;
  }
  .nav nav a:hover {
    color: white;
  }
  main {
    flex: 1;
    padding: 1.5rem;
    max-width: 1100px;
    width: 100%;
    margin: 0 auto;
  }
  .loading {
    text-align: center;
    color: #6b7280;
    padding: 2rem;
  }
  .toast-stack {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 100;
  }
  .nav-link-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }
  .badge-count {
    background: #ef4444;
    color: white;
    font-size: 0.7rem;
    font-weight: 700;
    line-height: 1;
    padding: 0.15rem 0.4rem;
    border-radius: 999px;
    min-width: 1.1rem;
    text-align: center;
  }
</style>
