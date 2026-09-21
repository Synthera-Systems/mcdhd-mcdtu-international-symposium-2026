// src/app/api/verify_delegate/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Accept either registrationRefId or referenceId
    const rawId = body.registrationRefId || body.referenceId;

    if (!rawId) {
      return NextResponse.json(
        { valid: false, message: "Reference ID is required" }, 
        { status: 400 }
      );
    }

    const cleanedId = String(rawId).trim().toUpperCase();

    // 1. Check if Delegate exists in the Delegate table
    const delegate = await prisma.delegate.findFirst({
      where: {
        referenceId: {
          equals: cleanedId,
          mode: "insensitive",
        },
      },
      include: {
        payment: true,
      },
    });

    if (!delegate) {
      return NextResponse.json({ 
        valid: false, 
        reason: "NOT_FOUND",
        message: "No registration found with this Reference ID." 
      });
    }

    // 2. Check if an abstract has already been submitted under this Reference ID
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        referenceId: {
          equals: cleanedId,
          mode: "insensitive",
        },
      },
    });

    if (existingSubmission) {
      return NextResponse.json({ 
        valid: false, 
        reason: "ALREADY_SUBMITTED",
        message: "An abstract has already been submitted under this Reference ID." 
      });
    }

    // 3. Return verified delegate details to pre-fill form fields
    return NextResponse.json({ 
      valid: true, 
      delegate: {
        id: delegate.id,
        fullName: delegate.fullName,
        email: delegate.email,
        category: delegate.category,
        referenceId: delegate.referenceId,
      }
    });

  } catch (error: any) {
    console.error("Verification route error:", error);
    return NextResponse.json(
      { valid: false, message: "Server error during verification" }, 
      { status: 500 }
    );
  }
}