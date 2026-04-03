export const ExpenseStatus = {
    Confirmed: 0,
    Processing: 1,
    RequiresVerification: 2,
    Failed: 3,
} as const;

export type ExpenseStatus = typeof ExpenseStatus[keyof typeof ExpenseStatus];