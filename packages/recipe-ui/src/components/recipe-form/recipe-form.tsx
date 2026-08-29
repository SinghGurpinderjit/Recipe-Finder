import { Component, Prop, State, Event, EventEmitter, h, Watch } from '@stencil/core';

export interface RecipeFormData {
  id?: string;
  title: string;
  image: string;
  category: string;
  cuisine: string;
  ingredients: string[];
  instructions: string;
}

const DEFAULT_CATEGORIES = [
  'Beef', 'Breakfast', 'Chicken', 'Dessert', 'Goat', 'Lamb',
  'Miscellaneous', 'Pasta', 'Pork', 'Seafood', 'Side', 'Starter',
  'Vegan', 'Vegetarian', 'Other',
];

const DEFAULT_AREAS = [
  'American', 'British', 'Chinese', 'Croatian', 'Dutch', 'Egyptian',
  'Filipino', 'French', 'Greek', 'Indian', 'Irish', 'Italian', 'Jamaican',
  'Japanese', 'Kenyan', 'Malaysian', 'Mexican', 'Moroccan', 'Polish',
  'Portuguese', 'Russian', 'Spanish', 'Thai', 'Tunisian', 'Turkish',
  'Vietnamese', 'Other',
];

@Component({
  tag: 'recipe-form',
  styleUrl: 'recipe-form.css',
  shadow: true,
})
export class RecipeForm {
  @Prop() initialData: RecipeFormData | string;
  @Prop() categories: string[] = DEFAULT_CATEGORIES;
  @Prop() extraCategories: string[] = [];
  @Prop() areas: string[] = DEFAULT_AREAS;
  @Prop() extraAreas: string[] = [];

  @State() title = '';
  @State() image = '';
  @State() category = '';
  @State() customCategory = '';
  @State() area = '';
  @State() customArea = '';
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

  private mergeList(base: string[], extra: string[]): string[] {
    const withoutOther = base.filter((a) => a !== 'Other');
    const merged = [...withoutOther];
    for (const e of extra) {
      if (e && !merged.includes(e)) merged.push(e);
    }
    merged.push('Other');
    return merged;
  }

  private get fullCategoryList(): string[] {
    return this.mergeList(this.categories, this.extraCategories);
  }

  private get fullAreaList(): string[] {
    return this.mergeList(this.areas, this.extraAreas);
  }

  /** Removes a field's error as soon as it becomes valid, without waiting
   *  for the next full submit — called from each field's input handler. */
  private clearErrorIf(key: string, isNowValid: boolean) {
    if (isNowValid && this.errors[key]) {
      const next = { ...this.errors };
      delete next[key];
      this.errors = next;
    }
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
      this.ingredients = data.ingredients?.length ? [...data.ingredients] : [''];
      this.instructions = data.instructions ?? '';

      const knownCategories = this.fullCategoryList.filter((a) => a !== 'Other');
      if (data.category && !knownCategories.includes(data.category)) {
        this.category = 'Other';
        this.customCategory = data.category;
      } else {
        this.category = data.category ?? '';
        this.customCategory = '';
      }

      const knownAreas = this.fullAreaList.filter((a) => a !== 'Other');
      if (data.cuisine && !knownAreas.includes(data.cuisine)) {
        this.area = 'Other';
        this.customArea = data.cuisine;
      } else {
        this.area = data.cuisine ?? '';
        this.customArea = '';
      }
    }
  }

  private validate(): boolean {
    const errors: Record<string, string> = {};

    if (!this.title.trim())
      errors.title = 'Title is required.';

    const cleanIngredients = this.ingredients.map((i) => i.trim()).filter(Boolean);

    if (cleanIngredients.length === 0)
      errors.ingredients = 'Add at least one ingredient.';

    if (!this.instructions.trim())
      errors.instructions = 'Instructions are required.';

    if (!this.category.trim()) {
      errors.category = 'Category is required.';
    }
    else if (this.category === 'Other' && !this.customCategory.trim()) {
      errors.customCategory = 'Enter a category name.';
    }

    if (!this.area.trim()) {
      errors.area = 'Cuisine / Area is required.';
    }
    else if (this.area === 'Other' && !this.customArea.trim()) {
      errors.customArea = 'Enter a cuisine name.';
    }

    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  private onSubmit = (e: Event) => {
    e.preventDefault();
    if (!this.validate()) return;
    const resolvedCategory = this.category === 'Other' ? this.customCategory.trim() : this.category;
    const resolvedArea = this.area === 'Other' ? this.customArea.trim() : this.area;
    const data: RecipeFormData = {
      id: (this.initialData as RecipeFormData)?.id,
      title: this.title.trim(),
      image: this.image.trim(),
      category: resolvedCategory,
      cuisine: resolvedArea,
      ingredients: this.ingredients.map((i) => i.trim()).filter(Boolean),
      instructions: this.instructions.trim(),
    };
    this.save.emit(data);
  };

  private updateIngredient(index: number, value: string) {
    const next = [...this.ingredients];
    next[index] = value;
    this.ingredients = next;
    this.clearErrorIf('ingredients', next.some((i) => i.trim()));
  }

  private addIngredient = () => {
    this.ingredients = [...this.ingredients, ''];
  };

  private removeIngredient = (index: number) => {
    this.ingredients = this.ingredients.filter((_, i) => i !== index);
    const next = this.ingredients.filter((_, i) => i !== index);
    this.ingredients = next;
    this.clearErrorIf('ingredients', next.some((i) => i.trim()));
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <slot name="header"></slot>

        <label>
          Title
          <input type="text" value={this.title} onInput={(e) => {
            (this.title = (e.target as HTMLInputElement).value)
            this.clearErrorIf('title', !!this.title.trim());
          }
          } />
          {this.errors.title && <span class="error">{this.errors.title}</span>}
        </label>

        <label>
          Image URL
          <input type="text" value={this.image} onInput={(e) => (this.image = (e.target as HTMLInputElement).value)} />
        </label>

        <div class="row">
          <label>
            Category
            <select
              onInput={(e) => {
                (this.category = (e.target as HTMLSelectElement).value)
                this.clearErrorIf('category', !!this.category);
                if (this.category !== 'Other')
                  this.clearErrorIf('customCategory', true);
              }}
            >
              <option value="" selected={this.category === ''}>Select a category…</option>
              {this.fullCategoryList.map((c) => (
                <option value={c} selected={c === this.category}>{c}</option>
              ))}
            </select>
            {this.errors.category && <span class="error">{this.errors.category}</span>}
          </label>

          <label>
            Cuisine / Area
            <select onInput={(e) => {
              (this.area = (e.target as HTMLSelectElement).value)
              this.clearErrorIf('area', !!this.area);
              if (this.area !== 'Other')
                this.clearErrorIf('customArea', true);
            }}
            >
              <option value="" selected={this.area === ''}>Select a cuisine…</option>
              {this.fullAreaList.map((a) => (
                <option value={a} selected={a === this.area}>{a}</option>
              ))}
            </select>
            {this.errors.area && <span class="error">{this.errors.area}</span>}
          </label>
        </div>

        {(this.category === 'Other' || this.area === 'Other') && (
          <div class="row">
            {this.category === 'Other' && (
              <label class="custom-area-field">
                Enter category name
                <input
                  type="text"
                  placeholder="e.g. Brunch"
                  value={this.customCategory}
                  onInput={(e) => {
                    (this.customCategory = (e.target as HTMLInputElement).value)
                    this.customCategory = (e.target as HTMLInputElement).value;
                    this.clearErrorIf('customCategory', !!this.customCategory.trim());
                  }}
                />
                {this.errors.customCategory && <span class="error">{this.errors.customCategory}</span>}
              </label>
            )}
            {this.area === 'Other' && (
              <label class="custom-area-field">
                Enter cuisine name
                <input
                  type="text"
                  placeholder="e.g. Ethiopian"
                  value={this.customArea}
                  onInput={(e) => {
                    this.customArea = (e.target as HTMLInputElement).value;
                    this.clearErrorIf('customArea', !!this.customArea.trim());
                  }}
                />
                {this.errors.customArea && <span class="error">{this.errors.customArea}</span>}
              </label>
            )}
          </div>
        )}

        <div class="field">
          <span>Ingredients</span>
          {this.ingredients.map((ing, i) => (
            <div class="ingredient-row">
              <input type="text" value={ing} onInput={(e) => this.updateIngredient(i, (e.target as HTMLInputElement).value)} />
              <button type="button" onClick={() => this.removeIngredient(i)} aria-label="Remove">✕</button>
            </div>
          ))}
          <button type="button" class="add-btn" onClick={this.addIngredient}>+ Add ingredient</button>
          {this.errors.ingredients && <span class="error">{this.errors.ingredients}</span>}
        </div>

        <label>
          Instructions
          <textarea
            rows={5}
            onInput={(e) => {
              this.instructions = (e.target as HTMLTextAreaElement).value;
              this.clearErrorIf('instructions', !!this.instructions.trim());
            }}
          >
            {this.instructions}
          </textarea>
          {this.errors.instructions && <span class="error">{this.errors.instructions}</span>}
        </label>

        <div class="footer">
          <slot name="footer"></slot>
          <button type="button" class="cancel-btn" onClick={() => this.cancel.emit()}>Cancel</button>
          <button type="submit" class="save-btn">Save Recipe</button>
        </div>
      </form >
    );
  }
}