import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { ExpenseRepository } from './data/expenseRepository.js';
import { toCsv } from './domain/csv.js';
import type { Expense, NewExpense } from './domain/expense.js';
import { expensesInMonth, totalCents } from './domain/summary.js';
import { ExpenseForm } from './features/expenses/ExpenseForm.js';
import { ExpenseList } from './features/expenses/ExpenseList.js';
import { MonthSummary } from './features/expenses/MonthSummary.js';
import { SavingsProjection } from './features/expenses/SavingsProjection.js';
import { localIsoDate } from './features/expenses/format.js';

export const DEFAULT_CURRENCY = 'USD';
const EXPENSES_KEY = ['expenses'] as const;

export function App({ repository }: { repository: ExpenseRepository }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ExpenseScreen repository={repository} />
    </QueryClientProvider>
  );
}

function ExpenseScreen({ repository }: { repository: ExpenseRepository }) {
  const queryClient = useQueryClient();
  const today = localIsoDate();
  const month = today.slice(0, 7);

  const expenses = useQuery({ queryKey: EXPENSES_KEY, queryFn: () => repository.list() });
  const refresh = () => queryClient.invalidateQueries({ queryKey: EXPENSES_KEY });
  const add = useMutation({ mutationFn: (expense: NewExpense) => repository.add(expense), onSuccess: refresh });
  const remove = useMutation({ mutationFn: (id: string) => repository.remove(id), onSuccess: refresh });

  const all = expenses.data ?? [];
  const monthly = expensesInMonth(all, month);

  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">SpendVoice</span>
        <span className="badge">On this device only</span>
      </header>

      <main className="page">
        <MonthSummary expenses={monthly} currency={DEFAULT_CURRENCY} month={month} />

        <ExpenseForm today={today} defaultCurrency={DEFAULT_CURRENCY} onSave={(expense) => add.mutateAsync(expense)} />

        <section className="card" aria-labelledby="list-heading">
          <div className="section-header">
            <h2 id="list-heading">Recent</h2>
            <button type="button" className="secondary" disabled={all.length === 0} onClick={() => downloadCsv(all)}>
              Export CSV
            </button>
          </div>
          {expenses.isError ? <p role="alert" className="error">Your expenses could not be loaded.</p> : null}
          {remove.isError ? <p role="alert" className="error">That expense could not be deleted.</p> : null}
          <ExpenseList expenses={all} today={today} onDelete={(id) => remove.mutate(id)} />
        </section>

        {monthly.length > 0 ? <SavingsProjection monthlySpendCents={totalCents(monthly)} currency={DEFAULT_CURRENCY} /> : null}
      </main>

      <footer className="footer muted">
        No account, no tracking. Your expenses are stored in this browser and work offline.
      </footer>
    </div>
  );
}

function downloadCsv(expenses: readonly Expense[]) {
  const url = URL.createObjectURL(new Blob([toCsv(expenses)], { type: 'text/csv' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `spendvoice-${localIsoDate()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
