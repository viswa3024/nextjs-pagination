"use client";

import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  totalPages: number;
  pages?: number[];
  currentPage: number;
  onPageChange: (page: number) => void;
  prevNextCount?: number;
  showDots?: boolean;
  activeClass?: string;
  baseClass?: string;
  hoverClass?: string;
  disabledClass?: string;
  dotClass?: string;
  itemPadding?: string;

  // 👇 new optional param: how many numeric items (excluding dots) to show in visible window
  numItemsToShow?: number;
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
  numItemsToShow = 7, // 👈 default to 7 if not passed
}) => {
  const pageList = useMemo(() => {
    if (pages && pages.length) return pages;
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [pages, totalPages]);

  const visibleSequence = useMemo(() => {
    // if dots disabled or total small, show all
    if (!showDots || pageList.length <= numItemsToShow) return pageList;

    const seq: (number | string)[] = [];
    const last = pageList.length;

    // Always include first and last
    const half = Math.floor(numItemsToShow / 2);

    if (currentPage <= half + 1) {
      // near start
      for (let i = 1; i <= numItemsToShow - 2; i++) seq.push(i);
      seq.push("...", last);
    } else if (currentPage >= last - half) {
      // near end
      seq.push(1, "...");
      for (let i = last - (numItemsToShow - 3); i <= last; i++) seq.push(i);
    } else {
      // middle window
      seq.push(1, "...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) seq.push(i);
      seq.push("...", last);
    }

    return seq;
  }, [pageList, currentPage, showDots, numItemsToShow]);

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
