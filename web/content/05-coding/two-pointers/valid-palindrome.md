---
title: Valid Palindrome
pattern: Two Pointers
difficulty: Easy
leetcodeUrl: https://leetcode.com/problems/valid-palindrome/
ahHaInsight: Two pointers moving inward from both ends; skip non-alphanumeric characters and compare lowercase.
timeComplexity: O(N)
spaceComplexity: O(1)
---

# Valid Palindrome

## Problem Description
A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string `s`, return `true` if it is a palindrome, or `false` otherwise.

## Solution: Two Pointers Inward

```typescript
function isPalindrome(s: string): boolean {
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
        while (left < right && !isAlphaNumeric(s[left])) {
            left++;
        }
        while (left < right && !isAlphaNumeric(s[right])) {
            right--;
        }
        
        if (s[left].toLowerCase() !== s[right].toLowerCase()) {
            return false;
        }
        
        left++;
        right--;
    }
    
    return true;
}

function isAlphaNumeric(char: string): boolean {
    const code = char.charCodeAt(0);
    return (code >= 48 && code <= 57) || // 0-9
           (code >= 65 && code <= 90) || // A-Z
           (code >= 97 && code <= 122);  // a-z
}
```

### Complexity
* **Time Complexity:** $O(N)$ — Single pass inward with two pointers.
* **Space Complexity:** $O(1)$ — In-place pointer manipulation without allocating extra strings.
