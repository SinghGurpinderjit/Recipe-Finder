# recipe-card



<!-- Auto Generated Below -->


## Overview

Displays a summary of a recipe (image, title, category) inside a card.
Emits `cardClick` when the card body is clicked and `favoriteToggle`
when the favorite button is pressed. Accepts a named `actions` slot
for extra buttons supplied by the consuming app.

## Properties

| Property      | Attribute      | Description                                                                                                                            | Type      | Default     |
| ------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `category`    | `category`     | Category label                                                                                                                         | `string`  | `''`        |
| `cuisine`     | `cuisine`      | Cuisine label                                                                                                                          | `string`  | `''`        |
| `favorite`    | `favorite`     | Whether this recipe is currently favorited                                                                                             | `boolean` | `false`     |
| `image`       | `image`        | Image URL                                                                                                                              | `string`  | `undefined` |
| `recipeTitle` | `recipe-title` | Recipe title (named recipeTitle, not title, to avoid colliding with the native HTML title/tooltip attribute every element already has) | `string`  | `undefined` |


## Events

| Event            | Description                                                    | Type                                  |
| ---------------- | -------------------------------------------------------------- | ------------------------------------- |
| `cardClick`      | Fired when the card (excluding the favorite button) is clicked | `CustomEvent<void>`                   |
| `favoriteToggle` | Fired when the favorite button is toggled                      | `CustomEvent<{ favorite: boolean; }>` |


## Slots

| Slot        | Description |
| ----------- | ----------- |
| `"actions"` |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
