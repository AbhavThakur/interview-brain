'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { MarkdownDocument } from '@/lib/markdown';
import ActivePlanWidget from '@/components/ActivePlanWidget';
import PlanWizardModal from '@/components/PlanWizardModal';

const categoryDisplayNames: Record<string, string> = {
  All: 'All Categories',
  'lld-design-patterns': 'LLD & Design Patterns',
  'lld-framework': 'LLD Machine Coding Framework',
  'mobile-frontend': 'Mobile & Frontend Virtualization',
  'fullstack-distributed': 'Real-Time & Microservices',
  'distributed-backend': 'Distributed Backend & Rate Limiting'
};

const categoryEmojis: Record<string, string> = {
  All: '🌐',
  'lld-design-patterns': '🏛️',
  'lld-framework': '⚙️',
  'mobile-frontend': '📱',
  'fullstack-distributed': '💬',
  'distributed-backend': '🛡️'
};

export default function SystemDesignClient({ initialDocs }: { initialDocs: MarkdownDocument[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [scopeFilter, setScopeFilter] = useState<'all' | 'lld' | 'hld' | 'mobile'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBeginnerGuide, setShowBeginnerGuide] = useState<boolean>(true);
  const [wizardOpen, setWizardOpen] = useState<boolean>(false);

  // Extract category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    initialDocs.forEach(d => {
      const cat = d.category || 'Architecture';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [initialDocs]);

  const categories = useMemo(() => {
    return ['All', ...Object.keys(categoryCounts).sort()];
  }, [categoryCounts]);

  // Filter docs based on scope, category, and search query
  const filteredDocs = useMemo(() => {
    return initialDocs.filter(d => {
      const cat = d.category || 'Architecture';

      let matchesScope = true;
      if (scopeFilter === 'lld') {
        matchesScope = cat.startsWith('lld-');
      } else if (scopeFilter === 'hld') {
        matchesScope = cat === 'distributed-backend' || cat === 'fullstack-distributed';
      } else if (scopeFilter === 'mobile') {
        matchesScope = cat === 'mobile-frontend';
      }

      const matchesCat = selectedCategory === 'All' || cat === selectedCategory;
      const matchesSearch = 
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.tags && d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesScope && matchesCat && matchesSearch;
    });
  }, [initialDocs, scopeFilter, selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider">
              HLD & LLD Architecture Hub
            </span>
            <span className="text-xs text-foreground/40 font-mono">
              {filteredDocs.length} of {initialDocs.length} blueprints shown
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">System Design & Low-Level Design</h1>
          <p className="text-foreground/60 mt-1 max-w-2xl text-sm">
            High-Level Design (HLD) distributed scaling, Low-Level Design (LLD) GoF patterns, machine coding frameworks, mobile virtualization, and real-time synchronization.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <button
            onClick={() => setWizardOpen(true)}
            className="bg-gradient-to-r from-primary via-purple-600 to-primary-dark hover:from-primary-dark hover:to-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <span>🎯</span>
            <span>Personalize My Plan</span>
          </button>

          <div className="w-full sm:w-60">
            <input 
              type="text" 
              placeholder="Search HLD, LLD, patterns..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/40"
            />
          </div>
        </div>
      </div>

      {/* Beginner Navigation & LLD vs HLD Roadmap Guide */}
      <div className="rounded-3xl bg-gradient-to-br from-white/[0.04] via-primary/5 to-purple-950/20 border border-white/10 p-6 sm:p-8 flex flex-col gap-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center text-xl shrink-0">
              🔰
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider">
                  Beginner Start Here Guide
                </span>
                <span className="text-[11px] text-foreground/40 font-mono">
                  LLD vs HLD Learning Sequence
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-foreground mt-0.5">
                How to Learn System Design from Scratch
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBeginnerGuide(prev => !prev)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-foreground/70 hover:text-white transition-all flex items-center gap-1.5"
            >
              <span>{showBeginnerGuide ? 'Hide Guide ▴' : 'Show Guide ▾'}</span>
            </button>
          </div>
        </div>

        {showBeginnerGuide && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 animate-in fade-in duration-300">
            
            {/* LLD Pillar Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-blue-500/20 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏛️</span>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-blue-400">
                        Track A: Low-Level Design (LLD)
                      </h3>
                      <span className="text-[10px] text-foreground/50 font-mono">
                        Object-Oriented Design & Machine Coding (45–60 min rounds)
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                    Code Quality
                  </span>
                </div>

                <p className="text-xs text-foreground/70 leading-relaxed">
                  Focuses on writing clean, extensible, modular object-oriented code. Evaluates your grasp of SOLID principles, design patterns, entity modeling, and relational database schema design.
                </p>

                <div className="flex flex-col gap-2 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">
                    Proven Learning Sequence:
                  </span>
                  <div className="flex flex-col gap-1.5 text-xs text-foreground/80">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold">1.</span>
                      <span><strong>SOLID Principles</strong> (Single Responsibility, Open-Closed, Dependency Inversion)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold">2.</span>
                      <span><strong>GoF Design Patterns</strong> (Strategy, Factory, Observer, Decorator)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold">3.</span>
                      <span><strong>Relational Schema Design</strong> (Foreign keys, indexes, ERDs in drawDB)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold">4.</span>
                      <span><strong>Machine Coding Classics</strong> (Parking Lot, Elevator, Rate Limiter)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                  <span className="text-[10px] text-foreground/40 font-bold">Sandboxes:</span>
                  <a 
                    href="https://www.drawdb.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 hover:bg-emerald-500/20"
                  >
                    ⚡ drawDB Schema (Zero-Signup)
                  </a>
                  <a 
                    href="https://mermaid.live/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 hover:bg-purple-500/20"
                  >
                    ⚡ Mermaid Class Diagrams
                  </a>
                </div>
              </div>

              <button
                onClick={() => {
                  setScopeFilter('lld');
                  setSelectedCategory('All');
                }}
                className="w-full text-xs font-bold py-2 px-3 rounded-xl bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/25 transition-all text-center"
              >
                View LLD Blueprints Only &rarr;
              </button>
            </div>

            {/* HLD Pillar Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-purple-500/20 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🌐</span>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-purple-400">
                        Track B: High-Level Design (HLD)
                      </h3>
                      <span className="text-[10px] text-foreground/50 font-mono">
                        Distributed Systems, Scalability & Architecture (45-min rounds)
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">
                    Scale & Infra
                  </span>
                </div>

                <p className="text-xs text-foreground/70 leading-relaxed">
                  Focuses on scaling systems to millions of users. Evaluates functional vs non-functional scoping, capacity math, load balancing, caching, database sharding, CAP/PACELC tradeoffs, and failure modes.
                </p>

                <div className="flex flex-col gap-2 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">
                    Proven Learning Sequence:
                  </span>
                  <div className="flex flex-col gap-1.5 text-xs text-foreground/80">
                    <div className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">1.</span>
                      <span><strong>4-Step HLD Framework</strong> (Requirements &rarr; Capacity &rarr; Diagram &rarr; Deep Dive)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">2.</span>
                      <span><strong>Distributed Building Blocks</strong> (CAP, Consistent Hashing, Redis, Sharding)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">3.</span>
                      <span><strong>Back-of-the-Envelope Math</strong> (QPS, 5-yr storage, bandwidth, cache sizing)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">4.</span>
                      <span><strong>Classic Case Studies</strong> (TinyURL, Rate Limiter, Twitter, Web Crawler)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                  <span className="text-[10px] text-foreground/40 font-bold">Tools:</span>
                  <Link 
                    href="/tools" 
                    className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 hover:bg-amber-500/20"
                  >
                    ⚡ Capacity Estimator Tool
                  </Link>
                  <Link 
                    href="/tools" 
                    className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 hover:bg-blue-500/20"
                  >
                    ⚡ Latency Hierarchy Visualizer
                  </Link>
                </div>
              </div>

              <button
                onClick={() => {
                  setScopeFilter('hld');
                  setSelectedCategory('All');
                }}
                className="w-full text-xs font-bold py-2 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500 text-purple-400 hover:text-white border border-purple-500/25 transition-all text-center"
              >
                View HLD Blueprints Only &rarr;
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Active Personalized Plan Widget */}
      <ActivePlanWidget defaultFocus="system-design" />

      {/* Plan Wizard Modal */}
      <PlanWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        defaultFocus="system-design"
      />

      {/* High-Level Scope Switcher Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-foreground/40 uppercase tracking-wider mr-1">
            Focus Scope:
          </span>
          <button
            onClick={() => setScopeFilter('all')}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all ${
              scopeFilter === 'all'
                ? 'bg-primary text-white shadow-md shadow-primary/25'
                : 'bg-white/5 text-foreground/70 hover:bg-white/10'
            }`}
          >
            All Architecture ({initialDocs.length})
          </button>
          <button
            onClick={() => setScopeFilter('lld')}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              scopeFilter === 'lld'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-white/5 text-foreground/70 hover:bg-white/10'
            }`}
          >
            <span>🏛️</span>
            <span>LLD (Design Patterns & Machine Coding)</span>
          </button>
          <button
            onClick={() => setScopeFilter('hld')}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              scopeFilter === 'hld'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                : 'bg-white/5 text-foreground/70 hover:bg-white/10'
            }`}
          >
            <span>🌐</span>
            <span>HLD (Distributed Systems & Scale)</span>
          </button>
          <button
            onClick={() => setScopeFilter('mobile')}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              scopeFilter === 'mobile'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                : 'bg-white/5 text-foreground/70 hover:bg-white/10'
            }`}
          >
            <span>📱</span>
            <span>Mobile & Real-Time</span>
          </button>
        </div>

        {scopeFilter !== 'all' && (
          <button
            onClick={() => setScopeFilter('all')}
            className="text-xs text-primary hover:underline"
          >
            Clear scope filter ✕
          </button>
        )}
      </div>

      {/* Mobile Category Filter Pills */}
      <div className="lg:hidden flex flex-wrap items-center gap-2">
        {categories.map(c => {
          const count = c === 'All' ? initialDocs.length : (categoryCounts[c] || 0);
          return (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`text-xs font-medium px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === c
                  ? 'bg-primary text-white shadow-lg shadow-primary/25 font-semibold'
                  : 'bg-white/5 text-foreground/70 hover:bg-white/10 hover:text-foreground'
              }`}
            >
              <span>{categoryEmojis[c] || '📐'}</span>
              <span>{categoryDisplayNames[c] || c} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid / Layout with Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Sticky Desktop Left Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 border-r border-white/5">
          <div className="flex flex-col gap-6">
            
            {/* Category Filter Group */}
            <div>
              <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-3">
                Specific Categories
              </h3>
              
              <nav className="flex flex-col gap-1">
                {categories.map(c => {
                  const isActive = selectedCategory === c;
                  const count = c === 'All' ? initialDocs.length : (categoryCounts[c] || 0);
                  return (
                    <button
                      key={c}
                      onClick={() => setSelectedCategory(c)}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between group ${
                        isActive
                          ? 'bg-primary/20 text-primary font-bold border border-primary/30'
                          : 'text-foreground/70 hover:bg-white/5 hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span>{categoryEmojis[c] || '📐'}</span>
                        <span className="truncate">{categoryDisplayNames[c] || c}</span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 ml-1 ${
                        isActive ? 'bg-primary/30 text-white' : 'bg-white/5 text-foreground/40'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Index Group */}
            <div>
              <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-3">
                Filtered Blueprints ({filteredDocs.length})
              </h3>
              
              <nav className="flex flex-col gap-1">
                {filteredDocs.map(doc => (
                  <a 
                    key={doc.id}
                    href={`#${doc.id}`}
                    className="text-xs text-foreground/60 hover:text-primary transition-all py-1.5 pl-2.5 border-l-2 border-transparent hover:border-primary/60 block truncate"
                  >
                    {doc.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* In-Browser Dev Tools Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-primary/5 to-black border border-amber-500/20 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                <span>⚡</span>
                <span>In-Browser Design Tools</span>
              </div>
              <p className="text-[11px] text-foreground/70 leading-relaxed">
                Test capacity estimations, latency hierarchy orders of magnitude, and JWT/Base64 encoding offline with zero signup.
              </p>
              <Link
                href="/tools"
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[11px] font-bold py-2 px-3 rounded-xl transition-all text-center mt-1"
              >
                Launch Toolbox & Sandboxes &rarr;
              </Link>
            </div>

            {/* NotebookLM AI Grounding Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/30 via-primary/10 to-black border border-purple-500/30 flex flex-col gap-2.5">
              <div className="flex items-center gap-1.5 text-purple-300 text-xs font-bold">
                <span>🤖</span>
                <span>NotebookLM Grounding</span>
              </div>
              <p className="text-[11px] text-foreground/70 leading-relaxed">
                Export all {initialDocs.length} blueprints into a single Markdown file to generate 15-min audio podcasts.
              </p>
              <div className="flex flex-col gap-1.5 pt-1">
                <a
                  href="/api/notebooklm/export?pack=system-design"
                  className="bg-primary hover:bg-primary-dark text-white text-[11px] font-bold py-2 px-3 rounded-xl transition-all text-center shadow-md"
                >
                  ⬇️ Download Grounding Pack
                </a>
                <a
                  href="/notebooklm"
                  className="text-[10px] text-purple-300 hover:underline text-center mt-0.5"
                >
                  View Master Prompts & Guide &rarr;
                </a>
              </div>
            </div>

            {/* Golden Standard External Guides */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                ⭐ Golden References
              </span>
              
              <a 
                href="https://github.com/donnemartin/system-design-primer" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col gap-0.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
              >
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span>System Design Primer</span>
                  <span className="text-[10px] text-amber-400 font-mono">270k+ ★</span>
                </div>
                <span className="text-[10px] text-foreground/50">Donne Martin · Step-by-step HLD</span>
              </a>

              <a 
                href="https://bytebytego.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col gap-0.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
              >
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span>ByteByteGo</span>
                  <span className="text-[10px] text-primary font-mono">Visuals</span>
                </div>
                <span className="text-[10px] text-foreground/50">Alex Xu · Architectural Diagrams</span>
              </a>

              <a 
                href="https://github.com/ept/ddia-references" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col gap-0.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
              >
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span>DDIA Key Summaries</span>
                  <span className="text-[10px] text-green-400 font-mono">Staff</span>
                </div>
                <span className="text-[10px] text-foreground/50">Martin Kleppmann · Data Systems</span>
              </a>
            </div>

          </div>
        </aside>

        {/* Content list */}
        <main className="lg:col-span-3 flex flex-col gap-8">
          {filteredDocs.length === 0 ? (
            <div className="text-center py-16 text-foreground/40 glass-card p-8">
              No system design guides found matching your query or scope filter.
            </div>
          ) : (
            filteredDocs.map(doc => (
              <article key={doc.id} id={doc.id} className="glass-card p-8 md:p-10 flex flex-col gap-6 scroll-mt-24 border-white/5 hover:border-primary/30 transition-all">
                
                {/* Meta header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider flex items-center gap-1">
                      <span>{categoryEmojis[doc.category || ''] || '📐'}</span>
                      <span>{categoryDisplayNames[doc.category || ''] || doc.category || 'Architecture'}</span>
                    </span>
                    {doc.difficulty && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-white/5 text-foreground/70">
                        {doc.difficulty}
                      </span>
                    )}
                  </div>

                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {doc.tags.map(t => (
                        <span key={t} className="text-[10px] text-foreground/50 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Article body */}
                <div className="prose-dark max-w-none">
                  <MarkdownRenderer content={doc.content} />
                </div>
              </article>
            ))
          )}
        </main>

      </div>

    </div>
  );
}
