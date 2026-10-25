import { describe, expect, it } from 'vitest';
import { findNumberWords } from './numberWords.js';

describe('findNumberWords', () => {
  it.each([
    ['five', 5],
    ['twenty five', 25],
    ['one hundred', 100],
    ['two hundred and five', 205],
    ['one thousand two hundred', 1200],
  ])('reads "%s" as %i', (text, value) => {
    expect(findNumberWords(text)).toEqual({ value });
  });

  it('returns null when there are no number words', () => {
    expect(findNumberWords('coffee please')).toBeNull();
  });
});
