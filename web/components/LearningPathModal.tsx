'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

export default function LearningPathModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<'sde2' | 'beginner' | 'urgent'>('sde2');

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-white bg-primary/10 hover:bg-primary/20 border border-primary/20 px-3 py-1.5 rounded-xl transition-all"
      >
        <span>🧭 Recommended Prep Tracks</span>
      </button>

      {isOpen && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
        >
          <div className="bg-[#14171e] border border-white/15 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6 md:p-8 animate-in zoom-in-95 duration-200 flex flex-col gap-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span>🧭</span> Personalized Prep Playbooks
                </h2>
                <p className="text-xs text-foreground/60 mt-1">
                  Tailored routines based on your experience level and timeline.
                </p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-foreground/40 hover:text-white text-sm bg-white/5 px-2.5 py-1 rounded-lg"
              >
                ESC ✕
              </button>
            </div>

            {/* Track Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
              <button
                onClick={() => setSelectedTrack('sde2')}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all text-center ${
                  selectedTrack === 'sde2' ? 'bg-primary text-white shadow-md' : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                💼 SDE-2 & Senior Track
              </button>
              <button
                onClick={() => setSelectedTrack('beginner')}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all text-center ${
                  selectedTrack === 'beginner' ? 'bg-primary text-white shadow-md' : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                🌱 Beginner / SDE-1 Track
              </button>
              <button
                onClick={() => setSelectedTrack('urgent')}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all text-center ${
                  selectedTrack === 'urgent' ? 'bg-primary text-white shadow-md' : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                ⚡ 1-Week Crash Sprint
              </button>
            </div>

            {/* TRACK 1: SDE-2 & Senior */}
            {selectedTrack === 'sde2' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-primary/10 border-l-4 border-primary p-3.5 rounded-r-xl">
                  <h3 className="font-bold text-sm text-primary">Target: Mid to Senior Engineer balancing a full-time job</h3>
                  <p className="text-xs text-foreground/75 mt-1">
                    Goal: High-efficiency prep focused on pattern recognition, LLD/HLD architecture, and behavioral storytelling without wasting hours grinding.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="glass-card p-4 flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">1</span>
                    <div>
                      <strong className="text-foreground text-sm block">Daily 20-Minute Micro-Prep Routine</strong>
                      <p className="text-foreground/60 mt-0.5">Solve 1 Medium LeetCode problem from the Coding Matrix + review 5 due Flashcards right after work.</p>
                      <Link href="/coding" onClick={() => setIsOpen(false)} className="text-primary hover:underline font-semibold mt-1 inline-block">Go to Coding Matrix →</Link>
                    </div>
                  </div>

                  <div className="glass-card p-4 flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">2</span>
                    <div>
                      <strong className="text-foreground text-sm block">System Design & Architecture Deep Dives (2-3x / week)</strong>
                      <p className="text-foreground/60 mt-0.5">Study mobile list virtualization, offline sync engines, rate limiters, and ByteByteGo visual summaries.</p>
                      <Link href="/system-design" onClick={() => setIsOpen(false)} className="text-primary hover:underline font-semibold mt-1 inline-block">Explore System Design →</Link>
                    </div>
                  </div>

                  <div className="glass-card p-4 flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">3</span>
                    <div>
                      <strong className="text-foreground text-sm block">Refine 4-5 STAR Behavioral Stories</strong>
                      <p className="text-foreground/60 mt-0.5">Map past work achievements to Amazon 16 Leadership Principles (ownership, deliver results, dive deep).</p>
                      <Link href="/stories" onClick={() => setIsOpen(false)} className="text-primary hover:underline font-semibold mt-1 inline-block">Read STAR Stories →</Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TRACK 2: Beginner / SDE-1 */}
            {selectedTrack === 'beginner' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-green-500/10 border-l-4 border-green-500 p-3.5 rounded-r-xl">
                  <h3 className="font-bold text-sm text-green-400">Target: Junior Engineer / Early Career / Career Switcher</h3>
                  <p className="text-xs text-foreground/75 mt-1">
                    Goal: Build rock-solid CS fundamentals, master array/string/linked-list patterns, and learn how to speak technically in interviews.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="glass-card p-4 flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold shrink-0">1</span>
                    <div>
                      <strong className="text-foreground text-sm block">Foundations in Resource Hub</strong>
                      <p className="text-foreground/60 mt-0.5">Follow freeCodeCamp, Striver&apos;s A2Z Sheet, and GeeksforGeeks Must-Do sheets from the curated directory.</p>
                      <Link href="/resources" onClick={() => setIsOpen(false)} className="text-green-400 hover:underline font-semibold mt-1 inline-block">Open Resource Hub →</Link>
                    </div>
                  </div>

                  <div className="glass-card p-4 flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold shrink-0">2</span>
                    <div>
                      <strong className="text-foreground text-sm block">Master Easy Problems by Pattern</strong>
                      <p className="text-foreground/60 mt-0.5">Filter the Coding Matrix by Easy difficulty and master Two Sum, Valid Palindrome, Reverse Linked List.</p>
                      <Link href="/coding" onClick={() => setIsOpen(false)} className="text-green-400 hover:underline font-semibold mt-1 inline-block">Practice Easy Problems →</Link>
                    </div>
                  </div>

                  <div className="glass-card p-4 flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold shrink-0">3</span>
                    <div>
                      <strong className="text-foreground text-sm block">Daily Flashcard Quizzing (10 mins)</strong>
                      <p className="text-foreground/60 mt-0.5">Use active recall to memorize core JS event loop, prototypes, closures, and HTTP basics.</p>
                      <Link href="/quiz" onClick={() => setIsOpen(false)} className="text-green-400 hover:underline font-semibold mt-1 inline-block">Start Quiz Session →</Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TRACK 3: 1-Week Crash Sprint */}
            {selectedTrack === 'urgent' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-orange-500/10 border-l-4 border-orange-500 p-3.5 rounded-r-xl">
                  <h3 className="font-bold text-sm text-orange-400">Target: Interview Scheduled in 7 Days</h3>
                  <p className="text-xs text-foreground/75 mt-1">
                    Goal: High-density review of cheat sheets, top QA bank questions, and Blind 75 core patterns.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="glass-card p-4 flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold shrink-0">1</span>
                    <div>
                      <strong className="text-foreground text-sm block">Memorize Interactive Cheat Sheets</strong>
                      <p className="text-foreground/60 mt-0.5">Review DSA Pattern Recognition Matrix, JS Event Loop microtasks order, and System Design Latency Numbers.</p>
                      <Link href="/cheatsheets" onClick={() => setIsOpen(false)} className="text-orange-400 hover:underline font-semibold mt-1 inline-block">Open Cheat Sheets →</Link>
                    </div>
                  </div>

                  <div className="glass-card p-4 flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold shrink-0">2</span>
                    <div>
                      <strong className="text-foreground text-sm block">Rapid-Fire QA Bank Self-Quiz</strong>
                      <p className="text-foreground/60 mt-0.5">Go through QA Bank in Expand mode or Quiz mode answering out loud before revealing the answer.</p>
                      <Link href="/qa" onClick={() => setIsOpen(false)} className="text-orange-400 hover:underline font-semibold mt-1 inline-block">Browse QA Bank →</Link>
                    </div>
                  </div>

                  <div className="glass-card p-4 flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold shrink-0">3</span>
                    <div>
                      <strong className="text-foreground text-sm block">Company-Specific Prep File</strong>
                      <p className="text-foreground/60 mt-0.5">Fill out your company prep sheet with JD keywords, past interview questions, and chosen stories.</p>
                      <Link href="/prep" onClick={() => setIsOpen(false)} className="text-orange-400 hover:underline font-semibold mt-1 inline-block">View Prep Sheets →</Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="border-t border-white/10 pt-4 flex items-center justify-between">
              <span className="text-xs text-foreground/40 font-mono">Tip: Use ⌘K anytime to jump anywhere</span>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-xl text-xs font-semibold transition-colors"
              >
                Let&apos;s Start Prep 🚀
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}
