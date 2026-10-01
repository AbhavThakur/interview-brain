"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export interface JavaScriptMCQuestion {
  id: number;
  title: string;
  code: string | null;
  options: { key: string; text: string }[];
  answer: string;
  explanation: string;
  tags: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  source: string;
}

const LOCAL_STORAGE_KEY_BOOKMARKS = "interview_brain_lydia_bookmarks";
const LOCAL_STORAGE_KEY_HISTORY = "interview_brain_lydia_history";

export default function LydiaMCQQuiz() {
  const [allQuestions, setAllQuestions] = useState<JavaScriptMCQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // User answering state for current question
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Gamification & history state
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [scoreHistory, setScoreHistory] = useState<
    Record<number, { selected: string; isCorrect: boolean }>
  >({});
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Load questions from API
  useEffect(() => {
    fetch("/api/mcq")
      .then(async (res) => {
        const data: unknown = await res.json();
        if (!res.ok || !Array.isArray(data)) {
          throw new Error("Unable to load JavaScript questions.");
        }
        return data as JavaScriptMCQuestion[];
      })
      .then((data) => {
        setAllQuestions(data);
      })
      .catch((err) => {
        console.error("Failed to load MCQ questions:", err);
        setLoadError("Unable to load JavaScript questions. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });

    // Load bookmarks and history from localStorage
    try {
      const savedBookmarks = localStorage.getItem(LOCAL_STORAGE_KEY_BOOKMARKS);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Hydrates bookmark state from local storage.
      if (savedBookmarks) setBookmarkedIds(JSON.parse(savedBookmarks));

      const savedHistory = localStorage.getItem(LOCAL_STORAGE_KEY_HISTORY);
      if (savedHistory) setScoreHistory(JSON.parse(savedHistory));
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save bookmarks
  const toggleBookmark = (id: number) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_BOOKMARKS, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  // Extract unique topic tags
  const tagsList = useMemo(() => {
    const counts: Record<string, number> = {};
    allQuestions.forEach((q) => {
      q.tags.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return [
      { tag: "All", count: allQuestions.length },
      ...Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([tag, count]) => ({ tag, count })),
    ];
  }, [allQuestions]);

  // Filtered list of questions
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      const matchesTag = selectedTag === "All" || q.tags.includes(selectedTag);
      const matchesDiff =
        selectedDifficulty === "All" || q.difficulty === selectedDifficulty;
      const matchesBookmark = !onlyBookmarked || bookmarkedIds.includes(q.id);
      return matchesTag && matchesDiff && matchesBookmark;
    });
  }, [
    allQuestions,
    selectedTag,
    selectedDifficulty,
    onlyBookmarked,
    bookmarkedIds,
  ]);

  // Ensure currentIndex stays within bounds when filters change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Resets question state for the new filter selection.
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
  }, [selectedTag, selectedDifficulty, onlyBookmarked]);

  const currentQ = filteredQuestions[currentIndex] || null;

  // Restore previous answer state if question was already answered
  useEffect(() => {
    if (currentQ && scoreHistory[currentQ.id]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Restores the saved answer for the current question.
      setSelectedOption(scoreHistory[currentQ.id].selected);
      setShowExplanation(true);
    } else {
      setSelectedOption(null);
      setShowExplanation(false);
    }
  }, [currentQ, scoreHistory]);

  // Handle option selection
  const handleSelectOption = (key: string) => {
    if (!currentQ || selectedOption !== null) return; // Prevent re-selection

    const isCorrect = key.toUpperCase() === currentQ.answer.toUpperCase();
    setSelectedOption(key);
    setShowExplanation(true);

    if (isCorrect) {
      setCurrentStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    } else {
      setCurrentStreak(0);
    }

    setScoreHistory((prev) => {
      const next = { ...prev, [currentQ.id]: { selected: key, isCorrect } };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_HISTORY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, filteredQuestions.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleRandom = () => {
    if (filteredQuestions.length <= 1) return;
    let nextIdx = Math.floor(Math.random() * filteredQuestions.length);
    if (nextIdx === currentIndex) {
      nextIdx = (currentIndex + 1) % filteredQuestions.length;
    }
    setCurrentIndex(nextIdx);
  };

  const handleResetHistory = () => {
    if (
      confirm(
        "Are you sure you want to reset your quiz score and answer history?",
      )
    ) {
      setScoreHistory({});
      setCurrentStreak(0);
      setBestStreak(0);
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY_HISTORY);
      } catch {
        // Ignore
      }
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.tagName === "SELECT"
      ) {
        return;
      }

      const key = e.key.toUpperCase();
      if (["A", "B", "C", "D"].includes(key)) {
        e.preventDefault();
        handleSelectOption(key);
      } else if (["1", "2", "3", "4"].includes(e.key)) {
        e.preventDefault();
        const map: Record<string, string> = {
          "1": "A",
          "2": "B",
          "3": "C",
          "4": "D",
        };
        handleSelectOption(map[e.key]);
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        if (selectedOption !== null) {
          e.preventDefault();
          handleNext();
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.code === "Space") {
        e.preventDefault();
        setShowExplanation((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, handleSelectOption, selectedOption]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Stats computation
  const totalAnswered = Object.keys(scoreHistory).length;
  const correctCount = Object.values(scoreHistory).filter(
    (h) => h.isCorrect,
  ).length;
  const accuracyPercent =
    totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="text-foreground/60 text-sm">
          Loading 155 Lydia Hallie JavaScript Questions...
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="glass-card p-12 text-center text-foreground/60 border-white/10">
        <p className="text-base font-semibold">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header Attribution & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
              155 Tricky JS Drills
            </span>
            <span className="text-xs text-foreground/40 font-mono">
              Lydia Hallie (MIT License)
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold">
            JavaScript Output & Quirks Trainer
          </h2>
          <p className="text-xs text-foreground/60 mt-0.5">
            Test yourself on closures, event loop, temporal dead zone,
            prototypes, and implicit coercion.
          </p>
        </div>

        {/* Live Score & Streak Counter */}
        <div className="flex items-center gap-3 bg-black/40 border border-white/10 px-4 py-2 rounded-xl self-start sm:self-auto">
          <div className="text-center">
            <span className="text-[10px] text-foreground/40 uppercase block">
              Score
            </span>
            <span className="text-sm font-bold text-emerald-400 font-mono">
              {correctCount}/{totalAnswered} ({accuracyPercent}%)
            </span>
          </div>
          <div className="w-[1px] h-6 bg-white/10"></div>
          <div className="text-center">
            <span className="text-[10px] text-foreground/40 uppercase block">
              Streak
            </span>
            <span className="text-sm font-bold text-amber-400 font-mono">
              🔥 {currentStreak}
            </span>
          </div>
          {bestStreak > 0 && (
            <>
              <div className="w-[1px] h-6 bg-white/10"></div>
              <div className="text-center hidden sm:block">
                <span className="text-[10px] text-foreground/40 uppercase block">
                  Best
                </span>
                <span className="text-sm font-bold text-foreground/70 font-mono">
                  {bestStreak}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 border border-white/5 p-3 rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Tag Selector */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="bg-[#12151c] border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-400 transition-colors cursor-pointer text-xs"
          >
            {tagsList.map((t) => (
              <option key={t.tag} value={t.tag} className="bg-[#12151c]">
                {t.tag === "All"
                  ? `All Topics (${t.count})`
                  : `${t.tag} (${t.count})`}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-[#12151c] border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-400 transition-colors cursor-pointer text-xs"
          >
            <option value="All" className="bg-[#12151c]">
              All Difficulties
            </option>
            <option value="Easy" className="bg-[#12151c]">
              Easy
            </option>
            <option value="Medium" className="bg-[#12151c]">
              Medium
            </option>
            <option value="Hard" className="bg-[#12151c]">
              Hard
            </option>
          </select>

          {/* Bookmarked Filter */}
          <label className="flex items-center gap-1.5 text-foreground/70 cursor-pointer select-none px-2 py-1 rounded hover:bg-white/5 transition-colors">
            <input
              type="checkbox"
              checked={onlyBookmarked}
              onChange={(e) => setOnlyBookmarked(e.target.checked)}
              className="rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500 w-3.5 h-3.5"
            />
            <span>⭐ Starred ({bookmarkedIds.length})</span>
          </label>
        </div>

        {/* Quick Question Jump & Shuffle */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRandom}
            className="bg-white/5 hover:bg-white/10 text-foreground/80 px-2.5 py-1.5 rounded-lg border border-white/10 transition-colors font-medium flex items-center gap-1"
            title="Jump to a random question"
          >
            <span>🔀</span>
            <span className="hidden sm:inline">Random</span>
          </button>

          {totalAnswered > 0 && (
            <button
              onClick={handleResetHistory}
              className="text-foreground/40 hover:text-red-400 transition-colors text-[11px] px-2 py-1"
              title="Reset score history"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Question Container */}
      {!currentQ ? (
        <div className="glass-card p-12 text-center text-foreground/60 border-white/10">
          <p className="text-base font-semibold mb-2">
            No questions match your current filter.
          </p>
          <button
            onClick={() => {
              setSelectedTag("All");
              setSelectedDifficulty("All");
              setOnlyBookmarked(false);
            }}
            className="mt-3 text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg font-medium hover:bg-amber-500/30 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="glass-card border-white/10 overflow-hidden shadow-2xl flex flex-col">
          {/* Card Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-white/10 bg-white/[0.02]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                Question #{currentQ.id}
              </span>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  currentQ.difficulty === "Easy"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : currentQ.difficulty === "Medium"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}
              >
                {currentQ.difficulty}
              </span>

              {currentQ.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] bg-white/5 text-foreground/60 px-2 py-0.5 rounded border border-white/5 font-mono"
                >
                  #{t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleBookmark(currentQ.id)}
                className={`p-1.5 rounded-lg border text-xs transition-colors ${
                  bookmarkedIds.includes(currentQ.id)
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-white/5 text-foreground/40 border-white/10 hover:text-white hover:bg-white/10"
                }`}
                title={
                  bookmarkedIds.includes(currentQ.id)
                    ? "Remove Bookmark"
                    : "Bookmark Question"
                }
              >
                {bookmarkedIds.includes(currentQ.id) ? "⭐ Starred" : "☆ Star"}
              </button>

              <span className="text-xs font-mono text-foreground/40 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                {currentIndex + 1} / {filteredQuestions.length}
              </span>
            </div>
          </div>

          {/* Question Title & Code Block */}
          <div className="p-5 sm:p-7 flex flex-col gap-5">
            <h3 className="text-lg sm:text-xl font-bold text-foreground">
              {currentQ.title}
            </h3>

            {/* Code Snippet with dark syntax background */}
            {currentQ.code && (
              <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-[#08090d]">
                <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#12151c] border-b border-white/5 text-[11px] text-foreground/50">
                  <span className="font-mono">JavaScript (ES6)</span>
                  <button
                    onClick={() => copyCode(currentQ.code!)}
                    className="hover:text-white text-foreground/60 transition-colors flex items-center gap-1 font-mono text-[10px]"
                  >
                    <span>{copiedCode ? "✓ Copied" : "📋 Copy"}</span>
                  </button>
                </div>
                <pre className="p-4 sm:p-5 text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto leading-relaxed selection:bg-emerald-500/30">
                  <code>{currentQ.code}</code>
                </pre>
              </div>
            )}

            {/* Multiple Choice Options */}
            <div className="flex flex-col gap-2.5 mt-2">
              <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wider block mb-1">
                Select the correct answer:
              </span>

              <div className="grid grid-cols-1 gap-2.5">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedOption === opt.key;
                  const isCorrectAnswer =
                    opt.key.toUpperCase() === currentQ.answer.toUpperCase();
                  const hasAnswered = selectedOption !== null;

                  let cardStyle =
                    "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.08] text-foreground/90";

                  if (hasAnswered) {
                    if (isCorrectAnswer) {
                      cardStyle =
                        "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold shadow-lg shadow-emerald-500/10";
                    } else if (isSelected && !isCorrectAnswer) {
                      cardStyle =
                        "bg-rose-500/20 border-rose-500/50 text-rose-300 font-semibold";
                    } else {
                      cardStyle =
                        "bg-white/[0.02] border-white/5 text-foreground/40 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption(opt.key)}
                      disabled={hasAnswered}
                      className={`text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3 relative ${cardStyle}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0 ${
                          hasAnswered && isCorrectAnswer
                            ? "bg-emerald-500 text-black"
                            : hasAnswered && isSelected && !isCorrectAnswer
                              ? "bg-rose-500 text-white"
                              : "bg-white/10 text-foreground/80"
                        }`}
                      >
                        {hasAnswered && isCorrectAnswer
                          ? "✓"
                          : hasAnswered && isSelected && !isCorrectAnswer
                            ? "✗"
                            : opt.key}
                      </span>

                      <div className="text-xs sm:text-sm leading-relaxed flex-1 pt-0.5">
                        <MarkdownRenderer content={opt.text} />
                      </div>

                      {hasAnswered && isCorrectAnswer && (
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 shrink-0 self-center">
                          Correct
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Answer Feedback Banner */}
            {selectedOption !== null && (
              <div
                className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs animate-in fade-in duration-200 ${
                  selectedOption.toUpperCase() === currentQ.answer.toUpperCase()
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">
                    {selectedOption.toUpperCase() ===
                    currentQ.answer.toUpperCase()
                      ? "🎉"
                      : "❌"}
                  </span>
                  <div>
                    <span className="font-bold block">
                      {selectedOption.toUpperCase() ===
                      currentQ.answer.toUpperCase()
                        ? "Spot on! Correct answer."
                        : `Incorrect. The correct answer is Option ${currentQ.answer}.`}
                    </span>
                    <span className="text-[11px] opacity-80">
                      Press{" "}
                      <kbd className="bg-black/30 px-1 rounded font-mono">
                        Enter
                      </kbd>{" "}
                      or{" "}
                      <kbd className="bg-black/30 px-1 rounded font-mono">
                        →
                      </kbd>{" "}
                      for the next question.
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowExplanation((prev) => !prev)}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium transition-colors shrink-0"
                >
                  {showExplanation ? "Hide Breakdown" : "Show Breakdown"}
                </button>
              </div>
            )}

            {/* Conceptual Deep Dive Explanation Drawer */}
            {showExplanation && currentQ.explanation && (
              <div className="border border-amber-500/30 bg-amber-500/[0.03] rounded-xl p-5 text-xs text-foreground/90 flex flex-col gap-3 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <span>💡</span>
                  <span>Conceptual Breakdown & Runtime Behavior:</span>
                </div>
                <div className="prose-dark max-w-none text-xs sm:text-sm leading-relaxed">
                  <MarkdownRenderer content={currentQ.explanation} />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Card Navigation */}
          <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-white/10 bg-white/[0.02]">
            <button
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              className="text-xs px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 text-foreground/80 hover:text-white transition-colors flex items-center gap-1.5 font-medium"
            >
              <span>←</span>
              <span>Previous</span>
            </button>

            <div className="text-xs text-foreground/40 font-mono hidden sm:block">
              Shortcuts:{" "}
              <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">
                A-D
              </kbd>{" "}
              Select |{" "}
              <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">
                Space
              </kbd>{" "}
              Explain |{" "}
              <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">
                →
              </kbd>{" "}
              Next
            </div>

            <button
              onClick={handleNext}
              disabled={currentIndex >= filteredQuestions.length - 1}
              className="text-xs px-4 py-2 rounded-xl bg-amber-500 text-black font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
            >
              <span>Next</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
