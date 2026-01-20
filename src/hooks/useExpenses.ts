import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getExpensesList } from "../api/expenses";

export const useExpenses = (page: number, pageSize: number = 10, searchTerm?: string, categoryId?: number, sortColumn?: string, sortOrder?: "asc" | "desc") => {
    return useQuery({  
        queryKey: ['expenses', page, pageSize, searchTerm, categoryId, sortColumn, sortOrder],        
        queryFn: () => getExpensesList(page, pageSize, searchTerm, categoryId, sortColumn, sortOrder),              
        placeholderData: keepPreviousData,
        staleTime: 60 * 1000,
    });
}