'use client';

import { useState, useMemo } from 'react';
import { ResourceItem } from '@/lib/markdown';
import { useProgress } from '@/lib/useProgress';

const categoryLabels: Record<string, string> = {
  all: 'All Categories',
  'ai-ml': '🤖 AI & LLM Engineering',
  backend: '⚙️ Backend & Distributed',
  frontend: '⚛️ Frontend & Web',
  'company-guides': '🏢 Company Prep (FAANG+)',
  'system-design': '📐 System Design & HLD',
  dsa: '🧠 DSA & Algorithms',
  blogs: '🌐 Engineering Blogs (30+)',
  mobile: '📱 Mobile & React Native',
  behavioral: '⭐ Behavioral & Careers'
};

export default function ResourcesClient({ initialResources }: { initialResources: ResourceItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);
  const [randomBlog, setRandomBlog] = useState<ResourceItem | null>(null);

  const { progress, toggleBookmark } = useProgress();

  const categories = useMemo(() => {
    return ['all', 'ai-ml', 'backend', 'frontend', 'company-guides', 'system-design', 'dsa', 'blogs', 'mobile', 'behavioral'];
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

  const blogList = useMemo(() => {
    return initialResources.filter(r => r.category === 'blogs');
  }, [initialResources]);

  const handlePickRandomBlog = () => {
    if (blogList.length === 0) return;
    const randomIndex = Math.floor(Math.random() * blogList.length);
    setRandomBlog(blogList[randomIndex]);
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Resource Hub & Engineering Blogs</h1>
          <p className="text-foreground/60 mt-1 max-w-2xl text-sm">
            Hand-picked industry resources, practice sheets, authoritative architecture specs, and 30+ top tech company engineering blogs.
          </p>
        </div>

        {/* Search, Bookmark toggle & Random Blog Picker */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button
            onClick={handlePickRandomBlog}
            className="flex items-center gap-1.5 bg-gradient-to-r from-primary/20 to-purple-500/20 hover:from-primary/30 hover:to-purple-500/30 text-white border border-primary/30 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95"
            title="Pick a random engineering blog to read this week"
          >
            <span>🎲 Random Weekly Blog</span>
          </button>

          <label className="flex items-center gap-2 text-xs text-foreground/75 cursor-pointer select-none bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
            <input 
              type="checkbox" 
              checked={onlyBookmarked}
              onChange={(e) => setOnlyBookmarked(e.target.checked)}
              className="rounded border-white/10 bg-white/5 text-primary focus:ring-primary w-4 h-4"
            />
            <span>Bookmarked ({progress.bookmarkedResources.length})</span>
          </label>

          <div className="w-full sm:w-60">
            <input 
              type="text" 
              placeholder="Search by company, topic..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/40"
            />
          </div>
        </div>
      </div>

      {/* Random Blog Highlight Banner */}
      {randomBlog && (
        <div className="glass-card p-6 border-purple-500/30 bg-purple-500/5 animate-in zoom-in-95 duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded uppercase">
                🎯 This Week&apos;s Recommended Architecture Read
              </span>
              <span className="text-xs font-mono text-foreground/40">{randomBlog.platform}</span>
            </div>
            <h3 className="text-lg font-bold text-foreground">{randomBlog.title}</h3>
            <p className="text-xs text-foreground/70">{randomBlog.description}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={randomBlog.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary-dark text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-primary/20"
            >
              Open Blog ↗
            </a>
            <button
              onClick={() => setRandomBlog(null)}
              className="text-xs text-foreground/40 hover:text-foreground p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Weekly Blog Study Framework Callout */}
      {selectedCategory === 'blogs' && (
        <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex flex-col gap-3">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
            💡 How Senior Engineers Read Architecture Blogs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-foreground/75">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <strong className="text-foreground block mb-1">1. Identify the Core Bottleneck</strong>
              <p>What problem was this company facing? (e.g. Scaling Kafka to 10M msg/s, p99 latency spikes, split-brain in DB).</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <strong className="text-foreground block mb-1">2. Note the Architecture Choice</strong>
              <p>Why did they choose this pattern over alternatives? (e.g. ScyllaDB vs Cassandra, JSI vs Bridge, Redis Lua scripts).</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <strong className="text-foreground block mb-1">3. Study Tradeoffs & Failures</strong>
              <p>What were the failure modes? How did they maintain backward compatibility and zero-downtime migrations?</p>
            </div>
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
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
                  <span className="text-[11px] text-foreground/40">
                    {res.category === 'blogs' ? 'Tech Blog' : 'External Guide'}
                  </span>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-primary/15 hover:bg-primary text-primary hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all group-hover:scale-105"
                  >
                    <span>{res.category === 'blogs' ? 'Visit Blog' : 'Launch Resource'}</span>
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
