// Registers the @gurpinderjitsingh/recipe-ui web components. This must only run in
// the browser (custom element registration needs `window`/`document`, which
// don't exist during SvelteKit's SSR pass), so it's called from +layout.svelte
// inside onMount.
export async function registerComponents() {
  await import('@gurpinderjitsingh/recipe-ui/dist/components');
  // await defineCustomElements();
}
