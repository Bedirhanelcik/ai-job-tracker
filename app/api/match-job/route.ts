import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { cvText, jobDescription } = await req.json();

    if (!cvText || !jobDescription) {
      return Response.json(
        {
          error: "Missing cvText or jobDescription",
        },
        {
          status: 400,
        }
      );
    }

    const prompt = `
You are an expert ATS recruiter.

Compare the candidate's resume with the job description.

Return ONLY valid JSON.

{
  "matchScore": 0,
  "strengths": [],
  "missingSkills": [],
  "aiSuggestions": ""
}

Rules:

- Match score between 0 and 100.
- strengths must be an array.
- missingSkills must be an array.
- aiSuggestions must be a string.
- Do NOT wrap the JSON inside markdown.
- Return ONLY JSON.

Resume:
${cvText}

Job Description:
${jobDescription}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text?.trim();

    if (!text) {
      return Response.json(
        {
          error: "Gemini returned an empty response.",
        },
        {
          status: 500,
        }
      );
    }

    return Response.json({
      result: text,
    });
  } catch (err: any) {
    console.error(err);

    return Response.json(
      {
        error: err?.message || "Unknown AI error",
      },
      {
        status: 500,
      }
    );
  }
}