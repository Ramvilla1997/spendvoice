import { CATEGORIES, type Category, type NewExpense } from '../domain/expense.js';
import { findNumberWords } from './numberWords.js';

export interface ParseOptions {
  /** Local calendar date as YYYY-MM-DD, used for "today" and "yesterday". */
  today: string;
  defaultCurrency: string;
}

export type ParseResult = { ok: true; expense: NewExpense } | { ok: false; reason: string };

const MAX_AMOUNT_CENTS = 100_000_000;
const MAX_NOTE_LENGTH = 280;

const CURRENCY_RULES: ReadonlyArray<{ pattern: RegExp; code: string }> = [
  { pattern: /\$|\busd\b|\bdollars?\b/, code: 'USD' },
  { pattern: /€|\beuros?\b/, code: 'EUR' },
  { pattern: /£|\bpounds?\b/, code: 'GBP' },
  { pattern: /₹|\brupees?\b|\binr\b/, code: 'INR' },
  { pattern: /\bcad\b|\bcanadian\b/, code: 'CAD' },
];

const CATEGORY_KEYWORDS: Record<Exclude<Category, 'other'>, RegExp> = {
  food: /\b(coffee|lunch|dinner|breakfast|groceries|restaurant|pizza|snack|food|tea)\b/,
  transport: /\b(taxi|uber|bus|train|fuel|gas|parking|toll|transit)\b/,
  housing: /\b(rent|electricity|internet|water|utilities|mortgage)\b/,
  entertainment: /\b(movie|movies|concert|netflix|games?|tickets)\b/,
  health: /\b(pharmacy|medicine|doctor|gym|dentist|prescription)\b/,
  shopping: /\b(clothes|shoes|amazon|shopping|gifts?)\b/,
};

/** Turns a spoken or typed sentence into an expense. Never guesses a missing amount. */
export function parseExpense(input: string, options: ParseOptions): ParseResult {
  const text = normalizeNumbers(input.trim().toLowerCase());
  if (text === '') {
    return { ok: false, reason: 'Type or speak an expense, like "coffee 4.50".' };
  }

  const amountCents = extractAmountCents(text);
  if (amountCents === null) {
    return { ok: false, reason: 'I could not find an amount. Try "coffee 4.50".' };
  }
  if (amountCents <= 0) {
    return { ok: false, reason: 'The amount must be more than zero.' };
  }
  if (amountCents > MAX_AMOUNT_CENTS) {
    return { ok: false, reason: 'That amount is too large to record.' };
  }

  return {
    ok: true,
    expense: {
      amountCents,
      currency: detectCurrency(text, options.defaultCurrency),
      category: detectCategory(text),
      note: input.trim().slice(0, MAX_NOTE_LENGTH),
      occurredOn: /\byesterday\b/.test(text) ? shiftDate(options.today, -1) : options.today,
    },
  };
}

/** "1,200" becomes "1200" and "4,50" becomes "4.50", so both read as numbers. */
function normalizeNumbers(text: string): string {
  let result = text;
  let previous: string;
  do {
    previous = result;
    result = result.replace(/(\d),(\d{3})(?!\d)/g, '$1$2');
  } while (result !== previous);
  return result.replace(/(\d),(\d{1,2})(?!\d)/g, '$1.$2');
}

function extractAmountCents(text: string): number | null {
  const digits = text.match(/\d+(?:\.\d{1,2})?/);
  if (digits) {
    return Math.round(Number(digits[0]) * 100);
  }
  const words = findNumberWords(text);
  return words ? words.value * 100 : null;
}

function detectCurrency(text: string, fallback: string): string {
  return CURRENCY_RULES.find((rule) => rule.pattern.test(text))?.code ?? fallback;
}

function detectCategory(text: string): Category {
  const match = CATEGORIES.find((category) => category !== 'other' && CATEGORY_KEYWORDS[category].test(text));
  return match ?? 'other';
}

function shiftDate(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
