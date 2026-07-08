"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CountUp from "../../../components/CountUp";
import Image from "next/image";
import {
  LayoutDashboard,
  Briefcase,
  Upload,
  User,
  Bell,
  Search,
  Target,
  Trophy,
  Calendar,
  ArrowRight,
  FileText,
BarChart3,
Handshake,
Award,
TrendingUp,
} from "lucide-react";

export default function Dashboard() {
  const [applications, setApplications] = useState<any[]>([]);
  const latestApplication =
  applications.length > 0
    ? applications[0]
    : null;
  const [search, setSearch] = useState("");
const [userData, setUserData] = useState<any>(null);
const router = useRouter();


  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;
    setUserData(user);

    const { data } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setApplications(data || []);

  };

  const totalApps = applications.length;

  const averageScore =
    applications.length > 0
      ? Math.round(
          applications.reduce(
            (acc, app) => acc + (app.match_score || 0),
            0
          ) / applications.length
        )
      : 0;

  const interviews = applications.filter(
    (app) => app.status === "Interview"
  ).length;

  const offers = applications.filter(
    (app) => app.status === "Offer"
  ).length;

  return (
    <div className="h-screen flex bg-[#030712]">
      {/* Sidebar */}
<aside className="w-72 shrink-0 border-r border-white/5 bg-[#060d1a] p-6 flex flex-col">

  <div>
 <div className="pb-6 border-b border-white/5">

  <h2 className="text-3xl font-bold text-white">
    ⚡ CVMatch
  </h2>

  <p className="text-sm text-slate-500 mt-2">
    AI-Powered Career Platform
  </p>

</div>
  </div>

  <nav className="mt-8 space-y-3">

    <Link
      href="/dashboard"
      className="flex items-center gap-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 px-4 py-3 text-indigo-400"
    >
      <LayoutDashboard size={18} />
      Dashboard
    </Link>

    <Link
      href="/applications"
      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-400 border border-transparent hover:border-indigo-500/20 hover:bg-white/5 transition-all duration-300"
    >
      <Briefcase size={18} />
      Applications
    </Link>

    <Link
      href="/resume"
      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-400 border border-transparent hover:border-indigo-500/20 hover:bg-white/5 transition-all duration-300"
    >
      <Upload size={18} />
      Resume
    </Link>

    <Link
      href="/profile"
      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-400 border border-transparent hover:border-indigo-500/20 hover:bg-white/5 transition-all duration-300"
    >
      <User size={18} />
      Profile
    </Link>

  </nav>

  <div className="mt-auto">
    <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-4">
      <div className="flex items-center gap-3">

        <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
          {userData?.email?.charAt(0).toUpperCase()}
        </div>

        <div>
         <p className="font-medium">
  {userData?.email?.split("@")[0]}
</p>
       <p className="text-xs text-slate-400">
  Job Seeker • {applications.length} Applications Tracked
</p>
        </div>

      </div>
    </div>
  </div>

</aside>

    <div className="flex-1 bg-[#030712] text-white p-6 overflow-y-auto relative">
      <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-indigo-600/10 blur-[180px]" />

<div className="absolute bottom-0 left-0 h-[400px] w-[400px] bg-purple-600/10 blur-[180px]" />
      <div className="max-w-[1700px] mx-auto">

<div className="flex items-center justify-end gap-4 mb-8">

  <div className="relative w-[360px]">

    <Search
      size={18}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
    />

 <input
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="Search applications..."
  className="w-full rounded-2xl border border-white/10 bg-[#0F172A] py-3 pl-11 pr-16 outline-none focus:border-indigo-500/40 focus:bg-[#131d33] transition-all duration-300"
/>

<div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">
  ⌘K
</div>

  </div>

  <button className="h-12 w-12 rounded-2xl bg-[#0F172A] border border-white/10 flex items-center justify-center hover:border-indigo-500/40">

    <Bell size={18} />

  </button>

  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-semibold shadow-[0_0_25px_rgba(99,102,241,0.35)]">
    {userData?.email?.charAt(0).toUpperCase()}
  </div>




</div>
  <div className="mb-8">
    <h1 className="text-4xl font-bold tracking-tight">
      Welcome back 👋
    </h1>
<div className="mt-8 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-600/20 to-purple-600/10 p-8">

<p className="text-slate-300">

AI Career Assistant

</p>

<h2 className="mt-2 text-4xl font-bold">

Track every application.
Improve every interview.

</h2>

<p className="mt-5 max-w-2xl text-slate-400 leading-8">

Analyze your resume, compare it with job descriptions, monitor your application progress and receive AI-powered career recommendations from one dashboard.

</p>

<div className="mt-8 flex gap-4">

<button
onClick={()=>router.push("/applications")}
className="rounded-2xl bg-white px-6 py-4 text-black font-semibold cursor-pointer"
>

Browse Jobs

</button>

<button
onClick={()=>router.push("/resume")}
className="rounded-2xl border border-white/10 px-6 py-4 cursor-pointer hover:border-indigo-500/40 transition"
>

Analyze Resume

</button>

</div>

</div>

<p className="text-slate-400 mt-3 text-lg">
  Here's what's happening with your job search today.
</p>


  </div>

<div className="grid grid-cols-12 gap-6 mb-5">

  <div className="col-span-3 rounded-3xl bg-[#0F172A] border border-white/5 p-6 hover:border-indigo-500/30 transition-all">

    <div className="flex items-center justify-between">

      <div>
        <p className="text-slate-400 text-sm">
          Applications
        </p>

        <h2 className="text-4xl font-bold mt-3">
          {totalApps}
        </h2>

        <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
          <TrendingUp size={14} />
          +12%
        </p>
      </div>

      <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
        <FileText size={24} className="text-indigo-400" />
      </div>

    </div>

  </div>

  <div className="col-span-3 rounded-3xl bg-[#0F172A] border border-white/5 p-6 hover:border-indigo-500/30 transition-all">

    <div className="flex items-center justify-between">

      <div>
        <p className="text-slate-400 text-sm">
          Average Match
        </p>

        <h2 className="text-4xl font-bold mt-3">
          <CountUp
  from={0}
  to={averageScore}
  duration={1}
  className="text-4xl font-bold"
/>
<span>%</span>
        </h2>

        <p className="text-green-400 text-sm mt-2">
          Strong
        </p>
      </div>

      <div className="h-14 w-14 rounded-2xl bg-purple-500/10 flex items-center justify-center">
        <BarChart3 size={24} className="text-purple-400" />
      </div>

    </div>

  </div>

  <div className="col-span-3 rounded-3xl bg-[#0F172A] border border-white/5 p-6 hover:border-indigo-500/30 transition-all">

    <div className="flex items-center justify-between">

      <div>
        <p className="text-slate-400 text-sm">
          Interviews
        </p>

        <h2 className="text-4xl font-bold mt-3">
          {interviews}
        </h2>

        <p className="text-sky-400 text-sm mt-2">
          Active
        </p>
      </div>

      <div className="h-14 w-14 rounded-2xl bg-sky-500/10 flex items-center justify-center">
        <Handshake size={24} className="text-sky-400" />
      </div>

    </div>

  </div>

  <div className="col-span-3 rounded-3xl bg-[#0F172A] border border-white/5 p-6 hover:border-indigo-500/30 transition-all">

    <div className="flex items-center justify-between">

      <div>
        <p className="text-slate-400 text-sm">
          Offers
        </p>

        <h2 className="text-4xl font-bold mt-3">
          {offers}
        </h2>

        <p className="text-amber-400 text-sm mt-2">
          Success
        </p>
      </div>

      <div className="h-14 w-14 rounded-2xl bg-amber-500/10 flex items-center justify-center">
        <Award size={24} className="text-amber-400" />
      </div>

    </div>

  </div>

</div>

<div className="grid grid-cols-12 gap-6 mb-5">

  <div className="col-span-7 rounded-3xl bg-[#0F172A] border border-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] h-[260px]">

    <h3 className="text-xl font-semibold mb-6">
      Match Score Overview
    </h3>

    <div className="flex items-center justify-between">

      <div className="flex items-center gap-8">

     <div className="relative h-44 w-44">

  <svg className="rotate-[-90deg]" width="176" height="176">

    <circle
      cx="88"
      cy="88"
      r="70"
      stroke="#1E293B"
      strokeWidth="12"
      fill="none"
    />

    <circle
      cx="88"
      cy="88"
      r="70"
      stroke="#6366F1"
      strokeWidth="12"
      fill="none"
      strokeDasharray="440"
      strokeDashoffset={
        440 - (440 * averageScore) / 100
      }
      strokeLinecap="round"
    />

  </svg>

  <div className="absolute inset-0 flex flex-col items-center justify-center">

<div className="text-5xl font-bold flex items-center">

  <CountUp
    from={0}
    to={averageScore}
    duration={1}
  />

  <span>%</span>

</div>

    <div className="text-slate-400 text-sm">
      Average Match
    </div>

  </div>

</div>

        <div className="space-y-6">

          <div>
            <p className="text-slate-400 text-sm">
              Match Performance
            </p>

            <p className="text-2xl font-bold mt-1 text-green-400">
              +8%
            </p>
          </div>

          <div>
            <p className="text-slate-400 text-sm">
              High Match Jobs
            </p>
<p className="text-slate-400 text-sm mt-4">
  Best performing applications above 80% match score.
</p>
            <p className="text-2xl font-bold mt-1">
              {
                applications.filter(
                  (app) => (app.match_score || 0) >= 80
                ).length
              }
            </p>
          </div>

        </div>

      </div>

    </div>

  </div>
  <div className="col-span-5 rounded-3xl bg-[#0F172A] border border-white/5 p-4">

 <div className="col-span-5 rounded-3xl bg-[#0F172A] border border-white/5 p-6">

<h3 className="text-2xl font-bold">
Latest Application Analysis
</h3>

<p className="text-slate-400 mt-2">
AI analysis from your most recent application.
</p>

{latestApplication ? (

<>

<div className="mt-8">

<p className="text-slate-500 text-sm">
Company
</p>

<div className="mt-4 flex items-center gap-4">

  <Image
    src={
      latestApplication.company.toLowerCase().includes("google")
        ? "/companies/google.png"
        : latestApplication.company.toLowerCase().includes("microsoft")
        ? "/companies/microsoft.png"
        : latestApplication.company.toLowerCase().includes("amazon")
        ? "/companies/amazon.png"
        : latestApplication.company.toLowerCase().includes("adobe")
        ? "/companies/adobe.png"
        : "/companies/default.png"
    }
    className="h-12 w-12 rounded-xl object-contain border border-white/10 bg-white/5 p-2"
    alt={latestApplication.company}
    width={48}
height={48}
  />

  <div>

    <p className="text-2xl font-bold">
      {latestApplication.company}
    </p>

    <p className="text-slate-500">
      {latestApplication.position}
    </p>

  </div>

</div>

</div>

<div className="mt-8">

<p className="text-slate-500 text-sm">
Match Score
</p>

<div className="mt-6 flex items-center gap-6">

  <div className="relative h-28 w-28">

    <svg
      className="rotate-[-90deg]"
      width="112"
      height="112"
    >

      <circle
        cx="56"
        cy="56"
        r="45"
        stroke="#1E293B"
        strokeWidth="8"
        fill="none"
      />

      <circle
        cx="56"
        cy="56"
        r="45"
        stroke="#6366F1"
        strokeWidth="8"
        fill="none"
        strokeDasharray="283"
        strokeDashoffset={
          283 -
          (283 *
            latestApplication.match_score) /
            100
        }
        strokeLinecap="round"
      />

    </svg>

    <div className="absolute inset-0 flex items-center justify-center">

      <span className="text-2xl font-bold">

        {latestApplication.match_score}%

      </span>

    </div>

  </div>

  <div>

    <p className="text-xl font-semibold">

      ATS Compatibility

    </p>

    <p className="text-slate-500 mt-2">

      AI confidence based on your latest application.

    </p>

  </div>

</div>


</div>

<div className="mt-8">

<p className="text-slate-500 text-sm">
Strengths
</p>

<div className="mt-3 flex flex-wrap gap-2">

{latestApplication.strengths
?.split(",")
.map((skill:string)=>(

<span
key={skill}
className="rounded-full bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300"
>

✓ {skill.trim()}

</span>

))}

</div>

</div>

<div className="mt-8">

<p className="text-slate-500 text-sm">
Missing Skills
</p>

<div className="mt-3 flex flex-wrap gap-2">

{latestApplication.missing_skills
?.split(",")
.map((skill:string)=>(

<span
key={skill}
className="rounded-full bg-red-500/10 px-3 py-2 text-sm text-red-300"
>

{skill.trim()}

</span>

))}

</div>

</div>

<div className="mt-8">

<p className="text-slate-500 text-sm">
AI Recommendation
</p>

<div className="mt-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">

<p className="text-slate-300 leading-8">

{latestApplication.ai_suggestions}

</p>

</div>


</div>

<button

onClick={()=>router.push("/resume")}

className="
mt-8
w-full
rounded-2xl
bg-gradient-to-r
from-indigo-600
via-violet-600
to-purple-600
py-4
font-semibold
cursor-pointer
transition-all
duration-300
hover:scale-[1.02]
hover:shadow-[0_0_40px_rgba(99,102,241,.45)]
active:scale-[0.98]
"

>

Analyze Another CV

</button>

</>

) : (

<div className="mt-12 text-center">

<p className="text-slate-500">

No applications yet.

</p>

<button

onClick={()=>router.push("/applications")}

className="mt-6 rounded-2xl bg-indigo-600 px-6 py-4"

>

Browse Jobs

</button>

</div>

)}

</div>


</div>
<div className="col-span-12 rounded-3xl bg-[#0F172A] border border-white/5 p-4">

  <h3 className="text-xl font-semibold mb-6">
    Application Status
  </h3>
<div className="col-span-12 rounded-3xl border border-white/5 bg-[#0F172A] p-6 mt-6">

  <div className="flex items-center justify-between mb-6">

    <h3 className="text-2xl font-bold">
      Recent Applications
    </h3>

    <button
      onClick={() => router.push("/applications")}
      className="text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
    >
      View All →
    </button>

  </div>

  <div className="space-y-4">

    {applications.slice(0,5).map((app)=>{

      const logo =
        app.company.toLowerCase().includes("google")
          ? "/companies/google.png"
          : app.company.toLowerCase().includes("microsoft")
          ? "/companies/microsoft.png"
          : app.company.toLowerCase().includes("amazon")
          ? "/companies/amazon.png"
          : app.company.toLowerCase().includes("adobe")
          ? "/companies/adobe.png"
          : "/companies/default.png";

      return (

        <div
          key={app.id}
          className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-4 hover:border-indigo-500/30 transition"
        >

          <div className="flex items-center gap-4">

            <Image
              src={logo}
              alt={app.company}
              width={42}
              height={42}
              className="rounded-xl border border-white/10 bg-white/5 p-2"
            />

            <div>

              <p className="font-semibold">
                {app.company}
              </p>

              <p className="text-sm text-slate-500">
                {app.position}
              </p>

            </div>

          </div>

          <div className="text-right">

            <p className="font-bold text-indigo-400">
              {app.match_score}%
            </p>

            <p className="text-xs text-slate-500">
              {app.status}
            </p>

          </div>

        </div>

      );

    })}

  </div>

</div>
 <div className="space-y-5">

  <div>
    <div className="flex justify-between mb-2">
      <span>Applied</span>
      <span>{totalApps}</span>
    </div>

    <div className="h-2 rounded-full bg-[#1E293B]">
      <div
  className="h-2 rounded-full bg-indigo-500"
  style={{
    width: `${
      totalApps === 0
        ? 0
        : (applications.filter(
            (app) => app.status === "Applied"
          ).length /
            totalApps) *
          100
    }%`,
  }}
/>
    </div>
  </div>

  <div>
    <div className="flex justify-between mb-2">
      <span>Interview</span>
      <span>{interviews}</span>
    </div>

    <div className="h-2 rounded-full bg-[#1E293B]">
      <div
  className="h-2 rounded-full bg-sky-500"
  style={{
    width: `${
      totalApps === 0
        ? 0
        : (interviews / totalApps) * 100
    }%`,
  }}
/>
    </div>
  </div>

  <div>
    <div className="flex justify-between mb-2">
      <span>Offer</span>
      <span>{offers}</span>
    </div>

    <div className="h-2 rounded-full bg-[#1E293B]">
      <div
  className="h-2 rounded-full bg-amber-500"
  style={{
    width: `${
      totalApps === 0
        ? 0
        : (offers / totalApps) * 100
    }%`,
  }}
/>
    </div>
  

  </div>
</div>
 
<div className="overflow-hidden rounded-2xl border border-white/5">

{applications.length === 0 && (
  <div className="py-16 text-center">
    <p className="text-slate-400">
      No applications yet.
    </p>

    <Link
      href="/applications"
      
      className="inline-flex mt-4 rounded-xl bg-indigo-500 px-5 py-3"
    >
      Add First Application
    </Link>
  </div>
)}
 

</div>
</div>
</div>
</div>
</div>
</div>
  );
}
