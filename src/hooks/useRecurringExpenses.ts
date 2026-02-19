import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getRecurringExpensesList } from "../api/recurring-expenses";

export const useRecurringExpenses = (page: number, pageSize: number = 10, searchTerm?: string, categoryId?: number, sortColumn?: string, sortOrder?: "asc" | "desc") => {
    return useQuery({  
        queryKey: ['recurring-expenses', page, pageSize, searchTerm, categoryId, sortColumn, sortOrder],        
        queryFn: () => getRecurringExpensesList(page, pageSize, searchTerm, categoryId, sortColumn, sortOrder),              
        placeholderData: keepPreviousData,
        staleTime: 60 * 1000,
    });
}