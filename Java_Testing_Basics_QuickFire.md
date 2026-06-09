# Java & Testing Basics — Quick-Fire Q&A

These are the "trap door" questions interviewers use to filter candidates before the framework discussion. Mostly 30-second answers. Know every single one cold.

---

## Table of Contents

- **Section 1 — Java Core Traps** (the ones that catch people off guard)
- **Section 2 — String Manipulation** (most common coding warm-ups)
- **Section 3 — XPath Writing** (Selenium/Playwright locator basics)
- **Section 4 — OOP Fundamentals** (inheritance, polymorphism, abstraction)
- **Section 5 — Collections & Data Structures** (quick picks)
- **Section 6 — Exception Handling** (checked vs unchecked)
- **Section 7 — Testing Concepts** (definitions they always ask)

---

## Section 1 — Java Core Traps

---

**Q1. Can the `main` method be overloaded?**

Yes. You can have multiple methods named `main` with different parameter lists — Java allows method overloading on any method name including `main`. However, the JVM only uses the specific signature `public static void main(String[] args)` as the entry point. Any other `main` overload is just a regular method — it won't run unless explicitly called.

```java
public static void main(String[] args) { System.out.println("JVM entry"); }
public static void main(int x)         { System.out.println("overload - called manually"); }
public static void main(String a, int b) { System.out.println("another overload"); }
```

---

**Q2. Swap two integers WITHOUT a third variable.**

Three ways — know all three:

```java
// Method 1: Arithmetic (risk of overflow on large ints)
a = a + b;
b = a - b;
a = a - b;

// Method 2: XOR (no overflow, interview favourite)
a = a ^ b;
b = a ^ b;
a = a ^ b;

// Method 3: One-liner arithmetic trick
b = a + b - (a = b);
```

---

**Q3. Swap two Strings WITHOUT a third variable.**

Strings are immutable — you can't do XOR. Use substring arithmetic:

```java
String a = "Hello";
String b = "World";

a = a + b;        // a = "HelloWorld"
b = a.substring(0, a.length() - b.length());  // b = "Hello"
a = a.substring(b.length());                  // a = "World"
```

Or the clean interview answer: use a temporary variable and explain why — Strings are immutable objects, there's no in-place modification. The "no third variable" trick only truly works for primitives.

---

**Q4. What is the difference between `==` and `.equals()` for Strings?**

`==` compares object references (memory addresses). `.equals()` compares the actual character content. Two String literals with the same value share the String pool and `==` returns true — but two `new String("x")` objects will have `==` return false even with identical content. Always use `.equals()` for String comparison in tests.

```java
String a = "test";
String b = "test";
String c = new String("test");

a == b       // true  (both point to pool)
a == c       // false (c is a new heap object)
a.equals(c)  // true  (same content)
```

---

**Q5. Can we override a static method?**

No. Static methods belong to the class, not to an instance. If a subclass defines a static method with the same signature, it's called **method hiding**, not overriding. Polymorphism does not apply — the method that runs depends on the reference type at compile time, not the object type at runtime.

---

**Q6. What is the difference between `final`, `finally`, and `finalize()`?**

- `final` — keyword: makes a variable constant, a method non-overridable, a class non-inheritable
- `finally` — block: always executes after a try-catch regardless of exception, used for cleanup
- `finalize()` — deprecated method on Object that the GC called before collecting an object; unreliable and removed in Java 18+

---

**Q7. What happens if you put `return` inside a `try` block and there's a `finally` block?**

The `finally` block ALWAYS runs, even if there's a `return` in the `try`. If `finally` also has a `return`, it overrides the `try`'s return value.

```java
static int test() {
    try    { return 1; }
    finally{ return 2; }  // this wins — returns 2
}
```

---

**Q8. What is autoboxing and when does it cause bugs?**

Autoboxing is Java's automatic conversion between primitives (`int`) and their wrapper classes (`Integer`). It causes a classic bug when comparing `Integer` objects with `==`:

```java
Integer a = 127;
Integer b = 127;
a == b  // true  — JVM caches Integer values -128 to 127

Integer x = 128;
Integer y = 128;
x == y  // false — outside cache range, different objects
```

Always use `.equals()` when comparing wrapper types.

---

**Q9. What is the difference between `ArrayList` and `LinkedList`?**

| | ArrayList | LinkedList |
|---|---|---|
| Backed by | Dynamic array | Doubly-linked nodes |
| Get by index | O(1) | O(n) |
| Insert/delete middle | O(n) (shift elements) | O(1) (pointer change) |
| Memory | Less (contiguous) | More (node + 2 pointers) |
| Use when | Random access frequent | Frequent insert/delete |

In test automation, `ArrayList` is used almost everywhere. `LinkedList` is mostly an interview topic.

---

**Q10. What is a `NullPointerException` and how do you prevent it?**

NPE is thrown when you call a method or access a field on a `null` reference. Prevention:
- Check with `if (obj != null)` before access
- Use `Optional<T>` for values that may be absent
- Use `Objects.requireNonNull(x, "message")` to fail fast with a clear message
- In tests: always assert element existence before interacting (Playwright auto-waits handle this)

---

**Q11. What is the difference between `throw` and `throws`?**

- `throw` — used inside a method body to actually throw an exception instance: `throw new IllegalArgumentException("msg")`
- `throws` — used in the method signature to declare that the method MAY throw a checked exception: `public void load() throws IOException`

---

**Q12. What is a constructor? Can it be private?**

A constructor initialises a new object. It has the same name as the class and no return type. Yes, a constructor can be private — this is used in the **Singleton pattern** to prevent external instantiation, and in utility classes with only static methods.

---

## Section 2 — String Manipulation

---

**Q13. Reverse a String.**

```java
// Method 1: StringBuilder (cleanest)
String reversed = new StringBuilder("hello").reverse().toString();

// Method 2: char array (shows understanding)
String s = "hello";
char[] chars = s.toCharArray();
int l = 0, r = chars.length - 1;
while (l < r) {
    char tmp = chars[l];
    chars[l++] = chars[r];
    chars[r--] = tmp;
}
return new String(chars);
```

---

**Q14. Check if a String is a palindrome.**

```java
String s = "racecar";
String rev = new StringBuilder(s).reverse().toString();
boolean isPalindrome = s.equals(rev);  // true

// Or two-pointer (no extra space):
int l = 0, r = s.length() - 1;
while (l < r) {
    if (s.charAt(l++) != s.charAt(r--)) return false;
}
return true;
```

---

**Q15. Count occurrences of a character in a String.**

```java
String s = "automation";
long count = s.chars().filter(c -> c == 'a').count();  // 3

// Or classic loop:
int cnt = 0;
for (char c : s.toCharArray()) if (c == 'a') cnt++;
```

---

**Q16. Remove duplicates from a String.**

```java
String s = "programming";
StringBuilder sb = new StringBuilder();
Set<Character> seen = new LinkedHashSet<>();
for (char c : s.toCharArray()) {
    if (seen.add(c)) sb.append(c);
}
return sb.toString();  // "progamin"
```

---

**Q17. Check if two Strings are anagrams.**

```java
char[] a = s1.toCharArray();
char[] b = s2.toCharArray();
Arrays.sort(a);
Arrays.sort(b);
return Arrays.equals(a, b);
```

---

**Q18. Find the first non-repeating character.**

```java
Map<Character, Integer> freq = new LinkedHashMap<>();
for (char c : s.toCharArray())
    freq.merge(c, 1, Integer::sum);
for (Map.Entry<Character, Integer> e : freq.entrySet())
    if (e.getValue() == 1) return e.getKey();
return '\0';
```

---

**Q19. Count words in a sentence.**

```java
String sentence = "  Hello   World  ";
String[] words = sentence.trim().split("\\s+");
int count = words.length;  // 2
```

---

**Q20. Check if a String contains only digits.**

```java
boolean allDigits = s.matches("\\d+");
// Or: s.chars().allMatch(Character::isDigit)
```

---

## Section 3 — XPath Writing

---

**Q21. What are the two types of XPath?**

- **Absolute XPath** — starts from root `/html/body/div/...` — brittle, breaks with any DOM change
- **Relative XPath** — starts from anywhere with `//` — preferred in automation

---

**Q22. XPath by text content.**

```xpath
//button[text()='Submit']
//button[contains(text(),'Submit')]
//span[normalize-space()='Login']
```

---

**Q23. XPath by attribute.**

```xpath
//*[@id='username']
//*[@class='btn btn-primary']
//*[contains(@class,'btn')]
//*[@placeholder='Enter email']
//*[@type='submit']
```

---

**Q24. XPath — find a child element.**

```xpath
//div[@class='form-group']/input
//ul[@id='menu']/li[1]          (first li)
//ul[@id='menu']/li[last()]     (last li)
//ul[@id='menu']/li[position()=2]
```

---

**Q25. XPath — find a parent element.**

```xpath
//input[@id='username']/..          (direct parent)
//input[@id='username']/parent::div
//input[@id='username']/ancestor::form
```

---

**Q26. XPath — find a sibling.**

```xpath
//label[text()='Email']/following-sibling::input
//div[@class='error']/preceding-sibling::input
```

---

**Q27. XPath — multiple conditions (AND / OR).**

```xpath
//input[@type='text' and @placeholder='Username']
//input[@type='text' or @type='email']
```

---

**Q28. XPath — element that starts-with or ends-with attribute.**

```xpath
//*[starts-with(@id,'user')]
//*[substring(@id, string-length(@id) - string-length('_field') + 1) = '_field']
// Or use contains() as a practical substitute for ends-with
```

---

**Q29. XPath — find by index when multiple elements match.**

```xpath
(//input[@type='text'])[1]    (first match)
(//input[@type='text'])[2]    (second match)
(//input[@type='text'])[last()]
```

---

**Q30. CSS Selector vs XPath — when to use which?**

| | CSS Selector | XPath |
|---|---|---|
| Syntax | Shorter, cleaner | More verbose |
| Speed | Faster (browser-native) | Slightly slower |
| Traverse UP (parent) | ❌ Cannot | ✅ Can |
| Find by text | ❌ Cannot | ✅ Can |
| Browser DevTools copy | ✅ Easy | ✅ Easy |

Use CSS when you can (faster, readable). Use XPath when you need parent traversal or text-based matching.

---

## Section 4 — OOP Fundamentals

---

**Q31. What are the 4 pillars of OOP?**

- **Encapsulation** — bundling data + methods, hiding internals via private fields + public getters/setters
- **Inheritance** — a class extends another, inheriting fields and methods (`extends`)
- **Polymorphism** — same method name, different behaviour (overriding at runtime, overloading at compile time)
- **Abstraction** — hiding implementation details, exposing only what's necessary (abstract classes, interfaces)

---

**Q32. What is the difference between an abstract class and an interface?**

| | Abstract Class | Interface |
|---|---|---|
| Can have constructors | ✅ Yes | ❌ No |
| Can have state (fields) | ✅ Yes | Only constants |
| Multiple inheritance | ❌ No (single extends) | ✅ Yes (multiple implements) |
| Method implementations | ✅ Partial (some concrete) | Default methods only (Java 8+) |
| Use when | Shared base with state | Capability contract |

In the framework: `BasePage` is an abstract class (has state — the `Page` instance). `Clickable` could be an interface.

---

**Q33. What is method overriding vs overloading?**

- **Overloading** — same name, different parameters, resolved at **compile time** (static polymorphism)
- **Overriding** — subclass redefines a parent method with same signature, resolved at **runtime** (dynamic polymorphism)

```java
// Overloading (same class)
void click(String locator) {}
void click(String locator, int timeout) {}

// Overriding (subclass)
class BasePage { void waitForLoad() { /* default */ } }
class LoginPage extends BasePage {
    @Override void waitForLoad() { /* custom logic */ }
}
```

---

**Q34. What is the `super` keyword?**

`super` refers to the parent class. Three uses:
1. `super()` — call parent constructor (must be first line)
2. `super.methodName()` — call parent's version of an overridden method
3. `super.field` — access a parent field hidden by a child field with the same name

---

**Q35. Can you instantiate an abstract class?**

No. An abstract class cannot be instantiated directly. You must create a concrete subclass that implements all abstract methods. You CAN have a reference of abstract type pointing to a concrete subclass instance.

---

## Section 5 — Collections & Data Structures

---

**Q36. `HashMap` vs `LinkedHashMap` vs `TreeMap`.**

| | HashMap | LinkedHashMap | TreeMap |
|---|---|---|---|
| Order | None | Insertion order | Sorted by key |
| Null keys | 1 allowed | 1 allowed | ❌ No |
| Performance | O(1) | O(1) | O(log n) |

Use `HashMap` for fast lookup, `LinkedHashMap` when order matters (like the first-non-repeating char problem), `TreeMap` when sorted keys are needed.

---

**Q37. What is the difference between `HashSet` and `TreeSet`?**

`HashSet` — unordered, O(1) add/contains, allows one null.
`TreeSet` — sorted ascending, O(log n), no null. Use `TreeSet` when you need sorted unique elements.

---

**Q38. How does `HashMap` handle collisions?**

Each bucket in a HashMap is a linked list (or a red-black tree when the list exceeds 8 entries in Java 8+). On collision (same hash bucket), new entries are chained. This degrades worst-case lookup from O(1) to O(n) with bad hash functions — which is why overriding `hashCode()` correctly matters.

---

**Q39. What is the contract between `equals()` and `hashCode()`?**

If two objects are equal (`a.equals(b)` is true), they MUST have the same `hashCode()`. The reverse is not required — two objects can have the same hash but not be equal (collision). Breaking this contract silently breaks HashMap and HashSet behaviour.

---

**Q40. `Iterator` vs `for-each` — when does `ConcurrentModificationException` happen?**

If you modify a collection (add/remove) while iterating with for-each or Iterator, you get `ConcurrentModificationException`. Fix: use `Iterator.remove()` or collect items to remove into a separate list and remove after the loop, or use `CopyOnWriteArrayList`.

---

## Section 6 — Exception Handling

---

**Q41. Checked vs Unchecked exceptions.**

- **Checked** — must be handled or declared (`throws`). Compiler enforces it. Examples: `IOException`, `SQLException`. Represent recoverable conditions.
- **Unchecked** — extend `RuntimeException`. Compiler doesn't force handling. Examples: `NullPointerException`, `IllegalArgumentException`, `ArrayIndexOutOfBoundsException`. Represent programming errors.

---

**Q42. Can you catch multiple exceptions in one block?**

Yes, Java 7+ multi-catch:
```java
try {
    // ...
} catch (IOException | SQLException e) {
    log.error("Data error", e);
}
```

---

**Q43. What is exception chaining?**

Wrapping a lower-level exception in a higher-level one while preserving the original cause:
```java
try {
    readFile();
} catch (IOException e) {
    throw new RuntimeException("Config load failed", e);  // e is the cause
}
```
The original stack trace is preserved and visible in logs. Always do this — never swallow or lose the original exception.

---

**Q44. What is a `try-with-resources` statement?**

Java 7+ syntax that automatically closes resources (files, connections, streams) that implement `AutoCloseable`, even if an exception is thrown. Eliminates the need for `finally { connection.close(); }`:

```java
try (Connection conn = db.getConnection();
     PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.executeQuery();
}  // conn and ps auto-closed here
```

---

## Section 7 — Testing Concepts

---

**Q45. What is the difference between Verification and Validation?**

- **Verification** — "Are we building the product right?" — checks that the product conforms to specifications (code reviews, unit tests, static analysis)
- **Validation** — "Are we building the right product?" — checks that the product meets actual user needs (UAT, beta testing, exploratory testing)

---

**Q46. What is the difference between `@BeforeEach` and `@BeforeAll` (or TestNG equivalents)?**

- `@BeforeEach` / `@BeforeMethod` — runs before EVERY test method. Use for browser setup, test data prep.
- `@BeforeAll` / `@BeforeSuite` — runs once before all tests in the class/suite. Use for expensive one-time setup like DB connections, config loading.

---

**Q47. What is a test fixture?**

A test fixture is the fixed state of the environment needed for a test to run reliably — includes pre-conditions (data seeded, app in known state), the test object itself, and post-conditions (cleanup). In JUnit/TestNG terms, `@Before` and `@After` methods define the fixture.

---

**Q48. What is the difference between a stub and a mock?**

- **Stub** — returns hardcoded responses, no verification of how it was called. "Just give me a fake response."
- **Mock** — verifies interactions — that specific methods were called with specific arguments, a specific number of times. Mockito's `verify()` is mock behaviour.

---

**Q49. What is boundary value analysis?**

A black-box test technique where test cases are designed at the edges of input ranges, not the middle — because bugs cluster at boundaries. For an input accepting 1–100: test 0, 1, 2, 99, 100, 101. The exact boundary and one step either side.

---

**Q50. What is equivalence partitioning?**

Dividing input data into groups (partitions) where all values in a partition are expected to behave the same way. You only need to test one value per partition. For age 18–65: test one value in `<18`, one in `18–65`, one in `>65` rather than every integer.

---

**Q51. What is a regression test?**

A test that verifies previously working functionality hasn't been broken by new changes. In CI/CD, the regression suite runs on every PR before merge. Automation is ideal for regression — it's repetitive, deterministic, and needs to run frequently.

---

**Q52. What is the difference between smoke testing and sanity testing?**

- **Smoke** — a shallow, wide test after a build to check the application starts and core features are accessible. "Does it turn on?" Runs before full regression.
- **Sanity** — a narrow, deep test of a specific feature after a bug fix or small change. "Does this one thing work correctly now?"

---

**Q53. What is a flaky test?**

A test that produces different results (pass/fail) on the same code without any changes — non-deterministic. Common causes: timing/race conditions, test order dependency, shared mutable state, external service instability, hardcoded sleeps. Flaky tests erode trust in the entire suite.

---

**Q54. What is test pyramid?**

A model for balancing test types by cost and speed:
- **Unit tests (base)** — many, fast, cheap, test single functions in isolation
- **Integration tests (middle)** — fewer, test how components work together
- **E2E/UI tests (top)** — fewest, slow, expensive, test full user journeys

Inverting the pyramid (too many E2E tests) leads to slow, flaky, expensive CI.

---

**Q55. What is the difference between black-box and white-box testing?**

- **Black-box** — tester has no knowledge of internal code. Tests inputs and outputs only. UAT, system testing, functional testing.
- **White-box** — tester knows the internal structure. Tests code paths, branches, conditions. Unit testing, code coverage analysis.

---

**Q56. What is a CSS selector? Write three examples.**

CSS selectors locate DOM elements by their attributes and hierarchy — used in Playwright, Selenium, and browser DevTools:

```css
#username                    /* by ID */
.btn-primary                 /* by class */
input[type='submit']         /* by attribute */
.form-group > input          /* direct child */
button:nth-child(2)          /* second button */
a[href*='login']             /* href contains 'login' */
```

---

**Q57. What are implicit wait vs explicit wait vs fluent wait?**

- **Implicit wait** (Selenium) — global timeout for finding elements. Set once, applies everywhere. Can mask real issues.
- **Explicit wait** — waits for a specific condition on a specific element. `WebDriverWait.until(ExpectedConditions.visibilityOf(el))`
- **Fluent wait** — like explicit wait but with configurable polling interval and ability to ignore specific exceptions during waiting.

Playwright replaces all three with built-in auto-waiting. No manual waits needed.

---

**Q58. What is PicoContainer and why is it used in Cucumber?**

PicoContainer is a lightweight dependency injection framework used to share state between Cucumber step definition classes. Since Cucumber creates a new instance of each step class per scenario, you can't use instance variables to share data across classes. PicoContainer injects shared context objects (like a `ScenarioContext` class holding the current browser page, logged-in user, etc.) into constructors automatically.

---

**Q59. What is `@DataProvider` in TestNG?**

An annotation that marks a method as a data source for parameterized tests. The data provider method returns `Object[][]` — each inner array is one set of parameters for one test invocation:

```java
@DataProvider(name = "loginData")
public Object[][] data() {
    return new Object[][] {
        {"admin", "password1"},
        {"user",  "password2"}
    };
}

@Test(dataProvider = "loginData")
public void testLogin(String user, String pass) { ... }
```

---

**Q60. What is the difference between `@Test(priority)` and `@Test(dependsOnMethods)` in TestNG?**

- `priority` — controls execution order (lower number = earlier). Tests with same priority run in undefined order. Not a dependency — all tests still run independently.
- `dependsOnMethods` — creates a hard dependency. If the parent test fails, the dependent test is SKIPPED, not failed. Use sparingly — test independence is a design goal.
