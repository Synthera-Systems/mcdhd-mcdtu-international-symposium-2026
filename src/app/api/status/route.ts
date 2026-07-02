// src/app/api/status/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Extract the 'ref' parameter from the URL (e.g., /api/status?ref=REF-123)
    const { searchParams } = new URL(request.url);
    const refId = searchParams.get("ref");

    if (!refId) {
      return NextResponse.json({ error: "Reference ID is required." }, { status: 400 });
    }

    // Search the database for the exact reference ID, including their payment status
    const delegate = await prisma.delegate.findUnique({
      where: { referenceId: refId.trim().toUpperCase() },
      include: { payment: true },
    });

    if (!delegate) {
      return NextResponse.json(
        { error: "No application found with that Reference ID. Please check for typos." },
        { status: 404 }
      );
    }

    // Return only safe, necessary data to the frontend
    return NextResponse.json({
      fullName: delegate.fullName,
      affiliation: delegate.affiliation,
      category: delegate.category,
      paymentStatus: delegate.payment?.status || "PENDING_APPROVAL",
      submittedAt: delegate.createdAt,
    }, { status: 200 });

  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching status." },
      { status: 500 }
    );
  }
}