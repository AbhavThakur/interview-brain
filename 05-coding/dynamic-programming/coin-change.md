---
title: Coin Change
pattern: Dynamic Programming
difficulty: Medium
leetcodeUrl: https://leetcode.com/problems/coin-change/
ahHaInsight: Bottom-up DP where dp[i] = min coins to make amount i; transition is dp[i] = min(dp[i], dp[i - coin] + 1).
timeComplexity: O(amount * len(coins))
spaceComplexity: O(amount)
---

# Coin Change

## Problem Description
You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.
Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.

## Solution: Bottom-Up Dynamic Programming

```typescript
function coinChange(coins: number[], amount: number): number {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0; // 0 coins needed for 0 amount

    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            if (i - coin >= 0) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }

    return dp[amount] === Infinity ? -1 : dp[amount];
}
```

### Complexity
* **Time Complexity:** $O(A \times C)$ where $A$ is the amount and $C$ is the number of coin denominations.
* **Space Complexity:** $O(A)$ for the DP array holding values up to `amount`.
