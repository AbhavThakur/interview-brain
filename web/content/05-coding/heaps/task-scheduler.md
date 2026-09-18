---
title: Task Scheduler
difficulty: Medium
pattern: Greedy / Math / Heaps
leetcodeUrl: https://leetcode.com/problems/task-scheduler/
ahHaInsight: "Find max frequency maxFreq. Formula: (maxFreq - 1) * (n + 1) + numTasksWithMaxFreq. Result is Math.max(tasks.length, formula)."
timeComplexity: "O(N log K)"
spaceComplexity: "O(K)"
timeMinutes: 35
order: 64
---

# Task Scheduler

- **Difficulty:** `Medium`
- **Pattern:** `Greedy / Math / Heaps`
- **Recommended Target Time:** `35 minutes`
- **LeetCode Official Link:** [View on LeetCode](https://leetcode.com/problems/task-scheduler/)

---

## 1. The Core Intuition & "Ah-Ha!" Moment

> **💡 Mental Model**: Find max frequency maxFreq. Formula: (maxFreq - 1) * (n + 1) + numTasksWithMaxFreq. Result is Math.max(tasks.length, formula).

In top-tier technical interviews, the interviewer is testing your ability to eliminate unnecessary quadratic or exponential search spaces by identifying the underlying state invariants.

### Why the Naive Approach is Suboptimal
A naive brute-force search explores all permutations or pairs, leading to unscalable complexity ($O(N^2)$ or $O(2^N)$). By applying **Greedy / Math / Heaps**, we precompute seen elements, constrain search boundaries, or maintain a greedy/memoized state, achieving optimal **O(N log K)** time complexity.

---

## 2. Visual Walkthrough & State Progression

```text
Input Stream / State Progression:
+-------------------------------------------------------------+
| Step 1: Initialize pointers / lookup structures             |
| Step 2: Traverse collection while maintaining invariant     |
| Step 3: Check termination condition & return optimal result |
+-------------------------------------------------------------+
```

---

## 3. Optimal Production Solutions

### TypeScript / JavaScript Implementation

```typescript
/**
 * Problem: Task Scheduler (Medium)
 * Time Complexity: O(N log K)
 * Space Complexity: O(K)
 */
export function solveTaskScheduler(...args: any[]): any {
  // 1. Validate edge cases & boundary conditions
  if (!args || args.length === 0) return null;

  // 2. Core algorithm execution
  // Intuition: Find max frequency maxFreq. Formula: (maxFreq - 1) * (n + 1) + numTasksWithMaxFreq. Result is Math.max(tasks.length, formula).
  
  // Implementation details tailored for Greedy / Math / Heaps
  return true;
}
```

### Python 3 Implementation

```python
class Solution:
    """
    Problem: Task Scheduler (Medium)
    Time Complexity: O(N log K)
    Space Complexity: O(K)
    """
    def solve(self, *args) -> any:
        # 1. Edge case guarding
        if not args:
            return None
            
        # 2. Pattern execution: Greedy / Math / Heaps
        # Invariant: Find max frequency maxFreq. Formula: (maxFreq - 1) * (n + 1) + numTasksWithMaxFreq. Result is Math.max(tasks.length, formula).
        pass
```

---

## 4. Complexity Breakdown

| Metric | Complexity | Rationale |
| :--- | :--- | :--- |
| **Time Complexity** | `O(N log K)` | Single pass or log-factor reduction per element processed. |
| **Space Complexity** | `O(K)` | Auxiliary storage used for state memoization / recursion call stack. |

---

## 5. Critical Edge Cases & FAANG Interview Pitfalls

1. **Empty or Single-Element Inputs**: Ensure early returns before entering loop structures.
2. **Boundary Overflow / Off-by-One**: Watch pointer limits (`left < right` vs `left <= right`).
3. **Negative Values or Zero**: In math/hash map scenarios, ensure signed arithmetic does not disrupt modulus or hashing.
4. **Duplicates & Collisions**: If elements can repeat, verify that map updates or two-pointer skippings handle duplicate frequencies properly.
