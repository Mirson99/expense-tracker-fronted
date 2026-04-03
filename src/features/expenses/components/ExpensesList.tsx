import { useState } from "react";
import { useExpenses } from "../../../hooks/useExpenses";
import { Pagination } from "../../../components/ui/Pagination";
import { SearchInput } from "../../../components/ui/SearchInput";
import { CategorySelect } from "./CategorySelect";
import { useCategories } from "../../../hooks/useCategories";
import { useDebounce } from "../../../hooks/useDebounce";
import { ExpensesTable } from "./ExpensesTable";

import type { Expense } from "../../../types/expense";
import { ExpenseStatus } from "../../../types/expenseStatus";
import { AddExpenseModal } from "../modals/AddExpenseModal";
import { DeleteExpenseModal } from "../modals/DeleteExpenseModal";
import { UpdateExpenseModal } from "../modals/UpdateExpenseModal";
import { AddReceiptModal } from "../modals/AddReceiptModal";
import { VerifyExpenseModal } from "../modals/VerifyExpenseModal";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";
import { deleteExpense } from "../../../api/expenses";
import { useDeleteExpense } from "../../../hooks/useDeleteExpense";

interface ExpensesListProps {
  status?: ExpenseStatus;
}

export const ExpensesList = ({ status = ExpenseStatus.Confirmed }: ExpensesListProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortColumn, setSortColumn] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const { data: expensesListData, isLoading, isError, error, isPlaceholderData } = useExpenses(status, page, pageSize, debouncedSearchTerm, selectedCategoryId, sortColumn, sortOrder);
  const isConfirmed = status === ExpenseStatus.Confirmed;
  const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [expenseToUpdate, setExpenseToUpdate] = useState<Expense | null>(null);
  const [expenseToVerify, setExpenseToVerify] = useState<Expense | null>(null);
  const { mutate, isPending: isDeleting } = useDeleteExpense();

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

  const handleDeleteConfirm = () => {
    if (expenseToDelete) {
      mutate(expenseToDelete, {
        onSuccess: () => {
          setExpenseToDelete(null);
        }
      });
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
        {isConfirmed && (
        <div className="flex gap-3">
        <button
          onClick={() => setIsReceiptModalOpen(true)}
          className="hover:cursor-pointer group flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
          </svg>
          Add Receipt
        </button>
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
        )}
      </div>
      <div className="bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-700/50">
        <div className={`overflow-x-auto transition-opacity duration-200 ${isPlaceholderData ? 'opacity-50' : 'opacity-100'}`}>
          <ExpensesTable expenses={expenses} isLoading={isLoading} sortColumn={sortColumn} sortOrder={sortOrder} onSort={handleSort} onDelete={(expenseId: string) => setExpenseToDelete(expenseId)} setExpenseToUpdate={(expense: Expense) => isConfirmed ? setExpenseToUpdate(expense) : setExpenseToVerify(expense)} showVerifyButton={!isConfirmed} />
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
      <AddReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />
      <ConfirmModal
        isOpen={expenseToDelete !== null}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Expense"
        description="Are you sure you want to delete this expense? This action cannot be undone."
        isLoading={isDeleting}
      />
      <UpdateExpenseModal
        isOpen={expenseToUpdate !== null}
        expenseToUpdate={expenseToUpdate!}
        onClose={() => setExpenseToUpdate(null)}
      />
      <VerifyExpenseModal
        isOpen={expenseToVerify !== null}
        expense={expenseToVerify!}
        onClose={() => setExpenseToVerify(null)}
      />
    </div>
  );
};