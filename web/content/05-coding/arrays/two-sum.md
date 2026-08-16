---
title: Two Sum
pattern: Arrays & Hashing
difficulty: Easy
leetcodeUrl: https://leetcode.com/problems/two-sum/
ahHaInsight: Use a Hash Map to store seen numbers and their indices; check if target - current exists in O(1).
timeComplexity: O(N)
spaceComplexity: O(N)
---

# Two Sum

## Problem Description
Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.
You may assume that each input would have exactly one solution, and you may not use the same element twice.

## Solution: Hash Map (One-Pass)
We can solve this in $O(N)$ time complexity by using a hash map to store the numbers we've seen so far and their indices. For each number, we check if its complement (`target - num`) is already in the map.

```typescript
function twoSum(nums: number[], target: number): number[] {
    const map = new Map<number, number>();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement)!, i];
        }
        
        map.set(nums[i], i);
    }
    
    throw new Error("No two sum solution found");
}
```

### Complexity
* **Time Complexity:** $O(N)$ — Single pass through the array with $O(1)$ map lookups.
* **Space Complexity:** $O(N)$ — Storing up to $N$ elements in the hash map.
