"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CreateContentModal from "./CreateContentModal";
import CommandPalette from "./CommandPalette";
import AuthModal from "./AuthModal";
import PlanWizardModal from "./PlanWizardModal";
import { useProgress } from "@/lib/useProgress";

interface NavLink {
  href: string;
  label: string;
  emoji: string;
  badge?: string;
  description?: string;
}

// 5 High-Frequency Direct Links (Zero dropdown friction)
const PRIMARY_NAV_LINKS: NavLink[] = [
  { href: "/", label: "Today", emoji: "🎯" },
  { href: "/coding", label: "Coding", emoji: "💻" },
  { href: "/system-design", label: "System Design", emoji: "📐" },
  { href: "/topics", label: "Topics", emoji: "📖" },
  { href: "/stories", label: "Stories", emoji: "⭐" },
];

// Grouped sections inside the "More & Library" Mega-Menu
const MORE_MENU_SECTIONS = [
  {
    title: "Practice & Drills",
    emoji: "🔥",
    items: [
      {
        href: "/focus",
        label: "Today's Focus Engine",
        description: "Zero decision fatigue: dynamic 3-block daily execution engine",
        emoji: "🎯",
        badge: "Daily",
      },
      {
        href: "/roadmap",
        label: "Guided Roadmaps",
        description: "Structured comprehensive syllabus & milestone checklists",
        emoji: "🗺️",
        badge: "Core",
      },
      {
        href: "/grind75",
        label: "Grind 75 Planner",
        description: "Curated algorithm problems filtered by available weekly hours",
        emoji: "🔥",
        badge: "Popular",
      },
      {
        href: "/quiz",
        label: "Active Recall Flashcards",
        description: "Spaced repetition drills for rapid CS and frontend retention",
        emoji: "⚡",
      },
    ],
  },
  {
    title: "Architecture & Sandboxes",
    emoji: "📐",
    items: [
      {
        href: "/cheatsheets",
        label: "Cheat Sheets & Latency",
        description: "Hardware numbers, distributed system trade-offs & corner cases",
        emoji: "📑",
      },
      {
        href: "/tools",
        label: "Dev Tools & Estimators",
        description: "Zero-signup Big-O complexity grapher, capacity estimator, regex lab",
        emoji: "⚡",
        badge: "Interactive",
      },
    ],
  },
  {
    title: "Interviews & Resources",
    emoji: "🌐",
    items: [
      {
        href: "/resources",
        label: "Resource Hub",
        description: "130+ top engineering blogs, books, whitepapers & playgrounds",
        emoji: "🌐",
        badge: "130+ Links",
      },
      {
        href: "/prep",
        label: "Company Prep Guides",
        description: "Google, Amazon, Meta, Apple & PhonePe targeted round guides",
        emoji: "🏢",
      },
      {
        href: "/qa",
        label: "QA Bank",
        description: "140+ verified solutions for React, JS, Mobile & SQL interviews",
        emoji: "❓",
      },
      {
        href: "/notebooklm",
        label: "NotebookLM AI Hub",
        description: "Audio podcast summaries & interactive AI mock drills on the go",
        emoji: "🤖",
        badge: "AI Audio",
      },
    ],
  },
];

// Mobile Bottom Navigation Dock (5 High-frequency actions)
const MOBILE_BOTTOM_NAV = [
  { href: "/", label: "Today", icon: "🎯" },
  { href: "/coding", label: "Code", icon: "💻" },
  { href: "/system-design", label: "Arch", icon: "📐" },
  { href: "/topics", label: "Topics", icon: "📖" },
  { href: "/stories", label: "Stories", icon: "⭐" },
];

export default function Navigation() {
  const pathname = usePathname();
  const { user, progress } = useProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [planWizardOpen, setPlanWizardOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdowns and drawer on route change
  useEffect(() => {
    setMoreMenuOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Esc key closes menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMoreMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isMoreMenuActive = MORE_MENU_SECTIONS.some((sec) =>
    sec.items.some(
      (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
    ),
  );

  const displayName =
    user?.displayName ||
    progress.customName ||
    (user?.email ? user.email.split("@")[0] : "Sign In");
  const userInitial =
    user?.displayName?.charAt(0) ||
    progress.customName?.charAt(0) ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "👤";

  return (
    <>
      {/* Top Header Navigation */}
      <nav
        ref={navRef}
        className="w-full border-b border-white/5 bg-background/90 backdrop-blur-md sticky top-0 z-50 transition-colors"
      >
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

            {/* Center: Direct High-Frequency Links + "More" Mega Dropdown (Desktop) */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0">
              {PRIMARY_NAV_LINKS.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/" || pathname === "/focus"
                    : pathname === link.href || pathname.startsWith(link.href + "/");

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs xl:text-sm font-medium px-2.5 xl:px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center shrink-0 ${
                      isActive
                        ? "bg-primary/20 text-primary font-bold border border-primary/30 shadow-sm"
                        : "text-foreground/70 hover:text-foreground hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* The "More / Library" Mega-Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMoreMenuOpen((prev) => !prev)}
                  aria-expanded={moreMenuOpen}
                  className={`text-xs xl:text-sm font-medium px-2.5 xl:px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                    isMoreMenuActive || moreMenuOpen
                      ? "bg-primary/20 text-primary font-bold border border-primary/30 shadow-sm"
                      : "text-foreground/70 hover:text-foreground hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <span>Library</span>
                  <span
                    className={`text-[10px] transition-transform duration-200 ${
                      moreMenuOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▾
                  </span>
                </button>

                {/* Mega Dropdown Popover */}
                {moreMenuOpen && (
                  <div className="absolute right-0 lg:left-0 mt-2 w-[520px] rounded-2xl bg-[#0d111a]/95 backdrop-blur-xl border border-white/10 p-4 shadow-2xl shadow-black/80 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="grid grid-cols-2 gap-4">
                      {MORE_MENU_SECTIONS.map((section) => (
                        <div
                          key={section.title}
                          className={section.title === "Interviews & Resources" ? "col-span-2 grid grid-cols-2 gap-2 pt-2 border-t border-white/5" : "space-y-1"}
                        >
                          {section.title !== "Interviews & Resources" && (
                            <div className="flex items-center gap-1.5 px-2 pb-1 text-[11px] font-bold text-primary uppercase tracking-wider">
                              <span>{section.emoji}</span>
                              <span>{section.title}</span>
                            </div>
                          )}
                          {section.items.map((item) => {
                            const isItemActive =
                              pathname === item.href ||
                              pathname.startsWith(item.href + "/");

                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMoreMenuOpen(false)}
                                className={`flex items-start gap-2.5 p-2 rounded-xl transition-all ${
                                  isItemActive
                                    ? "bg-primary/20 border border-primary/30 text-white"
                                    : "hover:bg-white/5 text-foreground/80 hover:text-foreground border border-transparent"
                                }`}
                              >
                                <span className="text-base shrink-0 mt-0.5">
                                  {item.emoji}
                                </span>
                                <div className="flex flex-col gap-0.5 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-foreground truncate">
                                      {item.label}
                                    </span>
                                    {item.badge && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-primary/20 text-primary border border-primary/30">
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-foreground/50 leading-snug line-clamp-1">
                                    {item.description}
                                  </span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Search, Create (+), Auth / Profile */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <CommandPalette />

              <div className="flex items-center justify-center">
                <CreateContentModal />
              </div>

              {/* User Avatar / Auth Button */}
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs font-medium text-foreground group shrink-0"
              >
                <div className="w-5 h-5 rounded-lg bg-primary/20 text-primary font-bold flex items-center justify-center text-[10px]">
                  {userInitial}
                </div>
                <span className="hidden sm:inline max-w-[70px] truncate text-[11px]">
                  {displayName}
                </span>
              </button>

              {/* Hamburger Button for Mobile Drawer */}
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-foreground/80 hover:text-foreground border border-white/5 transition-all shrink-0"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth & Profile Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Personalized Plan Wizard Modal */}
      <PlanWizardModal
        isOpen={planWizardOpen}
        onClose={() => setPlanWizardOpen(false)}
      />

      {/* Mobile Drawer Sheet */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/85 backdrop-blur-md pt-16 animate-in fade-in duration-200">
          <div className="max-h-[calc(100vh-4rem)] overflow-y-auto p-4 flex flex-col gap-4 pb-24">
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
                  <span className="text-[10px] text-foreground/60 font-normal">
                    30-sec skill diagnostic &amp; custom roadmaps
                  </span>
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
                  <h4 className="text-xs font-bold text-foreground">
                    {displayName}
                  </h4>
                  <p className="text-[10px] text-foreground/60">
                    🔥 {progress.streakCount}d Streak · Tap to manage
                  </p>
                </div>
              </div>
              <span className="text-xs text-primary font-bold">
                Manage &rarr;
              </span>
            </div>

            {/* Primary Modules */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider block px-1">
                ⭐ Core Modules
              </span>
              <div className="grid grid-cols-2 gap-2">
                {PRIMARY_NAV_LINKS.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/" || pathname === "/focus"
                      : pathname === link.href || pathname.startsWith(link.href + "/");

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                        isActive
                          ? "bg-primary/20 border-primary/40 text-primary font-bold"
                          : "bg-white/[0.02] border-white/5 text-foreground/80 hover:bg-white/5"
                      }`}
                    >
                      <span className="text-lg">{link.emoji}</span>
                      <span className="text-xs">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Other Sections */}
            {MORE_MENU_SECTIONS.map((section) => (
              <div key={section.title} className="space-y-1.5">
                <span className="text-[11px] font-bold text-foreground/50 uppercase tracking-wider block px-1">
                  {section.emoji} {section.title}
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {section.items.map((item) => {
                    const isItemActive =
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/");

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                          isItemActive
                            ? "bg-primary/20 border-primary/40 text-primary font-bold"
                            : "bg-white/[0.02] border-white/5 text-foreground/70 hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base shrink-0">
                            {item.emoji}
                          </span>
                          <span className="text-xs truncate">
                            {item.label}
                          </span>
                        </div>
                        {item.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/5 text-foreground/50">
                            {item.badge}
                          </span>
                        )}
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-white/10 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-pb">
        {MOBILE_BOTTOM_NAV.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/" || pathname === "/focus"
              : pathname === tab.href || pathname.startsWith(tab.href + "/");

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                isActive
                  ? "text-primary font-bold"
                  : "text-foreground/50 hover:text-foreground/80"
              }`}
            >
              <span className="text-lg leading-none mb-0.5">{tab.icon}</span>
              <span className="text-[10px] tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </>
  );
}
