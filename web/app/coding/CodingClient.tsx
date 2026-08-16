'use client';

import { useState, useMemo } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { CodingProblem } from '@/lib/markdown';
import { useProgress, ProblemStatus } from '@/lib/useProgress';

const statusConfig: Record<ProblemStatus, { label: string; badgeClass: string; icon: string }> = {
  todo: { label: 'To-Do', badgeClass: 'bg-white/5 text-foreground/50 border border-white/5', icon: '⭕' },
  attempted: { label: 'Attempted', badgeClass: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20', icon: '⏳' },
  review: { label: 'Review', badgeClass: 'bg-orange-500/20 text-orange-400 border border-orange-500/20', icon: '⚠️' },
  solved: { label: 'Solved', badgeClass: 'bg-green-500/20 text-green-400 border border-green-500/20', icon: '✅' },
};

export default function CodingClient({ initialCodes }: { initialCodes: CodingProblem[] }) {
  const [selectedPattern, setSelectedPattern] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const { progress, setProblemStatus } = useProgress();

  // Extract unique patterns
  const patterns = useMemo(() => {
    const p = new Set(initialCodes.map(c => c.pattern || c.group || 'General'));
    return ['All', ...Array.from(p).sort()];
  }, [initialCodes]);

  // Filter problems
  const filteredCodes = useMemo(() => {
    return initialCodes.filter(c => {
      const patternName = c.pattern || c.group || 'General';
      const status = progress.codingStatus[c.id] || 'todo';

      const matchesPattern = selectedPattern === 'All' || patternName === selectedPattern;
      const matchesDifficulty = selectedDifficulty === 'All' || c.difficulty === selectedDifficulty;
      const matchesStatus = selectedStatus === 'All' || status === selectedStatus;
      const matchesSearch = 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.ahHaInsight && c.ahHaInsight.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesPattern && matchesDifficulty && matchesStatus && matchesSearch;
    });
  }, [initialCodes, selectedPattern, selectedDifficulty, selectedStatus, searchQuery, progress.codingStatus]);

  // Overall stats
  const stats = useMemo(() => {
    let solved = 0;
    let review = 0;
    let attempted = 0;
    let todo = 0;

    initialCodes.forEach(c => {
      const status = progress.codingStatus[c.id] || 'todo';
      if (status === 'solved') solved++;
      else if (status === 'review') review++;
      else if (status === 'attempted') attempted++;
      else todo++;
    });

    return { solved, review, attempted, todo, total: initialCodes.length };
  }, [initialCodes, progress.codingStatus]);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header with Stats Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider">
              Practice Matrix
            </span>
            <span className="text-xs text-foreground/40 font-mono">
              {stats.solved} / {stats.total} Solved ({Math.round((stats.solved / (stats.total || 1)) * 100)}%)
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Coding & Algorithmic Patterns</h1>
          <p className="text-foreground/60 mt-1 max-w-2xl text-sm">
            Core interview algorithms and machine-coding challenges mapped directly to Blind 75, NeetCode 150, and BFE.dev.
          </p>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2 rounded-2xl">
          <div className="text-center px-3">
            <span className="text-[10px] text-foreground/40 block uppercase">Solved</span>
            <span className="text-sm font-bold text-green-400">{stats.solved}</span>
          </div>
          <div className="w-[1px] h-6 bg-white/10"></div>
          <div className="text-center px-3">
            <span className="text-[10px] text-foreground/40 block uppercase">Review</span>
            <span className="text-sm font-bold text-orange-400">{stats.review}</span>
          </div>
          <div className="w-[1px] h-6 bg-white/10"></div>
          <div className="text-center px-3">
            <span className="text-[10px] text-foreground/40 block uppercase">To-Do</span>
            <span className="text-sm font-bold text-foreground/60">{stats.todo + stats.attempted}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Pattern Filter */}
          <select 
            value={selectedPattern}
            onChange={(e) => setSelectedPattern(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
          >
            {patterns.map(p => (
              <option key={p} value={p} className="bg-[#1e222a] text-foreground">{p === 'All' ? 'All Patterns' : p}</option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select 
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
          >
            <option value="All" className="bg-[#1e222a]">All Difficulties</option>
            <option value="Easy" className="bg-[#1e222a]">Easy</option>
            <option value="Medium" className="bg-[#1e222a]">Medium</option>
            <option value="Hard" className="bg-[#1e222a]">Hard</option>
          </select>

          {/* Status Filter */}
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
          >
            <option value="All" className="bg-[#1e222a]">All Statuses</option>
            <option value="solved" className="bg-[#1e222a]">Solved ✅</option>
            <option value="review" className="bg-[#1e222a]">Needs Review ⚠️</option>
            <option value="attempted" className="bg-[#1e222a]">Attempted ⏳</option>
            <option value="todo" className="bg-[#1e222a]">To-Do ⭕</option>
          </select>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${viewMode === 'cards' ? 'bg-primary text-white' : 'text-foreground/50 hover:text-foreground'}`}
              title="Cards View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${viewMode === 'table' ? 'bg-primary text-white' : 'text-foreground/50 hover:text-foreground'}`}
              title="Table View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
            </button>
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-60">
            <input 
              type="text" 
              placeholder="Search problem, trick..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Main List */}
      {filteredCodes.length === 0 ? (
        <div className="text-center py-16 glass-card p-8 text-foreground/40">
          No coding problems found matching your criteria.
        </div>
      ) : viewMode === 'table' ? (
        // TABLE VIEW
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-foreground/40 uppercase font-semibold text-[10px] tracking-wider">
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Problem Name</th>
                  <th className="py-3 px-4">Pattern</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Ah-Ha! Key Insight</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCodes.map(code => {
                  const status = progress.codingStatus[code.id] || 'todo';
                  return (
                    <tr key={code.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <select
                          value={status}
                          onChange={(e) => setProblemStatus(code.id, e.target.value as ProblemStatus)}
                          className={`text-[11px] font-medium px-2 py-1 rounded-lg focus:outline-none cursor-pointer ${statusConfig[status].badgeClass}`}
                        >
                          <option value="todo" className="bg-[#1e222a]">⭕ To-Do</option>
                          <option value="attempted" className="bg-[#1e222a]">⏳ Attempted</option>
                          <option value="review" className="bg-[#1e222a]">⚠️ Review</option>
                          <option value="solved" className="bg-[#1e222a]">✅ Solved</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 font-semibold text-foreground">
                        <button onClick={() => toggleExpand(code.id)} className="hover:text-primary transition-colors text-left">
                          {code.title}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-foreground/60">{code.pattern}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          code.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                          code.difficulty === 'Medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {code.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-foreground/75 max-w-xs truncate">
                        {code.ahHaInsight || '—'}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                        {code.leetcodeUrl && (
                          <a
                            href={code.leetcodeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-primary hover:text-white px-2 py-1 bg-primary/10 rounded hover:bg-primary transition-all font-semibold"
                          >
                            Solve ↗
                          </a>
                        )}
                        <button
                          onClick={() => toggleExpand(code.id)}
                          className="px-2 py-1 bg-white/5 text-foreground/70 hover:text-white rounded hover:bg-white/10 transition-colors"
                        >
                          {expandedId === code.id ? 'Close' : 'Notes'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // CARDS VIEW
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCodes.map(code => {
            const status = progress.codingStatus[code.id] || 'todo';
            const isExpanded = expandedId === code.id;

            return (
              <div 
                key={code.id}
                id={code.id}
                className="glass-card p-6 flex flex-col justify-between gap-4 border-white/5 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex flex-col gap-3">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider">
                        {code.pattern}
                      </span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                        code.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                        code.difficulty === 'Medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {code.difficulty}
                      </span>
                    </div>

                    {/* Status dropdown */}
                    <select
                      value={status}
                      onChange={(e) => setProblemStatus(code.id, e.target.value as ProblemStatus)}
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-lg focus:outline-none cursor-pointer ${statusConfig[status].badgeClass}`}
                    >
                      <option value="todo" className="bg-[#1e222a]">⭕ To-Do</option>
                      <option value="attempted" className="bg-[#1e222a]">⏳ Attempted</option>
                      <option value="review" className="bg-[#1e222a]">⚠️ Review</option>
                      <option value="solved" className="bg-[#1e222a]">✅ Solved</option>
                    </select>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground">
                    {code.title}
                  </h3>

                  {/* Ah-Ha Insight */}
                  {code.ahHaInsight && (
                    <div className="bg-primary/10 border-l-2 border-primary p-2.5 rounded-r-lg text-xs text-foreground/80">
                      <span className="font-semibold text-primary">💡 Ah-Ha Trick: </span>
                      {code.ahHaInsight}
                    </div>
                  )}

                  {/* Complexity tags */}
                  {(code.timeComplexity || code.spaceComplexity) && (
                    <div className="flex items-center gap-3 text-[11px] text-foreground/50 font-mono">
                      {code.timeComplexity && <span>Time: {code.timeComplexity}</span>}
                      {code.spaceComplexity && <span>Space: {code.spaceComplexity}</span>}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="border-t border-white/5 pt-3 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleExpand(code.id)}
                    className="text-xs font-semibold text-foreground/70 hover:text-white flex items-center gap-1"
                  >
                    <span>{isExpanded ? 'Hide Solution Notes' : 'View Solution Notes'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
                  </button>

                  {code.leetcodeUrl && (
                    <a
                      href={code.leetcodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold bg-primary/15 hover:bg-primary text-primary hover:text-white px-3 py-1.5 rounded-lg transition-all"
                    >
                      <span>Solve on Platform</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  )}
                </div>

                {/* Collapsible Solution Content */}
                {isExpanded && (
                  <div className="border-t border-white/10 pt-4 mt-2 prose-dark max-w-none text-xs">
                    <MarkdownRenderer content={code.content} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Expanded Solution for Table View */}
      {viewMode === 'table' && expandedId && (
        <div className="glass-card p-6 mt-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <h3 className="text-lg font-bold">
              {filteredCodes.find(c => c.id === expandedId)?.title}
            </h3>
            <button onClick={() => setExpandedId(null)} className="text-xs text-foreground/50 hover:text-white">
              Close ✕
            </button>
          </div>
          <div className="prose-dark max-w-none">
            <MarkdownRenderer content={filteredCodes.find(c => c.id === expandedId)?.content || ''} />
          </div>
        </div>
      )}

    </div>
  );
}
