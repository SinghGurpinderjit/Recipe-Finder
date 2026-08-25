# @yourscope/recipe-ui

Reusable StencilJS web-component library for the Recipe Finder & Meal Planner app.
Works in any framework (Svelte, React, Vue, plain HTML) because it compiles to
standard Custom Elements.

## Components
- `<recipe-card>` – recipe summary card
- `<recipe-search-bar>` – debounced search input
- `<recipe-filter-bar>` – category/cuisine filter chips
- `<recipe-rating>` – star rating, read-only or interactive
- `<recipe-form>` – add/edit recipe form with built-in validation
- `<meal-plan-day>` – one day column of the weekly planner
- `<app-modal>` – generic modal dialog (uses default slot)
- `<app-toast>` – notification toast

## Local development
```bash
npm install
npm start        # stencil dev server + playground at localhost:3333
```

## Build & publish
```bash
npm run build
npm version patch|minor|major
npm publish --access public
```

## Consuming in SvelteKit
```bash
npm install @yourscope/recipe-ui
```
```ts
// call once, client-side only (e.g. in +layout.svelte onMount)
import { defineCustomElements } from '@yourscope/recipe-ui/loader';
defineCustomElements();
```
