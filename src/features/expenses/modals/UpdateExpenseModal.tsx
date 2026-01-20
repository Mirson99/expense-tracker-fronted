import { type SubmitHandler } from "react-hook-form";
import type { Expense } from "../../../types/expense";
import { useUpdateExpense } from "../../../hooks/useUpdateExpense";
import { ExpenseForm, type ExpenseFormValues } from "../components/ExpenseForm";

interface UpdateExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    expenseToUpdate: Expense;
}

export const UpdateExpenseModal = ({ isOpen, onClose, expenseToUpdate }: UpdateExpenseModalProps) => {    
    const { mutate, isPending } = useUpdateExpense();    

    const onSubmit: SubmitHandler<ExpenseFormValues> = (data) => {
        mutate({ ...data, id: expenseToUpdate.id }, {
            onSuccess: () => {                
                onClose();
            },
        });
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden transform transition-all">
                <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
                    <h3 className="text-xl font-bold text-white">Update Expense</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">✕</button>
                </div>
                <ExpenseForm defaultValues={expenseToUpdate} onSubmit={onSubmit} submitLabel="Update Expense" onCancel={onClose} isPending={isPending} />
            </div>
        </div>
    );
};