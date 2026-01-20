import React from 'react';
import type { Category } from '../../../types/category';

interface CategorySelectProps {
  selectedId: number | undefined;
  onChange: (id: number | undefined) => void;
  categories: Category[];
  isLoading?: boolean;
}

export const CategorySelect = ({ selectedId, onChange, categories, isLoading = false }: CategorySelectProps) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;    
    onChange(value ? Number(value) : undefined);
  };

  return (
    <div className="relative w-full sm:w-48">
      <select
        value={selectedId || ""}
        onChange={handleChange}
        disabled={isLoading}
        className={`
          block w-full pl-3 pr-10 py-2 text-base 
          border border-gray-600 rounded-lg 
          bg-gray-800 text-gray-300 
          focus:outline-none focus:ring-teal-500 focus:border-teal-500 
          sm:text-sm transition duration-150 ease-in-out
          appearance-none /* Ukrywamy domyślną strzałkę systemową */
          ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
        `}
      >
        <option value="">All Categories</option>
        
        {isLoading ? (
          <option disabled>Loading categories...</option>
        ) : (
          categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))
        )}
      </select>

      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
};