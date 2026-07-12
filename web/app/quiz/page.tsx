'use client';

import dynamic from 'next/dynamic';

const QuizPageContent = dynamic(() => import('@/components/QuizPageContent'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="text-foreground/60">Loading Q&A Bank...</p>
      </div>
    </div>
  ),
});

export default function QuizPage() {
  return <QuizPageContent />;
}
