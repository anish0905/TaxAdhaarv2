import { NextResponse } from "next/server";

// Aapka servicesData yahan define ya import hona chahiye
const servicesData ="../../../data/services"; // Apne actual path ke hisaab se adjust karein
export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    // Stable URL: gemini-1.5-flash use karein
   const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

const systemInstructions = `
  Identity: You are "TaxAdhaar AI". Professional Tax Expert.
  
  Output Formatting Rules:
  1. Always use double new lines (\n\n) between different sections.
  2. Use "###" for main headings.
  3. Use "**" for bold labels (e.g., **Documents:**).
  4. Use "*" for bullet points with a space after it.
  5. Never send a wall of text. Break it down into small chunks.

  Example Format:
  ### ITR Filing Info
  
  **Required Docs:**
  * PAN Card
  * Aadhaar Card
`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ 
            text: `${systemInstructions}\n\nUser message: ${message}` 
          }]
        }]
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Gemini Error:", data.error.message);
      return NextResponse.json({ error: data.error.message }, { status: data.error.code || 500 });
    }

    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf kijiye, main abhi samajh nahi paa raha hoon.";
    
    return NextResponse.json({ text: aiText });

  } catch (error: any) {
    console.error("Server Crash:", error);
    return NextResponse.json({ error: "Server Side Issue" }, { status: 500 });
  }
}