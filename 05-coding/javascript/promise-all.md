---
title: Promise.all Polyfill Implementation
pattern: JavaScript Polyfills
difficulty: Medium
leetcodeUrl: https://bigfrontend.dev/problem/implement-Promise-all
ahHaInsight: Return a new Promise; maintain resolved counter and result array; reject immediately on first rejection.
timeComplexity: O(N)
spaceComplexity: O(N)
---

# Promise.all Polyfill Implementation

## Problem Description
Implement your own custom version of `Promise.all(iterable)` which accepts an iterable of promises (or plain values) and returns a single Promise that resolves to an array of the results when all input promises have resolved, or rejects immediately with the first error.

## Solution

```typescript
function promiseAll<T>(iterable: (T | Promise<T>)[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
        const results: T[] = [];
        let completedCount = 0;
        const total = iterable.length;

        if (total === 0) {
            return resolve([]);
        }

        iterable.forEach((item, index) => {
            // Wrap in Promise.resolve to handle primitive/non-promise items
            Promise.resolve(item)
                .then((val) => {
                    results[index] = val; // preserve original index order
                    completedCount++;

                    if (completedCount === total) {
                        resolve(results);
                    }
                })
                .catch((err) => {
                    reject(err); // Fast-fail on first rejection
                });
        });
    });
}
```

### Key Corner Cases to Address in Interview
1. **Empty input array `[]`:** Must resolve immediately to `[]`.
2. **Non-promise values in input:** Must wrap every element with `Promise.resolve(item)` to support primitives like `[1, 2, Promise.resolve(3)]`.
3. **Preserving Order:** Must store results at `results[index]` rather than `results.push(val)` because async promises resolve out of order.
