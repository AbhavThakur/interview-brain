'use client';

import { useState, useMemo } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { MarkdownDocument } from '@/lib/markdown';

export default function SystemDesignClient({ initialDocs }: { initialDocs: MarkdownDocument[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract categories
  const categories = useMemo(() => {
    const c = new Set(initialDocs.map(d => d.category || 'Architecture'));
    return ['All', ...Array.from(c).sort()];
  }, [initialDocs]);

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
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider">
              Senior & Staff Architecture
            </span>
            <span className="text-xs text-foreground/40 font-mono">
              {filteredDocs.length} architecture blueprints
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">System Design & Mobile Architecture</h1>
          <p className="text-foreground/60 mt-1 max-w-2xl text-sm">
            End-to-end distributed system blueprints, mobile performance architecture, list virtualization, and offline-first data sync engines.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
          >
            {categories.map(c => (
              <option key={c} value={c} className="bg-[#1e222a] text-foreground">{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>

          {/* Search */}
          <div className="w-full sm:w-60">
            <input 
              type="text" 
              placeholder="Search architecture..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Main Grid / Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Sidebar Nav */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 border-r border-white/5">
          <h3 className="text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-4">Architecture Index</h3>
          <nav className="flex flex-col gap-1.5">
            {filteredDocs.map(doc => (
              <a 
                key={doc.id}
                href={`#${doc.id}`}
                className="text-xs text-foreground/60 hover:text-primary transition-all py-1 pl-2 border-l border-transparent hover:border-primary/40 block truncate"
              >
                {doc.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content list */}
        <div className="lg:col-span-3 flex flex-col gap-10">
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
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider">
                      {doc.category || 'Architecture'}
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
                        <span key={t} className="text-[10px] text-foreground/50 bg-white/5 px-2 py-0.5 rounded">
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
        </div>

      </div>

    </div>
  );
}
