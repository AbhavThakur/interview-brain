---
title: Longest Substring Without Repeating Characters
pattern: Sliding Window
difficulty: Medium
leetcodeUrl: https://leetcode.com/problems/longest-substring-without-repeating-characters/
ahHaInsight: Maintain dynamic window [left, right]; when duplicate char is seen, jump left pointer to last seen index + 1.
timeComplexity: O(N)
spaceComplexity: O(min(N, M))
---

# Longest Substring Without Repeating Characters

## Problem Description
Given a string `s`, find the length of the longest substring without repeating characters.

## Solution: Dynamic Sliding Window + Last Seen Map

```typescript
function lengthOfLongestSubstring(s: string): number {
    let maxLength = 0;
    let left = 0;
    const lastSeen = new Map<string, number>();

    for (let right = 0; right < s.length; right++) {
        const char = s[right];

        if (lastSeen.has(char) && lastSeen.get(char)! >= left) {
            left = lastSeen.get(char)! + 1;
        }

        lastSeen.set(char, right);
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}
```

### Complexity
* **Time Complexity:** $O(N)$ — `right` pointer traverses the string once; `left` pointer jumps forward deterministically.
* **Space Complexity:** $O(\min(N, M))$ where $M$ is the size of the character set (at most 128 for ASCII).
