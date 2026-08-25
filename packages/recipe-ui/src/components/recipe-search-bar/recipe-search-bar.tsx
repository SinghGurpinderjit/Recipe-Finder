import { Component, Prop, State, Event, EventEmitter, h, Watch } from '@stencil/core';

/**
 * A debounced search input. Emits `search` with the current value
 * after the user stops typing (default 350ms) or presses Enter.
 */
@Component({
  tag: 'recipe-search-bar',
  styleUrl: 'recipe-search-bar.css',
  shadow: true,
})
export class RecipeSearchBar {
  @Prop() placeholder: string = 'Search recipes...';
  @Prop() value: string = '';
  @Prop() debounceMs: number = 350;

  @State() internalValue: string = '';

  @Event() search: EventEmitter<{ value: string }>;

  private timer: any;

  componentWillLoad() {
    this.internalValue = this.value;
  }

  @Watch('value')
  onValuePropChange(newVal: string) {
    this.internalValue = newVal;
  }

  private onInput = (e: InputEvent) => {
    this.internalValue = (e.target as HTMLInputElement).value;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.search.emit({ value: this.internalValue });
    }, this.debounceMs);
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      clearTimeout(this.timer);
      this.search.emit({ value: this.internalValue });
    }
  };

  render() {
    return (
      <div class="wrap">
        <input
          type="search"
          placeholder={this.placeholder}
          value={this.internalValue}
          onInput={this.onInput}
          onKeyDown={this.onKeyDown}
        />
        <button onClick={() => this.search.emit({ value: this.internalValue })} aria-label="Search">
          🔍
        </button>
      </div>
    );
  }
}
