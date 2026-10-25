import { CATEGORIES, type Category, type Expense } from './expense.js';

export type CategoryTotals = Record<Category, number>;

export function monthOf(isoDate: string): string {
  return isoDate.slice(0, 7);
}

export function expensesInMonth(expenses: readonly Expense[], month: string): Expense[] {
  return expenses.filter((expense) => monthOf(expense.occurredOn) === month);
}

export function totalCents(expenses: readonly Expense[]): number {
  return expenses.reduce((total, expense) => total + expense.amountCents, 0);
}

export function totalsByCategory(expenses: readonly Expense[]): CategoryTotals {
  const totals = Object.fromEntries(CATEGORIES.map((category) => [category, 0])) as CategoryTotals;
  for (const expense of expenses) {
    totals[expense.category] += expense.amountCents;
  }
  return totals;
}
