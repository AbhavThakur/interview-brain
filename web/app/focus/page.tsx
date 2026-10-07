import DailyExecutionEngine from '@/components/DailyExecutionEngine';

export const metadata = {
  title: "Today's Focus · Daily Execution Engine | Interview Brain",
  description: "Eliminate decision fatigue. Complete your daily 3-block queue: next unsolved algorithm, system design blueprint, and STAR story.",
};

export default function FocusPage() {
  return (
    <div className="max-w-5xl mx-auto py-6">
      <DailyExecutionEngine />
    </div>
  );
}
