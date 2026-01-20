import * as z from "zod";
import { useCategories } from "../../../hooks/useCategories";
import { useCreateExpense } from "../../../hooks/useCreateExpense";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ButtonSpinner } from "../../../components/ui/ButtonSpinner";
import { useEffect } from "react";
import type { Expense } from "../../../types/expense";


const expenseSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    amount: z.number({ error: "Amount is required" }).min(0.01, "Amount must be positive"),
    currency: z.string({ error: "Currency is required" }),
    date: z.string(),
    categoryId: z.number({ error: "Category is required" }).min(1, "Please select a category"),
    description: z.string().max(1000).optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return <p className="text-red-400 text-xs mt-1">{message}</p>;
};

interface ExpenseFormProps {    
    defaultValues?: Expense;     
    onSubmit: (data: ExpenseFormValues) => void;     
    submitLabel: string;
    onCancel: () => void;
    isPending: boolean;
}

export const ExpenseForm = ({ defaultValues, onSubmit, submitLabel, onCancel, isPending }: ExpenseFormProps) => {    const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories();    
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors},
    } = useForm<ExpenseFormValues>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            currency: "PLN",
            date: new Date().toISOString().split('T')[0]
        }
    });

    useEffect(() => {
            if (defaultValues) {
                reset({
                    name: defaultValues.name,
                    amount: defaultValues.amount, 
                    currency: defaultValues.currency,                
                    date: defaultValues.date?.split('T')[0], 
                    categoryId: defaultValues.categoryId,
                    description: defaultValues.description,
                });
            }
        }, [defaultValues, reset]);

    return <div className="p-6">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Expense Name</label>
                <input
                    {...register("name")}
                    id="name"
                    type="text"
                    placeholder="e.g. Lunch with team"
                    className={`block w-full rounded-md bg-gray-900 px-3 py-2 text-white border ${errors.name ? 'border-red-500' : 'border-gray-600'} focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none sm:text-sm transition-colors placeholder-gray-500`}
                />
                <ErrorMessage message={errors.name?.message} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                    <input
                        {...register("amount", { valueAsNumber: true })}
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className={`block w-full rounded-md bg-gray-900 px-3 py-2 text-white border ${errors.amount ? 'border-red-500' : 'border-gray-600'} focus:border-teal-500 outline-none sm:text-sm`}
                    />
                    <ErrorMessage message={errors.amount?.message} />
                </div>

                <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-300 mb-1">Currency</label>
                    <select
                        {...register("currency")}
                        id="currency"
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
                <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                <input
                    {...register("date")}
                    id="date"
                    type="date"
                    className="block w-full rounded-md bg-gray-900 px-3 py-2 text-white border border-gray-600 focus:border-teal-500 outline-none sm:text-sm dark-date-input"
                />
                <ErrorMessage message={errors.date?.message} />
            </div>

            <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <select
                    {...register("categoryId", { valueAsNumber: true })}
                    id="categoryId"
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description <span className="text-gray-500 text-xs">(Optional)</span></label>
                <textarea
                    {...register("description")}
                    id="description"
                    rows={2}
                    className="block w-full rounded-md bg-gray-900 px-3 py-2 text-white border border-gray-600 focus:border-teal-500 outline-none sm:text-sm resize-none"
                />
                <ErrorMessage message={errors.description?.message} />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-700 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
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
                            Saving...
                        </>
                    ) : (
                        submitLabel
                    )}
                </button>
            </div>
        </form>
    </div>
}
