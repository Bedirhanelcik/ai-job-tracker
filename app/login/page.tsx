"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.push("/dashboard");
      }
    };

    checkUser();
  }, [router]);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    toast.success(
  "Successfully signed in! Redirecting..."
);

setTimeout(() => {
  router.push("/resume");
}, 1500);
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md border rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded mb-3"
        />

    <button
  onClick={handleLogin}
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
  Login
</button>
      </div>
    </main>
  );
}