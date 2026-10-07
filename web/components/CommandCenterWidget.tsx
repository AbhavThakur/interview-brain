"use client";

import { useState } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/useProgress";
import { CAREER_TRACKS } from "@/lib/roadmapData";
import { getDailyExecutionPlan } from "@/lib/dailyExecution";
import PlanWizardModal from "./PlanWizardModal";

export default function CommandCenterWidget() {
  const { progress, toggleDailyTask, mounted } = useProgress();
  const [wizardOpen, setWizardOpen] = useState(false);

  if (!mounted) {
    return (
      <div className="h-64 rounded-3xl bg-white/[0.02] border border-white/5 animate-pulse" />
    );
  }

  // Active track determination
  const activeTrack =
    CAREER_TRACKS.find(
      (t) => t.id === (progress.activeTrack || "sde2-fullstack"),
    ) || CAREER_TRACKS[0];
  const allTasks = activeTrack.phases.flatMap((p) => p.tasks);
  const completedTasks = allTasks.filter((t) => !!progress.roadmapTasks[t.id]);
  const progressPercent =
    allTasks.length > 0
      ? Math.round((completedTasks.length / allTasks.length) * 100)
      : 0;
  // Daily task completions
  const isProblemDone = progress.completedTasksToday.includes("daily-problem");
  const isConceptDone = progress.completedTasksToday.includes("daily-concept");
  const isQuizDone = progress.completedTasksToday.includes("daily-quiz");

  const dailyDoneCount = [isProblemDone, isConceptDone, isQuizDone].filter(
    Boolean,
  ).length;

  // Dynamic Daily Execution Engine Plan based on user's real progress
  const dailyPlan = getDailyExecutionPlan(
    progress.codingStatus,
    progress.completedTasksToday
  );

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-white/[0.02] to-black border border-primary/25 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
        {/* Subtle Ambient Top-Right Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        {/* ─── 1. HEADER ROW: Track, Progress, & Streak ─── */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-primary/20 border border-primary/30 text-primary flex items-center justify-center text-xl shrink-0 shadow-inner">
              {activeTrack.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 uppercase tracking-wider">
                  Active Sprint
                </span>
                <span className="text-xs font-bold text-foreground">
                  {activeTrack.title}
                </span>
              </div>
              <p className="text-xs text-foreground/60 mt-0.5">
                {completedTasks.length} of {allTasks.length} milestones
                completed ({progressPercent}%)
              </p>
            </div>
          </div>

          {/* Actions & Streak */}
          <div className="flex items-center gap-2.5 self-start md:self-center flex-wrap">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold"
              title={`${progress.streakCount} day study streak!`}
            >
              <span>🔥</span>
              <span>{progress.streakCount}d Streak</span>
            </div>

            <Link
              href="/focus"
              className="text-xs font-bold text-white bg-primary/25 hover:bg-primary/40 border border-primary/40 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
            >
              <span>🎯 Focus Engine</span>
              <span>&rarr;</span>
            </Link>

            <button
              onClick={() => setWizardOpen(true)}
              className="text-xs font-semibold text-foreground/80 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1"
            >
              <span>⚙️ Plan</span>
            </button>
          </div>
        </div>

        {/* ─── 2. TODAY'S 3-TASK FOCUS ROUTINE ─── */}
        <div className="relative z-10 pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">🎯</span>
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                Today&apos;s Focus: {dailyPlan.dayOfWeek} Queue
              </h3>
              <span className="text-[11px] font-mono text-foreground/50">
                ({dailyDoneCount}/3 Done)
              </span>
            </div>

            {/* Link to Dedicated Focus Page */}
            <Link
              href="/focus"
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              <span>Timer &amp; Full View &rarr;</span>
            </Link>
          </div>

          {/* 3 Tasks Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {/* Task 1: Next Unsolved Coding Problem */}
            <div
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                isProblemDone
                  ? "bg-green-500/[0.04] border-green-500/20"
                  : "bg-white/[0.03] border-white/10 hover:border-primary/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">💻</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    Coding (45m)
                  </span>
                </div>
                <button
                  onClick={() => toggleDailyTask("daily-problem")}
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-xs transition-all ${
                    isProblemDone
                      ? "bg-green-500 text-black font-bold"
                      : "border border-white/20 hover:border-white/40"
                  }`}
                  title={isProblemDone ? "Mark as incomplete" : "Mark as done"}
                >
                  {isProblemDone ? "✓" : ""}
                </button>
              </div>

              <div>
                <h4 className="text-sm font-bold text-foreground line-clamp-1">
                  {dailyPlan.coding.problem.title}
                </h4>
                <p className="text-xs text-foreground/60 mt-0.5 line-clamp-2">
                  {dailyPlan.coding.problem.pattern} ·{" "}
                  {dailyPlan.coding.problem.difficulty} · #{dailyPlan.coding.problem.order}
                </p>
              </div>

              <div className="pt-1 flex items-center justify-between border-t border-white/5 text-xs">
                <Link
                  href={dailyPlan.coding.practiceUrl}
                  className="font-semibold text-primary hover:underline"
                >
                  Solve in Editor &rarr;
                </Link>
                {dailyPlan.coding.leetcodeUrl && (
                  <a
                    href={dailyPlan.coding.leetcodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/40 hover:text-foreground text-[11px]"
                  >
                    LeetCode ↗
                  </a>
                )}
              </div>
            </div>

            {/* Task 2: Architecture / System Design Blueprint */}
            <div
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                isConceptDone
                  ? "bg-green-500/[0.04] border-green-500/20"
                  : "bg-white/[0.03] border-white/10 hover:border-primary/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">📐</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                    System Design (30m)
                  </span>
                </div>
                <button
                  onClick={() => toggleDailyTask("daily-concept")}
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-xs transition-all ${
                    isConceptDone
                      ? "bg-green-500 text-black font-bold"
                      : "border border-white/20 hover:border-white/40"
                  }`}
                  title={isConceptDone ? "Mark as incomplete" : "Mark as done"}
                >
                  {isConceptDone ? "✓" : ""}
                </button>
              </div>

              <div>
                <h4 className="text-sm font-bold text-foreground line-clamp-1">
                  {dailyPlan.systemDesign.title}
                </h4>
                <p className="text-xs text-foreground/60 mt-0.5 line-clamp-2">
                  {dailyPlan.systemDesign.category} · {dailyPlan.systemDesign.focusArea}
                </p>
              </div>

              <div className="pt-1 flex items-center justify-between border-t border-white/5 text-xs">
                <Link
                  href={dailyPlan.systemDesign.url}
                  className="font-semibold text-purple-400 hover:underline"
                >
                  Read Blueprint &rarr;
                </Link>
                <span className="text-foreground/40 text-[11px]">
                  Architecture
                </span>
              </div>
            </div>

            {/* Task 3: Behavioral STAR Drill */}
            <div
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                isQuizDone
                  ? "bg-green-500/[0.04] border-green-500/20"
                  : "bg-white/[0.03] border-white/10 hover:border-primary/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">🗣️</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    STAR Drill (15m)
                  </span>
                </div>
                <button
                  onClick={() => toggleDailyTask("daily-quiz")}
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-xs transition-all ${
                    isQuizDone
                      ? "bg-green-500 text-black font-bold"
                      : "border border-white/20 hover:border-white/40"
                  }`}
                  title={isQuizDone ? "Mark as incomplete" : "Mark as done"}
                >
                  {isQuizDone ? "✓" : ""}
                </button>
              </div>

              <div>
                <h4 className="text-sm font-bold text-foreground line-clamp-1">
                  {dailyPlan.behavioral.targetPrinciple}
                </h4>
                <p className="text-xs text-foreground/60 mt-0.5 line-clamp-2">
                  &ldquo;{dailyPlan.behavioral.question.question}&rdquo;
                </p>
              </div>

              <div className="pt-1 flex items-center justify-between border-t border-white/5 text-xs">
                <Link
                  href={dailyPlan.behavioral.url}
                  className="font-semibold text-amber-400 hover:underline"
                >
                  Practice Verbal &rarr;
                </Link>
                <Link
                  href="/stories"
                  className="text-foreground/40 hover:text-foreground text-[11px]"
                >
                  STAR Bank ↗
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 3. SUBTLE PODCAST & NOTEBOOKLM FOOTER ─── */}
        <div className="relative z-10 mt-5 pt-3.5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-foreground/60">
          <div className="flex items-center gap-2">
            <span className="text-sm">🎙️</span>
            <span>
              Commute listening: Generate 15-min audio overview podcasts from
              your notes with NotebookLM.
            </span>
          </div>
          <Link
            href="/notebooklm"
            className="text-primary hover:text-white font-bold flex items-center gap-1 shrink-0"
          >
            <span>Launch AI Hub</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>

      <PlanWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
      />
    </>
  );
}
