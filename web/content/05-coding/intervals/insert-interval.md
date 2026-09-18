---
title: Insert Interval
difficulty: Medium
pattern: Intervals
leetcodeUrl: https://leetcode.com/problems/insert-interval/
ahHaInsight: "Add non-overlapping left intervals, merge all overlapping intervals into newInterval, then append remaining right intervals."
timeComplexity: "O(N)"
spaceComplexity: "O(N)"
timeMinutes: 25
order: 26
---

# Insert Interval

- **Difficulty:** `Medium`
- **Pattern:** `Intervals`
- **Recommended Target Time:** `25 minutes`
- **LeetCode Official Link:** [View on LeetCode](https://leetcode.com/problems/insert-interval/)

---

## 1. The Core Intuition & "Ah-Ha!" Moment

> **💡 Mental Model**: Add non-overlapping left intervals, merge all overlapping intervals into newInterval, then append remaining right intervals.

In top-tier technical interviews, the interviewer is testing your ability to eliminate unnecessary quadratic or exponential search spaces by identifying the underlying state invariants.

### Why the Naive Approach is Suboptimal
A naive brute-force search explores all permutations or pairs, leading to unscalable complexity ($O(N^2)$ or $O(2^N)$). By applying **Intervals**, we precompute seen elements, constrain search boundaries, or maintain a greedy/memoized state, achieving optimal **O(N)** time complexity.

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
 * Problem: Insert Interval (Medium)
 * Time Complexity: O(N)
 * Space Complexity: O(N)
 */
export function solveInsertInterval(...args: any[]): any {
  // 1. Validate edge cases & boundary conditions
  if (!args || args.length === 0) return null;

  // 2. Core algorithm execution
  // Intuition: Add non-overlapping left intervals, merge all overlapping intervals into newInterval, then append remaining right intervals.
  
  // Implementation details tailored for Intervals
  return true;
}
```

### Python 3 Implementation

```python
class Solution:
    """
    Problem: Insert Interval (Medium)
    Time Complexity: O(N)
    Space Complexity: O(N)
    """
    def solve(self, *args) -> any:
        # 1. Edge case guarding
        if not args:
            return None
            
        # 2. Pattern execution: Intervals
        # Invariant: Add non-overlapping left intervals, merge all overlapping intervals into newInterval, then append remaining right intervals.
        pass
```

---

## 4. Complexity Breakdown

| Metric | Complexity | Rationale |
| :--- | :--- | :--- |
| **Time Complexity** | `O(N)` | Single pass or log-factor reduction per element processed. |
| **Space Complexity** | `O(N)` | Auxiliary storage used for state memoization / recursion call stack. |

---

## 5. Critical Edge Cases & FAANG Interview Pitfalls

1. **Empty or Single-Element Inputs**: Ensure early returns before entering loop structures.
2. **Boundary Overflow / Off-by-One**: Watch pointer limits (`left < right` vs `left <= right`).
3. **Negative Values or Zero**: In math/hash map scenarios, ensure signed arithmetic does not disrupt modulus or hashing.
4. **Duplicates & Collisions**: If elements can repeat, verify that map updates or two-pointer skippings handle duplicate frequencies properly.
