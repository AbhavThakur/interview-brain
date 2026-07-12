import { getAllStories } from '@/lib/markdown';
import MarkdownRenderer from '@/components/MarkdownRenderer';

export default function StoriesPage() {
  const stories = getAllStories();

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold tracking-tight">STAR Stories</h1>
        <p className="text-foreground/60 mt-2">
          Your best behavioral answers and project deep-dives.
        </p>
      </div>

      <div className="grid gap-6">
        {stories.map((story) => (
          <div key={story.id} id={story.id} className="glass-card p-8 scroll-mt-24">
            <div className="prose-dark max-w-none">
              <MarkdownRenderer content={story.content} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
