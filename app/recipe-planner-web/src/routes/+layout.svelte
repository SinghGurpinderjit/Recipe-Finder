<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { registerComponents } from "$lib/register-components";
  import { toasts } from "$lib/state/toast.svelte";
  import { favorites } from "$lib/state/favorites.svelte";
  import { mealPlan } from "$lib/state/mealPlan.svelte";
  import "../app.css";

  let { children } = $props();
  let ready = $state(false);
  let mobileMenuOpen = $state(false);

  const mealPlanCount = $derived(Object.values(mealPlan.plan).filter(
      (x) => x.Breakfast.length > 0 || x.Lunch.length > 0 || x.Dinner.length > 0
    ).length);

  onMount(async () => {
    await registerComponents();
    ready = true;
  });

  // close the mobile menu automatically on every navigation
  $effect(() => {
    page.url.pathname;
    mobileMenuOpen = false;
  });

  function closeMenu() {
    mobileMenuOpen = false;
  }
</script>

<div class="app-shell">
  <header class="nav">
    <div class="nav-top">
      <a href="/" class="brand" onclick={closeMenu}>
        Recipe<span>Finder</span></a
      >

      <button
        class="hamburger"
        aria-label="Toggle menu"
        aria-expanded={mobileMenuOpen}
        onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
      >
        <span class={{ bar: true, open: mobileMenuOpen }}></span>
        <span class={{ bar: true, open: mobileMenuOpen }}></span>
        <span class={{ bar: true, open: mobileMenuOpen }}></span>
      </button>
    </div>

    <nav class={{ "nav-links": true, open: mobileMenuOpen }}>
      <a href="/" onclick={closeMenu}>Browse</a>
      <a href="/favorites" class="nav-link-badge" onclick={closeMenu}>
        Favorites
        {#if favorites.items.length > 0}
          <span class="badge-count">{favorites.items.length}</span>
        {/if}
      </a>
      <a href="/planner" onclick={closeMenu}>
        Meal Planner
        {#if mealPlanCount > 0}
          <span class="badge-count">{mealPlanCount}</span>
        {/if}
      </a>
      <a href="/my-recipes" onclick={closeMenu}>My Recipes</a>
      <a href="/recipes/new" class="new-recipe-link" onclick={closeMenu}>
        <span class="new-recipe-icon">+</span>
        <span>New Recipe</span>
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
    background: #1f2937;
    color: white;
    display: flex;
    justify-content: space-between;
    align-content: center;
  }

  .nav-top {
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
  /* Hamburger button — hidden on desktop, shown on mobile via media query below */
  .hamburger {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    background: none;
    border: none;
    padding: 6px;
    cursor: pointer;
  }
  .bar {
    width: 22px;
    height: 2px;
    background: white;
    border-radius: 2px;
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;
  }
  .bar.open:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  .bar.open:nth-child(2) {
    opacity: 0;
  }
  .bar.open:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 0;
    padding: 0 0.75rem;
  }
  .nav-links a {
    margin-left: 1.25rem;
  }
  .nav-links a:first-child {
    margin-left: 0;
  }
  .nav-links a {
    color: #e5e7eb;
    text-decoration: none;
    margin-left: 1.25rem;
    font-size: 0.95rem;
  }
  .nav-links a:hover {
    color: white;
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

  /* ---- Mobile: collapse into hamburger menu ---- */
  @media (max-width: 768px) {
    .hamburger {
      display: flex;
    }

    .nav-links {
      display: none;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.85rem;
      padding: 0.5rem 1.5rem 1.25rem;
    }
    .nav-links.open {
      display: flex;
    }
    .nav-links a,
    .nav-links a {
      padding: 0.4rem 0;
      font-size: 1rem;
    }
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
  .new-recipe-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    white-space: nowrap;
  }
  .new-recipe-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.15rem;
    height: 1.15rem;
    line-height: 1;
    font-weight: 700;
    font-size: 0.85rem;
    border-radius: 999px;
    background: rgba(255, 107, 53, 0.18);
    color: rgb(255, 107, 53);
    flex-shrink: 0;
  }
</style>
