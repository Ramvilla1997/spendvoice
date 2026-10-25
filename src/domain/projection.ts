export const PROJECTION_YEARS = 10;
export const ASSUMED_ANNUAL_RETURN = 0.05;

/**
 * Future value of saving the same amount every month, compounded monthly.
 * Returns whole cents. With a zero return it is simply the sum of deposits.
 */
export function projectSavingsCents(monthlyCents: number, years = PROJECTION_YEARS, annualReturn = ASSUMED_ANNUAL_RETURN): number {
  const months = years * 12;
  const monthlyRate = annualReturn / 12;
  if (monthlyRate === 0) {
    return Math.round(monthlyCents * months);
  }
  return Math.round(monthlyCents * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate));
}
