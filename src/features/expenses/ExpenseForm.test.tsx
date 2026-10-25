import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ExpenseForm } from './ExpenseForm.js';

function renderForm(onSave = vi.fn().mockResolvedValue(undefined)) {
  render(<ExpenseForm today="2026-10-25" defaultCurrency="USD" onSave={onSave} />);
  return { onSave, input: screen.getByLabelText('Describe the expense'), save: screen.getByRole('button', { name: 'Save expense' }) };
}

describe('ExpenseForm', () => {
  it('shows a parsed preview and enables saving once the text is understood', async () => {
    const { input, save } = renderForm();
    expect(save).toBeDisabled();

    await userEvent.type(input, 'coffee 4.50');

    expect(screen.getByText('$4.50 · food · 2026-10-25')).toBeInTheDocument();
    expect(save).toBeEnabled();
  });

  it('saves the parsed expense in integer cents', async () => {
    const { input, save, onSave } = renderForm();
    await userEvent.type(input, 'coffee 4.50');
    await userEvent.click(save);

    expect(onSave).toHaveBeenCalledWith({
      amountCents: 450,
      currency: 'USD',
      category: 'food',
      note: 'coffee 4.50',
      occurredOn: '2026-10-25',
    });
  });

  it('keeps the text and shows a message when saving fails', async () => {
    const { input, save } = renderForm(vi.fn().mockRejectedValue(new Error('disk full')));
    await userEvent.type(input, 'coffee 4.50');
    await userEvent.click(save);

    expect(await screen.findByRole('alert')).toHaveTextContent('could not be saved');
    expect(input).toHaveValue('coffee 4.50');
  });

  it('does not offer voice input where the browser lacks it', () => {
    renderForm();
    expect(screen.queryByRole('button', { name: /speak/i })).not.toBeInTheDocument();
  });
});
