import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * A reusable premium pagination component.
 * 
 * @param {number} currentPage - Current active page (1-indexed)
 * @param {number} totalPages - Total number of pages
 * @param {function} onPageChange - Callback function when page changes
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const maxButtonsToShow = 5;
  
  // Logic to calculate which page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    if (totalPages <= maxButtonsToShow + 2) {
      // If total pages are few, show all of them
      for (let i = 2; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate start and end indices around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we are at the boundaries
      if (currentPage <= 3) {
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }
      
      // Add ellipsis before start if needed
      if (start > 2) {
        pages.push("...");
      }
      
      // Add range
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis after end if needed
      if (end < totalPages - 1) {
        pages.push("...");
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex flex-col items-center space-y-4 my-10">
      <div className="flex items-center space-x-1 md:space-x-2">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 border ${
            currentPage === 1
              ? "text-gray-300 border-gray-100 cursor-not-allowed"
              : "text-gray-700 border-gray-200 hover:border-[#b82025] hover:text-[#b82025] hover:bg-red-50 active:scale-90 shadow-sm"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1 md:space-x-2">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="w-8 h-8 flex items-center justify-center text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={`w-10 h-10 rounded-full text-sm font-semibold transition-all duration-300 border ${
                    currentPage === page
                      ? "bg-[#b82025] text-white border-[#b82025] shadow-md shadow-red-100 scale-105"
                      : "text-gray-700 border-gray-200 hover:border-[#b82025] hover:text-[#b82025] hover:bg-red-50 active:scale-95"
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 border ${
            currentPage === totalPages
              ? "text-gray-300 border-gray-100 cursor-not-allowed"
              : "text-gray-700 border-gray-200 hover:border-[#b82025] hover:text-[#b82025] hover:bg-red-50 active:scale-90 shadow-sm"
          }`}
          aria-label="Next page"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
