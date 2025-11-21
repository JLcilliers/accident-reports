import { NextRequest, NextResponse } from "next/server";
import { legalLeads, generateId } from "@/lib/mockData";
import { LegalLead } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, state, description, reportId } = body;

    // Validate required fields
    if (!name || !email || !state || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new legal lead
    const newLead: LegalLead = {
      id: generateId("LEAD"),
      name,
      email,
      phone,
      state,
      description,
      reportId,
      createdAt: new Date().toISOString(),
    };

    // Store the lead (in-memory for MVP)
    legalLeads.push(newLead);

    // Return the created lead
    return NextResponse.json({
      leadId: newLead.id,
      success: true,
      message: "Thank you! An attorney will contact you shortly.",
    });
  } catch (error) {
    console.error("Error creating legal lead:", error);
    return NextResponse.json(
      { error: "Failed to create legal lead" },
      { status: 500 }
    );
  }
}
