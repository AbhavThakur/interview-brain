'use client';

import { useState, useMemo } from 'react';
import { GRIND_75_PROBLEMS, GrindProblem } from '@/lib/grind75Data';
import { useProgress } from '@/lib/useProgress';

export default function Grind75Client() {
  const [weeks, setWeeks] = useState<number>(8);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(8);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedPattern, setSelectedPattern] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedInsights, setExpandedInsights] = useState<Record<string, boolean>>({});

  const { progress, setProblemStatus } = useProgress();

  // Extract unique patterns
  const patterns = useMemo(() => {
    const p = new Set(GRIND_75_PROBLEMS.map(prob => prob.pattern));
    return ['all', ...Array.from(p).sort()];
  }, []);

  // Filter problems based on difficulty, pattern and search
  const filteredProblems = useMemo(() => {
    return GRIND_75_PROBLEMS.filter(p => {
      const matchDiff = selectedDifficulty === 'all' || p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
      const matchPattern = selectedPattern === 'all' || p.pattern === selectedPattern;
      const matchSearch = 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.pattern.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.ahHaInsight.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchDiff && matchPattern && matchSearch;
    });
  }, [selectedDifficulty, selectedPattern, searchQuery]);

  // Dynamically slice problems into weeks based on selected weeks
  const weeklySlices = useMemo(() => {
    const total = filteredProblems.length;
    if (total === 0) return [];

    const numWeeks = Math.max(1, Math.min(weeks, total));
    const itemsPerWeek = Math.ceil(total / numWeeks);

    const slices: { weekNumber: number; problems: GrindProblem[] }[] = [];
    for (let i = 0; i < numWeeks; i++) {
      const start = i * itemsPerWeek;
      const end = Math.min(start + itemsPerWeek, total);
      if (start < total) {
        slices.push({
          weekNumber: i + 1,
          problems: filteredProblems.slice(start, end)
        });
      }
    }
    return slices;
  }, [filteredProblems, weeks]);

  // Overall stats
  const totalProblemsCount = filteredProblems.length;
  const solvedProblemsCount = filteredProblems.filter(p => progress.codingStatus[p.id] === 'solved').length;
  const reviewProblemsCount = filteredProblems.filter(p => progress.codingStatus[p.id] === 'review').length;
  const attemptedProblemsCount = filteredProblems.filter(p => progress.codingStatus[p.id] === 'attempted').length;
  const completionPercentage = totalProblemsCount > 0 ? Math.round((solvedProblemsCount / totalProblemsCount) * 100) : 0;

  const toggleInsight = (id: string) => {
    setExpandedInsights(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider">
              Study Plan Engine
            </span>
            <span className="text-xs text-foreground/40 font-mono">
              Inspired by Tech Interview Handbook & Grind 75
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Grind 75 Dynamic Practice Roadmap</h1>
          <p className="text-foreground/60 mt-1 max-w-2xl text-sm">
            Customize your schedule based on weeks left and study hours. Master high-frequency interview patterns with zero wasted time.
          </p>
        </div>

        {/* Global Progress Gauge */}
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl shrink-0">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-primary transition-all duration-500"
                strokeDasharray={`${completionPercentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold font-mono">{completionPercentage}%</span>
          </div>
          <div className="text-xs">
            <div className="font-bold text-foreground">{solvedProblemsCount} of {totalProblemsCount} Solved</div>
            <div className="text-foreground/50 mt-0.5 flex items-center gap-2">
              <span className="text-yellow-400">⚠️ {reviewProblemsCount} Review</span>
              <span className="text-blue-400">⏳ {attemptedProblemsCount} Attempted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="glass-card p-6 flex flex-col gap-6">
        
        {/* Sliders & Time Allocation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-white/10 pb-6">
          
          {/* Weeks Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground">Timeline: {weeks} Weeks</span>
              <span className="text-foreground/40 font-mono">{Math.round(totalProblemsCount / weeks)} problems / week</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="26" 
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-foreground/40 font-mono">
              <span>1 Week (Crash)</span>
              <span>8 Weeks (Standard)</span>
              <span>26 Weeks (Deep)</span>
            </div>
          </div>

          {/* Hours per week buttons */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground">Weekly Dedication</span>
              <span className="text-foreground/40 font-mono">~{Math.round(hoursPerWeek / 7 * 60)} mins/day</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[4, 8, 12, 16, 20].map((hrs) => (
                <button
                  key={hrs}
                  onClick={() => setHoursPerWeek(hrs)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    hoursPerWeek === hrs 
                      ? 'bg-primary text-white border-primary shadow-md' 
                      : 'bg-white/5 border-white/5 text-foreground/70 hover:bg-white/10'
                  }`}
                >
                  {hrs}h / wk
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Filter Chips & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Difficulty Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <span className="text-xs text-foreground/40 mr-1 hidden sm:inline">Difficulty:</span>
            {['all', 'easy', 'medium', 'hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg capitalize transition-all ${
                  selectedDifficulty === diff 
                    ? 'bg-primary text-white font-semibold' 
                    : 'bg-white/5 text-foreground/60 hover:bg-white/10 hover:text-foreground'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Pattern Selector & Search */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={selectedPattern}
              onChange={(e) => setSelectedPattern(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              {patterns.map((pat) => (
                <option key={pat} value={pat} className="bg-[#1a1d24]">
                  {pat === 'all' ? 'All Patterns' : pat}
                </option>
              ))}
            </select>

            <input 
              type="text"
              placeholder="Search problem or insight..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-56 bg-white/5 border border-white/10 rounded-xl px-3.5 py-1.5 text-xs focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/40"
            />
          </div>

        </div>

      </div>

      {/* Week-by-Week Accordion Grid */}
      <div className="flex flex-col gap-6">
        {weeklySlices.length === 0 ? (
          <div className="glass-card p-12 text-center text-foreground/50">
            No problems match your current filters.
          </div>
        ) : (
          weeklySlices.map(({ weekNumber, problems }) => {
            const weekSolvedCount = problems.filter(p => progress.codingStatus[p.id] === 'solved').length;
            const weekTotalMinutes = problems.reduce((acc, p) => acc + p.timeMinutes, 0);
            const weekProgressPercent = Math.round((weekSolvedCount / problems.length) * 100);

            return (
              <div key={weekNumber} className="glass-card p-6 flex flex-col gap-4 border-white/10 hover:border-white/20 transition-all">
                
                {/* Week Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/20 text-primary font-bold flex items-center justify-center text-xs">
                      W{weekNumber}
                    </span>
                    <div>
                      <h2 className="font-bold text-base text-foreground">Week {weekNumber} Schedule</h2>
                      <span className="text-[11px] text-foreground/50">
                        {problems.length} problems · ~{weekTotalMinutes} mins total practice
                      </span>
                    </div>
                  </div>

                  {/* Week Mini Progress */}
                  <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                    <div className="w-20 bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${weekProgressPercent}%` }}
                      ></div>
                    </div>
                    <span className="text-[11px] font-mono text-foreground/80">
                      {weekSolvedCount}/{problems.length} ({weekProgressPercent}%)
                    </span>
                  </div>
                </div>

                {/* Problems Table / List */}
                <div className="divide-y divide-white/5">
                  {problems.map((prob) => {
                    const status = progress.codingStatus[prob.id] || 'todo';
                    const isInsightOpen = !!expandedInsights[prob.id];

                    return (
                      <div key={prob.id} className="py-3.5 flex flex-col gap-2 group">
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          
                          {/* Title & Badges */}
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-foreground/30 w-6">
                              #{prob.order}
                            </span>

                            <a
                              href={prob.leetcodeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5"
                            >
                              <span>{prob.title}</span>
                              <span className="text-[10px] text-foreground/30">↗</span>
                            </a>

                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              prob.difficulty === 'Easy'
                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                : prob.difficulty === 'Medium'
                                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                              {prob.difficulty}
                            </span>

                            <span className="text-[10px] text-foreground/50 bg-white/5 px-2 py-0.5 rounded hidden md:inline">
                              {prob.pattern}
                            </span>

                            <span className="text-[10px] text-foreground/40 font-mono hidden lg:inline">
                              ⏱️ {prob.timeMinutes}m
                            </span>
                          </div>

                          {/* Action Buttons: Ah-Ha Insight & Status Toggle */}
                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            
                            <button
                              onClick={() => toggleInsight(prob.id)}
                              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                                isInsightOpen
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                  : 'bg-white/5 text-foreground/60 border-white/5 hover:bg-white/10'
                              }`}
                            >
                              <span>💡 Insight</span>
                            </button>

                            <select
                              value={status}
                              onChange={(e) => setProblemStatus(prob.id, e.target.value as any)}
                              className={`text-xs font-medium px-2.5 py-1 rounded-lg border focus:outline-none transition-colors cursor-pointer ${
                                status === 'solved'
                                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                  : status === 'review'
                                  ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                  : status === 'attempted'
                                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                  : 'bg-white/5 text-foreground/50 border-white/10'
                              }`}
                            >
                              <option value="todo" className="bg-[#1a1d24] text-foreground">⭕ To-Do</option>
                              <option value="attempted" className="bg-[#1a1d24] text-blue-400">⏳ Attempted</option>
                              <option value="review" className="bg-[#1a1d24] text-yellow-400">⚠️ Needs Review</option>
                              <option value="solved" className="bg-[#1a1d24] text-green-400">✅ Solved</option>
                            </select>

                          </div>

                        </div>

                        {/* Ah-Ha Insight Dropdown */}
                        {isInsightOpen && (
                          <div className="bg-purple-500/5 border-l-2 border-purple-500 p-3 rounded-r-xl text-xs text-foreground/80 mt-1 animate-in fade-in duration-200">
                            <span className="font-bold text-purple-400">Key Mental Model: </span>
                            {prob.ahHaInsight}
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
