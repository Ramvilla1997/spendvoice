import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App.js';
import { createExpenseRepository, openExpenseDatabase } from './data/expenseRepository.js';

async function renderApp() {
  const db = await openExpenseDatabase(`app-${crypto.randomUUID()}`);
  const repository = createExpenseRepository(db);
  render(<App repository={repository} />);
  await screen.findByText('No expenses yet.');
  return repository;
}

describe('SpendVoice app', () => {
  it('records an expense and shows it in the list and the monthly total', async () => {
    await renderApp();

    await userEvent.type(screen.getByLabelText('Describe the expense'), 'taxi 12 dollars');
    await userEvent.click(screen.getByRole('button', { name: 'Save expense' }));

    const list = await screen.findByRole('list', { name: 'Expenses' });
    expect(within(list).getByText('$12.00')).toBeInTheDocument();
    expect(within(list).getByText(/transport/)).toBeInTheDocument();
    expect(screen.getByText('$12.00', { selector: '.total' })).toBeInTheDocument();
  });

  it('deletes an expense', async () => {
    await renderApp();
    await userEvent.type(screen.getByLabelText('Describe the expense'), 'gym 30');
    await userEvent.click(screen.getByRole('button', { name: 'Save expense' }));

    await userEvent.click(await screen.findByRole('button', { name: /Delete \$30\.00 health expense/ }));

    expect(await screen.findByText('No expenses yet.')).toBeInTheDocument();
  });

  it('disables CSV export until there is data', async () => {
    await renderApp();
    expect(screen.getByRole('button', { name: 'Export CSV' })).toBeDisabled();
  });
});
