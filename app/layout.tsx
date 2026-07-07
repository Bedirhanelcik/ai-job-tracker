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
  title: "AI Job Tracker",
  description: "Track job applications with AI",
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