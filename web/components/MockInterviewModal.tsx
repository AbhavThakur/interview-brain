'use client';

import React, { useState } from 'react';
import { PracticeProblem } from './CodePracticeArena';
import { LeetCodeSolution } from '@/lib/leetcodeSolutions';
import { ClassicAlgorithm } from '@/lib/classicAlgorithms';
import { CodingProblem } from '@/lib/markdown';

interface MockInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartMock: (problem: PracticeProblem) => void;
  patterns?: CodingProblem[];
  allSolutions?: LeetCodeSolution[];
  classicAlgorithms?: ClassicAlgorithm[];
  solvedIds?: (string | number)[];
}

export default function MockInterviewModal({
  isOpen,
  onClose,
  onStartMock,
  patterns = [],
  allSolutions = [],
  classicAlgorithms = [],
  solvedIds = []
}: MockInterviewModalProps) {
  const [track, setTrack] = useState<'polyfills' | 'patterns' | 'classic' | 'all'>('patterns');
  const [difficulty, setDifficulty] = useState<'Any' | 'Easy' | 'Medium' | 'Hard'>('Medium');
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [unsolvedOnly, setUnsolvedOnly] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleLaunch = () => {
    let pool: PracticeProblem[] = [];

    if (track === 'polyfills') {
      const polyfills = classicAlgorithms.filter(a => a.category === 'JavaScript Polyfills');
      pool = polyfills.map(a => ({
        id: a.id,
        title: a.title,
        slug: a.id,
        difficulty: a.difficulty,
        category: a.category,
        timeComplexity: a.timeComplexity,
        spaceComplexity: a.spaceComplexity,
        problemText: a.readme || `# ${a.title}\n\nTime: ${a.timeComplexity}\nSpace: ${a.spaceComplexity}`,
        solutionCode: a.code,
        starterCode: a.starterCode,
        entryFunction: a.entryFunction,
        testCases: a.testCases.map((tc, idx) => ({ id: tc.id || `tc-${idx + 1}`, ...tc })),
        isMockMode: true,
        initialTimerMinutes: durationMinutes
      }));
    } else if (track === 'classic') {
      const algos = classicAlgorithms.filter(a => a.category !== 'JavaScript Polyfills');
      pool = algos.map(a => ({
        id: a.id,
        title: a.title,
        slug: a.id,
        difficulty: a.difficulty,
        category: a.category,
        timeComplexity: a.timeComplexity,
        spaceComplexity: a.spaceComplexity,
        problemText: a.readme || `# ${a.title}\n\nTime: ${a.timeComplexity}\nSpace: ${a.spaceComplexity}`,
        solutionCode: a.code,
        starterCode: a.starterCode,
        entryFunction: a.entryFunction,
        testCases: a.testCases.map((tc, idx) => ({ id: tc.id || `tc-${idx + 1}`, ...tc })),
        isMockMode: true,
        initialTimerMinutes: durationMinutes
      }));
    } else if (track === 'patterns') {
      pool = patterns.map(p => {
        // Try to match with solution if available
        const matched = allSolutions.find(s => s.slug === p.id || s.title.toLowerCase() === p.title.toLowerCase());
        return {
          id: p.id,
          title: p.title,
          slug: p.id,
          difficulty: (p.difficulty === 'Hard' ? 'Hard' : p.difficulty === 'Easy' ? 'Easy' : 'Medium') as 'Easy' | 'Medium' | 'Hard',
          category: p.pattern || p.group,
          timeComplexity: p.timeComplexity,
          spaceComplexity: p.spaceComplexity,
          problemText: p.content,
          solutionCode: matched?.solutionCode || '',
          leetcodeUrl: p.leetcodeUrl,
          isMockMode: true,
          initialTimerMinutes: durationMinutes
        };
      });
    } else {
      // All 500+ LeetCode solutions
      pool = allSolutions.map(s => ({
        id: s.id,
        title: s.title,
        slug: s.slug,
        difficulty: s.difficulty,
        category: s.topics?.[0] || 'General',
        topics: s.topics,
        timeComplexity: s.timeComplexity,
        spaceComplexity: s.spaceComplexity,
        problemText: s.problemText,
        solutionCode: s.solutionCode,
        leetcodeUrl: s.leetcodeUrl,
        isMockMode: true,
        initialTimerMinutes: durationMinutes
      }));
    }

    // Filter by difficulty if specified
    if (difficulty !== 'Any') {
      const filteredByDiff = pool.filter(p => p.difficulty === difficulty);
      if (filteredByDiff.length > 0) {
        pool = filteredByDiff;
      }
    }

    // Filter by unsolved only if specified
    if (unsolvedOnly) {
      const unsolved = pool.filter(p => !solvedIds.includes(p.id));
      if (unsolved.length > 0) {
        pool = unsolved;
      }
    }

    if (pool.length === 0) {
      alert('No problems found matching these criteria. Please adjust filters.');
      return;
    }

    // Random selection
    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];

    onStartMock({
      ...chosen,
      isMockMode: true,
      initialTimerMinutes: durationMinutes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-2xl bg-[#0c1017] border border-white/15 p-6 shadow-2xl relative space-y-6 text-foreground"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              ⏱️
            </span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Mock Technical Interview Simulator
              </h2>
              <p className="text-xs text-foreground/60">
                Simulate a real FAANG/tier-1 technical interview round under timed conditions.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-foreground/40 hover:text-white transition-colors text-lg p-1.5 rounded-lg hover:bg-white/5"
          >
            ✕
          </button>
        </div>

        {/* Track Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider block">
            1. Select Focus Domain
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setTrack('patterns')}
              className={`p-3 rounded-xl border text-left transition-all ${
                track === 'patterns'
                  ? 'bg-primary/20 border-primary text-white font-semibold shadow-md shadow-primary/10'
                  : 'bg-white/5 border-white/5 text-foreground/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="font-bold mb-0.5">🎯 Blind / Grind 75</div>
              <div className="text-[11px] opacity-70">Curated high-frequency interview blueprints</div>
            </button>

            <button
              type="button"
              onClick={() => setTrack('polyfills')}
              className={`p-3 rounded-xl border text-left transition-all ${
                track === 'polyfills'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-semibold shadow-md shadow-amber-500/10'
                  : 'bg-white/5 border-white/5 text-foreground/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="font-bold mb-0.5">📱 JS Polyfills & Utilities</div>
              <div className="text-[11px] opacity-70">Debounce, Promise.all, DeepClone, EventEmitter</div>
            </button>

            <button
              type="button"
              onClick={() => setTrack('classic')}
              className={`p-3 rounded-xl border text-left transition-all ${
                track === 'classic'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 font-semibold shadow-md shadow-cyan-500/10'
                  : 'bg-white/5 border-white/5 text-foreground/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="font-bold mb-0.5">🏛️ Classic CS Algorithms</div>
              <div className="text-[11px] opacity-70">LRU Cache, Trie, Quicksort, Dijkstra, DP</div>
            </button>

            <button
              type="button"
              onClick={() => setTrack('all')}
              className={`p-3 rounded-xl border text-left transition-all ${
                track === 'all'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-semibold shadow-md shadow-emerald-500/10'
                  : 'bg-white/5 border-white/5 text-foreground/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="font-bold mb-0.5">🌐 All 500+ LeetCode</div>
              <div className="text-[11px] opacity-70">Full database random problem pool</div>
            </button>
          </div>
        </div>

        {/* Difficulty & Time Configuration */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider block">
              2. Target Difficulty
            </label>
            <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 text-xs">
              {(['Any', 'Easy', 'Medium', 'Hard'] as const).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                    difficulty === d
                      ? 'bg-white/20 text-white font-bold shadow'
                      : 'text-foreground/50 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider block">
              3. Interview Duration
            </label>
            <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 text-xs">
              {[
                { min: 15, label: '15m' },
                { min: 30, label: '30m' },
                { min: 45, label: '45m' }
              ].map(t => (
                <button
                  key={t.min}
                  type="button"
                  onClick={() => setDurationMinutes(t.min)}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                    durationMinutes === t.min
                      ? 'bg-amber-500 text-black font-bold shadow'
                      : 'text-foreground/50 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={unsolvedOnly}
              onChange={e => setUnsolvedOnly(e.target.checked)}
              className="rounded border-white/20 text-amber-500 focus:ring-0 bg-transparent"
            />
            <span className="text-foreground/80">Prioritize unsolved problems</span>
          </label>
          <span className="text-[11px] text-foreground/40 font-mono">
            Countdown starts on launch
          </span>
        </div>

        {/* Launch Button */}
        <div className="pt-2">
          <button
            onClick={handleLaunch}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <span>🚀 Start Timed Mock Interview</span>
          </button>
        </div>
      </div>
    </div>
  );
}
