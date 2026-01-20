import { ExpensesList } from "../features/expenses/components/ExpensesList";

export default function HomePage() {
  return (
    <>
      <div className="flex items-center justify-center pt-24">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-4xl font-bold text-white tracking-tight">
              Your expenses
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Debug your spending habits
            </p>
          </div>
        </div>
      </div>
      <ExpensesList />
    </>
  );
}