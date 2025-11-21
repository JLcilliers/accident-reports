import { NextRequest, NextResponse } from "next/server";
import { reportRequests, findMatchingReport, generateId } from "@/lib/mockData";
import { ReportRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accidentDetails, contact } = body;

    // Validate required fields
    if (!accidentDetails || !contact) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Try to find a matching report
    const matchedReport = findMatchingReport(
      accidentDetails.state,
      accidentDetails.city,
      accidentDetails.date
    );

    // Create a new report request
    const newRequest: ReportRequest = {
      id: generateId("REQ"),
      accidentDetails,
      contact,
      createdAt: new Date().toISOString(),
      matchedReportId: matchedReport?.id,
    };

    // Store the request (in-memory for MVP)
    reportRequests.push(newRequest);

    // Return the created request with matched report ID if found
    return NextResponse.json({
      requestId: newRequest.id,
      matchedReportId: matchedReport?.id,
      success: true,
    });
  } catch (error) {
    console.error("Error creating report request:", error);
    return NextResponse.json(
      { error: "Failed to create report request" },
      { status: 500 }
    );
  }
}
