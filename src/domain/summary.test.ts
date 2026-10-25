import { describe, expect, it } from 'vitest';
import type { Expense } from './expense.js';
import { expensesInMonth, totalCents, totalsByCategory } from './summary.js';

const make = (overrides: Partial<Expense>): Expense => ({
  id: crypto.randomUUID(),
  amountCents: 100,
  currency: 'USD',
  category: 'other',
  note: '',
  occurredOn: '2026-10-01',
  createdAt: '2026-10-01T00:00:00.000Z',
  ...overrides,
});

describe('summary', () => {
  const expenses = [
    make({ amountCents: 450, category: 'food', occurredOn: '2026-10-03' }),
    make({ amountCents: 1200, category: 'transport', occurredOn: '2026-10-20' }),
    make({ amountCents: 900, category: 'food', occurredOn: '2026-09-30' }),
  ];

  it('keeps only expenses from the requested month', () => {
    expect(expensesInMonth(expenses, '2026-10')).toHaveLength(2);
  });

  it('adds amounts in integer cents', () => {
    expect(totalCents(expenses)).toBe(2550);
  });

  it('totals each category, including zeros for unused ones', () => {
    const totals = totalsByCategory(expensesInMonth(expenses, '2026-10'));
    expect(totals.food).toBe(450);
    expect(totals.transport).toBe(1200);
    expect(totals.housing).toBe(0);
  });
});
