"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log("USER:", data.user);

    if (error) {
      alert(error.message);
      return;
    }

   const { error: profileError } =
  await supabase.from("profiles").insert({
    id: data.user!.id,
    full_name: email.split("@")[0],
    headline: "",
    github: "",
    linkedin: "",
    location: "",
    avatar_url: "",
  });
  
    console.log(
      "PROFILE ERROR:",
      profileError
    );

    if (profileError) {
      alert(profileError.message);
      return;
    }

toast.success(
  "Account created successfully! Redirecting..."
);

setTimeout(() => {
  router.push("/resume");
}, 500);
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md border rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">
          Register
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border p-3 rounded mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full border p-3 rounded mb-3"
        />

   <button
  onClick={handleRegister}
  className="
    w-full
    rounded-xl
    bg-black
    py-3
    text-white
    font-semibold
    cursor-pointer
    transition-all
    duration-200
    active:scale-95
    hover:bg-zinc-800
    hover:shadow-[0_8px_30px_rgba(255,255,255,0.12)]
  "
>
  Register
</button>
<p className="mt-5 text-center text-sm text-zinc-500">
  Already have an account?{" "}
  <button
    onClick={() => router.push("/login")}
    className="font-semibold text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
  >
    Login
  </button>
</p>
      </div>
    </main>
  );
}