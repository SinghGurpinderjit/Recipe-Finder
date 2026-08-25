import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

/** Simple notification toast. Auto-dismisses after `duration` ms if > 0. */
@Component({
  tag: 'app-toast',
  styleUrl: 'app-toast.css',
  shadow: true,
})
export class AppToast {
  @Prop() message: string = '';
  @Prop() type: 'success' | 'error' | 'info' = 'info';
  @Prop() duration: number = 3000;

  @Event() dismiss: EventEmitter<void>;

  componentDidLoad() {
    if (this.duration > 0) {
      setTimeout(() => this.dismiss.emit(), this.duration);
    }
  }

  render() {
    return (
      <div class={`toast ${this.type}`}>
        <span>{this.message}</span>
        <button onClick={() => this.dismiss.emit()} aria-label="Dismiss">✕</button>
      </div>
    );
  }
}
