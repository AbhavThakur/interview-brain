---
title: Longest Substring Without Repeating Characters
---

# Longest Substring Without Repeating Characters

## Problem Description
Given a string `s`, find the length of the longest substring without repeating characters.

## Solution: Sliding Window (Set/Map)
We maintain a sliding window `[left, right]`. As we expand the window to the right, we check if the character is already in our set of unique characters. If it is, we shrink the window from the left until the duplicate character is removed.

```typescript
function lengthOfLongestSubstring(s: string): number {
    const charSet = new Set<string>();
    let left = 0;
    let maxLength = 0;
    
    for (let right = 0; right < s.length; right++) {
        while (charSet.has(s[right])) {
            charSet.delete(s[left]);
            left++;
        }
        
        charSet.add(s[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}
```

### Complexity
- **Time Complexity:** $O(N)$ — Each character is visited at most twice (once by `right`, once by `left`).
- **Space Complexity:** $O(min(M, N))$ — We need $O(K)$ space where $K$ is the size of the alphabet/unique characters.
