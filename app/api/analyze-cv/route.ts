import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
];

const PROMPT = `
You are an expert Applicant Tracking System (ATS) resume reviewer.

Your task is to determine whether the provided document is a professional resume.

A resume DOES NOT need every possible section.

Treat the document as a VALID resume if it contains MOST of the following:

• Person's name
• Email OR phone number
• Education
• Work Experience
• Professional Summary
• Skills
• Projects
• Certifications
• Languages

IMPORTANT

DO NOT reject a resume simply because one or two sections are missing.

If the document clearly describes one person's education, experience, skills and career history, it IS a resume.

Only return isResume=false if the document is clearly something else such as:

- Lecture Notes
- Exam Notes
- Homework
- Book
- Research Paper
- Article
- Presentation
- Random Text
- Meeting Notes

If it is NOT a resume return ONLY:

{
  "isResume": false,
  "reason": "This document is not a resume."
}

If it IS a resume return ONLY:

{
  "isResume": true,
  "atsScore": 84,
  "summary": "Short professional summary.",
  "skills": [],
  "technologies": [],
  "strengths": [],
  "weaknesses": [],
  "recommendations": []
}

ATS SCORE RULES

90-100 = Excellent ATS Resume

80-89 = Strong Resume

70-79 = Good Resume

60-69 = Needs Improvement

Below 60 = Poor Resume

Recommendations should be realistic and actionable.

Return ONLY valid JSON.

Do NOT use markdown.

Do NOT wrap inside triple backticks.

Resume:
`;

export async function POST(req: Request) {
  try {
    const { cvText } = await req.json();

    let lastError: any;

    for (const model of MODELS) {
      try {
        console.log("Trying model:", model);

        const response =
          await ai.models.generateContent({
            model,
            contents: PROMPT + "\n\n" + cvText,
          });

        return Response.json({
          result: response.text,
        });
      } catch (err) {
        console.error(
          `Model ${model} failed`,
          err
        );

        lastError = err;
      }
    }

    return Response.json(
      {
        error:
          "AI service is temporarily unavailable. Please try again in a few minutes.",
      },
      {
        status: 500,
      }
    );
  } catch (err: any) {
    console.error(err);

    return Response.json(
      {
        error:
          err?.message ||
          "Unexpected server error.",
      },
      {
        status: 500,
      }
    );
  }
}