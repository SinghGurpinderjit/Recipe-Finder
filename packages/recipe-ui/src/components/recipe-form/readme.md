# recipe-form



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute      | Description | Type                       | Default                                                                                                                                                                                                                                                                                                                   |
| ----------------- | -------------- | ----------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `areas`           | --             |             | `string[]`                 | `[   'American', 'British', 'Chinese', 'Croatian', 'Dutch', 'Egyptian',   'Filipino', 'French', 'Greek', 'Indian', 'Irish', 'Italian', 'Jamaican',   'Japanese', 'Kenyan', 'Malaysian', 'Mexican', 'Moroccan', 'Polish',   'Portuguese', 'Russian', 'Spanish', 'Thai', 'Tunisian', 'Turkish',   'Vietnamese', 'Other', ]` |
| `categories`      | --             |             | `string[]`                 | `[   'Beef', 'Breakfast', 'Chicken', 'Dessert', 'Goat', 'Lamb',   'Miscellaneous', 'Pasta', 'Pork', 'Seafood', 'Side', 'Starter',   'Vegan', 'Vegetarian', 'Other', ]`                                                                                                                                                    |
| `extraAreas`      | --             |             | `string[]`                 | `[]`                                                                                                                                                                                                                                                                                                                      |
| `extraCategories` | --             |             | `string[]`                 | `[]`                                                                                                                                                                                                                                                                                                                      |
| `initialData`     | `initial-data` |             | `RecipeFormData \| string` | `undefined`                                                                                                                                                                                                                                                                                                               |


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
