interface PaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasPrevious: boolean;
    hasNext: boolean;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    isPlaceholderData?: boolean;
}

export const Pagination = ({
    currentPage,
    totalPages,
    pageSize,
    hasPrevious,
    hasNext,
    onPageChange,
    onPageSizeChange,
    isPlaceholderData = false,
}: PaginationProps) => {
    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onPageSizeChange(Number(event.target.value));
  };

    return (
        <div className="px-6 py-4 border-t border-gray-700 bg-gray-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Rows per page:</span>
                <select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="
                        bg-gray-800 text-white text-sm border border-gray-600 rounded-lg 
                        focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                        p-1.5 outline-none cursor-pointer hover:bg-gray-700 transition-colors
                    "
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>

            <span className="text-sm text-gray-400 font-mono">
                Page <span className="text-white font-bold">{currentPage}</span> of <span className="text-white font-bold">{totalPages}</span>
            </span>

            <div className="flex gap-2">
                <button
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={!hasPrevious || isPlaceholderData}
                    className={`
                        px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                        ${!hasPrevious
                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                            : 'bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white border border-gray-600 hover:cursor-pointer'
                        }
                    `}
                >
                    &larr; Prev
                </button>

                <button
                    onClick={() => {
                        if (!isPlaceholderData && hasNext) {
                            onPageChange(currentPage + 1);
                        }
                    }}
                    disabled={!hasNext || isPlaceholderData}
                    className={`
                        px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                        ${!hasNext
                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                            : 'bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20 hover:cursor-pointer'
                        }
                    `}
                >
                    Next &rarr;
                </button>
            </div>
        </div>
    );
}