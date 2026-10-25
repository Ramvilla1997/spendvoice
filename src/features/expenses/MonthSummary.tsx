import { CATEGORIES, type Expense } from '../../domain/expense.js';
import { totalCents, totalsByCategory } from '../../domain/summary.js';
import { formatMoney } from './format.js';

interface MonthSummaryProps {
  expenses: readonly Expense[];
  currency: string;
  month: string;
}

export function MonthSummary({ expenses, currency, month }: MonthSummaryProps) {
  const totals = totalsByCategory(expenses);
  const nonZero = CATEGORIES.filter((category) => totals[category] > 0);

  return (
    <section className="summary" aria-labelledby="summary-heading">
      <h2 id="summary-heading">This month · {month}</h2>
      <p className="total">{formatMoney(totalCents(expenses), currency)}</p>
      {nonZero.length === 0 ? (
        <p className="muted">Nothing recorded this month.</p>
      ) : (
        <ul className="categories">
          {nonZero.map((category) => (
            <li key={category}>
              <span>{category}</span>
              <span>{formatMoney(totals[category], currency)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
