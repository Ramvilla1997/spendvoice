import { describe, expect, it } from 'vitest';
import { dayLabel, monthName } from './format.js';

describe('dayLabel', () => {
  it('names today and yesterday', () => {
    expect(dayLabel('2026-10-25', '2026-10-25')).toBe('Today');
    expect(dayLabel('2026-10-24', '2026-10-25')).toBe('Yesterday');
  });

  it('crosses a month boundary for yesterday', () => {
    expect(dayLabel('2026-10-31', '2026-11-01')).toBe('Yesterday');
  });

  it('formats older dates', () => {
    expect(dayLabel('2026-10-20', '2026-10-25')).toBe('Tue, Oct 20');
  });
});

describe('monthName', () => {
  it('names the month without shifting time zones', () => {
    expect(monthName('2026-10')).toBe('October');
  });
});
