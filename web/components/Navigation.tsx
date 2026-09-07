'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CreateContentModal from './CreateContentModal';
import CommandPalette from './CommandPalette';
import AuthModal from './AuthModal';
import PlanWizardModal from './PlanWizardModal';
import { useProgress } from '@/lib/useProgress';

interface NavItem {
  href: string;
  label: string;
  emoji?: string;
  badge?: string;
  highlight?: boolean;
}

const PRIMARY_LINKS: NavItem[] = [
  { href: '/roadmap', label: 'Roadmaps', emoji: '🗺️', highlight: true },
  { href: '/grind75', label: 'Grind 75', emoji: '🔥', highlight: true },
  { href: '/system-design', label: 'System Design', emoji: '📐' },
  { href: '/notebooklm', label: 'NotebookLM AI', emoji: '🤖', highlight: true },
];

const MORE_LINKS: NavItem[] = [
  { href: '/tools', label: 'Dev Tools & Sandboxes', emoji: '⚡', badge: 'Zero-Signup' },
  { href: '/cheatsheets', label: 'Cheat Sheets & Fast Recall', emoji: '📑' },
  { href: '/stories', label: 'STAR Stories & Top 30 FAANG', emoji: '✨' },
  { href: '/coding', label: 'Coding Practice Matrix', emoji: '💻' },
  { href: '/resources', label: 'Resource Hub & Sandboxes (55+)', emoji: '🌐' },
  { href: '/qa', label: 'QA Bank (140+ Q&As)', emoji: '❓' },
  { href: '/topics', label: 'Evergreen Topics', emoji: '📚' },
  { href: '/prep', label: 'Company Prep Guides', emoji: '🏢' },
  { href: '/quiz', label: 'Active Recall Flashcards', emoji: '⚡' },
];

const MOBILE_BOTTOM_NAV = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/roadmap', label: 'Roadmap', icon: '🗺️' },
  { href: '/grind75', label: 'Grind 75', icon: '🔥' },
  { href: '/notebooklm', label: 'AI Hub', icon: '🤖' },
  { href: '/system-design', label: 'Arch', icon: '📐' },
];

export default function Navigation() {
  const pathname = usePathname();
  const { user, progress } = useProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [planWizardOpen, setPlanWizardOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close mobile drawer and dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isMoreActive = MORE_LINKS.some(link => 
    pathname === link.href || pathname.startsWith(link.href + '/')
  );

  const displayName = user?.displayName || progress.customName || (user?.email ? user.email.split('@')[0] : 'Sign In');
  const userInitial = user?.displayName?.charAt(0) || progress.customName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || '👤';

  return (
    <>
      {/* Top Header Navigation */}
      <nav className="w-full border-b border-white/5 bg-background/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            
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
                title={`${progress.streakCount} day study streak!`}
              >
                <span>🔥</span>
                <span>{progress.streakCount}d</span>
              </div>
            </div>

            {/* Center: Desktop Primary 4 Pillars + More Dropdown */}
            <div className="hidden md:flex items-center gap-1">
              {PRIMARY_LINKS.map(link => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs lg:text-sm font-medium px-2.5 lg:px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-primary/20 text-primary font-semibold border border-primary/30 shadow-sm'
                        : link.highlight
                        ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 font-semibold border border-orange-500/20'
                        : 'text-foreground/70 hover:text-foreground hover:bg-white/5'
                    }`}
                  >
                    <span>{link.emoji}</span>
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* "More ▾" Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setMoreDropdownOpen(prev => !prev)}
                  className={`text-xs lg:text-sm font-medium px-2.5 lg:px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isMoreActive || moreDropdownOpen
                      ? 'bg-primary/20 text-primary font-semibold border border-primary/30 shadow-sm'
                      : 'text-foreground/70 hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <span>More</span>
                  <span className={`text-[10px] transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>

                {/* Dropdown Menu Popover */}
                {moreDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#13161c] border border-white/10 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col gap-1">
                      {MORE_LINKS.map(item => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                              isActive
                                ? 'bg-primary/20 text-primary font-bold border border-primary/30'
                                : 'text-foreground/80 hover:bg-white/5 hover:text-foreground'
                            }`}
                          >
                            <span className="text-sm">{item.emoji}</span>
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
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

              {/* Hamburger Button for Mobile & Tablet */}
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
          <div className="max-h-[calc(100vh-4rem)] overflow-y-auto p-5 flex flex-col gap-6">
            
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
              className="p-4 rounded-2xl bg-gradient-to-r from-primary/20 to-purple-500/10 border border-primary/30 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/30 text-primary font-bold flex items-center justify-center text-sm">
                  {userInitial}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">{displayName}</h4>
                  <p className="text-[10px] text-foreground/60">🔥 {progress.streakCount}d Streak · Tap to manage profile</p>
                </div>
              </div>
              <span className="text-xs text-primary font-bold">Manage &rarr;</span>
            </div>

            {/* Group 1: Guided Roadmaps & AI */}
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-2 px-1">
                🗺️ Guided Roadmaps & AI Engine
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/roadmap"
                  className="p-3 rounded-xl bg-primary/10 border border-primary/30 hover:border-primary/60 flex flex-col gap-1"
                >
                  <span className="text-lg">🗺️</span>
                  <span className="text-xs font-bold text-primary">Role Roadmaps</span>
                  <span className="text-[10px] text-foreground/50">SDE-2, SDE-3 & 14-day tracks</span>
                </Link>

                <Link
                  href="/notebooklm"
                  className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 flex flex-col gap-1"
                >
                  <span className="text-lg">🤖</span>
                  <span className="text-xs font-bold text-purple-300">NotebookLM AI</span>
                  <span className="text-[10px] text-foreground/50">Podcasts & Mock drills</span>
                </Link>

                <Link
                  href="/grind75"
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/40 flex flex-col gap-1"
                >
                  <span className="text-lg">🔥</span>
                  <span className="text-xs font-bold text-foreground">Grind 75</span>
                  <span className="text-[10px] text-foreground/50">Custom study roadmap</span>
                </Link>

                <Link
                  href="/quiz"
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/40 flex flex-col gap-1"
                >
                  <span className="text-lg">⚡</span>
                  <span className="text-xs font-bold text-foreground">Flashcards</span>
                  <span className="text-[10px] text-foreground/50">Spaced repetition</span>
                </Link>
              </div>
            </div>

            {/* Group 2: Architecture & Cheat Sheets */}
            <div>
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider block mb-2 px-1">
                📐 Architecture & Fast Recall
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/system-design"
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/40 flex flex-col gap-1"
                >
                  <span className="text-lg">📐</span>
                  <span className="text-xs font-bold text-foreground">System Design</span>
                  <span className="text-[10px] text-foreground/50">HLD, LLD & Primer</span>
                </Link>

                <Link
                  href="/cheatsheets"
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/40 flex flex-col gap-1"
                >
                  <span className="text-lg">📑</span>
                  <span className="text-xs font-bold text-foreground">Cheat Sheets</span>
                  <span className="text-[10px] text-foreground/50">Corner cases & latency</span>
                </Link>
              </div>
            </div>

            {/* Group 3: Behavioral & Knowledge */}
            <div>
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider block mb-2 px-1">
                ✨ Behavioral & Knowledge Hubs
              </span>
              <div className="flex flex-col gap-1.5">
                <Link
                  href="/stories"
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/40 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">✨</span>
                    <div>
                      <span className="text-xs font-bold text-foreground block">STAR Stories & Top 30 FAANG Questions</span>
                      <span className="text-[10px] text-foreground/50">Amazon LPs and Google X-Y-Z formula</span>
                    </div>
                  </div>
                  <span className="text-xs text-foreground/40">→</span>
                </Link>

                <Link
                  href="/coding"
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/40 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">💻</span>
                    <div>
                      <span className="text-xs font-bold text-foreground block">Coding Practice Matrix</span>
                      <span className="text-[10px] text-foreground/50">Blind 75 & NeetCode solutions</span>
                    </div>
                  </div>
                  <span className="text-xs text-foreground/40">→</span>
                </Link>

                <Link
                  href="/resources"
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/40 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">🌐</span>
                    <div>
                      <span className="text-xs font-bold text-foreground block">Resource Hub & 33+ Engineering Blogs</span>
                      <span className="text-[10px] text-foreground/50">Uber, Meta, Netflix, Stripe tech blogs</span>
                    </div>
                  </div>
                  <span className="text-xs text-foreground/40">→</span>
                </Link>

                <Link
                  href="/qa"
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/40 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">❓</span>
                    <div>
                      <span className="text-xs font-bold text-foreground block">QA Bank (140+ Solutions)</span>
                      <span className="text-[10px] text-foreground/50">JavaScript, React, Node, SQL Q&As</span>
                    </div>
                  </div>
                  <span className="text-xs text-foreground/40">→</span>
                </Link>

                <Link
                  href="/prep"
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/40 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">🏢</span>
                    <div>
                      <span className="text-xs font-bold text-foreground block">Company-Specific Prep Guides</span>
                      <span className="text-[10px] text-foreground/50">Google, Amazon, Meta target sheets</span>
                    </div>
                  </div>
                  <span className="text-xs text-foreground/40">→</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Mobile & PWA Bottom Navigation Dock */}
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
        </div>
      </div>
    </>
  );
}
