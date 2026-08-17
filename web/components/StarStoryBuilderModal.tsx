'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';

interface StarStory {
  title: string;
  principle: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  xyzSummary: string;
}

export default function StarStoryBuilderModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [story, setStory] = useState<StarStory>({
    title: '',
    principle: 'Ownership & Deliver Results',
    situation: '',
    task: '',
    action: '',
    result: '',
    xyzSummary: ''
  });

  const [copied, setCopied] = useState(false);

  const formattedMarkdown = `# ${story.title || 'Untitled Behavioral Story'}

**Leadership Principle:** ${story.principle}
**Google X-Y-Z One-Liner:** ${story.xyzSummary || 'Accomplished [X] as measured by [Y], by doing [Z]'}

---

### 1. Situation (Context & Scale)
${story.situation || 'Describe the company, project context, scale (users, QPS), and initial state.'}

### 2. Task (The Problem & Constraints)
${story.task || 'What was the specific goal, deadline, bug, or technical challenge you had to solve?'}

### 3. Action (What YOU Did Specifically)
${story.action || 'Concrete architectural decisions, code changes, and leadership actions YOU personally drove.'}

### 4. Result (Quantified Impact)
${story.result || 'Specific numbers: latency reduction %, revenue saved, crash rate reduction, team velocity.'}
`;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(formattedMarkdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary-dark hover:to-purple-500 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105"
      >
        <span>✨ Draft STAR Story Wizard</span>
      </button>

      {isOpen && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
        >
          <div className="bg-[#14171f] border border-white/15 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-in zoom-in-95 duration-200 flex flex-col gap-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <span>✨</span> Interactive STAR Behavioral Story Builder
                </h2>
                <p className="text-xs text-foreground/60 mt-1">
                  Format high-impact answers using the Situation $\rightarrow$ Task $\rightarrow$ Action $\rightarrow$ Result framework and Google&apos;s X-Y-Z formula.
                </p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-foreground/40 hover:text-white text-xs bg-white/5 px-2.5 py-1 rounded-lg"
              >
                ESC ✕
              </button>
            </div>

            {/* Google XYZ Formula Callout */}
            <div className="bg-primary/10 border-l-4 border-primary p-3.5 rounded-r-xl">
              <span className="text-xs font-bold text-primary block">💡 Google X-Y-Z Formula Rule:</span>
              <p className="text-xs text-foreground/80 mt-1">
                &ldquo;Accomplished <strong className="text-white">[X - Specific Outcome]</strong> as measured by <strong className="text-white">[Y - Quantifiable Metric % or $$]</strong>, by doing <strong className="text-white">[Z - Concrete Technical Action]</strong>.&rdquo;
              </p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Title */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-bold text-foreground/80">Story Title / Feature Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Redesigned Mobile Checkout List Virtualization to Eliminate Frame Drops"
                  value={story.title}
                  onChange={(e) => setStory({ ...story, title: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-primary transition-colors text-foreground"
                />
              </div>

              {/* Leadership Principle */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-foreground/80">Primary Leadership Principle</label>
                <select
                  value={story.principle}
                  onChange={(e) => setStory({ ...story, principle: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-primary transition-colors text-foreground cursor-pointer"
                >
                  <option value="Ownership & Deliver Results" className="bg-[#1a1d24]">Ownership & Deliver Results</option>
                  <option value="Customer Obsession" className="bg-[#1a1d24]">Customer Obsession</option>
                  <option value="Bias for Action" className="bg-[#1a1d24]">Bias for Action</option>
                  <option value="Dive Deep & Root Cause" className="bg-[#1a1d24]">Dive Deep & Root Cause</option>
                  <option value="Have Backbone; Disagree and Commit" className="bg-[#1a1d24]">Have Backbone; Disagree and Commit</option>
                  <option value="Invent and Simplify" className="bg-[#1a1d24]">Invent and Simplify</option>
                  <option value="Earn Trust & Mentorship" className="bg-[#1a1d24]">Earn Trust & Mentorship</option>
                </select>
              </div>

              {/* Google XYZ Summary */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-foreground/80">Google X-Y-Z One-Liner</label>
                <input 
                  type="text"
                  placeholder="Accomplished X as measured by Y, by doing Z..."
                  value={story.xyzSummary}
                  onChange={(e) => setStory({ ...story, xyzSummary: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-primary transition-colors text-foreground"
                />
              </div>

              {/* Situation */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-cyan-400">1. Situation (Context & Scale)</label>
                <textarea 
                  rows={3}
                  placeholder="Set the scene: At Company A, our checkout screen suffered from 40% frame drops when loading 200+ cart items..."
                  value={story.situation}
                  onChange={(e) => setStory({ ...story, situation: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-primary transition-colors text-foreground resize-none"
                />
              </div>

              {/* Task */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-purple-400">2. Task (The Problem & Constraints)</label>
                <textarea 
                  rows={3}
                  placeholder="What had to be solved: I was tasked with achieving a locked 60 FPS and sub-100ms render time within 3 weeks before Black Friday..."
                  value={story.task}
                  onChange={(e) => setStory({ ...story, task: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-primary transition-colors text-foreground resize-none"
                />
              </div>

              {/* Action */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-emerald-400">3. Action (What YOU Did Specifically)</label>
                <textarea 
                  rows={4}
                  placeholder="Concrete actions: I profiled the UI with React DevTools and Systrace, replaced unmemoized cell views with FlashList native recycling, and moved gesture handlers to UI thread worklets..."
                  value={story.action}
                  onChange={(e) => setStory({ ...story, action: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-primary transition-colors text-foreground resize-none"
                />
              </div>

              {/* Result */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-yellow-400">4. Result (Quantified Metrics & Impact)</label>
                <textarea 
                  rows={4}
                  placeholder="Quantified outcome: Reduced memory consumption by 65% (180MB -> 62MB), eliminated all JS thread frame drops (0 dropped frames at 60 FPS), which drove a 4.2% lift in checkout conversion..."
                  value={story.result}
                  onChange={(e) => setStory({ ...story, result: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-primary transition-colors text-foreground resize-none"
                />
              </div>

            </div>

            {/* Modal Actions */}
            <div className="border-t border-white/10 pt-4 flex items-center justify-between">
              <span className="text-[11px] text-foreground/50 font-mono">
                Tip: Speak in &apos;I&apos; instead of &apos;We&apos; for the Action step!
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyMarkdown}
                  className="bg-white/10 hover:bg-white/20 text-foreground font-semibold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 border border-white/10"
                >
                  {copied ? (
                    <>
                      <span className="text-green-400">✓</span>
                      <span className="text-green-400">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <span>📋 Copy as Markdown</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2 rounded-xl text-xs transition-colors"
                >
                  Done
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}
