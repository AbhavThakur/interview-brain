/**
 * Ingestion script for trekhleb/javascript-algorithms
 * Curates 32 core data structures and classic algorithms into clean,
 * standalone, executable JavaScript modules with test cases and theory.
 */

const fs = require('fs');
const path = require('path');

const CLONE_DIR = '/tmp/trekhleb';
const OUT_FILE = path.join(__dirname, '..', 'classic-algorithms.json');
const WEB_OUT_FILE = path.join(__dirname, '..', 'web', 'content', 'classic-algorithms.json');

if (!fs.existsSync(CLONE_DIR)) {
  console.error(`Clone dir ${CLONE_DIR} does not exist. Please clone trekhleb/javascript-algorithms first.`);
  process.exit(1);
}

function cleanReadme(content) {
  if (!content) return '';
  // Remove language links
  let cleaned = content.replace(/_Read this in other languages:_[\s\S]*?(?=\n\n[A-Z#])/i, '');
  // Remove markdown images that point to local files
  cleaned = cleaned.replace(/!\[.*?\]\((?!(?:https?:\/\/)).*?\)/g, '');
  // Remove trailing references/links block if too long
  return cleaned.trim();
}

const classicAlgorithms = [
  // --- DATA STRUCTURES ---
  {
    id: 'lru-cache',
    title: 'LRU Cache (Least Recently Used)',
    category: 'Data Structures',
    difficulty: 'Medium',
    readmePath: 'src/data-structures/lru-cache/README.md',
    timeComplexity: 'O(1) get & put',
    spaceComplexity: 'O(capacity)',
    entryFunction: 'LRUCache',
    code: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }
}`,
    starterCode: `/**
 * @param {number} capacity
 */
class LRUCache {
  constructor(capacity) {
    // Initialize capacity and storage
  }

  /** 
   * @param {number} key
   * @return {number}
   */
  get(key) {
    // Return value or -1 if not found
  }

  /** 
   * @param {number} key 
   * @param {number} value
   * @return {void}
   */
  put(key, value) {
    // Update or insert key-value pair, evicting LRU item if capacity exceeded
  }
}`,
    testCases: [
      {
        input: `(function() {
  const lru = new LRUCache(2);
  lru.put(1, 1);
  lru.put(2, 2);
  const r1 = lru.get(1); // returns 1
  lru.put(3, 3); // evicts key 2
  const r2 = lru.get(2); // returns -1
  lru.put(4, 4); // evicts key 1
  const r3 = lru.get(1); // returns -1
  const r4 = lru.get(3); // returns 3
  const r5 = lru.get(4); // returns 4
  return [r1, r2, r3, r4, r5];
})()`,
        expectedOutput: `[1, -1, -1, 3, 4]`,
        description: 'Basic Put, Get & LRU Eviction'
      }
    ]
  },
  {
    id: 'trie',
    title: 'Trie (Prefix Tree)',
    category: 'Data Structures',
    difficulty: 'Medium',
    readmePath: 'src/data-structures/trie/README.md',
    timeComplexity: 'O(k) where k is word length',
    spaceComplexity: 'O(total characters)',
    entryFunction: 'Trie',
    code: `class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children[char]) {
        curr.children[char] = new TrieNode();
      }
      curr = curr.children[char];
    }
    curr.isEndOfWord = true;
  }

  search(word) {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children[char]) return false;
      curr = curr.children[char];
    }
    return curr.isEndOfWord;
  }

  startsWith(prefix) {
    let curr = this.root;
    for (const char of prefix) {
      if (!curr.children[char]) return false;
      curr = curr.children[char];
    }
    return true;
  }
}`,
    starterCode: `class Trie {
  constructor() {
    // Initialize root node
  }

  insert(word) {
    // Insert word into trie
  }

  search(word) {
    // Return true if word is in trie
  }

  startsWith(prefix) {
    // Return true if any word starts with prefix
  }
}`,
    testCases: [
      {
        input: `(function() {
  const trie = new Trie();
  trie.insert("apple");
  const s1 = trie.search("apple");   // true
  const s2 = trie.search("app");     // false
  const s3 = trie.startsWith("app"); // true
  trie.insert("app");
  const s4 = trie.search("app");     // true
  return [s1, s2, s3, s4];
})()`,
        expectedOutput: `[true, false, true, true]`,
        description: 'Insert, Search and StartsWith'
      }
    ]
  },
  {
    id: 'min-heap',
    title: 'Min Binary Heap',
    category: 'Data Structures',
    difficulty: 'Medium',
    readmePath: 'src/data-structures/heap/README.md',
    timeComplexity: 'O(log n) insert/poll, O(1) peek',
    spaceComplexity: 'O(n)',
    entryFunction: 'MinHeap',
    code: `class MinHeap {
  constructor() {
    this.heap = [];
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  poll() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    const item = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown();
    return item;
  }

  add(item) {
    this.heap.push(item);
    this.heapifyUp();
  }

  heapifyUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex] <= this.heap[index]) break;
      [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
      index = parentIndex;
    }
  }

  heapifyDown() {
    let index = 0;
    while (index * 2 + 1 < this.heap.length) {
      let smallerChildIndex = index * 2 + 1;
      const rightChildIndex = index * 2 + 2;
      if (rightChildIndex < this.heap.length && this.heap[rightChildIndex] < this.heap[smallerChildIndex]) {
        smallerChildIndex = rightChildIndex;
      }
      if (this.heap[index] <= this.heap[smallerChildIndex]) break;
      [this.heap[index], this.heap[smallerChildIndex]] = [this.heap[smallerChildIndex], this.heap[index]];
      index = smallerChildIndex;
    }
  }
}`,
    starterCode: `class MinHeap {
  constructor() {
    this.heap = [];
  }

  peek() {
    // Return root without removing
  }

  poll() {
    // Remove and return root
  }

  add(item) {
    // Add item and maintain heap invariant
  }
}`,
    testCases: [
      {
        input: `(function() {
  const h = new MinHeap();
  [5, 3, 10, 1, 4].forEach(n => h.add(n));
  const p1 = h.peek(); // 1
  const sorted = [];
  while (h.peek() !== null) {
    sorted.push(h.poll());
  }
  return { min: p1, sorted };
})()`,
        expectedOutput: `{"min": 1, "sorted": [1, 3, 4, 5, 10]}`,
        description: 'Add items and extract in ascending order'
      }
    ]
  },
  {
    id: 'linked-list',
    title: 'Singly Linked List',
    category: 'Data Structures',
    difficulty: 'Easy',
    readmePath: 'src/data-structures/linked-list/README.md',
    timeComplexity: 'O(1) prepend, O(n) find/delete',
    spaceComplexity: 'O(n)',
    entryFunction: 'LinkedList',
    code: `class LinkedListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  prepend(value) {
    const newNode = new LinkedListNode(value, this.head);
    this.head = newNode;
    if (!this.tail) this.tail = newNode;
    return this;
  }

  append(value) {
    const newNode = new LinkedListNode(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      return this;
    }
    this.tail.next = newNode;
    this.tail = newNode;
    return this;
  }

  delete(value) {
    if (!this.head) return null;
    let deletedNode = null;
    while (this.head && this.head.value === value) {
      deletedNode = this.head;
      this.head = this.head.next;
    }
    let curr = this.head;
    if (curr !== null) {
      while (curr.next) {
        if (curr.next.value === value) {
          deletedNode = curr.next;
          curr.next = curr.next.next;
        } else {
          curr = curr.next;
        }
      }
    }
    if (this.tail && this.tail.value === value) {
      this.tail = curr;
    }
    return deletedNode;
  }

  toArray() {
    const nodes = [];
    let curr = this.head;
    while (curr) {
      nodes.push(curr.value);
      curr = curr.next;
    }
    return nodes;
  }
}`,
    starterCode: `class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  prepend(value) {}
  append(value) {}
  delete(value) {}
  toArray() {}
}`,
    testCases: [
      {
        input: `(function() {
  const list = new LinkedList();
  list.append(1).append(2).append(3);
  list.prepend(0);
  list.delete(2);
  return list.toArray();
})()`,
        expectedOutput: `[0, 1, 3]`,
        description: 'Append, prepend and delete'
      }
    ]
  },
  {
    id: 'queue',
    title: 'Queue (FIFO)',
    category: 'Data Structures',
    difficulty: 'Easy',
    readmePath: 'src/data-structures/queue/README.md',
    timeComplexity: 'O(1) enqueue & dequeue',
    spaceComplexity: 'O(n)',
    entryFunction: 'Queue',
    code: `class Queue {
  constructor() {
    this.elements = {};
    this.head = 0;
    this.tail = 0;
  }

  enqueue(element) {
    this.elements[this.tail] = element;
    this.tail++;
  }

  dequeue() {
    if (this.isEmpty()) return null;
    const item = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;
    return item;
  }

  peek() {
    return this.isEmpty() ? null : this.elements[this.head];
  }

  isEmpty() {
    return this.tail - this.head === 0;
  }

  size() {
    return this.tail - this.head;
  }
}`,
    starterCode: `class Queue {
  constructor() {
    // Setup FIFO queue
  }

  enqueue(item) {}
  dequeue() {}
  peek() {}
  isEmpty() {}
}`,
    testCases: [
      {
        input: `(function() {
  const q = new Queue();
  q.enqueue('a');
  q.enqueue('b');
  q.enqueue('c');
  const d1 = q.dequeue();
  const p1 = q.peek();
  const d2 = q.dequeue();
  return [d1, p1, d2, q.isEmpty()];
})()`,
        expectedOutput: `["a", "b", "b", false]`,
        description: 'Enqueue, dequeue and peek'
      }
    ]
  },
  {
    id: 'stack',
    title: 'Stack (LIFO)',
    category: 'Data Structures',
    difficulty: 'Easy',
    readmePath: 'src/data-structures/stack/README.md',
    timeComplexity: 'O(1) push & pop',
    spaceComplexity: 'O(n)',
    entryFunction: 'Stack',
    code: `class Stack {
  constructor() {
    this.items = [];
  }

  push(value) {
    this.items.push(value);
  }

  pop() {
    return this.items.length > 0 ? this.items.pop() : null;
  }

  peek() {
    return this.items.length > 0 ? this.items[this.items.length - 1] : null;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  toArray() {
    return [...this.items].reverse();
  }
}`,
    starterCode: `class Stack {
  constructor() {
    this.items = [];
  }
  push(val) {}
  pop() {}
  peek() {}
  isEmpty() {}
}`,
    testCases: [
      {
        input: `(function() {
  const s = new Stack();
  s.push(10);
  s.push(20);
  s.push(30);
  const top = s.peek();
  const p1 = s.pop();
  return [top, p1, s.peek()];
})()`,
        expectedOutput: `[30, 30, 20]`,
        description: 'Push, pop and peek LIFO order'
      }
    ]
  },
  {
    id: 'hash-table',
    title: 'Hash Table (with Chaining)',
    category: 'Data Structures',
    difficulty: 'Medium',
    readmePath: 'src/data-structures/hash-table/README.md',
    timeComplexity: 'O(1) average get/set/delete',
    spaceComplexity: 'O(n)',
    entryFunction: 'HashTable',
    code: `class HashTable {
  constructor(size = 32) {
    this.buckets = new Array(size).fill(null).map(() => []);
  }

  hash(key) {
    let hashVal = 0;
    for (let i = 0; i < key.length; i++) {
      hashVal = (hashVal << 5) - hashVal + key.charCodeAt(i);
      hashVal |= 0;
    }
    return Math.abs(hashVal) % this.buckets.length;
  }

  set(key, value) {
    const bucket = this.buckets[this.hash(key)];
    const existing = bucket.find(entry => entry.key === key);
    if (existing) {
      existing.value = value;
    } else {
      bucket.push({ key, value });
    }
  }

  get(key) {
    const bucket = this.buckets[this.hash(key)];
    const entry = bucket.find(e => e.key === key);
    return entry ? entry.value : undefined;
  }

  delete(key) {
    const bucket = this.buckets[this.hash(key)];
    const index = bucket.findIndex(e => e.key === key);
    if (index !== -1) {
      return bucket.splice(index, 1)[0].value;
    }
    return null;
  }

  has(key) {
    return this.get(key) !== undefined;
  }
}`,
    starterCode: `class HashTable {
  constructor(size = 32) {
    // Initialize hash table buckets
  }

  hash(key) {}
  set(key, value) {}
  get(key) {}
  delete(key) {}
  has(key) {}
}`,
    testCases: [
      {
        input: `(function() {
  const ht = new HashTable(16);
  ht.set('name', 'Alice');
  ht.set('role', 'Engineer');
  const v1 = ht.get('name');
  ht.delete('name');
  const v2 = ht.has('name');
  const v3 = ht.get('role');
  return [v1, v2, v3];
})()`,
        expectedOutput: `["Alice", false, "Engineer"]`,
        description: 'Set, get, delete and collision resolution'
      }
    ]
  },
  {
    id: 'binary-search-tree',
    title: 'Binary Search Tree (BST)',
    category: 'Data Structures',
    difficulty: 'Medium',
    readmePath: 'src/data-structures/tree/README.md',
    timeComplexity: 'O(log n) average insert/search, O(n) worst',
    spaceComplexity: 'O(n)',
    entryFunction: 'BinarySearchTree',
    code: `class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new TreeNode(value);
    if (!this.root) {
      this.root = newNode;
      return this;
    }
    let curr = this.root;
    while (true) {
      if (value < curr.value) {
        if (!curr.left) {
          curr.left = newNode;
          return this;
        }
        curr = curr.left;
      } else {
        if (!curr.right) {
          curr.right = newNode;
          return this;
        }
        curr = curr.right;
      }
    }
  }

  contains(value) {
    let curr = this.root;
    while (curr) {
      if (value === curr.value) return true;
      curr = value < curr.value ? curr.left : curr.right;
    }
    return false;
  }

  inOrderTraversal() {
    const result = [];
    function traverse(node) {
      if (!node) return;
      traverse(node.left);
      result.push(node.value);
      traverse(node.right);
    }
    traverse(this.root);
    return result;
  }
}`,
    starterCode: `class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  insert(val) {}
  contains(val) {}
  inOrderTraversal() {}
}`,
    testCases: [
      {
        input: `(function() {
  const bst = new BinarySearchTree();
  [10, 5, 15, 2, 7, 12, 20].forEach(v => bst.insert(v));
  const c1 = bst.contains(7);
  const c2 = bst.contains(99);
  const sorted = bst.inOrderTraversal();
  return { c1, c2, sorted };
})()`,
        expectedOutput: `{"c1": true, "c2": false, "sorted": [2, 5, 7, 10, 12, 15, 20]}`,
        description: 'Insert, contains, and in-order traversal'
      }
    ]
  },
  {
    id: 'disjoint-set',
    title: 'Disjoint Set (Union-Find)',
    category: 'Data Structures',
    difficulty: 'Medium',
    readmePath: 'src/data-structures/disjoint-set/README.md',
    timeComplexity: 'O(α(n)) nearly O(1) amortized',
    spaceComplexity: 'O(n)',
    entryFunction: 'DisjointSet',
    code: `class DisjointSet {
  constructor(size) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = new Array(size).fill(0);
  }

  find(i) {
    if (this.parent[i] === i) return i;
    this.parent[i] = this.find(this.parent[i]); // Path compression
    return this.parent[i];
  }

  union(i, j) {
    const rootI = this.find(i);
    const rootJ = this.find(j);
    if (rootI !== rootJ) {
      if (this.rank[rootI] < this.rank[rootJ]) {
        this.parent[rootI] = rootJ;
      } else if (this.rank[rootI] > this.rank[rootJ]) {
        this.parent[rootJ] = rootI;
      } else {
        this.parent[rootJ] = rootI;
        this.rank[rootI]++;
      }
      return true;
    }
    return false;
  }

  connected(i, j) {
    return this.find(i) === this.find(j);
  }
}`,
    starterCode: `class DisjointSet {
  constructor(size) {}
  find(i) {}
  union(i, j) {}
  connected(i, j) {}
}`,
    testCases: [
      {
        input: `(function() {
  const ds = new DisjointSet(6);
  ds.union(0, 1);
  ds.union(1, 2);
  ds.union(3, 4);
  return [ds.connected(0, 2), ds.connected(0, 3), ds.connected(3, 4)];
})()`,
        expectedOutput: `[true, false, true]`,
        description: 'Union operations with path compression'
      }
    ]
  },
  {
    id: 'graph',
    title: 'Graph (Adjacency List)',
    category: 'Data Structures',
    difficulty: 'Medium',
    readmePath: 'src/data-structures/graph/README.md',
    timeComplexity: 'O(V + E) traversal',
    spaceComplexity: 'O(V + E)',
    entryFunction: 'Graph',
    code: `class Graph {
  constructor(isDirected = false) {
    this.isDirected = isDirected;
    this.adjacencyList = new Map();
  }

  addVertex(v) {
    if (!this.adjacencyList.has(v)) {
      this.adjacencyList.set(v, []);
    }
  }

  addEdge(v1, v2) {
    this.addVertex(v1);
    this.addVertex(v2);
    this.adjacencyList.get(v1).push(v2);
    if (!this.isDirected) {
      this.adjacencyList.get(v2).push(v1);
    }
  }

  getNeighbors(v) {
    return this.adjacencyList.get(v) || [];
  }
}`,
    starterCode: `class Graph {
  constructor(isDirected = false) {
    this.adjacencyList = new Map();
  }
  addVertex(v) {}
  addEdge(v1, v2) {}
  getNeighbors(v) {}
}`,
    testCases: [
      {
        input: `(function() {
  const g = new Graph();
  g.addEdge('A', 'B');
  g.addEdge('A', 'C');
  return g.getNeighbors('A');
})()`,
        expectedOutput: `["B", "C"]`,
        description: 'Undirected graph vertex and edge addition'
      }
    ]
  },

  // --- SORTING ALGORITHMS ---
  {
    id: 'merge-sort',
    title: 'Merge Sort',
    category: 'Sorting',
    difficulty: 'Medium',
    readmePath: 'src/algorithms/sorting/merge-sort/README.md',
    timeComplexity: 'O(n log n) across all cases',
    spaceComplexity: 'O(n)',
    entryFunction: 'mergeSort',
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
    starterCode: `/**
 * @param {number[]} arr
 * @return {number[]}
 */
function mergeSort(arr) {
  // Implement divide-and-conquer merge sort
}`,
    testCases: [
      { input: '[5, 2, 9, 1, 5, 6]', expectedOutput: '[1, 2, 5, 5, 6, 9]', description: 'Unsorted array with duplicates' },
      { input: '[]', expectedOutput: '[]', description: 'Empty array' },
      { input: '[1]', expectedOutput: '[1]', description: 'Single element' }
    ]
  },
  {
    id: 'quick-sort',
    title: 'Quicksort',
    category: 'Sorting',
    difficulty: 'Medium',
    readmePath: 'src/algorithms/sorting/quick-sort/README.md',
    timeComplexity: 'O(n log n) average, O(n²) worst',
    spaceComplexity: 'O(log n) auxiliary',
    entryFunction: 'quickSort',
    code: `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] <= pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}`,
    starterCode: `/**
 * @param {number[]} arr
 * @return {number[]}
 */
function quickSort(arr) {
  // Implement quicksort with pivot partitioning
}`,
    testCases: [
      { input: '[38, 27, 43, 3, 9, 82, 10]', expectedOutput: '[3, 9, 10, 27, 38, 43, 82]', description: 'General array' },
      { input: '[-5, -10, 0, 5, 2]', expectedOutput: '[-10, -5, 0, 2, 5]', description: 'Array with negative numbers' }
    ]
  },
  {
    id: 'heap-sort',
    title: 'Heap Sort',
    category: 'Sorting',
    difficulty: 'Medium',
    readmePath: 'src/algorithms/sorting/heap-sort/README.md',
    timeComplexity: 'O(n log n) in-place',
    spaceComplexity: 'O(1)',
    entryFunction: 'heapSort',
    code: `function heapSort(arr) {
  const a = [...arr];
  const n = a.length;

  function heapify(len, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    if (left < len && a[left] > a[largest]) largest = left;
    if (right < len && a[right] > a[largest]) largest = right;
    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      heapify(len, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    heapify(i, 0);
  }

  return a;
}`,
    starterCode: `function heapSort(arr) {
  // Build max heap and extract elements
}`,
    testCases: [
      { input: '[12, 11, 13, 5, 6, 7]', expectedOutput: '[5, 6, 7, 11, 12, 13]', description: 'Heap sort test' }
    ]
  },
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    category: 'Sorting',
    difficulty: 'Easy',
    readmePath: 'src/algorithms/sorting/bubble-sort/README.md',
    timeComplexity: 'O(n) best, O(n²) worst',
    spaceComplexity: 'O(1)',
    entryFunction: 'bubbleSort',
    code: `function bubbleSort(arr) {
  const a = [...arr];
  let swapped;
  for (let i = 0; i < a.length; i++) {
    swapped = false;
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return a;
}`,
    starterCode: `function bubbleSort(arr) {
  // Implement optimized bubble sort with swap flag
}`,
    testCases: [
      { input: '[64, 34, 25, 12, 22, 11, 90]', expectedOutput: '[11, 12, 22, 25, 34, 64, 90]', description: 'Bubble sort' }
    ]
  },
  {
    id: 'insertion-sort',
    title: 'Insertion Sort',
    category: 'Sorting',
    difficulty: 'Easy',
    readmePath: 'src/algorithms/sorting/insertion-sort/README.md',
    timeComplexity: 'O(n) best, O(n²) average',
    spaceComplexity: 'O(1)',
    entryFunction: 'insertionSort',
    code: `function insertionSort(arr) {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    let key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j = j - 1;
    }
    a[j + 1] = key;
  }
  return a;
}`,
    starterCode: `function insertionSort(arr) {
  // Implement insertion sort
}`,
    testCases: [
      { input: '[4, 3, 2, 10, 12, 1, 5, 6]', expectedOutput: '[1, 2, 3, 4, 5, 6, 10, 12]', description: 'Insertion sort test' }
    ]
  },

  // --- SEARCH ALGORITHMS ---
  {
    id: 'binary-search',
    title: 'Binary Search',
    category: 'Search',
    difficulty: 'Easy',
    readmePath: 'src/algorithms/search/binary-search/README.md',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    entryFunction: 'binarySearch',
    code: `function binarySearch(sortedArray, seekElement) {
  let left = 0;
  let right = sortedArray.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (sortedArray[mid] === seekElement) {
      return mid;
    }
    if (sortedArray[mid] < seekElement) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}`,
    starterCode: `function binarySearch(sortedArray, seekElement) {
  // Return index of seekElement or -1 if not found
}`,
    testCases: [
      { input: '[1, 3, 5, 7, 9, 11], 7', expectedOutput: '3', description: 'Target present' },
      { input: '[1, 3, 5, 7, 9, 11], 4', expectedOutput: '-1', description: 'Target absent' }
    ]
  },

  // --- GRAPH ALGORITHMS ---
  {
    id: 'breadth-first-search',
    title: 'Breadth-First Search (BFS)',
    category: 'Graph',
    difficulty: 'Medium',
    readmePath: 'src/algorithms/graph/breadth-first-search/README.md',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    entryFunction: 'bfs',
    code: `function bfs(graph, startNode) {
  const visited = new Set();
  const queue = [startNode];
  const order = [];
  visited.add(startNode);

  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);
    const neighbors = graph[node] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return order;
}`,
    starterCode: `function bfs(graph, startNode) {
  // Return array of visited nodes in BFS level order
}`,
    testCases: [
      {
        input: `{ 'A': ['B', 'C'], 'B': ['D', 'E'], 'C': ['F'], 'D': [], 'E': [], 'F': [] }, 'A'`,
        expectedOutput: `["A", "B", "C", "D", "E", "F"]`,
        description: 'Level order traversal'
      }
    ]
  },
  {
    id: 'depth-first-search',
    title: 'Depth-First Search (DFS)',
    category: 'Graph',
    difficulty: 'Medium',
    readmePath: 'src/algorithms/graph/depth-first-search/README.md',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    entryFunction: 'dfs',
    code: `function dfs(graph, startNode) {
  const visited = new Set();
  const order = [];

  function traverse(node) {
    if (!node || visited.has(node)) return;
    visited.add(node);
    order.push(node);
    const neighbors = graph[node] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        traverse(neighbor);
      }
    }
  }

  traverse(startNode);
  return order;
}`,
    starterCode: `function dfs(graph, startNode) {
  // Return array of visited nodes in DFS preorder
}`,
    testCases: [
      {
        input: `{ 'A': ['B', 'C'], 'B': ['D'], 'C': ['E'], 'D': [], 'E': [] }, 'A'`,
        expectedOutput: `["A", "B", "D", "C", "E"]`,
        description: 'Depth first order'
      }
    ]
  },
  {
    id: 'dijkstra',
    title: "Dijkstra's Shortest Path",
    category: 'Graph',
    difficulty: 'Hard',
    readmePath: 'src/algorithms/graph/dijkstra/README.md',
    timeComplexity: 'O(E + V log V)',
    spaceComplexity: 'O(V)',
    entryFunction: 'dijkstra',
    code: `function dijkstra(graph, startNode) {
  const distances = {};
  const visited = new Set();
  const nodes = Object.keys(graph);

  for (const node of nodes) {
    distances[node] = Infinity;
  }
  distances[startNode] = 0;

  while (visited.size < nodes.length) {
    let minNode = null;
    let minDistance = Infinity;

    for (const node of nodes) {
      if (!visited.has(node) && distances[node] < minDistance) {
        minDistance = distances[node];
        minNode = node;
      }
    }

    if (minNode === null) break;
    visited.add(minNode);

    const neighbors = graph[minNode] || {};
    for (const [neighbor, weight] of Object.entries(neighbors)) {
      const newDist = distances[minNode] + weight;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
      }
    }
  }

  return distances;
}`,
    starterCode: `function dijkstra(graph, startNode) {
  // Return map of shortest distances from startNode
}`,
    testCases: [
      {
        input: `{ 'A': { 'B': 4, 'C': 2 }, 'B': { 'C': 1, 'D': 5 }, 'C': { 'D': 8, 'E': 10 }, 'D': { 'E': 2 }, 'E': {} }, 'A'`,
        expectedOutput: `{"A": 0, "B": 4, "C": 2, "D": 9, "E": 11}`,
        description: 'Single source shortest path'
      }
    ]
  },
  {
    id: 'topological-sorting',
    title: 'Topological Sort (Kahn Algorithm)',
    category: 'Graph',
    difficulty: 'Medium',
    readmePath: 'src/algorithms/graph/topological-sorting/README.md',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    entryFunction: 'topologicalSort',
    code: `function topologicalSort(numCourses, prerequisites) {
  const inDegree = new Array(numCourses).fill(0);
  const adj = Array.from({ length: numCourses }, () => []);

  for (const [dest, src] of prerequisites) {
    adj[src].push(dest);
    inDegree[dest]++;
  }

  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const order = [];
  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);
    for (const next of adj[node]) {
      inDegree[next]--;
      if (inDegree[next] === 0) queue.push(next);
    }
  }

  return order.length === numCourses ? order : [];
}`,
    starterCode: `function topologicalSort(numCourses, prerequisites) {
  // Return valid linear ordering or [] if cycle detected
}`,
    testCases: [
      { input: '4, [[1, 0], [2, 0], [3, 1], [3, 2]]', expectedOutput: '[0, 1, 2, 3]', description: 'DAG ordering' },
      { input: '2, [[1, 0], [0, 1]]', expectedOutput: '[]', description: 'Cycle detection' }
    ]
  },

  // --- DYNAMIC PROGRAMMING ---
  {
    id: 'knapsack-problem',
    title: '0/1 Knapsack Problem',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    readmePath: 'src/algorithms/sets/knapsack-problem/README.md',
    timeComplexity: 'O(n * W)',
    spaceComplexity: 'O(n * W)',
    entryFunction: 'knapsack',
    code: `function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const w = weights[i - 1];
    const v = values[i - 1];
    for (let c = 0; c <= capacity; c++) {
      if (w <= c) {
        dp[i][c] = Math.max(dp[i - 1][c], dp[i - 1][c - w] + v);
      } else {
        dp[i][c] = dp[i - 1][c];
      }
    }
  }

  return dp[n][capacity];
}`,
    starterCode: `function knapsack(weights, values, capacity) {
  // Return max value that can be put in knapsack of capacity W
}`,
    testCases: [
      { input: '[1, 2, 3], [10, 15, 40], 4', expectedOutput: '55', description: 'Weights [1,2,3], values [10,15,40], capacity 4 -> items 1 & 3' }
    ]
  },
  {
    id: 'longest-common-subsequence',
    title: 'Longest Common Subsequence (LCS)',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    readmePath: 'src/algorithms/sets/longest-common-subsequence/README.md',
    timeComplexity: 'O(m * n)',
    spaceComplexity: 'O(m * n)',
    entryFunction: 'lcs',
    code: `function lcs(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}`,
    starterCode: `function lcs(text1, text2) {
  // Return length of longest common subsequence
}`,
    testCases: [
      { input: '"abcde", "ace"', expectedOutput: '3', description: 'Common subsequence is "ace"' },
      { input: '"abc", "def"', expectedOutput: '0', description: 'No common subsequence' }
    ]
  },
  {
    id: 'levenshtein-distance',
    title: 'Levenshtein Edit Distance',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    readmePath: 'src/algorithms/string/levenshtein-distance/README.md',
    timeComplexity: 'O(m * n)',
    spaceComplexity: 'O(m * n)',
    entryFunction: 'levenshteinDistance',
    code: `function levenshteinDistance(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}`,
    starterCode: `function levenshteinDistance(a, b) {
  // Return minimum number of single-character edits (insertions, deletions, substitutions)
}`,
    testCases: [
      { input: '"kitten", "sitting"', expectedOutput: '3', description: 'Edit distance from kitten to sitting' },
      { input: '"", "abc"', expectedOutput: '3', description: 'Empty to string' }
    ]
  },

  // --- STRING ALGORITHMS ---
  {
    id: 'knuth-morris-pratt',
    title: 'Knuth-Morris-Pratt (KMP) Pattern Search',
    category: 'String',
    difficulty: 'Medium',
    readmePath: 'src/algorithms/string/knuth-morris-pratt/README.md',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(m)',
    entryFunction: 'kmp',
    code: `function kmp(text, pattern) {
  if (pattern.length === 0) return 0;
  const lps = new Array(pattern.length).fill(0);
  let prevLPS = 0;
  let i = 1;

  while (i < pattern.length) {
    if (pattern[i] === pattern[prevLPS]) {
      lps[i] = prevLPS + 1;
      prevLPS++;
      i++;
    } else if (prevLPS === 0) {
      lps[i] = 0;
      i++;
    } else {
      prevLPS = lps[prevLPS - 1];
    }
  }

  let textIdx = 0;
  let patIdx = 0;
  while (textIdx < text.length) {
    if (text[textIdx] === pattern[patIdx]) {
      textIdx++;
      patIdx++;
    } else if (patIdx === 0) {
      textIdx++;
    } else {
      patIdx = lps[patIdx - 1];
    }

    if (patIdx === pattern.length) {
      return textIdx - pattern.length;
    }
  }

  return -1;
}`,
    starterCode: `function kmp(text, pattern) {
  // Return first index of pattern in text using KMP, or -1
}`,
    testCases: [
      { input: '"hello world", "world"', expectedOutput: '6', description: 'Substring match' },
      { input: '"ababcabcabababd", "ababd"', expectedOutput: '10', description: 'LPS shift match' }
    ]
  },

  // --- MATH & COMBINATORICS ---
  {
    id: 'fibonacci',
    title: 'Fibonacci (DP / Memoization)',
    category: 'Math',
    difficulty: 'Easy',
    readmePath: 'src/algorithms/math/fibonacci/README.md',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) with two variables',
    entryFunction: 'fibonacci',
    code: `function fibonacci(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  let prev = 0;
  let curr = 1;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}`,
    starterCode: `function fibonacci(n) {
  // Return the n-th Fibonacci number in O(n) time and O(1) space
}`,
    testCases: [
      { input: '0', expectedOutput: '0', description: 'fib(0)' },
      { input: '1', expectedOutput: '1', description: 'fib(1)' },
      { input: '10', expectedOutput: '55', description: 'fib(10)' }
    ]
  },
  {
    id: 'sieve-of-eratosthenes',
    title: 'Sieve of Eratosthenes',
    category: 'Math',
    difficulty: 'Medium',
    readmePath: 'src/algorithms/math/sieve-of-eratosthenes/README.md',
    timeComplexity: 'O(n log log n)',
    spaceComplexity: 'O(n)',
    entryFunction: 'sieveOfEratosthenes',
    code: `function sieveOfEratosthenes(maxNumber) {
  const isPrime = new Array(maxNumber + 1).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;

  for (let number = 2; number * number <= maxNumber; number++) {
    if (isPrime[number]) {
      for (let multiple = number * number; multiple <= maxNumber; multiple += number) {
        isPrime[multiple] = false;
      }
    }
  }

  const primes = [];
  for (let number = 2; number <= maxNumber; number++) {
    if (isPrime[number]) primes.push(number);
  }
  return primes;
}`,
    starterCode: `function sieveOfEratosthenes(maxNumber) {
  // Return array of prime numbers up to maxNumber
}`,
    testCases: [
      { input: '10', expectedOutput: '[2, 3, 5, 7]', description: 'Primes up to 10' },
      { input: '30', expectedOutput: '[2, 3, 5, 7, 11, 13, 17, 19, 23, 29]', description: 'Primes up to 30' }
    ]
  }
];

console.log('Ingesting Trekhleb algorithms & data structures...');
const enriched = classicAlgorithms.map(algo => {
  let fullReadme = '';
  if (algo.readmePath) {
    const absPath = path.join(CLONE_DIR, algo.readmePath);
    if (fs.existsSync(absPath)) {
      fullReadme = cleanReadme(fs.readFileSync(absPath, 'utf8'));
    }
  }
  return {
    ...algo,
    readme: fullReadme,
    author: 'Oleksii Trekhleb (javascript-algorithms - MIT)'
  };
});

fs.writeFileSync(OUT_FILE, JSON.stringify(enriched, null, 2), 'utf8');
fs.writeFileSync(WEB_OUT_FILE, JSON.stringify(enriched, null, 2), 'utf8');

console.log(`✅ Successfully generated ${enriched.length} classic CS algorithms into:`);
console.log(`   - ${OUT_FILE}`);
console.log(`   - ${WEB_OUT_FILE}`);
