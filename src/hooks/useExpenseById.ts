import { useQuery } from "@tanstack/react-query"
import { getExpenseById } from "../api/expenses";

export const useExpenseById = (expenseId: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['expense', expenseId],
        queryFn: () => getExpenseById(expenseId),
        enabled: !!expenseId && enabled,
        staleTime: 0,
    });
}
