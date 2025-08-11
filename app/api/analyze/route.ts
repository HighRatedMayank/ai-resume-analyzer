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
You're an AI resume analyzer. Given the text of a resume, return JSON with:
- summary: string
- skills: array of detected tech skills (e.g. JavaScript, MySQL)
- email: email address found in resume, or null
- score: number between 0-100 based on resume strength
- improve: suggest improvements based on the resume weaknesses 

Respond only with valid JSON.

Resume:
${resumeText}
`;

    // Get result from Gemini
    const geminiResponse = await callGemini(prompt, "models/gemini-2.5-flash");
    const cleaned = geminiResponse
      .replace(/^```json\s*/i, "")
      .replace(/```$/, "")
      .trim();

    const data = JSON.parse(cleaned);

    const prisma = new PrismaClient();
    await prisma.resume.create({
      data: {
        name: null,
        email: data.email,
        skills: data.skills,
        analysis: {
          summary: data.summary,
          skills: data.skills,
          score: data.score,
          improve: data.improve
        },
      },
    });

    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    console.error("❌ /api/analyze Error:", err.message || err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
