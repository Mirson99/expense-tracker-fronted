import type { Expense } from "../types/expense";
import type { PagedResult } from "../types/pagedResult";
import { axiosClient } from "./axiosClient";

export const getExpensesList = async (page: number = 1, pageSize: number = 10, searchTerm?: string, categoryId?: number, sortColumn?: string, sortOrder?: "asc" | "desc"): Promise<PagedResult<Expense>> => {
    const response = await axiosClient.get<PagedResult<Expense>>('/expense', {
        params: { page, pageSize, searchTerm, categoryId, sortColumn, sortOrder }
    });
    return response.data;
};

export const createExpense = async (expenseData: CreateExpenseData): Promise<void> => {
    const response = await axiosClient.post('/expense', expenseData);
    return response.data;
};

interface CreateExpenseData {
    name: string;
    description?: string;
    amount: number;
    currency: string;
    date: string;
    categoryId: number;
}

interface UpdateExpenseData {
    id: string;
    name: string;
    description?: string;
    amount: number;
    currency: string;
    date: string;
    categoryId: number;
}

export const deleteExpense = async (expenseId: string): Promise<void> => {
    const response = await axiosClient.delete(`/expense/${expenseId}`);
    return response.data;
};

export const updateExpense = async (expenseData: UpdateExpenseData): Promise<void> => {
    const response = await axiosClient.put(`/expense/${expenseData.id}`, expenseData);
    return response.data;
};