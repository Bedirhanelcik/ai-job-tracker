"use client";

import {
Briefcase,
TrendingUp,
CheckCircle2,
Brain,
Sparkles,
} from "lucide-react";

import { NumberTicker } from "@/components/ui/number-ticker";
import { ShineBorder } from "@/components/ui/shine-border";
import { BlurFade } from "@/components/ui/blur-fade";
import { AnimatedList } from "@/components/ui/animated-list";

type Application = {
id: string;
company: string;
position: string;
match_score: number;
missing_skills: string;
status?: string;
};

interface DashboardBentoProps {
totalApps: number;
averageScore: number;
highMatches: number;
applications: Application[];
}

export default function DashboardBento({
totalApps,
averageScore,
highMatches,
applications,
}: DashboardBentoProps) {
const skillCounts: Record<string, number> = {};

applications.forEach((app) => {
if (!app.missing_skills) return;

app.missing_skills.split(",").forEach((skill) => {
  const clean = skill.trim();

  if (!clean) return;

  skillCounts[clean] = (skillCounts[clean] || 0) + 1;
});

});

const topSkills = Object.entries(skillCounts)
.sort((a, b) => b[1] - a[1])
.slice(0, 8);

return (
  <div className="space-y-8 mb-12">
    <BlurFade delay={0.1} inView>
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl p-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-cyan-500/5" />


      <div className="relative">
        <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950/70 px-4 py-2 text-xs text-zinc-400 mb-5">
          AI Powered Career Analytics
        </div>

        <h2 className="text-5xl font-bold tracking-tight mb-3">
          AI Career Overview
        </h2>

        <p className="text-zinc-400 text-lg max-w-3xl mb-10">
          Analyze job descriptions, discover skill gaps,
          and improve your hiring success with AI.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40">
            <ShineBorder
              shineColor={[
                "#3B82F6",
                "#60A5FA",
                "#2563EB",
              ]}
            />

            <Briefcase className="h-6 w-6 text-blue-400 mb-4" />

            <p className="text-zinc-400 text-sm mb-3">
              Applications
            </p>

            <NumberTicker
              value={totalApps}
              className="text-7xl font-black text-white"
            />
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-green-500/40">
            <ShineBorder
              shineColor={[
                "#10B981",
                "#34D399",
                "#059669",
              ]}
            />

            <TrendingUp className="h-6 w-6 text-green-400 mb-4" />

            <p className="text-zinc-400 text-sm mb-3">
              Average Match
            </p>

            <div className="flex items-end">
              <NumberTicker
                value={averageScore}
                className="text-7xl font-black text-white"
              />

              <span className="text-4xl font-black ml-1">
                %
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40">
            <ShineBorder
              shineColor={[
                "#10B981",
                "#22C55E",
                "#34D399",
              ]}
            />

            <CheckCircle2 className="h-6 w-6 text-emerald-400 mb-4" />

            <p className="text-zinc-400 text-sm mb-3">
              High Matches
            </p>

            <NumberTicker
              value={highMatches}
              className="text-7xl font-black text-white"
            />
          </div>
        </div>
      </div>
    </div>
  </BlurFade>

  <div className="grid xl:grid-cols-5 gap-6">
    <BlurFade delay={0.2} inView>
      <div className="xl:col-span-3 rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl p-8 min-h-[320px]">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="h-6 w-6 text-cyan-400" />

          <h3 className="text-2xl font-bold">
            AI Insights
          </h3>
        </div>

        <p className="text-zinc-400 mb-8">
          Most frequently detected skill gaps
          across your analyzed applications.
        </p>

        {topSkills.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {topSkills.map(([skill, count]) => (
              <div
                key={skill}
                className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-red-400"
              >
                {skill} ({count})
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-6">
            <div className="text-green-400 font-semibold text-lg">
              No missing skills detected
            </div>

            <p className="text-zinc-400 mt-2">
              Your resume aligns very well with
              analyzed job descriptions.
            </p>
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-blue-400" />

            <span className="font-medium text-blue-400">
              AI Recommendation
            </span>
          </div>

          <p className="text-zinc-300">
            Continue applying to roles with
            match scores above 80% to maximize
            interview conversion rates.
          </p>
        </div>
      </div>
    </BlurFade>

    <BlurFade delay={0.25} inView>
      <div className="xl:col-span-2 rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl p-6 h-[420px] overflow-hidden">
        <h3 className="text-2xl font-bold mb-5">
          Recent Activity
        </h3>

        <AnimatedList>
          {applications.slice(0, 8).map((app) => (
            <div
              key={app.id}
              className="mb-3 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 transition-all duration-300 hover:border-blue-500/40 hover:bg-zinc-900"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20">
                  💼
                </div>

                <div>
                  <p className="font-semibold text-white">
                    {app.company}
                  </p>

                  <p className="text-sm text-zinc-500">
                    {app.position}
                  </p>
                </div>
              </div>
            </div>
          ))}
         </AnimatedList>
      </div>
    </BlurFade>
  </div>
</div>
);
}