import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Expense } from "../../../types/expense";
import { ExpenseStatus } from "../../../types/expenseStatus";
import { useExpenseById } from "../../../hooks/useExpenseById";
import { useUpdateExpense } from "../../../hooks/useUpdateExpense";
import { useCategories } from "../../../hooks/useCategories";
import { ButtonSpinner } from "../../../components/ui/ButtonSpinner";

interface VerifyExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    expense: Expense;
}

const verifySchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    amount: z.number({ error: "Amount is required" }).min(0.01, "Amount must be positive"),
    currency: z.string({ error: "Currency is required" }),
    date: z.string(),
    categoryId: z.number({ error: "Category is required" }).min(1, "Please select a category"),
    description: z.string().max(1000).optional(),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return <p className="text-red-400 text-xs mt-1">{message}</p>;
};

export const VerifyExpenseModal = ({ isOpen, onClose, expense }: VerifyExpenseModalProps) => {
    const { data, isLoading, isError } = useExpenseById(expense?.id, isOpen);
    const { data: categoriesData } = useCategories();
    const { mutate, isPending } = useUpdateExpense();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<VerifyFormValues>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            currency: "PLN",
            date: new Date().toISOString().split('T')[0],
        },
    });

    useEffect(() => {
        if (data && categoriesData) {
            const matchedCategory = categoriesData.find(
                (cat) => cat.name.toLowerCase() === data.categoryName?.toLowerCase()
            );
            reset({
                name: data.name,
                amount: data.amount,
                currency: data.currency,
                date: data.date?.split('T')[0],
                categoryId: matchedCategory?.id ?? 0,
                description: data.description,
            });
        }
    }, [data, categoriesData, reset]);

    const onSubmit = (formData: VerifyFormValues) => {
        mutate(
            { ...formData, id: expense.id, status: ExpenseStatus.Confirmed },
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
            <div className="w-full max-w-5xl max-h-[90vh] bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden transform transition-all">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
                    <h3 className="text-xl font-bold text-white">Verify Expense</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">✕</button>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-3">
                            <svg className="animate-spin h-8 w-8 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-gray-400 text-sm">Loading expense details...</span>
                        </div>
                    </div>
                ) : isError ? (
                    <div className="flex items-center justify-center py-20">
                        <p className="text-red-400 text-sm">Failed to load expense details. Please try again.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Body - two columns */}
                        <div className="flex flex-col md:flex-row overflow-hidden" style={{ maxHeight: 'calc(90vh - 130px)' }}>
                            {/* Left - Receipt Image */}
                            <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-700 bg-gray-900/30 overflow-auto">
                                {data?.receiptUrl ? (
                                    <div className="p-4 flex items-center justify-center min-h-[300px]">
                                        <img
                                            src={data.receiptUrl}
                                            alt="Receipt"
                                            className="max-w-full h-auto rounded-lg shadow-lg object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mb-3 opacity-50">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                                        </svg>
                                        <p className="text-sm">No receipt available</p>
                                    </div>
                                )}
                            </div>

                            {/* Right - Editable Expense Form */}
                            <div className="w-full md:w-1/2 p-6 overflow-auto">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="verify-name" className="block text-sm font-medium text-gray-300 mb-1">Expense Name</label>
                                        <input
                                            {...register("name")}
                                            id="verify-name"
                                            type="text"
                                            placeholder="e.g. Lunch with team"
                                            className={`block w-full rounded-md bg-gray-900 px-3 py-2 text-white border ${errors.name ? 'border-red-500' : 'border-gray-600'} focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none sm:text-sm transition-colors placeholder-gray-500`}
                                        />
                                        <ErrorMessage message={errors.name?.message} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="verify-amount" className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                                            <input
                                                {...register("amount", { valueAsNumber: true })}
                                                id="verify-amount"
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                className={`block w-full rounded-md bg-gray-900 px-3 py-2 text-white border ${errors.amount ? 'border-red-500' : 'border-gray-600'} focus:border-teal-500 outline-none sm:text-sm`}
                                            />
                                            <ErrorMessage message={errors.amount?.message} />
                                        </div>

                                        <div>
                                            <label htmlFor="verify-currency" className="block text-sm font-medium text-gray-300 mb-1">Currency</label>
                                            <select
                                                {...register("currency")}
                                                id="verify-currency"
                                                className="block w-full rounded-md bg-gray-900 px-3 py-2 text-white border border-gray-600 focus:border-teal-500 outline-none sm:text-sm cursor-pointer"
                                            >
                                                <option value="PLN">PLN</option>
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                            </select>
                                            <ErrorMessage message={errors.currency?.message} />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="verify-date" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                                        <input
                                            {...register("date")}
                                            id="verify-date"
                                            type="date"
                                            className="block w-full rounded-md bg-gray-900 px-3 py-2 text-white border border-gray-600 focus:border-teal-500 outline-none sm:text-sm dark-date-input"
                                        />
                                        <ErrorMessage message={errors.date?.message} />
                                    </div>

                                    <div>
                                        <label htmlFor="verify-categoryId" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                                        <select
                                            {...register("categoryId", { valueAsNumber: true })}
                                            id="verify-categoryId"
                                            className={`block w-full rounded-md bg-gray-900 px-3 py-2 text-white border ${errors.categoryId ? 'border-red-500' : 'border-gray-600'} focus:border-teal-500 outline-none sm:text-sm cursor-pointer`}
                                        >
                                            <option value="0">Select a category...</option>
                                            {categoriesData?.map((cat) => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <ErrorMessage message={errors.categoryId?.message} />
                                    </div>

                                    <div>
                                        <label htmlFor="verify-description" className="block text-sm font-medium text-gray-300 mb-1">Description <span className="text-gray-500 text-xs">(Optional)</span></label>
                                        <textarea
                                            {...register("description")}
                                            id="verify-description"
                                            rows={2}
                                            className="block w-full rounded-md bg-gray-900 px-3 py-2 text-white border border-gray-600 focus:border-teal-500 outline-none sm:text-sm resize-none"
                                        />
                                        <ErrorMessage message={errors.description?.message} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer with buttons */}
                        <div className="px-6 py-4 border-t border-gray-700 flex justify-end gap-3 bg-gray-900/30">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isPending}
                                className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="px-4 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isPending ? (
                                    <>
                                        <ButtonSpinner />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify"
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
