export type SortOrder = 'asc' | 'desc';

export const SortableHeader = ({ 
  label, 
  columnKey, 
  currentSortColumn, 
  currentSortOrder, 
  onSort,
  align = 'left' // Opcjonalnie: wyrównanie tekstu (dla Amount: right)
}: { 
  label: string; 
  columnKey: string; 
  currentSortColumn: string; 
  currentSortOrder: SortOrder; 
  onSort: (col: string) => void;
  align?: 'left' | 'center' | 'right';
}) => {
  const isActive = currentSortColumn === columnKey;

  return (
    <th 
      scope="col"
      onClick={() => onSort(columnKey)}
      className={`
        px-6 py-4 border-b border-gray-700 bg-gray-900/50 
        text-xs font-semibold uppercase tracking-wider cursor-pointer 
        transition-colors duration-200 group select-none
        ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'}
        ${isActive ? 'text-teal-400' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}
      `}
    >
      <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'}`}>
        {label}            
        <span className="flex flex-col">          
          <svg className={`w-3 h-3 ${isActive && currentSortOrder === 'asc' ? 'text-teal-400' : 'text-gray-600 group-hover:text-gray-500'}`} fill="currentColor" viewBox="0 0 24 24">
             <path d="M7 14l5-5 5 5z" />
          </svg>          
          <svg className={`w-3 h-3 -mt-1.5 ${isActive && currentSortOrder === 'desc' ? 'text-teal-400' : 'text-gray-600 group-hover:text-gray-500'}`} fill="currentColor" viewBox="0 0 24 24">
             <path d="M7 10l5 5 5-5z" />
          </svg>
        </span>
      </div>
    </th>
  );
};