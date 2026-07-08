"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Mail,
  Shield,
  TriangleAlert,
  Calendar,
  LogOut,
  UserCircle2,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);


const [showAtsWarning, setShowAtsWarning] =
  useState(false);

  const router = useRouter();

useEffect(() => {
  const checkATS = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("ats_score")
      .eq("id", user.id)
      .single();

    setShowAtsWarning(
      (data?.ats_score ?? 0) < 30
    );
  };

  checkATS();
  getUser();
}, []);
const [profile, setProfile] = useState<any>(null);
const getUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  setUser(user);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  setProfile(profile);
  setForm({
  full_name: profile?.full_name || "",
  headline: profile?.headline || "",
  github: profile?.github || "",
  linkedin: profile?.linkedin || "",
  location: profile?.location || "",
});
};
const [editing, setEditing] = useState(false);

const [form, setForm] = useState({
  full_name: "",
  headline: "",
  github: "",
  linkedin: "",
  location: "",
});
const handleSaveProfile = async () => {
  if (!user) return;

  const { error } = await supabase
    .from("profiles")
    .update(form)
    .eq("id", user.id);

  if (error) {
    alert(error.message);
    return;
  }

  setEditing(false);
  getUser();
};
  const handleLogout = async () => {
    await supabase.auth.signOut();

    router.push("/login");
  };

  return (
  <main className="min-h-screen bg-[#030712] text-white relative overflow-hidden">

   
      <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-indigo-600/10 blur-[180px]" />

      <div className="absolute bottom-0 left-0 h-[450px] w-[450px] bg-purple-600/10 blur-[180px]" />

      <div className="max-w-7xl mx-auto px-8 py-12">

        <div className="flex items-center justify-between mb-10">

          <div>

            <div className="flex items-center gap-3">

              <Sparkles className="text-indigo-400" />

              <span className="uppercase tracking-[0.25em] text-xs text-indigo-400">
                Account
              </span>

            </div>

            <h1 className="text-5xl font-bold mt-3">
              My Profile
            </h1>

            <p className="text-slate-400 mt-3">
              Manage your account and security settings.
            </p>

          </div>

        {showAtsWarning ? (
  <div className="flex-1 ml-8 max-w-[800px]">

    <div className="relative flex items-center justify-between overflow-hidden rounded-3xl border border-red-500/30 bg-gradient-to-r from-[#4b0b12] via-[#2d0810] to-[#4b0b12] px-8 py-6 shadow-[0_0_40px_rgba(239,68,68,0.18)]">

      <div className="flex items-center gap-6">

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10">

          <TriangleAlert
            size={34}
            className="text-red-400"
          />

        </div>

        <div>

          <h3 className="text-2xl font-bold text-white">
            ATS Score Too Low
          </h3>

          <p className="mt-2 text-red-100/80">
            Your ATS score is below 30. Improve your resume before applying for jobs.
          </p>

        </div>

      </div>

      <div className="flex items-center justify-center">

        <TriangleAlert
          size={42}
          className="text-red-400 animate-pulse"
        />

      </div>

    </div>

  </div>
) : (
<div className="flex items-center gap-4">

  <button
    onClick={() => router.push("/dashboard")}
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
      cursor-pointer
    "
  >
    Dashboard
  </button>

  <button
    onClick={handleLogout}
    className="
      flex
      items-center
      gap-2
      rounded-2xl
      bg-red-500
      hover:bg-red-600
      px-6
      py-4
      font-semibold
      transition-all
      cursor-pointer
    "
  >
    <LogOut size={18} />
    Logout
  </button>

</div>
)}

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-1">

            <div className="rounded-3xl border border-white/10 bg-[#0F172A] p-8">

              <div className="flex flex-col items-center">

                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_35px_rgba(99,102,241,0.35)]">

                  <UserCircle2 size={74} />

                </div>
                <h2 className="text-3xl font-bold mt-6">
  {profile?.full_name || user?.email?.split("@")[0]}
</h2>

{profile?.headline && (
  <p className="text-slate-400 mt-4 text-center">
    {profile.headline}
  </p>
)}

<div className="mt-5 flex justify-center">
  <div
className={`flex items-center gap-2 rounded-full px-5 py-2 border transition-all duration-300 ${
  profile?.is_employer
    ? "border-emerald-400/40 bg-gradient-to-r from-emerald-500/20 to-green-500/10 shadow-[0_0_20px_rgba(16,185,129,.25)]"
    : "border-white/10 bg-zinc-800"
}`}
  >
    <BadgeCheck
      size={16}
      className={
        profile?.is_employer
          ? "text-emerald-300"
          : "text-white"
      }
    />

    <span
    className={`text-sm font-bold tracking-wide ${
  profile?.is_employer
    ? "text-emerald-200"
    : "text-white"
}`}
    >
      {profile?.is_employer
  ? "Verified Employer"
  : "Personal Account"}
    </span>
  </div>
</div>
{!profile?.is_employer && (
  <>
    <p className="mt-6 mb-3 text-center text-sm text-slate-400">
      Enable Employer Mode to publish and manage job listings.
    </p>

    <button
   onClick={async () => {
    if (!user) {
  return;
}
    const {
  data: atsData,
} = await supabase
  .from("profiles")
  .select("ats_score")
  .eq("id", user.id)
  .single();

if ((atsData?.ats_score ?? 0) < 30) {
  toast.error("ATS Score Too Low", {
    description:
      "You need an ATS score of at least 30 to become a verified employer.",
  });

  return;
}
  const { error } = await supabase
    .from("profiles")
    .update({
      is_employer: true,
    })
    .eq("id", user.id);
console.log("UPDATE ERROR:", error);

const { data: check } = await supabase
  .from("profiles")
  .select("is_employer")
  .eq("id", user.id)
  .single();

console.log("DATABASE VALUE:", check);
console.log("is_employer =", check?.is_employer);
if (!error) {
  toast.success("Employer Mode Enabled", {
    description:
      "You can now publish and manage job listings.",
  });

  setProfile((prev: any) => ({
    ...prev,
    is_employer: true,
  }));
} else {
  toast.error("Something went wrong.");
}
}}
      className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 py-3 font-semibold text-white transition-all duration-300 hover:bg-white/20 active:scale-95"
    >
      Become an Employer
    </button>
  </>
)}



<div className="grid grid-cols-2 gap-4 mt-8 w-full">

  <div className="rounded-2xl bg-[#111827] p-5 text-center">

    <p className="text-slate-500 text-xs uppercase">
      Status
    </p>

    <p className="mt-2 text-lg font-semibold">
      Active
    </p>

  </div>

  <div className="rounded-2xl bg-[#111827] p-5 text-center">

    <p className="text-slate-500 text-xs uppercase">
      Plan
    </p>

    <p className="mt-2 text-lg font-semibold">
      Free
    </p>

  </div>

</div>

</div>

</div>

</div>

<div className="lg:col-span-2 space-y-6">

<div className="rounded-3xl border border-white/10 bg-[#0F172A] p-8">

<h2 className="text-2xl font-bold mb-8">
Account Information
</h2>

<div className="space-y-6">

<div className="rounded-2xl border border-white/5 bg-[#111827] p-6">

<div className="flex items-center gap-4">

<div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center">

<Mail className="text-indigo-400" />

</div>

<div>

<p className="text-slate-400 text-sm">
Email Address
</p>

<p className="text-lg font-medium mt-1">
{profile?.email || user?.email}
</p>

</div>

</div>

</div>

<div className="rounded-2xl border border-white/5 bg-[#111827] p-6">

<div className="flex items-center justify-between">

<div className="flex items-center gap-4">

<div className="h-14 w-14 rounded-2xl bg-purple-500/10 flex items-center justify-center">

<Shield className="text-purple-400" />

</div>

<div>

<p className="text-slate-400 text-sm">
User ID
</p>

<p className="text-sm break-all mt-1">
{user?.id}
</p>

</div>

</div>

</div>

</div>
      <div className="rounded-2xl border border-white/5 bg-[#111827] p-6">

  <div className="flex items-center gap-4">

    <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
      <Calendar className="text-emerald-400" />
    </div>

    <div>

      <p className="text-slate-400 text-sm">
        Member Since
      </p>
<p className="text-lg font-medium mt-1">
  {profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently"}
</p>
    </div>

  </div>

</div>



</div> {/* space-y-6 */}

</div> {/* Account Information */}
<div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/5 p-8">

  <div className="flex items-center justify-between">

   <div>

  <h2 className="text-2xl font-bold">
    Account
  </h2>

  <p className="text-slate-400 mt-2">
    Manage your profile or sign out.
  </p>

</div>

<div className="flex gap-4">

<button
  onClick={() => setEditing(true)}
  className="rounded-2xl bg-indigo-600 hover:bg-indigo-500 px-6 py-4 font-semibold transition"
>
  Edit Profile
</button>


</div>

    <button
      onClick={handleLogout}
      className="flex items-center gap-2 rounded-2xl bg-red-500 hover:bg-red-600 transition px-8 py-4 font-semibold"
    >

           <LogOut size={20} />
      Logout
    </button>

  </div>
</div>

</div> {/* lg:col-span-2 */}

</div> {/* grid */}

</div> {/* max-w-7xl */}


{editing && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

    <div className="w-full max-w-xl rounded-3xl bg-[#0F172A] border border-white/10 p-8">

      <h2 className="text-3xl font-bold mb-8">
        Edit Profile
      </h2>

      <div className="space-y-5">

        <input
          placeholder="Full Name"
          value={form.full_name}
          onChange={(e) =>
            setForm({ ...form, full_name: e.target.value })
          }
          className="w-full rounded-2xl bg-[#111827] p-4 border border-white/10"
        />

        <input
          placeholder="Headline"
          value={form.headline}
          onChange={(e) =>
            setForm({ ...form, headline: e.target.value })
          }
          className="w-full rounded-2xl bg-[#111827] p-4 border border-white/10"
        />


        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
          className="w-full rounded-2xl bg-[#111827] p-4 border border-white/10"
        />

      </div>

      <div className="flex justify-end gap-4 mt-8">

        <button
          onClick={() => setEditing(false)}
          className="px-6 py-3 rounded-2xl bg-zinc-700"
        >
          Cancel
        </button>

        <button
          onClick={handleSaveProfile}
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500"
        >
          Save Changes
        </button>

      </div>

    </div>

  </div>
)}

</main>
  );
}