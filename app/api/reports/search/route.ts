import { NextRequest, NextResponse } from "next/server";
import { mockReports } from "@/lib/mockData";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get("state");
    const city = searchParams.get("city");
    const date = searchParams.get("date");

    // Filter reports based on provided parameters
    let filteredReports = mockReports;

    if (state) {
      filteredReports = filteredReports.filter(
        (report) =>
          report.accidentDetails.state.toLowerCase() === state.toLowerCase()
      );
    }

    if (city) {
      filteredReports = filteredReports.filter(
        (report) =>
          report.accidentDetails.city.toLowerCase() === city.toLowerCase()
      );
    }

    if (date) {
      filteredReports = filteredReports.filter(
        (report) => report.accidentDetails.date === date
      );
    }

    return NextResponse.json({
      reports: filteredReports,
      count: filteredReports.length,
    });
  } catch (error) {
    console.error("Error searching reports:", error);
    return NextResponse.json(
      { error: "Failed to search reports" },
      { status: 500 }
    );
  }
}
