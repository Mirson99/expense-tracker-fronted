import { useState } from "react";
import { ExpensesList } from "../features/expenses/components/ExpensesList";
import { RecurringExpensesList } from "../features/recurring-expenses/components/RecurringExpensesList";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'subscriptions'>('transactions');
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
      <div className="flex justify-center mb-6">
        <div className="bg-gray-800 p-1 rounded-xl inline-flex border border-gray-700">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'transactions'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'subscriptions'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
          >
            Subscriptions (Recurring)
          </button>
        </div>
      </div>      
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'transactions' ? (           
           <ExpensesList />
        ) : (
           <RecurringExpensesList />
        )}
      </div>
    </>
  );
}