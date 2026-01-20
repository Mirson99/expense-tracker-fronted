// src/components/DeleteExpenseModal.tsx

import { useDeleteExpense } from "../hooks/useDeleteExpense";
import { ButtonSpinner } from "./ui/ButtonSpinner";

interface DeleteExpenseModalProps {
    isOpen: boolean;
    expenseId?: string | null;
    onClose: () => void;
}

export const DeleteExpenseModal = ({ isOpen, expenseId, onClose }: DeleteExpenseModalProps) => {
    const { mutate, isPending } = useDeleteExpense();
    if (!isOpen) return null;

    const handleConfirm = () => {
        if (expenseId) {
            mutate(expenseId, {
                onSuccess: () => {
                    onClose();
                }
            });
        }        
    };

    return (        
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm transition-opacity">
            <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 border border-gray-700 p-6 text-left shadow-xl transition-all sm:my-8">

                <div className="sm:flex sm:items-start">                    
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-rose-500/10 sm:mx-0 sm:h-10 sm:w-10">
                        <svg className="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>                
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3 className="text-lg font-semibold leading-6 text-white">
                            Delete Expense
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-400">
                                Are you sure you want to delete this expense? This action cannot be undone and will be removed from your analytics.
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={handleConfirm}
                        className="
              inline-flex w-full justify-center items-center rounded-md 
              bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm 
              hover:bg-rose-500 sm:w-auto 
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors hover:cursor-pointer
            "
                    >
                        {isPending ? (
                            <>
                                <ButtonSpinner />
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </button>

                    <button
                        type="button"
                        disabled={isPending}
                        onClick={onClose}
                        className="
              mt-3 inline-flex w-full justify-center rounded-md 
              bg-gray-700/50 px-3 py-2 text-sm font-semibold text-gray-300 shadow-sm 
              hover:bg-gray-700 hover:text-white ring-1 ring-inset ring-gray-600 
              sm:mt-0 sm:w-auto transition-colors hover:cursor-pointer
            "
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};