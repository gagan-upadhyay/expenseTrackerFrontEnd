import {z} from 'zod';

export const TransactionSchema = z.object({
    id:z.string(),
    user_id:z.string(),
    account_id: z.string(),
    category_id: z.string(),
    amount: z.string(),
    type: z.enum(["credit", "debit"]),
    description: z.string(),
    reference: z.string().nullable(),
    occurred_at: z.string(),
    created_at: z.string(),
    is_active: z.boolean(),
    deleted_at: z.string().nullable(),
    display_name:z.string(),
    currency_code:z.string(),
    category_code:z.string(),
});

export const TransactionsSchema = z.array(TransactionSchema)

export type Transaction =z.infer<typeof TransactionSchema>;