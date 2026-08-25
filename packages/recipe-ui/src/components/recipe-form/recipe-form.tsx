import { Component, Prop, State, Event, EventEmitter, h, Watch } from '@stencil/core';

export interface RecipeFormData {
  id?: string;
  title: string;
  image: string;
  category: string;
  ingredients: string[];
  instructions: string;
}

/**
 * Add/edit form for user-created recipes. Performs client-side validation
 * (title required, at least one non-empty ingredient, instructions required)
 * and only emits `save` once the data is valid.
 */
@Component({
  tag: 'recipe-form',
  styleUrl: 'recipe-form.css',
  shadow: true,
})
export class RecipeForm {
  /** Pass an existing recipe (as a JSON string or object) to edit it */
  @Prop() initialData: RecipeFormData | string;

  @State() title = '';
  @State() image = '';
  @State() category = '';
  @State() ingredients: string[] = [''];
  @State() instructions = '';
  @State() errors: Record<string, string> = {};

  @Event() save: EventEmitter<RecipeFormData>;
  @Event() cancel: EventEmitter<void>;

  componentWillLoad() {
    this.loadInitialData();
  }

  @Watch('initialData')
  onInitialDataChange() {
    this.loadInitialData();
  }

  private loadInitialData() {
    let data: RecipeFormData | undefined;
    if (typeof this.initialData === 'string' && this.initialData) {
      try {
        data = JSON.parse(this.initialData);
      } catch {
        data = undefined;
      }
    } else if (this.initialData && typeof this.initialData === 'object') {
      data = this.initialData as RecipeFormData;
    }
    if (data) {
      this.title = data.title ?? '';
      this.image = data.image ?? '';
      this.category = data.category ?? '';
      this.ingredients = data.ingredients?.length ? [...data.ingredients] : [''];
      this.instructions = data.instructions ?? '';
    }
  }

  private validate(): boolean {
    const errors: Record<string, string> = {};
    if (!this.title.trim()) errors.title = 'Title is required.';
    if (!this.category.trim()) errors.category = 'Category is required.';
    const cleanIngredients = this.ingredients.map((i) => i.trim()).filter(Boolean);
    if (cleanIngredients.length === 0) errors.ingredients = 'Add at least one ingredient.';
    if (!this.instructions.trim()) errors.instructions = 'Instructions are required.';
    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  private onSubmit = (e: Event) => {
    e.preventDefault();
    if (!this.validate()) return;
    const data: RecipeFormData = {
      id: (this.initialData as RecipeFormData)?.id,
      title: this.title.trim(),
      image: this.image.trim(),
      category: this.category.trim(),
      ingredients: this.ingredients.map((i) => i.trim()).filter(Boolean),
      instructions: this.instructions.trim(),
    };
    this.save.emit(data);
  };

  private updateIngredient(index: number, value: string) {
    const next = [...this.ingredients];
    next[index] = value;
    this.ingredients = next;
  }

  private addIngredient = () => {
    this.ingredients = [...this.ingredients, ''];
  };

  private removeIngredient = (index: number) => {
    this.ingredients = this.ingredients.filter((_, i) => i !== index);
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <slot name="header"></slot>

        <label>
          Title
          <input
            type="text"
            value={this.title}
            onInput={(e) => (this.title = (e.target as HTMLInputElement).value)}
          />
          {this.errors.title && <span class="error">{this.errors.title}</span>}
        </label>

        <label>
          Image URL
          <input
            type="text"
            value={this.image}
            onInput={(e) => (this.image = (e.target as HTMLInputElement).value)}
          />
        </label>

        <label>
          Category
          <input
            type="text"
            value={this.category}
            onInput={(e) => (this.category = (e.target as HTMLInputElement).value)}
          />
          {this.errors.category && <span class="error">{this.errors.category}</span>}
        </label>

        <div class="field">
          <span>Ingredients</span>
          {this.ingredients.map((ing, i) => (
            <div class="ingredient-row">
              <input
                type="text"
                value={ing}
                onInput={(e) => this.updateIngredient(i, (e.target as HTMLInputElement).value)}
              />
              <button type="button" onClick={() => this.removeIngredient(i)} aria-label="Remove">
                ✕
              </button>
            </div>
          ))}
          <button type="button" class="add-btn" onClick={this.addIngredient}>
            + Add ingredient
          </button>
          {this.errors.ingredients && <span class="error">{this.errors.ingredients}</span>}
        </div>

        <label>
          Instructions
          <textarea
            rows={5}
            onInput={(e) => (this.instructions = (e.target as HTMLTextAreaElement).value)}
          >
            {this.instructions}
          </textarea>
          {this.errors.instructions && <span class="error">{this.errors.instructions}</span>}
        </label>

        <div class="footer">
          <slot name="footer"></slot>
          <button type="button" class="cancel-btn" onClick={() => this.cancel.emit()}>
            Cancel
          </button>
          <button type="submit" class="save-btn">
            Save Recipe
          </button>
        </div>
      </form>
    );
  }
}
