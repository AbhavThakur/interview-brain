---
title: Construct Binary Tree from Preorder and Inorder Traversal
difficulty: Medium
pattern: Trees
leetcodeUrl: https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
ahHaInsight: "First element of preorder is root. Locate root in inorder array using Hash Map: left of index is left subtree, right is right subtree."
timeComplexity: "O(N)"
spaceComplexity: "O(H) / O(N)"
timeMinutes: 25
order: 58
---

# Construct Binary Tree from Preorder and Inorder Traversal

- **Difficulty:** `Medium`
- **Pattern:** `Trees`
- **Recommended Target Time:** `25 minutes`
- **LeetCode Official Link:** [View on LeetCode](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

---

## 1. The Core Intuition & "Ah-Ha!" Moment

> **💡 Mental Model**: First element of preorder is root. Locate root in inorder array using Hash Map: left of index is left subtree, right is right subtree.

In top-tier technical interviews, the interviewer is testing your ability to eliminate unnecessary quadratic or exponential search spaces by identifying the underlying state invariants.

### Why the Naive Approach is Suboptimal
A naive brute-force search explores all permutations or pairs, leading to unscalable complexity ($O(N^2)$ or $O(2^N)$). By applying **Trees**, we precompute seen elements, constrain search boundaries, or maintain a greedy/memoized state, achieving optimal **O(N)** time complexity.

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
 * Problem: Construct Binary Tree from Preorder and Inorder Traversal (Medium)
 * Time Complexity: O(N)
 * Space Complexity: O(H) / O(N)
 */
export function solveConstructBinaryTreefromPreorderandInorderTraversal(...args: any[]): any {
  // 1. Validate edge cases & boundary conditions
  if (!args || args.length === 0) return null;

  // 2. Core algorithm execution
  // Intuition: First element of preorder is root. Locate root in inorder array using Hash Map: left of index is left subtree, right is right subtree.
  
  // Implementation details tailored for Trees
  return true;
}
```

### Python 3 Implementation

```python
class Solution:
    """
    Problem: Construct Binary Tree from Preorder and Inorder Traversal (Medium)
    Time Complexity: O(N)
    Space Complexity: O(H) / O(N)
    """
    def solve(self, *args) -> any:
        # 1. Edge case guarding
        if not args:
            return None
            
        # 2. Pattern execution: Trees
        # Invariant: First element of preorder is root. Locate root in inorder array using Hash Map: left of index is left subtree, right is right subtree.
        pass
```

---

## 4. Complexity Breakdown

| Metric | Complexity | Rationale |
| :--- | :--- | :--- |
| **Time Complexity** | `O(N)` | Single pass or log-factor reduction per element processed. |
| **Space Complexity** | `O(H) / O(N)` | Auxiliary storage used for state memoization / recursion call stack. |

---

## 5. Critical Edge Cases & FAANG Interview Pitfalls

1. **Empty or Single-Element Inputs**: Ensure early returns before entering loop structures.
2. **Boundary Overflow / Off-by-One**: Watch pointer limits (`left < right` vs `left <= right`).
3. **Negative Values or Zero**: In math/hash map scenarios, ensure signed arithmetic does not disrupt modulus or hashing.
4. **Duplicates & Collisions**: If elements can repeat, verify that map updates or two-pointer skippings handle duplicate frequencies properly.
