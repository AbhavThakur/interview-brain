"use client";

import { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export type ProblemStatus = "todo" | "attempted" | "solved" | "review";

export interface PlanMilestone {
  id: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  category:
    | "lld"
    | "hld"
    | "coding"
    | "system-design"
    | "cheatsheet"
    | "behavioral"
    | "tools"
    | "notebooklm";
  deepLink: string;
  linkLabel: string;
  completed: boolean;
  toolRecommendation?: {
    name: string;
    url: string;
    isExternal?: boolean;
  };
}

export interface CustomPlanData {
  id: string;
  createdAt: string;
  primaryFocus: string;
  focusTitle: string;
  experienceLevel: "beginner" | "intermediate" | "senior";
  dailyTime: "15m" | "60m" | "120m";
  primaryWeakness: string;
  title: string;
  summary: string;
  milestones: PlanMilestone[];
}

export interface UserProgressData {
  codingStatus: Record<string, ProblemStatus>;
  bookmarkedResources: string[];
  streakCount: number;
  lastActiveDate: string;
  completedTasksToday: string[];
  roadmapTasks: Record<string, boolean>;
  activeTrack: string;
  targetInterviewDate?: string;
  customName?: string;
  targetCompany?: string;
  customPlan?: CustomPlanData;
}

const DEFAULT_PROGRESS: UserProgressData = {
  codingStatus: {},
  bookmarkedResources: [],
  streakCount: 1,
  lastActiveDate: new Date().toISOString().split("T")[0],
  completedTasksToday: [],
  roadmapTasks: {},
  activeTrack: "sde2-fullstack",
  targetInterviewDate: "",
  customName: "",
  targetCompany: "Amazon",
  customPlan: undefined,
};

export function useProgress() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);
  const [progress, setProgress] = useState<UserProgressData>(DEFAULT_PROGRESS);

  // Hydrate local progress and calculate streak on client mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Marks client hydration before reading local storage.
    setMounted(true);
    const today = new Date().toISOString().split("T")[0];
    try {
      const local = localStorage.getItem("ib_user_progress");
      let base = DEFAULT_PROGRESS;
      if (local) {
        base = { ...DEFAULT_PROGRESS, ...JSON.parse(local) };
      }
      if (!base.customPlan) {
        const planLocal = localStorage.getItem("ib_user_custom_plan");
        if (planLocal) {
          base.customPlan = JSON.parse(planLocal);
        }
      }

      let streak = base.streakCount;
      if (base.lastActiveDate !== today) {
        const yesterday = new Date(Date.now() - 86400000)
          .toISOString()
          .split("T")[0];
        const isConsecutive = base.lastActiveDate === yesterday;
        streak = isConsecutive ? base.streakCount + 1 : 1;
      }

      const updated: UserProgressData = {
        ...base,
        streakCount: streak,
        lastActiveDate: today,
        completedTasksToday:
          base.lastActiveDate === today ? base.completedTasksToday : [],
      };

      setProgress(updated);
      localStorage.setItem("ib_user_progress", JSON.stringify(updated));
    } catch (e) {
      console.error("Error hydrating progress:", e);
    }
  }, []);

  // Firebase auth sync
  useEffect(() => {
    if (!auth) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Completes loading when Firebase is unavailable.
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && db) {
        try {
          const docRef = doc(
            db,
            "users",
            currentUser.uid,
            "profile",
            "progress",
          );
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProgressData;
            setProgress((prev) => {
              const merged = { ...prev, ...data };
              if (typeof window !== "undefined") {
                localStorage.setItem(
                  "ib_user_progress",
                  JSON.stringify(merged),
                );
              }
              return merged;
            });
          } else {
            // Save local progress to Firestore on first login
            await setDoc(docRef, progress, { merge: true });
          }
        } catch (err) {
          console.error("Error fetching progress from Firestore:", err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveProgress = async (
    updater: UserProgressData | ((prev: UserProgressData) => UserProgressData),
  ) => {
    setProgress((prev) => {
      const nextProgress =
        typeof updater === "function" ? updater(prev) : updater;
      if (typeof window !== "undefined") {
        localStorage.setItem("ib_user_progress", JSON.stringify(nextProgress));
      }

      if (user && db) {
        try {
          const docRef = doc(db, "users", user.uid, "profile", "progress");
          setDoc(docRef, nextProgress, { merge: true }).catch((err) => {
            console.error("Error saving progress to Firestore:", err);
          });
        } catch (err) {
          console.error("Error saving progress to Firestore:", err);
        }
      }

      return nextProgress;
    });
  };

  const setProblemStatus = (problemId: string, status: ProblemStatus) => {
    saveProgress((prev) => ({
      ...prev,
      codingStatus: {
        ...prev.codingStatus,
        [problemId]: status,
      },
    }));
  };

  const toggleBookmark = (resourceId: string) => {
    saveProgress((prev) => {
      const exists = prev.bookmarkedResources.includes(resourceId);
      const nextBookmarks = exists
        ? prev.bookmarkedResources.filter((id) => id !== resourceId)
        : [...prev.bookmarkedResources, resourceId];

      return {
        ...prev,
        bookmarkedResources: nextBookmarks,
      };
    });
  };

  const toggleDailyTask = (taskId: string) => {
    saveProgress((prev) => {
      const exists = prev.completedTasksToday.includes(taskId);
      const nextTasks = exists
        ? prev.completedTasksToday.filter((id) => id !== taskId)
        : [...prev.completedTasksToday, taskId];

      return {
        ...prev,
        completedTasksToday: nextTasks,
      };
    });
  };

  const toggleRoadmapTask = (taskId: string) => {
    saveProgress((prev) => ({
      ...prev,
      roadmapTasks: {
        ...prev.roadmapTasks,
        [taskId]: !prev.roadmapTasks[taskId],
      },
    }));
  };

  const setActiveTrack = (trackId: string) => {
    saveProgress((prev) => ({
      ...prev,
      activeTrack: trackId,
    }));
  };

  const setTargetInterviewDate = (date: string) => {
    saveProgress((prev) => ({
      ...prev,
      targetInterviewDate: date,
    }));
  };

  const saveCustomPlan = (plan: CustomPlanData, activeTrackId?: string) => {
    saveProgress((prev) => ({
      ...prev,
      customPlan: plan,
      ...(activeTrackId ? { activeTrack: activeTrackId } : {}),
    }));
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("ib_user_custom_plan", JSON.stringify(plan));
      } catch (e) {
        console.error("Error saving custom plan to localStorage:", e);
      }
    }
  };

  const togglePlanMilestone = (milestoneId: string) => {
    saveProgress((prev) => {
      if (!prev.customPlan) return prev;
      const nextMilestones = prev.customPlan.milestones.map((m) => {
        if (m.id === milestoneId) {
          return { ...m, completed: !m.completed };
        }
        return m;
      });

      const updatedPlan: CustomPlanData = {
        ...prev.customPlan,
        milestones: nextMilestones,
      };

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            "ib_user_custom_plan",
            JSON.stringify(updatedPlan),
          );
        } catch (e) {
          console.error("Error saving custom plan to localStorage:", e);
        }
      }

      return {
        ...prev,
        customPlan: updatedPlan,
      };
    });
  };

  const resetCustomPlan = () => {
    saveProgress((prev) => ({
      ...prev,
      customPlan: undefined,
    }));
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("ib_user_custom_plan");
      } catch (e) {
        console.error("Error clearing custom plan from localStorage:", e);
      }
    }
  };

  const loginWithGoogle = async () => {
    if (!auth) return;
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const logout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return {
    user,
    loading,
    mounted,
    progress,
    setProblemStatus,
    toggleBookmark,
    toggleDailyTask,
    toggleRoadmapTask,
    setActiveTrack,
    setTargetInterviewDate,
    saveCustomPlan,
    togglePlanMilestone,
    resetCustomPlan,
    loginWithGoogle,
    logout,
  };
}
