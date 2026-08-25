# recipe-form



<!-- Auto Generated Below -->


## Overview

Add/edit form for user-created recipes. Performs client-side validation
(title required, at least one non-empty ingredient, instructions required)
and only emits `save` once the data is valid.

## Properties

| Property      | Attribute      | Description                                                     | Type                       | Default     |
| ------------- | -------------- | --------------------------------------------------------------- | -------------------------- | ----------- |
| `initialData` | `initial-data` | Pass an existing recipe (as a JSON string or object) to edit it | `RecipeFormData \| string` | `undefined` |


## Events

| Event    | Description | Type                          |
| -------- | ----------- | ----------------------------- |
| `cancel` |             | `CustomEvent<void>`           |
| `save`   |             | `CustomEvent<RecipeFormData>` |


## Slots

| Slot       | Description |
| ---------- | ----------- |
| `"footer"` |             |
| `"header"` |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
