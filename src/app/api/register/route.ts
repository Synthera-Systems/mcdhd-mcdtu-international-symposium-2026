// --- src/app/api/register/route.ts ---
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      fullName, affiliation, email, category, 
      utrNumber, screenshotUrl, participationType 
      // REMOVED: linkedAbstractId
    } = body;

    if (!fullName || !email || !utrNumber || !screenshotUrl || !category) {
      return NextResponse.json({ error: "Missing required registration fields." }, { status: 400 });
    }

    let mappedCategory: any = "STUDENT"; 
    const upperCategory = category.toUpperCase();
    if (upperCategory.includes("STUDENT")) mappedCategory = "STUDENT";
    else if (upperCategory.includes("FACULTY")) mappedCategory = "FACULTY";
    else if (upperCategory.includes("INDUSTRY")) mappedCategory = "INDUSTRY";
    else if (upperCategory.includes("FOREIGN") || upperCategory.includes("INTERNATIONAL")) mappedCategory = "FOREIGN";

    const existingUser = await prisma.delegate.findUnique({ where: { email } });
    if (existingUser) return NextResponse.json({ error: "A delegate with this email is already registered." }, { status: 409 });

    const existingUTR = await prisma.payment.findUnique({ where: { utrNumber } });
    if (existingUTR) return NextResponse.json({ error: "This UTR number has already been used. Please contact support." }, { status: 409 });

    const referenceId = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}-26`;
    const actionToken = crypto.randomUUID(); 

    const newRegistration = await prisma.delegate.create({
      data: {
        fullName, affiliation, email, category: mappedCategory,
        participationType: participationType || "GENERAL_ATTENDEE", 
        // linkedAbstractId remains null here. It will be updated later when they submit an abstract.
        referenceId,
        payment: {
          create: {
            utrNumber, screenshotUrl, actionToken, status: "PROCESSING", 
          }
        }
      },
    });

    const baseUrl = request.headers.get('origin') || 'http://localhost:3000';
    fetch(`${baseUrl}/api/engine/ai_worker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        delegateId: newRegistration.id, utrNumber, screenshotUrl, email,
        fullName, referenceId, actionToken
      })
    }).catch(err => console.error("Failed to kick off AI Worker:", err));

    return NextResponse.json({ success: true, referenceId: newRegistration.referenceId }, { status: 201 });

  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ error: "This UTR number or Email has already been submitted." }, { status: 409 });
    return NextResponse.json({ error: "Internal server error during registration." }, { status: 500 });
  }
}