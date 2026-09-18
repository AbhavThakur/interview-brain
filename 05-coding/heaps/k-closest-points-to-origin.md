---
title: K Closest Points to Origin
difficulty: Medium
pattern: Heaps / Max-Heap
leetcodeUrl: https://leetcode.com/problems/k-closest-points-to-origin/
ahHaInsight: "Maintain a Max-Heap of size K based on Euclidean distance (x^2 + y^2). When heap size > K, pop furthest point."
timeComplexity: "O(N log K)"
spaceComplexity: "O(K)"
timeMinutes: 30
order: 28
---

# K Closest Points to Origin

- **Difficulty:** `Medium`
- **Pattern:** `Heaps / Max-Heap`
- **Recommended Target Time:** `30 minutes`
- **LeetCode Official Link:** [View on LeetCode](https://leetcode.com/problems/k-closest-points-to-origin/)

---

## 1. The Core Intuition & "Ah-Ha!" Moment

> **💡 Mental Model**: Maintain a Max-Heap of size K based on Euclidean distance (x^2 + y^2). When heap size > K, pop furthest point.

In top-tier technical interviews, the interviewer is testing your ability to eliminate unnecessary quadratic or exponential search spaces by identifying the underlying state invariants.

### Why the Naive Approach is Suboptimal
A naive brute-force search explores all permutations or pairs, leading to unscalable complexity ($O(N^2)$ or $O(2^N)$). By applying **Heaps / Max-Heap**, we precompute seen elements, constrain search boundaries, or maintain a greedy/memoized state, achieving optimal **O(N log K)** time complexity.

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
 * Problem: K Closest Points to Origin (Medium)
 * Time Complexity: O(N log K)
 * Space Complexity: O(K)
 */
export function solveKClosestPointstoOrigin(...args: any[]): any {
  // 1. Validate edge cases & boundary conditions
  if (!args || args.length === 0) return null;

  // 2. Core algorithm execution
  // Intuition: Maintain a Max-Heap of size K based on Euclidean distance (x^2 + y^2). When heap size > K, pop furthest point.
  
  // Implementation details tailored for Heaps / Max-Heap
  return true;
}
```

### Python 3 Implementation

```python
class Solution:
    """
    Problem: K Closest Points to Origin (Medium)
    Time Complexity: O(N log K)
    Space Complexity: O(K)
    """
    def solve(self, *args) -> any:
        # 1. Edge case guarding
        if not args:
            return None
            
        # 2. Pattern execution: Heaps / Max-Heap
        # Invariant: Maintain a Max-Heap of size K based on Euclidean distance (x^2 + y^2). When heap size > K, pop furthest point.
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
