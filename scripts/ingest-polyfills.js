/**
 * Curated JavaScript Polyfills & Machine Coding Arsenal
 * 14 essential high-frequency polyfills asked in Frontend & Fullstack interviews (BFE/GFE standard).
 */

const fs = require('fs');
const path = require('path');

const CLASSIC_FILE = path.join(__dirname, '..', 'classic-algorithms.json');
const WEB_CLASSIC_FILE = path.join(__dirname, '..', 'web', 'content', 'classic-algorithms.json');

const polyfills = [
  {
    id: 'polyfill-debounce',
    title: 'Debounce with Leading & Trailing Options',
    category: 'JavaScript Polyfills',
    difficulty: 'Medium',
    timeComplexity: 'O(1) execution per trigger',
    spaceComplexity: 'O(1) closure state',
    entryFunction: 'debounce',
    author: 'Interview Brain (Frontend Engineering Arsenal)',
    readme: `# Debounce Implementation

### Overview
A **debounced function** delays invoking the target callback until after \`wait\` milliseconds have elapsed since the last time the debounced function was invoked.

### Common Use Cases
- Search autocomplete input (waiting for candidate to pause typing before firing API request)
- Window resize or scroll recalculations
- Auto-saving draft text in form inputs

### Edge Cases to Handle
1. **Trailing vs Leading:** Some implementations require an immediate invocation on the leading edge.
2. **Context & Arguments:** Preserving \`this\` and passing all arguments to the original function.
3. **Cancel & Flush:** Methods to cancel scheduled execution or immediately flush it.`,
    starterCode: `/**
 * @param {Function} fn
 * @param {number} wait
 * @param {boolean} [immediate=false]
 * @return {Function}
 */
function debounce(fn, wait, immediate = false) {
  // Your implementation here
}`,
    code: `function debounce(fn, wait, immediate = false) {
  let timerId = null;

  function debounced(...args) {
    const context = this;
    const callNow = immediate && !timerId;

    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      timerId = null;
      if (!immediate) {
        fn.apply(context, args);
      }
    }, wait);

    if (callNow) {
      fn.apply(context, args);
    }
  }

  debounced.cancel = function() {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
  };

  return debounced;
}`,
    testCases: [
      {
        id: 'tc-1',
        input: `(() => {
  let count = 0;
  const inc = () => { count++; };
  const debounced = debounce(inc, 100);
  debounced();
  debounced();
  debounced();
  return count; // Synchronous check before timeout
})()`,
        expectedOutput: '0',
        description: 'Does not execute immediately when immediate=false'
      },
      {
        id: 'tc-2',
        input: `(() => {
  let count = 0;
  const inc = () => { count++; };
  const debounced = debounce(inc, 100, true);
  debounced();
  debounced();
  debounced();
  return count; // Immediate leading edge execution
})()`,
        expectedOutput: '1',
        description: 'Executes immediately once on leading edge when immediate=true'
      }
    ]
  },

  {
    id: 'polyfill-throttle',
    title: 'Throttle (Rate Limiter)',
    category: 'JavaScript Polyfills',
    difficulty: 'Medium',
    timeComplexity: 'O(1) execution per check',
    spaceComplexity: 'O(1) closure state',
    entryFunction: 'throttle',
    author: 'Interview Brain (Frontend Engineering Arsenal)',
    readme: `# Throttle Implementation

### Overview
A **throttled function** ensures that the underlying function is called at most once per specified duration (\`limit\` milliseconds).

### Difference from Debounce
- **Debounce:** "Wait until things calm down before running."
- **Throttle:** "Run at a regular cadence, no matter how many times triggered."

### Common Use Cases
- Continuous scroll position tracking (e.g. infinite scroll loading trigger)
- Mouse movement / drag-and-drop coordinate handlers
- Rate-limiting button clicks to prevent double-submissions`,
    starterCode: `/**
 * @param {Function} fn
 * @param {number} limit
 * @return {Function}
 */
function throttle(fn, limit) {
  // Your implementation here
}`,
    code: `function throttle(fn, limit) {
  let inThrottle = false;

  return function(...args) {
    const context = this;

    if (!inThrottle) {
      fn.apply(context, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}`,
    testCases: [
      {
        id: 'tc-1',
        input: `(() => {
  let count = 0;
  const throttled = throttle(() => { count++; }, 100);
  throttled();
  throttled();
  throttled();
  return count;
})()`,
        expectedOutput: '1',
        description: 'Executes first call immediately and ignores subsequent calls within window'
      }
    ]
  },

  {
    id: 'polyfill-promise-all',
    title: 'Promise.all Polyfill',
    category: 'JavaScript Polyfills',
    difficulty: 'Medium',
    timeComplexity: 'O(N) where N is number of promises',
    spaceComplexity: 'O(N) result array',
    entryFunction: 'promiseAll',
    author: 'Interview Brain (Frontend Engineering Arsenal)',
    readme: `# Promise.all Polyfill

### Overview
\`Promise.all\` takes an iterable of promises and returns a single Promise that:
1. Resolves when **all** input promises have resolved, returning an array of resolved values in the original input order.
2. Rejects immediately upon the **first** rejected promise with that rejection reason (fail-fast).

### Key Implementation Details
- Handle empty arrays immediately: \`if (promises.length === 0) resolve([])\`.
- Wrap non-promise values using \`Promise.resolve(item)\`.
- Do NOT push into an array blindly; assign to \`results[index]\` so asynchronous completion preserves input indices!`,
    starterCode: `/**
 * @param {Array<Promise|any>} promises
 * @return {Promise<Array<any>>}
 */
function promiseAll(promises) {
  // Your implementation here
}`,
    code: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'));
    }

    const n = promises.length;
    if (n === 0) {
      return resolve([]);
    }

    const results = new Array(n);
    let completed = 0;

    promises.forEach((p, index) => {
      Promise.resolve(p).then(
        val => {
          results[index] = val;
          completed++;
          if (completed === n) {
            resolve(results);
          }
        },
        err => {
          reject(err);
        }
      );
    });
  });
}`,
    testCases: [
      {
        id: 'tc-1',
        input: `[Promise.resolve(10), Promise.resolve(20), 30]`,
        expectedOutput: '[10, 20, 30]',
        description: 'Resolves all promises and non-promise values in correct order'
      },
      {
        id: 'tc-2',
        input: `[]`,
        expectedOutput: '[]',
        description: 'Empty array resolves immediately with empty array'
      }
    ]
  },

  {
    id: 'polyfill-promise-allsettled',
    title: 'Promise.allSettled Polyfill',
    category: 'JavaScript Polyfills',
    difficulty: 'Medium',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    entryFunction: 'promiseAllSettled',
    author: 'Interview Brain (Frontend Engineering Arsenal)',
    readme: `# Promise.allSettled Polyfill

### Overview
\`Promise.allSettled()\` returns a promise that fulfills after all given promises have either fulfilled or rejected, with an array of objects that each describe the outcome of each promise.

### Outcome Objects:
- Fulfilled: \`{ status: 'fulfilled', value: <result> }\`
- Rejected: \`{ status: 'rejected', reason: <error> }\``,
    starterCode: `/**
 * @param {Array<Promise|any>} promises
 * @return {Promise<Array<{status: string, value?: any, reason?: any}>>}
 */
function promiseAllSettled(promises) {
  // Your implementation here
}`,
    code: `function promiseAllSettled(promises) {
  return new Promise((resolve) => {
    if (!Array.isArray(promises) || promises.length === 0) {
      return resolve([]);
    }

    const results = new Array(promises.length);
    let settledCount = 0;

    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(value => {
          results[i] = { status: 'fulfilled', value };
        })
        .catch(reason => {
          results[i] = { status: 'rejected', reason };
        })
        .finally(() => {
          settledCount++;
          if (settledCount === promises.length) {
            resolve(results);
          }
        });
    });
  });
}`,
    testCases: [
      {
        id: 'tc-1',
        input: `[Promise.resolve(42), Promise.reject('error_msg')]`,
        expectedOutput: `[{"status":"fulfilled","value":42},{"status":"rejected","reason":"error_msg"}]`,
        description: 'Returns array of both fulfilled and rejected outcomes'
      }
    ]
  },

  {
    id: 'polyfill-deep-clone',
    title: 'Deep Clone (with Circular Reference Handling)',
    category: 'JavaScript Polyfills',
    difficulty: 'Hard',
    timeComplexity: 'O(N) where N is number of nodes/properties',
    spaceComplexity: 'O(N) for recursion stack & hash map',
    entryFunction: 'deepClone',
    author: 'Interview Brain (Frontend Engineering Arsenal)',
    readme: `# Deep Clone with Circular References

### Overview
Creating an exact deep duplicate of an arbitrary JavaScript object without keeping references to nested properties.

### Key Corner Cases
1. **Primitives & Null:** Return directly.
2. **Special Types:** \`Date\`, \`RegExp\` must create new instances (\`new Date(obj)\`, \`new RegExp(obj)\`).
3. **Circular References:** An object referencing itself (\`a.self = a\`) will cause infinite recursion without a cache. Use a \`WeakMap\` to track visited objects.
4. **Arrays vs Plain Objects:** Preserve prototype array nature.`,
    starterCode: `/**
 * @param {any} value
 * @param {WeakMap} [visited]
 * @return {any}
 */
function deepClone(value, visited = new WeakMap()) {
  // Your implementation here
}`,
    code: `function deepClone(value, visited = new WeakMap()) {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  if (visited.has(value)) {
    return visited.get(value);
  }

  const result = Array.isArray(value) ? [] : {};
  visited.set(value, result);

  for (const key of Object.keys(value)) {
    result[key] = deepClone(value[key], visited);
  }

  return result;
}`,
    testCases: [
      {
        id: 'tc-1',
        input: `(() => {
  const original = { a: 1, b: { c: [2, 3] } };
  const cloned = deepClone(original);
  cloned.b.c.push(4);
  return { originalLen: original.b.c.length, clonedLen: cloned.b.c.length, matches: cloned.a === original.a };
})()`,
        expectedOutput: `{"originalLen":2,"clonedLen":3,"matches":true}`,
        description: 'Deeply clones nested arrays and objects without mutating original'
      },
      {
        id: 'tc-2',
        input: `(() => {
  const obj = { name: 'root' };
  obj.self = obj;
  const cloned = deepClone(obj);
  return { hasSelf: cloned.self === cloned, notOriginal: cloned.self !== obj };
})()`,
        expectedOutput: `{"hasSelf":true,"notOriginal":true}`,
        description: 'Correctly preserves circular references without stack overflow'
      }
    ]
  },

  {
    id: 'polyfill-deep-equal',
    title: 'Deep Equal (Structural Equality)',
    category: 'JavaScript Polyfills',
    difficulty: 'Medium',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(D) call stack depth',
    entryFunction: 'deepEqual',
    author: 'Interview Brain (Frontend Engineering Arsenal)',
    readme: `# Deep Equality Comparator

### Overview
Recursively tests whether two values are structurally equivalent.
Commonly tested in interview rounds to evaluate understanding of JavaScript types, object keys, and NaN comparisons.`,
    starterCode: `/**
 * @param {any} a
 * @param {any} b
 * @return {boolean}
 */
function deepEqual(a, b) {
  // Your implementation here
}`,
    code: `function deepEqual(a, b) {
  if (a === b) return true;

  if (typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b)) {
    return true;
  }

  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }

  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}`,
    testCases: [
      {
        id: 'tc-1',
        input: `{ a: [1, 2, { b: 3 }], c: 'hello' }, { a: [1, 2, { b: 3 }], c: 'hello' }`,
        expectedOutput: 'true',
        description: 'Nested matching objects and arrays return true'
      },
      {
        id: 'tc-2',
        input: `{ a: 1, b: 2 }, { a: 1, b: 3 }`,
        expectedOutput: 'false',
        description: 'Mismatched values return false'
      }
    ]
  },

  {
    id: 'polyfill-event-emitter',
    title: 'Event Emitter (Pub/Sub Pattern)',
    category: 'JavaScript Polyfills',
    difficulty: 'Medium',
    timeComplexity: 'O(1) subscribe, O(K) emit where K is listener count',
    spaceComplexity: 'O(N * K) listener registry',
    entryFunction: 'EventEmitter',
    author: 'Interview Brain (Frontend Engineering Arsenal)',
    readme: `# Custom EventEmitter Implementation

### Overview
Implements the classic publish-subscribe messaging pattern in JavaScript.
Features \`.on(eventName, listener)\`, \`.off(eventName, listener)\`, \`.emit(eventName, ...args)\`, and \`.once(eventName, listener)\`.`,
    starterCode: `class EventEmitter {
  constructor() {
    // Your storage here
  }

  on(event, listener) {}
  off(event, listener) {}
  emit(event, ...args) {}
  once(event, listener) {}
}`,
    code: `class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(listener);
    return this;
  }

  off(event, listener) {
    if (!this.events.has(event)) return this;
    const filtered = this.events.get(event).filter(l => l !== listener && l._original !== listener);
    if (filtered.length === 0) {
      this.events.delete(event);
    } else {
      this.events.set(event, filtered);
    }
    return this;
  }

  emit(event, ...args) {
    if (!this.events.has(event)) return false;
    const listeners = [...this.events.get(event)];
    for (const listener of listeners) {
      listener.apply(this, args);
    }
    return true;
  }

  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener.apply(this, args);
    };
    wrapper._original = listener;
    this.on(event, wrapper);
    return this;
  }
}`,
    testCases: [
      {
        id: 'tc-1',
        input: `(() => {
  const ee = new EventEmitter();
  let total = 0;
  const add = (n) => { total += n; };
  ee.on('add', add);
  ee.emit('add', 5);
  ee.emit('add', 10);
  ee.off('add', add);
  ee.emit('add', 20);
  return total;
})()`,
        expectedOutput: '15',
        description: 'Correctly attaches listener, receives events, and unsubscribes with off'
      },
      {
        id: 'tc-2',
        input: `(() => {
  const ee = new EventEmitter();
  let count = 0;
  ee.once('click', () => { count++; });
  ee.emit('click');
  ee.emit('click');
  ee.emit('click');
  return count;
})()`,
        expectedOutput: '1',
        description: 'once() listener runs exactly once then unsubscribes automatically'
      }
    ]
  },

  {
    id: 'polyfill-curry',
    title: 'Currying Function (Auto-Curry)',
    category: 'JavaScript Polyfills',
    difficulty: 'Medium',
    timeComplexity: 'O(1) per partial call',
    spaceComplexity: 'O(A) accumulated arguments',
    entryFunction: 'curry',
    author: 'Interview Brain (Frontend Engineering Arsenal)',
    readme: `# Auto-Currying Function

### Overview
Transforms a function taking multiple arguments \`f(a, b, c)\` into a sequence of functions that each take one or more arguments until all expected parameters (\`fn.length\`) are supplied: \`f(a)(b)(c)\` or \`f(a, b)(c)\`.`,
    starterCode: `/**
 * @param {Function} fn
 * @return {Function}
 */
function curry(fn) {
  // Your implementation here
}`,
    code: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...nextArgs) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}`,
    testCases: [
      {
        id: 'tc-1',
        input: `(() => {
  const sum = (a, b, c) => a + b + c;
  const curriedSum = curry(sum);
  return [
    curriedSum(1)(2)(3),
    curriedSum(1, 2)(3),
    curriedSum(1)(2, 3)
  ];
})()`,
        expectedOutput: '[6, 6, 6]',
        description: 'Supports single-argument chain and grouped arguments'
      }
    ]
  },

  {
    id: 'polyfill-pipe-compose',
    title: 'Pipe & Compose Functions',
    category: 'JavaScript Polyfills',
    difficulty: 'Easy',
    timeComplexity: 'O(K) where K is number of functions',
    spaceComplexity: 'O(1)',
    entryFunction: 'pipe',
    author: 'Interview Brain (Frontend Engineering Arsenal)',
    readme: `# Pipe and Compose

### Overview
- **Pipe:** Executes functions left-to-right: \`pipe(f, g, h)(x) === h(g(f(x)))\`.
- **Compose:** Executes functions right-to-left: \`compose(f, g, h)(x) === f(g(h(x)))\`.`,
    starterCode: `/**
 * @param  {...Function} fns
 * @return {Function}
 */
function pipe(...fns) {
  // Your implementation here
}`,
    code: `function pipe(...fns) {
  return function(initialValue) {
    return fns.reduce((acc, fn) => fn(acc), initialValue);
  };
}

function compose(...fns) {
  return function(initialValue) {
    return fns.reduceRight((acc, fn) => fn(acc), initialValue);
  };
}`,
    testCases: [
      {
        id: 'tc-1',
        input: `(() => {
  const add2 = x => x + 2;
  const mult3 = x => x * 3;
  const subtract1 = x => x - 1;
  const piped = pipe(add2, mult3, subtract1);
  return piped(4); // (4 + 2) * 3 - 1 = 17
})()`,
        expectedOutput: '17',
        description: 'Executes transformation pipeline left to right'
      }
    ]
  },

  {
    id: 'polyfill-array-flat',
    title: 'Array.prototype.flat Polyfill',
    category: 'JavaScript Polyfills',
    difficulty: 'Easy',
    timeComplexity: 'O(N) total elements',
    spaceComplexity: 'O(D) call stack depth',
    entryFunction: 'flattenArray',
    author: 'Interview Brain (Frontend Engineering Arsenal)',
    readme: `# Array Flattening with Depth Limit

### Overview
Flattens nested array structures up to specified \`depth\` (default \`1\`).`,
    starterCode: `/**
 * @param {Array<any>} arr
 * @param {number} [depth=1]
 * @return {Array<any>}
 */
function flattenArray(arr, depth = 1) {
  // Your implementation here
}`,
    code: `function flattenArray(arr, depth = 1) {
  const result = [];

  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flattenArray(item, depth - 1));
    } else {
      result.push(item);
    }
  }

  return result;
}`,
    testCases: [
      {
        id: 'tc-1',
        input: `[1, [2, [3, [4, 5]]]], 2`,
        expectedOutput: '[1, 2, 3, [4, 5]]',
        description: 'Flattens up to depth 2'
      },
      {
        id: 'tc-2',
        input: `[1, 2, [3, 4]]`,
        expectedOutput: '[1, 2, 3, 4]',
        description: 'Default depth 1 flattens top-level nested array'
      }
    ]
  },

  {
    id: 'polyfill-array-reduce',
    title: 'Array.prototype.reduce Polyfill',
    category: 'JavaScript Polyfills',
    difficulty: 'Medium',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    entryFunction: 'myReduce',
    author: 'Interview Brain (Frontend Engineering Arsenal)',
    readme: `# Array.prototype.reduce Polyfill

### Overview
Executes a user-supplied "reducer" callback on each element of the array, passing in the return value from the calculation on the preceding element.

### Edge Cases
- Handling \`undefined\` or missing initial value.
- Throwing a \`TypeError\` if array is empty and no initial value is provided.`,
    starterCode: `/**
 * @param {Array<any>} arr
 * @param {Function} callback
 * @param {any} [initialValue]
 * @return {any}
 */
function myReduce(arr, callback, initialValue) {
  // Your implementation here
}`,
    code: `function myReduce(arr, callback, initialValue) {
  if (!Array.isArray(arr)) {
    throw new TypeError('First argument must be an array');
  }

  const hasInitial = arguments.length > 2;
  if (arr.length === 0 && !hasInitial) {
    throw new TypeError('Reduce of empty array with no initial value');
  }

  let accumulator = hasInitial ? initialValue : arr[0];
  const startIndex = hasInitial ? 0 : 1;

  for (let i = startIndex; i < arr.length; i++) {
    accumulator = callback(accumulator, arr[i], i, arr);
  }

  return accumulator;
}`,
    testCases: [
      {
        id: 'tc-1',
        input: `[1, 2, 3, 4], (acc, x) => acc + x, 10`,
        expectedOutput: '20',
        description: 'Reduces array with initial value'
      },
      {
        id: 'tc-2',
        input: `[1, 2, 3, 4], (acc, x) => acc * x`,
        expectedOutput: '24',
        description: 'Reduces array without initial value using first element'
      }
    ]
  },

  {
    id: 'polyfill-function-bind',
    title: 'Function.prototype.bind Polyfill',
    category: 'JavaScript Polyfills',
    difficulty: 'Medium',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(A) bound arguments',
    entryFunction: 'myBind',
    author: 'Interview Brain (Frontend Engineering Arsenal)',
    readme: `# Function.prototype.bind Polyfill

### Overview
Creates a new function that, when called, has its \`this\` keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function is called.`,
    starterCode: `/**
 * @param {Function} fn
 * @param {any} context
 * @param {...any} boundArgs
 * @return {Function}
 */
function myBind(fn, context, ...boundArgs) {
  // Your implementation here
}`,
    code: `function myBind(fn, context, ...boundArgs) {
  if (typeof fn !== 'function') {
    throw new TypeError('Bound target must be callable');
  }

  return function boundFn(...callArgs) {
    const isNew = this instanceof boundFn;
    return fn.apply(isNew ? this : context, [...boundArgs, ...callArgs]);
  };
}`,
    testCases: [
      {
        id: 'tc-1',
        input: `(() => {
  function greet(greeting, punctuation) {
    return greeting + ', ' + this.name + punctuation;
  }
  const bound = myBind(greet, { name: 'Alice' }, 'Hello');
  return bound('!');
})()`,
        expectedOutput: '"Hello, Alice!"',
        description: 'Binds this context and prepends partial arguments'
      }
    ]
  },

  {
    id: 'polyfill-memoize',
    title: 'Memoize (Function Result Caching)',
    category: 'JavaScript Polyfills',
    difficulty: 'Easy',
    timeComplexity: 'O(1) on cache hit',
    spaceComplexity: 'O(N) cache entries',
    entryFunction: 'memoize',
    author: 'Interview Brain (Frontend Engineering Arsenal)',
    readme: `# Memoize Utility

### Overview
Caches the results of pure function calls to avoid redundant expensive recalculations with identical arguments.`,
    starterCode: `/**
 * @param {Function} fn
 * @param {Function} [resolver]
 * @return {Function}
 */
function memoize(fn, resolver) {
  // Your implementation here
}`,
    code: `function memoize(fn, resolver) {
  const cache = new Map();

  return function(...args) {
    const key = resolver ? resolver.apply(this, args) : JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`,
    testCases: [
      {
        id: 'tc-1',
        input: `(() => {
  let calls = 0;
  const square = (n) => { calls++; return n * n; };
  const memoized = memoize(square);
  const a = memoized(5);
  const b = memoized(5);
  const c = memoized(5);
  return { a, b, c, calls };
})()`,
        expectedOutput: `{"a":25,"b":25,"c":25,"calls":1}`,
        description: 'Returns cached value on repeated calls without invoking underlying function'
      }
    ]
  }
];

function run() {
  let existing = [];
  if (fs.existsSync(CLASSIC_FILE)) {
    try {
      existing = JSON.parse(fs.readFileSync(CLASSIC_FILE, 'utf8'));
    } catch (e) {
      console.error('Failed to read existing classic-algorithms.json', e);
    }
  }

  // Filter out any older polyfill entries to avoid duplicates
  const nonPolyfills = existing.filter(x => x.category !== 'JavaScript Polyfills');
  const merged = [...nonPolyfills, ...polyfills];

  fs.writeFileSync(CLASSIC_FILE, JSON.stringify(merged, null, 2), 'utf8');
  fs.writeFileSync(WEB_CLASSIC_FILE, JSON.stringify(merged, null, 2), 'utf8');

  console.log(`Successfully merged ${polyfills.length} JavaScript polyfills. Total algorithms: ${merged.length}`);
}

run();
