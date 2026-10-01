"use client";

import React, { useState, useEffect, useMemo } from "react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import ModernCodeEditor from "@/components/ModernCodeEditor";
import {
  TestCase,
  ExecutionSummary,
  runAllTestCases,
  runTestCase,
  extractStarterCode,
  detectEntryFunction,
  formatValue,
} from "@/lib/practiceEngine";
import { getTestCasesForProblem } from "@/lib/curatedTestCases";

export interface PracticeProblem {
  id: string | number;
  title: string;
  slug?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category?: string;
  topics?: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
  problemText: string;
  solutionCode: string;
  starterCode?: string;
  entryFunction?: string;
  testCaseProblemId?: number;
  testCases?: TestCase[];
  leetcodeUrl?: string;
  initialTimerMinutes?: number;
  isMockMode?: boolean;
}

interface CodePracticeArenaProps {
  problem: PracticeProblem;
  onClose?: () => void;
  isSolved?: boolean;
  onToggleSolved?: (id: string | number) => void;
}

export default function CodePracticeArena({
  problem,
  onClose,
  isSolved = false,
  onToggleSolved,
}: CodePracticeArenaProps) {
  const problemKey = `problem_${problem.id}`;
  const LOCAL_STORAGE_CODE_KEY = `interview_brain_code_draft_${problemKey}`;

  // Default starter code & entry function
  const defaultStarterCode = useMemo(() => {
    if (problem.starterCode) return problem.starterCode;
    return extractStarterCode(problem.solutionCode, problem.title);
  }, [problem]);

  const defaultEntryFn = useMemo(() => {
    if (problem.entryFunction) return problem.entryFunction;
    return detectEntryFunction(problem.solutionCode);
  }, [problem]);

  // Code editor state
  const [code, setCode] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_CODE_KEY);
        if (saved) return saved;
      } catch {
        // ignore
      }
    }
    return defaultStarterCode;
  });

  // Test cases state
  const initialCases = useMemo<TestCase[]>(() => {
    if (problem.testCases && problem.testCases.length > 0) {
      return problem.testCases;
    }
    const numId =
      problem.testCaseProblemId ??
      (typeof problem.id === "number"
        ? problem.id
        : parseInt(String(problem.id), 10));
    return getTestCasesForProblem(
      isNaN(numId) ? 9999 : numId,
      problem.problemText,
    );
  }, [problem]);

  const [testCases, setTestCases] = useState<TestCase[]>(initialCases);
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);

  // Execution & results state
  const [bottomTab, setBottomTab] = useState<
    "testcases" | "results" | "console"
  >("testcases");
  const [drawerSize, setDrawerSize] = useState<"normal" | "tall" | "collapsed">(
    "normal",
  );
  const [isRunning, setIsRunning] = useState(false);
  const [execSummary, setExecSummary] = useState<ExecutionSummary | null>(null);
  const [activeResultIndex, setActiveResultIndex] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [showSolutionSpoiler, setShowSolutionSpoiler] = useState(false);
  const [copiedSolution, setCopiedSolution] = useState(false);

  // Interview Timer State
  const [timerMode, setTimerMode] = useState<
    "stopwatch" | "15m" | "30m" | "45m"
  >(
    problem.initialTimerMinutes === 15
      ? "15m"
      : problem.initialTimerMinutes === 45
        ? "45m"
        : problem.initialTimerMinutes === 30
          ? "30m"
          : "stopwatch",
  );
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(
    !!problem.isMockMode,
  );
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    (problem.initialTimerMinutes || 30) * 60,
  );
  const [timerExpired, setTimerExpired] = useState<boolean>(false);
  const [solvedCelebrationTime, setSolvedCelebrationTime] = useState<
    string | null
  >(null);

  // Timer Tick Effect
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
      if (timerMode !== "stopwatch") {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setTimerExpired(true);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMode]);

  const resetTimer = () => {
    setIsTimerRunning(false);
    setSecondsElapsed(0);
    setTimerExpired(false);
    setSolvedCelebrationTime(null);
    if (timerMode === "15m") setSecondsRemaining(15 * 60);
    else if (timerMode === "30m") setSecondsRemaining(30 * 60);
    else if (timerMode === "45m") setSecondsRemaining(45 * 60);
    else setSecondsRemaining(30 * 60);
  };

  const handleTimerModeChange = (mode: "stopwatch" | "15m" | "30m" | "45m") => {
    setTimerMode(mode);
    setIsTimerRunning(false);
    setSecondsElapsed(0);
    setTimerExpired(false);
    setSolvedCelebrationTime(null);
    if (mode === "15m") setSecondsRemaining(15 * 60);
    else if (mode === "30m") setSecondsRemaining(30 * 60);
    else if (mode === "45m") setSecondsRemaining(45 * 60);
  };

  const formatTimerDisplay = () => {
    if (timerMode === "stopwatch") {
      const mins = Math.floor(secondsElapsed / 60);
      const secs = secondsElapsed % 60;
      return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Sync code persistence
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CODE_KEY, code);
    } catch {
      // ignore
    }
  }, [code, LOCAL_STORAGE_CODE_KEY]);

  // Run all test cases
  const handleRunAllTests = () => {
    setIsRunning(true);
    setTimeout(async () => {
      try {
        const summary = await runAllTestCases(code, defaultEntryFn, testCases);
        setExecSummary(summary);
        if (summary.allPassed && (isTimerRunning || secondsElapsed > 0)) {
          const totalSecs =
            timerMode === "stopwatch"
              ? secondsElapsed
              : Math.max(
                  0,
                  (timerMode === "15m" ? 15 : timerMode === "45m" ? 45 : 30) *
                    60 -
                    secondsRemaining,
                );
          const mins = Math.floor(totalSecs / 60);
          const secs = totalSecs % 60;
          setSolvedCelebrationTime(`${mins}m ${secs < 10 ? "0" : ""}${secs}s`);
          setIsTimerRunning(false);
        }
        // Gather logs
        const allLogs: string[] = [];
        summary.results.forEach((r, idx) => {
          if (r.logs.length > 0) {
            allLogs.push(`--- Case ${idx + 1} Logs ---`);
            allLogs.push(...r.logs);
          }
        });
        setConsoleLogs(allLogs);
        setBottomTab("results");
        setActiveResultIndex(0);
      } catch (err: unknown) {
        setConsoleLogs([
          `Fatal runner error: ${err instanceof Error ? err.message : String(err)}`,
        ]);
      } finally {
        setIsRunning(false);
      }
    }, 50);
  };

  // Run single test case
  const handleRunSingleTest = (caseIdx: number) => {
    const targetCase = testCases[caseIdx];
    if (!targetCase) return;

    setIsRunning(true);
    setTimeout(async () => {
      try {
        const res = await runTestCase(code, defaultEntryFn, targetCase);
        // Update summary with single test or update the matching result
        const existingResults = execSummary ? [...execSummary.results] : [];
        existingResults[caseIdx] = res;
        const passedCount = existingResults.filter((r) => r?.passed).length;
        const summary: ExecutionSummary = {
          total: testCases.length,
          passed: passedCount,
          failed: testCases.length - passedCount,
          durationMs: res.durationMs,
          results: existingResults,
          allPassed: passedCount === testCases.length,
          hasError: !!res.error,
        };
        setExecSummary(summary);
        if (res.logs.length > 0) {
          setConsoleLogs(res.logs);
        }
        setBottomTab("results");
        setActiveResultIndex(caseIdx);
      } finally {
        setIsRunning(false);
      }
    }, 50);
  };

  // Reset code to starter boilerplate
  const handleResetCode = () => {
    if (
      window.confirm(
        "Reset code to initial template? Your current edits will be overwritten.",
      )
    ) {
      setCode(defaultStarterCode);
      try {
        localStorage.removeItem(LOCAL_STORAGE_CODE_KEY);
      } catch {
        // ignore
      }
    }
  };

  // Test case management
  const handleAddTestCase = () => {
    const newCase: TestCase = {
      id: `custom-${Date.now()}`,
      input: "",
      expectedOutput: "",
      description: `Custom Case ${testCases.length + 1}`,
      isCustom: true,
    };
    setTestCases((prev) => [...prev, newCase]);
    setActiveCaseIndex(testCases.length);
    setBottomTab("testcases");
  };

  const handleUpdateActiveCase = (
    field: "input" | "expectedOutput" | "description",
    value: string,
  ) => {
    setTestCases((prev) => {
      const copy = [...prev];
      if (copy[activeCaseIndex]) {
        copy[activeCaseIndex] = {
          ...copy[activeCaseIndex],
          [field]: value,
        };
      }
      return copy;
    });
  };

  const handleDeleteCase = (idx: number) => {
    if (testCases.length <= 1) return;
    setTestCases((prev) => prev.filter((_, i) => i !== idx));
    setActiveCaseIndex((prev) => Math.max(0, prev - 1));
  };

  const activeCase = testCases[activeCaseIndex] || testCases[0];
  const activeResult = execSummary?.results[activeResultIndex];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#07090e] text-foreground font-sans overflow-hidden">
      {/* Top Header Bar */}
      <header className="h-14 border-b border-white/10 bg-[#0c1017]/95 backdrop-blur px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
              <span className="text-amber-400">⚡</span>
              <span>Practice Arena:</span>
            </span>
            <span className="text-sm font-medium text-white/90 truncate max-w-xs md:max-w-md">
              {problem.title}
            </span>
          </div>

          <span
            className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
              problem.difficulty === "Easy"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : problem.difficulty === "Medium"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-rose-500/10 text-rose-400 border-rose-500/20"
            }`}
          >
            {problem.difficulty}
          </span>

          {isSolved && (
            <span className="text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span>✓</span> Solved
            </span>
          )}
        </div>

        {/* Center: Interview Timer Widget */}
        <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-2.5 py-1 rounded-lg">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs font-mono font-semibold tracking-wider ${
                timerExpired
                  ? "text-rose-400 animate-pulse"
                  : timerMode !== "stopwatch" && secondsRemaining <= 300
                    ? "text-amber-400 animate-pulse"
                    : "text-white/90"
              }`}
            >
              {timerExpired
                ? "⏰ Time Up!"
                : (timerMode === "stopwatch" ? "⏱️ " : "⏳ ") +
                  formatTimerDisplay()}
            </span>

            <button
              onClick={() => setIsTimerRunning((prev) => !prev)}
              className={`text-[10px] px-1.5 py-0.5 rounded font-medium transition-colors ${
                isTimerRunning
                  ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                  : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
              }`}
              title={isTimerRunning ? "Pause Timer" : "Start Timer"}
            >
              {isTimerRunning ? "⏸" : "▶"}
            </button>

            <button
              onClick={resetTimer}
              className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-foreground/50 hover:text-white transition-colors"
              title="Reset Timer"
            >
              ↺
            </button>
          </div>

          <div className="h-3 w-px bg-white/10 hidden sm:block" />

          {/* Timer Mode Selector */}
          <select
            value={timerMode}
            onChange={(e) =>
              handleTimerModeChange(
                e.target.value as "stopwatch" | "15m" | "30m" | "45m",
              )
            }
            className="text-[11px] bg-transparent text-foreground/70 hover:text-foreground outline-none cursor-pointer hidden sm:block"
            title="Interview Timer Mode"
          >
            <option value="stopwatch" className="bg-[#0b0e14] text-foreground">
              Stopwatch
            </option>
            <option value="15m" className="bg-[#0b0e14] text-foreground">
              15m Warmup
            </option>
            <option value="30m" className="bg-[#0b0e14] text-foreground">
              30m Phone Screen
            </option>
            <option value="45m" className="bg-[#0b0e14] text-foreground">
              45m Full Round
            </option>
          </select>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {onToggleSolved && (
            <button
              onClick={() => onToggleSolved(problem.id)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 ${
                isSolved
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30"
                  : "bg-white/5 border-white/10 text-foreground/80 hover:text-white hover:bg-white/10"
              }`}
              title="Toggle problem solved status"
            >
              <span>{isSolved ? "✓ Solved" : "○ Mark Solved"}</span>
            </button>
          )}

          <button
            onClick={() => handleRunSingleTest(activeCaseIndex)}
            disabled={isRunning}
            className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-foreground/80 hover:text-white transition-colors flex items-center gap-1.5 disabled:opacity-50"
            title="Run active test case"
          >
            <span>▶</span>
            <span className="hidden sm:inline">Run Test</span>
          </button>

          <button
            onClick={handleRunAllTests}
            disabled={isRunning}
            className="text-xs px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-1.5 disabled:opacity-50 active:scale-95"
            title="Run All Test Cases (Cmd+Enter)"
          >
            {isRunning ? (
              <>
                <span className="animate-spin inline-block">⏳</span>
                <span>Testing...</span>
              </>
            ) : (
              <>
                <span>⚡</span>
                <span>Run All</span>
                <kbd className="hidden md:inline text-[9px] bg-emerald-700/60 px-1 py-0.5 rounded text-emerald-100 font-mono">
                  ⌘↵
                </kbd>
              </>
            )}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="text-xs p-1.5 rounded-lg hover:bg-white/10 text-foreground/60 hover:text-white transition-colors ml-1"
              title="Close Arena"
            >
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
            </button>
          )}
        </div>
      </header>

      {/* Main Split Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
        {/* Left Pane: Problem Description & Target Info (5 cols on lg) */}
        <div className="lg:col-span-5 border-r border-white/10 flex flex-col min-h-0 bg-[#090c12]/90">
          <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
            {/* Problem Complexity Targets */}
            {(problem.timeComplexity || problem.spaceComplexity) && (
              <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-xs font-mono">
                {problem.timeComplexity && (
                  <span className="text-amber-300">
                    <strong className="text-foreground/50">Time:</strong>{" "}
                    {problem.timeComplexity}
                  </span>
                )}
                {problem.spaceComplexity && (
                  <span className="text-cyan-300 ml-auto">
                    <strong className="text-foreground/50">Space:</strong>{" "}
                    {problem.spaceComplexity}
                  </span>
                )}
              </div>
            )}

            {/* Problem Description */}
            <div className="prose prose-invert prose-sm max-w-none text-foreground/90 leading-relaxed">
              <MarkdownRenderer content={problem.problemText} />
            </div>

            {/* Official Solution Peek Section */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    if (problem.isMockMode && !showSolutionSpoiler) {
                      if (
                        !window.confirm(
                          "⚠️ You are in Mock Interview mode. Revealing the solution will end the mock simulation. Continue?",
                        )
                      ) {
                        return;
                      }
                    }
                    setShowSolutionSpoiler(!showSolutionSpoiler);
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <span>
                    {showSolutionSpoiler
                      ? "▼ Hide Official Solution"
                      : "▶ Reveal Official Solution"}
                  </span>
                </button>

                {showSolutionSpoiler && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(problem.solutionCode);
                      setCopiedSolution(true);
                      setTimeout(() => setCopiedSolution(false), 2000);
                    }}
                    className="text-[11px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-foreground/70 transition-colors"
                  >
                    {copiedSolution ? "✓ Copied" : "📋 Copy Solution"}
                  </button>
                )}
              </div>

              {showSolutionSpoiler && (
                <div className="mt-3 p-3 rounded-lg bg-[#05070a] border border-amber-500/20 text-xs">
                  <div className="text-[11px] text-amber-300/80 mb-2 font-mono flex items-center gap-1">
                    <span>💡</span> Reference Optimal Implementation
                  </div>
                  <pre className="font-mono text-xs text-emerald-300 overflow-x-auto p-3 rounded bg-black/50 leading-relaxed border border-white/5">
                    <code>{problem.solutionCode}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Pane: Code Editor & Test Case Runner (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col min-h-0 bg-[#07090e]">
          {/* Top Half: Modern Code Editor with Syntax Highlighting & Themes */}
          <div className="flex-1 min-h-0 relative">
            <ModernCodeEditor
              code={code}
              onChange={setCode}
              onRunTests={handleRunAllTests}
              entryFunction={defaultEntryFn}
              defaultStarterCode={defaultStarterCode}
              fileName={problem.slug ? `${problem.slug}.js` : "solution.js"}
              onReset={() => {
                setCode(defaultStarterCode);
                try {
                  localStorage.removeItem(LOCAL_STORAGE_CODE_KEY);
                } catch {
                  // ignore
                }
              }}
            />
          </div>

          {/* Bottom Drawer: Test Cases & Execution Results */}
          <div
            className={`border-t border-white/10 flex flex-col bg-[#0a0e16] shrink-0 transition-all duration-200 ${
              drawerSize === "collapsed"
                ? "h-10"
                : drawerSize === "tall"
                  ? "h-96"
                  : "h-64"
            }`}
          >
            {/* Bottom Tabs Bar */}
            <div className="h-10 border-b border-white/10 px-4 flex items-center justify-between shrink-0 bg-[#080b12] select-none">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setBottomTab("testcases");
                    if (drawerSize === "collapsed") setDrawerSize("normal");
                  }}
                  className={`text-xs px-3 py-1.5 rounded-t font-medium transition-colors flex items-center gap-1.5 ${
                    bottomTab === "testcases"
                      ? "text-white border-b-2 border-primary bg-white/5 font-semibold"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <span>🧪 Test Cases</span>
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.2 rounded-full">
                    {testCases.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setBottomTab("results");
                    if (drawerSize === "collapsed") setDrawerSize("normal");
                  }}
                  className={`text-xs px-3 py-1.5 rounded-t font-medium transition-colors flex items-center gap-1.5 ${
                    bottomTab === "results"
                      ? "text-white border-b-2 border-primary bg-white/5 font-semibold"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <span>📊 Results</span>
                  {execSummary && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        execSummary.allPassed
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-rose-500/20 text-rose-400"
                      }`}
                    >
                      {execSummary.allPassed
                        ? "Passed"
                        : `${execSummary.passed}/${execSummary.total}`}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setBottomTab("console");
                    if (drawerSize === "collapsed") setDrawerSize("normal");
                  }}
                  className={`text-xs px-3 py-1.5 rounded-t font-medium transition-colors flex items-center gap-1.5 ${
                    bottomTab === "console"
                      ? "text-white border-b-2 border-primary bg-white/5 font-semibold"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <span>🖥️ Logs</span>
                  {consoleLogs.length > 0 && (
                    <span className="text-[10px] bg-white/10 px-1.5 py-0.2 rounded-full">
                      {consoleLogs.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Drawer Right Controls */}
              <div className="flex items-center gap-1.5">
                {bottomTab === "testcases" && (
                  <>
                    <button
                      onClick={handleAddTestCase}
                      className="text-xs px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors flex items-center gap-1 border border-white/5"
                    >
                      <span>+</span> Add Case
                    </button>

                    <button
                      onClick={() => handleRunSingleTest(activeCaseIndex)}
                      className="text-xs px-2.5 py-1 rounded bg-primary/20 hover:bg-primary/30 text-primary hover:text-white transition-colors flex items-center gap-1 border border-primary/30 font-medium"
                      title="Run current active case only"
                    >
                      <span>▶</span> Run Case {activeCaseIndex + 1}
                    </button>
                  </>
                )}

                {bottomTab === "console" && consoleLogs.length > 0 && (
                  <button
                    onClick={() => setConsoleLogs([])}
                    className="text-[11px] text-white/50 hover:text-white transition-colors"
                  >
                    Clear Logs
                  </button>
                )}

                <div className="h-3 w-px bg-white/10 mx-1" />

                {/* Drawer size expander / minimizer */}
                <button
                  onClick={() => {
                    setDrawerSize((prev) =>
                      prev === "normal"
                        ? "tall"
                        : prev === "tall"
                          ? "collapsed"
                          : "normal",
                    );
                  }}
                  className="text-xs p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors flex items-center gap-0.5"
                  title={
                    drawerSize === "normal"
                      ? "Expand Drawer (Tall)"
                      : drawerSize === "tall"
                        ? "Minimize Drawer"
                        : "Restore Drawer"
                  }
                >
                  <span className="text-[11px] font-mono">
                    {drawerSize === "collapsed"
                      ? "▲"
                      : drawerSize === "tall"
                        ? "▼"
                        : "⇕"}
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div
              className={`flex-1 overflow-y-auto p-4 custom-scrollbar ${drawerSize === "collapsed" ? "hidden" : "block"}`}
            >
              {/* TAB 1: TEST CASES MANAGER */}
              {bottomTab === "testcases" && (
                <div className="space-y-3">
                  {/* Case Pill Selector with Pass/Fail dots */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {testCases.map((tc, idx) => {
                      const res = execSummary?.results[idx];
                      return (
                        <button
                          key={tc.id}
                          onClick={() => setActiveCaseIndex(idx)}
                          className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                            activeCaseIndex === idx
                              ? "bg-white/15 text-white shadow-sm border border-white/15 font-semibold"
                              : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 border border-transparent"
                          }`}
                        >
                          {res && (
                            <span
                              className={`w-2 h-2 rounded-full inline-block ${
                                res.passed
                                  ? "bg-emerald-400 shadow-sm shadow-emerald-400/50"
                                  : "bg-rose-500 shadow-sm shadow-rose-500/50"
                              }`}
                            />
                          )}
                          <span>Case {idx + 1}</span>
                          {tc.isCustom && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCase(idx);
                              }}
                              className="text-white/40 hover:text-rose-400 text-xs ml-1"
                              title="Delete custom case"
                            >
                              ×
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {activeCase && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-[11px] font-semibold text-foreground/60 uppercase tracking-wider mb-1 flex items-center justify-between">
                          <span>Input Arguments</span>
                          <span className="text-[10px] text-foreground/40 font-mono">
                            e.g. [2,7,11,15], 9
                          </span>
                        </div>
                        <textarea
                          value={activeCase.input}
                          onChange={(e) =>
                            handleUpdateActiveCase("input", e.target.value)
                          }
                          className="w-full h-20 p-2 font-mono text-xs bg-[#05070a] border border-white/10 rounded-lg text-foreground/90 focus:border-emerald-500/50 outline-none resize-none leading-relaxed"
                          placeholder="Input parameters (e.g. [2, 7, 11, 15], 9)"
                        />
                      </div>

                      <div>
                        <div className="text-[11px] font-semibold text-foreground/60 uppercase tracking-wider mb-1 flex items-center justify-between">
                          <span>Expected Output</span>
                          <span className="text-[10px] text-foreground/40 font-mono">
                            e.g. [0, 1]
                          </span>
                        </div>
                        <textarea
                          value={activeCase.expectedOutput}
                          onChange={(e) =>
                            handleUpdateActiveCase(
                              "expectedOutput",
                              e.target.value,
                            )
                          }
                          className="w-full h-20 p-2 font-mono text-xs bg-[#05070a] border border-white/10 rounded-lg text-emerald-400 focus:border-emerald-500/50 outline-none resize-none leading-relaxed"
                          placeholder="Expected return value (e.g. [0, 1])"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: EXECUTION RESULTS */}
              {bottomTab === "results" && (
                <div className="space-y-3">
                  {!execSummary ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-foreground/40 py-8">
                      <span className="text-2xl mb-1">⚡</span>
                      <p className="text-xs">
                        Click &quot;Run All&quot; or press ⌘+Enter to evaluate
                        your solution.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Solved Celebration Alert */}
                      {solvedCelebrationTime && (
                        <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 animate-fadeIn">
                          <div className="flex items-center gap-2">
                            <span className="text-base">🎉</span>
                            <span className="font-semibold">
                              Mock Goal Achieved!
                            </span>
                            <span className="text-emerald-400/90 font-mono">
                              Solved in {solvedCelebrationTime}
                            </span>
                          </div>
                          {onToggleSolved && !isSolved && (
                            <button
                              onClick={() => onToggleSolved(problem.id)}
                              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded text-[11px] transition-all shadow"
                            >
                              ✓ Mark Solved Now
                            </button>
                          )}
                        </div>
                      )}

                      {/* Timer Expired Banner */}
                      {timerExpired && (
                        <div className="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-300 animate-pulse">
                          <span>⏰</span>
                          <span className="font-medium">
                            Interview time is up! Complete any final edge-case
                            checks and review test cases.
                          </span>
                        </div>
                      )}

                      {/* Summary Banner */}
                      <div
                        className={`p-3 rounded-lg border flex items-center justify-between ${
                          execSummary.allPassed
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                            : execSummary.hasError
                              ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                              : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {execSummary.allPassed
                              ? "🎉"
                              : execSummary.hasError
                                ? "💥"
                                : "⚠️"}
                          </span>
                          <div>
                            <div className="font-semibold text-xs">
                              {execSummary.allPassed
                                ? `Accepted: All ${execSummary.total} Test Cases Passed!`
                                : execSummary.hasError
                                  ? "Runtime / Syntax Error Detected"
                                  : `Wrong Answer: ${execSummary.passed} / ${execSummary.total} Passed`}
                            </div>
                            <div className="text-[11px] opacity-75">
                              Total execution time: ~{execSummary.durationMs}ms
                            </div>
                          </div>
                        </div>

                        {execSummary.allPassed &&
                          onToggleSolved &&
                          !isSolved && (
                            <button
                              onClick={() => onToggleSolved(problem.id)}
                              className="text-xs px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow"
                            >
                              ✓ Mark Solved Now
                            </button>
                          )}
                      </div>

                      {/* Results Case Selector */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                        {execSummary.results.map((res, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveResultIndex(idx)}
                            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                              activeResultIndex === idx
                                ? "bg-white/15 text-white border border-white/10"
                                : "bg-white/5 text-foreground/60 hover:bg-white/10"
                            }`}
                          >
                            <span
                              className={
                                res.passed
                                  ? "text-emerald-400"
                                  : "text-rose-400"
                              }
                            >
                              {res.passed ? "✓" : "✗"}
                            </span>
                            <span>Case {idx + 1}</span>
                          </button>
                        ))}
                      </div>

                      {/* Active Result Inspector */}
                      {activeResult && (
                        <div className="p-3 rounded-lg bg-[#05070a] border border-white/5 space-y-2 text-xs">
                          {activeResult.error ? (
                            <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-[11px] leading-relaxed">
                              <strong>Error:</strong> {activeResult.error}
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <span className="text-[11px] text-foreground/50 uppercase font-semibold block mb-1">
                                  Input
                                </span>
                                <pre className="font-mono text-[11px] p-2 rounded bg-black/40 text-foreground/80 overflow-x-auto border border-white/5">
                                  <code>{activeResult.inputStr || "None"}</code>
                                </pre>
                              </div>

                              <div>
                                <span className="text-[11px] text-emerald-400/80 uppercase font-semibold block mb-1">
                                  Expected Output
                                </span>
                                <pre className="font-mono text-[11px] p-2 rounded bg-black/40 text-emerald-400 overflow-x-auto border border-emerald-500/10">
                                  <code>
                                    {formatValue(activeResult.expected)}
                                  </code>
                                </pre>
                              </div>

                              <div>
                                <span
                                  className={`text-[11px] uppercase font-semibold block mb-1 ${
                                    activeResult.passed
                                      ? "text-emerald-400"
                                      : "text-rose-400"
                                  }`}
                                >
                                  Actual Output ({activeResult.durationMs}ms)
                                </span>
                                <pre
                                  className={`font-mono text-[11px] p-2 rounded bg-black/40 overflow-x-auto border ${
                                    activeResult.passed
                                      ? "text-emerald-300 border-emerald-500/10"
                                      : "text-rose-400 border-rose-500/20"
                                  }`}
                                >
                                  <code>
                                    {formatValue(activeResult.actual)}
                                  </code>
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* TAB 3: CONSOLE LOGS */}
              {bottomTab === "console" && (
                <div>
                  {consoleLogs.length === 0 ? (
                    <div className="text-center text-foreground/40 py-6 text-xs">
                      No console output. Use <code>console.log(...)</code> in
                      your code to debug.
                    </div>
                  ) : (
                    <div className="font-mono text-xs text-foreground/80 space-y-1 bg-[#05070a] p-3 rounded-lg border border-white/5">
                      {consoleLogs.map((log, i) => (
                        <div
                          key={i}
                          className={
                            log.startsWith("[ERROR]")
                              ? "text-rose-400"
                              : log.startsWith("[WARN]")
                                ? "text-amber-300"
                                : log.startsWith("---")
                                  ? "text-foreground/40 pt-1 font-semibold"
                                  : "text-foreground/90"
                          }
                        >
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
