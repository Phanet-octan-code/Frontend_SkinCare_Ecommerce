import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, lastPage, onPageChange }) {
  if (!lastPage || lastPage <= 1) return null;

  const pages = [];
  for (let i = 1; i <= lastPage; i++) {
    // Show first, last, current, and adjacent pages
    if (
      i === 1 ||
      i === lastPage ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-8 sm:mt-10 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="btn btn-outline btn-sm min-w-[34px] sm:min-w-[38px] h-[34px] sm:h-[38px] p-0 flex items-center justify-center"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, idx) =>
        p === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-1.5 sm:px-2 text-xs sm:text-sm text-[var(--color-text-muted)]">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`btn btn-sm min-w-[34px] sm:min-w-[38px] h-[34px] sm:h-[38px] p-0 text-xs sm:text-sm ${p === currentPage ? 'btn-primary' : 'btn-outline'}`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= lastPage}
        className="btn btn-outline btn-sm min-w-[34px] sm:min-w-[38px] h-[34px] sm:h-[38px] p-0 flex items-center justify-center"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
