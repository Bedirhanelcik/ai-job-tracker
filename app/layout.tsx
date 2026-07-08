import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CvMatch",
    template: "%s | CvMatch",
  },

  description:
    "AI-powered resume analyzer and job application tracker. Analyze your CV, improve your ATS score, identify missing skills, and manage applications with Google Gemini AI.",

  applicationName: "CvMatch",

  keywords: [
    "CV",
    "Resume",
    "ATS",
    "AI Resume Analyzer",
    "Job Tracker",
    "Next.js",
    "Supabase",
    "Gemini AI",
  ],

  authors: [
    {
      name: "Bedirhan Elçik",
    },
  ],

  creator: "Bedirhan Elçik",

 icons: {
  icon: "/icon.png",
  shortcut: "/icon.png",
  apple: "/icon.png",
},
  openGraph: {
    title: "CvMatch",
    description:
      "AI-powered resume analyzer and job application tracker.",
    type: "website",
    siteName: "CvMatch",
  },

  twitter: {
    card: "summary_large_image",
    title: "CvMatch",
    description:
      "AI-powered resume analyzer and job application tracker.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable}`}
    >
      <body
        className={`${geistSans.className} bg-zinc-950 text-white min-h-screen`}
      >
        {children}

        <Toaster
          position="top-center"
          richColors
          closeButton
          theme="dark"
          duration={3500}
        />
      </body>
    </html>
  );
}