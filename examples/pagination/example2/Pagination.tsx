"use client";

import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;

  // how many visible items (excluding dots)
  numItemsToShow?: number;

  prevNextCount?: number;
  visibleSequence?: (number | string)[];

  activeClass?: string;
  baseClass?: string;
  hoverClass?: string;
  disabledClass?: string;
  dotClass?: string;
  itemPadding?: string;
};

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  numItemsToShow = 7, // 👈 same meaning as numItemsToShow in your reference
  prevNextCount = 1,
  visibleSequence,
  activeClass = "bg-teal-600 text-white",
  baseClass = "bg-white text-gray-700 border border-gray-200",
  hoverClass = "hover:bg-teal-50 hover:text-teal-700",
  disabledClass = "text-gray-300 cursor-not-allowed",
  dotClass = "text-gray-400",
  itemPadding = "px-3 py-1",
}) => {
  // if user passed custom sequence, use it directly
  const sequence = useMemo(() => {
    if (visibleSequence && visibleSequence.length) return visibleSequence;

    const pages: (number | string)[] = [];

    if (totalPages <= numItemsToShow) {
      // show all pages (no dots)
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    const half = Math.floor(numItemsToShow / 2);
    let start = Math.max(2, currentPage - half);
    let end = Math.min(totalPages - 1, start + numItemsToShow - 3);

    // adjust if near the end
    if (end === totalPages - 1) {
      start = Math.max(2, end - (numItemsToShow - 3));
    }

    // always include first page
    pages.push(1);

    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages - 1) pages.push("...");

    // always include last page
    pages.push(totalPages);

    return pages;
  }, [visibleSequence, currentPage, totalPages, numItemsToShow]);

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
        className={`rounded ${itemPadding} flex items-center justify-center ${
          currentPage === 1 ? disabledClass : `${baseClass} ${hoverClass}`
        }`}
      >
        <ChevronLeft size={16} />
      </button>

      {/* Pages */}
      {sequence.map((p, idx) =>
        typeof p === "string" ? (
          <span key={`dot-${idx}`} className={`select-none ${dotClass} ${itemPadding}`}>
            {p}
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
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
