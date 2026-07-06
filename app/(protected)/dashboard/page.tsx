"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import CountUp from "../../../components/CountUp";

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
  const [search, setSearch] = useState("");
const [userData, setUserData] = useState<any>(null);
const [cvAnalysis, setCvAnalysis] = useState<any>(null);

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
    const { data: analysis } = await supabase
  .from("cv_analysis")
  .select("*")
  .eq("user_id", user.id)
  .order("created_at", { ascending: false })
  .limit(1)
  .maybeSingle();

setCvAnalysis(analysis);
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
      href="/upload-cv"
      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-400 border border-transparent hover:border-indigo-500/20 hover:bg-white/5 transition-all duration-300"
    >
      <Upload size={18} />
      Upload CV
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


<p className="text-slate-400 mt-3 text-lg">
  Here's what's happening with your job search today.
</p>


  </div>

<div className="grid grid-cols-4 gap-4 mb-5">

  <div className="rounded-3xl bg-[#0F172A] border border-white/5 p-6 hover:border-indigo-500/30 transition-all">

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

  <div className="rounded-3xl bg-[#0F172A] border border-white/5 p-6 hover:border-indigo-500/30 transition-all">

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

  <div className="rounded-3xl bg-[#0F172A] border border-white/5 p-6 hover:border-indigo-500/30 transition-all">

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

  <div className="rounded-3xl bg-[#0F172A] border border-white/5 p-6 hover:border-indigo-500/30 transition-all">

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

<div className="grid grid-cols-4 gap-4 mb-5">

  <div className="col-span-2 rounded-3xl bg-[#0F172A] border border-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] h-[260px]">

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
  <div className="rounded-3xl bg-[#0F172A] border border-white/5 p-4">

  <h3 className="text-xl font-semibold mb-6">
    AI Insights
  </h3>

  <div className="space-y-5">
<div className="mb-4 rounded-2xl bg-[#111827] border border-white/5 p-4">

  <h3 className="text-xl font-semibold mb-6">
    AI Resume Analysis
  </h3>

  <p className="text-slate-400 mb-6">
    Scan your latest resume and receive updated ATS feedback and AI recommendations.
  </p>

  <button className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-4 font-semibold hover:opacity-90 transition">
    Analyze Resume
  </button>

</div>
    <div>
      <p className="text-slate-500 text-xs uppercase">
        Strongest Area
      </p>

      <p className="font-semibold mt-1">
        {cvAnalysis?.strengths?.split(",")[0] ||
  "Technical Skills"}
      </p>
    </div>

    <div>
      <p className="text-slate-500 text-xs uppercase">
        Missing Skills
      </p>

      <p className="font-semibold mt-1 text-amber-400">
        {
  applications.find(
    (app) => app.missing_skills
  )?.missing_skills || "No missing skills"
}
      </p>
    </div>

    <div>
      <p className="text-slate-500 text-xs uppercase">
        ATS Score
      </p>

      <p className="font-semibold mt-1 text-green-400">
        {cvAnalysis?.ats_score || 0}/100
      </p>
    </div>


  </div>

</div>
<div className="rounded-3xl bg-[#0F172A] border border-white/5 p-4">

  <h3 className="text-xl font-semibold mb-6">
    Application Status
  </h3>

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
