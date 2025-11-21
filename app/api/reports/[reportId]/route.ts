import { NextRequest, NextResponse } from "next/server";
import { mockReports } from "@/lib/mockData";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ reportId: string }> }
) {
  try {
    const { reportId } = await context.params;

    // Find the report by ID
    const report = mockReports.find((r) => r.id === reportId);

    if (!report) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}
