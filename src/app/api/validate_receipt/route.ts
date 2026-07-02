// src/app/api/validate-receipt/route.ts
export const runtime = 'edge';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { base64Image, mimeType, utrNumber } = body;

    if (!base64Image || !utrNumber) {
      return NextResponse.json(
        { error: "Missing required fields (image or UTR)" },
        { status: 400 }
      );
    }

    // 1. Initialize the lightning-fast Gemini 1.5 Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 2. The Strict System Prompt
    const prompt = `
      You are a strict, highly accurate financial auditing AI for an academic symposium. 
      Your job is to analyze the provided bank transfer/UPI payment screenshot.
      
      The user claims their 12-digit UTR/Transaction ID is: ${utrNumber}
      
      Perform the following checks:
      1. Is this a valid banking/UPI payment receipt (e.g., GPay, PhonePe, SBI, HDFC)?
      2. Does the UTR/Transaction ID in the image EXACTLY match the user's claimed UTR?
      
      Respond ONLY with a valid, raw JSON object (no markdown, no backticks, no conversational text). 
      Use exactly this schema:
      {
        "isValidReceipt": boolean,
        "extractedUtr": "string or null",
        "confidenceScore": number,
        "reason": "string explaining why it passed or failed"
      }
    `;

    // 3. Format the image for Gemini's Multimodal engine
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    // 4. Send to Gemini
    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();

    // 5. Clean and Parse the JSON
    // (We strip out markdown backticks just in case Gemini tries to format it)
    const cleanedText = responseText.replace(/```json\n?|\n?```/g, "").trim();
    const jsonResponse = JSON.parse(cleanedText);

    return NextResponse.json(jsonResponse, { status: 200 });

  } catch (error) {
    console.error("Gemini Validation Error:", error);
    return NextResponse.json(
      { error: "Internal server error during AI validation." },
      { status: 500 }
    );
  }
}