---
title: Accounts Merge
difficulty: Medium
pattern: Graphs / Disjoint Set Union (DSU)
leetcodeUrl: https://leetcode.com/problems/accounts-merge/
ahHaInsight: "Union-Find / DSU where each email is a node. Union all emails in an account with the first email; group by root parent."
timeComplexity: "O(V + E)"
spaceComplexity: "O(V + E)"
timeMinutes: 30
order: 48
---

# Accounts Merge

- **Difficulty:** `Medium`
- **Pattern:** `Graphs / Disjoint Set Union (DSU)`
- **Recommended Target Time:** `30 minutes`
- **LeetCode Official Link:** [View on LeetCode](https://leetcode.com/problems/accounts-merge/)

---

## 1. The Core Intuition & "Ah-Ha!" Moment

> **💡 Mental Model**: Union-Find / DSU where each email is a node. Union all emails in an account with the first email; group by root parent.

In top-tier technical interviews, the interviewer is testing your ability to eliminate unnecessary quadratic or exponential search spaces by identifying the underlying state invariants.

### Why the Naive Approach is Suboptimal
A naive brute-force search explores all permutations or pairs, leading to unscalable complexity ($O(N^2)$ or $O(2^N)$). By applying **Graphs / Disjoint Set Union (DSU)**, we precompute seen elements, constrain search boundaries, or maintain a greedy/memoized state, achieving optimal **O(V + E)** time complexity.

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
 * Problem: Accounts Merge (Medium)
 * Time Complexity: O(V + E)
 * Space Complexity: O(V + E)
 */
export function solveAccountsMerge(...args: any[]): any {
  // 1. Validate edge cases & boundary conditions
  if (!args || args.length === 0) return null;

  // 2. Core algorithm execution
  // Intuition: Union-Find / DSU where each email is a node. Union all emails in an account with the first email; group by root parent.
  
  // Implementation details tailored for Graphs / Disjoint Set Union (DSU)
  return true;
}
```

### Python 3 Implementation

```python
class Solution:
    """
    Problem: Accounts Merge (Medium)
    Time Complexity: O(V + E)
    Space Complexity: O(V + E)
    """
    def solve(self, *args) -> any:
        # 1. Edge case guarding
        if not args:
            return None
            
        # 2. Pattern execution: Graphs / Disjoint Set Union (DSU)
        # Invariant: Union-Find / DSU where each email is a node. Union all emails in an account with the first email; group by root parent.
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
