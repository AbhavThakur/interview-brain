export interface GrindProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeMinutes: number;
  leetcodeUrl: string;
  pattern: string;
  order: number;
  ahHaInsight: string;
}

export const GRIND_75_PROBLEMS: GrindProblem[] = [
  // WEEK 1 FOUNDATIONS - ARRAYS, STRINGS, STACKS, TWO POINTERS
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    timeMinutes: 15,
    leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
    pattern: 'Arrays & Hashing',
    order: 1,
    ahHaInsight: 'Store seen values and their indices in a Hash Map to find complement (target - num) in O(1).'
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    timeMinutes: 20,
    leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/',
    pattern: 'Stack',
    order: 2,
    ahHaInsight: 'Push opening brackets to stack; for closing brackets, pop and verify matching pair. Stack must be empty at end.'
  },
  {
    id: 'merge-two-sorted-lists',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    timeMinutes: 20,
    leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/',
    pattern: 'Linked Lists',
    order: 3,
    ahHaInsight: 'Use a dummy head pointer; iterate and attach the smaller current node between l1 and l2.'
  },
  {
    id: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    timeMinutes: 20,
    leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    pattern: 'Two Pointers / Sliding Window',
    order: 4,
    ahHaInsight: 'Track running minimum buy price seen so far; compute max profit possible at each day in single O(N) pass.'
  },
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    timeMinutes: 15,
    leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/',
    pattern: 'Two Pointers',
    order: 5,
    ahHaInsight: 'Two pointers converging inward from left and right, skipping non-alphanumeric characters.'
  },
  {
    id: 'invert-binary-tree',
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    timeMinutes: 15,
    leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/',
    pattern: 'Trees',
    order: 6,
    ahHaInsight: 'Post-order or pre-order DFS: swap root.left and root.right, then recursively invert subtrees.'
  },
  {
    id: 'valid-anagram',
    title: 'Valid Anagram',
    difficulty: 'Easy',
    timeMinutes: 15,
    leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/',
    pattern: 'Arrays & Hashing',
    order: 7,
    ahHaInsight: 'Frequency array of size 26 or Hash Map. Increment for string s, decrement for string t; all counts must be 0.'
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    timeMinutes: 15,
    leetcodeUrl: 'https://leetcode.com/problems/binary-search/',
    pattern: 'Binary Search',
    order: 8,
    ahHaInsight: 'Use mid = left + Math.floor((right - left) / 2) to prevent integer overflow.'
  },
  {
    id: 'flood-fill',
    title: 'Flood Fill',
    difficulty: 'Easy',
    timeMinutes: 20,
    leetcodeUrl: 'https://leetcode.com/problems/flood-fill/',
    pattern: 'Graphs / BFS-DFS',
    order: 9,
    ahHaInsight: 'DFS/BFS from starting cell. Guard against infinite loop if starting color is already equal to target color.'
  },
  {
    id: 'lowest-common-ancestor-of-a-binary-search-tree',
    title: 'Lowest Common Ancestor of a BST',
    difficulty: 'Easy',
    timeMinutes: 20,
    leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/',
    pattern: 'Trees',
    order: 10,
    ahHaInsight: 'If both p and q are smaller than root, go left; if both are larger, go right; otherwise, root is the split ancestor.'
  },
  {
    id: 'balanced-binary-tree',
    title: 'Balanced Binary Tree',
    difficulty: 'Easy',
    timeMinutes: 20,
    leetcodeUrl: 'https://leetcode.com/problems/balanced-binary-tree/',
    pattern: 'Trees',
    order: 11,
    ahHaInsight: 'Bottom-up DFS returning height if subtree is balanced, or -1 if unbalanced to short-circuit in O(N).'
  },
  {
    id: 'linked-list-cycle',
    title: 'Linked List Cycle',
    difficulty: 'Easy',
    timeMinutes: 20,
    leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/',
    pattern: 'Linked Lists / Fast & Slow',
    order: 12,
    ahHaInsight: "Floyd's Tortoise and Hare: slow moves 1 step, fast moves 2 steps. If they ever point to the same node, cycle exists."
  },
  {
    id: 'implement-queue-using-stacks',
    title: 'Implement Queue using Stacks',
    difficulty: 'Easy',
    timeMinutes: 20,
    leetcodeUrl: 'https://leetcode.com/problems/implement-queue-using-stacks/',
    pattern: 'Stack',
    order: 13,
    ahHaInsight: 'Use two stacks (inStack and outStack). Only transfer elements from inStack to outStack when outStack is empty (amortized O(1)).'
  },

  // MEDIUM CORE PATTERNS
  {
    id: 'first-bad-version',
    title: 'First Bad Version',
    difficulty: 'Easy',
    timeMinutes: 20,
    leetcodeUrl: 'https://leetcode.com/problems/first-bad-version/',
    pattern: 'Binary Search',
    order: 14,
    ahHaInsight: 'Binary search for boundary condition where isBadVersion(mid) is true but isBadVersion(mid - 1) is false.'
  },
  {
    id: 'ransom-note',
    title: 'Ransom Note',
    difficulty: 'Easy',
    timeMinutes: 15,
    leetcodeUrl: 'https://leetcode.com/problems/ransom-note/',
    pattern: 'Arrays & Hashing',
    order: 15,
    ahHaInsight: 'Character count array of magazine; decrement character count for each letter in ransom note.'
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    timeMinutes: 15,
    leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/',
    pattern: 'Dynamic Programming',
    order: 16,
    ahHaInsight: 'Fibonacci DP: ways(n) = ways(n - 1) + ways(n - 2). Maintain only previous 2 variables for O(1) space.'
  },
  {
    id: 'longest-palindrome',
    title: 'Longest Palindrome',
    difficulty: 'Easy',
    timeMinutes: 20,
    leetcodeUrl: 'https://leetcode.com/problems/longest-palindrome/',
    pattern: 'Strings / Greedy',
    order: 17,
    ahHaInsight: 'Pair up all even occurrences of characters. At most one single odd character can be placed in the center (+1).'
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    timeMinutes: 15,
    leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/',
    pattern: 'Linked Lists',
    order: 18,
    ahHaInsight: 'Iterative 3-pointer dance: save nextNode = curr.next, curr.next = prev, prev = curr, curr = nextNode.'
  },
  {
    id: 'majority-element',
    title: 'Majority Element',
    difficulty: 'Easy',
    timeMinutes: 20,
    leetcodeUrl: 'https://leetcode.com/problems/majority-element/',
    pattern: 'Arrays / Boyer-Moore',
    order: 19,
    ahHaInsight: "Boyer-Moore Voting Algorithm: maintain count and candidate. If count == 0, pick current num. Increment on match, decrement on mismatch."
  },
  {
    id: 'add-binary',
    title: 'Add Binary',
    difficulty: 'Easy',
    timeMinutes: 15,
    leetcodeUrl: 'https://leetcode.com/problems/add-binary/',
    pattern: 'Bit Manipulation / Math',
    order: 20,
    ahHaInsight: 'Iterate backwards from right to left with carry variable. Append sum % 2, carry = Math.floor(sum / 2).'
  },
  {
    id: 'diameter-of-binary-tree',
    title: 'Diameter of Binary Tree',
    difficulty: 'Easy',
    timeMinutes: 20,
    leetcodeUrl: 'https://leetcode.com/problems/diameter-of-binary-tree/',
    pattern: 'Trees',
    order: 21,
    ahHaInsight: 'At each node, diameter through node = leftHeight + rightHeight. Update global max and return 1 + max(leftHeight, rightHeight).'
  },
  {
    id: 'middle-of-the-linked-list',
    title: 'Middle of the Linked List',
    difficulty: 'Easy',
    timeMinutes: 20,
    leetcodeUrl: 'https://leetcode.com/problems/middle-of-the-linked-list/',
    pattern: 'Linked Lists / Fast & Slow',
    order: 22,
    ahHaInsight: 'Slow moves 1 step, fast moves 2 steps. When fast reaches null or fast.next is null, slow is exactly at middle.'
  },
  {
    id: 'maximum-depth-of-binary-tree',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    timeMinutes: 15,
    leetcodeUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
    pattern: 'Trees',
    order: 23,
    ahHaInsight: 'Recursive DFS: maxDepth(root) = 1 + Math.max(maxDepth(root.left), maxDepth(root.right)).'
  },
  {
    id: 'contains-duplicate',
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    timeMinutes: 15,
    leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/',
    pattern: 'Arrays & Hashing',
    order: 24,
    ahHaInsight: 'Insert elements into Set; if element already exists in Set, return true immediately.'
  },
  {
    id: 'maximum-subarray',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    timeMinutes: 20,
    leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/',
    pattern: "Dynamic Programming / Kadane's",
    order: 25,
    ahHaInsight: "Kadane's Algorithm: maxCurrent = Math.max(num, maxCurrent + num). If maxCurrent drops below 0, reset by picking current num."
  },
  {
    id: 'insert-interval',
    title: 'Insert Interval',
    difficulty: 'Medium',
    timeMinutes: 25,
    leetcodeUrl: 'https://leetcode.com/problems/insert-interval/',
    pattern: 'Intervals',
    order: 26,
    ahHaInsight: 'Add non-overlapping left intervals, merge all overlapping intervals into newInterval, then append remaining right intervals.'
  },
  {
    id: '01-matrix',
    title: '01 Matrix',
    difficulty: 'Medium',
    timeMinutes: 30,
    leetcodeUrl: 'https://leetcode.com/problems/01-matrix/',
    pattern: 'Graphs / Multi-source BFS',
    order: 27,
    ahHaInsight: 'Multi-source BFS: enqueue all 0 cells first with distance 0, then expand outwards level-by-level to calculate distance to nearest 0.'
  },
  {
    id: 'k-closest-points-to-origin',
    title: 'K Closest Points to Origin',
    difficulty: 'Medium',
    timeMinutes: 30,
    leetcodeUrl: 'https://leetcode.com/problems/k-closest-points-to-origin/',
    pattern: 'Heaps / Max-Heap',
    order: 28,
    ahHaInsight: 'Maintain a Max-Heap of size K based on Euclidean distance (x^2 + y^2). When heap size > K, pop furthest point.'
  },
  {
    id: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    timeMinutes: 30,
    leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    pattern: 'Sliding Window',
    order: 29,
    ahHaInsight: 'Hash Map of lastSeenIndex. When duplicate character encountered inside current window, jump left pointer to lastSeenIndex + 1.'
  },
  {
    id: '3sum',
    title: '3Sum',
    difficulty: 'Medium',
    timeMinutes: 30,
    leetcodeUrl: 'https://leetcode.com/problems/3sum/',
    pattern: 'Two Pointers',
    order: 30,
    ahHaInsight: 'Sort array. Fix first element i, then use two pointers (left & right) to find pairs summing to -nums[i]. Skip duplicate elements.'
  },
  {
    id: 'binary-tree-level-order-traversal',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    timeMinutes: 20,
    leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    pattern: 'Trees / BFS',
    order: 31,
    ahHaInsight: 'Queue BFS. Capture queue length at start of each iteration to process all nodes of current level in a batch.'
  },
  {
    id: 'clone-graph',
    title: 'Clone Graph',
    difficulty: 'Medium',
    timeMinutes: 25,
    leetcodeUrl: 'https://leetcode.com/problems/clone-graph/',
    pattern: 'Graphs / DFS-BFS',
    order: 32,
    ahHaInsight: 'Map oldNode -> clonedNode to prevent infinite recursion on graph cycles. Recursively clone neighbors.'
  },
  {
    id: 'evaluate-reverse-polish-notation',
    title: 'Evaluate Reverse Polish Notation',
    difficulty: 'Medium',
    timeMinutes: 30,
    leetcodeUrl: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
    pattern: 'Stack',
    order: 33,
    ahHaInsight: 'Operands pushed to stack. When operator encountered, pop right operand then left operand, evaluate, and push result back.'
  },
  {
    id: 'course-schedule',
    title: 'Course Schedule',
    difficulty: 'Medium',
    timeMinutes: 30,
    leetcodeUrl: 'https://leetcode.com/problems/course-schedule/',
    pattern: 'Graphs / Topological Sort',
    order: 34,
    ahHaInsight: "Kahn's Algorithm (in-degree array + BFS queue) or DFS with 3-state coloring (unvisited, visiting, visited) to detect cycles."
  },
  {
    id: 'implement-trie-prefix-tree',
    title: 'Implement Trie (Prefix Tree)',
    difficulty: 'Medium',
    timeMinutes: 35,
    leetcodeUrl: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
    pattern: 'Trie',
    order: 35,
    ahHaInsight: 'TrieNode with children map/array and isEndOfWord boolean flag. Enables O(L) prefix searches where L is word length.'
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    difficulty: 'Medium',
    timeMinutes: 25,
    leetcodeUrl: 'https://leetcode.com/problems/coin-change/',
    pattern: 'Dynamic Programming',
    order: 36,
    ahHaInsight: 'Bottom-up DP: dp[a] = min(dp[a], 1 + dp[a - coin]) for each coin <= a. Initialize dp array with Infinity and dp[0] = 0.'
  },
  {
    id: 'product-of-array-except-self',
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    timeMinutes: 30,
    leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/',
    pattern: 'Arrays / Prefix & Suffix',
    order: 37,
    ahHaInsight: 'First pass calculates prefix products left-to-right; second pass multiplies running suffix product right-to-left in O(1) extra space.'
  },
  {
    id: 'min-stack',
    title: 'Min Stack',
    difficulty: 'Medium',
    timeMinutes: 20,
    leetcodeUrl: 'https://leetcode.com/problems/min-stack/',
    pattern: 'Stack',
    order: 38,
    ahHaInsight: 'Store pairs [val, currentMin] in the stack, or maintain a secondary minStack that tracks minimum at each stack depth.'
  },
  {
    id: 'validate-binary-search-tree',
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    timeMinutes: 20,
    leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/',
    pattern: 'Trees',
    order: 39,
    ahHaInsight: 'DFS carrying valid range (min, max). Every node must satisfy min < node.val < max. When going left, update max; going right, update min.'
  },
  {
    id: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'Medium',
    timeMinutes: 25,
    leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/',
    pattern: 'Graphs / DFS-BFS',
    order: 40,
    ahHaInsight: 'Iterate through grid; when a "1" is found, increment count and run DFS/BFS to sink all connected land to "0" (visited).'
  },
  {
    id: 'rotting-oranges',
    title: 'Rotting Oranges',
    difficulty: 'Medium',
    timeMinutes: 30,
    leetcodeUrl: 'https://leetcode.com/problems/rotting-oranges/',
    pattern: 'Graphs / Multi-source BFS',
    order: 41,
    ahHaInsight: 'Enqueue all initially rotten oranges. Each BFS level represents 1 minute. Count fresh oranges to ensure freshCount reaches 0.'
  },
  {
    id: 'search-in-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    timeMinutes: 30,
    leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    pattern: 'Binary Search',
    order: 42,
    ahHaInsight: 'At least one half (left or right) is always strictly sorted. Determine which half is sorted, check if target falls in it, and adjust pointers.'
  },
  {
    id: 'combination-sum',
    title: 'Combination Sum',
    difficulty: 'Medium',
    timeMinutes: 30,
    leetcodeUrl: 'https://leetcode.com/problems/combination-sum/',
    pattern: 'Backtracking',
    order: 43,
    ahHaInsight: 'Backtracking with startIndex to allow reusing same element while preventing duplicate combinations. Prune when remain < 0.'
  },
  {
    id: 'permutations',
    title: 'Permutations',
    difficulty: 'Medium',
    timeMinutes: 30,
    leetcodeUrl: 'https://leetcode.com/problems/permutations/',
    pattern: 'Backtracking',
    order: 44,
    ahHaInsight: 'Backtracking tracking used elements via boolean array or Set. Swap elements in place for O(1) auxiliary state space.'
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    timeMinutes: 20,
    leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/',
    pattern: 'Intervals',
    order: 45,
    ahHaInsight: 'Sort intervals by start time. If current.start <= prev.end, merge by setting prev.end = max(prev.end, current.end).'
  },
  {
    id: 'lowest-common-ancestor-of-a-binary-tree',
    title: 'Lowest Common Ancestor of a Binary Tree',
    difficulty: 'Medium',
    timeMinutes: 25,
    leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/',
    pattern: 'Trees',
    order: 46,
    ahHaInsight: 'DFS: if root is null, p, or q, return root. If both left and right return non-null, root is LCA; otherwise return the non-null child.'
  },
  {
    id: 'time-based-key-value-store',
    title: 'Time Based Key-Value Store',
    difficulty: 'Medium',
    timeMinutes: 35,
    leetcodeUrl: 'https://leetcode.com/problems/time-based-key-value-store/',
    pattern: 'Binary Search / Hash Map',
    order: 47,
    ahHaInsight: 'Map<string, Array<{timestamp, value}>>. Since timestamps are strictly increasing, use binary search to find largest timestamp_prev <= timestamp.'
  },
  {
    id: 'accounts-merge',
    title: 'Accounts Merge',
    difficulty: 'Medium',
    timeMinutes: 30,
    leetcodeUrl: 'https://leetcode.com/problems/accounts-merge/',
    pattern: 'Graphs / Disjoint Set Union (DSU)',
    order: 48,
    ahHaInsight: 'Union-Find / DSU where each email is a node. Union all emails in an account with the first email; group by root parent.'
  },
  {
    id: 'sort-colors',
    title: 'Sort Colors (Dutch National Flag)',
    difficulty: 'Medium',
    timeMinutes: 25,
    leetcodeUrl: 'https://leetcode.com/problems/sort-colors/',
    pattern: 'Two Pointers / 3-Way Partition',
    order: 49,
    ahHaInsight: '3 pointers: low (0s boundary), mid (scanner), high (2s boundary). Swap nums[mid] with low/high in single O(N) pass.'
  },
  {
    id: 'word-break',
    title: 'Word Break',
    difficulty: 'Medium',
    timeMinutes: 30,
    leetcodeUrl: 'https://leetcode.com/problems/word-break/',
    pattern: 'Dynamic Programming / Trie',
    order: 50,
    ahHaInsight: 'DP array dp[i] = can string prefix s[0..i] be segmented. dp[i] is true if exists j < i where dp[j] is true and s[j..i] is in dict.'
  },
  {
    id: 'partition-equal-subset-sum',
    title: 'Partition Equal Subset Sum',
    difficulty: 'Medium',
    timeMinutes: 30,
    leetcodeUrl: 'https://leetcode.com/problems/partition-equal-subset-sum/',
    pattern: 'Dynamic Programming / 0-1 Knapsack',
    order: 51,
    ahHaInsight: 'If totalSum is odd, return false. Otherwise, solve 0-1 Knapsack for target = totalSum / 2 using 1D boolean Set/Array.'
  },
  {
    id: 'string-to-integer-atoi',
    title: 'String to Integer (atoi)',
    difficulty: 'Medium',
    timeMinutes: 25,
    leetcodeUrl: 'https://leetcode.com/problems/string-to-integer-atoi/',
    pattern: 'Strings / Defensive Math',
    order: 52,
    ahHaInsight: 'Handle leading whitespaces, optional +/- sign, check 32-bit integer overflow (2^31 - 1 and -2^31) before multiplying by 10.'
  },
  {
    id: 'spiral-matrix',
    title: 'Spiral Matrix',
    difficulty: 'Medium',
    timeMinutes: 25,
    leetcodeUrl: 'https://leetcode.com/problems/spiral-matrix/',
    pattern: 'Matrix / Simulation',
    order: 53,
    ahHaInsight: 'Maintain 4 boundaries (top, bottom, left, right). Traverse perimeter, then shrink boundaries until top > bottom or left > right.'
  },
  {
    id: 'subsets',
    title: 'Subsets',
    difficulty: 'Medium',
    timeMinutes: 30,
    leetcodeUrl: 'https://leetcode.com/problems/subsets/',
    pattern: 'Backtracking / Bitmask',
    order: 54,
    ahHaInsight: 'At each index, choose to include or exclude current element in backtracking branch. Total 2^N subsets generated.'
  },
  {
    id: 'binary-tree-right-side-view',
    title: 'Binary Tree Right Side View',
    difficulty: 'Medium',
    timeMinutes: 20,
    leetcodeUrl: 'https://leetcode.com/problems/binary-tree-right-side-view/',
    pattern: 'Trees / BFS-DFS',
    order: 55,
    ahHaInsight: 'BFS taking the last element at each level, or reverse DFS (visit right child first) adding the first node visited at each depth level.'
  },
  {
    id: 'longest-palindromic-substring',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    timeMinutes: 25,
    leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring/',
    pattern: 'Two Pointers / Expand Around Center',
    order: 56,
    ahHaInsight: 'Expand outward from each center: 2N - 1 possible centers (odd length center at i, even length center at i and i+1).'
  },
  {
    id: 'unique-paths',
    title: 'Unique Paths',
    difficulty: 'Medium',
    timeMinutes: 20,
    leetcodeUrl: 'https://leetcode.com/problems/unique-paths/',
    pattern: 'Dynamic Programming / Combinatorics',
    order: 57,
    ahHaInsight: 'dp[r][c] = dp[r-1][c] + dp[r][c-1]. Can be optimized to single 1D array of size N or solved via Combinations formula.'
  },
  {
    id: 'construct-binary-tree-from-preorder-and-inorder-traversal',
    title: 'Construct Binary Tree from Preorder and Inorder Traversal',
    difficulty: 'Medium',
    timeMinutes: 25,
    leetcodeUrl: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/',
    pattern: 'Trees',
    order: 58,
    ahHaInsight: 'First element of preorder is root. Locate root in inorder array using Hash Map: left of index is left subtree, right is right subtree.'
  },
  {
    id: 'container-with-most-water',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    timeMinutes: 20,
    leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/',
    pattern: 'Two Pointers',
    order: 59,
    ahHaInsight: 'Two pointers at ends. Area = min(h[l], h[r]) * (r - l). Always move the pointer with the smaller height inward.'
  },
  {
    id: 'letter-combinations-of-a-phone-number',
    title: 'Letter Combinations of a Phone Number',
    difficulty: 'Medium',
    timeMinutes: 30,
    leetcodeUrl: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/',
    pattern: 'Backtracking',
    order: 60,
    ahHaInsight: 'Digit to letter map. Backtracking exploring each letter choice for the current digit index.'
  },
  {
    id: 'word-search',
    title: 'Word Search',
    difficulty: 'Medium',
    timeMinutes: 30,
    leetcodeUrl: 'https://leetcode.com/problems/word-search/',
    pattern: 'Backtracking / Matrix DFS',
    order: 61,
    ahHaInsight: 'DFS in 4 directions. Temporarily mark current cell with "#" to prevent revisiting in current path, then restore on backtrack.'
  },
  {
    id: 'find-all-anagrams-in-a-string',
    title: 'Find All Anagrams in a String',
    difficulty: 'Medium',
    timeMinutes: 30,
    leetcodeUrl: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/',
    pattern: 'Sliding Window',
    order: 62,
    ahHaInsight: 'Fixed sliding window of size p.length. Maintain character counts and match count; slide window by adding right and removing left.'
  },
  {
    id: 'minimum-height-trees',
    title: 'Minimum Height Trees',
    difficulty: 'Medium',
    timeMinutes: 30,
    leetcodeUrl: 'https://leetcode.com/problems/minimum-height-trees/',
    pattern: 'Graphs / Topological Trim',
    order: 63,
    ahHaInsight: 'Trim leaf nodes (nodes with degree 1) level-by-level inward like peeling an onion. At most 1 or 2 centroid roots remain.'
  },
  {
    id: 'task-scheduler',
    title: 'Task Scheduler',
    difficulty: 'Medium',
    timeMinutes: 35,
    leetcodeUrl: 'https://leetcode.com/problems/task-scheduler/',
    pattern: 'Greedy / Math / Heaps',
    order: 64,
    ahHaInsight: 'Find max frequency maxFreq. Formula: (maxFreq - 1) * (n + 1) + numTasksWithMaxFreq. Result is Math.max(tasks.length, formula).'
  },
  {
    id: 'lru-cache',
    title: 'LRU Cache',
    difficulty: 'Medium',
    timeMinutes: 30,
    leetcodeUrl: 'https://leetcode.com/problems/lru-cache/',
    pattern: 'Linked Lists / Hash Map (LLD)',
    order: 65,
    ahHaInsight: 'Doubly Linked List + Hash Map. Move accessed node to head (most recent). On capacity overflow, remove tail.prev in O(1).'
  },
  {
    id: 'kth-smallest-element-in-a-bst',
    title: 'Kth Smallest Element in a BST',
    difficulty: 'Medium',
    timeMinutes: 25,
    leetcodeUrl: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/',
    pattern: 'Trees / Inorder',
    order: 66,
    ahHaInsight: 'Inorder traversal of BST visits nodes in strictly ascending sorted order. Decrement k at each visit; return node when k == 0.'
  },
  {
    id: 'daily-temperatures',
    title: 'Daily Temperatures',
    difficulty: 'Medium',
    timeMinutes: 30,
    leetcodeUrl: 'https://leetcode.com/problems/daily-temperatures/',
    pattern: 'Monotonic Stack',
    order: 67,
    ahHaInsight: 'Monotonic decreasing stack of indices. When current temp is higher than top of stack, pop index and calculate days difference.'
  },
  {
    id: 'house-robber',
    title: 'House Robber',
    difficulty: 'Medium',
    timeMinutes: 25,
    leetcodeUrl: 'https://leetcode.com/problems/house-robber/',
    pattern: 'Dynamic Programming',
    order: 68,
    ahHaInsight: 'dp[i] = max(dp[i - 1], dp[i - 2] + nums[i]). Optimize to two variables rob1 and rob2 for O(1) space.'
  },
  {
    id: 'gas-station',
    title: 'Gas Station',
    difficulty: 'Medium',
    timeMinutes: 30,
    leetcodeUrl: 'https://leetcode.com/problems/gas-station/',
    pattern: 'Greedy',
    order: 69,
    ahHaInsight: 'If total gas < total cost, return -1. Otherwise, reset start index to i + 1 whenever running currentTank drops below 0.'
  },

  // HARD ADVANCED PATTERNS
  {
    id: 'word-ladder',
    title: 'Word Ladder',
    difficulty: 'Hard',
    timeMinutes: 45,
    leetcodeUrl: 'https://leetcode.com/problems/word-ladder/',
    pattern: 'Graphs / Bidirectional BFS',
    order: 70,
    ahHaInsight: 'BFS on word graph where edges exist if words differ by 1 letter. Bidirectional BFS from beginWord and endWord yields 10x speedup.'
  },
  {
    id: 'basic-calculator',
    title: 'Basic Calculator',
    difficulty: 'Hard',
    timeMinutes: 40,
    leetcodeUrl: 'https://leetcode.com/problems/basic-calculator/',
    pattern: 'Stack',
    order: 71,
    ahHaInsight: 'Maintain running result and sign (+1 / -1). On "(" push [result, sign] to stack and reset; on ")" pop and resolve previous scope.'
  },
  {
    id: 'maximum-profit-in-job-scheduling',
    title: 'Maximum Profit in Job Scheduling',
    difficulty: 'Hard',
    timeMinutes: 45,
    leetcodeUrl: 'https://leetcode.com/problems/maximum-profit-in-job-scheduling/',
    pattern: 'Dynamic Programming / Binary Search',
    order: 72,
    ahHaInsight: 'Sort jobs by end time. DP with binary search: dp[i] = max(dp[i-1], job.profit + dp[latestNonConflictingJob]).'
  },
  {
    id: 'merge-k-sorted-lists',
    title: 'Merge k Sorted Lists',
    difficulty: 'Hard',
    timeMinutes: 30,
    leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/',
    pattern: 'Heaps / Divide & Conquer',
    order: 73,
    ahHaInsight: 'Min-Heap of size K storing the head of each list, or Divide and Conquer pairwise merging like Merge Sort in O(N log K).'
  },
  {
    id: 'largest-rectangle-in-histogram',
    title: 'Largest Rectangle in Histogram',
    difficulty: 'Hard',
    timeMinutes: 35,
    leetcodeUrl: 'https://leetcode.com/problems/largest-rectangle-in-histogram/',
    pattern: 'Monotonic Stack',
    order: 74,
    ahHaInsight: 'Monotonic increasing stack storing [index, height]. When popped, calculate area with width = (current index - stackTopIndex - 1).'
  },
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    timeMinutes: 35,
    leetcodeUrl: 'https://leetcode.com/problems/trapping-rain-water/',
    pattern: 'Two Pointers / Monotonic Stack',
    order: 75,
    ahHaInsight: 'Two pointers left and right tracking maxLeft and maxRight. Water trapped at current position = max(0, min(maxLeft, maxRight) - height).'
  }
];
