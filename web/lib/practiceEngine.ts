/**
 * Pure client-side JavaScript execution & test case evaluation engine.
 * Supports standard algorithms, functions, and data structure classes.
 */

export interface TestCase {
  id?: string;
  input: string;
  expectedOutput: string;
  description?: string;
  isCustom?: boolean;
  unorderedOutput?: boolean;
}

export interface TestCaseResult {
  testCaseId: string;
  passed: boolean;
  actual?: unknown;
  expected?: unknown;
  inputStr: string;
  logs: string[];
  durationMs: number;
  error?: string;
}

export interface ExecutionSummary {
  total: number;
  passed: number;
  failed: number;
  durationMs: number;
  results: TestCaseResult[];
  allPassed: boolean;
  hasError: boolean;
}

export function formatValue(v: unknown): string {
  if (v === undefined) return "undefined";
  if (v === null) return "null";
  if (typeof v === "string") return `"${v}"`;
  if (typeof v === "object") {
    try {
      return JSON.stringify(v, null, 2);
    } catch {
      return String(v);
    }
  }
  return String(v);
}

export function deepEqual(
  a: unknown,
  b: unknown,
  unorderedArrays = false,
): boolean {
  if (a === b) return true;
  if (a === null || b === null || a === undefined || b === undefined)
    return a === b;

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    // Strict order check first
    const strictMatch = a.every((val, idx) => deepEqual(val, b[idx]));
    if (strictMatch) return true;

    if (unorderedArrays && typeof a[0] !== "object") {
      try {
        const sortedA = [...a].sort();
        const sortedB = [...b].sort();
        if (sortedA.every((val, idx) => deepEqual(val, sortedB[idx])))
          return true;
      } catch {
        // continue
      }
    }
    return false;
  }

  // Handle plain objects
  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    const objectA = a as Record<string, unknown>;
    const objectB = b as Record<string, unknown>;
    return keysA.every((key) => deepEqual(objectA[key], objectB[key]));
  }

  // Handle numbers with precision tolerance (e.g. 1024.00000 == 1024)
  if (typeof a === "number" && typeof b === "number") {
    return Math.abs(a - b) < 1e-6;
  }

  return false;
}

interface SandboxResult {
  actual: unknown;
  expected: unknown;
  logs: string[];
}

function getSandboxSource(payload: string): string {
  return `<!doctype html><script>
    const payload = ${payload};
    const logs = [];
    const captureConsole = {
      log: (...args) => logs.push(args.map(value => typeof value === 'object' ? JSON.stringify(value) : String(value)).join(' ')),
      info: (...args) => logs.push('[INFO] ' + args.map(value => typeof value === 'object' ? JSON.stringify(value) : String(value)).join(' ')),
      warn: (...args) => logs.push('[WARN] ' + args.map(value => typeof value === 'object' ? JSON.stringify(value) : String(value)).join(' ')),
      error: (...args) => logs.push('[ERROR] ' + args.map(value => typeof value === 'object' ? JSON.stringify(value) : String(value)).join(' ')),
    };

    (async () => {
      try {
        const runner = new Function('captureConsole', \
          \`return (async function(console) {
            \${payload.userCode}

            const entryName = \${JSON.stringify(payload.entryFnName || '')};
            let target = null;
            try {
              if (entryName) target = eval(entryName);
            } catch (error) {}

            if (!target) {
              const common = ['solution', 'twoSum', 'solve', 'isValid', 'isPalindrome', 'mergeSort', 'quickSort', 'binarySearch', 'LRUCache', 'Trie', 'LinkedList', 'MinHeap', 'Queue', 'Stack'];
              for (const name of common) {
                try {
                  const value = eval(name);
                  if (typeof value === 'function') { target = value; break; }
                } catch (error) {}
              }
            }

            const isScenario = \${payload.isScenario};
            const args = isScenario ? [(\${payload.input})] : [\${payload.input}];
            const expected = (\${payload.expectedOutput});
            let actual;

            if (isScenario) {
              actual = args[0];
            } else if (target) {
              const isClass = typeof target === 'function' && /^\\s*class\\s+/.test(target.toString());
              actual = isClass ? new target(...args) : target(...args);
            } else if (args.length === 1) {
              actual = args[0];
            } else {
              throw new Error('Could not find entry function or class. Please make sure your solution function or class is defined.');
            }

            return { actual: await actual, expected };
          })(captureConsole);\`);
        const result = await runner(captureConsole);
        parent.postMessage({ type: 'interview-brain-runner-result', result: { ...result, logs } }, '*');
      } catch (error) {
        parent.postMessage({ type: 'interview-brain-runner-error', error: error instanceof Error ? error.message : String(error), logs }, '*');
      }
    })();
  <\/script>`;
}

function runInSandbox(
  userCode: string,
  entryFnName: string | undefined,
  testCase: TestCase,
  timeoutMs = 2_000,
): Promise<SandboxResult> {
  return new Promise((resolve, reject) => {
    const input = testCase.input.trim();
    const isScenario =
      input.startsWith("(function") || input.startsWith("(() =>");
    const iframe = document.createElement("iframe");
    const payload = JSON.stringify({
      userCode,
      entryFnName,
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      isScenario,
    }).replace(/</g, "\\u003c");

    const cleanup = () => {
      window.removeEventListener("message", handleMessage);
      window.clearTimeout(timeout);
      iframe.remove();
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) return;
      if (event.data?.type === "interview-brain-runner-result") {
        cleanup();
        resolve(event.data.result);
      }
      if (event.data?.type === "interview-brain-runner-error") {
        cleanup();
        reject(new Error(event.data.error));
      }
    };

    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error(`Execution timed out after ${timeoutMs}ms.`));
    }, timeoutMs);

    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.display = "none";
    iframe.srcdoc = getSandboxSource(payload);
    window.addEventListener("message", handleMessage);
    document.body.appendChild(iframe);
  });
}

export async function runTestCase(
  userCode: string,
  entryFnName: string | undefined,
  testCase: TestCase,
): Promise<TestCaseResult> {
  const start = performance.now();

  try {
    const { actual, expected, logs } = await runInSandbox(
      userCode,
      entryFnName,
      testCase,
    );
    const duration = performance.now() - start;
    const passed = deepEqual(actual, expected, testCase.unorderedOutput);

    return {
      testCaseId: testCase.id || "tc-1",
      passed,
      actual,
      expected,
      inputStr: testCase.input,
      logs,
      durationMs: Math.round(duration * 100) / 100,
    };
  } catch (err: unknown) {
    const duration = performance.now() - start;
    return {
      testCaseId: testCase.id || "tc-1",
      passed: false,
      error: err instanceof Error ? err.message : String(err),
      inputStr: testCase.input,
      expected: testCase.expectedOutput,
      logs: [],
      durationMs: Math.round(duration * 100) / 100,
    };
  }
}

export async function runAllTestCases(
  userCode: string,
  entryFnName: string | undefined,
  testCases: TestCase[],
): Promise<ExecutionSummary> {
  const start = performance.now();
  const results: TestCaseResult[] = [];
  let passedCount = 0;
  let hasError = false;

  for (const tc of testCases) {
    const res = await runTestCase(userCode, entryFnName, tc);
    results.push(res);
    if (res.passed) {
      passedCount++;
    }
    if (res.error) {
      hasError = true;
    }
  }

  const duration = performance.now() - start;

  return {
    total: testCases.length,
    passed: passedCount,
    failed: testCases.length - passedCount,
    durationMs: Math.round(duration * 100) / 100,
    results,
    allPassed: passedCount === testCases.length && testCases.length > 0,
    hasError,
  };
}

/**
 * Extracts starter boilerplate code from a solution string.
 */
export function extractStarterCode(
  solutionCode: string,
  title?: string,
): string {
  if (!solutionCode) return "// Write your solution here\n";

  // Check if class
  const classMatch = solutionCode.match(/class\s+([a-zA-Z0-9_$]+)[\s\S]*?\{/);
  if (classMatch) {
    return `class ${classMatch[1]} {\n  constructor() {\n    // Initialize data structures\n  }\n}`;
  }

  // Extract JSDoc + function signature
  const match = solutionCode.match(
    /(\/\*\*[\s\S]*?\*\/)?\s*(var|let|const|function)\s+([a-zA-Z0-9_$]+)\s*=?\s*(?:function|\([^)]*\)\s*=>|\()?/,
  );
  if (match) {
    const jsdoc = match[1] ? match[1].trim() + "\n" : "";
    // Find the opening brace of the function
    const firstBraceIdx = solutionCode.indexOf("{");
    if (firstBraceIdx !== -1) {
      const sig = solutionCode
        .slice(match[1] ? match[1].length : 0, firstBraceIdx + 1)
        .trim();
      return `${jsdoc}${sig}\n  // Write your code here\n};`;
    }
  }

  return `/**\n * Solution for ${title || "problem"}\n */\nfunction solution() {\n  // Write your code here\n}`;
}

/**
 * Detects the entry function or class name from code.
 */
export function detectEntryFunction(code: string): string | undefined {
  if (!code) return undefined;
  const classMatch = code.match(/class\s+([a-zA-Z0-9_$]+)/);
  if (classMatch) return classMatch[1];

  const fnMatch = code.match(
    /(?:var|let|const|function)\s+([a-zA-Z0-9_$]+)\s*(?:=\s*(?:function|\([^)]*\)\s*=>)|\()/,
  );
  if (fnMatch) return fnMatch[1];

  return undefined;
}
