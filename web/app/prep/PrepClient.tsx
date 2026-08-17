'use client';

import { useState } from 'react';
import { MarkdownDocument } from '@/lib/markdown';
import MarkdownRenderer from '@/components/MarkdownRenderer';

export default function PrepClient({ initialDocs }: { initialDocs: MarkdownDocument[] }) {
  const [selectedDocId, setSelectedDocId] = useState<string>(initialDocs[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = initialDocs.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeDoc = initialDocs.find(d => d.id === selectedDocId) || filteredDocs[0];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider">
              Company Targeting
            </span>
            <span className="text-xs text-foreground/40 font-mono">
              {initialDocs.length} company sheets
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Company-Specific Interview Prep</h1>
          <p className="text-foreground/60 mt-1 max-w-2xl text-sm">
            Tailored preparation sheets, job description keywords, past interview questions, and chosen project stories per target company.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Search company or notes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/40"
          />
        </div>
      </div>

      {initialDocs.length === 0 ? (
        <div className="glass-card p-12 text-center text-foreground/40">
          No company prep files found in <code className="bg-white/5 px-2 py-1 rounded">04-companies/</code>. Use the &ldquo;+&rdquo; button in the navigation to create one!
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Sticky Left Sidebar */}
          <aside className="lg:col-span-1 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 border-r border-white/5">
            <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-3">
              Target Companies
            </h3>
            
            <nav className="flex flex-col gap-1.5">
              {filteredDocs.map((doc) => {
                const isActive = activeDoc?.id === doc.id;
                return (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-primary/20 text-primary border border-primary/30 shadow-md'
                        : 'text-foreground/70 hover:bg-white/5 hover:text-foreground'
                    }`}
                  >
                    <span className="truncate">{doc.title}</span>
                    <span className="text-[10px] text-foreground/40">→</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Prep Document View */}
          <main className="lg:col-span-3">
            {activeDoc ? (
              <div className="glass-card p-8 md:p-12 border-l-4 border-l-primary/60">
                <div className="prose-dark max-w-none">
                  <MarkdownRenderer content={activeDoc.content} />
                </div>
              </div>
            ) : (
              <div className="glass-card p-12 text-center text-foreground/40">
                No company document selected.
              </div>
            )}
          </main>

        </div>
      )}

    </div>
  );
}
