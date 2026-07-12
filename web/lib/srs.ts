export interface SRSProgress {
  questionId: string;
  ease: number;      // Ease factor, default 2.5
  interval: number;  // Interval in days, default 0 (due immediately)
  repetitions: number; // Number of consecutive correct reviews, default 0
  nextDue: string;   // ISO date string when card is next due
}

// SM-2 Spaced Repetition Algorithm
// quality: 1 (Again), 3 (Hard), 4 (Good), 5 (Easy)
export function calculateSRS(quality: number, prevEase = 2.5, prevInterval = 0, prevRepetitions = 0): Omit<SRSProgress, 'questionId'> {
  let ease = prevEase;
  let interval = prevInterval;
  let repetitions = prevRepetitions;

  // Adjust ease factor
  ease = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ease < 1.3) ease = 1.3;

  if (quality < 3) {
    // Forgot card, reset interval
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(prevInterval * ease);
    }
    repetitions++;
  }

  // Calculate next due date
  const nextDue = new Date();
  nextDue.setDate(nextDue.getDate() + interval);

  return {
    ease,
    interval,
    repetitions,
    nextDue: nextDue.toISOString(),
  };
}
