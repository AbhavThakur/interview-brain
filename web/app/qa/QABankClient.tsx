'use client';

import { useState, useMemo } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';

type Question = {
  id: string;
  topic: string;
  question: string;
  tags: string[];
  askedAt: string;
  answer: string;
};

export default function QABankClient({ initialQuestions }: { initialQuestions: Question[] }) {
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Extract unique topics with counts
  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    initialQuestions.forEach(q => {
      counts[q.topic] = (counts[q.topic] || 0) + 1;
    });
    return counts;
  }, [initialQuestions]);

  const topics = useMemo(() => {
    return ['All', ...Object.keys(topicCounts).sort()];
  }, [topicCounts]);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return initialQuestions.filter(q => {
      const matchesTopic = selectedTopic === 'All' || q.topic === selectedTopic;
      const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            q.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTopic && matchesSearch;
    });
  }, [initialQuestions, selectedTopic, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(filteredQuestions.map(q => q.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider">
              Question Archive
            </span>
            <span className="text-xs text-foreground/40 font-mono">
              {filteredQuestions.length} of {initialQuestions.length} questions
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">QA Bank & Interview Solutions</h1>
          <p className="text-foreground/60 mt-1 max-w-2xl text-sm">
            Curated questions asked at top product firms with detailed explanations, code solutions, and tag indexing.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Bulk actions */}
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button 
              onClick={expandAll}
              className="text-xs font-medium px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
            >
              Expand All
            </button>
            <button 
              onClick={collapseAll}
              className="text-xs font-medium px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
            >
              Collapse All
            </button>
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search questions or tags..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/40"
            />
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Horizontal Topic Filter Bar */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTopic(t)}
            className={`text-xs font-medium px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all capitalize ${
              selectedTopic === t
                ? 'bg-primary text-white shadow-lg shadow-primary/25 font-semibold'
                : 'bg-white/5 text-foreground/70 hover:bg-white/10 hover:text-foreground'
            }`}
          >
            {t === 'All' ? `All (${initialQuestions.length})` : `${t} (${topicCounts[t] || 0})`}
          </button>
        ))}
      </div>

      {/* Main Layout with Sticky Left Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Sticky Desktop Left Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 border-r border-white/5">
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider">
              Topic Filter
            </h3>
            
            <nav className="flex flex-col gap-1">
              {topics.map((t) => {
                const isActive = selectedTopic === t;
                const count = t === 'All' ? initialQuestions.length : (topicCounts[t] || 0);
                return (
                  <button
                    key={t}
                    onClick={() => setSelectedTopic(t)}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between capitalize ${
                      isActive
                        ? 'bg-primary/20 text-primary font-bold border border-primary/30'
                        : 'text-foreground/70 hover:bg-white/5 hover:text-foreground'
                    }`}
                  >
                    <span>{t === 'All' ? 'All Topics' : t}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-primary/30 text-white' : 'bg-white/5 text-foreground/40'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Questions List */}
        <main className="lg:col-span-3 flex flex-col gap-4">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-16 text-foreground/40 glass-card p-8">
              No questions found matching your criteria.
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const isExpanded = expandedIds.has(q.id);
              return (
                <div 
                  key={q.id} 
                  className="glass-card flex flex-col transition-all duration-300 overflow-hidden border-white/5 hover:border-primary/30"
                >
                  {/* Header (Always visible, clickable) */}
                  <div 
                    onClick={() => toggleExpand(q.id)}
                    className="p-6 flex items-start justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors select-none"
                  >
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider shrink-0">
                          {q.topic}
                        </span>
                        <h2 className="text-base font-semibold leading-snug text-foreground/90">{q.question}</h2>
                      </div>

                      {(q.tags.length > 0 || q.askedAt) && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-foreground/50 mt-1">
                          {q.tags.length > 0 && (
                            <div className="flex gap-1.5 items-center">
                              <span className="font-semibold text-foreground/30 uppercase tracking-wider text-[10px]">TAGS:</span>
                              {q.tags.map(tag => (
                                <span key={tag} className="bg-white/5 px-2 py-0.5 rounded border border-white/5 text-foreground/60 text-[10px]">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                          {q.askedAt && (
                            <div className="flex gap-1.5 items-center">
                              <span className="font-semibold text-foreground/30 uppercase tracking-wider text-[10px]">ASKED AT:</span>
                              <span className="text-primary-dark/80 font-mono text-[11px]">{q.askedAt}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-foreground/40 mt-1 shrink-0">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : ''}`}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>

                  {/* Collapsible Content */}
                  {isExpanded && (
                    <div className="p-6 border-t border-white/5 bg-black/20 animate-in fade-in duration-200">
                      <div className="prose-dark max-w-none">
                        <MarkdownRenderer content={q.answer} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </main>

      </div>

    </div>
  );
}
