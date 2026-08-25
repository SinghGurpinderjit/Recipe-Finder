# recipe-filter-bar



<!-- Auto Generated Below -->


## Overview

Renders a row of selectable filter chips (e.g. categories/cuisines).
`categories` accepts either a JSON string array or an actual array
(Stencil auto-parses complex props passed as attributes).
Emits `filterChange` with the selected value ('' = all).

## Properties

| Property     | Attribute | Description | Type       | Default |
| ------------ | --------- | ----------- | ---------- | ------- |
| `active`     | `active`  |             | `string`   | `''`    |
| `categories` | --        |             | `string[]` | `[]`    |


## Events

| Event          | Description | Type                              |
| -------------- | ----------- | --------------------------------- |
| `filterChange` |             | `CustomEvent<{ value: string; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
