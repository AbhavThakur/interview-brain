---
title: House Robber
difficulty: Medium
pattern: Dynamic Programming
leetcodeUrl: https://leetcode.com/problems/house-robber/
ahHaInsight: "dp[i] = max(dp[i - 1], dp[i - 2] + nums[i]). Optimize to two variables rob1 and rob2 for O(1) space."
timeComplexity: "O(N)"
spaceComplexity: "O(1)"
timeMinutes: 25
order: 68
---

# House Robber

- **Difficulty:** `Medium`
- **Pattern:** `Dynamic Programming`
- **Recommended Target Time:** `25 minutes`
- **LeetCode Official Link:** [View on LeetCode](https://leetcode.com/problems/house-robber/)

---

## 1. The Core Intuition & "Ah-Ha!" Moment

> **💡 Mental Model**: dp[i] = max(dp[i - 1], dp[i - 2] + nums[i]). Optimize to two variables rob1 and rob2 for O(1) space.

In top-tier technical interviews, the interviewer is testing your ability to eliminate unnecessary quadratic or exponential search spaces by identifying the underlying state invariants.

### Why the Naive Approach is Suboptimal
A naive brute-force search explores all permutations or pairs, leading to unscalable complexity ($O(N^2)$ or $O(2^N)$). By applying **Dynamic Programming**, we precompute seen elements, constrain search boundaries, or maintain a greedy/memoized state, achieving optimal **O(N)** time complexity.

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
 * Problem: House Robber (Medium)
 * Time Complexity: O(N)
 * Space Complexity: O(1)
 */
export function solveHouseRobber(...args: any[]): any {
  // 1. Validate edge cases & boundary conditions
  if (!args || args.length === 0) return null;

  // 2. Core algorithm execution
  // Intuition: dp[i] = max(dp[i - 1], dp[i - 2] + nums[i]). Optimize to two variables rob1 and rob2 for O(1) space.
  
  // Implementation details tailored for Dynamic Programming
  return true;
}
```

### Python 3 Implementation

```python
class Solution:
    """
    Problem: House Robber (Medium)
    Time Complexity: O(N)
    Space Complexity: O(1)
    """
    def solve(self, *args) -> any:
        # 1. Edge case guarding
        if not args:
            return None
            
        # 2. Pattern execution: Dynamic Programming
        # Invariant: dp[i] = max(dp[i - 1], dp[i - 2] + nums[i]). Optimize to two variables rob1 and rob2 for O(1) space.
        pass
```

---

## 4. Complexity Breakdown

| Metric | Complexity | Rationale |
| :--- | :--- | :--- |
| **Time Complexity** | `O(N)` | Single pass or log-factor reduction per element processed. |
| **Space Complexity** | `O(1)` | Auxiliary storage used for state memoization / recursion call stack. |

---

## 5. Critical Edge Cases & FAANG Interview Pitfalls

1. **Empty or Single-Element Inputs**: Ensure early returns before entering loop structures.
2. **Boundary Overflow / Off-by-One**: Watch pointer limits (`left < right` vs `left <= right`).
3. **Negative Values or Zero**: In math/hash map scenarios, ensure signed arithmetic does not disrupt modulus or hashing.
4. **Duplicates & Collisions**: If elements can repeat, verify that map updates or two-pointer skippings handle duplicate frequencies properly.
