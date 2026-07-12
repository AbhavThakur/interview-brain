'use client';

import { useState, useMemo } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { CodeDocument } from '@/lib/markdown';

export default function CodingClient({ initialCodes }: { initialCodes: CodeDocument[] }) {
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique groups
  const groups = useMemo(() => {
    const g = new Set(initialCodes.map(c => c.group || 'General'));
    return ['All', ...Array.from(g).sort()];
  }, [initialCodes]);

  // Filter
  const filteredCodes = useMemo(() => {
    return initialCodes.filter(c => {
      const groupName = c.group || 'General';
      const matchesGroup = selectedGroup === 'All' || groupName === selectedGroup;
      const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGroup && matchesSearch;
    });
  }, [initialCodes, selectedGroup, searchQuery]);

  // Group for display
  const groupedCodes = useMemo(() => {
    return filteredCodes.reduce((acc, code) => {
      const group = code.group || 'General';
      if (!acc[group]) acc[group] = [];
      acc[group].push(code);
      return acc;
    }, {} as Record<string, typeof filteredCodes>);
  }, [filteredCodes]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coding Examples</h1>
          <p className="text-foreground/60 mt-2">
            Algorithms, snippets, and practical code for interviews. ({filteredCodes.length} of {initialCodes.length} shown)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Group Filter */}
          <select 
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
          >
            {groups.map(g => (
              <option key={g} value={g} className="bg-[#1e222a] text-foreground">{g === 'All' ? 'All Categories' : g}</option>
            ))}
          </select>

          {/* Search Input */}
          <div className="w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search code..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Quick Navigation */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 border-r border-white/5">
          <h3 className="text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-4">Code Snippets</h3>
          <nav className="flex flex-col gap-1.5">
            {filteredCodes.map(code => (
              <a 
                key={code.id}
                href={`#${code.id}`}
                className="text-xs text-foreground/60 hover:text-primary transition-all py-1 pl-2 border-l border-transparent hover:border-primary/40 block truncate"
              >
                {code.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main list */}
        <div className="lg:col-span-3 flex flex-col gap-12">
          {Object.keys(groupedCodes).length === 0 ? (
            <div className="text-center py-12 text-foreground/40">No code snippets found matching your criteria.</div>
          ) : (
            Object.entries(groupedCodes).map(([group, codes]) => (
              <section key={group} className="flex flex-col gap-6">
                <h2 className="text-xl font-bold capitalize text-primary flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-primary/50"></span>
                  {group}
                  <span className="flex-1 h-[1px] bg-white/5"></span>
                </h2>
                
                <div className="grid gap-6">
                  {codes.map(code => (
                    <div key={code.id} id={code.id} className="glass-card p-6 flex flex-col gap-4 scroll-mt-24 border-primary/20">
                      <h3 className="text-2xl font-bold">{code.title}</h3>
                      <div className="prose-dark max-w-none mt-2">
                        <MarkdownRenderer content={code.content} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
