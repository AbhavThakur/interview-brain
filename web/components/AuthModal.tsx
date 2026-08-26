'use client';

import { useState } from 'react';
import { useProgress } from '@/lib/useProgress';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { user, progress, loginWithGoogle, logout, setTargetInterviewDate } = useProgress();
  const [customName, setCustomName] = useState<string>(progress.customName || '');
  const [targetCompany, setTargetCompany] = useState<string>(progress.targetCompany || 'Amazon');
  const [interviewDate, setInterviewDate] = useState<string>(progress.targetInterviewDate || '');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: unknown) {
      console.error('Google Sign-in failed:', err);
      setAuthError('Google sign-in is not configured for this domain yet. You can use your custom Local Profile below with 100% full tracking!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveLocalProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const current = localStorage.getItem('ib_user_progress');
      const parsed = current ? JSON.parse(current) : {};
      const updated = {
        ...parsed,
        customName: customName.trim() || 'Tech Candidate',
        targetCompany: targetCompany.trim(),
        targetInterviewDate: interviewDate
      };
      localStorage.setItem('ib_user_progress', JSON.stringify(updated));
      setTargetInterviewDate(interviewDate);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1000);
    }
  };

  const handleExportBackup = () => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('ib_user_progress') || '{}';
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interview-brain-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const parsed = JSON.parse(content);
          localStorage.setItem('ib_user_progress', JSON.stringify(parsed));
          window.location.reload();
        } catch (err) {
          console.error('Invalid JSON backup', err);
          alert('Invalid backup file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="glass-card max-w-md w-full p-6 sm:p-8 flex flex-col gap-6 border-white/10 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center font-bold text-white text-sm shadow-md">
              👤
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">User Profile & Cloud Sync</h3>
              <p className="text-[11px] text-foreground/50">Manage your interview streak and cross-device sync</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-foreground/40 hover:text-white text-sm p-1.5 rounded-lg hover:bg-white/5"
          >
            ✕
          </button>
        </div>

        {/* Cloud Google Sign In */}
        {user ? (
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider block">
                  ✓ Cloud Sync Active
                </span>
                <span className="text-xs font-bold text-foreground">{user.displayName || user.email}</span>
                <span className="text-[10px] text-foreground/50 block">{user.email}</span>
              </div>

              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2.5 group"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isSubmitting ? 'Signing in...' : 'Sign in with Google'}</span>
            </button>

            {authError && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 leading-relaxed">
                {authError}
              </div>
            )}
          </div>
        )}

        {/* Local Profile & Target Goal Customizer */}
        <form onSubmit={handleSaveLocalProfile} className="flex flex-col gap-4 border-t border-white/5 pt-4">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">
              Candidate Profile & Goal
            </span>
            <p className="text-[11px] text-foreground/60">
              Customize your profile name and target company to personalize your countdown and recommendations.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-foreground/70">Candidate Name</label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Alex"
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-foreground/70">Target Company</label>
              <select
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                className="bg-[#1e222a] border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
              >
                <option value="Amazon">Amazon</option>
                <option value="Google">Google</option>
                <option value="Meta">Meta</option>
                <option value="Microsoft">Microsoft</option>
                <option value="Uber">Uber</option>
                <option value="Netflix">Netflix</option>
                <option value="Apple">Apple</option>
                <option value="Product Startup">Product Startup</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-foreground/70">Target Date</label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="bg-[#1e222a] border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
              >
              </input>
            </div>
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md mt-1"
          >
            {saveSuccess ? '✓ Profile Saved!' : 'Save Candidate Goal'}
          </button>
        </form>

        {/* Data Backup & Restore */}
        <div className="border-t border-white/5 pt-4 flex items-center justify-between gap-3 text-xs">
          <button
            onClick={handleExportBackup}
            className="text-[11px] text-foreground/60 hover:text-foreground hover:underline"
          >
            💾 Export Backup (.json)
          </button>

          <label className="text-[11px] text-primary hover:underline cursor-pointer">
            <span>📥 Restore Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>

      </div>
    </div>
  );
}
