'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProgress } from '@/lib/useProgress';
import { CAREER_TRACKS } from '@/lib/roadmapData';
import { CodingProblem, MarkdownDocument } from '@/lib/markdown';
import PlanWizardModal from './PlanWizardModal';
import LearningPathModal from './LearningPathModal';

interface CommandCenterWidgetProps {
  todayProblem?: CodingProblem;
  todayTopic?: MarkdownDocument;
  dueCardsCount: number;
}

export default function CommandCenterWidget({
  todayProblem,
  todayTopic,
  dueCardsCount
}: CommandCenterWidgetProps) {
  const { progress, toggleDailyTask, mounted } = useProgress();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [activeTimeBudget, setActiveTimeBudget] = useState<'15m' | '30m' | '60m'>('30m');

  if (!mounted) {
    return (
      <div className="h-64 rounded-3xl bg-white/[0.02] border border-white/5 animate-pulse" />
    );
  }

  // Active track determination
  const activeTrack = CAREER_TRACKS.find(t => t.id === (progress.activeTrack || 'sde2-fullstack')) || CAREER_TRACKS[0];
  const allTasks = activeTrack.phases.flatMap(p => p.tasks);
  const completedTasks = allTasks.filter(t => !!progress.roadmapTasks[t.id]);
  const progressPercent = allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0;
  const nextRoadmapTask = allTasks.find(t => !progress.roadmapTasks[t.id]);

  // Daily task completions
  const isProblemDone = progress.completedTasksToday.includes('daily-problem');
  const isConceptDone = progress.completedTasksToday.includes('daily-concept');
  const isQuizDone = progress.completedTasksToday.includes('daily-quiz');

  const dailyDoneCount = [isProblemDone, isConceptDone, isQuizDone].filter(Boolean).length;
  const dailyPercent = Math.round((dailyDoneCount / 3) * 100);

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
                {completedTasks.length} of {allTasks.length} milestones completed ({progressPercent}%)
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

            <button
              onClick={() => setWizardOpen(true)}
              className="text-xs font-semibold text-foreground/80 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1"
            >
              <span>⚙️ Customize Plan</span>
            </button>

            <Link
              href="/roadmap"
              className="text-xs font-semibold text-primary hover:text-white px-3.5 py-1.5 rounded-xl bg-primary/10 hover:bg-primary border border-primary/20 transition-all"
            >
              Roadmap &rarr;
            </Link>
          </div>
        </div>

        {/* ─── 2. TODAY'S 3-TASK FOCUS ROUTINE ─── */}
        <div className="relative z-10 pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">🎯</span>
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                Today's Recommended Focus
              </h3>
              <span className="text-[11px] font-mono text-foreground/50">
                ({dailyDoneCount}/3 Done)
              </span>
            </div>

            {/* Time Dial Pills */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
              {(['15m', '30m', '60m'] as const).map(time => (
                <button
                  key={time}
                  onClick={() => setActiveTimeBudget(time)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                    activeTimeBudget === time
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-foreground/50 hover:text-foreground'
                  }`}
                >
                  {time === '15m' ? '⚡ 15m' : time === '30m' ? '🎯 30m' : '🚀 60m'}
                </button>
              ))}
            </div>
          </div>

          {/* 3 Tasks Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            
            {/* Task 1: Coding Problem */}
            <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
              isProblemDone 
                ? 'bg-green-500/[0.04] border-green-500/20' 
                : 'bg-white/[0.03] border-white/10 hover:border-primary/40'
            }`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">💻</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    Coding Problem
                  </span>
                </div>
                <button
                  onClick={() => toggleDailyTask('daily-problem')}
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-xs transition-all ${
                    isProblemDone
                      ? 'bg-green-500 text-black font-bold'
                      : 'border border-white/20 hover:border-white/40'
                  }`}
                  title={isProblemDone ? 'Mark as incomplete' : 'Mark as done'}
                >
                  {isProblemDone ? '✓' : ''}
                </button>
              </div>

              <div>
                <h4 className="text-sm font-bold text-foreground line-clamp-1">
                  {todayProblem?.title || 'Two Sum & Hash Maps'}
                </h4>
                <p className="text-xs text-foreground/60 mt-0.5 line-clamp-2">
                  {todayProblem?.pattern || 'Array & Hashing'} · {todayProblem?.difficulty || 'Easy'} · ~15 mins
                </p>
              </div>

              <div className="pt-1 flex items-center justify-between border-t border-white/5 text-xs">
                <Link
                  href={`/coding#${todayProblem?.id || 'two-sum'}`}
                  className="font-semibold text-primary hover:underline"
                >
                  Solve Problem &rarr;
                </Link>
                {todayProblem?.leetcodeUrl && (
                  <a
                    href={todayProblem.leetcodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/40 hover:text-foreground text-[11px]"
                  >
                    LeetCode ↗
                  </a>
                )}
              </div>
            </div>

            {/* Task 2: Architecture / System Design */}
            <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
              isConceptDone 
                ? 'bg-green-500/[0.04] border-green-500/20' 
                : 'bg-white/[0.03] border-white/10 hover:border-primary/40'
            }`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">📐</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                    System Design
                  </span>
                </div>
                <button
                  onClick={() => toggleDailyTask('daily-concept')}
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-xs transition-all ${
                    isConceptDone
                      ? 'bg-green-500 text-black font-bold'
                      : 'border border-white/20 hover:border-white/40'
                  }`}
                  title={isConceptDone ? 'Mark as incomplete' : 'Mark as done'}
                >
                  {isConceptDone ? '✓' : ''}
                </button>
              </div>

              <div>
                <h4 className="text-sm font-bold text-foreground line-clamp-1">
                  {todayTopic?.title || 'In-App Observability & ANR Monitoring SDK'}
                </h4>
                <p className="text-xs text-foreground/60 mt-0.5 line-clamp-2">
                  CADisplayLink, Choreographer & batched telemetry · ~20 mins
                </p>
              </div>

              <div className="pt-1 flex items-center justify-between border-t border-white/5 text-xs">
                <Link
                  href="/system-design"
                  className="font-semibold text-purple-400 hover:underline"
                >
                  Read Blueprint &rarr;
                </Link>
                <span className="text-foreground/40 text-[11px]">Architecture</span>
              </div>
            </div>

            {/* Task 3: Active Recall / Behavioral */}
            <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
              isQuizDone 
                ? 'bg-green-500/[0.04] border-green-500/20' 
                : 'bg-white/[0.03] border-white/10 hover:border-primary/40'
            }`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">⚡</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    Active Recall
                  </span>
                </div>
                <button
                  onClick={() => toggleDailyTask('daily-quiz')}
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-xs transition-all ${
                    isQuizDone
                      ? 'bg-green-500 text-black font-bold'
                      : 'border border-white/20 hover:border-white/40'
                  }`}
                  title={isQuizDone ? 'Mark as incomplete' : 'Mark as done'}
                >
                  {isQuizDone ? '✓' : ''}
                </button>
              </div>

              <div>
                <h4 className="text-sm font-bold text-foreground line-clamp-1">
                  Flashcard Drill &amp; STAR Story
                </h4>
                <p className="text-xs text-foreground/60 mt-0.5 line-clamp-2">
                  Spaced repetition drill ({dueCardsCount || 10} cards due) · ~5-10 mins
                </p>
              </div>

              <div className="pt-1 flex items-center justify-between border-t border-white/5 text-xs">
                <Link
                  href="/quiz"
                  className="font-semibold text-amber-400 hover:underline"
                >
                  Start Flashcards &rarr;
                </Link>
                <Link
                  href="/stories"
                  className="text-foreground/40 hover:text-foreground text-[11px]"
                >
                  STAR Stories ↗
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
              Commute listening: Generate 15-min audio overview podcasts from your notes with NotebookLM.
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

      <PlanWizardModal isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
    </>
  );
}
