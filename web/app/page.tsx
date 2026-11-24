import Link from "next/link";
import {
  getAllStories,
  getAllEnhancedCodes,
  getAllResources,
  getAllSystemDesign,
} from "@/lib/markdown";
import CommandCenterWidget from "@/components/CommandCenterWidget";
import PillarsExplorer from "@/components/PillarsExplorer";

export default function Home() {
  const codes = getAllEnhancedCodes();
  const resourceCount = getAllResources().length;
  const systemDesignDocs = getAllSystemDesign();
  const storyCount = getAllStories().length;

  return (
    <div className="flex flex-col gap-6 py-4 animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-5xl mx-auto">
      {/* Sleek, Minimalist Hero Header */}
      <section className="text-center space-y-2.5 max-w-2xl mx-auto pt-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-purple-400">
          Interview Command Center
        </h1>
        <p className="text-xs sm:text-sm text-foreground/60 leading-relaxed max-w-xl mx-auto">
          One daily focus routine. Zero decision fatigue. Master Senior Mobile,
          Fullstack &amp; System Design interviews alongside your day job.
        </p>
      </section>

      {/* Linear-Style Instant Module Quick-Launch Dock */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <Link
          href="/focus"
          className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-primary/10 border border-white/5 hover:border-primary/40 transition-all flex flex-col items-center justify-center text-center gap-1 group shadow-sm hover:shadow-primary/10"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">🎯</span>
          <span className="text-xs font-bold text-foreground">Today&apos;s Focus</span>
          <span className="text-[10px] text-primary font-semibold">3 Daily Tasks</span>
        </Link>
        <Link
          href="/coding"
          className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-primary/10 border border-white/5 hover:border-primary/40 transition-all flex flex-col items-center justify-center text-center gap-1 group shadow-sm hover:shadow-primary/10"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">💻</span>
          <span className="text-xs font-bold text-foreground">Coding Arena</span>
          <span className="text-[10px] text-foreground/50 font-mono">{codes.length}+ Solved</span>
        </Link>
        <Link
          href="/system-design"
          className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-primary/10 border border-white/5 hover:border-primary/40 transition-all flex flex-col items-center justify-center text-center gap-1 group shadow-sm hover:shadow-primary/10"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">📐</span>
          <span className="text-xs font-bold text-foreground">System Design</span>
          <span className="text-[10px] text-foreground/50 font-mono">{systemDesignDocs.length} Blueprints</span>
        </Link>
        <Link
          href="/topics"
          className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-primary/10 border border-white/5 hover:border-primary/40 transition-all flex flex-col items-center justify-center text-center gap-1 group shadow-sm hover:shadow-primary/10"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">📖</span>
          <span className="text-xs font-bold text-foreground">Core Topics</span>
          <span className="text-[10px] text-foreground/50 font-mono">React 19 &amp; AI</span>
        </Link>
        <Link
          href="/stories"
          className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-primary/10 border border-white/5 hover:border-primary/40 transition-all flex flex-col items-center justify-center text-center gap-1 group shadow-sm hover:shadow-primary/10"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">⭐</span>
          <span className="text-xs font-bold text-foreground">STAR Stories</span>
          <span className="text-[10px] text-foreground/50 font-mono">{storyCount} Production</span>
        </Link>
        <Link
          href="/resources"
          className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-primary/10 border border-white/5 hover:border-primary/40 transition-all flex flex-col items-center justify-center text-center gap-1 group shadow-sm hover:shadow-primary/10"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">🌐</span>
          <span className="text-xs font-bold text-foreground">Resource Hub</span>
          <span className="text-[10px] text-foreground/50 font-mono">{resourceCount} Links</span>
        </Link>
      </section>

      {/* Unified Command Center Widget (Replaces 5 stacked banners!) */}
      <section>
        <CommandCenterWidget />
      </section>

      {/* Structured 3-Pillar Knowledge Explorer */}
      <PillarsExplorer
        systemDesignCount={systemDesignDocs.length}
        codesCount={codes.length}
        resourceCount={resourceCount}
        storyCount={storyCount}
      />
    </div>
  );
}
