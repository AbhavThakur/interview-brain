---
title: Container With Most Water
pattern: Two Pointers
difficulty: Medium
leetcodeUrl: https://leetcode.com/problems/container-with-most-water/
ahHaInsight: Start with widest boundary (left = 0, right = n-1); always move the pointer with the shorter height inward.
timeComplexity: O(N)
spaceComplexity: O(1)
---

# Container With Most Water

## Problem Description
You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the $i$-th line are `(i, 0)` and `(i, height[i])`.

Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.

## Solution: Greedy Two Pointers

```typescript
function maxArea(height: number[]): number {
    let left = 0;
    let right = height.length - 1;
    let maxWater = 0;

    while (left < right) {
        const width = right - left;
        const currentHeight = Math.min(height[left], height[right]);
        const currentWater = width * currentHeight;

        maxWater = Math.max(maxWater, currentWater);

        // Move the shorter wall inward (greedy choice)
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }

    return maxWater;
}
```

### Complexity
* **Time Complexity:** $O(N)$ — Single pass inward with two pointers.
* **Space Complexity:** $O(1)$ — Constant extra space.
