'use client';

import Link from 'next/link';
import { useProgress } from '@/lib/useProgress';
import { CodingProblem, MarkdownDocument } from '@/lib/markdown';
import LearningPathModal from './LearningPathModal';

interface DailyPrepProps {
  todayProblem?: CodingProblem;
  todayTopic?: MarkdownDocument;
  dueCardsCount: number;
}

export default function DailyPrepWidget({ todayProblem, todayTopic, dueCardsCount }: DailyPrepProps) {
  const { progress, toggleDailyTask } = useProgress();

  const isProblemDone = progress.completedTasksToday.includes('daily-problem');
  const isQuizDone = progress.completedTasksToday.includes('daily-quiz');
  const isConceptDone = progress.completedTasksToday.includes('daily-concept');

  const completedCount = [isProblemDone, isQuizDone, isConceptDone].filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 3) * 100);

  return (
    <div className="glass-card p-6 md:p-8 border-primary/30 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Top Bar: Streak & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl">⚡</span>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              After-Work 20-Min Prep Routine
            </h2>
            <span className="bg-orange-500/20 text-orange-400 border border-orange-500/20 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
              🔥 {progress.streakCount} Day{progress.streakCount !== 1 ? 's' : ''} Streak
            </span>
            <LearningPathModal />
          </div>
          <p className="text-xs text-foreground/60 mt-1">
            Zero decision fatigue. Complete these 3 quick tasks to keep interview skills sharp.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl shrink-0">
          <div className="w-24 bg-white/10 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-primary to-green-400 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <span className="text-xs font-mono font-semibold text-foreground/80">
            {completedCount}/3 Done ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
        
        {/* TASK 1: Coding Problem */}
        <div className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
          isProblemDone ? 'bg-green-500/5 border-green-500/30' : 'bg-white/5 border-white/10 hover:border-primary/40'
        }`}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-primary/20 text-primary">
                Task 1 · Coding
              </span>
              <button 
                onClick={() => toggleDailyTask('daily-problem')}
                className={`text-xs px-2 py-0.5 rounded transition-colors ${
                  isProblemDone ? 'bg-green-500 text-black font-bold' : 'text-foreground/40 hover:text-white bg-white/5'
                }`}
              >
                {isProblemDone ? '✓ Completed' : 'Mark Done'}
              </button>
            </div>

            <h3 className="font-bold text-sm text-foreground mt-1">
              {todayProblem?.title || 'Two Sum (Arrays & Hashing)'}
            </h3>

            {todayProblem?.ahHaInsight && (
              <p className="text-[11px] text-foreground/70 bg-black/20 p-2 rounded line-clamp-2">
                💡 <span className="text-primary-dark">{todayProblem.ahHaInsight}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-2">
            <span className="text-[10px] text-foreground/40 font-mono">10-15 mins</span>
            {todayProblem?.leetcodeUrl ? (
              <a
                href={todayProblem.leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-primary hover:text-white flex items-center gap-1"
              >
                Solve on LeetCode ↗
              </a>
            ) : (
              <Link href="/coding" className="text-xs font-semibold text-primary hover:text-white">
                View in Coding Matrix →
              </Link>
            )}
          </div>
        </div>

        {/* TASK 2: Spaced Repetition Flashcards */}
        <div className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
          isQuizDone ? 'bg-green-500/5 border-green-500/30' : 'bg-white/5 border-white/10 hover:border-primary/40'
        }`}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                Task 2 · Active Recall
              </span>
              <button 
                onClick={() => toggleDailyTask('daily-quiz')}
                className={`text-xs px-2 py-0.5 rounded transition-colors ${
                  isQuizDone ? 'bg-green-500 text-black font-bold' : 'text-foreground/40 hover:text-white bg-white/5'
                }`}
              >
                {isQuizDone ? '✓ Completed' : 'Mark Done'}
              </button>
            </div>

            <h3 className="font-bold text-sm text-foreground mt-1">
              5 Due Flashcards Review
            </h3>

            <p className="text-[11px] text-foreground/65">
              Review memory cards using spaced repetition to reinforce technical definitions and interview answers.
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-2">
            <span className="text-[10px] text-foreground/40 font-mono">3-5 mins</span>
            <Link 
              href="/quiz" 
              className="text-xs font-semibold bg-primary/20 hover:bg-primary text-primary hover:text-white px-2.5 py-1 rounded transition-colors"
            >
              Start 5m Quiz →
            </Link>
          </div>
        </div>

        {/* TASK 3: Concept Capsule */}
        <div className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
          isConceptDone ? 'bg-green-500/5 border-green-500/30' : 'bg-white/5 border-white/10 hover:border-primary/40'
        }`}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">
                Task 3 · Architecture Pill
              </span>
              <button 
                onClick={() => toggleDailyTask('daily-concept')}
                className={`text-xs px-2 py-0.5 rounded transition-colors ${
                  isConceptDone ? 'bg-green-500 text-black font-bold' : 'text-foreground/40 hover:text-white bg-white/5'
                }`}
              >
                {isConceptDone ? '✓ Completed' : 'Mark Done'}
              </button>
            </div>

            <h3 className="font-bold text-sm text-foreground mt-1">
              {todayTopic?.title || 'Mobile List Virtualization & FlashList'}
            </h3>

            <p className="text-[11px] text-foreground/65 line-clamp-2">
              High-yield architectural concepts and trade-offs to speak like a Senior/Staff engineer in system design rounds.
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-2">
            <span className="text-[10px] text-foreground/40 font-mono">3 mins read</span>
            <Link 
              href={todayTopic ? `/topics#${todayTopic.id}` : '/system-design'} 
              className="text-xs font-semibold text-primary hover:text-white"
            >
              Read Capsule →
            </Link>
          </div>
        </div>

      </div>

      {/* Golden Launchpad Quick Bar */}
      <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-foreground/50">
          <span>🌐 Quick Golden Launchers:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="https://neetcode.io/practice"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold bg-white/5 hover:bg-white/10 text-foreground/80 px-2.5 py-1 rounded-lg border border-white/5 transition-colors flex items-center gap-1"
          >
            NeetCode 150 ↗
          </a>
          <a
            href="https://www.geeksforgeeks.org/explore?page=1&category=Must-Do-Coding-Questions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold bg-white/5 hover:bg-white/10 text-foreground/80 px-2.5 py-1 rounded-lg border border-white/5 transition-colors flex items-center gap-1"
          >
            GFG Must-Do ↗
          </a>
          <a
            href="https://www.freecodecamp.org/learn/coding-interview-prep/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold bg-white/5 hover:bg-white/10 text-foreground/80 px-2.5 py-1 rounded-lg border border-white/5 transition-colors flex items-center gap-1"
          >
            freeCodeCamp ↗
          </a>
          <a
            href="https://bigfrontend.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold bg-white/5 hover:bg-white/10 text-foreground/80 px-2.5 py-1 rounded-lg border border-white/5 transition-colors flex items-center gap-1"
          >
            BFE.dev ↗
          </a>
          <a
            href="https://bytebytego.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold bg-white/5 hover:bg-white/10 text-foreground/80 px-2.5 py-1 rounded-lg border border-white/5 transition-colors flex items-center gap-1"
          >
            ByteByteGo ↗
          </a>
          <Link
            href="/resources"
            className="text-[11px] font-semibold bg-primary/20 hover:bg-primary text-primary hover:text-white px-2.5 py-1 rounded-lg transition-colors"
          >
            All 25+ Resources →
          </Link>
        </div>
      </div>

    </div>
  );
}
