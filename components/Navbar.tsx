"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  User,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const linkClass = (href: string) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl transition ${
      pathname === href
        ? "bg-zinc-800 text-white"
        : "text-zinc-400 hover:text-white hover:bg-zinc-900"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="font-bold text-xl"
        >
          AI Job Tracker
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className={linkClass("/dashboard")}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            href="/applications"
            className={linkClass("/applications")}
          >
            <Briefcase size={18} />
            Applications
          </Link>

          <Link
            href="/resume"
            className={linkClass("/resume")}
          >
            <FileText size={18} />
            Resume
          </Link>

          <Link
            href="/profile"
            className={linkClass("/profile")}
          >
            <User size={18} />
            Profile
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-400 hover:bg-red-500/10"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}