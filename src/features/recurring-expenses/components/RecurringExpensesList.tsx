import { useState } from "react";
import { useDebounce } from "../../../hooks/useDebounce";
import { useCategories } from "../../../hooks/useCategories";
import { SearchInput } from "../../../components/ui/SearchInput";
import { CategorySelect } from "../../expenses/components/CategorySelect";
import { Pagination } from "../../../components/ui/Pagination";
import { useRecurringExpenses } from "../../../hooks/useRecurringExpenses";
import { RecurringExpensesTable } from "./RecurringExpensesTable";
import { useDeleteRecurringExpense } from "../../../hooks/useDeleteRecurringExpense";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";

export const RecurringExpensesList = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10)
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [sortColumn, setSortColumn] = useState("");
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const { data: expensesListData, isLoading, isError, error, isPlaceholderData } = useRecurringExpenses(page, pageSize, debouncedSearchTerm, selectedCategoryId, sortColumn, sortOrder);
    const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories();
    const { mutate: deleteRecurring, isPending: isDeleting } = useDeleteRecurringExpense();
    const [subToDelete, setSubToDelete] = useState<string | null>(null);

    const handleDeleteConfirm = () => {
        if (subToDelete) {
            deleteRecurring(subToDelete, {
                onSuccess: () => setSubToDelete(null)
            });
        }
    };

    const expenses = expensesListData?.items || [];

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setPage(1);
    };

    const handleCategoryChange = (categoryId: number | undefined) => {
        setSelectedCategoryId(categoryId);
        setPage(1);
    }

    const handleSearchTermChange = (term: string) => {
        setSearchTerm(term);
        setPage(1);
    }

    const handleSort = (columnName: string) => {
        if (sortColumn === columnName) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(columnName);
            setSortOrder("asc");
        }
    }

    if (isError) {
        return <div className="text-red-500">Błąd: {error.message}</div>;
    }

    return (
        <div className="w-full max-w-6xl mx-auto mt-10 px-4">
            <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-center bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <SearchInput
                        value={searchTerm}
                        onChange={handleSearchTermChange}
                        placeholder="Search by name..."
                    />
                    <CategorySelect
                        selectedId={selectedCategoryId}
                        onChange={handleCategoryChange}
                        categories={categoriesData || []}
                        isLoading={isCategoriesLoading}
                    />
                </div>
            </div>
            <div className="bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-700/50">
                <div className={`overflow-x-auto transition-opacity duration-200 ${isPlaceholderData ? 'opacity-50' : 'opacity-100'}`}>
                    <RecurringExpensesTable expenses={expenses} isLoading={isLoading} sortColumn={sortColumn} sortOrder={sortOrder} onSort={handleSort} onDelete={(expenseId: string) => setSubToDelete(expenseId)} />
                </div>
            </div>
            {expensesListData && (
                <Pagination
                    currentPage={expensesListData.page}
                    totalPages={expensesListData.totalPages}
                    pageSize={pageSize}
                    hasPrevious={expensesListData.hasPreviousPage}
                    hasNext={expensesListData.hasNextPage}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    isPlaceholderData={isPlaceholderData}
                />
            )}
            <ConfirmModal
                isOpen={subToDelete !== null}
                onClose={() => setSubToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Stop Subscription"
                description="This will stop the recurring expense. Future payments will not be generated."
                confirmLabel="Stop Subscription"
                isLoading={isDeleting}
           />
        </div>
    );
};