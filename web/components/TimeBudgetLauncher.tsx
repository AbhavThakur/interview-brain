'use client';

import { useState } from 'react';
import Link from 'next/link';

interface QuickAction {
  id: string;
  time: string;
  timeMinutes: number;
  emoji: string;
  title: string;
  subtitle: string;
  tag: string;
  badgeStyle: string;
  actionText: string;
  href: string;
  modalType?: 'quiz' | 'none';
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'mode-5m',
    time: '5 Mins',
    timeMinutes: 5,
    emoji: '☕',
    title: 'Coffee Break Flash Drill',
    subtitle: '1 rapid latency or event loop question to lock in fast-recall muscle memory.',
    tag: 'Fast Recall',
    badgeStyle: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    actionText: 'Start 5-Min Quiz',
    href: '/quiz',
    modalType: 'quiz'
  },
  {
    id: 'mode-15m',
    time: '15 Mins',
    timeMinutes: 15,
    emoji: '🎧',
    title: 'Commute Audio Podcast',
    subtitle: 'Stream a 12–15 min 2-host conversational architecture podcast in NotebookLM.',
    tag: 'Hands-Free',
    badgeStyle: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    actionText: 'Open Audio Hub',
    href: '/notebooklm'
  },
  {
    id: 'mode-30m',
    time: '30 Mins',
    timeMinutes: 30,
    emoji: '🎯',
    title: 'Grind 75 Problem Solve',
    subtitle: 'Tackle 1 high-frequency algorithm problem with Ah-Ha mental model hints.',
    tag: 'Hands-On',
    badgeStyle: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    actionText: 'Solve Problem',
    href: '/grind75'
  },
  {
    id: 'mode-60m',
    time: '60 Mins',
    timeMinutes: 60,
    emoji: '🏗️',
    title: 'Whiteboard HLD Blueprint',
    subtitle: 'End-to-end distributed system case study (TinyURL, Twitter Feed, or Web Crawler).',
    tag: 'Deep Dive',
    badgeStyle: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    actionText: 'Study Blueprint',
    href: '/system-design'
  }
];

const QUICK_FLASH_QUESTIONS = [
  {
    q: 'What is the standard latency comparison between L1 cache reference, Main Memory (RAM), and SSD read?',
    a: 'L1 Cache: ~0.5 - 1 ns | Main Memory (RAM): ~100 ns (100x slower) | SSD Read: ~16,000 ns / 16 µs (160x slower than RAM) | Cross-Datacenter RTT: ~150 ms.'
  },
  {
    q: 'In JavaScript, what is the exact execution priority between Synchronous code, Microtasks, Render, and Macrotasks?',
    a: '1. Synchronous Call Stack -> 2. Microtask Queue (Promises, queueMicrotask, process.nextTick) -> 3. requestAnimationFrame / Render -> 4. Macrotask Queue (setTimeout, setInterval, I/O).'
  },
  {
    q: 'Why does Fan-out on Write fail for celebrity users (e.g. 50M followers) on Twitter/X?',
    a: 'Writing a single tweet would require inserting 50M records into 50M follower Redis timelines simultaneously, overwhelming the database write throughput. Solution: Hybrid Fan-out on Read for celebrities with >500k followers.'
  }
];

export default function TimeBudgetLauncher() {
  const [selectedMode, setSelectedMode] = useState<string>('mode-15m');
  const [quizOpen, setQuizOpen] = useState<boolean>(false);
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const activeAction = QUICK_ACTIONS.find(a => a.id === selectedMode) || QUICK_ACTIONS[1];

  const handleNextQuiz = () => {
    setShowAnswer(false);
    setCurrentQuizIdx((prev) => (prev + 1) % QUICK_FLASH_QUESTIONS.length);
  };

  return (
    <div className="glass-card p-6 sm:p-8 flex flex-col gap-6 border-white/10 relative overflow-hidden">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 uppercase tracking-wider">
              ⚡ How Much Time Do You Have Right Now?
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Time-Budget Quick Launcher
          </h2>
          <p className="text-xs text-foreground/60 mt-0.5">
            Pick your available time window to jump straight into high-yield micro-learning with zero setup.
          </p>
        </div>

        {/* Time Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/5 shrink-0">
          {QUICK_ACTIONS.map(action => (
            <button
              key={action.id}
              onClick={() => setSelectedMode(action.id)}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedMode === action.id
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-foreground/60 hover:text-foreground hover:bg-white/5'
              }`}
            >
              <span>{action.emoji}</span>
              <span>{action.time}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Mode Banner */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0">
            {activeAction.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${activeAction.badgeStyle}`}>
                {activeAction.tag}
              </span>
              <span className="text-xs text-foreground/40 font-mono">
                ⏱️ {activeAction.time} Budget
              </span>
            </div>
            <h3 className="text-base font-bold text-foreground mt-1">
              {activeAction.title}
            </h3>
            <p className="text-xs text-foreground/70 mt-0.5 leading-relaxed max-w-xl">
              {activeAction.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          {activeAction.modalType === 'quiz' ? (
            <button
              onClick={() => {
                setQuizOpen(true);
                setShowAnswer(false);
              }}
              className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center gap-1.5"
            >
              <span>⚡ Start 5-Min Quiz</span>
            </button>
          ) : (
            <Link
              href={activeAction.href}
              className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center gap-1.5"
            >
              <span>{activeAction.actionText} &rarr;</span>
            </Link>
          )}
        </div>
      </div>

      {/* 5-Min Quick Quiz Modal */}
      {quizOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="glass-card max-w-lg w-full p-6 sm:p-8 flex flex-col gap-5 border-primary/30 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">☕</span>
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                    Question {currentQuizIdx + 1} of {QUICK_FLASH_QUESTIONS.length}
                  </span>
                  <h3 className="text-base font-bold text-foreground mt-0.5">5-Minute Flash Recall Drill</h3>
                </div>
              </div>

              <button
                onClick={() => setQuizOpen(false)}
                className="text-foreground/40 hover:text-white text-sm p-1.5 rounded-lg hover:bg-white/5"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider block mb-1">
                Question:
              </span>
              <p className="text-sm font-semibold text-foreground leading-relaxed">
                {QUICK_FLASH_QUESTIONS[currentQuizIdx].q}
              </p>
            </div>

            {showAnswer ? (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 animate-in fade-in duration-200">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">
                  💡 Answer & Key Mental Model:
                </span>
                <p className="text-xs text-foreground/90 leading-relaxed font-mono">
                  {QUICK_FLASH_QUESTIONS[currentQuizIdx].a}
                </p>
              </div>
            ) : (
              <button
                onClick={() => setShowAnswer(true)}
                className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-foreground border border-white/10 text-xs font-semibold transition-all text-center"
              >
                👁️ Reveal Answer
              </button>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <Link
                href="/quiz"
                onClick={() => setQuizOpen(false)}
                className="text-xs text-primary hover:underline"
              >
                Open Full Flashcard Deck (20+ cards) &rarr;
              </Link>

              <button
                onClick={handleNextQuiz}
                className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
              >
                Next Question &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
