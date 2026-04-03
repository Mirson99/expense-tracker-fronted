import type { ExpenseStatus } from "./expenseStatus";

export interface Expense {
    id: string;
    name: string;
    description: string;
    amount: number;
    currency: string;
    date: string;
    categoryName: string;
    categoryId: number;
    isRecurring: boolean;
    status: ExpenseStatus;
}

export interface ExpenseDetail {
    name: string;
    description: string;
    currency: string;
    amount: number;
    date: string;
    categoryName: string;
    receiptUrl: string;
    status: ExpenseStatus;
}