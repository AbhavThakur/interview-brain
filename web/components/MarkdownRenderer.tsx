'use client';

import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import Link from 'next/link';
import 'highlight.js/styles/github-dark.css';

function PreBlock({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = () => {
    const text = preRef.current?.innerText || '';
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative group my-4">
      <pre 
        ref={preRef} 
        {...props} 
        className="overflow-x-auto rounded-xl p-4 bg-[#161920] border border-white/10 text-xs"
      >
        {children}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 text-foreground text-[11px] px-2 py-1 rounded-md border border-white/10 flex items-center gap-1 backdrop-blur-sm"
        title="Copy Code"
      >
        {copied ? (
          <>
            <span className="text-green-400">✓</span>
            <span className="text-green-400 font-semibold">Copied</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  );
}

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        pre: PreBlock,
        a: ({ href, children, ...props }) => {
          if (!href) return <a {...props}>{children}</a>;
          
          // Intercept local .md links so VS Code links still work in the web app
          if (href.endsWith('.md') && !href.startsWith('http')) {
             const parts = href.split('/');
             const fileName = parts[parts.length - 1];
             const newHref = `/editor?file=${encodeURIComponent(fileName)}`;
 
             return <Link href={newHref} className="text-primary hover:text-primary-dark underline underline-offset-2 transition-colors" {...props}>{children}</Link>;
          }
          
          return <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark underline underline-offset-2 transition-colors" {...props}>{children}</a>;
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
