import type { Expense } from '../../domain/expense.js';
import { CATEGORY_COLORS, CATEGORY_LABELS } from './categories.js';
import { dayLabel, formatMoney } from './format.js';
import { TrashIcon } from './icons.js';

interface ExpenseListProps {
  expenses: readonly Expense[];
  today: string;
  onDelete: (id: string) => void;
}

function groupByDay(expenses: readonly Expense[]): Array<[string, Expense[]]> {
  const groups = new Map<string, Expense[]>();
  for (const expense of expenses) {
    groups.set(expense.occurredOn, [...(groups.get(expense.occurredOn) ?? []), expense]);
  }
  return [...groups.entries()];
}

export function ExpenseList({ expenses, today, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="empty">
        <p>No expenses yet.</p>
        <p className="muted">Tap an example above or say what you spent.</p>
      </div>
    );
  }

  return (
    <ul className="expense-list" aria-label="Expenses">
      {groupByDay(expenses).map(([day, items]) => (
        <li key={day} className="day">
          <h3 className="day__label">{dayLabel(day, today)}</h3>
          <ul className="day__items">
            {items.map((expense) => (
              <li key={expense.id} className="row">
                <span className="dot" style={{ background: CATEGORY_COLORS[expense.category] }} aria-hidden="true" />
                <div className="row__text">
                  <span className="row__note">{expense.note || CATEGORY_LABELS[expense.category]}</span>
                  <span className="row__meta">{CATEGORY_LABELS[expense.category]}</span>
                </div>
                <span className="row__amount">{formatMoney(expense.amountCents, expense.currency)}</span>
                <button
                  type="button"
                  className="icon-button"
                  aria-label={`Delete ${formatMoney(expense.amountCents, expense.currency)} ${expense.category} expense from ${expense.occurredOn}`}
                  onClick={() => onDelete(expense.id)}
                >
                  <TrashIcon />
                </button>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
