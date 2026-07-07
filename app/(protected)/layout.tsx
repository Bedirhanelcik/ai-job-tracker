"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: resume } = await supabase
        .from("resumes")
        .select("id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (!resume && pathname !== "/resume") {
        router.replace("/resume");
        return;
      }

      setLoading(false);
    };

    checkUser();
  }, [router, pathname]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black" />
    );
  }

  return <>{children}</>;
}