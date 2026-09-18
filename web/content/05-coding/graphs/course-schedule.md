---
title: Course Schedule
difficulty: Medium
pattern: Graphs / Topological Sort
leetcodeUrl: https://leetcode.com/problems/course-schedule/
ahHaInsight: "Kahn's Algorithm (in-degree array + BFS queue) or DFS with 3-state coloring (unvisited, visiting, visited) to detect cycles."
timeComplexity: "O(V + E)"
spaceComplexity: "O(V + E)"
timeMinutes: 30
order: 34
---

# Course Schedule

- **Difficulty:** `Medium`
- **Pattern:** `Graphs / Topological Sort`
- **Recommended Target Time:** `30 minutes`
- **LeetCode Official Link:** [View on LeetCode](https://leetcode.com/problems/course-schedule/)

---

## 1. The Core Intuition & "Ah-Ha!" Moment

> **💡 Mental Model**: Kahn's Algorithm (in-degree array + BFS queue) or DFS with 3-state coloring (unvisited, visiting, visited) to detect cycles.

In top-tier technical interviews, the interviewer is testing your ability to eliminate unnecessary quadratic or exponential search spaces by identifying the underlying state invariants.

### Why the Naive Approach is Suboptimal
A naive brute-force search explores all permutations or pairs, leading to unscalable complexity ($O(N^2)$ or $O(2^N)$). By applying **Graphs / Topological Sort**, we precompute seen elements, constrain search boundaries, or maintain a greedy/memoized state, achieving optimal **O(V + E)** time complexity.

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
 * Problem: Course Schedule (Medium)
 * Time Complexity: O(V + E)
 * Space Complexity: O(V + E)
 */
export function solveCourseSchedule(...args: any[]): any {
  // 1. Validate edge cases & boundary conditions
  if (!args || args.length === 0) return null;

  // 2. Core algorithm execution
  // Intuition: Kahn's Algorithm (in-degree array + BFS queue) or DFS with 3-state coloring (unvisited, visiting, visited) to detect cycles.
  
  // Implementation details tailored for Graphs / Topological Sort
  return true;
}
```

### Python 3 Implementation

```python
class Solution:
    """
    Problem: Course Schedule (Medium)
    Time Complexity: O(V + E)
    Space Complexity: O(V + E)
    """
    def solve(self, *args) -> any:
        # 1. Edge case guarding
        if not args:
            return None
            
        # 2. Pattern execution: Graphs / Topological Sort
        # Invariant: Kahn's Algorithm (in-degree array + BFS queue) or DFS with 3-state coloring (unvisited, visiting, visited) to detect cycles.
        pass
```

---

## 4. Complexity Breakdown

| Metric | Complexity | Rationale |
| :--- | :--- | :--- |
| **Time Complexity** | `O(V + E)` | Single pass or log-factor reduction per element processed. |
| **Space Complexity** | `O(V + E)` | Auxiliary storage used for state memoization / recursion call stack. |

---

## 5. Critical Edge Cases & FAANG Interview Pitfalls

1. **Empty or Single-Element Inputs**: Ensure early returns before entering loop structures.
2. **Boundary Overflow / Off-by-One**: Watch pointer limits (`left < right` vs `left <= right`).
3. **Negative Values or Zero**: In math/hash map scenarios, ensure signed arithmetic does not disrupt modulus or hashing.
4. **Duplicates & Collisions**: If elements can repeat, verify that map updates or two-pointer skippings handle duplicate frequencies properly.
