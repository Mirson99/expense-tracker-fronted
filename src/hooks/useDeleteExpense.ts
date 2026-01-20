import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExpense } from "../api/expenses";
import toast from "react-hot-toast";

export const useDeleteExpense = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] })
            toast.success("Expense deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete expense");
        }
    });
}