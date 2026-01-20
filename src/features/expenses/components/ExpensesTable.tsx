import type { Expense } from "../../../types/expense"
import { getCategoryStyles } from "../../../utils/categoryColors"
import { formatCurrency, formatDate } from "../../../utils/formatters"
import { SortableHeader, type SortOrder } from "../../../components/ui/SortableHeader";

interface ExpensesTableProps {
    expenses: Expense[];
    isLoading: boolean;
    sortColumn: string;
    sortOrder: SortOrder;
    onSort: (column: string) => void;
    onDelete: (expenseId: string) => void;
    setExpenseToUpdate: (expense: Expense) => void;
}

export const ExpensesTable = ({ expenses, isLoading, sortColumn, sortOrder, onSort, onDelete, setExpenseToUpdate }: ExpensesTableProps) => {
    if (isLoading) {
        return <div className="p-4 text-center">Ładowanie wydatków... (tu wstawisz ładny Spinner)</div>;
    }

    if (expenses.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                <p>You don't have any expenses yet</p>
                <p className="text-sm">Add your first expense to see it listed here</p>
            </div>
        );
    }

    return <table className="min-w-full leading-normal">
        <thead>
            <tr className="bg-gray-900/50">
                <SortableHeader
                    label="Date"
                    columnKey="date"
                    currentSortColumn={sortColumn}
                    currentSortOrder={sortOrder}
                    onSort={onSort}
                />
                <SortableHeader
                    label="Name"
                    columnKey="name"
                    currentSortColumn={sortColumn}
                    currentSortOrder={sortOrder}
                    onSort={onSort}
                />
                <th className="px-6 py-4 border-b border-gray-700 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Category
                </th>
                <SortableHeader
                    label="Amount"
                    columnKey="amount"
                    currentSortColumn={sortColumn}
                    currentSortOrder={sortOrder}
                    onSort={onSort}
                    align="right"
                />
                <th className="px-6 py-4 border-b border-gray-700 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <span className="sr-only">Actions</span>
                </th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/50">
            {expenses.map((expense: Expense) => (
                <tr
                    key={expense.id}
                    className="hover:bg-gray-700/30 transition-colors duration-200 group"
                >
                    <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap text-left">
                        {formatDate(expense.date)}
                    </td>

                    <td className="px-6 py-4 text-sm text-left">
                        <p className="text-gray-200 font-medium group-hover:text-teal-400 transition-colors">
                            {expense.name}
                        </p>
                        {expense.description && (
                            <p className="text-gray-500 text-xs truncate max-w-[200px] mt-1">
                                {expense.description}
                            </p>
                        )}
                    </td>

                    <td className="px-6 py-4 text-left text-sm whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${getCategoryStyles(expense.categoryName || '')}`}>
                            {expense.categoryName || 'Inne'}
                        </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-right font-bold text-gray-100 whitespace-nowrap">
                        {formatCurrency(expense.amount, expense.currency)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setExpenseToUpdate(expense)}
                                className="text-teal-400 hover:text-teal-300 transition-colors hover:cursor-pointer"
                                title="Edit expense"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                                </svg>
                            </button>
                            <button
                                onClick={() => onDelete(expense.id)}
                                className="text-rose-400 hover:text-rose-300 transition-colors hover:cursor-pointer"
                                title="Delete expense"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
}