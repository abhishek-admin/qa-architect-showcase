/* questions.js — 300+ questions across sectors and difficulty levels */
/* eslint-disable */
var QA_QUESTIONS = (function() {
  var bank = {

    playwright: {
      basic: [
        { q:"What is Playwright?", a:"Playwright is a Microsoft-backed async-first browser automation library supporting Chromium, Firefox, and WebKit from a single API.", hint:"Think: what makes it different from Selenium?" },
        { q:"How do you install Playwright in a Node.js project?", a:"Run `npm init playwright@latest` — it installs the package, downloads browsers, and creates a starter config and spec file.", hint:"npm command" },
        { q:"What is the difference between `page.click()` and `locator.click()`?", a:"`page.click(selector)` is a shorthand that creates a temporary locator and clicks. `locator.click()` uses a Locator object that has built-in retry, filtering, and chaining — preferred for reliability.", hint:"Which is more reliable?" },
        { q:"What does Playwright's auto-wait do?", a:"Before every actionable API call, Playwright waits for the element to be: attached to DOM, visible, stable (not animating), enabled, and not obscured.", hint:"Think: what 5 checks does it do?" },
        { q:"How do you navigate to a URL in Playwright?", a:"`await page.goto('https://example.com');` — also accepts options like `{ waitUntil: 'networkidle' }`.", hint:"page.goto()" },
        { q:"How do you fill a text input in Playwright?", a:"`await page.getByLabel('Username').fill('user@test.com');` — clears existing value first then types the new value.", hint:"getByLabel + fill" },
        { q:"What is a Locator in Playwright?", a:"A lazy reference to a DOM element. Unlike ElementHandle, a Locator re-queries the DOM on every action, making it resilient to re-renders. Created with `page.locator()`, `page.getByRole()`, etc.", hint:"Lazy + re-queries on every use" },
        { q:"Name 4 semantic locator methods in Playwright.", a:"`getByRole()`, `getByLabel()`, `getByText()`, `getByPlaceholder()`, `getByTestId()`, `getByAltText()`. Semantic locators are preferred over CSS/XPath as they reflect how users interact with the UI.", hint:"get By Role / Label / Text / Placeholder" },
        { q:"How do you assert that an element is visible?", a:"`await expect(page.locator('.modal')).toBeVisible();` — Playwright retries the assertion until the timeout is reached.", hint:"expect().toBeVisible()" },
        { q:"How do you assert a page URL?", a:"`await expect(page).toHaveURL(/dashboard/);` — accepts string or regex.", hint:"expect(page).toHaveURL()" }
      ],
      intermediate: [
        { q:"How do you mock an API response in Playwright?", a:"`await page.route('**/api/users', route => route.fulfill({ status: 200, json: [{ id: 1 }] }));` — must be called before the network request fires.", hint:"page.route + route.fulfill" },
        { q:"How do you capture a network request's payload in Playwright?", a:"`page.waitForRequest(req => req.url().includes('/api/save'))` then `req.postData()` to read the body.", hint:"waitForRequest + postData()" },
        { q:"How do you run tests in parallel in Playwright?", a:"Set `workers: N` in playwright.config.js. Set `fullyParallel: true` to also parallelize within spec files. Each worker gets an isolated browser context.", hint:"workers config + fullyParallel" },
        { q:"What is `storageState` used for in Playwright?", a:"Saves cookies and localStorage to a JSON file after login. Set `use: { storageState: 'auth.json' }` in config to reuse it — avoids repeating login UI in every test.", hint:"Persisting login across tests" },
        { q:"How do you handle file downloads in Playwright?", a:"Use `Promise.all([page.waitForEvent('download'), page.click('#download-btn')])` to catch the download event, then `download.path()` to get the saved file path.", hint:"waitForEvent('download')" },
        { q:"How do you test multi-tab/multi-window flows?", a:"`Promise.all([context.waitForEvent('page'), page.click('a[target=_blank]')])` to catch the new page event synchronously with the click.", hint:"context.waitForEvent('page')" },
        { q:"What is `page.waitForResponse()` and when is it better than UI assertions?", a:"Waits for a matching HTTP response. Better than waiting for a spinner to disappear because it asserts the actual data contract, not just a visual indicator.", hint:"Deterministic vs visual waiting" },
        { q:"Explain Playwright Fixtures.", a:"Fixtures are dependency-injected values for each test. Built-ins: page, browser, context, request. Custom: `test.extend({ myFixture: async ({ page }, use) => { await use(new MyPage(page)); } })`.", hint:"test.extend + use callback" },
        { q:"How do you handle Shadow DOM in Playwright?", a:"Playwright automatically pierces open Shadow DOM. Chain locators: `page.locator('host-element').locator('button')`. CSS selectors cannot pierce shadow roots but Playwright's engine can.", hint:"Automatic piercing for open shadow DOM" },
        { q:"How do you take screenshots on test failure automatically?", a:"Set `screenshot: 'only-on-failure'` in playwright.config.js `use` block. Also set `trace: 'on-first-retry'` for full timeline debugging.", hint:"playwright.config use block" }
      ],
      advanced: [
        { q:"How do you shard Playwright tests across multiple CI agents?", a:"Use `--shard=1/4` flag on each agent. Run 4 agents with shards 1/4, 2/4, 3/4, 4/4. Then `npx playwright merge-reports` to combine blob reports into one HTML report.", hint:"--shard flag + merge-reports" },
        { q:"Write a Playwright global-setup that logs in and saves auth state.", a:"Create `global-setup.js`, launch browser, navigate to login, fill credentials, click submit, `await page.context().storageState({ path: 'auth.json' })`, close browser. Reference in config: `globalSetup: './global-setup.js'`.", hint:"chromium.launch → storageState → close" },
        { q:"How do you modify a real API response in-flight without fully mocking it?", a:"`page.route(url, async route => { const resp = await route.fetch(); const json = await resp.json(); json.extra = 'value'; await route.fulfill({ response: resp, json }); })`", hint:"route.fetch() then route.fulfill() with modified json" },
        { q:"What are soft assertions and when do you use them?", a:"`expect.soft(locator).toBeVisible()` — test continues even if this assertion fails. All soft failures are reported together at the end. Use for audit pages where you want to capture ALL missing fields at once.", hint:"expect.soft — continues on failure" },
        { q:"How do you implement visual regression testing in Playwright?", a:"`await expect(page.locator('.card')).toHaveScreenshot('card.png', { maxDiffPixels: 50 });` — creates baseline on first run, diffs on subsequent runs. Update with `--update-snapshots`.", hint:"toHaveScreenshot + maxDiffPixels" },
        { q:"How do you run accessibility audits with Playwright?", a:"Use `@axe-core/playwright`: `const results = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();` then `expect(results.violations).toHaveLength(0);`", hint:"AxeBuilder + analyze()" },
        { q:"How do you type a custom Playwright fixture in TypeScript?", a:"`type MyFixtures = { loginPage: LoginPage }; export const test = base.extend<MyFixtures>({ loginPage: async ({ page }, use) => { await use(new LoginPage(page)); } });`", hint:"base.extend<Type>({...})" },
        { q:"Explain how to detect and prevent flaky tests in a large Playwright suite.", a:"Enable `trace: 'on-first-retry'`. Use `--repeat-each=5` locally to reproduce. Common causes: missing await, timing-dependent locators (switch to getByRole), shared test data (make unique per test), animations (set animations: 'disabled' in context).", hint:"trace + repeat-each + root causes" }
      ]
    },

    javascript: {
      basic: [
        { q:"What is the difference between `var`, `let`, and `const`?", a:"`var` is function-scoped and hoisted. `let` and `const` are block-scoped. `const` cannot be reassigned (but its object properties can be mutated). Prefer `const` by default, `let` when reassignment is needed, never `var`.", hint:"Scope + hoisting differences" },
        { q:"What is `===` vs `==` in JavaScript?", a:"`===` strict equality: no type coercion (`'5' === 5` → false). `==` loose equality: coerces types (`'5' == 5` → true). Always use `===` in production code.", hint:"Type coercion" },
        { q:"What is a closure in JavaScript?", a:"A function that retains access to its outer scope's variables even after the outer function has returned. Used for data encapsulation, factory functions, and callbacks.", hint:"Function + retained outer scope" },
        { q:"What is the difference between `null` and `undefined`?", a:"`undefined` means a variable was declared but not assigned. `null` is an explicit empty value assignment. `typeof null === 'object'` is a known JS bug.", hint:"Declared vs explicitly empty" },
        { q:"What is `typeof` and what does it return for null?", a:"`typeof` returns a string: 'string', 'number', 'boolean', 'object', 'function', 'undefined', 'symbol', 'bigint'. `typeof null === 'object'` — this is a historical bug in JS.", hint:"Bug: null returns 'object'" },
        { q:"What is the difference between `for...of` and `for...in`?", a:"`for...of` iterates over iterable values (arrays, strings, Sets, Maps). `for...in` iterates over enumerable property KEYS of an object. Never use `for...in` on arrays.", hint:"Values vs keys" },
        { q:"What is `Array.prototype.map()` vs `forEach()`?", a:"`map()` returns a new array with transformed values. `forEach()` returns `undefined` — only for side effects. Use `map` when you need the result.", hint:"map returns new array, forEach returns undefined" },
        { q:"What is event delegation?", a:"Attaching one event listener to a parent element instead of individual listeners on each child. Uses event bubbling. The listener checks `event.target` to identify which child was clicked. More efficient for dynamic lists.", hint:"One listener on parent, check event.target" },
        { q:"What is `this` in JavaScript?", a:"`this` refers to the calling context. In a regular function: the object that called it. In arrow functions: lexically inherited from the surrounding scope. In strict mode global context: `undefined`.", hint:"Calling context vs lexical scope" },
        { q:"What is the difference between `call()`, `apply()`, and `bind()`?", a:"All three set `this`. `call(thisArg, arg1, arg2)` invokes immediately with individual args. `apply(thisArg, [args])` invokes immediately with array. `bind(thisArg)` returns a new function with `this` bound, not invoked immediately.", hint:"call/apply: immediate; bind: returns new function" }
      ],
      intermediate: [
        { q:"What is a Promise and how does it differ from a callback?", a:"A Promise is an object representing eventual completion or failure of async work. Promises chain with `.then()/.catch()` avoiding callback hell. Promises have 3 states: pending, fulfilled, rejected.", hint:"Pending/fulfilled/rejected, no callback hell" },
        { q:"Explain async/await.", a:"Syntactic sugar over Promises. `async` functions always return a Promise. `await` pauses execution until the Promise resolves. Makes async code look synchronous. Every `await` must be inside an `async` function.", hint:"Sugar over Promises, must be inside async" },
        { q:"What is the event loop in JavaScript?", a:"JS is single-threaded. The event loop picks tasks from the callback queue (macrotasks) and microtask queue (Promises). Microtasks (Promise callbacks) run before the next macrotask (setTimeout, I/O). Call stack must be empty first.", hint:"Microtasks before macrotasks" },
        { q:"What is `Promise.all()` vs `Promise.race()` vs `Promise.allSettled()`?", a:"`Promise.all()`: resolves when ALL resolve, rejects if ANY rejects. `Promise.race()`: resolves/rejects as soon as the FIRST settles. `Promise.allSettled()`: waits for ALL, returns array of { status, value/reason } — never rejects.", hint:"All/First/All-regardless" },
        { q:"What is destructuring in JavaScript?", a:"Extracting values from arrays or properties from objects into distinct variables. `const { name, age } = user;` or `const [first, second] = arr;`. Supports defaults and renaming: `const { name: userName = 'guest' } = user;`", hint:"Extract from object/array" },
        { q:"What is the spread operator `...` and rest parameters?", a:"Spread `...arr` expands an iterable into individual elements (for function calls or array/object literals). Rest `...args` collects remaining function arguments into an array.", hint:"Spread expands, rest collects" },
        { q:"What is a generator function?", a:"A function that can pause and resume using `yield`. Returns an iterator. Useful for lazy sequences, infinite ranges, async control flow. `function* gen() { yield 1; yield 2; }`", hint:"function* + yield = pauseable" },
        { q:"What is memoization?", a:"Caching the result of a function call for given inputs to avoid redundant computation. Implement by storing results in a Map keyed by arguments. Used in React (useMemo), recursive algorithms (fibonacci), expensive computations.", hint:"Cache by input args" },
        { q:"What is the difference between deep copy and shallow copy?", a:"Shallow copy copies only the top level — nested objects are still referenced. Deep copy recursively copies all levels. Shallow: `Object.assign({}, obj)` or `{...obj}`. Deep: `JSON.parse(JSON.stringify(obj))` (loses functions) or `structuredClone(obj)`.", hint:"References vs full recursion" },
        { q:"What are WeakMap and WeakSet?", a:"Like Map/Set but keys/values must be objects, and references are held weakly — they don't prevent garbage collection. Useful for private data stores on objects without causing memory leaks.", hint:"Weak references = GC friendly" }
      ],
      advanced: [
        { q:"Explain the prototype chain in JavaScript.", a:"Every object has a `__proto__` link to its prototype. When a property is not found on an object, JS walks up the prototype chain until it finds it or reaches `null`. `Object.create()` sets the prototype explicitly.", hint:"__proto__ chain → null" },
        { q:"What is a Proxy object in JavaScript?", a:"Wraps an object and intercepts operations (get, set, delete, apply). Used for validation, logging, reactive systems (Vue 3 reactivity), API virtualization. `new Proxy(target, handler)` where handler defines traps.", hint:"Intercept get/set/apply traps" },
        { q:"What is tail call optimization?", a:"If the last operation of a function is a recursive call, the engine can reuse the current stack frame instead of creating a new one. Prevents stack overflow. Only guaranteed in strict mode in ES6+.", hint:"Last call = reuse stack frame" },
        { q:"What is the difference between microtasks and macrotasks?", a:"Macrotasks: setTimeout, setInterval, I/O, UI rendering — one per event loop iteration. Microtasks: Promise.then, queueMicrotask — ALL microtasks drain before the next macrotask. `console.log(1); setTimeout(()=>console.log(2),0); Promise.resolve().then(()=>console.log(3));` → 1,3,2", hint:"Microtasks drain before next macrotask" },
        { q:"Implement a debounce function.", a:"`function debounce(fn, delay) { let timer; return function(...args) { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), delay); }; }` — delays execution until N ms after last call.", hint:"clearTimeout on each call, setTimeout" },
        { q:"Implement a throttle function.", a:"`function throttle(fn, limit) { let last = 0; return function(...args) { const now = Date.now(); if (now - last >= limit) { last = now; fn.apply(this, args); } }; }` — executes at most once per N ms.", hint:"Track last execution timestamp" },
        { q:"What is currying? Write an example.", a:"Transforming a function with multiple args into a sequence of single-arg functions. `const add = a => b => a + b; add(2)(3) // 5`. Used for partial application and composing reusable functions.", hint:"f(a)(b)(c) from f(a,b,c)" },
        { q:"Explain Symbol in JavaScript.", a:"A primitive type that creates a unique, immutable identifier. `Symbol('foo') !== Symbol('foo')`. Used as unique object property keys (no accidental name collisions), well-known symbols (`Symbol.iterator`, `Symbol.toPrimitive`).", hint:"Unique, immutable, used as property keys" }
      ]
    },

    typescript: {
      basic: [
        { q:"What is TypeScript and why use it over JavaScript?", a:"TypeScript is a statically-typed superset of JavaScript that compiles to plain JS. Benefits: catch type errors at compile time, autocomplete, safer refactoring, self-documenting code. Trade-off: compilation step, more verbose.", hint:"Statically typed superset of JS" },
        { q:"What is the difference between `type` and `interface`?", a:"Both define object shapes. `interface` is extendable (declaration merging, `extends`), better for public APIs. `type` supports unions, intersections, mapped types, tuples — more flexible. Prefer `interface` for objects, `type` for everything else.", hint:"interface: extendable; type: flexible/unions" },
        { q:"What is type inference in TypeScript?", a:"TypeScript infers the type of a variable from its initial value without explicit annotation. `const x = 5;` → TS infers `x: number`. Explicit annotations only needed when inference is wrong or unclear.", hint:"TS guesses the type from value" },
        { q:"What is `any` vs `unknown` in TypeScript?", a:"`any` opts out of type checking — dangerous. `unknown` is the type-safe counterpart: you must narrow it with a type guard before using it. Prefer `unknown` for external data (API responses, user input).", hint:"unknown requires narrowing; any skips it" },
        { q:"What is a union type?", a:"A type that can be one of several types. `type Status = 'draft' | 'active' | 'cancelled';` or `type ID = string | number;`. TypeScript narrows the type in conditional branches.", hint:"A | B — either A or B" },
        { q:"What is `readonly` in TypeScript?", a:"Marks a property as immutable after object creation. `readonly id: string;` — attempting to reassign causes a compile error. `Readonly<T>` makes all properties of T readonly.", hint:"Immutable after creation" },
        { q:"What is the `never` type?", a:"Represents a value that never occurs. A function that always throws or loops forever returns `never`. Used in exhaustive checks: if you handle all union cases, the default branch should be `never`.", hint:"Unreachable code / always throws" },
        { q:"What is `optional chaining` (`?.`) in TypeScript?", a:"Short-circuits to `undefined` if the left-hand side is null/undefined instead of throwing. `user?.address?.city` returns `undefined` if `user` or `address` is null. Safer than manual null checks.", hint:"Returns undefined instead of throwing" },
        { q:"What is the `!` non-null assertion operator?", a:"Tells TypeScript 'trust me, this is not null/undefined' — no runtime check. `element!.click()` compiles but crashes if element is null. Use sparingly; prefer optional chaining or explicit guards.", hint:"No runtime check — compile time only" },
        { q:"What are generics in TypeScript?", a:"Type parameters that allow writing reusable, type-safe code. `function identity<T>(arg: T): T { return arg; }` — T is filled in by the caller. Prevents `any` while maintaining flexibility.", hint:"Type placeholder filled by caller" }
      ],
      intermediate: [
        { q:"What is a mapped type in TypeScript?", a:"Creates a new type by transforming each property of an existing type. `type Readonly<T> = { readonly [K in keyof T]: T[K] };`. Built-ins: `Partial<T>`, `Required<T>`, `Pick<T,K>`, `Omit<T,K>`.", hint:"{ [K in keyof T]: ... }" },
        { q:"What is a conditional type?", a:"`T extends U ? X : Y` — a type that resolves to X if T extends U, else Y. Used in: `type NonNullable<T> = T extends null | undefined ? never : T;`", hint:"T extends U ? X : Y" },
        { q:"What is `keyof` in TypeScript?", a:"`keyof T` produces a union of all property keys of T. `type Keys = keyof { name: string; age: number }` → `'name' | 'age'`. Used in generic constraints to enforce valid property access.", hint:"Union of all property keys" },
        { q:"What is a type guard?", a:"A runtime check that narrows a type within a conditional block. `function isString(x: unknown): x is string { return typeof x === 'string'; }` — after the check, TS knows x is string.", hint:"x is T — narrows in conditional" },
        { q:"What are utility types? Name 5.", a:"`Partial<T>` (all optional), `Required<T>` (all required), `Readonly<T>` (all readonly), `Pick<T,K>` (subset of keys), `Omit<T,K>` (exclude keys), `Record<K,V>` (key-value map), `ReturnType<F>` (function return type).", hint:"Partial, Required, Readonly, Pick, Omit..." },
        { q:"What is declaration merging in TypeScript?", a:"Multiple `interface` declarations with the same name are merged into one. Useful for extending library types: `interface Window { myAppState: AppState; }` adds to the global Window type without modifying the library.", hint:"Same interface name = merged" },
        { q:"What is a discriminated union?", a:"A union of types where each member has a common literal property that uniquely identifies it. `type Shape = { kind: 'circle'; radius: number } | { kind: 'square'; side: number };` — switch on `kind` for exhaustive handling.", hint:"Common literal 'kind' field for narrowing" },
        { q:"What is `infer` in TypeScript conditional types?", a:"Extracts a type from a conditional type expression. `type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;` — `infer R` captures the return type of function T.", hint:"Captures unknown part of a matched type" }
      ],
      advanced: [
        { q:"Implement a DeepReadonly<T> type.", a:"`type DeepReadonly<T> = { readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K] };` — recursively makes all nested properties readonly.", hint:"Recursive mapped type" },
        { q:"What is the Exclude and Extract utility type?", a:"`Exclude<T, U>` removes from T the types assignable to U: `Exclude<'a'|'b'|'c', 'a'>` → `'b'|'c'`. `Extract<T, U>` keeps only those assignable to U: `Extract<'a'|'b', 'a'|'d'>` → `'a'`.", hint:"Exclude removes; Extract keeps" },
        { q:"What is covariance and contravariance in TypeScript?", a:"Covariance: a type is assignable to its supertypes (function return types). Contravariance: a subtype accepts a wider type (function parameters). TypeScript uses structural subtyping — generally covariant for properties, contravariant for function parameters in strict mode.", hint:"Return types covariant; params contravariant" },
        { q:"How do you create a recursive generic type for a JSON value?", a:"`type JSONValue = string | number | boolean | null | JSONObject | JSONArray; interface JSONObject { [key: string]: JSONValue; } interface JSONArray extends Array<JSONValue> {}`", hint:"Union + recursive interface" },
        { q:"What is `satisfies` operator in TypeScript 4.9+?", a:"Validates that a value satisfies a type without widening it to that type. `const palette = { red: [255, 0, 0] } satisfies Record<string, [number,number,number]>;` — `palette.red` is still typed as `number[]`, not `unknown`.", hint:"Validate type without widening" },
        { q:"How do you type an EventEmitter with typed events in TypeScript?", a:"Use a generic event map: `type EventMap = { click: MouseEvent; change: Event; }; class Emitter<M> { on<K extends keyof M>(event: K, handler: (e: M[K]) => void): void {} }` — ensures handler receives the correct event type.", hint:"Generic event map with keyof" }
      ]
    },

    java: {
      basic: [
        { q:"What is the difference between `==` and `.equals()` in Java?", a:"`==` compares references (memory addresses) for objects. `.equals()` compares logical equality (content). For String: `'hello' == 'hello'` may be true due to string pool, but always use `.equals()` for content comparison.", hint:"References vs content" },
        { q:"What is the difference between `ArrayList` and `LinkedList`?", a:"ArrayList uses a dynamic array — O(1) random access, O(n) insert/delete in middle. LinkedList uses doubly-linked nodes — O(n) access, O(1) insert/delete at known position. Use ArrayList for most cases; LinkedList for frequent insertions at ends.", hint:"Array vs linked nodes — access vs insertion" },
        { q:"What is `final`, `finally`, `finalize` in Java?", a:"`final`: keyword for constants, non-overridable methods, non-extendable classes. `finally`: block in try-catch that always executes. `finalize()`: deprecated Object method called before GC (do not use).", hint:"Three completely different things" },
        { q:"What is the difference between `abstract class` and `interface`?", a:"Abstract class: can have state (fields), constructors, concrete methods, single inheritance. Interface: all abstract by default (Java 8+ allows default/static methods), multiple implementation, no constructors/state.", hint:"State+single-inherit vs multiple-implement" },
        { q:"What is method overloading vs overriding?", a:"Overloading: same method name, different parameter types/count, resolved at compile time. Overriding: subclass provides a different implementation of a parent method, resolved at runtime (polymorphism).", hint:"Compile-time vs runtime resolution" },
        { q:"What is autoboxing in Java?", a:"Automatic conversion between primitive types (int, double) and their wrapper classes (Integer, Double). `Integer x = 5;` autoboxes int to Integer. `int y = x;` unboxes. Beware: NullPointerException when unboxing null.", hint:"Primitive ↔ Wrapper auto-conversion" },
        { q:"What is the difference between `HashMap` and `Hashtable`?", a:"HashMap: not thread-safe, allows one null key, faster. Hashtable: thread-safe (synchronized), no null keys/values, legacy. Use ConcurrentHashMap for thread-safe HashMap behavior.", hint:"Thread safety + null keys" },
        { q:"What is a checked vs unchecked exception?", a:"Checked: must be declared in method signature or caught (IOException, SQLException). Unchecked/RuntimeException: programming errors, not required to be caught (NullPointerException, ArrayIndexOutOfBoundsException).", hint:"Must-catch vs optional-catch" },
        { q:"What is `static` in Java?", a:"`static` members belong to the class, not instances. `static` methods can't access instance fields. `static` blocks run once at class loading. `static final` = constant. Accessed via `ClassName.member`.", hint:"Class-level, not instance-level" },
        { q:"What is garbage collection in Java?", a:"Automatic memory management. The JVM's GC identifies and removes objects with no live references. Cannot be forced (only `System.gc()` is a hint). Modern GCs: G1, ZGC, Shenandoah.", hint:"Automatic — removes unreachable objects" }
      ],
      intermediate: [
        { q:"What is the Java Collections Framework hierarchy?", a:"Iterable → Collection → List (ArrayList, LinkedList), Set (HashSet, TreeSet), Queue (PriorityQueue). Map (not Collection): HashMap, TreeMap, LinkedHashMap. Concurrent: ConcurrentHashMap, CopyOnWriteArrayList.", hint:"List/Set/Queue extend Collection; Map is separate" },
        { q:"What is the difference between `Comparable` and `Comparator`?", a:"`Comparable`: the class implements `compareTo()` — natural ordering baked into the class. `Comparator`: external, passed to sort methods, allows multiple orderings. `Collections.sort(list, comparator)`.", hint:"Internal vs external ordering" },
        { q:"Explain Java's memory model: heap vs stack.", a:"Stack: thread-local, method call frames, local variables, references. Heap: shared, all objects live here. Young Generation (Eden, Survivor) for short-lived objects; Old Generation for long-lived. PermGen replaced by Metaspace in Java 8.", hint:"Stack=frames/refs; Heap=objects" },
        { q:"What is a lambda expression in Java?", a:"An anonymous function: `(params) -> body`. Requires a functional interface (one abstract method). Example: `Comparator<String> c = (a, b) -> a.compareTo(b);`. Enables functional programming style in Java 8+.", hint:"(params) -> body, functional interface" },
        { q:"What is the Stream API in Java 8?", a:"A pipeline of operations on a data source (Collection, array). Lazy evaluation. Operations: filter, map, flatMap, reduce, collect, forEach, sorted. Terminal operations trigger execution. `list.stream().filter(x -> x > 5).collect(Collectors.toList())`.", hint:"Pipeline: source → intermediate → terminal" },
        { q:"What is `Optional<T>` in Java?", a:"A container object that may or may not contain a non-null value. Avoids NullPointerException by explicit null handling. `Optional.of(value)`, `Optional.empty()`, `optional.orElse(default)`, `optional.ifPresent(consumer)`.", hint:"Explicit null handling, no NPE" },
        { q:"What is the difference between `synchronized` and `volatile`?", a:"`synchronized`: mutual exclusion — only one thread executes the block at a time, ensures visibility and atomicity. `volatile`: ensures visibility (changes are immediately visible to other threads) but NOT atomicity of compound operations.", hint:"synchronized=atomicity+visibility; volatile=visibility only" },
        { q:"What is thread safety and how do you achieve it in Java?", a:"Thread safety: multiple threads access shared data without race conditions. Approaches: (1) `synchronized` blocks/methods, (2) `java.util.concurrent` classes (AtomicInteger, ConcurrentHashMap), (3) immutable objects, (4) ThreadLocal for thread-local state.", hint:"Synchronization, concurrent classes, immutability" },
        { q:"What is the difference between `throw` and `throws`?", a:"`throw` actually throws an exception instance at runtime: `throw new IllegalArgumentException('bad')`. `throws` declares that a method may throw checked exceptions: `public void save() throws IOException`.", hint:"throw=action; throws=declaration" },
        { q:"What is the Iterator pattern?", a:"Provides a way to sequentially access elements of a collection without exposing its internal structure. Java's Iterator has `hasNext()`, `next()`, `remove()`. Enhanced for-loop uses Iterator internally.", hint:"Sequential access without exposing internals" }
      ],
      advanced: [
        { q:"What is the difference between `ReentrantLock` and `synchronized`?", a:"`ReentrantLock` (java.util.concurrent.locks) offers: explicit lock/unlock, tryLock with timeout, fair ordering, multiple conditions, interruptible locking. `synchronized` is simpler but less flexible. Both achieve mutual exclusion.", hint:"ReentrantLock: timeout/fair/interruptible" },
        { q:"What is a CompletableFuture and how does it differ from Future?", a:"`Future` is blocking — `future.get()` blocks the calling thread. `CompletableFuture` is non-blocking and composable: `thenApply`, `thenCompose`, `exceptionally`, `allOf`. Supports chaining and combining async tasks.", hint:"Composable async chains vs blocking Future" },
        { q:"Explain the SOLID principles.", a:"S: Single Responsibility. O: Open/Closed (open for extension, closed for modification). L: Liskov Substitution (subclass usable wherever superclass is). I: Interface Segregation (many small interfaces). D: Dependency Inversion (depend on abstractions).", hint:"SOLID = 5 OOP design principles" },
        { q:"What is a functional interface and give 5 built-in examples from `java.util.function`.", a:"`Supplier<T>`: no arg, returns T. `Consumer<T>`: takes T, returns void. `Function<T,R>`: takes T, returns R. `Predicate<T>`: takes T, returns boolean. `BiFunction<T,U,R>`: takes two args, returns R.", hint:"Supplier, Consumer, Function, Predicate, BiFunction" },
        { q:"What is the difference between `HashMap`, `TreeMap`, `LinkedHashMap`?", a:"HashMap: O(1) ops, no ordering. TreeMap: O(log n) ops, keys sorted (natural or Comparator order). LinkedHashMap: O(1) ops, insertion order preserved (or access order with LRU flag). Choose based on ordering requirement.", hint:"No order / sorted / insertion order" },
        { q:"Implement a thread-safe singleton in Java.", a:"Enum singleton: `enum Singleton { INSTANCE; }` — JVM guarantees single instance. Or double-checked locking: `if (instance == null) { synchronized(lock) { if (instance == null) { instance = new Singleton(); } } }`.", hint:"Enum singleton is safest" },
        { q:"What is the Fork/Join framework?", a:"A framework for parallelizing divide-and-conquer algorithms. `ForkJoinPool` manages a pool of threads. `RecursiveTask<V>` returns a result; `RecursiveAction` does not. `task.fork()` submits, `task.join()` waits for result.", hint:"Divide-and-conquer with work-stealing" },
        { q:"What is a memory leak in Java and how do you detect one?", a:"Memory leaks occur when objects are still referenced but no longer needed — preventing GC. Common causes: static collections, unclosed streams, inner classes holding outer reference. Detect with: heap dumps, VisualVM, JProfiler, MAT (Memory Analyzer Tool).", hint:"Still referenced = not GC-able" }
      ]
    },

    sql: {
      basic: [
        { q:"What is the difference between WHERE and HAVING?", a:"WHERE filters rows BEFORE grouping. HAVING filters groups AFTER GROUP BY. You cannot use aggregate functions (COUNT, SUM) in WHERE but you can in HAVING.", hint:"WHERE=before GROUP; HAVING=after GROUP" },
        { q:"What is the difference between INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN?", a:"INNER: only matching rows. LEFT: all left rows, null for non-matching right. RIGHT: all right rows, null for non-matching left. FULL OUTER: all rows from both, null where no match.", hint:"INNER=intersection; OUTER=union variants" },
        { q:"What is a PRIMARY KEY vs FOREIGN KEY?", a:"PRIMARY KEY: uniquely identifies each row, cannot be null, one per table. FOREIGN KEY: references a primary key in another table, enforces referential integrity.", hint:"PK=unique row identifier; FK=reference to another table" },
        { q:"What does DISTINCT do?", a:"Removes duplicate rows from the result set. `SELECT DISTINCT department FROM employees;` returns each department only once.", hint:"Removes duplicates from result" },
        { q:"What is a NULL in SQL and how do you check for it?", a:"NULL represents the absence of a value — not zero or empty string. Cannot use `= NULL` — use `IS NULL` or `IS NOT NULL`. `NULL = NULL` evaluates to `UNKNOWN`, not TRUE.", hint:"IS NULL / IS NOT NULL, not = NULL" }
      ],
      intermediate: [
        { q:"What is a subquery and when do you use a correlated subquery?", a:"Subquery: a query nested inside another. Correlated subquery: references a column from the outer query — re-executed for each outer row. Use when the inner query depends on the outer row's value.", hint:"Correlated = references outer query column" },
        { q:"What are window functions? Give an example.", a:"Window functions perform calculations across a set of rows related to the current row without collapsing them (unlike GROUP BY). `ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC)` — assigns rank within each department.", hint:"OVER(PARTITION BY ... ORDER BY ...)" },
        { q:"Write a query to find the Nth highest salary.", a:"`SELECT salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk FROM employees) ranked WHERE rnk = N;`", hint:"DENSE_RANK() OVER (ORDER BY salary DESC)" },
        { q:"What is the difference between UNION and UNION ALL?", a:"UNION removes duplicate rows (sorts internally — slower). UNION ALL keeps all rows including duplicates (faster). Use UNION ALL when duplicates are acceptable or impossible.", hint:"UNION=dedup (slow); UNION ALL=all rows (fast)" },
        { q:"What is an index and what are the trade-offs?", a:"An index speeds up read queries on indexed columns (avoids full table scan). Trade-off: extra storage, slower INSERT/UPDATE/DELETE (index must be updated). Create on: WHERE columns, JOIN columns, ORDER BY columns.", hint:"Faster reads, slower writes" },
        { q:"What is a CTE (Common Table Expression)?", a:"A named temporary result set defined with `WITH`. Makes complex queries readable and reusable within the query. `WITH cte AS (SELECT ...) SELECT * FROM cte WHERE ...`. Supports recursion with `WITH RECURSIVE`.", hint:"WITH name AS (...) — named subquery" },
        { q:"Write a query to detect duplicate rows in a table.", a:"`SELECT email, COUNT(*) AS cnt FROM users GROUP BY email HAVING COUNT(*) > 1;` — shows each email that appears more than once and how many times.", hint:"GROUP BY + HAVING COUNT(*) > 1" }
      ],
      advanced: [
        { q:"What is query execution plan and how do you read it?", a:"A plan showing how the DB executes a query. Use `EXPLAIN` or `EXPLAIN ANALYZE`. Look for: Seq Scan (full table scan — bad on large tables), Index Scan, Hash Join, Nested Loop. High cost or row count estimates indicate bottlenecks.", hint:"EXPLAIN ANALYZE — find Seq Scans" },
        { q:"What is database normalization? Explain 1NF, 2NF, 3NF.", a:"1NF: atomic values, no repeating groups. 2NF: 1NF + no partial dependency on composite PK. 3NF: 2NF + no transitive dependency (non-key column depending on another non-key column).", hint:"Atomic → No partial dep → No transitive dep" },
        { q:"What is a stored procedure and how do you test it?", a:"A precompiled block of SQL stored in the database, callable by name. Testing: (1) call with known inputs, (2) query the result tables, (3) assert expected values, (4) test edge cases (null inputs, boundary values), (5) check referential integrity after execution.", hint:"Precompiled SQL block — test via INSERT+EXEC+SELECT" }
      ]
    },

    api: {
      basic: [
        { q:"What is REST and what are its constraints?", a:"REST (Representational State Transfer) constraints: (1) Client-Server, (2) Stateless, (3) Cacheable, (4) Uniform Interface, (5) Layered System, (6) Code on Demand (optional). REST uses HTTP methods: GET, POST, PUT, PATCH, DELETE.", hint:"6 constraints: stateless, uniform interface..." },
        { q:"What is the difference between PUT and PATCH?", a:"PUT replaces the ENTIRE resource. PATCH partially updates only the specified fields. Use PUT for full replacement, PATCH for partial update. PUT requires sending all fields even if only one changed.", hint:"PUT=full replace; PATCH=partial update" },
        { q:"What HTTP status codes mean 2xx, 4xx, 5xx?", a:"2xx: Success (200 OK, 201 Created, 204 No Content). 4xx: Client errors (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Unprocessable Entity). 5xx: Server errors (500 Internal Server Error, 503 Service Unavailable).", hint:"2xx=ok, 4xx=client fault, 5xx=server fault" },
        { q:"What is the difference between authentication and authorization?", a:"Authentication: verifying WHO you are (login). Authorization: verifying WHAT you're allowed to do (permissions). Auth happens first, authz second.", hint:"Who you are vs what you can do" },
        { q:"What is OAuth 2.0?", a:"An authorization framework where a user grants a third-party app limited access to their resources on a server without sharing credentials. Common flows: Authorization Code (web apps), Client Credentials (server-to-server), Implicit (deprecated).", hint:"Token-based delegated authorization" }
      ],
      intermediate: [
        { q:"How do you test API pagination in automation?", a:"Start with page=1, fetch results, check `hasNextPage` in response. Loop: increment page, re-fetch until `hasNextPage` is false. Assert: total items = sum of all pages. Verify consistent ordering across pages.", hint:"Loop until hasNextPage false, assert total" },
        { q:"What is contract testing (Pact)?", a:"Tests that the API contract between consumer and provider is not broken. Consumer defines its expectations (Pact file). Provider verifies it can satisfy those expectations. Prevents breaking changes from deploying.", hint:"Consumer defines expectations, provider verifies" },
        { q:"How do you handle API rate limiting in tests?", a:"Detect 429 responses. Assert `Retry-After` header is present. Don't spam requests in tests — add delays or use test-specific rate limit exemptions. Test: send N+1 requests rapidly, assert the N+1th returns 429.", hint:"429 + Retry-After header assertion" },
        { q:"What is idempotency in REST APIs?", a:"An operation is idempotent if making the same request multiple times has the same effect as making it once. GET, PUT, DELETE are idempotent. POST is not (creates a new resource each time). PATCH may or may not be.", hint:"Same result no matter how many times called" },
        { q:"What is JSON Schema validation in API testing?", a:"Validates the structure, types, and constraints of a JSON response against a schema definition. Tools: Ajv (JS), REST Assured's `matchesJsonSchemaInClasspath()`. Catches contract breaks even if individual field values vary.", hint:"Validate structure/types, not just values" }
      ],
      advanced: [
        { q:"What is GraphQL and how does testing differ from REST?", a:"GraphQL: single endpoint, client specifies exact data needed in queries. REST: multiple endpoints, server defines response shape. Testing differences: validate query/mutation schemas, test over-fetching prevention, test authorization per field, test N+1 query performance.", hint:"Single endpoint, client shapes the query" },
        { q:"How do you test async/event-driven APIs (webhooks)?", a:"Use a webhook listener (ngrok tunnel or test endpoint). Register the webhook URL with the API. Trigger the action. Wait for the webhook callback. Assert the payload. Alternatively: poll a callback log API. Test: timeout handling, retry behavior, payload signature verification.", hint:"Listener URL + trigger + assert payload" },
        { q:"What is API versioning and how do you test it?", a:"Versioning strategies: URL path (/v1/api), header (Accept: application/vnd.api+json; version=2), query param (?v=2). Test: old version still works after new version release. Test: breaking changes are not deployed to old versions. Maintain separate test suites per version.", hint:"URL/header/query versioning — test backward compat" }
      ]
    },

    bdd: {
      basic: [
        { q:"What is BDD and how does it differ from TDD?", a:"BDD (Behavior Driven Development) focuses on business behavior — tests describe 'what the system should do' in plain language (Gherkin). TDD focuses on technical units — tests describe 'how the code works'. BDD bridges dev and business; TDD drives design.", hint:"Business behavior (BDD) vs code design (TDD)" },
        { q:"What is Gherkin syntax? Name the 5 keywords.", a:"Given (precondition), When (action), Then (expected outcome), And (additional step), But (negative step). Also: Feature, Scenario, Scenario Outline, Background, Examples, @tags.", hint:"Given/When/Then/And/But" },
        { q:"What is a Step Definition?", a:"A function that maps a Gherkin step to executable code. Annotated with `@Given`, `@When`, `@Then` (Java) or `const { Given } = require('@cucumber/cucumber')` (JS). The string/regex pattern matches the Gherkin step text.", hint:"Maps Gherkin text to code function" },
        { q:"What is a Scenario Outline?", a:"A parameterized scenario that runs multiple times with different data from an Examples table. Uses `<placeholders>` in steps that are replaced by each row's values. Equivalent to data-driven testing.", hint:"Parameterized scenario + Examples table" },
        { q:"What is Background in Cucumber?", a:"Steps that run before EVERY scenario in a feature file. Equivalent to BeforeEach at the Gherkin level. Used for shared setup like navigating to a page or setting a user state that all scenarios require.", hint:"Runs before EVERY scenario in the file" }
      ],
      intermediate: [
        { q:"How do you share state between step definitions in Cucumber?", a:"In Java: PicoContainer (dependency injection) — inject a shared context object into step definition constructors. In JS: Cucumber World object (set via `setWorldConstructor`) — step definitions access shared state via `this`.", hint:"PicoContainer (Java) / World object (JS)" },
        { q:"What is the difference between `@Before` and `Background`?", a:"`@Before` hook runs before every scenario and is written in Java/JS code — can do programmatic setup (launch browser, seed DB). `Background` is Gherkin-level — visible to stakeholders. Use Background for business-readable setup; @Before for technical setup.", hint:"Code hook vs Gherkin step — same timing" },
        { q:"How do you tag scenarios and run a subset in Cucumber?", a:"Add `@tagName` above Feature or Scenario. Run: `cucumber --tags '@smoke'` or `--tags '@smoke and not @slow'`. In JUnit5 runner: `@ConfigurationParameter(key = FILTER_TAGS_PROPERTY_NAME, value = '@smoke')`.", hint:"@tagName + --tags filter" },
        { q:"What is living documentation in BDD?", a:"The Gherkin feature files serve as executable specifications and living documentation. Tools like Pickles or Serenity generate HTML reports from feature files showing which scenarios pass/fail. Stakeholders read feature files as up-to-date specs.", hint:"Feature files = always-current specs + test reports" }
      ],
      advanced: [
        { q:"How do you implement in-sprint BDD automation?", a:"Day 1: QE writes feature files from acceptance criteria. Dev stubs step definitions. Days 2-3: Dev builds feature. Day 4-5: QE implements full step definitions against dev build. Day 6-7: all scenarios pass, added to regression suite. Gate: sprint closure requires all @sprint-N scenarios green.", hint:"Feature files Day 1 → step defs after dev build" },
        { q:"What are the drawbacks of BDD and how do you mitigate them?", a:"Drawbacks: overhead of maintaining Gherkin + step defs, POs rarely write scenarios in practice, step definition duplication, slow execution if over-specified at UI level. Mitigations: keep API-level BDD, reuse generic steps, automate generation of step skeletons, use tags to run focused subsets.", hint:"Maintenance overhead + PO involvement rarely happens" }
      ]
    }
  };

  return {
    getQuestions: function(sector, difficulty) {
      var sec = bank[sector];
      if (!sec) return [];
      if (difficulty === 'mixed') {
        return [].concat(
          (sec.basic || []).slice(0, 4),
          (sec.intermediate || []).slice(0, 4),
          (sec.advanced || []).slice(0, 2)
        );
      }
      return (sec[difficulty] || []).slice();
    },
    getAllSectors: function() { return Object.keys(bank); },
    getTotalCount: function() {
      var n = 0;
      Object.values(bank).forEach(function(sec) {
        Object.values(sec).forEach(function(arr) { n += arr.length; });
      });
      return n;
    }
  };
})();
