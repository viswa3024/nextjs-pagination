
"use client";

import { useState, useMemo } from "react";
import GLBViewer from "@/components/GLBViewer";
import ImagePreview from "./ImagePreview";
import Pagination from "./Pagination";


const generateSampleItems = (count: number) =>
  Array.from({ length: count }, (_, i) => `Item ${i + 1}`);

export default function Page() {
    const allItems = useMemo(() => generateSampleItems(53), []);
  const itemsPerPage = 3;

  // total pages (user wanted totalItems to represent pages)
  const totalPages = Math.ceil(allItems.length / itemsPerPage);

  const [currentPage, setCurrentPage] = useState<number>(1);

  // items for this page (dynamically derived)
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return allItems.slice(start, start + itemsPerPage);
  }, [allItems, currentPage, itemsPerPage]);

  return (
    <div className="p-6 flex flex-col gap-10">
      <h1 className="text-2xl mb-4">Local GLB Preview</h1>
      {/* <GLBViewer fileUrl="/models/myModel111.glb" transparentBg /> */}
      <ImagePreview fileUrl="/images/image2.jpg" imageWidth={20} imageHeight={20} />
      {/* <div className="font-instruments text-xl text-gray-900">
        Hello, Instrument Sans!
      </div> */}

       <div className="min-h-screen flex flex-col items-center justify-start gap-6 p-8 bg-gray-50">
      <h1 className="text-2xl font-semibold mt-6">Pagination (totalPages = {totalPages})</h1>

      <div className="w-full max-w-xl bg-white p-4 rounded shadow">
        <div className="grid grid-cols-1 gap-2">
          {pageItems.map((it) => (
            <div key={it} className="p-3 rounded border border-gray-100">
              {it}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(p) => setCurrentPage(p)}
            prevNextCount={1} // prev & next jump by 1 page
            showDots={true}
            // custom tailwind classes (change to taste)
            activeClass="bg-teal-600 text-white shadow"
            baseClass="bg-white text-gray-700 border border-gray-200"
            hoverClass="hover:bg-teal-50 hover:text-teal-700"
            disabledClass="text-gray-300 cursor-not-allowed"
            dotClass="text-gray-400 px-3 py-1"
            itemPadding="px-3 py-1"
          />
        </div>
      </div>

      <p className="text-sm text-gray-600">Current page: {currentPage}</p>
    </div>
    </div>
  );
}
