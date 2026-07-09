// --- Corrected Version of src/app/api/admin/archive/route.ts ---
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import JSZip from "jszip";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); 
    const shouldDelete = searchParams.get("delete") === "true";

    const zip = new JSZip();

    if (type === "receipts") {
      const delegates = await prisma.delegate.findMany({
        include: { payment: true }
      });

      for (const d of delegates) {
        if (d.payment?.screenshotUrl) {
          const pathKey = d.payment.screenshotUrl.split("/").pop();
          if (!pathKey) continue;

          const { data, error } = await supabaseAdmin.storage.from("receipts").download(pathKey);
          if (!error && data) {
            const fileExt = pathKey.split(".").pop();
            zip.file(`${d.email}-receipt.${fileExt}`, data.arrayBuffer());
          }
        }
      }
    } else if (type === "abstracts") {
      const abstracts = await prisma.submission.findMany();

      for (const abs of abstracts) {
        if (abs.fileUrl) {
          const pathKey = abs.fileUrl.split("/").pop();
          if (!pathKey) continue;

          const { data, error } = await supabaseAdmin.storage.from("abstracts").download(pathKey);
          if (!error && data) {
            const fileExt = pathKey.split(".").pop();
            zip.file(`${abs.presenterEmail}-abstract.${fileExt}`, data.arrayBuffer());

            if (shouldDelete) {
              await supabaseAdmin.storage.from("abstracts").remove([pathKey]);
              await prisma.submission.update({
                where: { id: abs.id },
                data: { fileUrl: "DOWNLOADED_AND_PURGED" }
              });
            }
          }
        }
      }
    } else {
      return NextResponse.json({ error: "Invalid context archive parameters." }, { status: 400 });
    }

    const archiveBuffer = await zip.generateAsync({ type: "nodebuffer" });

    // FIX: Wrapped the raw Node buffer into a standard Web API safe Uint8Array array boundary map
    const responseArray = new Uint8Array(archiveBuffer);

    return new Response(responseArray, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=symposium-${type}-archive-${Date.now()}.zip`,
      },
    });

  } catch (error: any) {
    console.error("Archiver Processing Crash:", error);
    return NextResponse.json({ error: "Failed to construct system archive zip structure." }, { status: 500 });
  }
}