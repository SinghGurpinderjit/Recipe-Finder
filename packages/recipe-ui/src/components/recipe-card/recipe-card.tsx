import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

/**
 * Displays a summary of a recipe (image, title, category) inside a card.
 * Emits `cardClick` when the card body is clicked and `favoriteToggle`
 * when the favorite button is pressed. Accepts a named `actions` slot
 * for extra buttons supplied by the consuming app.
 */
@Component({
  tag: 'recipe-card',
  styleUrl: 'recipe-card.css',
  shadow: true,
})
export class RecipeCard {
  /** Recipe title (named recipeTitle, not title, to avoid colliding with
   *  the native HTML title/tooltip attribute every element already has) */
  @Prop() recipeTitle: string;
  /** Image URL */
  @Prop() image: string;
  /** Category label */
  @Prop() category: string = '';
  /** Cuisine label */
  @Prop() cuisine: string = '';
  /** Whether this recipe is currently favorited */
  @Prop() favorite: boolean = false;

  /** Fired when the favorite button is toggled */
  @Event() favoriteToggle: EventEmitter<{ favorite: boolean }>;
  /** Fired when the card (excluding the favorite button) is clicked */
  @Event() cardClick: EventEmitter<void>;

  private onFavoriteClick = (e: MouseEvent) => {
    e.stopPropagation();
    this.favoriteToggle.emit({ favorite: !this.favorite });
  };

  render() {
    return (
      <div class="card" onClick={() => this.cardClick.emit()}>
        <div class="image-wrap">
          {this.image ? <img src={this.image} alt={this.recipeTitle} /> : <div class="placeholder" />}
          <button
            class={{ 'fav-btn': true, active: this.favorite }}
            onClick={this.onFavoriteClick}
            aria-label="Toggle favorite"
          >
            {this.favorite ? '★' : '☆'}
          </button>
        </div>
        <div class="body">
          <h3>{this.recipeTitle}</h3>
          {this.category && <span class="category">{this.category}</span>}
          {this.cuisine && <span class="cuisine">{this.cuisine}</span>}
          <div class="actions">
            <slot name="actions"></slot>
          </div>
        </div>
      </div>
    );
  }
}
