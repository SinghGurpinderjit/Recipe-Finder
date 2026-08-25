import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

/**
 * Renders a row of selectable filter chips (e.g. categories/cuisines).
 * `categories` accepts either a JSON string array or an actual array
 * (Stencil auto-parses complex props passed as attributes).
 * Emits `filterChange` with the selected value ('' = all).
 */
@Component({
  tag: 'recipe-filter-bar',
  styleUrl: 'recipe-filter-bar.css',
  shadow: true,
})
export class RecipeFilterBar {
  @Prop() categories: string[] = [];
  @Prop() active: string = '';

  @Event() filterChange: EventEmitter<{ value: string }>;

  private select(value: string) {
    this.filterChange.emit({ value });
  }

  render() {
    const cats = Array.isArray(this.categories) ? this.categories : [];
    return (
      <div class="wrap">
        <button class={{ chip: true, active: this.active === '' }} onClick={() => this.select('')}>
          All
        </button>
        {cats.map((c) => (
          <button class={{ chip: true, active: this.active === c }} onClick={() => this.select(c)}>
            {c}
          </button>
        ))}
      </div>
    );
  }
}
