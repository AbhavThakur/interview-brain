'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PillarCard {
  emoji: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  badge?: string;
  highlight?: boolean;
}

interface PillarsExplorerProps {
  systemDesignCount: number;
  codesCount: number;
  resourceCount: number;
  storyCount: number;
}

export default function PillarsExplorer({
  systemDesignCount,
  codesCount,
  resourceCount,
  storyCount
}: PillarsExplorerProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'practice' | 'architecture' | 'interviews'>('all');

  const pillars: Record<'practice' | 'architecture' | 'interviews', PillarCard[]> = {
    practice: [
      {
        emoji: '🔥',
        title: 'Grind 75 Study Planner',
        description: 'Customizable week-by-week study plan based on Tech Interview Handbook. Master high-frequency patterns.',
        href: '/grind75',
        cta: 'Open Grind 75',
        badge: 'High Yield'
      },
      {
        emoji: '💻',
        title: 'Coding Practice Matrix',
        description: `${codesCount} pattern-based algorithm solutions with LeetCode links, time/space complexities, and status tracking.`,
        href: '/coding',
        cta: 'Practice Coding'
      },
      {
        emoji: '⚡',
        title: 'Active Recall Flashcards',
        description: 'Spaced repetition flashcards covering Big-O, JavaScript engine, React internals, and distributed systems.',
        href: '/quiz',
        cta: 'Launch Drill',
        badge: 'Spaced Repetition'
      }
    ],
    architecture: [
      {
        emoji: '📐',
        title: 'System Design & LLD',
        description: `${systemDesignCount} production blueprints: In-App Observability SDK, AMQ Feed Architecture, and List Virtualization.`,
        href: '/system-design',
        cta: 'View Blueprints',
        badge: 'HLD + LLD'
      },
      {
        emoji: '📑',
        title: 'Cheat Sheets & Fast Recall',
        description: 'Instant reference tables for algorithmic corner cases, system latency numbers, and React performance traps.',
        href: '/cheatsheets',
        cta: 'Open Cheat Sheets',
        badge: 'Fast Recall'
      },
      {
        emoji: '⚡',
        title: 'Dev Tools & Sandboxes',
        description: 'Zero-signup developer sandboxes: Latency hierarchy visualizer, back-of-the-envelope capacity math, and drawDB ERD.',
        href: '/tools',
        cta: 'Explore Tools'
      }
    ],
    interviews: [
      {
        emoji: '🏢',
        title: 'Company Prep Dossiers',
        description: 'Company-specific interview guides: PhonePe (SDE-2/3 React Native), Best Buy, Amazon, Google, and Meta.',
        href: '/prep',
        cta: 'View Companies',
        badge: 'Targeted'
      },
      {
        emoji: '✨',
        title: 'STAR Stories & Behavioral',
        description: 'Interactive builder with Google X-Y-Z formula + Top 30 FAANG questions and scoring rubrics.',
        href: '/stories',
        cta: 'Draft Stories',
        badge: 'Leadership'
      },
      {
        emoji: '🌐',
        title: 'Resource Hub & 33+ Blogs',
        description: `${resourceCount} curated links across DSA, Frontend, Mobile, System Design, and 33+ iconic engineering blogs.`,
        href: '/resources',
        cta: 'Browse Hub'
      },
      {
        emoji: '🤖',
        title: 'NotebookLM AI Engine',
        description: 'Export 1-click source packs and generate 15-minute 2-host audio podcasts for commute listening.',
        href: '/notebooklm',
        cta: 'Launch AI Hub',
        badge: 'Audio Podcasts'
      }
    ]
  };

  const getVisibleCards = () => {
    if (activeTab === 'all') {
      return [
        ...pillars.practice.slice(0, 2),
        ...pillars.architecture.slice(0, 2),
        ...pillars.interviews.slice(0, 2)
      ];
    }
    return pillars[activeTab];
  };

  const tabs = [
    { id: 'all', label: 'All Essentials', icon: '✨' },
    { id: 'practice', label: 'Coding & Practice', icon: '💻' },
    { id: 'architecture', label: 'Architecture & LLD', icon: '📐' },
    { id: 'interviews', label: 'Companies & STAR', icon: '🎯' },
  ] as const;

  return (
    <section className="space-y-4 pt-2">
      {/* Header & Pillar Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            Interview Knowledge Pillars
          </h3>
          <p className="text-xs text-foreground/60 mt-0.5">
            Structured reference modules organized by interview phase.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-foreground/60 hover:text-foreground hover:bg-white/5'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {getVisibleCards().map(card => (
          <div
            key={card.href}
            className="glass-card p-5 rounded-2xl flex flex-col justify-between gap-3.5 group hover:border-primary/50 transition-all hover:-translate-y-0.5"
          >
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary text-base">
                  {card.emoji}
                </div>
                {card.badge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                    {card.badge}
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                {card.title}
              </h4>
              <p className="text-foreground/60 text-xs leading-relaxed">
                {card.description}
              </p>
            </div>

            <div className="border-t border-white/5 pt-3">
              <Link
                href={card.href}
                className="text-primary hover:text-white font-semibold text-xs group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
              >
                <span>{card.cta}</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
