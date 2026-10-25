import { describe, expect, it } from 'vitest';
import { projectSavingsCents } from './projection.js';

describe('projectSavingsCents', () => {
  it('sums deposits when there is no return', () => {
    expect(projectSavingsCents(10_000, 10, 0)).toBe(1_200_000);
  });

  it('compounds monthly at the assumed 5% annual return', () => {
    // $100 a month for 10 years at 5% a year is about $15,528.23.
    expect(projectSavingsCents(10_000)).toBe(1_552_823);
  });

  it('returns zero when nothing is saved', () => {
    expect(projectSavingsCents(0)).toBe(0);
  });
});
