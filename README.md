```bash
# Recipe Finder & Meal Planner

A recipe discovery and weekly meal-planning app built with **SvelteKit (Svelte 5)**,
consuming a reusable **StencilJS** web component library published to npm.

- **Web app:** [`app/recipe-planner-web`](./app/recipe-planner-web)
- **Component library:** [`packages/recipe-ui`](./packages/recipe-ui)

## Live links
| Deployed app | `https://gps-recipe-finder.netlify.app/planner`              |
| npm package  | `https://www.npmjs.com/package/@gurpinderjitsingh/recipe-ui` |
| GitHub repo  | `https://github.com/SinghGurpinderjit/Recipe-Finder`         |

• Source code for the SvelteKit application.
    https://github.com/SinghGurpinderjit/Recipe-Finder/tree/master/app/recipe-planner-web

• Source code for the StencilJS component library.
    https://github.com/SinghGurpinderjit/Recipe-Finder/tree/master/packages/recipe-ui

## Setup instructions ### 

### 1. Component library (`packages/recipe-ui`) ### 
cd packages/recipe-ui
npm install
npm run build          # produces dist/ and loader/

### To develop components with live-reload + a visual playground: ### 
npm start               # opens localhost:3333

To publish a new version:
npm login
npm run build          # produces dist/ and loader/
npm version patch       # or minor / major, per semver
npm publish --access public

### 2. Web app (`app/recipe-planner-web`) ### 

cd app/recipe-planner-web
npm install  # installs @yourscope/recipe-ui from npm, plus SvelteKit deps
npm run dev  # starts dev server at localhost:5173

### The app installs the component library **from the npm registry**, not from
### local source — that's the whole point of publishing it. If you're actively
### developing both packages together, use `npm link` locally, then switch back
### to the published version before submitting/deploying.

### Build for production ### 
npm run build
npm run preview

## Assumptions made

# - **Recipe data source:** 
#   [TheMealDB]('https://www.themealdb.com/api/json/v1/1') free
#   public API , no signup is used for recipe discovery, search, and category filtering

# - **Persistence:** 
#   - On page refresh, it fetches list of recipes from MealDb api and saved in browser local  
#     storage and now you can perform operations on recipes.
#   - Favorites, the weekly meal plan, and user-created recipes
#     are stored in **browser localStorage**
#     (`src/lib/storage.ts`) rather than a backend/database — reasonable for the
#     scope of this assignment. Swapping in a real backend later only requires
#     changing that one file plus the three `*.svelte.ts` state modules.

# - **Editing scope:** 
#   - Only recipes the user creates locally (`source: 'user'`)
#     can be edited or deleted. Recipes pulled from TheMealDB are read-only, since
#     they belong to the public API.

# - **Favorites store full recipe snapshots** (not just IDs) so the Favorites
#   page renders instantly without extra API calls.

# - No authentication/user accounts — all data is scoped to the browser.

## Architecture Notes

# - **Framework-agnostic components** 
#   — The Stencil library builds with the `dist-custom-elements` output target, producing plain
#     Custom Elements. No Stencil React/Vue wrapper packages are needed to consume them from Svelte.

# - **Client-only registration** 
#   — `defineCustomElements()` (from the published package's `/loader` entry) is called once, 
#     inside `+layout.svelte`'s `onMount`. Custom element registration requires the browser 
#     and must not run during SSR.

# - **Props in, events out** 
#   — Data flows into Stencil components via **props** (`title`, `image`, `meals`, etc.) 
#     and flows back out via **CustomEvents** (`favoriteToggle`, `search`, `assignMeal`, `save`, 
#     …), which Svelte 5 binds with `onEventName={...}` handlers.

# - **Slots** — 
#     `<recipe-card>`'s `actions` slot and `<recipe-form>`'s `header`/`footer` slots demonstrate slot usage from the host app.

```
