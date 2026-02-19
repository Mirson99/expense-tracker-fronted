import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRecurringExpense } from "../api/recurring-expenses";
import toast from "react-hot-toast";

export const useDeleteRecurringExpense = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteRecurringExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recurring-expenses'] })
            toast.success("Expense deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete expense");
        }
    });
}