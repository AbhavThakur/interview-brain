---
title: Reverse Linked List
pattern: Linked Lists
difficulty: Easy
leetcodeUrl: https://leetcode.com/problems/reverse-linked-list/
ahHaInsight: Iterate with 3 pointers (prev, curr, nextTemp); point curr.next to prev, then advance both pointers.
timeComplexity: O(N)
spaceComplexity: O(1)
---

# Reverse Linked List

## Problem Description
Given the `head` of a singly linked list, reverse the list, and return the reversed list.

## Solution: Iterative In-Place Pointer Swap

```typescript
class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val === undefined ? 0 : val);
        this.next = (next === undefined ? null : next);
    }
}

function reverseList(head: ListNode | null): ListNode | null {
    let prev: ListNode | null = null;
    let curr = head;

    while (curr !== null) {
        const nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }

    return prev;
}
```

### Complexity
* **Time Complexity:** $O(N)$ — Single pass through all nodes.
* **Space Complexity:** $O(1)$ — In-place pointer reversal without extra nodes.
