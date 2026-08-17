'use client';

import { useState, useMemo } from 'react';
import { MarkdownDocument } from '@/lib/markdown';
import { TOP_30_BEHAVIORAL_QUESTIONS, REVERSE_INTERVIEW_QUESTIONS } from '@/lib/behavioralData';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import StarStoryBuilderModal from '@/components/StarStoryBuilderModal';

export default function StoriesClient({ initialStories }: { initialStories: MarkdownDocument[] }) {
  const [activeTab, setActiveTab] = useState<'my-stories' | 'top-questions' | 'rubric' | 'reverse-interview'>('my-stories');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStories = useMemo(() => {
    return initialStories.filter(s => 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [initialStories, searchQuery]);

  const filteredQuestions = useMemo(() => {
    return TOP_30_BEHAVIORAL_QUESTIONS.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.principle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredReverseQuestions = useMemo(() => {
    return REVERSE_INTERVIEW_QUESTIONS.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.whatItReveals.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider">
              Behavioral & Leadership
            </span>
            <span className="text-xs text-foreground/40 font-mono">
              STAR Method & Amazon 16 LPs
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">STAR Behavioral Stories & FAANG Question Bank</h1>
          <p className="text-foreground/60 mt-1 max-w-2xl text-sm">
            Structure your project achievements with the Situation $\rightarrow$ Task $\rightarrow$ Action $\rightarrow$ Result framework and master the top behavioral interview questions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StarStoryBuilderModal />
        </div>
      </div>

      {/* Navigation Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('my-stories')}
            className={`py-2 px-3.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'my-stories'
                ? 'bg-primary text-white shadow-md'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            📖 My STAR Stories ({initialStories.length})
          </button>
          <button
            onClick={() => setActiveTab('top-questions')}
            className={`py-2 px-3.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'top-questions'
                ? 'bg-primary text-white shadow-md'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            🎯 Top FAANG Questions ({TOP_30_BEHAVIORAL_QUESTIONS.length})
          </button>
          <button
            onClick={() => setActiveTab('rubric')}
            className={`py-2 px-3.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'rubric'
                ? 'bg-primary text-white shadow-md'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            📐 STAR & Google XYZ Rubric
          </button>
          <button
            onClick={() => setActiveTab('reverse-interview')}
            className={`py-2 px-3.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'reverse-interview'
                ? 'bg-primary text-white shadow-md'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            💬 Reverse Interview ({REVERSE_INTERVIEW_QUESTIONS.length})
          </button>
        </div>

        <div className="w-full sm:w-64">
          <input 
            type="text"
            placeholder="Search stories & questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/40"
          />
        </div>
      </div>

      {/* TAB 1: My STAR Stories */}
      {activeTab === 'my-stories' && (
        <div className="grid gap-6">
          {filteredStories.length === 0 ? (
            <div className="glass-card p-12 text-center text-foreground/50">
              No stories match your search. Click &ldquo;Draft STAR Story Wizard&rdquo; above to create one!
            </div>
          ) : (
            filteredStories.map((story) => (
              <div key={story.id} id={story.id} className="glass-card p-8 md:p-10 scroll-mt-24 border-white/5 hover:border-primary/30 transition-all">
                <div className="prose-dark max-w-none">
                  <MarkdownRenderer content={story.content} />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Top FAANG Behavioral Questions */}
      {activeTab === 'top-questions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredQuestions.map((bq) => (
            <div key={bq.id} className="glass-card p-6 flex flex-col justify-between gap-4 border-white/10 hover:border-primary/40 transition-all">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/20 text-primary">
                    {bq.category}
                  </span>
                  <span className="text-[10px] text-foreground/50 font-mono">
                    {bq.principle}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-foreground leading-snug">
                  &ldquo;{bq.question}&rdquo;
                </h3>

                <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5">
                  <span className="text-[11px] font-semibold text-primary block mb-1">Why Interviewers Ask This:</span>
                  <p className="text-[11px] text-foreground/70 leading-relaxed">{bq.whyItMatters}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-foreground/40 tracking-wider">Scoring Tips:</span>
                  <ul className="text-[11px] text-foreground/75 space-y-1 list-disc list-inside">
                    {bq.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-white/5 pt-3 flex items-center justify-between">
                <span className="text-[10px] text-foreground/40 font-mono">Use STAR Method</span>
                <StarStoryBuilderModal />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: STAR Rubric & Google XYZ Cheat Sheet */}
      {activeTab === 'rubric' && (
        <div className="glass-card p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold text-primary">The FAANG Behavioral Interview Rubric</h2>
            <p className="text-xs text-foreground/60 mt-1">
              How hiring committees grade candidate answers across levels (L4 SDE-1 vs L5 SDE-2 vs L6 Staff).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">Step 1 (15% time)</span>
              <h3 className="font-bold text-foreground text-sm">Situation</h3>
              <p className="text-foreground/70 text-[11px]">
                Briefly set the context: company scale, team constraints, users affected, and the initial baseline metric.
              </p>
              <span className="text-[10px] text-cyan-400 font-mono mt-auto">Target: ~30-45 seconds</span>
            </div>

            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Step 2 (15% time)</span>
              <h3 className="font-bold text-foreground text-sm">Task</h3>
              <p className="text-foreground/70 text-[11px]">
                Define the explicit problem you were assigned or chose to solve: deadline constraints, architectural blockers, or business risks.
              </p>
              <span className="text-[10px] text-purple-400 font-mono mt-auto">Target: ~30-45 seconds</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Step 3 (50% time)</span>
              <h3 className="font-bold text-foreground text-sm">Action (The Core)</h3>
              <p className="text-foreground/70 text-[11px]">
                Describe what YOU personally did: technical decisions, tradeoffs analyzed, tools built, and how you persuaded disagreeing stakeholders.
              </p>
              <span className="text-[10px] text-emerald-400 font-mono mt-auto">Target: ~1.5 - 2 minutes</span>
            </div>

            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-yellow-300 uppercase tracking-wider">Step 4 (20% time)</span>
              <h3 className="font-bold text-foreground text-sm">Result (Metrics)</h3>
              <p className="text-foreground/70 text-[11px]">
                Quantified metrics: latency reduction %, dollars saved, conversion lift %, team hours saved, and lessons learned.
              </p>
              <span className="text-[10px] text-yellow-400 font-mono mt-auto">Target: ~45 seconds</span>
            </div>

          </div>

          {/* Pitfalls to Avoid */}
          <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-xl text-xs space-y-1.5">
            <span className="font-bold text-red-400 block">⚠️ Top 3 Behavioral Blunders That Cause Rejections:</span>
            <ul className="text-foreground/80 list-disc list-inside space-y-1">
              <li><strong>Saying &ldquo;We&rdquo; instead of &ldquo;I&rdquo;:</strong> The interviewer cannot tell if you did the work or just watched someone else do it.</li>
              <li><strong>Zero Quantified Results:</strong> Saying &ldquo;It made the app much faster&rdquo; instead of &ldquo;Reduced p99 latency by 45% from 420ms to 230ms&rdquo;.</li>
              <li><strong>Blaming Others:</strong> Blaming product managers, designers, or junior devs for project failures instead of taking ownership.</li>
            </ul>
          </div>

        </div>
      )}

      {/* TAB 4: Reverse Interview (Questions to Ask the Interviewer) */}
      {activeTab === 'reverse-interview' && (
        <div className="flex flex-col gap-6">
          <div className="glass-card p-6 border-l-4 border-l-primary/60">
            <h2 className="text-xl font-bold text-foreground">Reverse Interview Questions</h2>
            <p className="text-xs text-foreground/60 mt-1">
              Inspired by <code className="bg-white/5 px-1 py-0.5 rounded text-primary">viraptor/reverse-interview</code> and <code className="bg-white/5 px-1 py-0.5 rounded text-primary">Tech Interview Handbook</code>. High-signal questions to ask your interviewers to evaluate engineering culture, on-call health, tech debt, and promotion transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReverseQuestions.map((q) => (
              <div key={q.id} className="glass-card p-6 flex flex-col gap-4 border-white/5 hover:border-primary/30 transition-all">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider">
                    {q.category}
                  </span>
                  <h3 className="font-bold text-sm text-foreground mt-2 leading-snug">&ldquo;{q.question}&rdquo;</h3>
                </div>

                <div className="text-xs text-foreground/70 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                  <strong className="text-foreground block mb-1 text-[11px] uppercase tracking-wider text-primary">What this reveals:</strong>
                  <p className="text-[11px] leading-relaxed">{q.whatItReveals}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] mt-auto pt-2 border-t border-white/5">
                  <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300">
                    <strong className="block text-[10px] uppercase font-bold text-green-400">✅ Green Flags</strong>
                    <p className="mt-0.5 text-[10px] leading-relaxed">{q.greenFlags}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300">
                    <strong className="block text-[10px] uppercase font-bold text-red-400">🚩 Red Flags</strong>
                    <p className="mt-0.5 text-[10px] leading-relaxed">{q.redFlags}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
