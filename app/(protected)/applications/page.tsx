  "use client";

  import DarkVeil from "../../../components/DarkVeil";
  import { useEffect, useRef, useState } from "react";
  import Link from "next/link";
  import { toast } from "sonner"; 
  import Image from "next/image";
import { BadgeCheck } from "lucide-react";
  import { supabase } from "@/lib/supabase";
  import {
    Plus,
    X,
    Building2,
    Briefcase,
    Sparkles,
    Calendar,
    CheckCircle2,
    AlertTriangle,
    SparklesIcon,
    ArrowRight,
  } from "lucide-react";

  export default function ApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [myApplications, setMyApplications] = useState<any[]>([]);
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const [editing, setEditing] = useState(false);
const [editCompany, setEditCompany] = useState("");
const [editPosition, setEditPosition] = useState("");
const [editDescription, setEditDescription] =
  useState("");
const [editUrl, setEditUrl] = useState("");
    const [currentUserId, setCurrentUserId] = useState("");
const [isEmployer, setIsEmployer] = useState(false);
const [atsScore, setAtsScore] = useState(0);
const [showAnalysis, setShowAnalysis] =
  useState(false);
const [loadingAI, setLoadingAI] =
  useState(false);
const [analysisResult, setAnalysisResult] =
  useState<any>(null);
const [user, setUser] = useState<any>(null);
const [animatedScore, setAnimatedScore] =
  useState(0);
const [loadingStep, setLoadingStep] =
  useState("Reading Resume...");
const [step, setStep] =
  useState(0);
  const analysisModalRef =
  useRef<HTMLDivElement>(null);
useEffect(() => {
  fetchApplications();
  loadProfile();
}, []);

useEffect(() => {
  if (atsScore > 0 && atsScore < 30) {
    window.location.href = "/profile?ats=low";
  }
}, [atsScore]);
  const handleApply = async (job: any) => {
      setLoadingAI(true);

setLoadingStep("Reading Resume...");
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: resume } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
setLoadingStep("Extracting Skills...");
await new Promise((r) => setTimeout(r, 300));
      if (!resume) {
        alert("Please upload a CV first");
        return;
      }
const { data: profile } = await supabase
  .from("profiles")
  .select("ats_score")
  .eq("id", user.id)
  .single();

if ((profile?.ats_score ?? 0) < 30) {
  toast.error("ATS Score Too Low", {
    description:
      "You need an ATS score of at least 30 before applying for jobs.",
  });

  setTimeout(() => {
    window.location.href = "/profile?ats=low";
  }, 1500);

  return;
}
setLoadingStep("Comparing with Job Requirements...");
await new Promise((r) => setTimeout(r, 300));
  const res = await fetch("/api/match-job", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cvText: resume.content,
      jobDescription: job.job_description,
    }),
  });
  const data = await res.json();
  const cleanJson = data.result
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleanJson);
  setLoadingStep("Calculating Match Score...");
  await new Promise((r) => setTimeout(r, 300));
console.log(parsed);

setLoadingStep("Saving Application...");

await new Promise((r) => setTimeout(r, 300));

await supabase.from("applications").insert({
  
  user_id: user.id,

  company: job.company,
  position: job.position,

  job_description: job.job_description,
  job_url: job.job_url,

  status: "Applied",

  match_score: parsed.matchScore,

  strengths: parsed.strengths?.join(", "),

  missing_skills:
    parsed.missingSkills?.join(", "),

  ai_suggestions:
    parsed.aiSuggestions,
});
setLoadingStep("Opening AI Report...");

await new Promise((r) => setTimeout(r, 600));

setLoadingAI(false);

setAnalysisResult(parsed);

setShowAnalysis(true);
} catch (error) {
  console.error(error);
  alert("Application failed");
} finally {
  setLoadingAI(false);
}
  };
  
const loadProfile = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  setCurrentUserId(user.id);

  const { data } = await supabase
    .from("profiles")
    .select("is_employer, ats_score")
    .eq("id", user.id)
    .single();

  setIsEmployer(data?.is_employer ?? false);
  setAtsScore(data?.ats_score ?? 0);
};

    const fetchApplications = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("job_listings")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      setApplications(data || []);
      const { data: applied } = await supabase
  .from("applications")
  .select("id")
  .eq("user_id", user.id);

setMyApplications(applied || []);
    };


useEffect(() => {
  if (!showAnalysis || !analysisResult) return;

  setAnimatedScore(0);
  setStep(0);

  const target = analysisResult.matchScore;
  const duration = 1800;

  let start: number | null = null;
  let frame: number;

  const easeOutCubic = (t: number) =>
    1 - Math.pow(1 - t, 3);

  const animate = (timestamp: number) => {
    if (!start) start = timestamp;

    const progress = Math.min(
      (timestamp - start) / duration,
      1
    );

    const eased = easeOutCubic(progress);

    setAnimatedScore(
      Math.round(target * eased)
    );

    if (progress < 1) {
      frame = requestAnimationFrame(animate);
    } else {
      setAnimatedScore(target);

      setTimeout(() => setStep(1), 250);
      setTimeout(() => setStep(2), 700);
      setTimeout(() => setStep(3), 1200);
      setTimeout(() => setStep(4), 1700);
      setTimeout(() => {
  analysisModalRef.current?.scrollTo({
    top:
      analysisModalRef.current.scrollHeight,
    behavior: "smooth",
  });
}, 2000);
    }
  };

  frame = requestAnimationFrame(animate);

  return () => cancelAnimationFrame(frame);
}, [showAnalysis, analysisResult]);
    return (
      <>
      {loadingAI && (

  <div className="fixed inset-0 z-[99998] flex items-center justify-center bg-[#030712]/90 backdrop-blur-md">



    <div className="

w-[560px]

rounded-[32px]

border

border-white/10

bg-[#0F172A]

p-10

text-center

shadow-[0_25px_80px_rgba(0,0,0,.55)]

ring-1

ring-indigo-500/10

backdrop-blur-xl

">



      <div className="relative mx-auto h-24 w-24">



  <div className="absolute inset-0 rounded-full border border-indigo-500/20" />



  <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />



  <div className="absolute inset-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 blur-xl opacity-60 animate-pulse" />



</div>



      <h2 className="mt-8 text-3xl font-bold">

        AI is analyzing your resume

      </h2>



 <p className="mt-4 text-zinc-400">

  {loadingStep}

</p>



<div className="mt-8 h-2 overflow-hidden rounded-full bg-white/5">

  <div

    className={`h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 transition-all duration-700 ${

      loadingStep === "Reading Resume..."

        ? "w-[20%]"

        : loadingStep === "Extracting Skills..."

        ? "w-[40%]"

        : loadingStep === "Comparing with Job Requirements..."

        ? "w-[65%]"

        : loadingStep === "Calculating Match Score..."

        ? "w-[85%]"

        : "w-full"

    }`}

  />

</div>

      <div className="mt-10 space-y-3 text-left">



        <div className="animate-pulse">

          ✓ Reading Resume

        </div>



        <div className="animate-pulse delay-150">

          ✓ Extracting Skills

        </div>



        <div className="animate-pulse delay-300">

          ✓ Comparing Experience

        </div>



        <div className="animate-pulse delay-500">

          ✓ Calculating Match Score

        </div>

        <div className="animate-pulse delay-700">

          ✓ Saving Application

        </div>

      </div>



    </div>



  </div>

)}
        <main className="relative min-h-screen overflow-hidden text-white">
          {/* Background */}
<div className="absolute inset-0 -z-20">
  <DarkVeil
    hueShift={0}
    noiseIntensity={0}
    scanlineIntensity={0}
    speed={0.5}
    scanlineFrequency={0}
    warpAmount={0}
  />
</div>

{/* Overlay */}
<div className="absolute inset-0 -z-10 bg-black/45" />
          <div className="max-w-7xl mx-auto px-8 py-10">

            <div className="flex items-center justify-between mb-10">

         <div className="max-w-3xl">

  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2">

    <div className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />

    <span className="text-sm font-medium text-indigo-300">
      AI Powered Job Discovery
    </span>

  </div>

  <h1 className="mt-6 text-6xl font-black tracking-tight leading-[1.05]">

    Discover Your

   <span className="block text-[#B794F6]">
  Next Opportunity
</span>

  </h1>

  <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">

    Browse verified job opportunities, compare your AI match score,
    and track every application in one intelligent workspace.

</p>

</div>

<div className="flex items-center gap-4">

  {myApplications.length > 0 && (
    <Link
      href="/dashboard"
      className="
      group
      rounded-2xl
      border
      border-white/10
      bg-white/5
      px-7
      py-4
      font-semibold
      text-white
      transition-all
      duration-300
      hover:border-indigo-500/30
      hover:bg-indigo-500/10
      "
    >
      Dashboard
    </Link>
  )}

  {isEmployer && (
    <Link
      href="/applications/new"
      className="
group
relative
overflow-hidden
rounded-2xl
border
border-indigo-500/20
bg-gradient-to-r
from-indigo-600
via-violet-600
to-purple-600
px-7
py-4
font-semibold
text-white
shadow-[0_10px_35px_rgba(99,102,241,.30)]
transition-all
duration-300
hover:-translate-y-1
hover:shadow-[0_20px_45px_rgba(99,102,241,.45)]
"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-120%] transition duration-700 group-hover:translate-x-[120%]" />

      <div className="relative flex items-center gap-2">
        <Plus size={18} />
        Create Job Listing
      </div>

    </Link>
  )}

</div>

</div>

<div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            <div
  className="
  group
  relative
  overflow-hidden
  rounded-[28px]
  h-[220px]
  border
  border-white/10
  bg-gradient-to-b
  from-[#111827]
  to-[#09090B]
  p-5
  transition-all
  duration-300
  hover:-translate-y-1
  hover:border-indigo-500/30
  hover:shadow-[0_0_45px_rgba(99,102,241,.18)]
"
>

  <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />

  <div className="relative">

    <div className="flex items-center justify-between">

      <div className="rounded-2xl bg-indigo-500/10 p-3">

        <Briefcase className="text-indigo-400" size={22} />

      </div>

      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">

        +12%

      </span>

    </div>

    <p className="mt-8 text-sm uppercase tracking-[0.22em] text-zinc-500">

      Total Jobs

    </p>

    <h2 className="mt-3 text-5xl font-black">

      {applications.length}

    </h2>

    <p className="mt-3 text-sm text-zinc-500">

      Active opportunities available

    </p>

  </div>

</div>

             <div className="rounded-[28px]
h-[220px]
border
border-white/10
bg-gradient-to-b
from-[#111827]
to-[#09090B]
p-5
backdrop-blur-xl
transition-all
duration-300
hover:-translate-y-1
hover:border-emerald-500/30
hover:shadow-[0_0_45px_rgba(16,185,129,.18)]">
  <Sparkles className="mb-4 text-emerald-400" />

  <p className="text-zinc-500">
    Companies
  </p>

  <h2 className="text-5xl font-bold mt-2">
    {
      new Set(
        applications.map(
          (item) => item.company
        )
      ).size
    }
  </h2>
</div>

              <div className="rounded-[28px]
h-[220px]
border
border-white/10
bg-gradient-to-b
from-[#111827]
to-[#09090B]
p-5
backdrop-blur-xl
transition-all
duration-300
hover:-translate-y-1
hover:border-emerald-500/30
hover:shadow-[0_0_45px_rgba(16,185,129,.18)]">
                <Building2 className="mb-4 text-purple-400" />

                <p className="text-zinc-500">
                  Active Job Listings
                </p>

                <h2 className="text-5xl font-bold mt-2">
                  {
                applications.length
                  }
                </h2>
              </div>
            </div>

            <div className="mt-9 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-start">
              {applications.map((app) => (
                <div
                  key={app.id}
                  onClick={() =>
                    setSelectedApp(app)
                  }
                  className="
                  group
                  min-h-[247px]
flex
flex-col
justify-between
                  relative
                  overflow-hidden
                  cursor-pointer
                  rounded-3xl
                  border
                  border-white/10
                  bg-gradient-to-b
                  from-[#111827]/70
to-[#09090B]/50
backdrop-blur-xl
                  p-6
                  hover:border-violet-500/40
                  hover:-translate-y-1
                  hover:shadow-[0_0_50px_rgba(59,130,246,0.15)]
                  transition-all
                  duration-300
                  "
                >
              

      <div className="flex items-start gap-4">

  <div
    className="
      flex
      h-14
      w-14
      shrink-0
      items-center
      justify-center
      rounded-2xl
      border
      border-white/10
      bg-transparent
      transition-all
      duration-300
      group-hover:scale-105
      group-hover:border-indigo-500/30
    "
  >
 <Image
  src={
  app.company.toLowerCase().includes("google")
  ? "/companies/google.png"
  : app.company.toLowerCase().includes("microsoft")
  ? "/companies/microsoft.png"
  : app.company.toLowerCase().includes("amazon")
  ? "/companies/amazon.png"
  : app.company.toLowerCase().includes("adobe")
  ? "/companies/adobe.png"
  : "/companies/default.png"
  }
  alt={app.company}
  width={40}
  height={40}
  className="h-10 w-10 object-contain"
/>
  </div>

  <div className="flex-1">

    <div className="flex items-center gap-2">

      <h3 className="text-2xl font-bold text-white">
        {app.company}
      </h3>

      <BadgeCheck
        size={18}
        className="fill-sky-500 text-white"
      />

    </div>

    <p className="mt-1 text-zinc-400">
      {app.position}
    </p>

  </div>

</div>
<p
  className="
    mt-7
    line-clamp-2
    text-sm
    leading-7
    text-zinc-500
  "
>
  {app.job_description}
</p>

<div className="mt-6 flex flex-wrap gap-2">

  {["React", "TypeScript", "Next.js", "Tailwind"].map((skill) => (

    <span
      key={skill}
      className="
        rounded-full
        border
        border-white/10
        bg-white/5
        px-3
        py-2
        text-xs
        font-medium
        text-zinc-300
        transition-all
        duration-300
        group-hover:border-indigo-500/30
        group-hover:bg-indigo-500/10
      "
    >
      {skill}
    </span>

  ))}

</div>

                </div>
              ))}
            </div>
          </div>
        </main>
        {selectedApp && (
          <>
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
              onClick={() => setSelectedApp(null)}
            />

            <div
              className="
              fixed
              top-0
              right-0
              h-screen
              w-[700px]
              bg-black/30 backdrop-blur-xl
              border-l
              border-white/10
              z-[9999]
              overflow-y-auto
              p-8
              shadow-[0_0_80px_rgba(0,0,0,0.8)]
              "
            >
              <div className="flex items-center justify-between mb-10">

                <div>
                  <p className="text-zinc-500 text-sm">
                    Job Details
                  </p>

                  <h2 className="text-4xl font-bold">
                    {selectedApp.company}
                  </h2>
                </div>

                <button
                  onClick={() =>
                    setSelectedApp(null)
                  }
                  className="
                  h-12
                  w-12
                  rounded-xl
                  border
                  border-white/10
                  flex
                  items-center
                  justify-center
                  hover:bg-zinc-900
                  transition
                  "
                >
                  <X />
                </button>
              </div>

              <div className="space-y-6">
{selectedApp.user_id === currentUserId && (
  <div className="flex gap-3">

    <button
  onClick={() => {
    setEditCompany(selectedApp.company);
    setEditPosition(selectedApp.position);
    setEditDescription(
      selectedApp.job_description
    );
    setEditUrl(selectedApp.job_url || "");

    setEditing(true);
  }}
  className="flex-1 rounded-2xl border border-blue-500/30 bg-blue-500/10 py-4 font-semibold text-blue-300 hover:bg-blue-500/20 transition"
>
  Edit Listing
</button>

<button
  onClick={async () => {
    const ok = confirm(
      "Delete this job listing?"
    );

    if (!ok) return;

    const { error } = await supabase
      .from("job_listings")
      .delete()
      .eq("id", selectedApp.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Job listing deleted.");

    setSelectedApp(null);
    fetchApplications();
  }}
  className="flex-1 rounded-2xl border border-red-500/30 bg-red-500/10 py-4 font-semibold text-red-300 hover:bg-red-500/20 transition"
>
  Delete Listing
</button>

  </div>
)}
                <div className="grid grid-cols-2 gap-4">

          

    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
      <p className="text-zinc-500 text-sm">
        Position
      </p>

      <p className="font-semibold mt-2">
        {selectedApp.position}
      </p>
    </div>

  </div>

  <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
    <p className="text-zinc-500 mb-3">
      Job URL
    </p>

    {selectedApp.job_url ? (
      <a
        href={selectedApp.job_url}
        target="_blank"
        className="text-blue-400 break-all"
      >
        {selectedApp.job_url}
      </a>
    ) : (
      <p>No URL saved</p>
    )}
  </div>

  <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
    <p className="text-zinc-500 mb-3">
      Job Description
    </p>

    <div className="whitespace-pre-line text-sm leading-7">
    {selectedApp.job_description}
  </div>
  </div>

<div className="rounded-2xl border border-white/10 bg-zinc-900 p-5 flex items-center gap-3">
  <Calendar size={18} />

  <span>
    {selectedApp.created_at
      ? new Date(selectedApp.created_at).toLocaleDateString()
      : "-"}
  </span>
</div>

<div className="mt-4">

  {selectedApp.user_id === user?.id ? (

    <button
      className="w-full rounded-2xl bg-emerald-600 py-4 font-semibold text-white cursor-default"
    >
      Your Job Listing
    </button>

  ) : (

    <button
      onClick={() => handleApply(selectedApp)}
      className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 py-4 font-semibold text-white shadow-[0_0_25px_rgba(99,102,241,.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(99,102,241,.55)] active:scale-[0.98]"
    >
      Apply Now
    </button>

  )}

</div>

</div> {/* space-y-6 */}

</div> {/* right panel */}

</>

)}
{editing && (
  <>
    <div
      onClick={() => setEditing(false)}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[10000]"
    />

    <div className="fixed inset-0 flex items-center justify-center z-[10001] px-6">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0F172A] p-8">

        <h2 className="text-3xl font-bold mb-8">
          Edit Job Listing
        </h2>

        <div className="space-y-5">

          <input
            value={editCompany}
            onChange={(e) =>
              setEditCompany(e.target.value)
            }
            placeholder="Company"
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 p-4 outline-none"
          />

          <input
            value={editPosition}
            onChange={(e) =>
              setEditPosition(e.target.value)
            }
            placeholder="Job Title"
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 p-4 outline-none"
          />

          <input
            value={editUrl}
            onChange={(e) =>
              setEditUrl(e.target.value)
            }
            placeholder="Application URL"
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 p-4 outline-none"
          />

          <textarea
            value={editDescription}
            onChange={(e) =>
              setEditDescription(e.target.value)
            }
            placeholder="Job Description"
            className="h-56 w-full resize-none rounded-2xl border border-zinc-700 bg-zinc-900 p-4 outline-none"
          />

        </div>

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={() => setEditing(false)}
            className="rounded-2xl border border-zinc-700 px-6 py-3 hover:bg-zinc-900 transition"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              const { error } = await supabase
                .from("job_listings")
                .update({
                  company: editCompany,
                  position: editPosition,
                  job_description: editDescription,
                  job_url: editUrl,
                })
                .eq("id", selectedApp.id);

              if (error) {
                toast.error(error.message);
                return;
              }

              toast.success("Job listing updated.");

              setEditing(false);
              setSelectedApp(null);

              fetchApplications();
            }}
            className="rounded-2xl bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-500 transition"
          >
            Save Changes
          </button>

        </div>

      </div>
    </div>
  </>
)}
{showAnalysis && (
  <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md">

 <div
  ref={analysisModalRef}
  className="
    ai-scroll
    w-full
    max-w-[980px]
    max-h-[92vh]
    overflow-y-auto
    rounded-[32px]
    border
    border-white/10
    bg-[linear-gradient(180deg,#111827,#0B1120)]
    p-12
    shadow-[0_25px_80px_rgba(0,0,0,.65)]
    ring-1
    ring-indigo-500/10
    backdrop-blur-xl
  "
>

   <div className="mb-12 border-b border-white/5 pb-8">

  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300">
    ✦ AI Resume Intelligence
  </div>

  <h2 className="mt-5 text-5xl font-bold tracking-tight text-white">
    Resume Match Analysis
  </h2>

  <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-400">
    Our AI compared your resume against the job description and evaluated
    compatibility, strengths, missing skills and improvement opportunities.
  </p>

</div>

      <div className="mt-10 text-center">

  <div className="mt-4 flex flex-col items-center">

  <div className="relative h-64 w-64">

    <svg
      className="-rotate-90"
      width="256"
      height="256"
    >
      <defs>

        <linearGradient
          id="scoreGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>

      </defs>

      <circle
        cx="128"
        cy="128"
        r="108"
        stroke="rgba(255,255,255,.08)"
        strokeWidth="12"
        fill="transparent"
      />

      <circle
        cx="128"
        cy="128"
        r="108"
        fill="transparent"
        stroke="url(#scoreGradient)"
        strokeWidth="12"
        strokeLinecap="round"
        style={{
          filter:
            "drop-shadow(0 0 18px rgba(99,102,241,.75))",
          transition:
            "stroke-dashoffset 1.8s cubic-bezier(.22,1,.36,1)",
          strokeDasharray: 678.58,
          strokeDashoffset:
            678.58 -
            (678.58 * animatedScore) / 100,
        }}
      />

    </svg>

    <div className="absolute inset-0 flex flex-col items-center justify-center">

      <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
        MATCH SCORE
      </p>

      <h1 className="mt-4 text-8xl font-black tracking-tight text-white">

        {animatedScore}

        <span className="text-4xl text-indigo-400">
          %
        </span>

      </h1>

    </div>

  </div>

</div>
      </div>

      {step >= 1 && (
        <div
          className="
            mt-8
            animate-in
            fade-in
            zoom-in-95
            duration-700
          "
        >
          <div
            className="
              mb-8
              inline-flex
              items-center
              gap-3
              rounded-full
              border
              border-indigo-500/25
              bg-gradient-to-r
              from-indigo-500/15
              via-violet-500/10
              to-indigo-500/15
              px-7
              py-3
              shadow-[0_0_35px_rgba(99,102,241,.25)]
              backdrop-blur-xl
            "
          >
            <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,.8)]" />

            <span className="text-lg font-semibold tracking-wide text-white">
              {animatedScore >= 90
                ? "Excellent Match"
                : animatedScore >= 80
                ? "Very Good Match"
                : animatedScore >= 70
                ? "Good Match"
                : animatedScore >= 50
                ? "Average Match"
                : "Low Match"}
            </span>
          </div>

          <h3 className="mb-4 text-xl font-bold text-emerald-400">
            Strengths
          </h3>

          <div className="space-y-3">
       {analysisResult.strengths?.map(
  (item: string, index: number) => (
    <div
      key={item}
      style={{
        animationDelay: `${index * 180}ms`,
      }}
      className="
        group
        flex
        items-start
        gap-4
        rounded-3xl
        border
        border-emerald-500/15
        bg-white/[0.03]
        p-5
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-emerald-400/40
        hover:bg-emerald-500/[0.06]
        hover:shadow-[0_0_30px_rgba(16,185,129,.15)]
        animate-in
        fade-in
        slide-in-from-left
      "
    >
      <div
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-2xl
          bg-emerald-500/10
          text-emerald-400
        "
      >
        <CheckCircle2 size={22} />
      </div>

      <div className="flex-1">
        <p className="text-lg font-semibold text-white">
          {item}
        </p>

        <p className="mt-1 text-sm text-zinc-400">
          This strength aligns well with the job requirements.
        </p>
      </div>
    </div>
  )
)}
          </div>
        </div>
      )}

  
      {step >= 2 && (
        <div className="mt-8">

       <h3 className="mb-4 text-xl font-bold text-red-400">
  Missing Skills
</h3>

<div className="space-y-3">

{analysisResult.missingSkills?.map(
  (item: string, index: number) => (
    <div
      key={item}
      style={{
        animationDelay: `${index * 180}ms`,
      }}
      className="
        group
        flex
        items-start
        gap-4
        rounded-3xl
        border
        border-red-500/15
        bg-white/[0.03]
        p-5
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-red-400/40
        hover:bg-red-500/[0.06]
        hover:shadow-[0_0_30px_rgba(239,68,68,.15)]
        animate-in
        fade-in
        slide-in-from-right
      "
    >
      <div
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-2xl
          bg-red-500/10
          text-red-400
        "
      >
        <AlertTriangle size={22} />
      </div>

      <div className="flex-1">
        <p className="text-lg font-semibold text-white">
          {item}
        </p>

        <p className="mt-1 text-sm text-zinc-400">
          Consider improving this skill to increase your match score.
        </p>
      </div>
    </div>
  )
)}

</div>

        </div>
      )}

    {step >= 3 && (
  <div
    className="
      mt-10
      animate-in
      fade-in
      slide-in-from-bottom-6
      duration-700
    "
  >
    <div
      className="
        overflow-hidden
        rounded-[30px]
        border
        border-indigo-500/20
        bg-gradient-to-br
        from-indigo-500/10
        via-[#131c34]
        to-violet-500/10
        p-8
        shadow-[0_0_45px_rgba(99,102,241,.18)]
        backdrop-blur-xl
      "
    >
      <div className="flex items-center gap-5">

        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-indigo-500/15
            text-indigo-400
          "
        >
          <SparklesIcon size={28} />
        </div>

        <div>

          <p className="text-sm uppercase tracking-[0.30em] text-indigo-300">
            AI GENERATED
          </p>

          <h3 className="mt-1 text-3xl font-bold text-white">
            Recommendation
          </h3>

        </div>

      </div>

      <div className="mt-8 rounded-2xl border border-white/5 bg-black/20 p-6">

        <p className="text-lg leading-9 text-zinc-200">
          {analysisResult.aiSuggestions}
        </p>

      </div>

    </div>
  </div>
)}

{step >= 4 && (
  <div
    className="
      mt-9
      animate-in
      fade-in
      slide-in-from-bottom-5
      duration-700
    "
  >
    <button
      onClick={() => {
        toast.success("Application Submitted");
        window.location.href = "/dashboard";
      }}
      className="
        group
        flex
        w-full
        items-center
        justify-center
        gap-3
        rounded-3xl
        bg-gradient-to-r
        from-indigo-600
        via-violet-600
        to-purple-600
        py-5
        text-lg
        font-bold
        text-white
        shadow-[0_0_35px_rgba(99,102,241,.35)]
        transition-all
        duration-300
        hover:scale-[1.02]
        hover:shadow-[0_0_55px_rgba(99,102,241,.55)]
        active:scale-[0.98]
        cursor-pointer
      "
    >
      Continue to Dashboard

      <ArrowRight
        size={22}
        className="
          transition-transform
          duration-300
          group-hover:translate-x-1
        "
      />
    </button>
  </div>
)}

    </div>

  </div>
)}
  </>
  );
  }