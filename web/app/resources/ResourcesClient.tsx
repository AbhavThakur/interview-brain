'use client';

import { useState, useMemo } from 'react';
import { ResourceItem } from '@/lib/markdown';
import { useProgress } from '@/lib/useProgress';

const categoryLabels: Record<string, string> = {
  all: 'All Categories',
  dsa: 'DSA & Algorithms',
  frontend: 'Frontend & Web',
  mobile: 'Mobile & React Native',
  'system-design': 'System Design',
  behavioral: 'Behavioral & Leadership'
};

export default function ResourcesClient({ initialResources }: { initialResources: ResourceItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);

  const { progress, toggleBookmark } = useProgress();

  const categories = useMemo(() => {
    return ['all', 'dsa', 'frontend', 'mobile', 'system-design', 'behavioral'];
  }, []);

  const filteredResources = useMemo(() => {
    return initialResources.filter(r => {
      const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
      const matchesSearch = 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesBookmark = !onlyBookmarked || progress.bookmarkedResources.includes(r.id);

      return matchesCategory && matchesSearch && matchesBookmark;
    });
  }, [initialResources, selectedCategory, searchQuery, onlyBookmarked, progress.bookmarkedResources]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider">
              Curated Index
            </span>
            <span className="text-xs text-foreground/40 font-mono">
              {filteredResources.length} of {initialResources.length} resources
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Resource Hub & Golden Links</h1>
          <p className="text-foreground/60 mt-1 max-w-2xl text-sm">
            Hand-picked industry resources, practice sheets, and authoritative architecture specs so you never waste time searching for high-yield prep material.
          </p>
        </div>

        {/* Search and Bookmark toggle */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <label className="flex items-center gap-2 text-xs text-foreground/75 cursor-pointer select-none bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
            <input 
              type="checkbox" 
              checked={onlyBookmarked}
              onChange={(e) => setOnlyBookmarked(e.target.checked)}
              className="rounded border-white/10 bg-white/5 text-primary focus:ring-primary w-4 h-4"
            />
            <span>Bookmarked ({progress.bookmarkedResources.length})</span>
          </label>

          <div className="w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search resources, topics, platforms..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/40"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs font-medium px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-primary text-white shadow-lg shadow-primary/25 font-semibold'
                : 'bg-white/5 text-foreground/70 hover:bg-white/10 hover:text-foreground'
            }`}
          >
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {/* Resource Grid */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-16 glass-card p-8">
          <p className="text-foreground/50 text-base">No resources found matching your current filter.</p>
          <button 
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setOnlyBookmarked(false); }}
            className="mt-4 text-xs font-semibold text-primary hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map((res) => {
            const isBookmarked = progress.bookmarkedResources.includes(res.id);
            return (
              <div 
                key={res.id} 
                className="glass-card p-6 flex flex-col justify-between gap-5 group hover:border-primary/40 transition-all duration-300 relative"
              >
                <div className="flex flex-col gap-3">
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/20">
                        {res.platform}
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/5 text-foreground/60">
                        {res.difficulty}
                      </span>
                      <span className="text-[11px] text-foreground/40 font-mono">
                        ⏱️ {res.estimatedTime}
                      </span>
                    </div>

                    {/* Bookmark Button */}
                    <button
                      onClick={() => toggleBookmark(res.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isBookmarked 
                          ? 'text-yellow-400 bg-yellow-400/10' 
                          : 'text-foreground/30 hover:text-foreground/80 hover:bg-white/5'
                      }`}
                      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Resource'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                      </svg>
                    </button>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {res.title}
                    </h3>
                    <p className="text-foreground/65 text-xs mt-2 leading-relaxed">
                      {res.description}
                    </p>
                  </div>

                  {/* Why It Matters Callout */}
                  <div className="bg-white/[0.03] border-l-2 border-primary/60 p-2.5 rounded-r-lg">
                    <p className="text-[11px] text-foreground/80 leading-relaxed">
                      <span className="font-semibold text-primary">Why it matters: </span>
                      {res.whyItMatters}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {res.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-white/5 text-foreground/50 px-2 py-0.5 rounded border border-white/5">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct Action Link */}
                <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                  <span className="text-[11px] text-foreground/40">External Guide</span>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-primary/15 hover:bg-primary text-primary hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all group-hover:scale-105"
                  >
                    <span>Launch Resource</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
