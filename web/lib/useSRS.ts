import { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { auth, db } from "./firebase";
import { calculateSRS, SRSProgress } from "./srs";

export function useSRS() {
  const [user, setUser] = useState<User | null>(null);
  // When Firebase is not configured, there's nothing to load — start not loading.
  const [loading, setLoading] = useState(!!auth);
  // Pre-populate from localStorage so the effect never calls setState directly.
  const [progressMap, setProgressMap] = useState<Record<string, SRSProgress>>(
    () => {
      if (typeof window === "undefined") return {};
      const local = localStorage.getItem("ib_srs_progress");
      if (!local) return {};
      try {
        return JSON.parse(local) as Record<string, SRSProgress>;
      } catch {
        return {};
      }
    },
  );

  // Monitor auth state
  useEffect(() => {
    // Firebase not configured (env vars missing) — already initialized above.
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(true);

      if (currentUser) {
        // Fetch progress from Firestore
        try {
          const progressCol = collection(
            db,
            "users",
            currentUser.uid,
            "progress",
          );
          const progressSnap = await getDocs(progressCol);
          const map: Record<string, SRSProgress> = {};
          progressSnap.forEach((doc) => {
            map[doc.id] = doc.data() as SRSProgress;
          });
          setProgressMap(map);
        } catch (error) {
          console.error("Error fetching progress from Firestore:", error);
        }
      } else {
        // Fetch progress from localStorage
        const local = localStorage.getItem("ib_srs_progress");
        if (local) {
          try {
            setProgressMap(JSON.parse(local));
          } catch (e) {
            console.error(e);
          }
        } else {
          setProgressMap({});
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const loginWithGoogle = async () => {
    if (!auth) {
      console.warn("Firebase not configured");
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  // Logout
  const logout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Submit review score
  const submitReview = async (questionId: string, quality: number) => {
    const current = progressMap[questionId] || {
      questionId,
      ease: 2.5,
      interval: 0,
      repetitions: 0,
      nextDue: new Date().toISOString(),
    };

    const newSRS = calculateSRS(
      quality,
      current.ease,
      current.interval,
      current.repetitions,
    );
    const updatedProgress: SRSProgress = {
      questionId,
      ...newSRS,
    };

    const nextMap = {
      ...progressMap,
      [questionId]: updatedProgress,
    };

    setProgressMap(nextMap);

    if (user) {
      // Save to Firestore
      try {
        const progressDocRef = doc(
          db,
          "users",
          user.uid,
          "progress",
          questionId,
        );
        await setDoc(progressDocRef, updatedProgress);
      } catch (error) {
        console.error("Error saving progress to Firestore:", error);
      }
    } else {
      // Save to localStorage
      localStorage.setItem("ib_srs_progress", JSON.stringify(nextMap));
    }
  };

  // Filter questions that are due for review
  const getDueStatus = (questionId: string) => {
    const progress = progressMap[questionId];
    if (!progress) return { due: true, status: "New" };

    const isDue = new Date(progress.nextDue) <= new Date();
    return {
      due: isDue,
      status: isDue ? "Review" : "Learned",
      nextDue: new Date(progress.nextDue).toLocaleDateString(),
    };
  };

  return {
    user,
    loading,
    progressMap,
    loginWithGoogle,
    logout,
    submitReview,
    getDueStatus,
  };
}
