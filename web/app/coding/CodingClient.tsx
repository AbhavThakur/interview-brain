"use client";

import { useState, useMemo, useEffect } from "react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { CodingProblem } from "@/lib/markdown";
import { useProgress, ProblemStatus } from "@/lib/useProgress";
import { LeetCodeSolution } from "@/lib/leetcodeSolutions";
import { ClassicAlgorithm } from "@/lib/classicAlgorithms";
import CodePracticeArena, {
  PracticeProblem,
} from "@/components/CodePracticeArena";
import MockInterviewModal from "@/components/MockInterviewModal";

const statusConfig: Record<
  ProblemStatus,
  { label: string; badgeClass: string; icon: string }
> = {
  todo: {
    label: "To-Do",
    badgeClass: "bg-white/5 text-foreground/50 border border-white/5",
    icon: "⭕",
  },
  attempted: {
    label: "Attempted",
    badgeClass: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20",
    icon: "⏳",
  },
  review: {
    label: "Review",
    badgeClass: "bg-orange-500/20 text-orange-400 border border-orange-500/20",
    icon: "⚠️",
  },
  solved: {
    label: "Solved",
    badgeClass: "bg-green-500/20 text-green-400 border border-green-500/20",
    icon: "✅",
  },
};

export default function CodingClient({
  initialCodes,
  allSolutions = [],
  classicAlgorithms = [],
}: {
  initialCodes: CodingProblem[];
  allSolutions?: LeetCodeSolution[];
  classicAlgorithms?: ClassicAlgorithm[];
}) {
  const [activeMainTab, setActiveMainTab] = useState<
    "patterns" | "solutions" | "classic"
  >("patterns");
  const [activePracticeProblem, setActivePracticeProblem] =
    useState<PracticeProblem | null>(null);
  const [isMockModalOpen, setIsMockModalOpen] = useState(false);

  // Tab 1 (Curated Patterns) State
  const [selectedPattern, setSelectedPattern] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Tab 2 (500+ Solutions) State
  const [solutionSearch, setSolutionSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedSolDiff, setSelectedSolDiff] = useState("All");
  const [selectedSolStatus, setSelectedSolStatus] = useState<
    "All" | "Solved" | "Unsolved"
  >("All");
  const [expandedSolId, setExpandedSolId] = useState<number | null>(null);
  const [copiedSolId, setCopiedSolId] = useState<number | null>(null);
  const [solPage, setSolPage] = useState(1);
  const SOL_PAGE_SIZE = 30;

  // Solved tracking & sandbox state
  const LOCAL_STORAGE_SOLVED_SOLUTIONS =
    "interview_brain_solved_leetcode_solutions";
  const [solvedSolIds, setSolvedSolIds] = useState<number[]>([]);
  const [activeSandboxSolId, setActiveSandboxSolId] = useState<number | null>(
    null,
  );
  const [sandboxCode, setSandboxCode] = useState<Record<number, string>>({});
  const [sandboxOutput, setSandboxOutput] = useState<Record<number, string>>(
    {},
  );

  // Tab 3 (Classic CS Algorithms) State
  const LOCAL_STORAGE_SOLVED_CLASSIC = "interview_brain_solved_classic_algos";
  const [classicSearch, setClassicSearch] = useState("");
  const [selectedClassicCategory, setSelectedClassicCategory] = useState("All");
  const [selectedClassicDiff, setSelectedClassicDiff] = useState("All");
  const [expandedClassicId, setExpandedClassicId] = useState<string | null>(
    null,
  );
  const [classicSolvedIds, setClassicSolvedIds] = useState<string[]>([]);
  const [copiedClassicId, setCopiedClassicId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SOLVED_SOLUTIONS);
      if (saved) setSolvedSolIds(JSON.parse(saved));
      const savedClassic = localStorage.getItem(LOCAL_STORAGE_SOLVED_CLASSIC);
      if (savedClassic) setClassicSolvedIds(JSON.parse(savedClassic));
    } catch {
      // Ignore
    }
  }, []);

  // Listen for ?practice=... query param
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const practiceId = params.get("practice");
      if (practiceId) {
        const numId = parseInt(practiceId, 10);
        if (!isNaN(numId)) {
          const sol = allSolutions.find((s) => s.id === numId);
          if (sol) {
            setActivePracticeProblem({
              id: sol.id,
              title: `${sol.id}. ${sol.title}`,
              slug: sol.slug,
              difficulty: sol.difficulty,
              category: "LeetCode",
              topics: sol.topics,
              timeComplexity: sol.timeComplexity,
              spaceComplexity: sol.spaceComplexity,
              problemText: sol.problemText,
              solutionCode: sol.solutionCode,
              leetcodeUrl: sol.leetcodeUrl,
            });
          }
        } else {
          const algo = classicAlgorithms.find((a) => a.id === practiceId);
          if (algo) {
            setActivePracticeProblem({
              id: algo.id,
              title: algo.title,
              slug: algo.id,
              difficulty: algo.difficulty,
              category: algo.category,
              timeComplexity: algo.timeComplexity,
              spaceComplexity: algo.spaceComplexity,
              problemText:
                algo.readme ||
                `# ${algo.title}\n\nTime Complexity: ${algo.timeComplexity}\nSpace Complexity: ${algo.spaceComplexity}`,
              solutionCode: algo.code,
              starterCode: algo.starterCode,
              entryFunction: algo.entryFunction,
              testCases: algo.testCases.map((tc, idx) => ({
                id: tc.id || `tc-${idx + 1}`,
                ...tc,
              })),
            });
          }
        }
      }
    }
  }, [allSolutions, classicAlgorithms]);

  const toggleSolveSolution = (id: number) => {
    setSolvedSolIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      try {
        localStorage.setItem(
          LOCAL_STORAGE_SOLVED_SOLUTIONS,
          JSON.stringify(next),
        );
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const toggleSolveClassic = (id: string) => {
    setClassicSolvedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      try {
        localStorage.setItem(
          LOCAL_STORAGE_SOLVED_CLASSIC,
          JSON.stringify(next),
        );
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const runSolutionCode = (id: number, fallbackCode: string) => {
    try {
      const logs: string[] = [];
      const customConsole = {
        log: (...args: unknown[]) => {
          logs.push(
            args
              .map((a) =>
                typeof a === "object" ? JSON.stringify(a) : String(a),
              )
              .join(" "),
          );
        },
        error: (...args: unknown[]) => {
          logs.push(
            "ERROR: " +
              args
                .map((a) =>
                  typeof a === "object" ? JSON.stringify(a) : String(a),
                )
                .join(" "),
          );
        },
        warn: (...args: unknown[]) => {
          logs.push(
            "WARN: " +
              args
                .map((a) =>
                  typeof a === "object" ? JSON.stringify(a) : String(a),
                )
                .join(" "),
          );
        },
      };

      const codeToRun =
        sandboxCode[id] !== undefined ? sandboxCode[id] : fallbackCode;
      const fn = new Function("console", codeToRun);
      const result = fn(customConsole);
      if (result !== undefined && logs.length === 0) {
        logs.push(
          `Returned: ${typeof result === "object" ? JSON.stringify(result) : String(result)}`,
        );
      }
      setSandboxOutput((prev) => ({
        ...prev,
        [id]:
          logs.length > 0
            ? logs.join("\n")
            : "Code executed successfully (no console output).",
      }));
    } catch (err: unknown) {
      setSandboxOutput((prev) => ({
        ...prev,
        [id]: `Execution Error: ${err instanceof Error ? err.message : String(err)}`,
      }));
    }
  };

  const { progress, setProblemStatus } = useProgress();

  // Extract unique patterns for Tab 1
  const patterns = useMemo(() => {
    const p = new Set(
      initialCodes.map((c) => c.pattern || c.group || "General"),
    );
    return ["All", ...Array.from(p).sort()];
  }, [initialCodes]);

  // Filter problems for Tab 1
  const filteredCodes = useMemo(() => {
    return initialCodes.filter((c) => {
      const patternName = c.pattern || c.group || "General";
      const status = progress.codingStatus[c.id] || "todo";

      const matchesPattern =
        selectedPattern === "All" || patternName === selectedPattern;
      const matchesDifficulty =
        selectedDifficulty === "All" || c.difficulty === selectedDifficulty;
      const matchesStatus =
        selectedStatus === "All" || status === selectedStatus;
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.ahHaInsight &&
          c.ahHaInsight.toLowerCase().includes(searchQuery.toLowerCase()));

      return (
        matchesPattern && matchesDifficulty && matchesStatus && matchesSearch
      );
    });
  }, [
    initialCodes,
    selectedPattern,
    selectedDifficulty,
    selectedStatus,
    searchQuery,
    progress.codingStatus,
  ]);

  // Overall stats for Tab 1
  const stats = useMemo(() => {
    let solved = 0;
    let review = 0;
    let attempted = 0;
    let todo = 0;

    initialCodes.forEach((c) => {
      const status = progress.codingStatus[c.id] || "todo";
      if (status === "solved") solved++;
      else if (status === "review") review++;
      else if (status === "attempted") attempted++;
      else todo++;
    });

    return { solved, review, attempted, todo, total: initialCodes.length };
  }, [initialCodes, progress.codingStatus]);

  // Unique topic tags with counts for Tab 2
  const solutionTopics = useMemo(() => {
    const counts: Record<string, number> = {};
    allSolutions.forEach((s) => {
      s.topics.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([topic, count]) => ({ topic, count }));
  }, [allSolutions]);

  // Filter solutions for Tab 2
  const filteredSolutions = useMemo(() => {
    return allSolutions.filter((s) => {
      const search = solutionSearch.toLowerCase().trim();
      const matchSearch =
        !search ||
        s.title.toLowerCase().includes(search) ||
        s.id.toString() === search.replace(/^#/, "") ||
        s.topics.some((t) => t.toLowerCase().includes(search));
      const matchTopic =
        selectedTopic === "All" || s.topics.includes(selectedTopic);
      const matchDiff =
        selectedSolDiff === "All" ||
        s.difficulty.toLowerCase() === selectedSolDiff.toLowerCase();
      const matchStatus =
        selectedSolStatus === "All" ||
        (selectedSolStatus === "Solved" && solvedSolIds.includes(s.id)) ||
        (selectedSolStatus === "Unsolved" && !solvedSolIds.includes(s.id));
      return matchSearch && matchTopic && matchDiff && matchStatus;
    });
  }, [
    allSolutions,
    solutionSearch,
    selectedTopic,
    selectedSolDiff,
    selectedSolStatus,
    solvedSolIds,
  ]);

  // Paginated solutions for Tab 2
  const totalSolPages =
    Math.ceil(filteredSolutions.length / SOL_PAGE_SIZE) || 1;
  const paginatedSolutions = useMemo(() => {
    const start = (solPage - 1) * SOL_PAGE_SIZE;
    return filteredSolutions.slice(start, start + SOL_PAGE_SIZE);
  }, [filteredSolutions, solPage]);

  // Solutions stats
  const solStats = useMemo(() => {
    const counts = { Easy: 0, Medium: 0, Hard: 0 };
    allSolutions.forEach((s) => {
      if (s.difficulty === "Easy") counts.Easy++;
      else if (s.difficulty === "Hard") counts.Hard++;
      else counts.Medium++;
    });
    return counts;
  }, [allSolutions]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const toggleSolExpand = (id: number) => {
    setExpandedSolId((prev) => (prev === id ? null : id));
  };

  const copySolutionCode = (id: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSolId(id);
    setTimeout(() => setCopiedSolId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header with Stats Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider">
              Coding Practice Matrix
            </span>
            <span className="text-xs text-foreground/40 font-mono">
              {stats.solved} / {stats.total} Solved (
              {Math.round((stats.solved / (stats.total || 1)) * 100)}%)
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Coding & Algorithmic Patterns
          </h1>
          <p className="text-foreground/60 mt-1 max-w-2xl text-sm">
            Master high-frequency interview patterns with curated Blind 75
            blueprints and search across 500+ verified JavaScript solutions with
            complexity analysis.
          </p>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2 rounded-2xl">
          <div className="text-center px-3">
            <span className="text-[10px] text-foreground/40 block uppercase">
              Solved
            </span>
            <span className="text-sm font-bold text-green-400">
              {stats.solved}
            </span>
          </div>
          <div className="w-[1px] h-6 bg-white/10"></div>
          <div className="text-center px-3">
            <span className="text-[10px] text-foreground/40 block uppercase">
              Review
            </span>
            <span className="text-sm font-bold text-orange-400">
              {stats.review}
            </span>
          </div>
          <div className="w-[1px] h-6 bg-white/10"></div>
          <div className="text-center px-3">
            <span className="text-[10px] text-foreground/40 block uppercase">
              To-Do
            </span>
            <span className="text-sm font-bold text-foreground/60">
              {stats.todo + stats.attempted}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Mode Tabs */}
      <div className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveMainTab("patterns")}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeMainTab === "patterns"
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "bg-white/5 text-foreground/60 hover:text-white hover:bg-white/10 border border-white/5"
          }`}
        >
          <span>🎯 Curated Grind 75 & Patterns</span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${activeMainTab === "patterns" ? "bg-white/20" : "bg-white/5 text-foreground/50"}`}
          >
            {initialCodes.length}
          </span>
        </button>

        <button
          onClick={() => setActiveMainTab("solutions")}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeMainTab === "solutions"
              ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
              : "bg-white/5 text-foreground/60 hover:text-white hover:bg-white/10 border border-white/5"
          }`}
        >
          <span>⚡ 500+ LeetCode Solutions Database</span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${activeMainTab === "solutions" ? "bg-black/20 text-black" : "bg-amber-500/20 text-amber-400"}`}
          >
            {solvedSolIds.length > 0
              ? `${solvedSolIds.length}/${allSolutions.length} Solved`
              : allSolutions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveMainTab("classic")}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeMainTab === "classic"
              ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
              : "bg-white/5 text-foreground/60 hover:text-white hover:bg-white/10 border border-white/5"
          }`}
        >
          <span>🏛️ Classic CS & JS Polyfills</span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${activeMainTab === "classic" ? "bg-black/20 text-black" : "bg-cyan-500/20 text-cyan-400"}`}
          >
            {classicSolvedIds.length > 0
              ? `${classicSolvedIds.length}/${classicAlgorithms.length} Solved`
              : classicAlgorithms.length}
          </span>
        </button>

        {/* Mock Interview Launch Button */}
        <button
          onClick={() => setIsMockModalOpen(true)}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          title="Start a timed mock technical interview"
        >
          <span>⏱️ Mock Interview Drill</span>
        </button>
      </div>

      {/* TAB 1: CURATED PATTERNS (Existing View) */}
      {activeMainTab === "patterns" && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          {/* Filter Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Pattern Filter */}
              <select
                value={selectedPattern}
                onChange={(e) => setSelectedPattern(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
              >
                {patterns.map((p) => (
                  <option
                    key={p}
                    value={p}
                    className="bg-[#1e222a] text-foreground"
                  >
                    {p === "All" ? "All Patterns" : p}
                  </option>
                ))}
              </select>

              {/* Difficulty Filter */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
              >
                <option value="All" className="bg-[#1e222a]">
                  All Difficulties
                </option>
                <option value="Easy" className="bg-[#1e222a]">
                  Easy
                </option>
                <option value="Medium" className="bg-[#1e222a]">
                  Medium
                </option>
                <option value="Hard" className="bg-[#1e222a]">
                  Hard
                </option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
              >
                <option value="All" className="bg-[#1e222a]">
                  All Statuses
                </option>
                <option value="todo" className="bg-[#1e222a]">
                  ⭕ To-Do
                </option>
                <option value="attempted" className="bg-[#1e222a]">
                  ⏳ Attempted
                </option>
                <option value="review" className="bg-[#1e222a]">
                  ⚠️ Needs Review
                </option>
                <option value="solved" className="bg-[#1e222a]">
                  ✅ Solved
                </option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors ${viewMode === "cards" ? "bg-primary text-white font-semibold" : "text-foreground/60 hover:text-white"}`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors ${viewMode === "table" ? "bg-primary text-white font-semibold" : "text-foreground/60 hover:text-white"}`}
                >
                  Table
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="w-full lg:w-72">
              <input
                type="text"
                placeholder="Search problem, pattern, or ah-ha insight..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/40"
              />
            </div>
          </div>

          {/* Problems Count */}
          <div className="text-xs text-foreground/50">
            Showing {filteredCodes.length} of {initialCodes.length} challenges
          </div>

          {/* Cards View Mode */}
          {viewMode === "cards" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCodes.map((code) => {
                const isExpanded = expandedId === code.id;
                const status = progress.codingStatus[code.id] || "todo";
                const statusInfo = statusConfig[status];

                return (
                  <div
                    key={code.id}
                    className="glass-card p-5 flex flex-col justify-between border-white/10 hover:border-white/20 transition-all gap-4 group"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-semibold tracking-wider text-primary uppercase">
                          {code.pattern || code.group}
                        </span>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              code.difficulty === "Easy"
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : code.difficulty === "Medium"
                                  ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                  : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}
                          >
                            {code.difficulty}
                          </span>

                          <select
                            value={status}
                            onChange={(e) =>
                              setProblemStatus(
                                code.id,
                                e.target.value as ProblemStatus,
                              )
                            }
                            className={`text-xs font-semibold px-2 py-0.5 rounded-lg border focus:outline-none transition-colors cursor-pointer ${statusInfo.badgeClass}`}
                          >
                            <option
                              value="todo"
                              className="bg-[#1e222a] text-foreground"
                            >
                              ⭕ To-Do
                            </option>
                            <option
                              value="attempted"
                              className="bg-[#1e222a] text-yellow-400"
                            >
                              ⏳ Attempted
                            </option>
                            <option
                              value="review"
                              className="bg-[#1e222a] text-orange-400"
                            >
                              ⚠️ Review
                            </option>
                            <option
                              value="solved"
                              className="bg-[#1e222a] text-green-400"
                            >
                              ✅ Solved
                            </option>
                          </select>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {code.title}
                      </h3>

                      {code.ahHaInsight && (
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-xs text-foreground/80 mt-1">
                          <span className="font-bold text-primary block mb-0.5">
                            💡 Ah-Ha Intuition:
                          </span>
                          {code.ahHaInsight}
                        </div>
                      )}

                      {(code.timeComplexity || code.spaceComplexity) && (
                        <div className="flex items-center gap-3 text-[11px] font-mono text-foreground/50 mt-1">
                          {code.timeComplexity && (
                            <span>⏱️ Time: {code.timeComplexity}</span>
                          )}
                          {code.spaceComplexity && (
                            <span>💾 Space: {code.spaceComplexity}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="border-t border-white/5 pt-3 flex items-center justify-between gap-2">
                      <button
                        onClick={() => toggleExpand(code.id)}
                        className="text-xs font-semibold text-foreground/70 hover:text-white flex items-center gap-1"
                      >
                        <span>
                          {isExpanded
                            ? "Hide Solution Notes"
                            : "View Solution Notes"}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>

                      {code.leetcodeUrl && (
                        <a
                          href={code.leetcodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold bg-primary/15 hover:bg-primary text-primary hover:text-white px-3 py-1.5 rounded-lg transition-all"
                        >
                          <span>Solve on Platform</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      )}
                    </div>

                    {/* Collapsible Solution Content */}
                    {isExpanded && (
                      <div className="border-t border-white/10 pt-4 mt-2 prose-dark max-w-none text-xs">
                        <MarkdownRenderer content={code.content} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Table View Mode */}
          {viewMode === "table" && (
            <div className="glass-card overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-foreground/50">
                    <th className="p-3">Status</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Pattern</th>
                    <th className="p-3">Difficulty</th>
                    <th className="p-3">Complexity</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCodes.map((code) => {
                    const status = progress.codingStatus[code.id] || "todo";
                    return (
                      <tr
                        key={code.id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="p-3">
                          <select
                            value={status}
                            onChange={(e) =>
                              setProblemStatus(
                                code.id,
                                e.target.value as ProblemStatus,
                              )
                            }
                            className="bg-transparent border border-white/10 rounded px-1.5 py-0.5 text-[11px] cursor-pointer"
                          >
                            <option value="todo" className="bg-[#1e222a]">
                              ⭕ To-Do
                            </option>
                            <option value="attempted" className="bg-[#1e222a]">
                              ⏳ Attempted
                            </option>
                            <option value="review" className="bg-[#1e222a]">
                              ⚠️ Review
                            </option>
                            <option value="solved" className="bg-[#1e222a]">
                              ✅ Solved
                            </option>
                          </select>
                        </td>
                        <td className="p-3 font-semibold text-foreground">
                          {code.title}
                        </td>
                        <td className="p-3 text-foreground/60">
                          {code.pattern || code.group}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              code.difficulty === "Easy"
                                ? "text-green-400 bg-green-500/10"
                                : code.difficulty === "Medium"
                                  ? "text-yellow-400 bg-yellow-500/10"
                                  : "text-red-400 bg-red-500/10"
                            }`}
                          >
                            {code.difficulty}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-foreground/50 text-[11px]">
                          {code.timeComplexity || "-"}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => toggleExpand(code.id)}
                            className="text-primary hover:underline font-semibold"
                          >
                            {expandedId === code.id ? "Close" : "Details"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Expanded Solution for Table View */}
          {viewMode === "table" && expandedId && (
            <div className="glass-card p-6 mt-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <h3 className="text-lg font-bold">
                  {filteredCodes.find((c) => c.id === expandedId)?.title}
                </h3>
                <button
                  onClick={() => setExpandedId(null)}
                  className="text-xs text-foreground/50 hover:text-white"
                >
                  Close ✕
                </button>
              </div>
              <div className="prose-dark max-w-none">
                <MarkdownRenderer
                  content={
                    filteredCodes.find((c) => c.id === expandedId)?.content ||
                    ""
                  }
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: 500+ LEETCODE JAVASCRIPT SOLUTIONS DATABASE */}
      {activeMainTab === "solutions" && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          {/* Attribution & Info Banner */}
          <div className="glass-card p-5 border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-transparent to-primary/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                ⚡
              </span>
              <div>
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <span>
                    500+ LeetCode JavaScript Solutions Offline Database
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-mono">
                    MIT Open Source
                  </span>
                </h3>
                <p className="text-xs text-foreground/70 mt-1 max-w-3xl leading-relaxed">
                  Curated open-source archive originally compiled by{" "}
                  <span className="font-semibold text-amber-400">
                    Baffin Lee
                  </span>{" "}
                  (MIT). Complete offline access with Big-O complexity analysis,
                  in-browser code practice editor with test case management, and
                  verified optimal solutions.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <a
                href="https://github.com/BaffinLee/leetcode-javascript"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-foreground/80 hover:text-white transition-colors"
              >
                GitHub Source ↗
              </a>
            </div>
          </div>

          {/* Solutions Filter & Search Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Topic Tag Selector */}
              <select
                value={selectedTopic}
                onChange={(e) => {
                  setSelectedTopic(e.target.value);
                  setSolPage(1);
                }}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-400 transition-colors appearance-none cursor-pointer"
              >
                <option value="All" className="bg-[#1e222a]">
                  All Topics ({allSolutions.length})
                </option>
                {solutionTopics.map(({ topic, count }) => (
                  <option key={topic} value={topic} className="bg-[#1e222a]">
                    {topic} ({count})
                  </option>
                ))}
              </select>

              {/* Difficulty Selector */}
              <select
                value={selectedSolDiff}
                onChange={(e) => {
                  setSelectedSolDiff(e.target.value);
                  setSolPage(1);
                }}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-400 transition-colors appearance-none cursor-pointer"
              >
                <option value="All" className="bg-[#1e222a]">
                  All Difficulties ({allSolutions.length})
                </option>
                <option value="Easy" className="bg-[#1e222a]">
                  Easy ({solStats.Easy})
                </option>
                <option value="Medium" className="bg-[#1e222a]">
                  Medium ({solStats.Medium})
                </option>
                <option value="Hard" className="bg-[#1e222a]">
                  Hard ({solStats.Hard})
                </option>
              </select>

              {/* Solved Status Selector */}
              <select
                value={selectedSolStatus}
                onChange={(e) => {
                  setSelectedSolStatus(
                    e.target.value as "All" | "Solved" | "Unsolved",
                  );
                  setSolPage(1);
                }}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-400 transition-colors appearance-none cursor-pointer"
              >
                <option value="All" className="bg-[#1e222a]">
                  All Status ({allSolutions.length})
                </option>
                <option value="Solved" className="bg-[#1e222a]">
                  ✓ Solved ({solvedSolIds.length})
                </option>
                <option value="Unsolved" className="bg-[#1e222a]">
                  ○ Unsolved ({allSolutions.length - solvedSolIds.length})
                </option>
              </select>

              {/* Quick Difficulty Pills */}
              <div className="hidden sm:flex items-center gap-1.5 bg-white/5 border border-white/10 p-1 rounded-xl">
                {(["All", "Easy", "Medium", "Hard"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedSolDiff(d);
                      setSolPage(1);
                    }}
                    className={`px-2.5 py-1 text-[11px] rounded-lg transition-colors font-medium ${
                      selectedSolDiff === d
                        ? d === "Easy"
                          ? "bg-green-500/20 text-green-400 font-bold"
                          : d === "Medium"
                            ? "bg-yellow-500/20 text-yellow-400 font-bold"
                            : d === "Hard"
                              ? "bg-red-500/20 text-red-400 font-bold"
                              : "bg-white/15 text-white font-bold"
                        : "text-foreground/50 hover:text-white"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Instant Search Bar */}
            <div className="w-full lg:w-80">
              <input
                type="text"
                placeholder="Search by #ID (e.g. 1, 146), title, or tag..."
                value={solutionSearch}
                onChange={(e) => {
                  setSolutionSearch(e.target.value);
                  setSolPage(1);
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-400 transition-colors placeholder:text-foreground/40"
              />
            </div>
          </div>

          {/* Solutions Results Summary & Pagination Header */}
          <div className="flex items-center justify-between text-xs text-foreground/50">
            <span>
              Showing{" "}
              {filteredSolutions.length === 0
                ? 0
                : (solPage - 1) * SOL_PAGE_SIZE + 1}
              –{Math.min(solPage * SOL_PAGE_SIZE, filteredSolutions.length)} of{" "}
              {filteredSolutions.length} solutions
            </span>

            {totalSolPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  disabled={solPage <= 1}
                  onClick={() => setSolPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded bg-white/5 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                >
                  ← Prev
                </button>
                <span className="font-mono text-foreground/80">
                  Page {solPage} of {totalSolPages}
                </span>
                <button
                  disabled={solPage >= totalSolPages}
                  onClick={() =>
                    setSolPage((p) => Math.min(totalSolPages, p + 1))
                  }
                  className="px-2.5 py-1 rounded bg-white/5 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* Solutions List */}
          {filteredSolutions.length === 0 ? (
            <div className="glass-card p-12 text-center text-foreground/50">
              No solutions found matching your search or filters.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {paginatedSolutions.map((sol) => {
                const isExpanded = expandedSolId === sol.id;

                return (
                  <div
                    key={sol.id}
                    className="glass-card p-4 sm:p-5 border-white/10 hover:border-white/20 transition-all flex flex-col gap-3 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Left: ID, Title & Badges */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="text-xs font-mono font-bold text-amber-400/90 w-10">
                          #{sol.id}
                        </span>

                        <h4 className="font-bold text-sm text-foreground group-hover:text-amber-400 transition-colors">
                          {sol.title}
                        </h4>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            sol.difficulty === "Easy"
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : sol.difficulty === "Medium"
                                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}
                        >
                          {sol.difficulty}
                        </span>

                        {sol.timeComplexity && (
                          <span className="text-[10px] bg-white/5 text-foreground/60 px-2 py-0.5 rounded font-mono hidden md:inline">
                            ⏱️ {sol.timeComplexity}
                          </span>
                        )}

                        {sol.spaceComplexity && (
                          <span className="text-[10px] bg-white/5 text-foreground/60 px-2 py-0.5 rounded font-mono hidden md:inline">
                            💾 {sol.spaceComplexity}
                          </span>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <button
                          onClick={() => toggleSolveSolution(sol.id)}
                          className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-all flex items-center gap-1.5 ${
                            solvedSolIds.includes(sol.id)
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/10"
                              : "bg-white/5 text-foreground/50 border-white/10 hover:text-white hover:bg-white/10"
                          }`}
                          title={
                            solvedSolIds.includes(sol.id)
                              ? "Mark as Unsolved"
                              : "Mark as Solved"
                          }
                        >
                          <span
                            className={
                              solvedSolIds.includes(sol.id)
                                ? "text-emerald-400 font-bold"
                                : ""
                            }
                          >
                            {solvedSolIds.includes(sol.id)
                              ? "✓ Solved"
                              : "○ Solve"}
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            setActivePracticeProblem({
                              id: sol.id,
                              title: `${sol.id}. ${sol.title}`,
                              slug: sol.slug,
                              difficulty: sol.difficulty,
                              category: "LeetCode",
                              topics: sol.topics,
                              timeComplexity: sol.timeComplexity,
                              spaceComplexity: sol.spaceComplexity,
                              problemText: sol.problemText,
                              solutionCode: sol.solutionCode,
                              leetcodeUrl: sol.leetcodeUrl,
                            });
                          }}
                          className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-900/30"
                          title="Open in interactive in-browser code editor with test cases"
                        >
                          <span>⚡ Practice in Arena</span>
                        </button>

                        <button
                          onClick={() => toggleSolExpand(sol.id)}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all flex items-center gap-1.5 ${
                            isExpanded
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                              : "bg-white/5 text-foreground/80 border-white/10 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <span>
                            {isExpanded ? "Hide Code" : "⚡ View Code"}
                          </span>
                          <span className="text-[10px]">
                            {isExpanded ? "▲" : "▼"}
                          </span>
                        </button>

                        <a
                          href={sol.leetcodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-2.5 py-1.5 rounded-lg transition-colors font-semibold"
                          title="Open problem on LeetCode"
                        >
                          LeetCode ↗
                        </a>
                      </div>
                    </div>

                    {/* Topic Tags */}
                    {sol.topics.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {sol.topics.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => {
                              setSelectedTopic(tag);
                              setSolPage(1);
                            }}
                            className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                              selectedTopic === tag
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/30 font-semibold"
                                : "bg-white/5 text-foreground/50 border-white/5 hover:text-foreground/80 hover:bg-white/10"
                            }`}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Collapsible Solution Code & Details */}
                    {isExpanded && (
                      <div className="border-t border-white/10 pt-4 mt-1 flex flex-col gap-4 animate-in fade-in duration-200">
                        {/* Problem Description */}
                        {sol.problemText && (
                          <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-xs text-foreground/80 leading-relaxed">
                            <span className="font-bold text-foreground block mb-2">
                              📋 Problem Statement:
                            </span>
                            <div className="whitespace-pre-wrap font-sans text-xs">
                              {sol.problemText}
                            </div>
                          </div>
                        )}

                        {/* Code Header Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0d0f15] border border-white/10 px-4 py-2.5 rounded-t-xl">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-amber-400">
                              JavaScript (ES6) Reference Solution
                            </span>
                            {sol.timeComplexity && (
                              <span className="text-[10px] bg-white/5 text-foreground/70 px-2 py-0.5 rounded font-mono">
                                Time: {sol.timeComplexity}
                              </span>
                            )}
                            {sol.spaceComplexity && (
                              <span className="text-[10px] bg-white/5 text-foreground/70 px-2 py-0.5 rounded font-mono">
                                Space: {sol.spaceComplexity}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setActivePracticeProblem({
                                  id: sol.id,
                                  title: `${sol.id}. ${sol.title}`,
                                  slug: sol.slug,
                                  difficulty: sol.difficulty,
                                  category: "LeetCode",
                                  topics: sol.topics,
                                  timeComplexity: sol.timeComplexity,
                                  spaceComplexity: sol.spaceComplexity,
                                  problemText: sol.problemText,
                                  solutionCode: sol.solutionCode,
                                  leetcodeUrl: sol.leetcodeUrl,
                                });
                              }}
                              className="text-xs px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <span>⚡ Practice in Arena</span>
                            </button>
                            <button
                              onClick={() => {
                                const nextState =
                                  activeSandboxSolId === sol.id ? null : sol.id;
                                setActiveSandboxSolId(nextState);
                                if (
                                  nextState !== null &&
                                  !sandboxCode[sol.id]
                                ) {
                                  const funcMatch = sol.solutionCode.match(
                                    /var\s+([a-zA-Z0-9_$]+)\s*=\s*function|function\s+([a-zA-Z0-9_$]+)/,
                                  );
                                  const fnName = funcMatch
                                    ? funcMatch[1] || funcMatch[2]
                                    : "solution";
                                  const starter = `${sol.solutionCode}\n\n// ⚡ Test runner - edit arguments below:\ntry {\n  console.log("▶ Executing ${fnName}...");\n  // console.log(${fnName}(...));\n  console.log("Ready to test! Add function call with test inputs above.");\n} catch (err) {\n  console.error(err.message);\n}`;
                                  setSandboxCode((prev) => ({
                                    ...prev,
                                    [sol.id]: starter,
                                  }));
                                }
                              }}
                              className={`text-xs px-2.5 py-1 rounded font-medium transition-colors flex items-center gap-1 ${
                                activeSandboxSolId === sol.id
                                  ? "bg-amber-500 text-black font-bold"
                                  : "bg-white/10 hover:bg-white/20 text-amber-300"
                              }`}
                            >
                              <span>
                                {activeSandboxSolId === sol.id
                                  ? "✕ Close Sandbox"
                                  : "▶ Run Sandbox"}
                              </span>
                            </button>

                            <button
                              onClick={() =>
                                copySolutionCode(sol.id, sol.solutionCode)
                              }
                              className="text-xs px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium transition-colors flex items-center gap-1"
                            >
                              <span>
                                {copiedSolId === sol.id
                                  ? "✓ Copied"
                                  : "📋 Copy Code"}
                              </span>
                            </button>

                            <a
                              href={sol.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-foreground/50 hover:text-foreground/80"
                            >
                              GitHub Source ↗
                            </a>
                          </div>
                        </div>

                        {/* Code Pre Block */}
                        <pre className="font-mono text-xs bg-[#08090d] text-emerald-300 p-4 rounded-b-xl overflow-x-auto leading-relaxed border-x border-b border-white/10 -mt-4 selection:bg-emerald-500/20">
                          <code>{sol.solutionCode}</code>
                        </pre>

                        {/* Interactive Sandbox Runner Drawer */}
                        {activeSandboxSolId === sol.id && (
                          <div className="bg-[#0b0d14] border border-amber-500/30 rounded-xl p-4 flex flex-col gap-3 animate-in fade-in duration-200">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                                <span>⚡</span> In-Browser JavaScript Sandbox
                              </span>
                              <button
                                onClick={() =>
                                  runSolutionCode(sol.id, sol.solutionCode)
                                }
                                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-3 py-1 rounded-lg text-xs transition-colors flex items-center gap-1 shadow-sm shadow-emerald-500/20"
                              >
                                <span>▶ Execute Code</span>
                              </button>
                            </div>
                            <textarea
                              value={
                                sandboxCode[sol.id] !== undefined
                                  ? sandboxCode[sol.id]
                                  : sol.solutionCode
                              }
                              onChange={(e) =>
                                setSandboxCode((prev) => ({
                                  ...prev,
                                  [sol.id]: e.target.value,
                                }))
                              }
                              rows={8}
                              className="w-full bg-[#050609] border border-white/10 rounded-lg p-3 font-mono text-xs text-emerald-300 focus:outline-none focus:border-amber-400 leading-relaxed"
                              placeholder="Write or edit code to execute..."
                            />
                            {sandboxOutput[sol.id] && (
                              <div className="bg-black/70 border border-white/10 rounded-lg p-3">
                                <span className="text-[10px] text-foreground/40 font-mono block uppercase mb-1">
                                  Execution Output:
                                </span>
                                <pre className="font-mono text-xs text-amber-300 whitespace-pre-wrap leading-relaxed">
                                  {sandboxOutput[sol.id]}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Similar Questions */}
                        {sol.similarQuestions.length > 0 && (
                          <div className="text-xs text-foreground/50 flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="font-semibold text-foreground/70">
                              Similar Questions:
                            </span>
                            {sol.similarQuestions.map((q) => (
                              <button
                                key={q}
                                onClick={() => {
                                  setSolutionSearch(q);
                                  setSelectedTopic("All");
                                  setSolPage(1);
                                }}
                                className="bg-white/5 hover:bg-white/10 text-foreground/70 px-2 py-0.5 rounded transition-colors text-[11px]"
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Pagination */}
          {totalSolPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-white/10 text-xs">
              <button
                disabled={solPage <= 1}
                onClick={() => {
                  setSolPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
              >
                ← Previous Page
              </button>
              <span className="font-mono text-foreground/70">
                Page {solPage} of {totalSolPages}
              </span>
              <button
                disabled={solPage >= totalSolPages}
                onClick={() => {
                  setSolPage((p) => Math.min(totalSolPages, p + 1));
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
              >
                Next Page →
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CLASSIC CS ALGORITHMS (TREKHLEB) */}
      {activeMainTab === "classic" && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-[#0c1017] border border-cyan-500/20 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-2xl shrink-0">
                🏛️
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                  <span>Classic CS Algorithms & Data Structures</span>
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30 font-mono">
                    Oleksii Trekhleb (MIT)
                  </span>
                </h3>
                <p className="text-xs text-foreground/70 mt-1 max-w-3xl leading-relaxed">
                  Foundational Computer Science implementations from scratch —
                  Linked Lists, Trees, Graphs, LRU Cache, Trie, Quicksort, Merge
                  Sort, Dijkstra, and Dynamic Programming. Each with Big-O
                  complexity analysis, interactive test cases, and in-browser
                  practice arena.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <a
                href="https://github.com/trekhleb/javascript-algorithms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-foreground/80 hover:text-white transition-colors"
              >
                GitHub Source (190k+ ★) ↗
              </a>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Category Filter */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs">
                <span className="text-foreground/40 font-mono">Category:</span>
                <select
                  value={selectedClassicCategory}
                  onChange={(e) => setSelectedClassicCategory(e.target.value)}
                  className="bg-transparent text-foreground font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-[#12141c]">
                    All Categories ({classicAlgorithms.length})
                  </option>
                  {Array.from(
                    new Set(classicAlgorithms.map((a) => a.category)),
                  ).map((cat) => (
                    <option key={cat} value={cat} className="bg-[#12141c]">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl p-1 text-xs">
                {["All", "Easy", "Medium", "Hard"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedClassicDiff(diff)}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                      selectedClassicDiff === diff
                        ? "bg-cyan-500 text-black font-semibold"
                        : "text-foreground/60 hover:text-white"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search algorithm or structure..."
                value={classicSearch}
                onChange={(e) => setClassicSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-cyan-400 pl-9 transition-colors"
              />
              <span className="absolute left-3 top-2.5 text-foreground/40 text-xs">
                🔍
              </span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classicAlgorithms
              .filter((algo) => {
                const matchesSearch =
                  classicSearch === "" ||
                  algo.title
                    .toLowerCase()
                    .includes(classicSearch.toLowerCase()) ||
                  algo.category
                    .toLowerCase()
                    .includes(classicSearch.toLowerCase()) ||
                  algo.entryFunction
                    .toLowerCase()
                    .includes(classicSearch.toLowerCase()) ||
                  algo.timeComplexity
                    .toLowerCase()
                    .includes(classicSearch.toLowerCase());
                const matchesCat =
                  selectedClassicCategory === "All" ||
                  algo.category === selectedClassicCategory;
                const matchesDiff =
                  selectedClassicDiff === "All" ||
                  algo.difficulty === selectedClassicDiff;
                return matchesSearch && matchesCat && matchesDiff;
              })
              .map((algo) => {
                const isSolved = classicSolvedIds.includes(algo.id);
                const isExpanded = expandedClassicId === algo.id;
                return (
                  <div
                    key={algo.id}
                    className={`bg-white/[0.02] border rounded-2xl p-5 transition-all flex flex-col justify-between ${
                      isSolved
                        ? "border-emerald-500/30 bg-emerald-500/[0.02]"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono bg-white/5 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded">
                          {algo.category}
                        </span>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                              algo.difficulty === "Easy"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : algo.difficulty === "Medium"
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                  : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            }`}
                          >
                            {algo.difficulty}
                          </span>

                          <button
                            onClick={() => toggleSolveClassic(algo.id)}
                            className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs transition-colors ${
                              isSolved
                                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                                : "border-white/15 text-foreground/30 hover:border-white/40"
                            }`}
                            title="Toggle solved status"
                          >
                            {isSolved ? "✓" : ""}
                          </button>
                        </div>
                      </div>

                      {/* Title & Entry */}
                      <h4 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                        <span>{algo.title}</span>
                      </h4>

                      {/* Complexity Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-3 text-[11px] font-mono">
                        <span className="text-amber-300/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          ⏱ {algo.timeComplexity}
                        </span>
                        <span className="text-cyan-300/90 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                          💾 {algo.spaceComplexity}
                        </span>
                      </div>

                      <div className="text-xs text-foreground/60 line-clamp-2 mb-4 leading-relaxed">
                        Entry:{" "}
                        <code className="text-foreground/90 font-mono">
                          {algo.entryFunction}
                        </code>
                        . Includes {algo.testCases.length} built-in assertion
                        tests.
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setActivePracticeProblem({
                            id: algo.id,
                            title: algo.title,
                            slug: algo.id,
                            difficulty: algo.difficulty,
                            category: algo.category,
                            timeComplexity: algo.timeComplexity,
                            spaceComplexity: algo.spaceComplexity,
                            problemText:
                              algo.readme ||
                              `# ${algo.title}\n\nTime Complexity: ${algo.timeComplexity}\nSpace Complexity: ${algo.spaceComplexity}`,
                            solutionCode: algo.code,
                            starterCode: algo.starterCode,
                            entryFunction: algo.entryFunction,
                            testCases: algo.testCases.map((tc, idx) => ({
                              id: tc.id || `tc-${idx + 1}`,
                              ...tc,
                            })),
                          });
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-cyan-500/20"
                        title="Practice in Editor"
                      >
                        <span>⚡ Practice in Arena</span>
                      </button>

                      <button
                        onClick={() =>
                          setExpandedClassicId(isExpanded ? null : algo.id)
                        }
                        className="text-xs text-foreground/60 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors font-medium"
                      >
                        {isExpanded ? "▲ Hide" : "▼ Theory & Code"}
                      </button>
                    </div>

                    {/* Collapsible Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-cyan-300">
                            Standalone Implementation:
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(algo.code);
                              setCopiedClassicId(algo.id);
                              setTimeout(() => setCopiedClassicId(null), 2000);
                            }}
                            className="text-[11px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-foreground/80 transition-colors"
                          >
                            {copiedClassicId === algo.id
                              ? "✓ Copied"
                              : "📋 Copy"}
                          </button>
                        </div>
                        <pre className="font-mono text-xs bg-black/60 text-emerald-300 p-3 rounded-lg overflow-x-auto border border-white/5 leading-relaxed max-h-60">
                          <code>{algo.code}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* In-Browser Code Practice Arena Modal */}
      {activePracticeProblem && (
        <CodePracticeArena
          problem={activePracticeProblem}
          onClose={() => setActivePracticeProblem(null)}
          isSolved={
            typeof activePracticeProblem.id === "number"
              ? solvedSolIds.includes(activePracticeProblem.id)
              : classicSolvedIds.includes(String(activePracticeProblem.id))
          }
          onToggleSolved={(id) => {
            if (typeof id === "number") {
              toggleSolveSolution(id);
            } else {
              toggleSolveClassic(String(id));
            }
          }}
        />
      )}

      {/* Mock Interview Drill Modal */}
      <MockInterviewModal
        isOpen={isMockModalOpen}
        onClose={() => setIsMockModalOpen(false)}
        onStartMock={(prob) => setActivePracticeProblem(prob)}
        patterns={initialCodes}
        allSolutions={allSolutions}
        classicAlgorithms={classicAlgorithms}
        solvedIds={[...solvedSolIds, ...classicSolvedIds]}
      />
    </div>
  );
}
