import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
  },
  compilerOptions: {
    // allow custom-element attributes/events from @yourscope/recipe-ui
    // without Svelte warning about "unknown property"
    customElement: false,
  },
};

export default config;
