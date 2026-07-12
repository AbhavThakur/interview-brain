---
title: Coin Change
---

# Coin Change

## Problem Description
You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.

Return *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return `-1`.

You may assume that you have an infinite number of each kind of coin.

## Solution: Dynamic Programming (Bottom-Up)
Let `dp[i]` be the minimum number of coins needed to make amount `i`.
For each amount `i` from 1 to `amount`, and for each coin value `c`, we have:
`dp[i] = min(dp[i], dp[i - c] + 1)`

```typescript
function coinChange(coins: number[], amount: number): number {
    const dp = new Array(amount + 1).fill(amount + 1);
    dp[0] = 0;
    
    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            if (i - coin >= 0) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    
    return dp[amount] > amount ? -1 : dp[amount];
}
```

### Complexity
- **Time Complexity:** $O(S \times N)$ — Where $S$ is the amount and $N$ is the number of coin denominations.
- **Space Complexity:** $O(S)$ — We use an array of size `amount + 1`.
