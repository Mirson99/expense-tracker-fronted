import type { PagedResult } from "../types/pagedResult";
import type { RecurringExpense } from "../types/recurringExpense";
import { axiosClient } from "./axiosClient";

export const getRecurringExpensesList = async (page: number = 1, pageSize: number = 10, searchTerm?: string, categoryId?: number, sortColumn?: string, sortOrder?: "asc" | "desc"): Promise<PagedResult<RecurringExpense>> => {
    const response = await axiosClient.get<PagedResult<RecurringExpense>>('/expense/recurring', {
        params: { page, pageSize, searchTerm, categoryId, sortColumn, sortOrder }
    });
    return response.data;
};

export const deleteRecurringExpense = async (expenseId: string): Promise<void> => {
    const response = await axiosClient.delete(`/expense/recurring/${expenseId}`);
    return response.data;
};