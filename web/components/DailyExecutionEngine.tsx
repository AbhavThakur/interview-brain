"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/useProgress";
import { getDailyExecutionPlan } from "@/lib/dailyExecution";

export default function DailyExecutionEngine() {
  const { progress, toggleDailyTask, setProblemStatus, mounted } = useProgress();

  // Selected time budget
  const [timeBudget, setTimeBudget] = useState<"45m" | "90m" | "120m">("90m");
  
  // Focus Timer state (in seconds)
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(90 * 60);

  // Coding controls: difficulty filter & shuffle
  const [difficultyFilter, setDifficultyFilter] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [shuffleOffset, setShuffleOffset] = useState<number>(0);

  // Derive execution plan
  const plan = useMemo(() => {
    return getDailyExecutionPlan(
      progress.codingStatus,
      progress.completedTasksToday,
      { difficultyFilter, shuffleOffset }
    );
  }, [progress.codingStatus, progress.completedTasksToday, difficultyFilter, shuffleOffset]);

  // Adjust timer when budget is selected
  const handleSelectBudget = (b: "45m" | "90m" | "120m") => {
    setTimeBudget(b);
    const minutes = b === "45m" ? 45 : b === "90m" ? 90 : 120;
    setSecondsLeft(minutes * 60);
    setTimerRunning(false);
  };

  // Timer countdown interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, secondsLeft]);

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-44 rounded-3xl bg-white/[0.03] border border-white/5" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-64 rounded-2xl bg-white/[0.03] border border-white/5" />
          <div className="h-64 rounded-2xl bg-white/[0.03] border border-white/5" />
          <div className="h-64 rounded-2xl bg-white/[0.03] border border-white/5" />
        </div>
      </div>
    );
  }

  const isProblemDone = progress.completedTasksToday.includes("daily-problem") || plan.coding.isCompleted;
  const isSysDesignDone = progress.completedTasksToday.includes("daily-concept");
  const isBehavioralDone = progress.completedTasksToday.includes("daily-quiz");

  const completedCount = [isProblemDone, isSysDesignDone, isBehavioralDone].filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 3) * 100);

  const handleMarkProblemSolved = () => {
    toggleDailyTask("daily-problem");
    if (!plan.coding.isCompleted) {
      setProblemStatus(plan.coding.problem.id, "solved");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
      
      {/* ─── HERO BANNER: Today's Command Directive ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-purple-950/20 to-black border border-primary/30 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Daily Execution Engine
              </span>
              <span className="text-xs font-mono text-foreground/60">
                {plan.formattedDate}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold flex items-center gap-1">
                🔥 {progress.streakCount}d Streak
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Today is {plan.dayOfWeek}: Follow Your 3-Block Queue
            </h1>

            <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
              Zero decision fatigue. Your queue has automatically selected your next uncompleted Grind 75 algorithm, today&apos;s architecture blueprint, and one high-priority STAR story.
            </p>
          </div>

          {/* Time Budget Selector & Focus Timer */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
              {(["45m", "90m", "120m"] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => handleSelectBudget(b)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                    timeBudget === b
                      ? "bg-primary text-white shadow"
                      : "text-foreground/50 hover:text-white"
                  }`}
                >
                  {b === "45m" ? "⚡ 45m Express" : b === "90m" ? "🎯 90m Standard" : "🚀 120m Deep"}
                </button>
              ))}
            </div>

            {/* Quick Session Timer Widget */}
            <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-black/40 border border-white/10">
              <div className="text-left font-mono">
                <div className="text-[9px] text-foreground/40 uppercase tracking-wider">Session Timer</div>
                <div className={`text-base font-extrabold ${secondsLeft === 0 ? "text-emerald-400" : "text-white"}`}>
                  {formatTimer(secondsLeft)}
                </div>
              </div>
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  timerRunning
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30"
                    : "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
                }`}
              >
                {timerRunning ? "Pause" : secondsLeft === 0 ? "Restart" : "Start"}
              </button>
              <button
                onClick={() => {
                  setTimerRunning(false);
                  const mins = timeBudget === "45m" ? 45 : timeBudget === "90m" ? 90 : 120;
                  setSecondsLeft(mins * 60);
                }}
                className="text-[11px] text-foreground/40 hover:text-foreground/80 px-1"
                title="Reset timer"
              >
                ↺
              </button>
            </div>
          </div>
        </div>

        {/* Daily Completion Meter */}
        <div className="mt-6 pt-5 border-t border-white/10 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-white">
              Daily Progress: {completedCount} of 3 Blocks Completed ({progressPercent}%)
            </span>
            {completedCount === 3 && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                🎉 Daily Goal Achieved!
              </span>
            )}
          </div>
          <div className="w-full sm:w-64 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ─── THE 3 DAILY EXECUTION BLOCKS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* BLOCK 1: CODING ALGORITHM */}
        <div
          className={`flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 relative overflow-hidden ${
            isProblemDone
              ? "bg-emerald-950/10 border-emerald-500/30 shadow-lg"
              : "bg-white/[0.02] border-white/10 hover:border-primary/40 hover:bg-white/[0.04]"
          }`}
        >
          <div className="space-y-4">
            {/* Header / Type & Controls */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-lg">💻</span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                  Block 1 · Coding (45m)
                </span>
              </div>
              
              <div className="flex items-center gap-1.5">
                {/* Shuffle / Skip button */}
                <button
                  onClick={() => setShuffleOffset((prev) => prev + 1)}
                  className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-foreground/70 hover:text-white border border-white/10 text-[10px] font-bold flex items-center gap-1 transition-all"
                  title="Skip to next problem in sequence"
                >
                  <span>🎲</span>
                  <span>Skip</span>
                </button>

                <button
                  onClick={handleMarkProblemSolved}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                    isProblemDone
                      ? "bg-emerald-500 text-black shadow-md"
                      : "border border-white/20 hover:border-primary/60 text-transparent hover:text-white/40"
                  }`}
                  title={isProblemDone ? "Mark incomplete" : "Mark completed"}
                >
                  ✓
                </button>
              </div>
            </div>

            {/* Difficulty Filter Bar */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-foreground/40">Difficulty:</span>
              <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/5 text-[10px]">
                {(["All", "Easy", "Medium", "Hard"] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => {
                      setDifficultyFilter(diff);
                      setShuffleOffset(0);
                    }}
                    className={`px-2 py-0.5 rounded font-bold transition-all ${
                      difficultyFilter === diff
                        ? "bg-primary text-white shadow-xs"
                        : "text-foreground/50 hover:text-white"
                    }`}
                  >
                    {diff === "Medium" ? "Med" : diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Problem Title & Stats */}
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    plan.coding.problem.difficulty === "Easy"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : plan.coding.problem.difficulty === "Medium"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }`}
                >
                  {plan.coding.problem.difficulty}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-foreground/70">
                  {plan.coding.problem.pattern}
                </span>
                <span className="text-[10px] text-foreground/40 font-mono">
                  Grind 75 #{plan.coding.problem.order}
                </span>
              </div>
              
              <h3 className="text-base font-bold text-white leading-snug">
                {plan.coding.problem.title}
              </h3>
            </div>

            {/* Mental Model / Ah-ha insight */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-foreground/75 leading-relaxed">
              <div className="text-[10px] font-bold uppercase tracking-wider text-primary/80 mb-1 flex items-center gap-1">
                <span>💡</span> Key Intuition
              </div>
              {plan.coding.problem.ahHaInsight}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between gap-2">
            <Link
              href={plan.coding.practiceUrl}
              className="text-xs font-bold text-white bg-primary/20 hover:bg-primary/30 border border-primary/40 px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
            >
              <span>Practice in Editor</span>
              <span>&rarr;</span>
            </Link>
            {plan.coding.leetcodeUrl && (
              <a
                href={plan.coding.leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-foreground/50 hover:text-white underline underline-offset-2"
              >
                LeetCode ↗
              </a>
            )}
          </div>
        </div>

        {/* BLOCK 2: SYSTEM DESIGN BLUEPRINT */}
        <div
          className={`flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 relative overflow-hidden ${
            isSysDesignDone
              ? "bg-emerald-950/10 border-emerald-500/30 shadow-lg"
              : "bg-white/[0.02] border-white/10 hover:border-purple-400/40 hover:bg-white/[0.04]"
          }`}
        >
          <div className="space-y-4">
            {/* Header / Type */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">📐</span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400">
                  Block 2 · System Design (30m)
                </span>
              </div>
              <button
                onClick={() => toggleDailyTask("daily-concept")}
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                  isSysDesignDone
                    ? "bg-emerald-500 text-black shadow-md"
                    : "border border-white/20 hover:border-purple-400/60 text-transparent hover:text-white/40"
                }`}
                title={isSysDesignDone ? "Mark incomplete" : "Mark completed"}
              >
                ✓
              </button>
            </div>

            {/* Blueprint Title & Category */}
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {plan.systemDesign.category}
                </span>
                <span className="text-[10px] font-mono text-foreground/40">
                  {plan.systemDesign.focusArea}
                </span>
              </div>
              <h3 className="text-base font-bold text-white leading-snug">
                {plan.systemDesign.title}
              </h3>
            </div>

            {/* Key Architectural Talking Points */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5 text-xs text-foreground/75">
              <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-1 flex items-center gap-1">
                <span>🎯</span> Talking Points to Trace
              </div>
              {plan.systemDesign.keyDiscussionPoints.map((pt, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[11px] leading-tight">
                  <span className="text-purple-400/60 font-mono">•</span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between gap-2">
            <Link
              href={plan.systemDesign.url}
              className="text-xs font-bold text-white bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
            >
              <span>Read Architecture Doc</span>
              <span>&rarr;</span>
            </Link>
            <span className="text-[11px] text-foreground/40 font-mono">
              30 mins
            </span>
          </div>
        </div>

        {/* BLOCK 3: BEHAVIORAL STAR DRILL */}
        <div
          className={`flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 relative overflow-hidden ${
            isBehavioralDone
              ? "bg-emerald-950/10 border-emerald-500/30 shadow-lg"
              : "bg-white/[0.02] border-white/10 hover:border-amber-400/40 hover:bg-white/[0.04]"
          }`}
        >
          <div className="space-y-4">
            {/* Header / Type */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🗣️</span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  Block 3 · STAR Drill (15m)
                </span>
              </div>
              <button
                onClick={() => toggleDailyTask("daily-quiz")}
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                  isBehavioralDone
                    ? "bg-emerald-500 text-black shadow-md"
                    : "border border-white/20 hover:border-amber-400/60 text-transparent hover:text-white/40"
                }`}
                title={isBehavioralDone ? "Mark incomplete" : "Mark completed"}
              >
                ✓
              </button>
            </div>

            {/* Principle & Category */}
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {plan.behavioral.targetPrinciple}
                </span>
                <span className="text-[10px] font-mono text-foreground/40">
                  {plan.behavioral.question.category}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-white leading-snug line-clamp-3">
                &ldquo;{plan.behavioral.question.question}&rdquo;
              </h3>
            </div>

            {/* Verbalization Prompt */}
            <div className="p-3 rounded-xl bg-amber-500/[0.05] border border-amber-500/15 text-xs text-foreground/80 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <span>🎙️</span> Practice Out Loud (3 Mins)
              </div>
              <p className="text-[11px] text-foreground/70 leading-relaxed">
                Describe the <strong>Situation</strong>, the engineering <strong>Task</strong>, your specific <strong>Action</strong> with data, and the measurable business <strong>Result</strong>.
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between gap-2">
            <Link
              href={plan.behavioral.url}
              className="text-xs font-bold text-white bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
            >
              <span>View STAR Bank</span>
              <span>&rarr;</span>
            </Link>
            <span className="text-[11px] text-foreground/40 font-mono">
              15 mins
            </span>
          </div>
        </div>

      </div>

      {/* ─── 45-DAY CONSISTENCY CHECKLIST BANNER ─── */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-foreground/60">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div>
            <div className="font-bold text-foreground text-sm">
              The 90-Minute Daily Execution Rule
            </div>
            <div>
              Stick to 45m LeetCode + 30m Architecture + 15m STAR. Avoid opening new tabs or endless tutorial watching.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/grind75"
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors"
          >
            Grind 75 Matrix
          </Link>
          <Link
            href="/system-design"
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors"
          >
            All Blueprints
          </Link>
        </div>
      </div>

    </div>
  );
}
