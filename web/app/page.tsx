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
    <div className="flex flex-col gap-8 py-4 animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-5xl mx-auto">
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
