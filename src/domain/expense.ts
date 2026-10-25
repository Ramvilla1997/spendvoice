import { z } from 'zod';

export const CATEGORIES = ['food', 'transport', 'housing', 'entertainment', 'health', 'shopping', 'other'] as const;
export type Category = (typeof CATEGORIES)[number];

export const expenseSchema = z.object({
  id: z.string().min(1),
  amountCents: z.number().int().positive(),
  currency: z.string().regex(/^[A-Z]{3}$/),
  category: z.enum(CATEGORIES),
  note: z.string().max(280),
  occurredOn: z.iso.date(),
  createdAt: z.iso.datetime(),
});

export type Expense = z.infer<typeof expenseSchema>;

export const newExpenseSchema = expenseSchema.pick({
  amountCents: true,
  currency: true,
  category: true,
  note: true,
  occurredOn: true,
});

export type NewExpense = z.infer<typeof newExpenseSchema>;
