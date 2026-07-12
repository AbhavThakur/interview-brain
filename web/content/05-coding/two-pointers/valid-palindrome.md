---
title: Valid Palindrome
---

# Valid Palindrome

## Problem Description
A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string `s`, return `true` if it is a palindrome, or `false` otherwise.

## Solution: Two Pointers
We can use two pointers starting at the beginning and the end of the string, moving towards the middle. At each step, we skip non-alphanumeric characters.

```typescript
function isPalindrome(s: string): boolean {
    let left = 0;
    let right = s.length - 1;
    
    const isAlphanumeric = (char: string) => {
        const code = char.charCodeAt(0);
        return (code >= 48 && code <= 57) || // 0-9
               (code >= 97 && code <= 122) || // a-z
               (code >= 65 && code <= 90);   // A-Z
    };
    
    while (left < right) {
        while (left < right && !isAlphanumeric(s[left])) {
            left++;
        }
        while (left < right && !isAlphanumeric(s[right])) {
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
```

### Complexity
- **Time Complexity:** $O(N)$ — We traverse the string of length $N$ at most once.
- **Space Complexity:** $O(1)$ — Only constant extra space is used for pointers.
