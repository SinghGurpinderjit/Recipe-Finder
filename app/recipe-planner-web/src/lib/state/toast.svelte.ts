export interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

let nextId = 1;
const state = $state<{ items: ToastItem[] }>({ items: [] });

export const toasts = {
  get items() {
    return state.items;
  },
  show(message: string, type: ToastItem['type'] = 'info') {
    const id = nextId++;
    state.items = [...state.items, { id, message, type }];
  },
  dismiss(id: number) {
    state.items = state.items.filter((t) => t.id !== id);
  },
};
