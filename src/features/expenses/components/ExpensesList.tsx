import { useState } from "react";
import { useExpenses } from "../../../hooks/useExpenses";
import { Pagination } from "../../../components/ui/Pagination";
import { SearchInput } from "../../../components/ui/SearchInput";
import { CategorySelect } from "./CategorySelect";
import { useCategories } from "../../../hooks/useCategories";
import { useDebounce } from "../../../hooks/useDebounce";
import { ExpensesTable } from "./ExpensesTable";

import type { Expense } from "../../../types/expense";
import { AddExpenseModal } from "../modals/AddExpenseModal";
import { DeleteExpenseModal } from "../modals/DeleteExpenseModal";
import { UpdateExpenseModal } from "../modals/UpdateExpenseModal";

export const ExpensesList = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortColumn, setSortColumn] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const { data: expensesListData, isLoading, isError, error, isPlaceholderData } = useExpenses(page, pageSize, debouncedSearchTerm, selectedCategoryId, sortColumn, sortOrder);
  const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [expenseToUpdate, setExpenseToUpdate] = useState<Expense | null>(null);

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
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="hover:cursor-pointer group flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" /* Obrót ikony przy najechaniu */
          >
            <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
          </svg>
          Add Expense
        </button>
      </div>
      <div className="bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-700/50">
        <div className={`overflow-x-auto transition-opacity duration-200 ${isPlaceholderData ? 'opacity-50' : 'opacity-100'}`}>
          <ExpensesTable expenses={expenses} isLoading={isLoading} sortColumn={sortColumn} sortOrder={sortOrder} onSort={handleSort} onDelete={(expenseId: string) => setExpenseToDelete(expenseId)} setExpenseToUpdate={(expense: Expense) => setExpenseToUpdate(expense)} />
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
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <DeleteExpenseModal
        isOpen={expenseToDelete !== null}
        expenseId={expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
      />
      <UpdateExpenseModal
        isOpen={expenseToUpdate !== null}
        expenseToUpdate={expenseToUpdate!}
        onClose={() => setExpenseToUpdate(null)}
      />
    </div>
  );
};