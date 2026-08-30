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

const LIMITS = {
  title: { min: 5, max: 100 },
  instructions: { min: 20, max: 5000 },
  ingredient: { min: 5, max: 200 },
  customCategory: { min: 5, max: 40 },
  customArea: { min: 5, max: 40 },
  image: { max: 500 },
} as const;

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

  // ---- Per-field validators. Each returns an error message, or null when
  // the value is valid. Used both by validate() on submit AND live on every
  // keystroke, so the two can never drift out of sync with each other. ----

  private validateTitle(value: string): string | null {
    const len = value.trim().length;
    if (len === 0) return 'Title is required.';
    if (len < LIMITS.title.min) return `Title must be at least ${LIMITS.title.min} characters.`;
    if (len > LIMITS.title.max) return `Title must be ${LIMITS.title.max} characters or fewer.`;
    return null;
  }

  private validateImage(value: string): string | null {
    if (value.trim().length > LIMITS.image.max) {
      return `Image URL must be ${LIMITS.image.max} characters or fewer.`;
    }
    return null;
  }

  private validateIngredients(list: string[]): string | null {
    const clean = list.map((i) => i.trim()).filter(Boolean);
    if (clean.length === 0) return 'Add at least one ingredient.';
    if (clean.some((i) => i.length < LIMITS.ingredient.min)) {
      return `Each ingredient must be at least ${LIMITS.ingredient.min} characters.`;
    }
    if (clean.some((i) => i.length > LIMITS.ingredient.max)) {
      return `Each ingredient must be ${LIMITS.ingredient.max} characters or fewer.`;
    }
    return null;
  }

  private validateInstructions(value: string): string | null {
    const len = value.trim().length;
    if (len === 0) return 'Instructions are required.';
    if (len < LIMITS.instructions.min) {
      return `Instructions must be at least ${LIMITS.instructions.min} characters — add a bit more detail.`;
    }
    if (len > LIMITS.instructions.max) return `Instructions must be ${LIMITS.instructions.max} characters or fewer.`;
    return null;
  }

  private validateCategory(value: string): string | null {
    return value.trim() ? null : 'Category is required.';
  }

  private validateCustomCategory(value: string): string | null {
    const len = value.trim().length;
    if (len === 0) return 'Enter a category name.';
    if (len < LIMITS.customCategory.min || len > LIMITS.customCategory.max) {
      return `Category name must be ${LIMITS.customCategory.min}-${LIMITS.customCategory.max} characters.`;
    }
    return null;
  }

  private validateArea(value: string): string | null {
    return value.trim() ? null : 'Cuisine / Area is required.';
  }

  private validateCustomArea(value: string): string | null {
    const len = value.trim().length;
    if (len === 0) return 'Enter a cuisine name.';
    if (len < LIMITS.customArea.min || len > LIMITS.customArea.max) {
      return `Cuisine name must be ${LIMITS.customArea.min}-${LIMITS.customArea.max} characters.`;
    }
    return null;
  }

  /** Sets or clears a single field's error live — the core of "show error
   *  if any, else clear" behavior. Only touches `errors` when the message
   *  actually changed, to avoid redundant re-renders on every keystroke. */
  private setFieldError(key: string, message: string | null) {
    const current = this.errors[key] ?? null;
    if (current === message) return;
    if (message) {
      this.errors = { ...this.errors, [key]: message };
    } else {
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
      // Reset any stale errors when the form is (re)populated, e.g. when
      // switching from "new recipe" to editing an existing one.
      this.errors = {};
    }
  }

  /** Full validation pass, run on submit. Reuses the same per-field
   *  validators as live typing, so submit can never disagree with what
   *  the user already saw on screen. */
  private validate(): boolean {
    const errors: Record<string, string> = {};

    const titleErr = this.validateTitle(this.title);
    if (titleErr) errors.title = titleErr;

    const imageErr = this.validateImage(this.image);
    if (imageErr) errors.image = imageErr;

    const ingredientsErr = this.validateIngredients(this.ingredients);
    if (ingredientsErr) errors.ingredients = ingredientsErr;

    const instructionsErr = this.validateInstructions(this.instructions);
    if (instructionsErr) errors.instructions = instructionsErr;

    const categoryErr = this.validateCategory(this.category);
    if (categoryErr) {
      errors.category = categoryErr;
    } else if (this.category === 'Other') {
      const customCategoryErr = this.validateCustomCategory(this.customCategory);
      if (customCategoryErr) errors.customCategory = customCategoryErr;
    }

    const areaErr = this.validateArea(this.area);
    if (areaErr) {
      errors.area = areaErr;
    } else if (this.area === 'Other') {
      const customAreaErr = this.validateCustomArea(this.customArea);
      if (customAreaErr) errors.customArea = customAreaErr;
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
    this.setFieldError('ingredients', this.validateIngredients(next));
  }

  private addIngredient = () => {
    this.ingredients = [...this.ingredients, ''];
  };

  private removeIngredient = (index: number) => {
    const next = this.ingredients.filter((_, i) => i !== index);
    this.ingredients = next;
    this.setFieldError('ingredients', this.validateIngredients(next));
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <slot name="header"></slot>

        <label>
          <span>Title <span class="required">*</span></span>
          <input
            type="text"
            maxLength={LIMITS.title.max}
            value={this.title}
            onInput={(e) => {
              this.title = (e.target as HTMLInputElement).value;
              this.setFieldError('title', this.validateTitle(this.title));
            }}
          />
          <span class="char-count">{this.title.trim().length}/{LIMITS.title.max}</span>
          {this.errors.title && <span class="error">{this.errors.title}</span>}
        </label>

        <label>
          Image URL
          <input
            type="text"
            maxLength={LIMITS.image.max}
            value={this.image}
            onInput={(e) => {
              this.image = (e.target as HTMLInputElement).value;
              this.setFieldError('image', this.validateImage(this.image));
            }}
          />
          {this.errors.image && <span class="error">{this.errors.image}</span>}
        </label>

        <div class="row">
          <label>
            <span>Category <span class="required">*</span></span>
            <select
              onInput={(e) => {
                this.category = (e.target as HTMLSelectElement).value;
                this.setFieldError('category', this.validateCategory(this.category));
                if (this.category !== 'Other') this.setFieldError('customCategory', null);
                else this.setFieldError('customCategory', this.validateCustomCategory(this.customCategory));
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
            <span>Cuisine / Area <span class="required">*</span></span>
            <select
              onInput={(e) => {
                this.area = (e.target as HTMLSelectElement).value;
                this.setFieldError('area', this.validateArea(this.area));
                if (this.area !== 'Other') this.setFieldError('customArea', null);
                else this.setFieldError('customArea', this.validateCustomArea(this.customArea));
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
                  maxLength={LIMITS.customCategory.max}
                  value={this.customCategory}
                  onInput={(e) => {
                    this.customCategory = (e.target as HTMLInputElement).value;
                    this.setFieldError('customCategory', this.validateCustomCategory(this.customCategory));
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
                  maxLength={LIMITS.customArea.max}
                  value={this.customArea}
                  onInput={(e) => {
                    this.customArea = (e.target as HTMLInputElement).value;
                    this.setFieldError('customArea', this.validateCustomArea(this.customArea));
                  }}
                />
                {this.errors.customArea && <span class="error">{this.errors.customArea}</span>}
              </label>
            )}
          </div>
        )}

        <div class="field">
          <span>Ingredients <span class="required">*</span></span>
          {this.ingredients.map((ing, i) => (
            <div class="ingredient-row">
              <input
                type="text"
                maxLength={LIMITS.ingredient.max}
                value={ing}
                onInput={(e) => this.updateIngredient(i, (e.target as HTMLInputElement).value)}
              />
              <button type="button" onClick={() => this.removeIngredient(i)} aria-label="Remove">✕</button>
            </div>
          ))}
          <button type="button" class="add-btn" onClick={this.addIngredient}>+ Add ingredient</button>
          {this.errors.ingredients && <span class="error">{this.errors.ingredients}</span>}
        </div>

        <label>
          <span>Instructions <span class="required">*</span> </span>
          <textarea
            rows={5}
            maxLength={LIMITS.instructions.max}
            onInput={(e) => {
              this.instructions = (e.target as HTMLTextAreaElement).value;
              this.setFieldError('instructions', this.validateInstructions(this.instructions));
            }}
          >
            {this.instructions}
          </textarea>
          <span class="char-count">{this.instructions.trim().length}/{LIMITS.instructions.max}</span>
          {this.errors.instructions && <span class="error">{this.errors.instructions}</span>}
        </label>

        <div class="footer">
          <slot name="footer"></slot>
          <button type="button" class="cancel-btn" onClick={() => this.cancel.emit()}>Cancel</button>
          <button type="submit" class="save-btn">Save Recipe</button>
        </div>
      </form>
    );
  }
}