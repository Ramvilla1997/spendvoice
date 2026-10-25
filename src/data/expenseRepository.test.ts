import { describe, expect, it } from 'vitest';
import { createExpenseRepository, openExpenseDatabase } from './expenseRepository.js';

async function createTestRepository() {
  const db = await openExpenseDatabase(`test-${crypto.randomUUID()}`);
  let counter = 0;
  return createExpenseRepository(
    db,
    () => `2026-10-25T09:00:0${counter}.000Z`,
    () => `id-${++counter}`,
  );
}

const input = {
  amountCents: 450,
  currency: 'USD',
  category: 'food' as const,
  note: 'coffee',
  occurredOn: '2026-10-25',
};

describe('expenseRepository', () => {
  it('stores an expense and returns it with an id and timestamp', async () => {
    const repository = await createTestRepository();
    const saved = await repository.add(input);
    expect(saved).toEqual({ ...input, id: 'id-1', createdAt: '2026-10-25T09:00:01.000Z' });
  });

  it('lists the most recent expenses first', async () => {
    const repository = await createTestRepository();
    await repository.add({ ...input, occurredOn: '2026-10-01' });
    await repository.add({ ...input, occurredOn: '2026-10-20' });
    const dates = (await repository.list()).map((expense) => expense.occurredOn);
    expect(dates).toEqual(['2026-10-20', '2026-10-01']);
  });

  it('removes an expense by id', async () => {
    const repository = await createTestRepository();
    const saved = await repository.add(input);
    await repository.remove(saved.id);
    expect(await repository.list()).toEqual([]);
  });

  it('rejects invalid data before it reaches storage', async () => {
    const repository = await createTestRepository();
    await expect(repository.add({ ...input, amountCents: -5 })).rejects.toThrow();
    await expect(repository.add({ ...input, currency: 'usd' })).rejects.toThrow();
  });
});
