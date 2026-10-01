"use client";

import { useState } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/useProgress";
import PlanWizardModal from "./PlanWizardModal";

interface ActivePlanWidgetProps {
  defaultFocus?: string;
  className?: string;
}

export default function ActivePlanWidget({
  defaultFocus,
  className = "",
}: ActivePlanWidgetProps) {
  const { progress, togglePlanMilestone, mounted } = useProgress();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [showAllMilestones, setShowAllMilestones] = useState(false);

  if (!mounted) {
    return (
      <div
        className={`h-36 rounded-3xl bg-white/[0.02] border border-white/5 animate-pulse ${className}`}
      />
    );
  }

  const customPlan = progress.customPlan;

  if (!customPlan) {
    return (
      <>
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-purple-900/10 to-black border border-primary/20 p-6 sm:p-8 shadow-xl ${className}`}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center text-2xl shrink-0 border border-primary/30 shadow-inner">
                🎯
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 uppercase tracking-wider">
                    Interactive Skill Diagnostic
                  </span>
                  <span className="text-[11px] text-foreground/40 font-mono hidden sm:inline">
                    Takes 30 seconds · No signup
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Want a Personalized LLD, HLD & Interview Study Plan?
                </h3>
                <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed max-w-2xl">
                  Tell us what you want to learn (LLD, HLD, DSA, or SDE-2/3),
                  your starting level, and daily time budget. We&apos;ll
                  generate a custom step-by-step roadmap with interactive tools
                  and suggested next actions.
                </p>
              </div>
            </div>

            <button
              onClick={() => setWizardOpen(true)}
              className="bg-gradient-to-r from-primary via-purple-600 to-primary-dark hover:from-primary-dark hover:to-purple-500 text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-2xl shadow-lg shadow-primary/25 transition-all hover:scale-105 active:scale-95 shrink-0 whitespace-nowrap flex items-center gap-2"
            >
              <span>✨ Build My Custom Plan</span>
              <span>&rarr;</span>
            </button>
          </div>

          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        <PlanWizardModal
          isOpen={wizardOpen}
          onClose={() => setWizardOpen(false)}
          defaultFocus={defaultFocus}
        />
      </>
    );
  }

  const milestones = customPlan.milestones || [];
  const completedCount = milestones.filter((m) => m.completed).length;
  const progressPercent =
    milestones.length > 0
      ? Math.round((completedCount / milestones.length) * 100)
      : 0;
  const nextMilestone = milestones.find((m) => !m.completed);
  const nextMilestoneIndex = nextMilestone
    ? milestones.findIndex((m) => m.id === nextMilestone.id) + 1
    : milestones.length;

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case "lld":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "hld":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "coding":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "tools":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "behavioral":
        return "bg-pink-500/10 text-pink-400 border-pink-500/20";
      case "notebooklm":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      default:
        return "bg-white/10 text-foreground/70 border-white/10";
    }
  };

  return (
    <>
      <div
        className={`glass-card p-6 sm:p-8 flex flex-col gap-6 border-primary/25 relative overflow-hidden bg-gradient-to-br from-primary/10 via-white/[0.02] to-black shadow-2xl ${className}`}
      >
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center text-xl shrink-0">
              🎯
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 uppercase tracking-wider">
                  Your Active Study Plan
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 text-foreground/70 border border-white/10">
                  {customPlan.experienceLevel.toUpperCase()}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 text-foreground/70 border border-white/10">
                  ⏱️ {customPlan.dailyTime} daily
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground mt-1">
                {customPlan.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => setWizardOpen(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-foreground/80 hover:text-white transition-all flex items-center gap-1.5"
            >
              <span>⚙️</span>
              <span>Retake Diagnostic</span>
            </button>
          </div>
        </div>

        {/* Progress Tracker Bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground/70">
              Plan Progress:{" "}
              <strong className="text-white">{completedCount}</strong> of{" "}
              <strong className="text-white">{milestones.length}</strong>{" "}
              Milestones Completed
            </span>
            <span className="font-bold text-primary font-mono">
              {progressPercent}% Complete
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-purple-500 to-emerald-400 transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Next Suggested Action Box */}
        {nextMilestone ? (
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-primary/15 via-white/[0.03] to-white/[0.01] border border-primary/30 flex flex-col gap-4 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-primary text-white uppercase tracking-wider flex items-center gap-1">
                  <span>👉</span>
                  <span>
                    Next Action (Step {nextMilestoneIndex} of{" "}
                    {milestones.length})
                  </span>
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getCategoryBadgeColor(nextMilestone.category)}`}
                >
                  {nextMilestone.category.toUpperCase()}
                </span>
                <span className="text-[11px] text-foreground/50 font-mono">
                  ⏱️ ~{nextMilestone.estimatedMinutes}m
                </span>
              </div>

              {nextMilestone.toolRecommendation && (
                <a
                  href={nextMilestone.toolRecommendation.url}
                  target={
                    nextMilestone.toolRecommendation.isExternal
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    nextMilestone.toolRecommendation.isExternal
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 self-start sm:self-center"
                >
                  <span>⚡ Sandbox:</span>
                  <span className="underline">
                    {nextMilestone.toolRecommendation.name}
                  </span>
                  {nextMilestone.toolRecommendation.isExternal && (
                    <span className="text-[9px]">↗</span>
                  )}
                </a>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <h4 className="text-base sm:text-lg font-bold text-white">
                {nextMilestone.title}
              </h4>
              <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
                {nextMilestone.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
              <Link
                href={nextMilestone.deepLink}
                className="bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center gap-2"
              >
                <span>{nextMilestone.linkLabel}</span>
                <span>&rarr;</span>
              </Link>

              <button
                onClick={() => togglePlanMilestone(nextMilestone.id)}
                className="text-xs font-semibold px-4 py-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-foreground/80 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30 transition-all flex items-center gap-2"
              >
                <span>✓</span>
                <span>Mark Step Complete & Advance</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-center flex flex-col items-center gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <h4 className="text-base font-bold text-emerald-300">
                Outstanding! You have completed all milestones in your
                customized plan!
              </h4>
              <p className="text-xs text-foreground/60 mt-1 max-w-md mx-auto">
                You have practiced the core foundations, design patterns, and
                case studies. You are ready to tackle senior tech interviews!
              </p>
            </div>
            <button
              onClick={() => setWizardOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md mt-1"
            >
              Generate Next Advanced Goal &rarr;
            </button>
          </div>
        )}

        {/* Collapsible Full Milestones Checklist */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={() => setShowAllMilestones((prev) => !prev)}
            className="text-xs font-semibold text-primary hover:underline self-start flex items-center gap-1.5"
          >
            <span>
              {showAllMilestones
                ? "Hide Full Curriculum Checklist ▴"
                : `View Full Curriculum Checklist (${milestones.length} milestones) ▾`}
            </span>
          </button>

          {showAllMilestones && (
            <div className="flex flex-col gap-2 rounded-2xl bg-black/40 border border-white/5 p-4 animate-in fade-in duration-200">
              {milestones.map((m, idx) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-xl border flex items-start justify-between gap-3 transition-all ${
                    m.completed
                      ? "bg-white/[0.02] border-white/5 opacity-75"
                      : "bg-white/[0.04] border-white/10"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => togglePlanMilestone(m.id)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 mt-0.5 ${
                        m.completed
                          ? "bg-emerald-500 border-emerald-500 text-white font-bold text-xs"
                          : "border-white/30 hover:border-primary"
                      }`}
                    >
                      {m.completed ? "✓" : ""}
                    </button>

                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-foreground/40 font-bold">
                          #{idx + 1}
                        </span>
                        <h5
                          className={`text-xs font-bold ${m.completed ? "line-through text-foreground/50" : "text-foreground"}`}
                        >
                          {m.title}
                        </h5>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${getCategoryBadgeColor(m.category)}`}
                        >
                          {m.category.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-foreground/50 line-clamp-1">
                        {m.subtitle}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={m.deepLink}
                    className="text-[11px] font-semibold text-primary hover:underline shrink-0 whitespace-nowrap ml-2"
                  >
                    Open &rarr;
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <PlanWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        defaultFocus={defaultFocus}
      />
    </>
  );
}
