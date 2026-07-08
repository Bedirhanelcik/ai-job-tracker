"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  Info,
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
import mammoth from "mammoth";
export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [currentResume, setCurrentResume] = useState<any>(null);

  const [analysis, setAnalysis] = useState<any>(null);

  const [loadingAnalysis, setLoadingAnalysis] =
    useState(false);

  const [loadingUpload, setLoadingUpload] =
  useState(false);  

  const [dragging, setDragging] =
    useState(false);

  const inputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    const {
  data: { user },
} = await supabase.auth.getUser();
if (!user) {
  return;
}

if (!user) return;

    if (!user) return;

    const { data } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    setCurrentResume(data);
  };
const [loadingStep, setLoadingStep] =
  useState("Reading Resume...");
  const analyzeResume = async (redirect = false) => {
    console.log("Analyze button clicked");
    if (!currentResume?.content) {
  console.log("No currentResume.content");
  console.log(currentResume);
  return;
}

    try {
      setLoadingAnalysis(true);
      setLoadingUpload(true);
    

      setLoadingStep("Analyzing with AI..."); 
      const res = await fetch(
        "/api/analyze-cv",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            cvText:
              currentResume.content,
          }),
        }
      );

      const data = await res.json();
console.log("STATUS:", res.status);
console.log("API DATA:", data);

if (!res.ok) {
console.error(data.error);

const errorText =
  typeof data.error === "string"
    ? data.error
    : JSON.stringify(data.error);

if (
  errorText.includes("429") ||
  errorText.includes("RESOURCE_EXHAUSTED") ||
  errorText.includes("quota")
) {
  toast.error("Daily AI limit reached", {
    description: "Please try again tomorrow.",
  });
} else {
  toast.error("Analysis failed", {
    description: "Please try again in a few moments.",
  });
}
  return;
}

if (!data.result) {
  alert("API did not return result");
  console.log(data);
  return;
}
  
   console.log(typeof data.result);
console.log(data.result);

const text =
  typeof data.result === "string"
    ? data.result
    : JSON.stringify(data.result);

const cleanJson = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

console.log(cleanJson);

const parsed = JSON.parse(cleanJson);
if (!parsed.isResume) {
  toast.warning("Invalid document", {
  description: parsed.reason,
});
setLoadingUpload(false);
  setLoadingAnalysis(false);
  return;
}
const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  return;
}
setLoadingStep("Saving AI Results...");
await supabase
  .from("cv_analysis")
  .insert({
    user_id: user.id,
    ats_score: parsed.atsScore,
    summary: parsed.summary,
    strengths: parsed.strengths?.join(", "),
    weaknesses: parsed.weaknesses?.join(", "),
    recommendations:
      parsed.recommendations?.join("\n"),
  });

await supabase
  .from("profiles")
  .update({
    ats_score: parsed.atsScore,
  })
  .eq("id", user.id);
if (!redirect) {
  setAnalysis(parsed);
}
if (!redirect) {
  setLoadingUpload(false);
}

if (redirect) {
  setTimeout(() => {
   setLoadingStep("Opening Applications...");

setTimeout(() => {
  window.location.href = "/applications";
}, 700);
  }, 1500);
}
    } catch (error) {
      console.error(error);
      toast.error("Analysis failed", {
  description: "Please try again in a few moments.",
});
    } finally {
      setLoadingAnalysis(false);
    }
  };
const extractPdfText = async (file: File) => {
  const pdf = await pdfjsLib.getDocument({
    data: await file.arrayBuffer(),
  }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);

    const content = await page.getTextContent();

    text +=
      content.items
        .map((item: any) => item.str)
        .join(" ") + "\n";
  }

  return text;
};

const extractDocxText = async (file: File) => {
  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await mammoth.extractRawText({
    buffer,
  });

  return result.value;
};
  const handleUpload = async () => {
    setLoadingUpload(true);
    setLoadingStep("Uploading Resume...");
      try {
    if (!file) {
      toast.warning("Please select a resume", {
  description: "Choose a PDF or DOCX file to continue.",
});
      return;
    }

const {
  data: { user: user },
} = await supabase.auth.getUser();

    if (!user) {
      toast.error("Authentication required", {
  description: "Please sign in before uploading a resume.",
});
      return;
    }

    const safeFileName = file.name
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-zA-Z0-9._-]/g, "-");

const filePath = `${user.id}/${Date.now()}-${safeFileName}`;

    const { error } = await supabase.storage
      .from("resumes")
      .upload(filePath, file);

    if (error) {
      alert(error.message);
      return;
    }

setLoadingStep("Reading Resume...");

let extractedText = "";

try {
  if (file.name.toLowerCase().endsWith(".pdf")) {
    extractedText = await extractPdfText(file);
  } else {
    extractedText = await extractDocxText(file);
  }
} catch (err) {
  console.error(err);

  toast.error("Failed to read the resume.");

  return;
}

if (!extractedText.trim()) {
  toast.error("No readable text found.");

  return;
}
await supabase
  .from("resumes")
  .insert({
    user_id: user.id,
    file_name: file.name,
    content: extractedText,
  });
 toast.success("Resume uploaded!", {
  description: "Analyzing your resume...",
});

await loadResume();

await analyzeResume(true);
  } catch (error) {
    console.error(error);
    setLoadingUpload(false);
    alert("Something went wrong");
  }
};
 
return (   
  <main className="min-h-screen overflow-x-hidden bg-[#030712] text-white">

    <div className="max-w-6xl mx-auto px-8 py-12">

      <div className="text-center mb-12">

        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-5">

          <Sparkles size={16} className="text-indigo-400" />

          <span className="text-indigo-300 text-sm">
            AI Resume Scanner
          </span>

        </div>

        <h1 className="text-5xl font-bold">
          Resume Center
        </h1>

        <p className="text-zinc-400 mt-4 text-lg">
          Upload your resume and receive AI-powered feedback instantly.
        </p>

      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-8">

          <div className="flex items-center gap-3 mb-6">

            <FileText className="text-indigo-400" />

            <h2 className="text-2xl font-bold">
              Current Resume
            </h2>

          </div>

          {currentResume ? (

            <div className="space-y-4">

              <div className="flex items-center justify-between">

                <div>

                  <p className="font-semibold text-lg">
                    {currentResume.file_name}
                  </p>

                  <p className="text-zinc-500 mt-1">
                    Latest uploaded resume
                  </p>

                </div>

                <CheckCircle2
                  size={28}
                  className="text-green-400"
                />

              </div>

            </div>

          ) : (

            <div className="text-center py-12">

              <FileText
                size={60}
                className="mx-auto text-zinc-600 mb-4"
              />

              <p className="text-zinc-500">
                No resume uploaded yet.
              </p>

            </div>

          )}

        </div>

        <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Upload Resume
          </h2>

          <input
            ref={inputRef}
            type="file"
            accept=".doc,.docx,.pdf"
            hidden
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
          />

          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() =>
              setDragging(false)
            }
            onDrop={(e) => {
              e.preventDefault();

              setDragging(false);

              if (e.dataTransfer.files[0]) {
                setFile(e.dataTransfer.files[0]);
              }
            }}
            className={`cursor-pointer transition-all duration-300 rounded-3xl border-2 border-dashed p-12 text-center

            ${
              dragging
                ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]"
                : "border-zinc-700 hover:border-indigo-500 hover:bg-indigo-500/5 hover:scale-[1.01]"
            }`}
          >

            <Upload
              size={60}
              className="mx-auto mb-5 text-indigo-400"
            />

            <h3 className="text-2xl font-bold">
              Drag & Drop Resume
            </h3>

            <p className="text-zinc-400 mt-3">
              or click anywhere inside this area
            </p>

            {file && (

              <div className="mt-8 inline-flex items-center rounded-full bg-green-500/10 border border-green-500/20 px-5 py-3">

                <CheckCircle2
                  size={18}
                  className="mr-2 text-green-400"
                />

                {file.name}

              </div>

            )}

          </div>

   <div className="flex gap-4 mt-8">

  <button
    onClick={handleUpload}
    className="flex-1 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all duration-300 py-4 font-semibold shadow-lg shadow-indigo-600/20"
  >
    Upload Resume
  </button>

  <div className="relative flex-1 group">

    <button
      onClick={() => analyzeResume()}
      className="w-full rounded-2xl bg-white py-4 font-semibold text-black transition-all duration-300 hover:scale-105 active:scale-95"
    >
      {loadingAnalysis ? "Analyzing..." : "Analyze"}
    </button>

    <div
      className="
        pointer-events-none
        absolute
        bottom-full
        left-0
        mb-3
        w-[360px]
        rounded-2xl
        border
        border-white/10
        bg-[#0F172A]/95
        p-5
        opacity-0
        translate-y-2
        transition-all
        duration-300
        backdrop-blur-xl
        shadow-2xl
        group-hover:opacity-100
        group-hover:translate-y-0
      "
    >
      <h4 className="font-semibold text-white">
        AI Resume Analysis
      </h4>

      <p className="mt-3 text-sm leading-6 text-zinc-400">
        Analyze your current resume and receive a detailed AI report including:
      </p>

      <ul className="mt-4 space-y-2 text-sm text-zinc-300">
        <li>• ATS Score</li>
        <li>• Strengths</li>
        <li>• Weaknesses</li>
        <li>• Recommendations</li>
      </ul>

      <p className="mt-4 text-sm leading-6 text-indigo-300">
        This only analyzes your resume. It does not apply for jobs.
      </p>
    </div>

  </div>

</div>

        </div>

      </div>
      {analysis && (

  <div className="mt-10 rounded-3xl border border-white/10 bg-[#0F172A] p-8">

    <div className="flex items-center justify-between mb-8">

      <div>

        <h2 className="text-3xl font-bold">
          AI Resume Analysis
        </h2>

        <p className="text-zinc-400 mt-2">
          AI reviewed your resume and generated the following insights.
        </p>

      </div>

      <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-green-500 bg-green-500/10">

        <div className="text-center">

          <p className="text-4xl font-bold text-green-400">
            {analysis.atsScore}
          </p>

          <p className="text-xs text-zinc-400">
            ATS
          </p>

        </div>

      </div>

    </div>

    <div className="grid md:grid-cols-2 gap-6">

      <div className="rounded-2xl bg-[#111827] border border-white/10 p-6">

        <h3 className="text-lg font-semibold mb-4">
          Summary
        </h3>

        <p className="text-zinc-300 leading-7">
          {analysis.summary}
        </p>

      </div>

      <div className="rounded-2xl bg-[#111827] border border-white/10 p-6">

        <h3 className="text-lg font-semibold mb-4">
          Technologies
        </h3>

        <div className="flex flex-wrap gap-2">

          {analysis.technologies?.map(
            (item: string, index: number) => (

              <span
                key={index}
                className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 text-sm"
              >
                {item}
              </span>

            )
          )}

        </div>

      </div>

      <div className="rounded-2xl bg-[#111827] border border-green-500/20 p-6">

        <h3 className="text-lg font-semibold text-green-400 mb-5">
          Strengths
        </h3>

        <ul className="space-y-3">

          {analysis.strengths?.map(
            (item: string, index: number) => (

              <li
                key={index}
                className="flex gap-3 items-start"
              >

                <CheckCircle2
                  size={18}
                  className="text-green-400 mt-1"
                />

                <span>
                  {item}
                </span>

              </li>

            )
          )}

        </ul>

      </div>

      <div className="rounded-2xl bg-[#111827] border border-red-500/20 p-6">

        <h3 className="text-lg font-semibold text-red-400 mb-5">
          Weaknesses
        </h3>

        <ul className="space-y-3">

          {analysis.weaknesses?.map(
            (item: string, index: number) => (

              <li
                key={index}
                className="flex gap-3 items-start"
              >

                <div className="mt-2 h-2 w-2 rounded-full bg-red-400" />

                <span>
                  {item}
                </span>

              </li>

            )
          )}

        </ul>

      </div>

    </div>

    <div className="mt-8 rounded-2xl bg-[#111827] border border-white/10 p-6">

      <h3 className="text-lg font-semibold mb-5">
        Recommendations
      </h3>

      <ul className="space-y-4">

        {analysis.recommendations?.map(
          (item: string, index: number) => (

            <li
              key={index}
              className="flex gap-3"
            >

              <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold">

                {index + 1}

              </div>

              <span className="leading-7">
                {item}
              </span>

            </li>

          )
          
        )}

      </ul>

    </div>

  </div>

)}
<div className="relative flex-1 group">
    </div>
    </div>
{loadingUpload && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#030712]/80 backdrop-blur-md">

    <div className="w-[520px] rounded-3xl border border-indigo-500/20 bg-[#0F172A] p-10 text-center shadow-[0_0_60px_rgba(99,102,241,.2)]">

      <div className="mx-auto h-20 w-20 rounded-full border-4 border-zinc-700 border-t-indigo-500 animate-spin" />

      <h2 className="mt-8 text-3xl font-bold">
        Analyzing your resume with AI...
      </h2>

     <p className="mt-3 text-zinc-400">
  {loadingStep}
</p>

      <div className="mt-10 space-y-3 text-left text-zinc-300">

        <p className="animate-pulse">
          ✓ Reading Resume
        </p>

        <p className="animate-pulse">
          ✓ Extracting Skills
        </p>

        <p className="animate-pulse">
          ✓ Evaluating Experience
        </p>

        <p className="animate-pulse">
          ✓ Calculating ATS Score
        </p>
          <p className="animate-pulse">
          ✓ Preparing AI Report
        </p>

      </div>

    </div>

  </div>
)}
  </main>

);
}
