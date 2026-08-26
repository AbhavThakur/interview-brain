'use client';

import Link from 'next/link';
import { useProgress } from '@/lib/useProgress';
import { CAREER_TRACKS } from '@/lib/roadmapData';

export default function ActiveRoadmapWidget() {
  const { progress } = useProgress();
  const activeTrack = CAREER_TRACKS.find(t => t.id === (progress.activeTrack || 'sde2-fullstack')) || CAREER_TRACKS[0];

  const allTasks = activeTrack.phases.flatMap(p => p.tasks);
  const completedTasks = allTasks.filter(t => !!progress.roadmapTasks[t.id]);
  const progressPercent = allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0;
  const nextTask = allTasks.find(t => !progress.roadmapTasks[t.id]);

  return (
    <div className="glass-card p-6 sm:p-8 flex flex-col gap-5 border-primary/20 relative overflow-hidden bg-gradient-to-br from-primary/10 via-white/[0.02] to-black">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center text-xl shrink-0">
            {activeTrack.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 uppercase tracking-wider">
                Your Active Pathway
              </span>
              <span className="text-[11px] text-foreground/40 font-mono">
                {activeTrack.durationWeeks}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground mt-0.5">
              {activeTrack.title}
            </h3>
          </div>
        </div>

        <Link
          href="/roadmap"
          className="text-xs font-semibold text-primary hover:text-white px-3.5 py-1.5 rounded-xl bg-primary/10 hover:bg-primary border border-primary/20 transition-all self-start sm:self-center whitespace-nowrap"
        >
          View Full Pathway ({CAREER_TRACKS.length} tracks) &rarr;
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-foreground/70">
            Overall Readiness: <strong className="text-white">{completedTasks.length}</strong> / <strong className="text-white">{allTasks.length}</strong> Milestones
          </span>
          <span className="font-bold text-primary">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Recommended Next Step */}
      {nextTask ? (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-base mt-0.5">👉</span>
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                Next Recommended Step:
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-foreground">{nextTask.title}</h4>
              <p className="text-[11px] text-foreground/60 leading-relaxed mt-0.5">{nextTask.description}</p>
            </div>
          </div>

          <Link
            href={nextTask.deepLink}
            className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-primary/20 shrink-0 self-end sm:self-center whitespace-nowrap"
          >
            {nextTask.linkLabel} &rarr;
          </Link>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-semibold flex items-center gap-2">
          <span>🎉</span>
          <span>Congratulations! You have completed all milestones in this pathway!</span>
        </div>
      )}

    </div>
  );
}
