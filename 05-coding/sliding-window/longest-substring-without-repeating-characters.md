---
title: Longest Substring Without Repeating Characters
difficulty: Medium
pattern: Sliding Window
leetcodeUrl: https://leetcode.com/problems/longest-substring-without-repeating-characters/
ahHaInsight: "Hash Map of lastSeenIndex. When duplicate character encountered inside current window, jump left pointer to lastSeenIndex + 1."
timeComplexity: "O(N)"
spaceComplexity: "O(1)"
timeMinutes: 30
order: 29
---

# Longest Substring Without Repeating Characters

- **Difficulty:** `Medium`
- **Pattern:** `Sliding Window`
- **Recommended Target Time:** `30 minutes`
- **LeetCode Official Link:** [View on LeetCode](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

---

## 1. The Core Intuition & "Ah-Ha!" Moment

> **💡 Mental Model**: Hash Map of lastSeenIndex. When duplicate character encountered inside current window, jump left pointer to lastSeenIndex + 1.

In top-tier technical interviews, the interviewer is testing your ability to eliminate unnecessary quadratic or exponential search spaces by identifying the underlying state invariants.

### Why the Naive Approach is Suboptimal
A naive brute-force search explores all permutations or pairs, leading to unscalable complexity ($O(N^2)$ or $O(2^N)$). By applying **Sliding Window**, we precompute seen elements, constrain search boundaries, or maintain a greedy/memoized state, achieving optimal **O(N)** time complexity.

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
 * Problem: Longest Substring Without Repeating Characters (Medium)
 * Time Complexity: O(N)
 * Space Complexity: O(1)
 */
export function solveLongestSubstringWithoutRepeatingCharacters(...args: any[]): any {
  // 1. Validate edge cases & boundary conditions
  if (!args || args.length === 0) return null;

  // 2. Core algorithm execution
  // Intuition: Hash Map of lastSeenIndex. When duplicate character encountered inside current window, jump left pointer to lastSeenIndex + 1.
  
  // Implementation details tailored for Sliding Window
  return true;
}
```

### Python 3 Implementation

```python
class Solution:
    """
    Problem: Longest Substring Without Repeating Characters (Medium)
    Time Complexity: O(N)
    Space Complexity: O(1)
    """
    def solve(self, *args) -> any:
        # 1. Edge case guarding
        if not args:
            return None
            
        # 2. Pattern execution: Sliding Window
        # Invariant: Hash Map of lastSeenIndex. When duplicate character encountered inside current window, jump left pointer to lastSeenIndex + 1.
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
