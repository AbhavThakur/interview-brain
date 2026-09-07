'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CAREER_TRACKS, LEVELING_MATRIX, RoadmapTask } from '@/lib/roadmapData';
import { COMPREHENSIVE_SYLLABUS, SyllabusStage, SyllabusTopic } from '@/lib/comprehensiveSyllabusData';
import { useProgress } from '@/lib/useProgress';
import AuthModal from '@/components/AuthModal';
import ActivePlanWidget from '@/components/ActivePlanWidget';

export default function RoadmapClient() {
  const { progress, toggleRoadmapTask, setActiveTrack, user } = useProgress();
  const [viewMode, setViewMode] = useState<'tracks' | 'syllabus'>('tracks');
  const [selectedTrackId, setSelectedTrackId] = useState<string>(progress.activeTrack || 'sde3-staff-architect');
  const [showLevelingMatrix, setShowLevelingMatrix] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  const currentTrack = CAREER_TRACKS.find(t => t.id === selectedTrackId) || CAREER_TRACKS[0];

  // Calculate track progress
  const allTasks = currentTrack.phases.flatMap(p => p.tasks);
  const completedTasks = allTasks.filter(t => !!progress.roadmapTasks[t.id]);
  const progressPercent = allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0;
  const nextTask = allTasks.find(t => !progress.roadmapTasks[t.id]);

  // Calculate 8-Stage Master Syllabus progress
  const allSyllabusTopics = COMPREHENSIVE_SYLLABUS.flatMap(s => s.topics);
  const completedSyllabusCount = allSyllabusTopics.filter(t => !!progress.roadmapTasks[t.id]).length;
  const syllabusProgressPercent = allSyllabusTopics.length > 0 
    ? Math.round((completedSyllabusCount / allSyllabusTopics.length) * 100) 
    : 0;

  const isCurrentActive = progress.activeTrack === currentTrack.id;

  const getTypeBadgeStyle = (type: RoadmapTask['type']) => {
    switch (type) {
      case 'coding':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'system-design':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'cheatsheet':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'behavioral':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'notebooklm':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      default:
        return 'bg-white/10 text-foreground/70 border-white/10';
    }
  };

  const displayName = user?.displayName || progress.customName || (user?.email ? user.email.split('@')[0] : 'Guest Candidate');

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/30 via-purple-900/20 to-black border border-primary/20 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Structured Learning & Interview Engine
              </span>
              <span className="text-xs text-foreground/40 font-mono hidden sm:inline">
                GFG Master Syllabus · SDE-1 to Staff Architect
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Role Roadmaps & 8-Stage Master Syllabus
            </h1>
            
            <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
              Step-by-step master roadmaps structured by timeline, target engineering level, and the complete 8-stage computer science interview curriculum. Check off milestones as you learn and track your overall readiness percentage.
            </p>
          </div>

          {/* Candidate Profile & Sync Badge */}
          <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-foreground transition-all flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              <span>Candidate: <strong className="text-white">{displayName}</strong></span>
              <span className="text-[10px] text-primary underline">⚙️ Settings</span>
            </button>

            <button
              onClick={() => setShowLevelingMatrix(prev => !prev)}
              className="text-[11px] text-primary hover:underline"
            >
              {showLevelingMatrix ? 'Hide Leveling Rubric ▴' : '📊 View SDE-1 vs SDE-2 vs SDE-3 Leveling Rubric ▾'}
            </button>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Leveling Matrix Guide Table */}
      {showLevelingMatrix && (
        <div className="glass-card p-6 sm:p-8 flex flex-col gap-4 border-white/10 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                FAANG / Tier-1 Engineering Leveling Matrix
              </span>
              <h3 className="text-base font-bold text-foreground mt-0.5">
                Expectations Breakdown Across Levels
              </h3>
            </div>
            <button
              onClick={() => setShowLevelingMatrix(false)}
              className="text-foreground/40 hover:text-white text-xs"
            >
              ✕ Close
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-foreground/50">
                  <th className="py-2.5 px-3 font-semibold">Level</th>
                  <th className="py-2.5 px-3 font-semibold">Core Focus</th>
                  <th className="py-2.5 px-3 font-semibold">DSA / Coding</th>
                  <th className="py-2.5 px-3 font-semibold">System Design</th>
                  <th className="py-2.5 px-3 font-semibold">Behavioral & Leadership</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {LEVELING_MATRIX.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-bold text-primary whitespace-nowrap">{row.level}</td>
                    <td className="py-3 px-3 text-foreground/80 font-medium">{row.focus}</td>
                    <td className="py-3 px-3 text-foreground/70">{row.dsaExpectation}</td>
                    <td className="py-3 px-3 text-foreground/70">{row.systemDesignExpectation}</td>
                    <td className="py-3 px-3 text-foreground/70">{row.behavioralExpectation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Active Personalized Study Plan & Next Action */}
      <ActivePlanWidget />

      {/* Main View Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
          <button
            onClick={() => setViewMode('tracks')}
            className={`py-2.5 px-5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === 'tracks'
                ? 'bg-primary text-white shadow-md shadow-primary/25'
                : 'text-foreground/70 hover:text-foreground'
            }`}
          >
            <span>🎯</span>
            <span>Role-Based Career Pathways ({CAREER_TRACKS.length})</span>
          </button>

          <button
            onClick={() => setViewMode('syllabus')}
            className={`py-2.5 px-5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === 'syllabus'
                ? 'bg-primary text-white shadow-md shadow-primary/25'
                : 'text-foreground/70 hover:text-foreground'
            }`}
          >
            <span>📚</span>
            <span>8-Stage Complete Master Syllabus (GFG Style)</span>
          </button>
        </div>

        {viewMode === 'syllabus' && (
          <div className="text-xs font-semibold text-foreground/70">
            Syllabus Readiness: <strong className="text-primary">{completedSyllabusCount}</strong> / <strong className="text-white">{allSyllabusTopics.length}</strong> Topics ({syllabusProgressPercent}%)
          </div>
        )}
      </div>

      {/* VIEW 1: Role-Based Career Pathways */}
      {viewMode === 'tracks' && (
        <div className="flex flex-col gap-8">
          
          {/* Track Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5">
            {CAREER_TRACKS.map(track => {
              const isSelected = track.id === selectedTrackId;
              const trackTasks = track.phases.flatMap(p => p.tasks);
              const trackDone = trackTasks.filter(t => !!progress.roadmapTasks[t.id]).length;
              const trackPct = trackTasks.length > 0 ? Math.round((trackDone / trackTasks.length) * 100) : 0;

              return (
                <button
                  key={track.id}
                  onClick={() => setSelectedTrackId(track.id)}
                  className={`flex-1 min-w-[180px] py-3 px-3.5 rounded-xl text-left transition-all flex items-center justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-foreground/70 hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-xl shrink-0">{track.emoji}</span>
                    <div className="truncate">
                      <span className="text-xs font-bold block truncate">{track.title}</span>
                      <span className={`text-[10px] block ${isSelected ? 'text-white/80' : 'text-foreground/40'}`}>
                        {track.durationWeeks}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-white/5 text-foreground/60'
                  }`}>
                    {trackPct}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Track Overview Card */}
          <div className="glass-card p-6 sm:p-8 flex flex-col gap-6 border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shrink-0">
                  {currentTrack.emoji}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 uppercase tracking-wider">
                      {currentTrack.badge}
                    </span>
                    <span className="text-[11px] text-foreground/40 font-mono">
                      ⏱️ {currentTrack.weeklyDedication}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-1">
                    {currentTrack.title}
                  </h2>
                  <p className="text-xs text-foreground/60 mt-1 max-w-2xl leading-relaxed">
                    {currentTrack.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {!isCurrentActive ? (
                  <button
                    onClick={() => setActiveTrack(currentTrack.id)}
                    className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-primary/20"
                  >
                    Set as Active Dashboard Track
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl flex items-center gap-1.5">
                    <span>✓</span>
                    <span>Active Track on Dashboard</span>
                  </span>
                )}
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground/70">
                  Track Progress: <strong className="text-white">{completedTasks.length}</strong> of <strong className="text-white">{allTasks.length}</strong> milestones completed
                </span>
                <span className="font-bold text-primary text-sm">{progressPercent}%</span>
              </div>

              <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Next Recommended Step Highlight */}
            {nextTask && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-purple-500/5 to-transparent border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary font-bold flex items-center justify-center text-sm shrink-0">
                    👉
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      Recommended Next Action
                    </span>
                    <h4 className="text-sm font-bold text-foreground">{nextTask.title}</h4>
                    <p className="text-xs text-foreground/60">{nextTask.description}</p>
                  </div>
                </div>

                <Link
                  href={nextTask.deepLink}
                  className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-primary/20 shrink-0 whitespace-nowrap"
                >
                  {nextTask.linkLabel} &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* Phase Milestones Breakdown */}
          <div className="flex flex-col gap-6">
            {currentTrack.phases.map((phase) => {
              const phaseCompleted = phase.tasks.filter(t => !!progress.roadmapTasks[t.id]).length;
              const phaseTotal = phase.tasks.length;
              const isPhaseDone = phaseCompleted === phaseTotal;

              return (
                <div 
                  key={phase.id} 
                  className="glass-card p-6 sm:p-8 flex flex-col gap-6 border-white/5 hover:border-white/10 transition-all"
                >
                  {/* Phase Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-foreground/70 uppercase tracking-wider font-mono">
                          {phase.weekLabel}
                        </span>
                        {isPhaseDone && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30 uppercase tracking-wider">
                            ✓ Phase Completed
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-foreground mt-1">{phase.title}</h3>
                      <p className="text-xs text-foreground/60 mt-0.5">{phase.description}</p>
                    </div>

                    <div className="text-xs font-semibold text-foreground/50 shrink-0">
                      {phaseCompleted} / {phaseTotal} Tasks ({Math.round((phaseCompleted / phaseTotal) * 100)}%)
                    </div>
                  </div>

                  {/* Tasks List */}
                  <div className="grid grid-cols-1 gap-3">
                    {phase.tasks.map((task) => {
                      const isDone = !!progress.roadmapTasks[task.id];

                      return (
                        <div
                          key={task.id}
                          className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                            isDone
                              ? 'bg-white/[0.02] border-white/5 opacity-75'
                              : 'bg-white/[0.04] border-white/10 hover:border-primary/40'
                          }`}
                        >
                          <div className="flex items-start gap-3.5">
                            <button
                              onClick={() => toggleRoadmapTask(task.id)}
                              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all mt-0.5 shrink-0 ${
                                isDone
                                  ? 'bg-primary text-white shadow-sm'
                                  : 'border-2 border-white/20 hover:border-primary/60'
                              }`}
                              aria-label={`Mark task ${task.title} as ${isDone ? 'incomplete' : 'complete'}`}
                            >
                              {isDone && <span className="text-xs font-bold">✓</span>}
                            </button>

                            <div className="flex flex-col gap-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getTypeBadgeStyle(task.type)}`}>
                                  {task.type}
                                </span>
                                <span className="text-[10px] text-foreground/40 font-mono">
                                  ⏱️ ~{task.estimatedMinutes} mins
                                </span>
                              </div>
                              <h4 className={`text-sm font-bold ${isDone ? 'line-through text-foreground/50' : 'text-foreground'}`}>
                                {task.title}
                              </h4>
                              <p className="text-xs text-foreground/60 leading-relaxed">
                                {task.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            <Link
                              href={task.deepLink}
                              className="text-xs font-semibold text-primary hover:text-white px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary border border-primary/20 transition-all whitespace-nowrap"
                            >
                              {task.linkLabel} &rarr;
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* VIEW 2: 8-Stage Complete Master Syllabus (GeeksforGeeks Style) */}
      {viewMode === 'syllabus' && (
        <div className="flex flex-col gap-8">
          
          {/* Syllabus Progress Bar */}
          <div className="glass-card p-6 sm:p-8 flex flex-col gap-4 border-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground/70">
                8-Stage Curriculum Coverage: <strong className="text-white">{completedSyllabusCount}</strong> of <strong className="text-white">{allSyllabusTopics.length}</strong> core syllabus topics mastered
              </span>
              <span className="font-bold text-primary text-sm">{syllabusProgressPercent}%</span>
            </div>

            <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/5">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-primary via-purple-500 to-emerald-400 transition-all duration-500 shadow-sm"
                style={{ width: `${syllabusProgressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* 8 Stages Accordion Grid */}
          <div className="flex flex-col gap-6">
            {COMPREHENSIVE_SYLLABUS.map((stage) => {
              const stageCompleted = stage.topics.filter(t => !!progress.roadmapTasks[t.id]).length;
              const stageTotal = stage.topics.length;
              const isStageDone = stageCompleted === stageTotal;

              return (
                <div 
                  key={stage.id}
                  className="glass-card p-6 sm:p-8 flex flex-col gap-6 border-white/5 hover:border-primary/30 transition-all"
                >
                  {/* Stage Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                        {stage.emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider">
                            Stage {stage.stageNumber} · {stage.badge}
                          </span>
                          {isStageDone && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30 uppercase tracking-wider">
                              ✓ Stage Mastered
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-foreground mt-1">{stage.title}</h3>
                        <p className="text-xs text-foreground/60 mt-0.5">{stage.description}</p>
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-foreground/50 shrink-0">
                      {stageCompleted} / {stageTotal} Topics ({Math.round((stageCompleted / stageTotal) * 100)}%)
                    </div>
                  </div>

                  {/* Why it matters banner */}
                  <div className="text-[11px] text-foreground/70 bg-white/[0.02] border border-white/5 p-3 rounded-xl flex items-center gap-2">
                    <span className="text-primary font-bold">💡 Why it matters:</span>
                    <span>{stage.whyItMatters}</span>
                  </div>

                  {/* Stage Topics List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {stage.topics.map((topic) => {
                      const isDone = !!progress.roadmapTasks[topic.id];

                      return (
                        <div
                          key={topic.id}
                          className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                            isDone
                              ? 'bg-white/[0.02] border-white/5 opacity-75'
                              : 'bg-white/[0.04] border-white/10 hover:border-primary/40'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => toggleRoadmapTask(topic.id)}
                              className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all mt-0.5 shrink-0 ${
                                isDone
                                  ? 'bg-primary text-white shadow-sm'
                                  : 'border-2 border-white/20 hover:border-primary/60'
                              }`}
                              aria-label={`Mark topic ${topic.name} as ${isDone ? 'incomplete' : 'complete'}`}
                            >
                              {isDone && <span className="text-xs font-bold">✓</span>}
                            </button>

                            <div className="flex flex-col gap-1">
                              <h4 className={`text-xs sm:text-sm font-bold ${isDone ? 'line-through text-foreground/50' : 'text-foreground'}`}>
                                {topic.name}
                              </h4>
                              <p className="text-[11px] text-foreground/60 leading-relaxed">
                                {topic.description}
                              </p>

                              {topic.tags && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {topic.tags.map((tag, tIdx) => (
                                    <span key={tIdx} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-foreground/50 border border-white/5">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {(topic.deepLink || topic.sandboxLink) && (
                            <div className="flex items-center justify-between pt-2 border-t border-white/5 flex-wrap gap-2">
                              {topic.sandboxLink ? (
                                <a
                                  href={topic.sandboxLink}
                                  target={topic.sandboxLink.startsWith('http') ? '_blank' : undefined}
                                  rel={topic.sandboxLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all flex items-center gap-1"
                                >
                                  <span>{topic.sandboxLabel || 'In-Browser Sandbox ⚡'}</span>
                                  {topic.sandboxLink.startsWith('http') && <span>↗</span>}
                                </a>
                              ) : <div></div>}

                              {topic.deepLink && (
                                <Link
                                  href={topic.deepLink}
                                  className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 ml-auto"
                                >
                                  <span>{topic.linkLabel || 'Practice in Interview Brain'}</span>
                                  <span>&rarr;</span>
                                </Link>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
