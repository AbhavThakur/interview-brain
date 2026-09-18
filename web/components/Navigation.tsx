'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CreateContentModal from './CreateContentModal';
import CommandPalette from './CommandPalette';
import AuthModal from './AuthModal';
import PlanWizardModal from './PlanWizardModal';
import { useProgress } from '@/lib/useProgress';

interface SubNavItem {
  href: string;
  label: string;
  description: string;
  emoji: string;
  badge?: string;
}

interface NavPillar {
  id: 'practice' | 'architecture' | 'interviews';
  label: string;
  emoji: string;
  items: SubNavItem[];
}

const NAV_PILLARS: NavPillar[] = [
  {
    id: 'practice',
    label: 'Practice',
    emoji: '🔥',
    items: [
      {
        href: '/roadmap',
        label: 'Guided Roadmaps',
        description: 'Structured comprehensive syllabus & milestone checklists',
        emoji: '🗺️',
        badge: 'Core',
      },
      {
        href: '/grind75',
        label: 'Grind 75 Planner',
        description: 'Curated algorithm problems filtered by available weekly hours',
        emoji: '🔥',
        badge: 'Popular',
      },
      {
        href: '/coding',
        label: 'Coding Matrix',
        description: 'Blind 75 & NeetCode solutions with Big-O complexity breakdowns',
        emoji: '💻',
      },
      {
        href: '/quiz',
        label: 'Active Recall Flashcards',
        description: 'Spaced repetition drills for rapid CS and frontend retention',
        emoji: '⚡',
      },
    ],
  },
  {
    id: 'architecture',
    label: 'Architecture',
    emoji: '📐',
    items: [
      {
        href: '/system-design',
        label: 'System Design Blueprints',
        description: 'HLD, LLD & production mobile architectures (PhonePe, Uber, Netflix)',
        emoji: '📐',
        badge: 'Senior SDE',
      },
      {
        href: '/cheatsheets',
        label: 'Cheat Sheets & Latency',
        description: 'Hardware numbers, distributed system trade-offs & corner cases',
        emoji: '📑',
      },
      {
        href: '/tools',
        label: 'Dev Tools & Sandboxes',
        description: 'Zero-signup Big-O complexity grapher, bitwise calculator, regex lab',
        emoji: '⚡',
      },
    ],
  },
  {
    id: 'interviews',
    label: 'Interviews',
    emoji: '💼',
    items: [
      {
        href: '/prep',
        label: 'Company Prep Guides',
        description: 'Google, Amazon, Meta, Apple & PhonePe targeted round guides',
        emoji: '🏢',
      },
      {
        href: '/stories',
        label: 'STAR Stories & Behavioral',
        description: 'Top 30 FAANG questions, Amazon LPs & Google XYZ formula',
        emoji: '✨',
      },
      {
        href: '/qa',
        label: 'QA Bank',
        description: '140+ verified solutions for React, JS, Mobile & SQL interviews',
        emoji: '❓',
      },
      {
        href: '/resources',
        label: 'Resource Hub',
        description: '33+ top engineering blogs, books, whitepapers & playgrounds',
        emoji: '🌐',
      },
      {
        href: '/notebooklm',
        label: 'NotebookLM AI Hub',
        description: 'Audio podcast summaries & interactive AI mock drills on the go',
        emoji: '🤖',
        badge: 'AI Audio',
      },
    ],
  },
];

const MOBILE_BOTTOM_NAV = [
  { href: '/', label: 'Today', icon: '🎯' },
  { href: '/grind75', label: 'Practice', icon: '🔥' },
  { href: '/system-design', label: 'Arch', icon: '📐' },
  { href: '/stories', label: 'Interviews', icon: '💼' },
];

export default function Navigation() {
  const pathname = usePathname();
  const { user, progress } = useProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [planWizardOpen, setPlanWizardOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdowns and drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleDropdown = (pillarId: string) => {
    setOpenDropdown(prev => (prev === pillarId ? null : pillarId));
  };

  const displayName = user?.displayName || progress.customName || (user?.email ? user.email.split('@')[0] : 'Sign In');
  const userInitial = user?.displayName?.charAt(0) || progress.customName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || '👤';

  return (
    <>
      {/* Top Header Navigation */}
      <nav ref={navRef} className="w-full border-b border-white/5 bg-background/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Left: Logo & Streak */}
            <div className="flex items-center gap-2.5 shrink-0">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-primary-dark flex items-center justify-center font-bold text-white shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform text-sm">
                  IB
                </div>
                <span className="font-bold text-sm sm:text-base tracking-tight hidden sm:inline-block">
                  Interview Brain
                </span>
              </Link>

              {/* Streak Counter Pill */}
              <div 
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold shrink-0"
                title={`${progress.streakCount} day study streak! Keep it going!`}
              >
                <span>🔥</span>
                <span>{progress.streakCount}d</span>
              </div>
            </div>

            {/* Center: The 4 Streamlined Pillars (Desktop) */}
            <div className="hidden md:flex items-center gap-1">
              {/* Pillar 1: Today (Direct Focus) */}
              <Link
                href="/"
                className={`text-xs lg:text-sm font-medium px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  pathname === '/'
                    ? 'bg-primary/20 text-primary font-bold border border-primary/30 shadow-sm'
                    : 'text-foreground/70 hover:text-foreground hover:bg-white/5'
                }`}
              >
                <span>🎯</span>
                <span>Today</span>
              </Link>

              {/* Pillars 2, 3, 4: Practice, Architecture, Interviews (Dropdowns) */}
              {NAV_PILLARS.map(pillar => {
                const isSubActive = pillar.items.some(
                  item => pathname === item.href || pathname.startsWith(item.href + '/')
                );
                const isOpen = openDropdown === pillar.id;

                return (
                  <div key={pillar.id} className="relative">
                    <button
                      onClick={() => toggleDropdown(pillar.id)}
                      aria-expanded={isOpen}
                      className={`text-xs lg:text-sm font-medium px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        isSubActive || isOpen
                          ? 'bg-primary/20 text-primary font-bold border border-primary/30 shadow-sm'
                          : 'text-foreground/70 hover:text-foreground hover:bg-white/5'
                      }`}
                    >
                      <span>{pillar.emoji}</span>
                      <span>{pillar.label}</span>
                      <span className={`text-[10px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                    </button>

                    {/* Dropdown Popover */}
                    {isOpen && (
                      <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-[#12161f]/95 backdrop-blur-xl border border-white/10 p-2 shadow-2xl shadow-black/60 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="flex flex-col gap-1">
                          {pillar.items.map(item => {
                            const isItemActive = pathname === item.href || pathname.startsWith(item.href + '/');
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpenDropdown(null)}
                                className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                                  isItemActive
                                    ? 'bg-primary/20 border border-primary/30 text-white'
                                    : 'hover:bg-white/5 text-foreground/80 hover:text-foreground border border-transparent'
                                }`}
                              >
                                <span className="text-lg shrink-0 mt-0.5">{item.emoji}</span>
                                <div className="flex flex-col gap-0.5 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-foreground truncate">{item.label}</span>
                                    {item.badge && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-primary/20 text-primary border border-primary/30">
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-foreground/50 leading-snug line-clamp-2">
                                    {item.description}
                                  </span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right: Search, Create (+), Plan, Auth / Profile */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <CommandPalette />

              <div className="flex items-center justify-center">
                <CreateContentModal />
              </div>

              {/* Personalized Study Plan Button */}
              <button
                onClick={() => setPlanWizardOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-all shadow-sm group"
                title="Personalize your study plan with a 30-sec diagnostic"
              >
                <span className="group-hover:scale-110 transition-transform">🎯</span>
                <span className="hidden sm:inline">Plan</span>
              </button>

              {/* Profile / Sign In Button */}
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs font-medium text-foreground group"
              >
                <div className="w-5 h-5 rounded-lg bg-primary/20 text-primary font-bold flex items-center justify-center text-[10px]">
                  {userInitial}
                </div>
                <span className="hidden sm:inline max-w-[80px] truncate text-[11px]">
                  {displayName}
                </span>
              </button>

              {/* Hamburger Button for Mobile Drawer */}
              <button
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-foreground/80 hover:text-foreground border border-white/5 transition-all"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Auth & Profile Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Personalized Plan Wizard Modal */}
      <PlanWizardModal isOpen={planWizardOpen} onClose={() => setPlanWizardOpen(false)} />

      {/* Mobile Drawer Sheet */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-md pt-16 animate-in fade-in duration-200">
          <div className="max-h-[calc(100vh-4rem)] overflow-y-auto p-4 flex flex-col gap-5 pb-20">
            
            {/* Take Diagnostic CTA in Mobile Drawer */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setPlanWizardOpen(true);
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-primary/20 via-purple-600/20 to-primary/10 border border-primary/30 text-xs font-bold text-white shadow-md text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🎯</span>
                <div className="flex flex-col">
                  <span>Personalize My Study Plan</span>
                  <span className="text-[10px] text-foreground/60 font-normal">30-sec skill diagnostic & custom roadmaps</span>
                </div>
              </div>
              <span className="text-xs text-primary font-bold">&rarr;</span>
            </button>

            {/* User Profile Card */}
            <div 
              onClick={() => {
                setMobileMenuOpen(false);
                setAuthModalOpen(true);
              }}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-primary/20 to-purple-500/10 border border-primary/30 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/30 text-primary font-bold flex items-center justify-center text-sm">
                  {userInitial}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">{displayName}</h4>
                  <p className="text-[10px] text-foreground/60">🔥 {progress.streakCount}d Streak · Tap to manage</p>
                </div>
              </div>
              <span className="text-xs text-primary font-bold">Manage &rarr;</span>
            </div>

            {/* Mobile Pillar Groups */}
            {NAV_PILLARS.map(pillar => (
              <div key={pillar.id} className="space-y-2">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block px-1">
                  {pillar.emoji} {pillar.label}
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {pillar.items.map(item => {
                    const isItemActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                          isItemActive
                            ? 'bg-primary/20 border-primary/30 text-primary font-bold'
                            : 'bg-white/[0.03] border-white/5 hover:border-primary/40 text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{item.emoji}</span>
                          <div>
                            <span className="text-xs font-bold block">{item.label}</span>
                            <span className="text-[10px] text-foreground/50 font-normal">{item.description}</span>
                          </div>
                        </div>
                        <span className="text-xs text-foreground/40">→</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

          </div>
        </div>
      )}

      {/* Mobile & PWA Bottom Navigation Dock (5 High-frequency actions) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-white/10 px-2 py-1.5">
        <div className="grid grid-cols-5 gap-1 items-center">
          {MOBILE_BOTTOM_NAV.map(item => {
            const isActive = item.href === '/' 
              ? pathname === '/' 
              : pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-primary font-bold bg-primary/10'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                <span className="text-base leading-none mb-1">{item.icon}</span>
                <span className="text-[10px] tracking-tight truncate">{item.label}</span>
              </Link>
            );
          })}

          {/* 5th Mobile Bottom Nav Tab: Menu drawer toggle */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              mobileMenuOpen
                ? 'text-primary font-bold bg-primary/10'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <span className="text-base leading-none mb-1">☰</span>
            <span className="text-[10px] tracking-tight truncate">Menu</span>
          </button>
        </div>
      </div>
    </>
  );
}
