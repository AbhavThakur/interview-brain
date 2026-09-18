---
title: In-Memory Key-Value Store with ACID Transactions (LLD)
category: low-level-design
difficulty: Senior
tags: [LLD, Machine Coding, Transactions, Rollback, Key-Value, Concurrency, Clean Code]
---

# In-Memory Key-Value Store with ACID Transactions (LLD)

Implement a robust in-memory key-value data store with nested transaction support (`BEGIN`, `COMMIT`, `ROLLBACK`), TTL expiration, and thread-safe operations. A classic Senior SDE Machine Coding interview round (PhonePe, Flipkart, Uber).

---

## 1. Requirements & API Contract

1. `set(key: string, value: string, ttlSeconds?: number): void`
2. `get(key: string): string | null`
3. `delete(key: string): boolean`
4. `begin(): number` — Starts a new transaction context. Supports nesting.
5. `commit(): boolean` — Persists current transaction changes to parent/global store. Returns false if no transaction active.
6. `rollback(): boolean` — Discards changes made in current transaction scope.

---

## 2. Complete TypeScript Implementation

```typescript
interface StoreEntry {
  value: string;
  expiresAt: number | null;
}

export class TransactionalKVStore {
  private globalStore = new Map<string, StoreEntry>();
  // Stack of active transaction change sets
  // A value of null indicates the key was deleted within this transaction
  private transactionStack: Array<Map<string, StoreEntry | null>> = [];

  public set(key: string, value: string, ttlSeconds?: number): void {
    const entry: StoreEntry = {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
    };

    if (this.transactionStack.length > 0) {
      // Record mutation in topmost transaction
      const currentTx = this.transactionStack[this.transactionStack.length - 1];
      currentTx.set(key, entry);
    } else {
      this.globalStore.set(key, entry);
    }
  }

  public get(key: string): string | null {
    // 1. Search topmost active transaction down to innermost
    for (let i = this.transactionStack.length - 1; i >= 0; i--) {
      const tx = this.transactionStack[i];
      if (tx.has(key)) {
        const entry = tx.get(key);
        if (entry === null) return null; // Marked as deleted in transaction
        if (entry.expiresAt && Date.now() > entry.expiresAt) {
          tx.set(key, null);
          return null;
        }
        return entry.value;
      }
    }

    // 2. Check global baseline store
    const globalEntry = this.globalStore.get(key);
    if (!globalEntry) return null;

    if (globalEntry.expiresAt && Date.now() > globalEntry.expiresAt) {
      this.globalStore.delete(key);
      return null;
    }

    return globalEntry.value;
  }

  public delete(key: string): boolean {
    if (this.get(key) === null) return false;

    if (this.transactionStack.length > 0) {
      const currentTx = this.transactionStack[this.transactionStack.length - 1];
      currentTx.set(key, null); // Tombstone marker
    } else {
      this.globalStore.delete(key);
    }
    return true;
  }

  public begin(): number {
    this.transactionStack.push(new Map());
    return this.transactionStack.length;
  }

  public commit(): boolean {
    if (this.transactionStack.length === 0) return false;

    const currentTx = this.transactionStack.pop()!;
    
    if (this.transactionStack.length > 0) {
      // Merge into parent transaction
      const parentTx = this.transactionStack[this.transactionStack.length - 1];
      for (const [k, v] of currentTx.entries()) {
        parentTx.set(k, v);
      }
    } else {
      // Commit directly into global store
      for (const [k, v] of currentTx.entries()) {
        if (v === null) {
          this.globalStore.delete(k);
        } else {
          this.globalStore.set(k, v);
        }
      }
    }
    return true;
  }

  public rollback(): boolean {
    if (this.transactionStack.length === 0) return false;
    this.transactionStack.pop();
    return true;
  }
}
```

---

## 3. Complexity & Invariants
- **`get` / `set`**: $O(K)$ where $K$ is nesting depth of transactions (typically $K \le 5$, effectively $O(1)$).
- **`commit`**: $O(M)$ where $M$ is number of modified keys in that transaction scope.
- **`rollback`**: $O(1)$ stack pop! Discards all staged deltas in constant time.
