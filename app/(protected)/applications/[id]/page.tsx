"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ApplicationDetailPage() {
  const params = useParams();
  const [application, setApplication] = useState<any>(null);

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    const { data } = await supabase
      .from("applications")
      .select("*")
      .eq("id", params.id)
      .single();

    setApplication(data);
  };

  if (!application) {
    return (
      <div className="p-10 text-white">
        Loading...
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-8 text-white">

      <h1 className="text-5xl font-bold mb-2">
        {application.company}
      </h1>

      <p className="text-zinc-400 mb-10">
        {application.position}
      </p>

      <div className="grid gap-6">

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-zinc-500 mb-2">
            Match Score
          </p>

          <h2 className="text-6xl font-bold text-emerald-400">
            {application.match_score || 0}%
          </h2>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-zinc-500 mb-3">
            Status
          </p>

          <p>
            {application.status}
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-zinc-500 mb-3">
            Missing Skills
          </p>

          <p>
            {application.missing_skills || "None"}
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-zinc-500 mb-3">
            AI Suggestions
          </p>

          <div className="whitespace-pre-line">
            {application.ai_suggestions || "No suggestions"}
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-zinc-500 mb-3">
            Notes
          </p>

          <div className="whitespace-pre-line">
            {application.notes || "No notes"}
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-zinc-500 mb-3">
            Job Description
          </p>

          <div className="whitespace-pre-line">
            {application.job_description}
          </div>
        </div>

      </div>

    </main>
  );
}