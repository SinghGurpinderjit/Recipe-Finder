import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

/** 5-star rating. Read-only display or interactive input. */
@Component({
  tag: 'recipe-rating',
  styleUrl: 'recipe-rating.css',
  shadow: true,
})
export class RecipeRating {
  @Prop() value: number = 0;
  @Prop() readonly: boolean = false;
  @Prop() max: number = 5;

  @Event() ratingChange: EventEmitter<{ value: number }>;

  render() {
    const stars = Array.from({ length: this.max }, (_, i) => i + 1);
    return (
      <div class="wrap" role={this.readonly ? undefined : 'radiogroup'}>
        {stars.map((s) => (
          <span
            class={{ star: true, filled: s <= this.value, clickable: !this.readonly }}
            onClick={() => !this.readonly && this.ratingChange.emit({ value: s })}
          >
            ★
          </span>
        ))}
      </div>
    );
  }
}
