import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not set in .env.local" },
      { status: 500 }
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Reply in one short sentence: What is 2 + 2?",
    });

    const text = response.text ?? "(no text in response)";
    return NextResponse.json({
      success: true,
      model: "gemini-2.0-flash",
      reply: text,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Gemini API request failed", detail: message },
      { status: 502 }
    );
  }
}
