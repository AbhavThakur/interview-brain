'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

export default function CreateContentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('qa');
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/fs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, name, group })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create content');
      
      setIsOpen(false);
      setName('');
      setGroup('');
      
      // Navigate to the editor for the new file
      router.push(`/editor?file=${encodeURIComponent(data.fileName)}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary hover:bg-primary hover:text-white transition-colors"
        title="Create New Content"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
        >
          <div className="bg-[#15181e] border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold mb-6">Create New Content</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground/80">Content Type</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors appearance-none"
                >
                  <option value="qa" className="bg-[#1e222a]">Q&A Bank Question</option>
                  <option value="topic" className="bg-[#1e222a]">Evergreen Topic</option>
                  <option value="code" className="bg-[#1e222a]">Code Snippet</option>
                  <option value="story" className="bg-[#1e222a]">STAR Story</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground/80">
                  {type === 'qa' ? 'Topic / Filename (e.g. javascript)' : 'Title'}
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={type === 'qa' ? "javascript" : "e.g. React Hooks"}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  autoFocus
                  required
                />
              </div>

              {(type === 'topic' || type === 'code') && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground/80">Category / Subfolder (Optional)</label>
                  <input 
                    type="text" 
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    placeholder={type === 'code' ? "e.g. arrays, sorting" : "e.g. react, system-design"}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              )}

              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

              <div className="flex gap-4 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-medium bg-white/5 text-foreground/80 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading || !name}
                  className="flex-1 px-4 py-3 rounded-xl font-medium bg-primary text-background hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create & Edit'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
