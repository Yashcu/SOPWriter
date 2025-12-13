import { z } from 'zod';

export const createLeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  service: z.string().min(1),
  notes: z.string().max(2000).optional(),
});

export const createTransactionSchema = z.object({
  transactionId: z.string().min(1),
  amount: z.number().positive().optional(),
  method: z.enum(['UPI', 'BANK', 'OTHER']).optional(),
  remark: z.string().max(1000).optional(),
});

export const verifyTransactionSchema = z.object({
  action: z.enum(['VERIFY', 'REJECT']),
  note: z.string().max(500).optional(),
});

export type CreateLeadDTO = z.infer<typeof createLeadSchema>;
export type CreateTransactionDTO = z.infer<typeof createTransactionSchema>;
export type VerifyTransactionDTO = z.infer<typeof verifyTransactionSchema>;
