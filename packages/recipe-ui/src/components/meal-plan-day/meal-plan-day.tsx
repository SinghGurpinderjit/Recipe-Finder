import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

export interface PlannedMeal {
  id: string;
  title: string;
  image?: string;
}

@Component({
  tag: 'meal-plan-day',
  styleUrl: 'meal-plan-day.css',
  shadow: true,
})
export class MealPlanDay {
  @Prop() day: string = '';
  @Prop() meals: PlannedMeal[] = [];
  /** Optional emoji/icon shown next to the label, e.g. "🌅" */
  @Prop() icon: string = '';

  @Event() assignMeal: EventEmitter<{ day: string }>;
  @Event() removeMeal: EventEmitter<{ day: string; mealId: string }>;

  render() {
    const meals = Array.isArray(this.meals) ? this.meals : [];
    return (
      <div class="day-col">
        <div class="col-header">
          {this.icon && <span class="icon">{this.icon}</span>}
          <h3>{this.day}</h3>
          {meals.length > 0 && <span class="count-badge">{meals.length}</span>}
        </div>

        <div class="meals">
          {meals.map((m) => (
            <div class="meal-chip">
              <div class="thumb">{m.image && <img src={m.image} alt={m.title} />}</div>
              <span class="title">{m.title}</span>
              <button
                class="remove-btn"
                onClick={() => this.removeMeal.emit({ day: this.day, mealId: m.id })}
                aria-label={`Remove ${m.title}`}
              >
                ✕
              </button>
            </div>
          ))}
          {meals.length === 0 && <p class="empty">No meal planned</p>}
        </div>

        <button class="add-btn" onClick={() => this.assignMeal.emit({ day: this.day })}>
          <span class="plus">+</span> Add meal
        </button>
      </div>
    );
  }
}