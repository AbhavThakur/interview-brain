import Link from 'next/link';
import { 
  getAllQuestions, 
  getAllTopics, 
  getAllStories, 
  getAllEnhancedCodes, 
  getAllResources, 
  getAllSystemDesign 
} from '@/lib/markdown';
import DailyPrepWidget from '@/components/DailyPrepWidget';

export default function Home() {
  const questionCount = getAllQuestions().length;
  const codes = getAllEnhancedCodes();
  const resourceCount = getAllResources().length;
  const systemDesignDocs = getAllSystemDesign();
  const topics = getAllTopics();
  const storyCount = getAllStories().length;

  // Dynamic daily selections
  const todayProblem = codes[Math.floor(Date.now() / 86400000) % (codes.length || 1)] || codes[0];
  const todayTopic = systemDesignDocs[0] || topics[0];

  const cards = [
    {
      emoji: '🔥',
      title: 'Grind 75 Study Planner',
      description: `Customizable week-by-week study plan based on Tech Interview Handbook. Set weeks and hours/week to master core patterns.`,
      href: '/grind75',
      cta: 'Open Grind 75 Engine',
      badge: 'High Yield'
    },
    {
      emoji: '🌐',
      title: 'Resource Hub & 33+ Blogs',
      description: `${resourceCount} curated links across DSA, Frontend, Mobile, System Design, and 33+ iconic company engineering blogs.`,
      href: '/resources',
      cta: 'Explore Resources',
      badge: 'Curated'
    },
    {
      emoji: '📐',
      title: 'System Design & LLD',
      description: `${systemDesignDocs.length} senior blueprints: GoF patterns, machine coding framework, list virtualization, and offline sync.`,
      href: '/system-design',
      cta: 'View Architecture',
      badge: 'HLD + LLD'
    },
    {
      emoji: '📑',
      title: 'Cheat Sheets & Corner Cases',
      description: `Fast-recall tables for DSA pattern recognition, algorithmic corner cases, JS event loop, React perf, and system sizing math.`,
      href: '/cheatsheets',
      cta: 'Open Quick Sheets',
      badge: 'Fast Recall'
    },
    {
      emoji: '✨',
      title: 'STAR Stories & Top 30 Questions',
      description: `Interactive STAR story builder with Google's X-Y-Z formula helper + top 30 FAANG behavioral questions and scoring tips.`,
      href: '/stories',
      cta: 'Draft STAR Stories',
      badge: 'Interactive'
    },
    {
      emoji: '💻',
      title: 'Coding Practice Matrix',
      description: `${codes.length} pattern-based algorithm solutions with LeetCode links, time/space complexities, and status tracking.`,
      href: '/coding',
      cta: 'Practice Coding',
    },
  ];

  return (
    <div className="flex flex-col gap-10 py-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Hero Section */}
      <section className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
          <span>🚀 The Ultimate Developer Interview Command Center</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-purple-400">
          Master Your Tech Interviews
        </h1>
        <p className="text-sm md:text-base text-foreground/70 leading-relaxed max-w-2xl mx-auto">
          Combining the best of <strong className="text-white">Tech Interview Handbook</strong>, <strong className="text-white">Grind 75</strong>, system design blueprints, and active recall flashcards so you prepare with zero decision fatigue alongside your day job.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link href="/grind75" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary-dark hover:to-purple-500 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 text-sm flex items-center gap-1.5">
            <span>🔥 Grind 75 Study Plan</span>
          </Link>
          <Link href="/quiz" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-2.5 rounded-xl font-semibold backdrop-blur-md transition-all text-sm">
            ⚡ Flashcards
          </Link>
          <Link href="/resources" className="bg-white/5 hover:bg-white/10 border border-white/10 text-foreground/80 hover:text-white px-5 py-2.5 rounded-xl font-semibold transition-all text-sm hidden sm:inline-block">
            🌐 Resource Hub (30+ Blogs)
          </Link>
        </div>
      </section>

      {/* Daily After-Work 20-Min Widget */}
      <section>
        <DailyPrepWidget 
          todayProblem={todayProblem} 
          todayTopic={todayTopic} 
          dueCardsCount={questionCount} 
        />
      </section>

      {/* Feature Grid Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {cards.map(card => (
          <div key={card.href} className="glass-card p-6 flex flex-col justify-between gap-4 group hover:border-primary/50 transition-all hover:-translate-y-0.5">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary text-xl">
                  {card.emoji}
                </div>
                {card.badge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                    {card.badge}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{card.title}</h3>
              <p className="text-foreground/60 text-xs leading-relaxed">
                {card.description}
              </p>
            </div>
            <div className="border-t border-white/5 pt-3">
              <Link href={card.href} className="text-primary hover:text-white font-semibold text-xs group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                <span>{card.cta}</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        ))}
      </section>

    </div>
  );
}
