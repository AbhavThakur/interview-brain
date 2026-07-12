import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import Link from 'next/link';
import 'highlight.js/styles/github-dark.css';

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        a: ({ href, children, ...props }) => {
          if (!href) return <a {...props}>{children}</a>;
          
          // Intercept local .md links so VS Code links still work in the web app
          if (href.endsWith('.md') && !href.startsWith('http')) {
             // Extract just the filename (basename) from the path
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
