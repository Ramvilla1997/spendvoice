import type { Expense } from './expense.js';

const HEADER = ['date', 'category', 'amount', 'currency', 'note'];
const FORMULA_START = /^[=+\-@\t\r]/;

/** Spreadsheets run cells that start with these characters as formulas, so they get a leading apostrophe. */
function escapeCell(value: string): string {
  const safe = FORMULA_START.test(value) ? `'${value}` : value;
  return /[",\n\r]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe;
}

export function toCsv(expenses: readonly Expense[]): string {
  const rows = expenses.map((expense) =>
    [
      expense.occurredOn,
      expense.category,
      (expense.amountCents / 100).toFixed(2),
      expense.currency,
      expense.note,
    ].map(escapeCell).join(','),
  );
  return [HEADER.join(','), ...rows].join('\n') + '\n';
}
