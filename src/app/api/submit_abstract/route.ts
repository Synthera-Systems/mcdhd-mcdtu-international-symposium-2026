// --- src/app/api/submit_abstract/route.ts ---
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendAbstractReceivedEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { title, authors, presenterEmail, type, fileUrl, registrationRefId } = body;

    if (!title || !authors || !presenterEmail || !type || !fileUrl || !registrationRefId) {
      return NextResponse.json({ error: "Missing required submission fields, including Registration ID." }, { status: 400 });
    }

    // 1. STRICT VALIDATION: Look up the delegate by their Registration Reference ID
    const delegate = await prisma.delegate.findUnique({
      where: { referenceId: registrationRefId },
      include: { payment: true }
    });

    if (!delegate) {
      return NextResponse.json({ error: `Invalid Registration ID: ${registrationRefId} could not be found.` }, { status: 404 });
    }

    // Ensure the email matches to prevent people from guessing random REF IDs
    if (delegate.email.toLowerCase() !== presenterEmail.toLowerCase()) {
      return NextResponse.json({ error: "The provided email does not match the email associated with this Registration ID." }, { status: 403 });
    }

    // 2. Assess Payment Status
    let abstractStatus = "PENDING_REGISTRATION_VERIFICATION";
    if (delegate.payment?.status === "COMPLETED") abstractStatus = "PENDING_REVIEW";
    else if (delegate.payment?.status === "ACTION_REQUIRED") abstractStatus = "PAYMENT_ACTION_REQUIRED";
    else if (delegate.payment?.status === "PROCESSING") abstractStatus = "PENDING_REGISTRATION_VERIFICATION";

    // 3. Generate Abstract ID and Save
    const referenceId = `ABS-${Math.random().toString(36).substring(2, 8).toUpperCase()}-26`;

    const newSubmission = await prisma.submission.create({
      data: {
        title,
        authors,
        presenterEmail, 
        type,
        fileUrl,
        referenceId,
        status: abstractStatus
      },
    });

    // 4. LINK IT BACK: Update the Delegate record with this new abstract ID
    let updatedParticipationRole = "GENERAL_ATTENDEE";
    if (type === "Oral Presentation") {
      updatedParticipationRole = "ORAL_PRESENTER";
    } else if (type === "Poster Presentation") {
      updatedParticipationRole = "POSTER_PRESENTER";
    }
    
    await prisma.delegate.update({
      where: { id: delegate.id },
      data: { 
        linkedAbstractId: referenceId,
        participationType: updatedParticipationRole 
      }
    });
    
    sendAbstractReceivedEmail(presenterEmail, title, referenceId);

    // Return the dynamic status to the frontend so we can show the proper success message
    return NextResponse.json({ 
      success: true, 
      referenceId: newSubmission.referenceId,
      status: abstractStatus
    }, { status: 201 });

  } catch (error: any) {
    console.error("Submission API Error:", error);
    return NextResponse.json({ error: `Database Error: ${error.message || "Unknown error"}` }, { status: 500 });
  }
}