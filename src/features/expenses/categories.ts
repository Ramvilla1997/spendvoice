import type { Category } from '../../domain/expense.js';

export const CATEGORY_LABELS: Record<Category, string> = {
  food: 'Food',
  transport: 'Transport',
  housing: 'Housing',
  entertainment: 'Fun',
  health: 'Health',
  shopping: 'Shopping',
  other: 'Other',
};

/** Used only as small accents next to text, never as the only signal. */
export const CATEGORY_COLORS: Record<Category, string> = {
  food: '#f59e0b',
  transport: '#3b82f6',
  housing: '#8b5cf6',
  entertainment: '#ec4899',
  health: '#10b981',
  shopping: '#ef4444',
  other: '#94a3b8',
};
