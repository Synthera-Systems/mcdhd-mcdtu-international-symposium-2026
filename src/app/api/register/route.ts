// src/app/api/register/route.ts
export const runtime = 'edge';
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      fullName, 
      affiliation, 
      email, 
      category, 
      utrNumber, 
      screenshotUrl,
      participationType, // NEW: Extracted from frontend
      linkedAbstractId   // NEW: Extracted from frontend
    } = body;

    // 1. Basic validation
    if (!fullName || !email || !utrNumber || !screenshotUrl || !category) {
      return NextResponse.json(
        { error: "Missing required registration fields." },
        { status: 400 }
      );
    }

    // --- FIX: Map the incoming category to the exact Prisma Enum ---
    let mappedCategory: any = "STUDENT"; // Default fallback
    const upperCategory = category.toUpperCase();
    
    if (upperCategory.includes("STUDENT")) mappedCategory = "STUDENT";
    else if (upperCategory.includes("FACULTY")) mappedCategory = "FACULTY";
    else if (upperCategory.includes("INDUSTRY")) mappedCategory = "INDUSTRY";
    else if (upperCategory.includes("FOREIGN") || upperCategory.includes("INTERNATIONAL")) mappedCategory = "FOREIGN";
    // ----------------------------------------------------------------

    // 2. Check for duplicates instantly
    const existingUser = await prisma.delegate.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "A delegate with this email is already registered." },
        { status: 409 }
      );
    }

    const existingUTR = await prisma.payment.findUnique({
      where: { utrNumber }
    });

    if (existingUTR) {
      return NextResponse.json(
        { error: "This UTR number has already been used. Please contact support." },
        { status: 409 }
      );
    }

    // 3. Generate Secure Tokens
    // Create a 6-character alphanumeric reference ID
    const referenceId = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}-26`;
    // Create a secret action token for the re-upload email link
    const actionToken = crypto.randomUUID(); 

    // 4. Save to database immediately in PROCESSING state
    const newRegistration = await prisma.delegate.create({
      data: {
        fullName,
        affiliation,
        email,
        category: mappedCategory, // Safe, mapped Enum value
        participationType: participationType || "GENERAL_ATTENDEE", 
        linkedAbstractId: linkedAbstractId || null,                 
        referenceId,
        payment: {
          create: {
            utrNumber,
            screenshotUrl,
            actionToken,
            status: "PROCESSING", 
          }
        }
      },
    });

    // 5. Fire the AI Worker in the background!
    // We send a POST request to our own server, but we DO NOT await it.
    // Ensure the folder uses an underscore, not a hyphen.
    const baseUrl = request.headers.get('origin') || 'http://localhost:3000';
    fetch(`${baseUrl}/api/engine/ai_worker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        delegateId: newRegistration.id,
        utrNumber,
        screenshotUrl,
        email,
        fullName,
        referenceId,
        actionToken
      })
    }).catch(err => console.error("Failed to kick off AI Worker:", err));

    // 6. Return success to the frontend instantly
    return NextResponse.json({ 
      success: true, 
      referenceId: newRegistration.referenceId 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Registration API Error:", error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "This UTR number or Email has already been submitted." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error during registration." },
      { status: 500 }
    );
  }
}