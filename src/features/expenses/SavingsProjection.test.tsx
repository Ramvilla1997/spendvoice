import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SavingsProjection } from './SavingsProjection.js';

describe('SavingsProjection', () => {
  it('projects 10 years of saving 10% of monthly spending by default', () => {
    render(<SavingsProjection monthlySpendCents={100_000} currency="USD" />);
    expect(screen.getByText('$15,528.23')).toBeInTheDocument();
    expect(screen.getByText(/Saving \$100\.00 a month/)).toBeInTheDocument();
  });

  it('updates the projection when a larger cut is chosen', async () => {
    render(<SavingsProjection monthlySpendCents={100_000} currency="USD" />);
    await userEvent.click(screen.getByRole('button', { name: '20% less' }));
    expect(screen.getByText('$31,056.46')).toBeInTheDocument();
  });
});
