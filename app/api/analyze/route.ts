import { NextResponse } from "next/server";
import { extractTextFromBuffer } from "@/lib/pdfParser";
import { PrismaClient } from "@prisma/client";
import { callGemini } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Convert file to text
    const buffer = Buffer.from(await file.arrayBuffer());
    const resumeText = await extractTextFromBuffer(buffer);

    // Prompt for Gemini
    const prompt = `
You're an AI resume analyzer. Given the text of a resume, return a valid JSON object with exactly these fields:

{
  "summary": "A concise summary of the resume content and key qualifications",
  "skills": ["JavaScript", "React", "Node.js"],
  "email": "email@example.com",
  "score": 85,
  "improve": "First improvement suggestion\\nSecond improvement suggestion\\nThird improvement suggestion"
}

Important:
- summary: must be a string
- skills: must be an array of strings
- email: must be a string or null if no email found
- score: must be a number between 0-100
- improve: must be a string with suggestions separated by \\n

Respond ONLY with valid JSON, no other text.

Resume text:
${resumeText}
`;

    // Get result from Gemini
    const geminiResponse = await callGemini(prompt, "models/gemini-2.5-flash");
    const cleaned = geminiResponse
      .replace(/^```json\s*/i, "")
      .replace(/```$/, "")
      .trim();

    console.log('Raw Gemini response:', geminiResponse);
    console.log('Cleaned response:', cleaned);

    let data;
    try {
      data = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      // Fallback data structure
      data = {
        summary: "Unable to analyze resume content",
        skills: [],
        email: null,
        score: 0,
        improve: "Unable to generate improvement suggestions"
      };
    }

    // Ensure data has the correct format
    const formattedData = {
      summary: typeof data.summary === 'string' ? data.summary : "No summary available",
      skills: Array.isArray(data.skills) ? data.skills : [],
      email: typeof data.email === 'string' ? data.email : null,
      score: typeof data.score === 'number' ? data.score : 0,
      improve: typeof data.improve === 'string' ? data.improve : 
               Array.isArray(data.improve) ? data.improve.join('\n') : 
               "No improvement suggestions available"
    };

    console.log('Formatted data:', formattedData);

    const prisma = new PrismaClient();
    await prisma.resume.create({
      data: {
        name: null,
        email: formattedData.email,
        skills: formattedData.skills,
        analysis: {
          summary: formattedData.summary,
          skills: formattedData.skills,
          score: formattedData.score,
          improve: formattedData.improve
        },
      },
    });

    return NextResponse.json({ success: true, ...formattedData });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Server error";
    console.error("❌ /api/analyze Error:", errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
