import { describe, expect, it } from 'vitest';
import type { Expense } from './expense.js';
import { toCsv } from './csv.js';

const base: Expense = {
  id: '1',
  amountCents: 450,
  currency: 'USD',
  category: 'food',
  note: 'coffee',
  occurredOn: '2026-10-25',
  createdAt: '2026-10-25T09:00:00.000Z',
};

describe('toCsv', () => {
  it('writes a header and one row per expense with the amount in major units', () => {
    expect(toCsv([base])).toBe('date,category,amount,currency,note\n2026-10-25,food,4.50,USD,coffee\n');
  });

  it('quotes fields that contain commas, quotes, or line breaks', () => {
    const csv = toCsv([{ ...base, note: 'lunch, "big" deal' }]);
    expect(csv).toContain('"lunch, ""big"" deal"');
  });

  it('neutralises values that spreadsheets would run as formulas', () => {
    const csv = toCsv([{ ...base, note: '=HYPERLINK("http://example.test")' }]);
    expect(csv).toContain(`"'=HYPERLINK(""http://example.test"")"`);
  });

  it('returns only the header when there are no expenses', () => {
    expect(toCsv([])).toBe('date,category,amount,currency,note\n');
  });
});
