import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateExpense } from "../api/expenses";
import toast from "react-hot-toast";

export const useUpdateExpense = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] })
            toast.success("Expense updated successfully");
        },
        onError: () => {
            toast.error("Failed to update expense");
        }
    });
}