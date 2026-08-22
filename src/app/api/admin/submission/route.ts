import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth";
import { sendAbstractAcceptedEmail, sendAbstractRejectedEmail } from "@/lib/email";

export async function PUT(request: Request) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { submissionId, newStatus } = await request.json();

    if (!submissionId || !newStatus) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: { status: newStatus },
    });

    if (newStatus === "ACCEPTED_ORAL") {
      sendAbstractAcceptedEmail(
        updatedSubmission.presenterEmail,
        updatedSubmission.title,
        updatedSubmission.referenceId,
        "Oral Presentation"
      );
    } else if (newStatus === "ACCEPTED_POSTER") {
      sendAbstractAcceptedEmail(
        updatedSubmission.presenterEmail,
        updatedSubmission.title,
        updatedSubmission.referenceId,
        "Poster Presentation"
      );
    } else if (newStatus === "REJECTED") {
      sendAbstractRejectedEmail(updatedSubmission.presenterEmail, updatedSubmission.title);
    }

    return NextResponse.json({ success: true, submission: updatedSubmission }, { status: 200 });
  } catch (error: any) {
    console.error("Submission Update Error:", error);
    return NextResponse.json({ error: "Failed to update submission" }, { status: 500 });
  }
}