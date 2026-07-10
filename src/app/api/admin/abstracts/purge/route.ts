// --- src/app/api/admin/abstracts/purge/route.ts ---
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { abstractId } = body; // Expects standard database ID string

    if (!abstractId) {
      return NextResponse.json({ error: "Abstract record target ID is required." }, { status: 400 });
    }

    // 1. Locate the scientific manuscript entry first
    const abstractRow = await prisma.submission.findUnique({
      where: { id: abstractId }
    });

    if (!abstractRow) {
      return NextResponse.json({ error: "Target abstract record could not be found." }, { status: 404 });
    }

    if (abstractRow.fileUrl === "DOWNLOADED_AND_PURGED") {
      return NextResponse.json({ error: "This file asset has already been purged from object cloud memory storage." }, { status: 400 });
    }

    // 2. Isolate file path pointer and remove it from the Supabase Abstracts storage bucket
    const pathKey = abstractRow.fileUrl.split("/").pop();
    if (pathKey) {
      const { error: storageError } = await supabaseAdmin.storage
        .from("abstracts")
        .remove([pathKey]);

      if (storageError) {
        console.error("Supabase clear warning:", storageError);
        throw new Error("Failed to clear raw asset from cloud bucket memory storage.");
      }
    }

    // 3. Mark row as downloaded and purged so it never crashes later admin processes
    const updatedRow = await prisma.submission.update({
      where: { id: abstractId },
      data: { fileUrl: "DOWNLOADED_AND_PURGED" }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Abstract manuscript deleted safely. Bucket capacity cleared.",
      updatedStatus: updatedRow.fileUrl 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Abstract Purging Handler Crash:", error);
    return NextResponse.json({ error: error.message || "Internal server error during purging routing." }, { status: 500 });
  }
}