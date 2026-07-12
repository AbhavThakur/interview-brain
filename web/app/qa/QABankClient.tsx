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

  // Extract unique topics
  const topics = useMemo(() => {
    const t = new Set(initialQuestions.map(q => q.topic));
    return ['All', ...Array.from(t).sort()];
  }, [initialQuestions]);

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
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">QA Bank</h1>
          <p className="text-foreground/60 mt-2">
            Every question ever asked. ({filteredQuestions.length} of {initialQuestions.length} shown)
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
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

          {/* Topic Filter */}
          <select 
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full sm:w-auto bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
          >
            {topics.map(t => (
              <option key={t} value={t} className="bg-[#1e222a] text-foreground">{t === 'All' ? 'All Topics' : t}</option>
            ))}
          </select>

          {/* Search Input */}
          <div className="w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search questions or tags..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 text-foreground/40">No questions found matching your criteria.</div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedIds.has(q.id);
            return (
              <div 
                key={q.id} 
                className="glass-card flex flex-col transition-all duration-300 overflow-hidden"
              >
                {/* Header (Always visible, clickable) */}
                <div 
                  onClick={() => toggleExpand(q.id)}
                  className="p-6 flex items-start justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors select-none"
                >
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/25 text-primary uppercase tracking-wider shrink-0">
                        {q.topic}
                      </span>
                      <h2 className="text-lg font-semibold leading-snug text-foreground/90">{q.question}</h2>
                    </div>

                    {(q.tags.length > 0 || q.askedAt) && (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-foreground/50 mt-1">
                        {q.tags.length > 0 && (
                          <div className="flex gap-1.5 items-center">
                            <span className="font-semibold text-foreground/30 uppercase tracking-wider text-[10px]">TAGS:</span>
                            {q.tags.map(tag => (
                              <span key={tag} className="bg-white/5 px-2 py-0.5 rounded border border-white/5 text-foreground/60">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {q.askedAt && (
                          <div className="flex gap-1.5 items-center">
                            <span className="font-semibold text-foreground/30 uppercase tracking-wider text-[10px]">ASKED AT:</span>
                            <span className="text-primary-dark/80">{q.askedAt}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-foreground/40 mt-1 shrink-0">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>

                {/* Collapsible Content */}
                <div 
                  className={`transition-all duration-300 ease-in-out border-t border-white/5 ${
                    isExpanded 
                      ? 'max-h-[2000px] opacity-100 p-6' 
                      : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="prose-dark">
                    <MarkdownRenderer content={q.answer} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
