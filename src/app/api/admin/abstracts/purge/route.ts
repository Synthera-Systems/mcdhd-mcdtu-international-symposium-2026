import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(request: Request) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { abstractId } = body;

    if (!abstractId) {
      return NextResponse.json({ error: "Abstract record target ID is required." }, { status: 400 });
    }

    const abstractRow = await prisma.submission.findUnique({
      where: { id: abstractId },
    });

    if (!abstractRow) {
      return NextResponse.json({ error: "Target abstract record could not be found." }, { status: 404 });
    }

    if (abstractRow.fileUrl === "DOWNLOADED_AND_PURGED") {
      return NextResponse.json({ error: "This file asset has already been purged." }, { status: 400 });
    }

    const pathKey = abstractRow.fileUrl.split("/").pop();
    if (pathKey) {
      const { error: storageError } = await supabaseAdmin.storage
        .from("abstracts")
        .remove([pathKey]);

      if (storageError) {
        console.error("Supabase clear warning:", storageError);
        throw new Error("Failed to clear raw asset from cloud bucket.");
      }
    }

    const updatedRow = await prisma.submission.update({
      where: { id: abstractId },
      data: { fileUrl: "DOWNLOADED_AND_PURGED" },
    });

    return NextResponse.json({
      success: true,
      message: "Abstract manuscript deleted safely. Bucket capacity cleared.",
      updatedStatus: updatedRow.fileUrl,
    }, { status: 200 });
  } catch (error: any) {
    console.error("Abstract Purging Handler Crash:", error);
    return NextResponse.json({ error: error.message || "Internal server error during purging." }, { status: 500 });
  }
}