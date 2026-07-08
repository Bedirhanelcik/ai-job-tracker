"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LockKeyhole } from "lucide-react";
import { toast } from "sonner";

export default function NewApplicationPage() {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [jobDescription, setJobDescription] =
    useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmployer, setIsEmployer] = useState<boolean | null>(null);
useEffect(() => {
  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setIsEmployer(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("is_employer")
      .eq("id", user.id)
      .single();

    setIsEmployer(data?.is_employer ?? false);
  };

  loadProfile();
}, []);
  const handleSave = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please login first");
        return;
      }

const { error } = await supabase
  .from("job_listings")
  .insert({
    user_id: user.id,
    company,
    position,
    job_description: jobDescription,
    job_url: jobUrl,
  });

      if (error) {
        alert(error.message);
        return;
      }

      toast.success("Job Listing Published", {
  description:
    "Your job listing is now visible to candidates.",
});

      setCompany("");
      setPosition("");
      setJobDescription("");
      setJobUrl("");
      setNotes("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
if (isEmployer === false) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg w-full rounded-3xl border border-white/10 bg-[#0F172A] p-10 text-center">

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20 text-4xl">
          <LockKeyhole size={38} className="text-amber-400" />
        </div>

        <h1 className="text-3xl font-bold">
          Employer Access Required
        </h1>

        <p className="mt-4 text-slate-400 leading-7">
          Enable Employer Mode from your profile before creating job listings.
        </p>
<div className="mt-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
  <p className="text-sm text-indigo-200">
    Employer Mode unlocks the ability to publish job listings and manage applicants.
  </p>
</div>
        <button
          onClick={() => (window.location.href = "/profile")}
          className="mt-8 w-full rounded-2xl bg-white text-black py-4 font-semibold hover:opacity-90 transition"
        >
          Go to Profile
        </button>

      </div>
    </main>
  );
}
  return (
    <main className="max-w-4xl mx-auto px-8 py-12">
      <div className="mb-10">
        <h1 className="text-5xl font-bold">
          Create Job Listing
        </h1>

        <p className="text-zinc-400 mt-3">
         Publish a new job listing for candidates.
        </p>
      </div>

      <div className="space-y-5">
        <input
          placeholder="Company"
          value={company}
          onChange={(e) =>
            setCompany(e.target.value)
          }
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 outline-none focus:border-blue-500"
        />

        <input
          placeholder="Job Title"
          value={position}
          onChange={(e) =>
            setPosition(e.target.value)
          }
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 outline-none focus:border-blue-500"
        />

        <input
          placeholder="Application URL (Optional)"
          value={jobUrl}
          onChange={(e) =>
            setJobUrl(e.target.value)
          }
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 outline-none focus:border-blue-500"
        />

        <textarea
          placeholder="Describe the role, responsibilities, requirements and benefits..."
          value={jobDescription}
          onChange={(e) =>
            setJobDescription(
              e.target.value
            )
          }
          className="w-full h-72 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 outline-none focus:border-blue-500 resize-none"
        />

        <textarea
          placeholder="Internal Notes (Optional)"
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 outline-none focus:border-blue-500 resize-none"
        />

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-white text-black font-semibold py-4 rounded-2xl hover:opacity-90 transition disabled:opacity-50"
        >
          {loading
            ? "Publishing..."
            : "Publish Job Listing"}
        </button>
      </div>
    </main>
  );
}