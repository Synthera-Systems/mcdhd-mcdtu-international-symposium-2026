// src/app/api/engine/ai_worker/route.ts
export const runtime = 'edge';
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { sendRegistrationVerifiedEmail, sendActionRequiredEmail } from "@/lib/email";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// 1. Add a retry helper function to handle 503 Traffic Spikes
async function generateWithRetry(model: any, prompt: string, imagePart: any, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await model.generateContent([prompt, imagePart]);
    } catch (error: any) {
      // If it's a 503 error and we have retries left, wait and try again
      if (error?.status === 503 && i < maxRetries - 1) {
        const delayMs = Math.pow(2, i) * 1500; // Wait 1.5s, then 3s, then 6s
        console.log(`[AI Worker] Gemini API overloaded (503). Retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else {
        throw error; // Throw if it's not a 503, or if we ran out of retries
      }
    }
  }
}

export async function POST(request: Request) {
  // Define variables here so the catch block can use them for the fallback
  let delegateId, utrNumber, screenshotUrl, email, fullName, referenceId, actionToken;

  try {
    const body = await request.json();
    ({ delegateId, utrNumber, screenshotUrl, email, fullName, referenceId, actionToken } = body);

    console.log(`[AI Worker] Starting verification for ${referenceId}...`);

    // 2. Fetch the image directly from Supabase Storage
    const imageResponse = await fetch(screenshotUrl);
    if (!imageResponse.ok) throw new Error("Failed to download image from storage");
    
    const arrayBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';

    // 3. Run the Gemini Vision Analysis
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = `
      You are a strict, highly accurate financial auditing AI for an academic symposium. 
      Analyze the provided bank transfer/UPI payment screenshot.
      
      The user claims their 12-digit UTR/Transaction ID is: ${utrNumber}
      
      Perform these exact checks:
      1. Is this a legitimate banking/UPI payment receipt?
      2. Does the UTR/Transaction ID in the image EXACTLY match the claimed UTR?
      
      Respond ONLY with a valid, raw JSON object using this schema:
      {
        "isValidReceipt": boolean,
        "reason": "string explaining why it passed or exactly why it failed"
      }
    `;

    const imagePart = { inlineData: { data: base64Image, mimeType } };
    
    // 4. Use the robust retry function instead of a single call
    const result = await generateWithRetry(model, prompt, imagePart);
    
    const responseText = result?.response.text().replace(/```json\n?|\n?```/g, "").trim();
    if (!responseText) throw new Error("Empty response from AI");
    const aiData = JSON.parse(responseText);

    // 5. Update the Database based on Gemini's decision
    const newStatus = aiData.isValidReceipt ? "PENDING_APPROVAL" : "ACTION_REQUIRED";
    
    await prisma.payment.update({
      where: { delegateId },
      data: {
        status: newStatus,
        aiValidationLog: JSON.stringify(aiData)
      }
    });

    // 6. Log the outcome and trigger the correct Nodemailer email
    if (aiData.isValidReceipt) {
      console.log(`[AI Worker] SUCCESS: ${referenceId} verified.`);
      sendRegistrationVerifiedEmail(email, fullName, referenceId); 
    } else {
      console.log(`[AI Worker] FAILED: ${referenceId} rejected. Reason: ${aiData.reason}`);
      sendActionRequiredEmail(email, fullName, actionToken, aiData.reason);
    }

    return NextResponse.json({ success: true, status: newStatus });

  } catch (error: any) {
    console.error("[AI Worker Fatal Error]:", error);

    // 7. Graceful Fallback: Push to manual review if AI completely fails
    if (delegateId) {
      console.log(`[AI Worker] Routing ${referenceId || delegateId} to Manual Review due to API failure.`);
      
      try {
        await prisma.payment.update({
          where: { delegateId },
          data: {
            status: "PENDING_APPROVAL", // Route to Admin Dashboard safely
            aiValidationLog: `Manual Review Required: AI Engine failed to process receipt. Error: ${error.message || 'Unknown'}`
          }
        });
      } catch (dbError) {
        console.error("[AI Worker] Failed to update fallback status:", dbError);
      }
    }

    return NextResponse.json(
      { error: "AI processing failed, routed to manual review." }, 
      { status: 500 }
    );
  }
}