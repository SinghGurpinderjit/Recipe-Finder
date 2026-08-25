# meal-plan-day



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                                            | Type            | Default |
| -------- | --------- | ------------------------------------------------------ | --------------- | ------- |
| `day`    | `day`     |                                                        | `string`        | `''`    |
| `icon`   | `icon`    | Optional emoji/icon shown next to the label, e.g. "🌅" | `string`        | `''`    |
| `meals`  | --        |                                                        | `PlannedMeal[]` | `[]`    |


## Events

| Event        | Description | Type                                            |
| ------------ | ----------- | ----------------------------------------------- |
| `assignMeal` |             | `CustomEvent<{ day: string; }>`                 |
| `removeMeal` |             | `CustomEvent<{ day: string; mealId: string; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
