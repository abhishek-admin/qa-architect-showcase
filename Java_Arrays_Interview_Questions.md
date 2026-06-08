# Java Arrays — SDET Interview Questions
> 5+ years SDET level. Covers arrays in the context of test automation, data-driven testing, and framework engineering.


---

## 1. What is an array in Java and how does it differ from an ArrayList?

**Answer:**
An array is a fixed-size, typed block of memory. Size is set at creation and cannot change.

```java
String[] browsers = {"chromium", "firefox", "webkit"};
```

`ArrayList` is dynamic — it resizes automatically. Use arrays when dataset size is known (fixed list of environments), use `ArrayList` when collecting data at runtime (e.g., accumulating failed test names during a run).

| | Array | ArrayList |
|---|---|---|
| Size | Fixed | Dynamic |
| Supports primitives | Yes | No (boxed types) |
| Iteration speed | Faster | Slightly slower |
| Utility class | `Arrays.*` | `Collections.*` |

> Hot take: *"In test automation, never expose raw arrays in your internal APIs or Page Object signatures. They lack dynamic resizing and type safety bounds check at compile time, leading to fragile client code. Default to List/Set interface wrapper APIs and reserve arrays strictly for low-level configuration constants."*

---

## 2. How do you use arrays in data-driven testing with TestNG `@DataProvider`?

**Answer:**
`@DataProvider` returns `Object[][]` — each inner array is one test invocation's parameters.

```java
@DataProvider(name = "loginData")
public Object[][] loginData() {
    return new Object[][] {
        {"standard_user",   "password123", true},
        {"locked_out_user", "password123", false},
        {"invalid_user",    "wrongpass",   false}
    };
}

@Test(dataProvider = "loginData")
public void testLogin(String user, String pass, boolean shouldPass) {
    loginPage.login(user, pass);
    if (shouldPass) {
        Assert.assertTrue(dashboardPage.isLoaded());
    } else {
        Assert.assertTrue(loginPage.hasErrorMessage());
    }
}
```

Each row maps to a separate test execution without duplicating logic — the core pattern in every enterprise BDD + TestNG stack.

> Hot take: *"While Object[][] is the industry standard for @DataProvider, it's type-unsafe and hard to read for complex scenarios. Instead, map your data rows to custom POJOs or use builder patterns, then feed them into a single-dimensional Object[] or Iterator<Object[]> provider to keep your test signatures clean and typed."*

---

## 3. What are the three ways to iterate over an array? Which do you use in automation code?

**Answer:**

```java
String[] tags = {"@Smoke", "@Regression", "@Sanity"};

// Classic for — use when you need the index for logging/reporting
for (int i = 0; i < tags.length; i++) {
    log.info("Suite [{}]: {}", i, tags[i]);
}

// Enhanced for — cleanest for simple read-only iteration
for (String tag : tags) {
    suiteRunner.run(tag);
}

// Stream — best for filter/map pipelines
Arrays.stream(tags)
      .filter(t -> t.contains("Smoke"))
      .forEach(suiteRunner::run);
```

In automation code: **enhanced for** for readability, streams when you need filtering or transformation before acting on the data.

> Hot take: *"Always favor Arrays.stream() or enhanced for loops for readability. If you're using a classic indexed for loop, you're likely violating the single responsibility principle by managing both loop indices and test validation logic simultaneously."*

---

## 4. How do you sort an array and use it in a test assertion?

**Answer:**

```java
// Assert a UI dropdown renders values in alphabetical order
String[] actual   = getDropdownValues();  // fetched from page
String[] expected = actual.clone();
Arrays.sort(expected);

Assert.assertEquals(actual, expected, "Dropdown is not sorted alphabetically");
```

For objects, supply a `Comparator`:

```java
TestResult[] results = getResults();
Arrays.sort(results, Comparator.comparing(TestResult::getDuration).reversed());
// results[0] is now the slowest test — useful for performance regression reports
```

> Hot take: *"Using Arrays.sort on UI arrays is risky because sorting mutations happen in-place. If your UI element locator dynamically updates, you risk sorting stale DOM states. Always clone the array, map it to a stream, sort, and assert via a fluent assertion library like AssertJ's containsExactly."*

---

## 5. What is `Arrays.asList()` and what is the classic production gotcha?

**Answer:**
`Arrays.asList()` wraps an array in a **fixed-size** `List`. You can update elements but **cannot add or remove** items — attempting to does throws `UnsupportedOperationException` at runtime, not compile time.

```java
List<String> envs = Arrays.asList("staging", "dev", "prod");
envs.set(0, "uat");   // OK — update works
envs.add("perf");     // UnsupportedOperationException!
```

**Fix:** `new ArrayList<>(Arrays.asList(...))` — creates a fully mutable list. This trips engineers who feed `Arrays.asList()` output into code that later tries to append runtime failures to the same list.

> Hot take: *"Avoid Arrays.asList() entirely in modern Java code. Use List.of() for immutable lists or new ArrayList<>(List.of(...)) for mutable ones. List.of() is cleaner, returns a truly immutable list, and throws errors immediately on null values, preventing silent test data corruption."*

---

## 6. Explain `Arrays.copyOf()` vs `Arrays.copyOfRange()` vs `System.arraycopy()`.

**Answer:**

```java
int[] original = {10, 20, 30, 40, 50};

// copyOf — new array from index 0, given length (pads with 0 if longer than source)
int[] full  = Arrays.copyOf(original, 5);        // {10,20,30,40,50}
int[] short = Arrays.copyOf(original, 3);        // {10,20,30}

// copyOfRange — slice from fromIndex (inclusive) to toIndex (exclusive)
int[] slice = Arrays.copyOfRange(original, 1, 4); // {20,30,40}

// System.arraycopy — fastest for large arrays (JVM native call)
int[] dest = new int[original.length];
System.arraycopy(original, 0, dest, 0, original.length);
```

All three are **shallow copies**. In parallel test setups, use `copyOfRange` to split a large `@DataProvider` dataset cleanly across worker threads without overlap.

> Hot take: *"Unless you're building high-throughput framework log parsers, skip System.arraycopy entirely. Standardize on Arrays.copyOfRange() for test data partitioning or stream collectors for slice manipulation. Readability and thread isolation trump micro-second performance gains in 99% of automation tasks."*

---

## 7. How do you compare two arrays for equality?

**Answer:**

```java
String[] expected = {"login", "dashboard", "profile"};
String[] actual   = {"login", "dashboard", "profile"};

expected == actual;               // false — compares object references, not values
Arrays.equals(expected, actual);  // true  — element-by-element comparison

// For 2D / nested arrays
int[][] a = {{1,2},{3,4}};
int[][] b = {{1,2},{3,4}};
Arrays.deepEquals(a, b);          // true
```

TestNG's `Assert.assertEquals(actualArr, expectedArr)` internally uses `Arrays.equals`, so array assertions work correctly by value without any extra work.

> Hot take: *"Never write loop assertions for array comparison or rely on JUnit's default array assert. Standardize your assertion library on AssertJ's .containsExactly() or .hasSameElementsAs(). It gives rich, colored diffs in CI console logs, cutting debugging time from minutes to seconds."*

---

## 8. How do you detect duplicate entries in a test data array?

**Answer:**
Use a `HashSet` — `Set.add()` returns `false` when the element already exists.

```java
public static List<String> findDuplicates(String[] testCaseIds) {
    Set<String> seen = new HashSet<>();
    List<String> dupes = new ArrayList<>();
    for (String id : testCaseIds) {
        if (!seen.add(id)) dupes.add(id);
    }
    return dupes;
}
```

In a framework, call this at suite bootstrap to catch duplicate test IDs before execution — fail fast with a meaningful message instead of silently generating confusing duplicate Allure report entries.

> Hot take: *"Don't wait for your tests to fail due to duplicate keys. Run deduplication validations at the build step or suite initializer. If your CSV data providers have duplicates, fail the build before launching browsers to avoid burning runner minutes in CI pipelines."*

---

## 9. How do you safely convert between arrays and other collection types?

**Answer:**

```java
String[] arr = {"feature1", "feature2", "feature3"};

// → mutable List (wrap, don't use asList directly)
List<String> list = new ArrayList<>(Arrays.asList(arr));

// List → Array (zero-length hint is the preferred idiom)
String[] back = list.toArray(new String[0]);

// → Set (deduplicates automatically — useful for test tags)
Set<String> tagSet = new HashSet<>(Arrays.asList(arr));

// → Stream for transformation
String[] upper = Arrays.stream(arr).map(String::toUpperCase).toArray(String[]::new);
```

The `toArray(new T[0])` idiom is preferred over `toArray(new T[size])` — the JVM optimises the zero-length hint pattern better.

> Hot take: *"Java 11+'s List.copyOf and Stream.toList() should be your defaults. Sticking to old new HashSet<>(Arrays.asList(arr)) boilerplate is a sign of outdated Java habits. Modern stream pipelines keep conversion concise and immutable."*

---

## 10. What causes `ArrayIndexOutOfBoundsException` and how do you guard against it?

**Answer:**
Thrown when accessing index ≥ length or < 0. Surfaces in automation when indexing into dynamically fetched UI table rows.

```java
// Fragile — crashes if the table has fewer rows than expected
String value = tableRows[5].getText();

// Safe utility pattern for test helper methods
public String safeGet(String[] arr, int index) {
    if (arr == null || index < 0 || index >= arr.length) {
        throw new IllegalArgumentException(
            "Index " + index + " out of bounds for array of length " +
            (arr == null ? 0 : arr.length));
    }
    return arr[index];
}
```

> Hot take: *"If an ArrayIndexOutOfBoundsException leaks from your Page Object to the test layer, your framework design failed. UI selectors should return high-level collections, and the Page Object must abstract away element presence and range validations internally."*

---

## 11. How do you use `Arrays.stream()` to filter and prepare test endpoint lists?

**Answer:**

```java
String[] endpoints = {"/api/login", "/api/users", "/health", "/api/products", "/metrics"};

// Exclude monitoring routes, build full staging URLs
String base = "https://staging.enterprise.com";
String[] testTargets = Arrays.stream(endpoints)
    .filter(e -> e.startsWith("/api/"))
    .map(e -> base + e)
    .toArray(String[]::new);
// → ["https://staging.enterprise.com/api/login", ...]
```

Common in REST Assured suites where you generate endpoint lists from config and need to filter out non-testable routes before building the test run.

> Hot take: *"When mapping endpoints, avoid hardcoded stream filters. Abstract your endpoints into an Enum or configuration file, and use streams to map those structures. This separates test configurations from operational pipeline logic."*

---

## 12. What is `varargs` and how does it relate to arrays? Give an automation example.

**Answer:**
`varargs` (`String... args`) lets callers pass any number of arguments — the JVM wraps them into an array automatically.

```java
// Assert multiple UI conditions with one clean call
public void assertAllVisible(String context, boolean... conditions) {
    for (int i = 0; i < conditions.length; i++) {
        Assert.assertTrue(conditions[i],
            context + " — condition[" + i + "] is not visible");
    }
}

// Clean call site
assertAllVisible("Login page",
    loginPage.isUsernameFieldVisible(),
    loginPage.isPasswordFieldVisible(),
    loginPage.isSubmitButtonEnabled());
```

> Hot take: *"Varargs are great for fluent assertion builders but terrible for page action inputs. Overusing them in Page Objects makes your step definitions ambiguous and can mask missing fields. Use them only for unified utility assertions or multi-locator visibility wait helpers."*

---

## 13. How do you handle null values in a test data array to prevent mid-run NPEs?

**Answer:**

```java
// Data loaded from CSV often has nulls/blanks for empty cells
String[] inputs = {"valid@email.com", null, "", "another@email.com"};

// Sanitise before building @DataProvider
String[] cleanInputs = Arrays.stream(inputs)
    .filter(s -> s != null && !s.isBlank())
    .toArray(String[]::new);
```

Null rows in a `@DataProvider` cause `NullPointerException` mid-test rather than a clean skip. Always sanitise data sourced from CSV, Excel, or DB before constructing the provider array.

> Hot take: *"Never handle null values reactively at the test step level. Implement a strict, schema-validated input reader (e.g. Jackson for JSON or a schema-based Excel parser) that sanitizes and fails data-loading during suite initialization, rather than wasting browser context run time."*

---

## 14. How do you shuffle a test data array to catch hidden order dependencies?

**Answer:**

```java
String[] users = {"admin", "viewer", "guest", "superuser"};

List<String> list = new ArrayList<>(Arrays.asList(users));
Collections.shuffle(list, new Random(System.currentTimeMillis()));
users = list.toArray(new String[0]);
```

Randomising execution order in soak tests exposes hidden test dependencies — a test that only passes after another test ran first reveals shared mutable state in the framework (a sign that ThreadLocal cleanup is missing).

> Hot take: *"Shuffling test arrays is a double-edged sword. While it catches shared state bugs, it makes reproducing failures in CI a nightmare unless you log the seed value. Always seed your randomizer (e.g., new Random(seed)) and print that seed in the build log to ensure reproducible failures."*

---

## 15. How do you partition a data array across parallel threads in a TestNG parallel suite?

**Answer:**

```java
public static Object[][] slice(Object[][] fullData, int threadIdx, int totalThreads) {
    int total = fullData.length;
    int start = (total / totalThreads) * threadIdx;
    int end   = (threadIdx == totalThreads - 1)
                    ? total
                    : start + (total / totalThreads);
    return Arrays.copyOfRange(fullData, start, end);
}
```

Each thread receives a non-overlapping slice of the full dataset. Use this in a custom `@DataProvider` that queries `ITestContext` for the current thread index — clean data distribution without locks or shared state across a parallel Playwright grid.

> Hot take: *"Instead of rolling your own array slicing math inside @DataProvider, let TestNG handle parallel thread execution via parallel = 'methods' or run tests through a container orchestrator (e.g., Kubernetes pods running localized jobs). Infrastructure-level parallelism is far more reliable and easier to scale."*
