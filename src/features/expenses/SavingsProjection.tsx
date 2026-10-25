import { useState } from 'react';
import { ASSUMED_ANNUAL_RETURN, PROJECTION_YEARS, projectSavingsCents } from '../../domain/projection.js';
import { formatMoney } from './format.js';

const CUT_OPTIONS = [10, 20, 30] as const;

interface SavingsProjectionProps {
  monthlySpendCents: number;
  currency: string;
}

export function SavingsProjection({ monthlySpendCents, currency }: SavingsProjectionProps) {
  const [cutPercent, setCutPercent] = useState<(typeof CUT_OPTIONS)[number]>(10);
  const monthlySavings = Math.round((monthlySpendCents * cutPercent) / 100);
  const projected = projectSavingsCents(monthlySavings);

  return (
    <section className="card projection" aria-labelledby="projection-heading">
      <h2 id="projection-heading">{PROJECTION_YEARS}-year savings</h2>
      <div className="segmented" role="group" aria-label="Spend less by">
        {CUT_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={cutPercent === option}
            onClick={() => setCutPercent(option)}
          >
            {option}% less
          </button>
        ))}
      </div>
      <p className="projection__value">{formatMoney(projected, currency)}</p>
      <p className="muted">
        Saving {formatMoney(monthlySavings, currency)} a month, based on this month&apos;s spending, at an assumed{' '}
        {ASSUMED_ANNUAL_RETURN * 100}% yearly return. An estimate, not financial advice.
      </p>
    </section>
  );
}
