---
title: Invert Binary Tree
---

# Invert Binary Tree

## Problem Description
Given the `root` of a binary tree, invert the tree, and return *its root*.

## Solution: DFS (Recursive)
We recursively invert the left and right subtrees and swap their positions.

```typescript
class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = (val===undefined ? 0 : val);
        this.left = (left===undefined ? null : left);
        this.right = (right===undefined ? null : right);
    }
}

function invertTree(root: TreeNode | null): TreeNode | null {
    if (root === null) return null;
    
    const temp = root.left;
    root.left = invertTree(root.right);
    root.right = invertTree(temp);
    
    return root;
}
```

### Complexity
- **Time Complexity:** $O(N)$ — We visit each node in the tree exactly once.
- **Space Complexity:** $O(H)$ — The space is occupied by the recursion stack, which matches the height $H$ of the binary tree.
