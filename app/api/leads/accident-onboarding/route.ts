import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface LeadPayload {
  answers: {
    state?: string;
    city?: string;
    month?: string;
    involvement?: string;
    medical?: string;
    lawyer?: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string | null;
    details: string | null;
  };
  submittedAt: string;
}

/**
 * POST /api/leads/accident-onboarding
 *
 * Receives lead submissions from the homepage accident wizard.
 * Stores the lead in the database for follow-up.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LeadPayload;

    // Validate required fields
    if (!body.contact?.name?.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!body.contact?.email?.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.contact.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Get IP and user agent for tracking
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor?.split(",")[0]?.trim() || null;
    const userAgent = req.headers.get("user-agent") || null;

    // Create the lead in the database
    const lead = await prisma.lead.create({
      data: {
        name: body.contact.name.trim(),
        phone: body.contact.phone?.trim() || null,
        email: body.contact.email.trim(),
        details: body.contact.details?.trim() || null,
        answers: body.answers,
        source: "accident-onboarding-wizard",
        ipAddress,
        userAgent,
      },
    });

    console.log(`[Lead] New onboarding lead created: ${lead.id}`);

    return NextResponse.json({
      ok: true,
      leadId: lead.id,
    });
  } catch (error) {
    console.error("[Lead] Failed to save onboarding lead:", error);
    return NextResponse.json(
      { error: "Failed to save your information. Please try again." },
      { status: 500 }
    );
  }
}
