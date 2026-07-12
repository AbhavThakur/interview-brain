import Link from 'next/link';
import { getAllQuestions, getAllTopics, getAllStories, getAllCodes } from '@/lib/markdown';

export default function Home() {
  const questionCount = getAllQuestions().length;
  const topicCount = getAllTopics().length;
  const storyCount = getAllStories().length;
  const codeCount = getAllCodes().length;

  const cards = [
    {
      emoji: '🧠',
      title: 'QA Bank',
      description: `${questionCount} questions with expert answers, searchable by topic and tags.`,
      href: '/qa',
      cta: 'Browse Questions',
    },
    {
      emoji: '📚',
      title: 'Topics',
      description: `${topicCount} deep-dive articles on evergreen technical concepts.`,
      href: '/topics',
      cta: 'View Topics',
    },
    {
      emoji: '⭐',
      title: 'STAR Stories',
      description: `${storyCount} reusable project stories for behavioral rounds.`,
      href: '/stories',
      cta: 'Read Stories',
    },
    {
      emoji: '💻',
      title: 'Coding',
      description: `${codeCount} algorithms, snippets, and practical code examples.`,
      href: '/coding',
      cta: 'View Code',
    },
  ];

  return (
    <div className="flex flex-col gap-12 py-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary-dark">
          Master Your Interviews
        </h1>
        <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
          Your personal, compounding knowledge base. Built from plain markdown, supercharged with spaced repetition.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/quiz" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            Start Quiz
          </Link>
          <Link href="/prep" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3 rounded-xl font-semibold backdrop-blur-md transition-all">
            Interview Prep
          </Link>
        </div>
      </section>

      {/* Stats/Cards Section */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
        {cards.map(card => (
          <div key={card.href} className="glass-card p-6 flex flex-col gap-4 group hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl">
              {card.emoji}
            </div>
            <h3 className="text-xl font-semibold">{card.title}</h3>
            <p className="text-foreground/60 text-sm flex-1">
              {card.description}
            </p>
            <Link href={card.href} className="text-primary hover:text-white font-medium text-sm group-hover:translate-x-1 transition-transform inline-block w-fit">
              {card.cta} &rarr;
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
