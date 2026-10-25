import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { expenseSchema, type Expense, type NewExpense } from '../domain/expense.js';

interface SpendVoiceDb extends DBSchema {
  expenses: {
    key: string;
    value: Expense;
    indexes: { 'by-date': string };
  };
}

export interface ExpenseRepository {
  add(input: NewExpense): Promise<Expense>;
  list(): Promise<Expense[]>;
  remove(id: string): Promise<void>;
}

export type ExpenseDatabase = IDBPDatabase<SpendVoiceDb>;

export function openExpenseDatabase(name = 'spendvoice'): Promise<ExpenseDatabase> {
  return openDB<SpendVoiceDb>(name, 1, {
    upgrade(db) {
      const store = db.createObjectStore('expenses', { keyPath: 'id' });
      store.createIndex('by-date', 'occurredOn');
    },
  });
}

export function createExpenseRepository(
  db: ExpenseDatabase,
  now: () => string = () => new Date().toISOString(),
  newId: () => string = () => crypto.randomUUID(),
): ExpenseRepository {
  return {
    async add(input) {
      const expense = expenseSchema.parse({ ...input, id: newId(), createdAt: now() });
      await db.put('expenses', expense);
      return expense;
    },

    async list() {
      const rows = await db.getAll('expenses');
      return rows
        .map((row) => expenseSchema.parse(row))
        .sort((a, b) => b.occurredOn.localeCompare(a.occurredOn) || b.createdAt.localeCompare(a.createdAt));
    },

    async remove(id) {
      await db.delete('expenses', id);
    },
  };
}
