// Minimal ambient typings so svelte-check / TS don't flag the
// @yourscope/recipe-ui custom elements as unknown when used in .svelte
// templates. Svelte 5 lower-cases event props (on:eventname -> oneventname
// for CustomEvent based components is handled automatically for native
// events; for custom-element CustomEvents we type them loosely here.
declare namespace svelteHTML {
  interface IntrinsicElements {
    'recipe-card': any;
    'recipe-search-bar': any;
    'recipe-filter-bar': any;
    'recipe-rating': any;
    'recipe-form': any;
    'meal-plan-day': any;
    'app-modal': any;
    'app-toast': any;
  }
}
