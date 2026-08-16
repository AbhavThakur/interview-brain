'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export type ProblemStatus = 'todo' | 'attempted' | 'solved' | 'review';

export interface UserProgressData {
  codingStatus: Record<string, ProblemStatus>;
  bookmarkedResources: string[];
  streakCount: number;
  lastActiveDate: string;
  completedTasksToday: string[];
}

const DEFAULT_PROGRESS: UserProgressData = {
  codingStatus: {},
  bookmarkedResources: [],
  streakCount: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedTasksToday: []
};

export function useProgress() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<UserProgressData>(() => {
    if (typeof window === 'undefined') return DEFAULT_PROGRESS;
    try {
      const local = localStorage.getItem('ib_user_progress');
      if (local) {
        return { ...DEFAULT_PROGRESS, ...JSON.parse(local) };
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PROGRESS;
  });

  // Calculate and update streak on load
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setProgress(prev => {
      if (prev.lastActiveDate === today) return prev;
      
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const isConsecutive = prev.lastActiveDate === yesterday;
      const newStreak = isConsecutive ? prev.streakCount + 1 : 1;

      const updated = {
        ...prev,
        streakCount: newStreak,
        lastActiveDate: today,
        completedTasksToday: []
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('ib_user_progress', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // Firebase auth sync
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && db) {
        try {
          const docRef = doc(db, 'users', currentUser.uid, 'profile', 'progress');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProgressData;
            setProgress(prev => ({ ...prev, ...data }));
          }
        } catch (err) {
          console.error('Error fetching progress from Firestore:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveProgress = async (newProgress: UserProgressData) => {
    setProgress(newProgress);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ib_user_progress', JSON.stringify(newProgress));
    }

    if (user && db) {
      try {
        const docRef = doc(db, 'users', user.uid, 'profile', 'progress');
        await setDoc(docRef, newProgress, { merge: true });
      } catch (err) {
        console.error('Error saving progress to Firestore:', err);
      }
    }
  };

  const setProblemStatus = (problemId: string, status: ProblemStatus) => {
    const nextCodingStatus = {
      ...progress.codingStatus,
      [problemId]: status
    };
    saveProgress({
      ...progress,
      codingStatus: nextCodingStatus
    });
  };

  const toggleBookmark = (resourceId: string) => {
    const exists = progress.bookmarkedResources.includes(resourceId);
    const nextBookmarks = exists 
      ? progress.bookmarkedResources.filter(id => id !== resourceId)
      : [...progress.bookmarkedResources, resourceId];

    saveProgress({
      ...progress,
      bookmarkedResources: nextBookmarks
    });
  };

  const toggleDailyTask = (taskId: string) => {
    const exists = progress.completedTasksToday.includes(taskId);
    const nextTasks = exists
      ? progress.completedTasksToday.filter(id => id !== taskId)
      : [...progress.completedTasksToday, taskId];

    saveProgress({
      ...progress,
      completedTasksToday: nextTasks
    });
  };

  return {
    user,
    loading,
    progress,
    setProblemStatus,
    toggleBookmark,
    toggleDailyTask
  };
}
