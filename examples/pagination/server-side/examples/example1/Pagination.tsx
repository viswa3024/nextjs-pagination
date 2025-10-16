"use client";

import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  // total number of pages (you clarified totalItems means pages)
  totalPages: number;

  // optional explicit page list (eg. [1,2,3,4,5]) — if not provided it's built from totalPages
  pages?: number[];

  // current active page (1-indexed)
  currentPage: number;

  // callback when page changes
  onPageChange: (page: number) => void;

  // how many pages prev/next buttons jump (default 1)
  prevNextCount?: number;

  // show dots when pages are many
  showDots?: boolean;

  // style / tailwind class props (pass full classes like "bg-teal-600 text-white")
  activeClass?: string;
  baseClass?: string;
  hoverClass?: string;
  disabledClass?: string;
  dotClass?: string;

  // optional sizing
  itemPadding?: string;
};

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  pages,
  currentPage,
  onPageChange,
  prevNextCount = 1,
  showDots = true,
  activeClass = "bg-teal-600 text-white",
  baseClass = "bg-white text-gray-700",
  hoverClass = "hover:bg-teal-100 hover:text-teal-700",
  disabledClass = "text-gray-300 cursor-not-allowed",
  dotClass = "text-gray-400",
  itemPadding = "px-3 py-1",
}) => {
  // Build pages array if not provided
  const pageList = useMemo(() => {
    if (pages && pages.length) return pages;
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [pages, totalPages]);

  // Create visible sequence with dots if needed
  const visibleSequence = useMemo(() => {
    // If dots disabled or small count, show all
    if (!showDots || pageList.length <= 7) return pageList;

    const seq: (number | string)[] = [];
    const last = pageList.length;

    // Always include first and last
    // Smart window around current page
    if (currentPage <= 4) {
      seq.push(1, 2, 3, 4, 5, "...", last);
    } else if (currentPage >= last - 3) {
      seq.push(1, "...", last - 4, last - 3, last - 2, last - 1, last);
    } else {
      seq.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", last);
    }

    return seq;
  }, [pageList, currentPage, showDots]);

  const handlePrev = () => {
    const target = Math.max(1, currentPage - prevNextCount);
    if (target !== currentPage) onPageChange(target);
  };

  const handleNext = () => {
    const target = Math.min(totalPages, currentPage + prevNextCount);
    if (target !== currentPage) onPageChange(target);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Prev */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        aria-label="Previous"
        className={`rounded ${itemPadding} flex items-center justify-center ${
          currentPage === 1 ? disabledClass : `${baseClass} ${hoverClass}`
        }`}
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page buttons / dots */}
      {visibleSequence.map((p, idx) =>
        typeof p === "string" ? (
          <span key={`dot-${idx}`} className={`select-none ${dotClass} ${itemPadding}`}>
            {p}
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={currentPage === p ? "page" : undefined}
            className={`rounded ${itemPadding} min-w-[34px] flex items-center justify-center ${
              currentPage === p ? activeClass : `${baseClass} ${hoverClass}`
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Next"
        className={`rounded ${itemPadding} flex items-center justify-center ${
          currentPage === totalPages ? disabledClass : `${baseClass} ${hoverClass}`
        }`}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
