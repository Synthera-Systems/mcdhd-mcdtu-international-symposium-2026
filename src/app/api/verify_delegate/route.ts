import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { registrationRefId } = await req.json();

    if (!registrationRefId) {
      return NextResponse.json({ valid: false, message: "ID is required" }, { status: 400 });
    }

    // 1. Check if Registration / Delegate ID exists
    const { data: delegate, error: delegateError } = await supabase
      .from("registrations") // or "delegates"
      .select("id, full_name, email")
      .eq("reference_id", registrationRefId)
      .maybeSingle();

    if (delegateError || !delegate) {
      return NextResponse.json({ 
        valid: false, 
        reason: "NOT_FOUND",
        message: "No registration found with this Reference ID." 
      });
    }

    // 2. Check if an abstract has already been submitted with this ID
    const { data: existingSubmission, error: subError } = await supabase
      .from("abstracts")
      .select("id")
      .eq("registration_ref_id", registrationRefId)
      .maybeSingle();

    if (existingSubmission) {
      return NextResponse.json({ 
        valid: false, 
        reason: "ALREADY_SUBMITTED",
        message: "An abstract has already been submitted under this Reference ID." 
      });
    }

    // Return success metadata if needed (e.g. pre-fill presenter email/name)
    return NextResponse.json({ 
      valid: true, 
      delegate: {
        fullName: delegate.full_name,
        email: delegate.email
      }
    });

  } catch (error) {
    return NextResponse.json({ valid: false, message: "Server error during verification" }, { status: 500 });
  }
}