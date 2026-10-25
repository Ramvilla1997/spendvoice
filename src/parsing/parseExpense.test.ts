import { describe, expect, it } from 'vitest';
import { parseExpense } from './parseExpense.js';

const options = { today: '2026-10-25', defaultCurrency: 'USD' };

function parsed(text: string) {
  const result = parseExpense(text, options);
  if (!result.ok) {
    throw new Error(`expected "${text}" to parse, got: ${result.reason}`);
  }
  return result.expense;
}

describe('parseExpense: amounts', () => {
  it('reads a decimal amount and categorises it', () => {
    expect(parsed('coffee 4.50')).toMatchObject({ amountCents: 450, category: 'food', currency: 'USD' });
  });

  it('reads an amount after a currency word', () => {
    expect(parsed('spent $12 on taxi')).toMatchObject({ amountCents: 1200, category: 'transport' });
  });

  it('treats a comma followed by three digits as a thousands separator', () => {
    expect(parsed('paid 1,200 rent')).toMatchObject({ amountCents: 120000, category: 'housing' });
  });

  it('treats a comma followed by one or two digits as a decimal separator', () => {
    expect(parsed('lunch 4,50 euros')).toMatchObject({ amountCents: 450, currency: 'EUR' });
  });

  it('reads spelled-out numbers', () => {
    expect(parsed('twenty five dollars for groceries')).toMatchObject({ amountCents: 2500, category: 'food' });
  });

  it('reads spelled-out hundreds', () => {
    expect(parsed('one hundred twelve euros lunch')).toMatchObject({ amountCents: 11200, currency: 'EUR' });
  });

  it('rejects text without an amount rather than guessing', () => {
    expect(parseExpense('hello there', options)).toEqual({
      ok: false,
      reason: 'I could not find an amount. Try "coffee 4.50".',
    });
  });

  it('rejects zero', () => {
    expect(parseExpense('zero dollars coffee', options)).toEqual({
      ok: false,
      reason: 'The amount must be more than zero.',
    });
  });

  it('rejects amounts above the limit', () => {
    expect(parseExpense('house 2000000', options)).toEqual({
      ok: false,
      reason: 'That amount is too large to record.',
    });
  });

  it('asks for input when empty', () => {
    expect(parseExpense('   ', options).ok).toBe(false);
  });
});

describe('parseExpense: category, date, currency', () => {
  it('falls back to other when no keyword matches', () => {
    expect(parsed('birthday card 3')).toMatchObject({ category: 'other' });
  });

  it('does not match a keyword inside a longer word', () => {
    expect(parsed('bustling market 8')).toMatchObject({ category: 'other' });
  });

  it('dates yesterday one day before today', () => {
    expect(parsed('movie 15 yesterday')).toMatchObject({ occurredOn: '2026-10-24' });
  });

  it('crosses a month boundary when going back a day', () => {
    const result = parseExpense('movie 15 yesterday', { today: '2026-11-01', defaultCurrency: 'USD' });
    expect(result.ok && result.expense.occurredOn).toBe('2026-10-31');
  });

  it('uses the default currency when none is spoken', () => {
    expect(parsed('gym 30')).toMatchObject({ currency: 'USD', category: 'health' });
  });

  it('keeps the original wording as the note', () => {
    expect(parsed('  Taxi to the airport 42  ')).toMatchObject({ note: 'Taxi to the airport 42' });
  });
});
