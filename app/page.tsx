import Link from "next/link";
import DarkVeil from "../components/DarkVeil";

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0">
        <DarkVeil
          hueShift={0}
          noiseIntensity={0}
          scanlineIntensity={0}
          speed={0.5}
          scanlineFrequency={0}
          warpAmount={0}
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">

        <h1
          className="
            select-none
            text-white
            text-[72px]
            md:text-[104px]
            font-black
            tracking-[-0.08em]
            leading-[0.9]
            drop-shadow-[0_8px_30px_rgba(255,255,255,0.12)]
          "
        >
          ANALYZE YOUR CV
        </h1>

        <p
          className="
            mt-8
            max-w-3xl
            text-xl
            md:text-2xl
            leading-10
            font-medium
            text-white/65
          "
        >
          Find your best job matches, improve your resume with AI,
          <br />
          and track every application in one place.
        </p>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-6">

          {/* Login */}
          <Link
            href="/login"
            className="
              flex
              h-16
              w-56
              items-center
              justify-center
              rounded-2xl
              bg-white
              text-black
              text-xl
              font-semibold
              shadow-[0_10px_40px_rgba(255,255,255,0.18)]
              transition-all
              duration-300
              hover:scale-105
              hover:bg-neutral-200
              active:scale-95
            "
          >
            Login
          </Link>

          {/* Sign Up */}
          <Link
            href="/register"
            className="
              flex
              h-16
              w-56
              items-center
              justify-center
              rounded-2xl
              border
              border-white/20
              bg-black/10
              backdrop-blur-md
              text-white
              text-xl
              font-semibold
              transition-all
              duration-300
              hover:scale-105
              hover:border-white
              hover:bg-white/5
              active:scale-95
            "
          >
            Sign Up
          </Link>

        </div>

      </div>
    </main>
  );
}