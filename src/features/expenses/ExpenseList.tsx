import type { Expense } from '../../domain/expense.js';
import { formatMoney } from './format.js';

interface ExpenseListProps {
  expenses: readonly Expense[];
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return <p className="muted">No expenses yet.</p>;
  }

  return (
    <ul className="expense-list" aria-label="Expenses">
      {expenses.map((expense) => (
        <li key={expense.id}>
          <div>
            <span className="amount">{formatMoney(expense.amountCents, expense.currency)}</span>
            <span className="meta">{expense.category} · {expense.occurredOn}</span>
            {expense.note ? <span className="note">{expense.note}</span> : null}
          </div>
          <button
            type="button"
            className="ghost"
            aria-label={`Delete ${formatMoney(expense.amountCents, expense.currency)} ${expense.category} expense from ${expense.occurredOn}`}
            onClick={() => onDelete(expense.id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
