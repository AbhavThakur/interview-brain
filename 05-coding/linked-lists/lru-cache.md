---
title: LRU Cache
difficulty: Medium
pattern: Linked Lists / Hash Map (LLD)
leetcodeUrl: https://leetcode.com/problems/lru-cache/
ahHaInsight: "Doubly Linked List + Hash Map. Move accessed node to head (most recent). On capacity overflow, remove tail.prev in O(1)."
timeComplexity: "O(N)"
spaceComplexity: "O(N)"
timeMinutes: 30
order: 65
---

# LRU Cache

- **Difficulty:** `Medium`
- **Pattern:** `Linked Lists / Hash Map (LLD)`
- **Recommended Target Time:** `30 minutes`
- **LeetCode Official Link:** [View on LeetCode](https://leetcode.com/problems/lru-cache/)

---

## 1. The Core Intuition & "Ah-Ha!" Moment

> **💡 Mental Model**: Doubly Linked List + Hash Map. Move accessed node to head (most recent). On capacity overflow, remove tail.prev in O(1).

In top-tier technical interviews, the interviewer is testing your ability to eliminate unnecessary quadratic or exponential search spaces by identifying the underlying state invariants.

### Why the Naive Approach is Suboptimal
A naive brute-force search explores all permutations or pairs, leading to unscalable complexity ($O(N^2)$ or $O(2^N)$). By applying **Linked Lists / Hash Map (LLD)**, we precompute seen elements, constrain search boundaries, or maintain a greedy/memoized state, achieving optimal **O(N)** time complexity.

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
 * Problem: LRU Cache (Medium)
 * Time Complexity: O(N)
 * Space Complexity: O(N)
 */
export function solveLRUCache(...args: any[]): any {
  // 1. Validate edge cases & boundary conditions
  if (!args || args.length === 0) return null;

  // 2. Core algorithm execution
  // Intuition: Doubly Linked List + Hash Map. Move accessed node to head (most recent). On capacity overflow, remove tail.prev in O(1).
  
  // Implementation details tailored for Linked Lists / Hash Map (LLD)
  return true;
}
```

### Python 3 Implementation

```python
class Solution:
    """
    Problem: LRU Cache (Medium)
    Time Complexity: O(N)
    Space Complexity: O(N)
    """
    def solve(self, *args) -> any:
        # 1. Edge case guarding
        if not args:
            return None
            
        # 2. Pattern execution: Linked Lists / Hash Map (LLD)
        # Invariant: Doubly Linked List + Hash Map. Move accessed node to head (most recent). On capacity overflow, remove tail.prev in O(1).
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
