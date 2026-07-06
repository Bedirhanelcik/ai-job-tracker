import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function POST(req: Request) {
  const { cvText, jobDescription } =
    await req.json();

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
CV:
${cvText}

JOB:
${jobDescription}

Give 3 short resume improvement suggestions.

Return JSON:

{
  "suggestions": [
    "Suggestion 1",
    "Suggestion 2",
    "Suggestion 3"
  ]
}
`;

  const result = await model.generateContent(
    prompt
  );

  const text =
    result.response.text();

  return NextResponse.json({
    result: text,
  });
}