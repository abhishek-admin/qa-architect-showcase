# Java Collections Framework — SDET Interview Questions
> 5+ years SDET level. Covers Collections in test automation: test data management, thread safety in parallel suites, and framework utility patterns.

---

## 1. What is the Java Collections Framework and why does it matter for an SDET?

**Answer:**
The Collections Framework is a unified architecture of interfaces and classes for storing and manipulating groups of objects. For an SDET it matters because:

- **`List`** — ordered test data sets, @DataProvider rows, execution logs
- **`Set`** — deduplicating test tags, tracking executed scenario IDs
- **`Map`** — test configuration maps, header stores, JSON payloads as key-value
- **`Queue`** — task queues for parallel execution scheduling

Understanding which collection to pick directly impacts framework performance and thread-safety correctness.

> Hot take: *"If you treat collections as just 'places to dump data', you're building slow, leaky test code. Choosing the wrong collection (like a List for lookup or a raw Map for thread safety) is the root cause of flaky parallel pipelines."*

---

## 2. What is the difference between `ArrayList` and `LinkedList`? When do you use each?

**Answer:**

| Operation | ArrayList | LinkedList |
|---|---|---|
| Random access `get(i)` | O(1) | O(n) |
| Insert/remove at middle | O(n) | O(1) |
| Memory | Compact (array backed) | Higher (node + pointers) |
| Implements | List | List + Deque |

**In automation:**
- `ArrayList` — storing all test results, maintaining ordered test data (random access dominates)
- `LinkedList` as `Queue/Deque` — test execution queue where you constantly poll from front and push to back (e.g., retry queue for flaky tests)

> Hot take: *"Almost never use LinkedList. For 99% of automation use cases, ArrayList is faster, uses less memory, and is optimized for modern CPU caching. If you need queue behavior, use ArrayDeque instead."*

---

## 3. What is the difference between `HashMap`, `LinkedHashMap`, and `TreeMap`?

**Answer:**

| | HashMap | LinkedHashMap | TreeMap |
|---|---|---|---|
| Order | None | Insertion order | Sorted by key |
| Allows null key | Yes (one) | Yes | No |
| Performance | O(1) avg | O(1) avg | O(log n) |

**In automation:**
- `HashMap` — storing test config properties where order doesn't matter (browser, env, headless)
- `LinkedHashMap` — building ordered JSON payloads for REST Assured where field order must match expected schema
- `TreeMap` — producing alphabetically sorted test reports or environment comparison outputs

```java
// LinkedHashMap preserves insertion order — important for JSON payload construction
Map<String, Object> payload = new LinkedHashMap<>();
payload.put("username", "standard_user");
payload.put("password", "password123");
payload.put("rememberMe", true);
// Serialises as: {"username":"standard_user","password":"password123","rememberMe":true}
```

> Hot take: *"If your REST API assertion fails intermittently because keys are out of order, you built your payload with HashMap instead of LinkedHashMap. Map ordering isn't a detail; it's a contract."*

---

## 4. What is `HashSet` vs `LinkedHashSet` vs `TreeSet`?

**Answer:**

| | HashSet | LinkedHashSet | TreeSet |
|---|---|---|---|
| Order | None | Insertion order | Sorted |
| Duplicates | No | No | No |
| Performance | O(1) | O(1) | O(log n) |

**In automation:**

```java
// HashSet — fastest deduplication of executed test IDs across a parallel run
Set<String> executedIds = Collections.synchronizedSet(new HashSet<>());

// LinkedHashSet — deduplication while preserving the order features ran
Set<String> orderedFeatures = new LinkedHashSet<>();
orderedFeatures.addAll(smokeFeatures);
orderedFeatures.addAll(regressionFeatures);

// TreeSet — alphabetically ordered report of all unique error messages seen
Set<String> uniqueErrors = new TreeSet<>(allErrors);
```

> Hot take: *"Use HashSet for deduplication, but choose TreeSet when generating alphabetical lists of error logs. Preserving execution order in reporting should always fall to LinkedHashSet."*

---

## 5. How do you make a collection thread-safe in a parallel Playwright test suite?

**Answer:**
Three approaches, each at a different cost:

```java
// 1. synchronized wrapper — simplest, coarse-grained lock
List<String> safeList = Collections.synchronizedList(new ArrayList<>());

// 2. CopyOnWriteArrayList — reads are lock-free, writes copy the array
// Best when reads dominate (e.g., reading test data) and writes are rare
List<String> results = new CopyOnWriteArrayList<>();

// 3. ConcurrentHashMap — the go-to for parallel metric/result collection
Map<String, String> testResults = new ConcurrentHashMap<>();

// Usage in @AfterMethod across parallel threads
@AfterMethod
public void recordResult(ITestResult result) {
    testResults.put(
        result.getName() + "-" + Thread.currentThread().getId(),
        result.isSuccess() ? "PASS" : "FAIL"
    );
}
```

**Rule:** In a TestNG parallel suite, any shared mutable collection **must** use one of these patterns or `ThreadLocal`. Unguarded `ArrayList` or `HashMap` under concurrent writes will silently corrupt data.

> Hot take: *"Writing parallel test results into a standard ArrayList or HashMap is a silent trap. Under high concurrency, they will corrupt data and drop results without throwing. Always wrap them in concurrent thread-safe variants."*

---

## 6. What is `ConcurrentHashMap` and how does it differ from `Hashtable`?

**Answer:**

| | ConcurrentHashMap | Hashtable |
|---|---|---|
| Lock granularity | Per-segment / bucket (Java 8+: node-level CAS) | Full table lock |
| Null keys/values | Not allowed | Not allowed |
| Performance under concurrency | High | Low (global lock) |
| Iterator | Weakly consistent | Fail-fast |

`Hashtable` locks the entire map for every read and write — under parallel test execution this becomes a bottleneck. `ConcurrentHashMap` allows concurrent reads and fine-grained writes, making it the correct choice for collecting parallel test metrics.

> Hot take: *"Hashtable is obsolete. Locking the entire map for every operation creates severe thread bottlenecks. ConcurrentHashMap's segment-level lock strips concurrent execution limits and handles multi-threaded workloads efficiently."*

---

## 7. How do you use `Map` to build and manage REST API request headers in automation?

**Answer:**

```java
// Base headers shared across all requests
Map<String, String> baseHeaders = new HashMap<>();
baseHeaders.put("Content-Type", "application/json");
baseHeaders.put("Accept",       "application/json");

// Per-test: add auth token without mutating the shared base
Map<String, String> authHeaders = new HashMap<>(baseHeaders);
authHeaders.put("Authorization", "Bearer " + ApiHelper.fetchAuthToken(user, pass));

// REST Assured usage
given()
    .headers(authHeaders)
    .body(payload)
.when()
    .post("/api/users")
.then()
    .statusCode(201);
```

> Hot take: *"Never mutate your global headers map directly inside a test. Create a copy of the base headers map and add your authorization key there, preventing state leakage across parallel tests."*

---

## 8. What is the `Queue` interface and where would you use it in a test framework?

**Answer:**
`Queue` models a FIFO structure. Key methods: `offer()` (add), `poll()` (remove + return head), `peek()` (return head without removing).

```java
// Flaky test retry queue — failed tests get re-queued for one more attempt
Queue<ITestResult> retryQueue = new LinkedList<>();

@AfterMethod
public void queueRetry(ITestResult result) {
    if (result.getStatus() == ITestResult.FAILURE && !result.wasRetried()) {
        retryQueue.offer(result);
    }
}

// Retry runner polls and re-executes
while (!retryQueue.isEmpty()) {
    ITestResult failed = retryQueue.poll();
    retryRunner.run(failed.getMethod());
}
```

> Hot take: *"Don't build manual arrays to track failures. A FIFO Queue is the ideal structure for scheduling flaky test retries or processing background reporting events sequentially."*

---

## 9. What is the difference between `Iterator` and `ListIterator`? When would you use `Iterator.remove()`?

**Answer:**
- `Iterator` — forward-only traversal, works on any `Collection`
- `ListIterator` — bidirectional, can `set()` and `add()` during traversal, `List` only

**Why `Iterator.remove()` matters:** Removing elements from a collection while iterating with a for-each loop throws `ConcurrentModificationException`. Use `Iterator.remove()` instead:

```java
// Removing stale test run records from a live results list
Iterator<TestRunRecord> it = liveResults.iterator();
while (it.hasNext()) {
    TestRunRecord record = it.next();
    if (record.isExpired()) {
        it.remove();  // Safe — no ConcurrentModificationException
    }
}
```

> Hot take: *"Trying to modify a collection inside a standard for-each loop will crash your test runner with a ConcurrentModificationException. Use Iterator.remove() to clean lists safely."*

---

## 10. Explain `Collections.unmodifiableList()` and when you use it in a framework.

**Answer:**
Returns a view of the list that throws `UnsupportedOperationException` on any mutating operation. Use it to expose shared read-only test data from a utility without worrying callers will accidentally modify it.

```java
public class TestDataStore {
    private static final List<String> ENVIRONMENTS =
        Collections.unmodifiableList(Arrays.asList("staging", "dev", "prod", "uat"));

    public static List<String> getEnvironments() {
        return ENVIRONMENTS;  // caller cannot add/remove — safe to return directly
    }
}
```

This prevents a common bug where one test method accidentally truncates shared test data that other test methods depend on.

> Hot take: *"If your utility class returns a mutable list of configurations, expect a downstream test to modify it and break other tests. Enforce read-only access with unmodifiableList() to protect global state."*

---

## 11. What is `PriorityQueue` and could it be useful in a QA context?

**Answer:**
`PriorityQueue` dequeues elements in their natural order (or by `Comparator`) rather than FIFO. The highest-priority element is always at the head.

```java
// Run critical @Smoke tests before @Regression tests
Comparator<TestCase> byPriority = Comparator.comparingInt(TestCase::getPriority);
PriorityQueue<TestCase> queue = new PriorityQueue<>(byPriority);

queue.offer(new TestCase("loginTest", 1));    // priority 1 = highest
queue.offer(new TestCase("reportTest", 3));
queue.offer(new TestCase("dashboardTest", 2));

while (!queue.isEmpty()) {
    runner.run(queue.poll());  // executes in order: login → dashboard → report
}
```

> Hot take: *"Run your smoke tests first. Instead of relying on rigid naming conventions, use a PriorityQueue sorted by severity to schedule and execute critical checks at the head of the queue."*

---

## 12. What is the difference between `fail-fast` and `weakly consistent` iterators?

**Answer:**
- **Fail-fast** (`ArrayList`, `HashMap`): throws `ConcurrentModificationException` if the collection is structurally modified during iteration. Catches bugs early in single-threaded code.
- **Weakly consistent** (`ConcurrentHashMap`, `CopyOnWriteArrayList`): iterates over a snapshot or tolerates concurrent modification — guaranteed not to throw, but may or may not reflect changes made after the iterator was created.

In a parallel test framework, any shared collection iterated from one thread while another thread modifies it **must** use a weakly consistent collection — otherwise intermittent `ConcurrentModificationException` in your after-suite reporting hook will corrupt the run results.

> Hot take: *"Fail-fast iterators are a nightmare in concurrent suites. When collecting reports, use weakly consistent collections so threads can append results without crashing active iteration loops."*

---

## 13. How do you sort a `List` of custom test result objects?

**Answer:**

```java
List<TestResult> results = getResults();

// Sort by duration descending (slowest first) — for performance analysis
results.sort(Comparator.comparingLong(TestResult::getDurationMs).reversed());

// Chain comparators: FAIL before PASS, then alphabetically by name
results.sort(Comparator.comparing(TestResult::getStatus)
                       .thenComparing(TestResult::getTestName));
```

`List.sort()` (Java 8+) is preferred over `Collections.sort()` — same algorithm, but semantically cleaner as a method on the list itself.

> Hot take: *"Never use custom bubble-sort loops in Java. Leverage List.sort() with Comparator.comparing() to rank test executions by duration or alphabetical class names cleanly."*

---

## 14. How do you group test results by status using `Map` and streams?

**Answer:**

```java
List<TestResult> results = getAllResults();

// Group into Map<Status, List<TestResult>>
Map<String, List<TestResult>> grouped =
    results.stream()
           .collect(Collectors.groupingBy(TestResult::getStatus));

// Summary report
grouped.forEach((status, list) ->
    log.info("{}: {} tests", status, list.size()));
// Output:
// PASS: 142 tests
// FAIL: 8 tests
// SKIP: 3 tests
```

This pattern is useful for generating the suite summary section in a custom Allure or Extent report plugin.

> Hot take: *"Writing boilerplate loops to group lists by key is legacy code. Use Collectors.groupingBy with Java Streams to categorize results in a single, readable line of code."*

---

## 15. What is `Stack` and is it recommended in modern Java? What's the alternative?

**Answer:**
`Stack` extends `Vector` — both are synchronised on every operation, which is expensive and unnecessary in single-threaded code. They're considered legacy.

**Modern alternative:** Use `ArrayDeque` as a stack:

```java
// Stack for tracking page navigation history in a test flow
Deque<String> pageHistory = new ArrayDeque<>();

pageHistory.push("/login");
pageHistory.push("/dashboard");
pageHistory.push("/profile");

String lastPage = pageHistory.pop(); // "/profile"
String previous = pageHistory.peek(); // "/dashboard" (still on stack)
```

`ArrayDeque` is faster than `Stack` and `LinkedList` for stack/queue operations and has no synchronisation overhead.

> Hot take: *"Legacy Stack is slow because of outdated Vector synchronization. Use ArrayDeque as a LIFO stack for tracking page history in your test flows for maximum efficiency."*
