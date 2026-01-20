import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createExpense } from "../api/expenses"
import toast from "react-hot-toast"

export const useCreateExpense = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] })
            toast.success("Expense created successfully");
        },
        onError: () => {
            toast.error("Failed to create expense");
        }
    });
}