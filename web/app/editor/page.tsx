'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Link from 'next/link';

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20 text-primary animate-pulse">Loading Editor...</div>}>
      <EditorContent />
    </Suspense>
  );
}

function EditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fileName = searchParams.get('file');

  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [absolutePath, setAbsolutePath] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const [isEditing, setIsEditing] = useState(false);

  // Fetch the file on load
  useEffect(() => {
    if (!fileName) {
      setError('No file specified.');
      setLoading(false);
      return;
    }

    fetch(`/api/fs?file=${encodeURIComponent(fileName)}`)
      .then(res => {
        if (!res.ok) throw new Error('File not found or cannot be read.');
        return res.json();
      })
      .then(data => {
        setContent(data.content);
        setOriginalContent(data.content);
        setAbsolutePath(data.absolutePath);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [fileName]);

  const handleSave = useCallback(async () => {
    if (!absolutePath || content === originalContent || saving) return;
    
    setSaving(true);
    setSaveMessage('');
    
    try {
      const res = await fetch('/api/fs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ absolutePath, content })
      });
      
      if (!res.ok) throw new Error('Failed to save file.');
      
      setOriginalContent(content);
      setSaveMessage('Saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
      setIsEditing(false); // Switch back to view mode after saving
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [absolutePath, content, originalContent, saving]);

  // Cmd+S shortcut support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditing && (e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, isEditing]);

  const handleCancel = () => {
    setContent(originalContent);
    setIsEditing(false);
  };

  if (loading) {
    return <div className="p-8 text-primary animate-pulse">Loading File...</div>;
  }

  if (error) {
    return (
      <div className="p-8 flex flex-col items-start gap-4">
        <h1 className="text-2xl font-bold text-red-400">Error</h1>
        <p className="text-foreground/80">{error}</p>
        <button onClick={() => router.back()} className="text-primary underline">Go Back</button>
      </div>
    );
  }

  const hasChanges = content !== originalContent;
  const isReadOnly = process.env.NODE_ENV === 'production';

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-foreground/60 hover:text-foreground transition-colors">
            ← Back
          </button>
          <div>
            <h1 className="text-xl font-bold">{fileName}</h1>
            <p className="text-xs text-foreground/40 font-mono mt-1">{absolutePath}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {saveMessage && <span className="text-green-400 text-sm animate-in fade-in">{saveMessage}</span>}
          
          {!isEditing ? (
            !isReadOnly && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-lg font-medium transition-all bg-white/10 text-foreground hover:bg-white/20"
              >
                Edit File
              </button>
            )
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg font-medium transition-all bg-transparent text-foreground/60 hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  hasChanges && !saving 
                    ? 'bg-primary text-background hover:bg-primary-dark hover:scale-105' 
                    : 'bg-white/5 text-foreground/30 cursor-not-allowed'
                }`}
              >
                {saving ? 'Saving...' : hasChanges ? 'Save Changes' : 'Saved'}
              </button>
            </>
          )}
        </div>
      </div>

      {isReadOnly && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-4 rounded-xl text-xs mb-6 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <p>
            <strong>Read-Only Mode:</strong> Editing is disabled in the production static deployment. To edit these files, run the application locally.
          </p>
        </div>
      )}

      {/* Main Content Area */}
      {isEditing ? (
        // Split Pane (Edit Mode)
        <div className="flex-1 flex gap-6 overflow-hidden">
          <div className="flex-1 glass-card p-4 flex flex-col">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full flex-1 bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed text-foreground/90 custom-scrollbar"
              spellCheck={false}
              autoFocus
            />
          </div>
          <div className="flex-1 glass-card p-6 overflow-y-auto custom-scrollbar">
            <div className="prose-dark max-w-none">
              <MarkdownRenderer content={content} />
            </div>
          </div>
        </div>
      ) : (
        // Single Pane (View Mode)
        <div className="flex-1 glass-card p-8 md:p-12 overflow-y-auto custom-scrollbar mx-auto w-full max-w-4xl">
          <div className="prose-dark max-w-none">
            <MarkdownRenderer content={content} />
          </div>
        </div>
      )}
    </div>
  );
}
