// src/app/api/submit_abstract/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendAbstractReceivedEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Extract the new presenterEmail field
    const { title, authors, presenterEmail, type, fileUrl } = body;

    if (!title || !authors || !presenterEmail || !type || !fileUrl) {
      return NextResponse.json({ error: "Missing required submission fields." }, { status: 400 });
    }

    // Generate a unique Reference ID for the abstract (e.g., ABS-A1B2C3-26)
    const referenceId = `ABS-${Math.random().toString(36).substring(2, 8).toUpperCase()}-26`;

    // 2. Save to PostgreSQL
    const newSubmission = await prisma.submission.create({
      data: {
        title,
        authors,
        presenterEmail, // Saved to DB so we can link it later!
        type,
        fileUrl,
        referenceId,
      },
    });

    sendAbstractReceivedEmail(presenterEmail, title, referenceId);

    return NextResponse.json({ success: true, referenceId: newSubmission.referenceId }, { status: 201 });

  } catch (error: any) {
    console.error("Submission API Error:", error);
    return NextResponse.json(
      { error: `Database Error: ${error.message || "Unknown error"}` }, 
      { status: 500 }
    );
  }
}