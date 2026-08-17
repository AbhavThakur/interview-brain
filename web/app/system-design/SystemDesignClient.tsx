'use client';

import { useState, useMemo } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { MarkdownDocument } from '@/lib/markdown';

const categoryDisplayNames: Record<string, string> = {
  All: 'All Architecture',
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
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter docs
  const filteredDocs = useMemo(() => {
    return initialDocs.filter(d => {
      const cat = d.category || 'Architecture';
      const matchesCat = selectedCategory === 'All' || cat === selectedCategory;
      const matchesSearch = 
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.tags && d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesCat && matchesSearch;
    });
  }, [initialDocs, selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider">
              HLD & LLD Architecture
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

        <div className="w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Search HLD, LLD, patterns..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/40"
          />
        </div>
      </div>

      {/* Mobile / Tablet Category Filter Pills (Wraps cleanly without cropping) */}
      <div className="lg:hidden flex flex-wrap items-center gap-2">
        {categories.map(c => {
          const count = c === 'All' ? initialDocs.length : (categoryCounts[c] || 0);
          return (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`text-xs font-medium px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
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
                Architecture Categories
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
                Blueprints Index ({filteredDocs.length})
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
              No system design guides found matching your query.
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
