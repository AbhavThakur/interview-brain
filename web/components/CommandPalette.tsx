'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { SearchItem } from '@/lib/markdown';

const typeIcons: Record<string, string> = {
  qa: '🧠',
  topic: '📚',
  coding: '💻',
  'system-design': '📐',
  story: '⭐',
  resource: '🌐'
};

const typeLabels: Record<string, string> = {
  qa: 'QA Bank',
  topic: 'Topics',
  coding: 'Coding',
  'system-design': 'System Design',
  story: 'STAR Stories',
  resource: 'Resource Hub'
};

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Fetch search index
    fetch('/api/search')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setItems(data);
      })
      .catch(err => console.error('Error loading search index:', err));
  }, []);

  // Global hotkey listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Filter items
  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return items.slice(0, 10); // show top 10 by default
    }
    const q = query.toLowerCase();
    return items.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q))
    ).slice(0, 20);
  }, [items, query]);

  // Handle keyboard selection
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredItems[selectedIndex];
      if (selected) {
        handleSelect(selected);
      }
    }
  };

  const handleSelect = (item: SearchItem) => {
    setIsOpen(false);
    if (item.isExternal) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    } else {
      router.push(item.href);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-foreground/50 hover:text-foreground border border-white/10 px-3 py-1.5 rounded-xl text-xs transition-colors"
        title="Search (Cmd + K)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <span className="hidden sm:inline">Search notes, code & resources...</span>
        <span className="sm:hidden">Search...</span>
        <kbd className="hidden md:inline-block bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono border border-white/10">⌘K</kbd>
      </button>

      {/* Modal Dialog */}
      {mounted && isOpen && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150"
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
        >
          <div className="bg-[#14171d] border border-white/15 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search topics, questions, coding tricks, or external resources..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none outline-none text-sm text-foreground placeholder:text-foreground/40"
              />
              <button 
                onClick={() => setIsOpen(false)}
                className="text-xs text-foreground/40 hover:text-foreground bg-white/5 px-2 py-1 rounded"
              >
                ESC
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-white/5 custom-scrollbar">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12 text-xs text-foreground/40">
                  No matching results for &ldquo;{query}&rdquo;
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`p-3 rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                        isSelected ? 'bg-primary/20 text-white' : 'hover:bg-white/5 text-foreground/80'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-lg shrink-0">
                          {typeIcons[item.type] || '📄'}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate leading-tight">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-foreground/50 truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-white/5 text-foreground/50 border border-white/5">
                          {typeLabels[item.type] || item.type}
                        </span>
                        {item.isExternal && (
                          <span className="text-[10px] text-primary">↗</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="px-5 py-2.5 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-[11px] text-foreground/40">
              <div className="flex items-center gap-3">
                <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono">↑↓</kbd> to navigate</span>
                <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono">↵</kbd> to select</span>
                <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono">esc</kbd> to close</span>
              </div>
              <span className="text-primary font-medium">Interview Brain</span>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}
