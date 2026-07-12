---
title: Reverse Linked List
---

# Reverse Linked List

## Problem Description
Given the `head` of a singly linked list, reverse the list, and return *the reversed list*.

## Solution: Iterative
We traverse the list, keeping track of the `prev` node, `current` node, and `next` node. At each step, we update `current.next` to point to `prev`.

```typescript
class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val===undefined ? 0 : val);
        this.next = (next===undefined ? null : next);
    }
}

function reverseList(head: ListNode | null): ListNode | null {
    let prev: ListNode | null = null;
    let current = head;
    
    while (current !== null) {
        const nextTemp = current.next;
        current.next = prev;
        prev = current;
        current = nextTemp;
    }
    
    return prev;
}
```

### Complexity
- **Time Complexity:** $O(N)$ — We visit each node in the list exactly once.
- **Space Complexity:** $O(1)$ — We only use reference pointers, requiring no additional allocation.
