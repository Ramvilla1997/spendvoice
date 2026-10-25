import { CATEGORIES, type Expense } from '../../domain/expense.js';
import { totalCents, totalsByCategory } from '../../domain/summary.js';
import { CATEGORY_COLORS, CATEGORY_LABELS } from './categories.js';
import { formatMoney, monthName } from './format.js';

interface MonthSummaryProps {
  expenses: readonly Expense[];
  currency: string;
  month: string;
}

export function MonthSummary({ expenses, currency, month }: MonthSummaryProps) {
  const totals = totalsByCategory(expenses);
  const used = CATEGORIES.filter((category) => totals[category] > 0).sort((a, b) => totals[b] - totals[a]);
  const largest = used.length > 0 ? totals[used[0]!] : 0;

  return (
    <section className="hero" aria-labelledby="summary-heading">
      <h2 id="summary-heading">Spent in {monthName(month)}</h2>
      <p className="total">{formatMoney(totalCents(expenses), currency)}</p>
      <p className="hero__sub">
        {expenses.length === 1 ? '1 expense' : `${expenses.length} expenses`}
      </p>

      {used.length > 0 ? (
        <ul className="breakdown" aria-label="Spending by category">
          {used.map((category) => (
            <li key={category}>
              <span className="breakdown__label">{CATEGORY_LABELS[category]}</span>
              <span className="breakdown__track" aria-hidden="true">
                <span
                  className="breakdown__fill"
                  style={{ width: `${(totals[category] / largest) * 100}%`, background: CATEGORY_COLORS[category] }}
                />
              </span>
              <span className="breakdown__value">{formatMoney(totals[category], currency)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
