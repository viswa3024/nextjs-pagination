
"use client";

import { useState, useMemo, useEffect } from "react";
import GLBViewer from "@/components/GLBViewer";
import ImagePreview from "./ImagePreview";
import Pagination from "./Pagination";


type RecordType = {
  id: number;
  name: string;
};

export default function Page() {
   const [data, setData] = useState<RecordType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limit = 5; // items per page

  // Fetch data from API
  const fetchData = async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/data?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch data");

      const json = await res.json();
      setData(json.data);
      setTotalPages(json.totalPages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // initial load + when page changes
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  return (
    <div className="p-6 flex flex-col gap-10">
      <h1 className="text-2xl mb-4">Local GLB Preview</h1>
      {/* <GLBViewer fileUrl="/models/myModel111.glb" transparentBg /> */}
      <ImagePreview fileUrl="/images/image2.jpg" imageWidth={20} imageHeight={20} />
      {/* <div className="font-instruments text-xl text-gray-900">
        Hello, Instrument Sans!
      </div> */}

        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <h1 className="text-2xl font-semibold mb-6">
        Server-side Pagination Example
      </h1>

      <div className="w-full max-w-lg bg-white p-6 rounded shadow">
        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && (
          <ul className="divide-y divide-gray-200">
            {data.map((item) => (
              <li key={item.id} className="py-2">
                {item.name}
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
            prevNextCount={1}
            showDots={true}
            activeClass="bg-teal-600 text-white"
            baseClass="bg-white text-gray-700 border border-gray-200"
            hoverClass="hover:bg-teal-50 hover:text-teal-700"
            disabledClass="text-gray-300 cursor-not-allowed"
            dotClass="text-gray-400"
            itemPadding="px-3 py-1"
          />
        </div>
      </div>
    </div>
    </div>
  );
}
