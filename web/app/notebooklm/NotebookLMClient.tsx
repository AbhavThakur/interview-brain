'use client';

import { useState } from 'react';
import { SOURCE_PACKS, NOTEBOOKLM_PROMPTS, SourcePack, NotebookLMPrompt } from '@/lib/notebooklmData';

export default function NotebookLMClient() {
  const [activeTab, setActiveTab] = useState<'packs' | 'prompts' | 'audio-guide'>('packs');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyingPackId, setCopyingPackId] = useState<string | null>(null);
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<string>('all');

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const copySourcePack = async (pack: SourcePack) => {
    setCopyingPackId(pack.id);
    try {
      const res = await fetch(`/api/notebooklm/export?pack=${pack.downloadParam}`);
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopiedId(pack.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (err) {
      console.error('Failed to copy pack content', err);
    } finally {
      setCopyingPackId(null);
    }
  };

  const filteredPrompts = NOTEBOOKLM_PROMPTS.filter(p => 
    selectedPromptCategory === 'all' || p.category === selectedPromptCategory
  );

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/40 via-primary/20 to-black border border-purple-500/20 p-8 md:p-12 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                Google NotebookLM AI Engine
              </span>
              <span className="text-xs text-foreground/40 font-mono hidden sm:inline">
                Zero Hallucinations · Multi-Source Grounding
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Grounded AI Mock Interviews & Audio Podcasts
            </h1>
            
            <p className="text-sm md:text-base text-foreground/70 leading-relaxed">
              Export your System Design blueprints, Grind 75 insights, and STAR stories directly into Google NotebookLM. Generate <strong>15-minute 2-host conversational audio podcasts</strong> for commute learning and conduct rigorous, 100% grounded FAANG mock interviews.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <a 
              href="https://notebooklm.google.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group"
            >
              <span>Launch NotebookLM</span>
              <span className="group-hover:translate-x-0.5 transition-transform">↗</span>
            </a>
            
            <a 
              href="/api/notebooklm/export?pack=master" 
              className="bg-white/5 hover:bg-white/10 text-foreground border border-white/10 font-medium text-xs px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>⬇️ Download Master Binder</span>
            </a>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* 3-Minute Quickstart Stepper */}
      <div className="glass-card p-6 md:p-8">
        <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-6 flex items-center gap-2">
          <span>⚡ 3-Minute Quickstart Guide</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5 relative">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-sm border border-purple-500/30">
              1
            </div>
            <h3 className="font-bold text-sm text-foreground mt-1">Download Grounding Source Pack</h3>
            <p className="text-xs text-foreground/60 leading-relaxed">
              Choose a targeted source pack (System Design, Grind 75, STAR Stories) or the Unified Master Binder below.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5 relative">
            <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary font-bold flex items-center justify-center text-sm border border-primary/30">
              2
            </div>
            <h3 className="font-bold text-sm text-foreground mt-1">Drop into NotebookLM</h3>
            <p className="text-xs text-foreground/60 leading-relaxed">
              Open <a href="https://notebooklm.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">notebooklm.google.com</a>, create a notebook, and upload the downloaded <code className="bg-white/5 px-1 py-0.5 rounded text-[11px]">.md</code> file as a source.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5 relative">
            <div className="w-8 h-8 rounded-xl bg-green-500/20 text-green-400 font-bold flex items-center justify-center text-sm border border-green-500/30">
              3
            </div>
            <h3 className="font-bold text-sm text-foreground mt-1">Generate Podcast or Mock Drill</h3>
            <p className="text-xs text-foreground/60 leading-relaxed">
              Click <strong>&ldquo;Generate Audio Overview&rdquo;</strong> for a 15-min commute podcast, or paste one of our Master Prompts for interactive grilling!
            </p>
          </div>

        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('packs')}
            className={`py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'packs'
                ? 'bg-primary text-white shadow-md'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <span>📦</span>
            <span>Grounding Source Packs ({SOURCE_PACKS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('prompts')}
            className={`py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'prompts'
                ? 'bg-primary text-white shadow-md'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <span>🎯</span>
            <span>Master Prompt Library ({NOTEBOOKLM_PROMPTS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audio-guide')}
            className={`py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'audio-guide'
                ? 'bg-primary text-white shadow-md'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <span>🎧</span>
            <span>Audio Overview Guide</span>
          </button>
        </div>

        {activeTab === 'prompts' && (
          <div className="flex items-center gap-2 overflow-x-auto">
            {['all', 'audio', 'system-design', 'behavioral', 'dsa', 'warmup', 'reverse'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedPromptCategory(cat)}
                className={`text-[11px] font-medium px-3 py-1.5 rounded-lg capitalize whitespace-nowrap transition-all ${
                  selectedPromptCategory === cat
                    ? 'bg-white/20 text-white font-bold'
                    : 'bg-white/5 text-foreground/60 hover:text-foreground hover:bg-white/10'
                }`}
              >
                {cat === 'all' ? 'All Prompts' : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: Grounding Source Packs */}
      {activeTab === 'packs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SOURCE_PACKS.map((pack) => {
            const isCopied = copiedId === pack.id;
            const isCopying = copyingPackId === pack.id;

            return (
              <div 
                key={pack.id} 
                className="glass-card p-6 md:p-8 flex flex-col justify-between gap-6 border-white/5 hover:border-primary/40 transition-all group"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                        {pack.emoji}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider">
                          {pack.badge}
                        </span>
                        <h3 className="text-base font-bold text-foreground mt-1">{pack.title}</h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-foreground/70 leading-relaxed">
                    {pack.description}
                  </p>

                  {/* Highlights */}
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider block">
                      Grounding Highlights:
                    </span>
                    <ul className="text-[11px] text-foreground/80 space-y-1.5">
                      {pack.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary mt-0.5 text-xs">✓</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-[11px] text-foreground/50 italic bg-black/20 p-2.5 rounded-lg border border-white/5">
                    <strong>Target Use:</strong> {pack.targetUse}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <a
                    href={`/api/notebooklm/export?pack=${pack.downloadParam}`}
                    className="flex-1 bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-1.5"
                  >
                    <span>⬇️ Download .md</span>
                  </a>

                  <button
                    onClick={() => copySourcePack(pack)}
                    disabled={isCopying}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-foreground border border-white/10 text-xs font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    {isCopying ? (
                      <span>⏳ Preparing...</span>
                    ) : isCopied ? (
                      <span className="text-green-400 font-bold">✓ Copied to Clipboard!</span>
                    ) : (
                      <span>📋 Copy Source</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: Master Prompt Library */}
      {activeTab === 'prompts' && (
        <div className="grid grid-cols-1 gap-6">
          {filteredPrompts.map((p) => {
            const isCopied = copiedId === p.id;

            return (
              <div 
                key={p.id} 
                className="glass-card p-6 md:p-8 flex flex-col gap-4 border-white/5 hover:border-purple-500/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 uppercase tracking-wider">
                          {p.badge}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-foreground mt-0.5">{p.title}</h3>
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(p.prompt, p.id)}
                    className={`text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                      isCopied
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'bg-primary hover:bg-primary-dark text-white shadow-md'
                    }`}
                  >
                    {isCopied ? '✓ Prompt Copied!' : '📋 Copy Prompt'}
                  </button>
                </div>

                <p className="text-xs text-foreground/70">
                  {p.description}
                </p>

                {/* Prompt Box */}
                <div className="relative">
                  <pre className="text-xs font-mono bg-black/40 border border-white/10 p-4 rounded-xl text-foreground/90 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {p.prompt}
                  </pre>
                </div>

                {/* Tips */}
                {p.tips && p.tips.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-foreground/50 pt-2">
                    <span className="font-bold text-foreground/40 uppercase tracking-wider text-[10px]">Tips:</span>
                    {p.tips.map((tip, idx) => (
                      <span key={idx} className="bg-white/5 px-2 py-0.5 rounded border border-white/5 text-foreground/60">
                        • {tip}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: Audio Overview Guide */}
      {activeTab === 'audio-guide' && (
        <div className="glass-card p-8 md:p-12 flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 uppercase tracking-wider">
                Commute Learning
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">How to Turn Your Notes into a 15-Minute Audio Podcast</h2>
            <p className="text-xs md:text-sm text-foreground/60 mt-1 max-w-2xl">
              Google NotebookLM uses Gemini to synthesize your uploaded source materials into an engaging conversational podcast between two AI hosts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-3">
              <span className="text-2xl">1️⃣</span>
              <h3 className="font-bold text-sm text-foreground">Upload System Design Pack</h3>
              <p className="text-xs text-foreground/70 leading-relaxed">
                Download the <strong>System Design & Distributed Architecture Pack</strong> from the Source Packs tab and add it to your NotebookLM notebook.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-3">
              <span className="text-2xl">2️⃣</span>
              <h3 className="font-bold text-sm text-foreground">Customize Podcast Focus</h3>
              <p className="text-xs text-foreground/70 leading-relaxed">
                In NotebookLM, click the <strong>&ldquo;Customize&rdquo;</strong> button under Studio / Audio Overview, and paste our <strong>Commute Audio Podcast Optimizer</strong> prompt.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-3">
              <span className="text-2xl">3️⃣</span>
              <h3 className="font-bold text-sm text-foreground">Listen & Retain On-The-Go</h3>
              <p className="text-xs text-foreground/70 leading-relaxed">
                Hit <strong>&ldquo;Generate&rdquo;</strong>. In ~2 minutes, your 12-15 minute audio overview will be ready to stream or download on your phone for commutes, runs, or pre-sleep review.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-purple-300">Ready to try your first Audio Overview?</h4>
              <p className="text-xs text-foreground/70 mt-0.5">
                Download the System Design pack and open NotebookLM to generate your first episode in under 3 minutes.
              </p>
            </div>

            <a 
              href="https://notebooklm.google.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md shrink-0"
            >
              Open NotebookLM ↗
            </a>
          </div>
        </div>
      )}

    </div>
  );
}
