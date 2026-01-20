import {  type SubmitHandler } from "react-hook-form";
import { useCreateExpense } from "../../../hooks/useCreateExpense";
import { ExpenseForm, type ExpenseFormValues } from "../components/ExpenseForm";


export const AddExpenseModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { mutate, isPending } = useCreateExpense();

    const onSubmit: SubmitHandler<ExpenseFormValues> = (data) => {    
        mutate(data, {
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
                    <h3 className="text-xl font-bold text-white">Add New Expense</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">✕</button>
                </div>
                <ExpenseForm onSubmit={onSubmit} submitLabel="+ Add Expense" onCancel={onClose} isPending={isPending} />
            </div>
        </div>
    );
};