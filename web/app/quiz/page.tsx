'use client';

import { useState, useEffect, useMemo } from 'react';
import MarkdownMarkdownRenderer from '@/components/MarkdownRenderer';
import { useSRS } from '@/lib/useSRS';

type Question = {
  id: string;
  topic: string;
  question: string;
  tags: string[];
  askedAt: string;
  answer: string;
};

export default function QuizPage() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [reviewOnlyDue, setReviewOnlyDue] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  const {
    user,
    loading: loadingSRS,
    submitReview,
    getDueStatus,
    loginWithGoogle,
    logout,
  } = useSRS();

  useEffect(() => {
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => {
        setAllQuestions(data);
        setLoadingQuestions(false);
      });
  }, []);

  // Extract unique topics
  const topics = useMemo(() => {
    const t = new Set(allQuestions.map(q => q.topic));
    return ['All', ...Array.from(t).sort()];
  }, [allQuestions]);

  // Filter and shuffle
  const questions = useMemo(() => {
    let filtered = selectedTopic === 'All' 
      ? allQuestions 
      : allQuestions.filter(q => q.topic === selectedTopic);

    if (reviewOnlyDue) {
      filtered = filtered.filter(q => getDueStatus(q.id).due);
    }

    return [...filtered].sort(() => 0.5 - Math.random());
  }, [allQuestions, selectedTopic, reviewOnlyDue, getDueStatus]);

  // Reset index when topic or mode changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedTopic, reviewOnlyDue]);

  const handleNext = (quality: number) => {
    const currentQ = questions[currentIndex];
    if (currentQ) {
      submitReview(currentQ.id, quality);
    }
    
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % questions.length);
    }, 150);
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'SELECT') {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (isFlipped) {
        if (e.key === '1') {
          e.preventDefault();
          handleNext(1);
        } else if (e.key === '2') {
          e.preventDefault();
          handleNext(3);
        } else if (e.key === '3') {
          e.preventDefault();
          handleNext(4);
        } else if (e.key === '4') {
          e.preventDefault();
          handleNext(5);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, questions, currentIndex]);

  if (loadingQuestions || loadingSRS) {
    return <div className="flex justify-center py-20 text-primary animate-pulse">Loading Q&A Bank...</div>;
  }

  // Auth Banner
  const renderAuthBanner = () => {
    if (user) {
      return (
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-foreground/75">Synced: {user.displayName}</span>
          <button onClick={logout} className="text-primary hover:text-white transition-colors ml-2 font-medium">
            Sign Out
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-4 py-2 text-xs">
        <span className="text-foreground/60">Local progress only.</span>
        <button onClick={loginWithGoogle} className="text-primary hover:text-white transition-colors font-medium">
          Sign in to Sync
        </button>
      </div>
    );
  };

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-8 py-20">
        <div className="flex justify-end w-full">{renderAuthBanner()}</div>
        <div className="text-center p-8 glass-card w-full border-white/10">
          <h2 className="text-2xl font-bold mb-4">Zero Cards Due! 🎉</h2>
          <p className="text-foreground/60 mb-6">
            You've completed all reviews for this topic. Check back later or add new questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <select 
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              {topics.map(t => (
                <option key={t} value={t} className="bg-[#1e222a] text-foreground">{t === 'All' ? 'All Topics' : t}</option>
              ))}
            </select>
            {reviewOnlyDue && (
              <button 
                onClick={() => setReviewOnlyDue(false)}
                className="bg-primary hover:bg-primary-dark text-background px-4 py-2 rounded-xl font-medium transition-colors"
              >
                Review All Questions
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const cardStatus = getDueStatus(currentQ.id);

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[70vh] gap-6 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Top Banner (Auth and settings) */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-bold">Active Quiz Session</h1>
          <p className="text-xs text-foreground/50">Master content with active recall.</p>
        </div>
        {renderAuthBanner()}
      </div>

      {/* Topic filter + progress */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <select 
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
          >
            {topics.map(t => (
              <option key={t} value={t} className="bg-[#1e222a] text-foreground">{t === 'All' ? 'All Topics' : t}</option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-xs text-foreground/70 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={reviewOnlyDue}
              onChange={(e) => setReviewOnlyDue(e.target.checked)}
              className="rounded border-white/10 bg-white/5 text-primary focus:ring-primary w-4 h-4"
            />
            <span>Due Only</span>
          </label>
        </div>
        
        <span className="text-sm text-foreground/50 font-medium bg-white/5 px-3 py-1 rounded-lg border border-white/5">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* The Card */}
      <div 
        className="relative w-full aspect-[4/3] perspective-1000 group cursor-pointer"
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        <div className={`w-full h-full transition-all duration-700 preserve-3d absolute inset-0 ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front (Question) */}
          <div className="absolute inset-0 backface-hidden glass-card p-10 flex flex-col items-center justify-center text-center gap-6 shadow-2xl hover:border-primary/40 transition-colors">
            <div className="flex gap-2">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider">
                {currentQ.topic}
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                cardStatus.status === 'New' 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : cardStatus.status === 'Review'
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'bg-green-500/20 text-green-400'
              }`}>
                {cardStatus.status}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold leading-snug">{currentQ.question}</h2>
            {!isFlipped && (
              <p className="text-foreground/40 text-sm mt-4 animate-pulse">
                Click anywhere or press <kbd className="bg-white/10 px-2 py-1 rounded text-xs font-mono border border-white/10 shadow-inner">Space</kbd> to reveal answer
              </p>
            )}
          </div>

          {/* Back (Answer) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 glass-card p-8 shadow-2xl border-primary/30 overflow-y-auto">
            <div className="prose-dark max-w-none text-left">
              <MarkdownMarkdownRenderer content={currentQ.answer} />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={`w-full transition-all duration-500 transform ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="mt-4 p-6 glass-card border-t-4 border-t-primary/50 flex flex-col gap-4 text-center">
          <p className="text-sm text-foreground/70 font-medium">How well did you know this?</p>
          <div className="grid grid-cols-4 gap-3">
            <button onClick={() => handleNext(1)} className="py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-medium transition-colors flex flex-col items-center justify-center">
              <span>Again</span>
              <span className="text-[10px] opacity-40 mt-0.5 font-mono">Press 1</span>
            </button>
            <button onClick={() => handleNext(3)} className="py-3 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 font-medium transition-colors flex flex-col items-center justify-center">
              <span>Hard</span>
              <span className="text-[10px] opacity-40 mt-0.5 font-mono">Press 2</span>
            </button>
            <button onClick={() => handleNext(4)} className="py-3 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 font-medium transition-colors flex flex-col items-center justify-center">
              <span>Good</span>
              <span className="text-[10px] opacity-40 mt-0.5 font-mono">Press 3</span>
            </button>
            <button onClick={() => handleNext(5)} className="py-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 font-medium transition-colors flex flex-col items-center justify-center">
              <span>Easy</span>
              <span className="text-[10px] opacity-40 mt-0.5 font-mono">Press 4</span>
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
