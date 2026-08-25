# recipe-search-bar



<!-- Auto Generated Below -->


## Overview

A debounced search input. Emits `search` with the current value
after the user stops typing (default 350ms) or presses Enter.

## Properties

| Property      | Attribute     | Description | Type     | Default               |
| ------------- | ------------- | ----------- | -------- | --------------------- |
| `debounceMs`  | `debounce-ms` |             | `number` | `350`                 |
| `placeholder` | `placeholder` |             | `string` | `'Search recipes...'` |
| `value`       | `value`       |             | `string` | `''`                  |


## Events

| Event    | Description | Type                              |
| -------- | ----------- | --------------------------------- |
| `search` |             | `CustomEvent<{ value: string; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
