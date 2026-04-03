import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getExpensesList } from "../api/expenses";
import { ExpenseStatus } from "../types/expenseStatus";

export const useExpenses = (status: ExpenseStatus, page: number, pageSize: number = 10, searchTerm?: string, categoryId?: number, sortColumn?: string, sortOrder?: "asc" | "desc") => {
    return useQuery({  
        queryKey: ['expenses', status, page, pageSize, searchTerm, categoryId, sortColumn, sortOrder],        
        queryFn: () => getExpensesList(status, page, pageSize, searchTerm, categoryId, sortColumn, sortOrder),              
        placeholderData: keepPreviousData,
        staleTime: 60 * 1000,
    });
}