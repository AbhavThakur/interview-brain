import { getAllPrepDocs } from '@/lib/markdown';
import MarkdownRenderer from '@/components/MarkdownRenderer';

export default function PrepPage() {
  const docs = getAllPrepDocs();

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold tracking-tight">Interview Prep</h1>
        <p className="text-foreground/60 mt-2">
          Company-specific prep sheets, scripts, and checklists. ({docs.length} file{docs.length !== 1 ? 's' : ''})
        </p>
      </div>

      {docs.length === 0 ? (
        <div className="text-center py-16 text-foreground/40">
          No prep files found in <code className="bg-white/5 px-2 py-1 rounded">04-companies/</code>. Use the + button to create one!
        </div>
      ) : (
        <div className="grid gap-8">
          {docs.map(doc => (
            <div key={doc.id} className="glass-card p-8 md:p-12 border-l-4 border-l-primary/50">
              <div className="prose-dark max-w-none">
                <MarkdownRenderer content={doc.content} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
