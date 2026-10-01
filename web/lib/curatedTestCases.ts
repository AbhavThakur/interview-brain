import { TestCase } from "./practiceEngine";

/**
 * Curated test cases for high-frequency LeetCode & Grind 75 problems.
 */
export const CURATED_PROBLEM_TEST_CASES: Record<number, TestCase[]> = {
  // 1. Two Sum
  1: [
    {
      id: "1-1",
      input: "[2, 7, 11, 15], 9",
      expectedOutput: "[0, 1]",
      description: "Basic target 9",
    },
    {
      id: "1-2",
      input: "[3, 2, 4], 6",
      expectedOutput: "[1, 2]",
      description: "Indices not from index 0",
    },
    {
      id: "1-3",
      input: "[3, 3], 6",
      expectedOutput: "[0, 1]",
      description: "Duplicate numbers",
    },
  ],
  // 3. Longest Substring Without Repeating Characters
  3: [
    {
      id: "3-1",
      input: '"abcabcbb"',
      expectedOutput: "3",
      description: 'Repeated characters "abc"',
    },
    {
      id: "3-2",
      input: '"bbbbb"',
      expectedOutput: "1",
      description: 'All identical "b"',
    },
    {
      id: "3-3",
      input: '"pwwkew"',
      expectedOutput: "3",
      description: 'Substring "wke"',
    },
    {
      id: "3-4",
      input: '""',
      expectedOutput: "0",
      description: "Empty string",
    },
  ],
  // 9. Palindrome Number
  9: [
    {
      id: "9-1",
      input: "121",
      expectedOutput: "true",
      description: "Positive palindrome",
    },
    {
      id: "9-2",
      input: "-121",
      expectedOutput: "false",
      description: "Negative number",
    },
    {
      id: "9-3",
      input: "10",
      expectedOutput: "false",
      description: "Ends with zero",
    },
  ],
  // 11. Container With Most Water
  11: [
    {
      id: "11-1",
      input: "[1, 8, 6, 2, 5, 4, 8, 3, 7]",
      expectedOutput: "49",
      description: "Max area between index 1 and 8",
    },
    {
      id: "11-2",
      input: "[1, 1]",
      expectedOutput: "1",
      description: "Two vertical lines",
    },
  ],
  // 14. Longest Common Prefix
  14: [
    {
      id: "14-1",
      input: '["flower", "flow", "flight"]',
      expectedOutput: '"fl"',
      description: 'Common prefix "fl"',
    },
    {
      id: "14-2",
      input: '["dog", "racecar", "car"]',
      expectedOutput: '""',
      description: "No common prefix",
    },
  ],
  // 15. 3Sum
  15: [
    {
      id: "15-1",
      input: "[-1, 0, 1, 2, -1, -4]",
      expectedOutput: "[[-1, -1, 2], [-1, 0, 1]]",
      description: "Zero sum triplets",
    },
    {
      id: "15-2",
      input: "[0, 1, 1]",
      expectedOutput: "[]",
      description: "No triplet sums to 0",
    },
    {
      id: "15-3",
      input: "[0, 0, 0]",
      expectedOutput: "[[0, 0, 0]]",
      description: "All zeros",
    },
  ],
  // 20. Valid Parentheses
  20: [
    {
      id: "20-1",
      input: '"()"',
      expectedOutput: "true",
      description: "Single matching pair",
    },
    {
      id: "20-2",
      input: '"()[]{}"',
      expectedOutput: "true",
      description: "Multiple bracket types",
    },
    {
      id: "20-3",
      input: '"(]"',
      expectedOutput: "false",
      description: "Mismatched brackets",
    },
    {
      id: "20-4",
      input: '"([)]"',
      expectedOutput: "false",
      description: "Incorrect nesting",
    },
    {
      id: "20-5",
      input: '"{[]}"',
      expectedOutput: "true",
      description: "Nested brackets",
    },
  ],
  // 21. Merge Two Sorted Lists
  21: [
    {
      id: "21-1",
      input: "[1, 2, 4], [1, 3, 4]",
      expectedOutput: "[1, 1, 2, 3, 4, 4]",
      description: "Merge two non-empty lists",
    },
    {
      id: "21-2",
      input: "[], []",
      expectedOutput: "[]",
      description: "Empty lists",
    },
  ],
  // 26. Remove Duplicates from Sorted Array
  26: [
    {
      id: "26-1",
      input: "[1, 1, 2]",
      expectedOutput: "2",
      description: "Array with duplicate 1",
    },
    {
      id: "26-2",
      input: "[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]",
      expectedOutput: "5",
      description: "Multiple duplicates",
    },
  ],
  // 53. Maximum Subarray
  53: [
    {
      id: "53-1",
      input: "[-2, 1, -3, 4, -1, 2, 1, -5, 4]",
      expectedOutput: "6",
      description: "Subarray [4,-1,2,1] has max sum 6",
    },
    {
      id: "53-2",
      input: "[1]",
      expectedOutput: "1",
      description: "Single element",
    },
    {
      id: "53-3",
      input: "[5, 4, -1, 7, 8]",
      expectedOutput: "23",
      description: "All positive numbers",
    },
  ],
  // 70. Climbing Stairs
  70: [
    { id: "70-1", input: "2", expectedOutput: "2", description: "2 steps" },
    { id: "70-2", input: "3", expectedOutput: "3", description: "3 steps" },
    { id: "70-3", input: "4", expectedOutput: "5", description: "4 steps" },
  ],
  // 121. Best Time to Buy and Sell Stock
  121: [
    {
      id: "121-1",
      input: "[7, 1, 5, 3, 6, 4]",
      expectedOutput: "5",
      description: "Buy day 2 (price 1) and sell day 5 (price 6)",
    },
    {
      id: "121-2",
      input: "[7, 6, 4, 3, 1]",
      expectedOutput: "0",
      description: "Decreasing prices, no transaction",
    },
  ],
  // 125. Valid Palindrome
  125: [
    {
      id: "125-1",
      input: '"A man, a plan, a canal: Panama"',
      expectedOutput: "true",
      description: "Alphanumeric palindrome",
    },
    {
      id: "125-2",
      input: '"race a car"',
      expectedOutput: "false",
      description: "Not a palindrome",
    },
    {
      id: "125-3",
      input: '" "',
      expectedOutput: "true",
      description: "Empty string is palindrome",
    },
  ],
  // 136. Single Number
  136: [
    {
      id: "136-1",
      input: "[2, 2, 1]",
      expectedOutput: "1",
      description: "Single number 1",
    },
    {
      id: "136-2",
      input: "[4, 1, 2, 1, 2]",
      expectedOutput: "4",
      description: "Single number 4",
    },
    {
      id: "136-3",
      input: "[1]",
      expectedOutput: "1",
      description: "Single element",
    },
  ],
  // 141. Linked List Cycle
  141: [
    {
      id: "141-1",
      input: "[3, 2, 0, -4], 1",
      expectedOutput: "true",
      description: "Cycle connects to node index 1",
    },
    {
      id: "141-2",
      input: "[1], -1",
      expectedOutput: "false",
      description: "No cycle",
    },
  ],
  // 206. Reverse Linked List
  206: [
    {
      id: "206-1",
      input: "[1, 2, 3, 4, 5]",
      expectedOutput: "[5, 4, 3, 2, 1]",
      description: "Reverse 1->2->3->4->5",
    },
    {
      id: "206-2",
      input: "[1, 2]",
      expectedOutput: "[2, 1]",
      description: "Reverse 1->2",
    },
    {
      id: "206-3",
      input: "[]",
      expectedOutput: "[]",
      description: "Empty list",
    },
  ],
  // 217. Contains Duplicate
  217: [
    {
      id: "217-1",
      input: "[1, 2, 3, 1]",
      expectedOutput: "true",
      description: "Contains duplicate 1",
    },
    {
      id: "217-2",
      input: "[1, 2, 3, 4]",
      expectedOutput: "false",
      description: "All distinct elements",
    },
    {
      id: "217-3",
      input: "[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]",
      expectedOutput: "true",
      description: "Multiple duplicates",
    },
  ],
  // 226. Invert Binary Tree
  226: [
    {
      id: "226-1",
      input: "[4, 2, 7, 1, 3, 6, 9]",
      expectedOutput: "[4, 7, 2, 9, 6, 3, 1]",
      description: "Invert tree",
    },
    {
      id: "226-2",
      input: "[2, 1, 3]",
      expectedOutput: "[2, 3, 1]",
      description: "Invert 3-node tree",
    },
    {
      id: "226-3",
      input: "[]",
      expectedOutput: "[]",
      description: "Empty tree",
    },
  ],
  // 242. Valid Anagram
  242: [
    {
      id: "242-1",
      input: '"anagram", "nagaram"',
      expectedOutput: "true",
      description: "Valid anagram",
    },
    {
      id: "242-2",
      input: '"rat", "car"',
      expectedOutput: "false",
      description: "Not an anagram",
    },
  ],
  // 704. Binary Search
  704: [
    {
      id: "704-1",
      input: "[-1, 0, 3, 5, 9, 12], 9",
      expectedOutput: "4",
      description: "Target 9 at index 4",
    },
    {
      id: "704-2",
      input: "[-1, 0, 3, 5, 9, 12], 2",
      expectedOutput: "-1",
      description: "Target 2 not found",
    },
  ],
};

/**
 * Parses test cases from problemText markdown when not in curated dictionary.
 */
export function getTestCasesForProblem(
  problemId: number,
  problemText?: string,
): TestCase[] {
  if (CURATED_PROBLEM_TEST_CASES[problemId]) {
    return CURATED_PROBLEM_TEST_CASES[problemId];
  }

  if (!problemText) {
    return [
      {
        id: `${problemId}-1`,
        input: "",
        expectedOutput: "",
        description: "Custom test case",
      },
    ];
  }

  const cases: TestCase[] = [];
  const inputRegex = /Input:\s*([^\n]+)/gi;
  const outputRegex = /Output:\s*([^\n]+)/gi;
  let inMatch: RegExpExecArray | null;
  let outMatch: RegExpExecArray | null;
  const inputs: string[] = [];
  const outputs: string[] = [];

  while ((inMatch = inputRegex.exec(problemText)) !== null) {
    inputs.push(inMatch[1].trim().replace(/^`+|`+$/g, ""));
  }
  while ((outMatch = outputRegex.exec(problemText)) !== null) {
    outputs.push(outMatch[1].trim().replace(/^`+|`+$/g, ""));
  }

  for (let i = 0; i < Math.min(inputs.length, outputs.length); i++) {
    // Sanitize input: remove parameter variable labels like "nums = ", "target = "
    const cleanInput = inputs[i].replace(/[a-zA-Z0-9_$]+\s*=\s*/g, "");
    const cleanExpected = outputs[i].replace(/[a-zA-Z0-9_$]+\s*=\s*/g, "");
    cases.push({
      id: `${problemId}-${i + 1}`,
      input: cleanInput,
      expectedOutput: cleanExpected,
      description: `Example ${i + 1}`,
    });
  }

  if (cases.length === 0) {
    cases.push({
      id: `${problemId}-1`,
      input: "",
      expectedOutput: "",
      description: "Default test case",
    });
  }

  return cases;
}
