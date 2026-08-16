---
title: Invert Binary Tree
pattern: Trees (DFS / Recursion)
difficulty: Easy
leetcodeUrl: https://leetcode.com/problems/invert-binary-tree/
ahHaInsight: Recursively swap left and right child pointers for each node (post-order or pre-order DFS).
timeComplexity: O(N)
spaceComplexity: O(H)
---

# Invert Binary Tree

## Problem Description
Given the `root` of a binary tree, invert the tree, and return its root.

## Solution: Recursive DFS

```typescript
class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = (val === undefined ? 0 : val);
        this.left = (left === undefined ? null : left);
        this.right = (right === undefined ? null : right);
    }
}

function invertTree(root: TreeNode | null): TreeNode | null {
    if (!root) return null;

    const temp = root.left;
    root.left = invertTree(root.right);
    root.right = invertTree(temp);

    return root;
}
```

### Complexity
* **Time Complexity:** $O(N)$ — Visit every node in the binary tree exactly once.
* **Space Complexity:** $O(H)$ — Recursion call stack proportional to tree height $H$ ($O(\log N)$ balanced, $O(N)$ worst-case degenerate tree).
