import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

/** Generic modal dialog. Body content is provided via the default slot. */
@Component({
  tag: 'app-modal',
  styleUrl: 'app-modal.css',
  shadow: true,
})
export class AppModal {
  @Prop() open: boolean = false;
  @Prop() modalTitle: string = '';

  @Event() close: EventEmitter<void>;

  render() {
    if (!this.open) return null;
    return (
      <div class="overlay" onClick={() => this.close.emit()}>
        <div class="dialog" onClick={(e) => e.stopPropagation()}>
          <div class="header">
            <h2>{this.modalTitle}</h2>
            <button class="close-btn" onClick={() => this.close.emit()} aria-label="Close">
              ✕
            </button>
          </div>
          <div class="body">
            <slot></slot>
          </div>
        </div>
      </div>
    );
  }
}
