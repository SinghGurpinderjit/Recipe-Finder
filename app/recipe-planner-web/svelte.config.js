import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    version: {
      // SvelteKit will poll the server for updates every 30 seconds
      pollInterval: 30000
    }
  },
  compilerOptions: {
    // allow custom-element attributes/events from @yourscope/recipe-ui
    // without Svelte warning about "unknown property"
    customElement: false,
  },
};

export default config;
