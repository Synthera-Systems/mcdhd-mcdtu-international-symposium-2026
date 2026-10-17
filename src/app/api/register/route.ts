// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { sendRegistrationReceivedEmail } from "@/lib/email";
import { getRegistrationPhase, REGISTRATION_CONTACT_EMAIL } from "@/lib/registrationDeadline";

export async function POST(request: Request) {
  try {
    // Hard cut-off: online registration closes 18 Oct 2026 midnight (IST).
    const phase = getRegistrationPhase();
    if (phase !== "ONLINE_OPEN") {
      const message = phase === "EMAIL_ONLY"
        ? `Online registration closed on 18th October midnight. Registration requests are accepted via email only (${REGISTRATION_CONTACT_EMAIL}) till 20th October midnight.`
        : "Registration for MitoCan-Symposium 2026 is now closed.";
      return NextResponse.json({ error: message, registrationClosed: true }, { status: 403 });
    }

    const body = await request.json();
    const { 
      fullName, affiliation, email, category, 
      utrNumber, screenshotUrl, participationType 
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
        referenceId,
        payment: {
          create: {
            utrNumber, screenshotUrl, actionToken, status: "PROCESSING", 
          }
        }
      },
    });

    // 1. Send immediate registration acknowledgement email
    sendRegistrationReceivedEmail(email, fullName, referenceId);

    // 2. Trigger asynchronous AI background worker
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