import { NextResponse } from "next/server";

// total records (for example: 400)
const TOTAL_RECORDS = 400;

// simulate dataset
const data = Array.from({ length: TOTAL_RECORDS }, (_, i) => ({
  id: i + 1,
  name: `Record ${i + 1}`,
}));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedData = data.slice(start, end);

  return NextResponse.json({
    total: TOTAL_RECORDS,
    totalPages: Math.ceil(TOTAL_RECORDS / limit),
    page,
    limit,
    data: paginatedData,
  });
}
