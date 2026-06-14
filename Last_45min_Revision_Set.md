# ⚡ Last 45-Minute Interview Revision Set
> **SDET / Senior Automation Engineer — 5+ Years**
> Read once top-to-bottom. Every answer is written the way you'd say it out loud in the room — paragraph format, not bullet points. Scan the **bold trigger phrases** before you go in.

---

## Table of Contents

**A. OOP & Java Core (8 min)**
1. 4 Pillars — one-liner each
2. Abstract Class vs Interface — the real answer
3. String / StringBuilder / StringBuffer
4. Collections cheat-sheet
5. equals() + hashCode() contract
6. ThreadLocal — what it is and why your framework uses it

**B. Framework Architecture (6 min)**
7. 7-Layer framework — rapid-fire recap
8. Page Object Model — what makes a GOOD POM
9. ThreadLocal DriverManager — why it matters for parallel runs
10. PicoContainer dependency injection in Cucumber

**C. BDD & Cucumber (5 min)**
11. BDD vs TDD vs ATDD
12. Gherkin keywords — complete list
13. Scenario Outline + Background
14. Hooks lifecycle
15. Cucumber Expressions vs Regex

**D. Playwright & API Testing (6 min)**
16. Playwright vs Selenium — 5 real differences
17. Auto-waiting — how it works
18. PlaywrightFactory / BrowserContext isolation
19. REST Assured — request spec, response spec, given/when/then chain
20. API-seed pattern — why it speeds up UI tests

**E. Flaky Tests & Test Design (4 min)**
21. What is flakiness — the 3-source model
22. Top causes + one-line fixes
23. Retry vs Quarantine — the interview answer
24. Test pyramid — ratios and why they matter

**F. CI/CD & Jenkins (4 min)**
25. Jenkins core concepts
26. Declarative Jenkinsfile structure
27. Parallel stages in Jenkins
28. GitHub Actions vs Jenkins

**G. Design Patterns (4 min)**
29. Singleton — all 4 implementations
30. Factory Method — driver creation
31. Builder — test config models
32. Strategy — dynamic execution modes
33. SOLID — one sentence per principle

**H. DSA Quick-Hits — Must-Know Patterns (6 min)**
34. Two-pointer template
35. Sliding window template
36. HashMap frequency count template
37. Binary search template
38. Stack-based problems
39. Recursion / backtracking skeleton
40. Big-O summary table

**I. Behavioral & Resume Anchors (4 min)**
41. "Walk me through your framework"
42. "Biggest technical challenge"
43. "How did you handle a flaky suite?"
44. "Why leave your current role?"

**J. Last 5-Min Mental Checklist**
45. Things interviewers check even when they don't ask directly

---

# A. OOP & Java Core

## 1. Four Pillars of OOP

When someone asks about the four pillars, I think of them as four different ways to manage complexity in code.

**Encapsulation** is about hiding the internal state of a class and only exposing what's necessary. You mark fields `private` and expose them through controlled getter and setter methods. The benefit is that the class owns its own state — no one outside can corrupt it directly.

**Abstraction** is related but different. It's about showing *what* a class does without revealing *how* it does it. When you see an `interface` or an `abstract class`, you're seeing abstraction — the caller knows the contract, not the implementation.

**Inheritance** means a child class gets all the behaviour of its parent, establishing an IS-A relationship. In our framework, every page object `extends BasePage`, so they all automatically get the Playwright `Page` instance and shared utility methods like `waitForSelector`.

**Polymorphism** means the same method name behaves differently depending on the actual object type at runtime. When we call `page.click()` on a `LoginPage` or a `DashboardPage`, Java dispatches to the correct override — that's dynamic dispatch, decided at runtime, not compile time.

---

## 2. Abstract Class vs Interface

This is one of the most common OOP questions and the answer I give interviewers is: **an interface is a contract, an abstract class is a partial implementation.**

An interface says "any class that implements me must provide these methods" — it defines capability, like `Clickable` or `Serializable`. In Java 8 and later, interfaces can have `default` and `static` methods with bodies, but they still can't hold instance state or constructors. A class can implement multiple interfaces, which is how Java gets around the lack of multiple inheritance.

An abstract class, on the other hand, *can* have state — actual instance fields, a constructor, and concrete methods alongside the abstract ones. It makes sense when you have a group of related classes that share real behaviour, not just a method signature. In our framework, `BasePage` is an abstract class because every page object needs an actual `Page` instance injected and shared helper methods like `waitForSelector` — that's behaviour and state, not just a contract.

The rule I follow is: if two things share a contract, use an interface. If they share actual code and state, use an abstract class.

```java
// Interface (capability contract)
interface Clickable { void click(String locator); }

// Abstract class (shared base — owns the page instance)
abstract class BasePage implements Clickable {
    protected Page page;
    BasePage(Page page) { this.page = page; }
    protected void waitForSelector(String s) { page.waitForSelector(s); }
}
```

---

## 3. String vs StringBuilder vs StringBuffer

The key thing to understand here is immutability. A `String` in Java is immutable — once created, it never changes. When you write `s += " world"`, you're not modifying the original string. Java creates a brand new `String` object in memory and `s` now points to that. The original `"hello"` is still sitting in the String Pool. This is why doing string concatenation inside a loop is an O(n²) operation — you're creating a new object on every iteration.

`StringBuilder` fixes this. It's a mutable buffer — you `append()` to the same object without creating new ones. It's significantly faster for repeated string building. The trade-off is that it's not thread-safe, so you'd only use it in single-threaded code, which is most test code.

`StringBuffer` is the thread-safe version of `StringBuilder` — every method is `synchronized`. But that synchronisation has a cost, so you'd only use it if you genuinely need multiple threads building the same string, which is rare.

```java
String s = "hello";
s += " world"; // creates NEW object — "hello" stays in the pool

StringBuilder sb = new StringBuilder("hello");
sb.append(" world"); // mutates the same object — one allocation
```

For interview code, if you're building a string in a loop, always reach for `StringBuilder`.

---

## 4. Collections Cheat-Sheet

| Collection | Internal Structure | Null? | Order | Duplicates | O(get) | O(add) |
|---|---|---|---|---|---|---|
| **ArrayList** | Dynamic array (1.5x resize) | Yes | Insertion | Yes | O(1) | O(1) amortised |
| **LinkedList** | Doubly-linked nodes | Yes | Insertion | Yes | O(n) | O(1) at head/tail |
| **HashMap** | Array of buckets + Red-Black tree (>8 nodes) | 1 null key | None | No (keys) | O(1) avg | O(1) avg |
| **LinkedHashMap** | HashMap + doubly-linked list | 1 null key | Insertion | No | O(1) | O(1) |
| **TreeMap** | Red-Black tree | No null key | Sorted | No | O(log n) | O(log n) |
| **HashSet** | HashMap (key only) | 1 null | None | No | O(1) | O(1) |
| **PriorityQueue** | Min-heap | No | Priority | Yes | O(1) peek | O(log n) |

**HashMap internals worth knowing:** when you call `put(key, value)`, Java calls `hashCode()` on the key, uses that to find a bucket index, and then uses `equals()` to check for collisions within that bucket. If a single bucket accumulates more than 8 entries, Java converts that linked list into a Red-Black tree to keep lookups at O(log n) rather than O(n).

---

## 5. equals() and hashCode() Contract

The contract is simple but breaking it causes bugs that are very hard to diagnose. **If `a.equals(b)` returns true, then `a.hashCode()` and `b.hashCode()` must return the same value.** The reverse doesn't have to be true — two objects can have the same hash code but not be equal.

The reason this matters so much is how HashMap works. When you put an object into a HashMap as a key, it uses `hashCode()` to find the bucket. When you try to `get()` the same key later, it hashes again to find the bucket, then uses `equals()` to find the exact key within that bucket. If you override `equals()` without overriding `hashCode()`, two "equal" objects will hash to different buckets, and the HashMap will never find the key you stored. Objects effectively disappear from your map.

The fix is always override both together. Modern IDEs generate correct implementations. If you're doing it manually, `Objects.hash(field1, field2)` handles null-safety and combines fields correctly.

---

## 6. ThreadLocal

`ThreadLocal<T>` is a variable where each thread gets its own independent copy. When Thread-1 calls `set(value)`, Thread-2 calling `get()` gets its own separate value — they never see each other's data.

In a parallel test framework, this is essential. If you store the Playwright `Page` instance in a regular static variable, all threads share the same browser page — Thread-1 clicks something and Thread-2 sees the result. That's a race condition and it produces the most confusing flaky test failures, because they only happen under parallelism.

```java
private static ThreadLocal<Page> pageThreadLocal = new ThreadLocal<>();

public static void setPage(Page page) { pageThreadLocal.set(page); }
public static Page getPage() { return pageThreadLocal.get(); }
public static void removePage() { pageThreadLocal.remove(); } // MUST call in @After
```

The part people miss is the `remove()` call. TestNG reuses threads from a thread pool. If `@After` doesn't call `remove()`, the next test scenario that runs on the same thread inherits a stale browser session from the previous one. This was the exact root cause of one of our hardest parallel flakiness bugs.

---

# B. Framework Architecture

## 7. 7-Layer Framework — Rapid-Fire Recap

```
[1] Feature Files (.feature)          ← Gherkin specs; business-readable
[2] Step Definitions + Hooks          ← Cucumber glue; PicoContainer DI
[3] Page Objects (POM)                ← Encapsulate selectors + actions
[4] Base Page / Driver Manager        ← ThreadLocal Page; PlaywrightFactory
[5] Utilities (ApiHelper, JsonUtils)  ← REST Assured, data helpers
[6] Configuration (Owner lib)         ← Type-safe FrameworkConfig interface
[7] Reporting (Allure + Traces)       ← Screenshots, DOM snapshot, Allure steps
```

Maven builds. TestNG + CucumberRunner executes. GitLab CI/CD schedules nightly.

---

## 8. Page Object Model — What Makes a Good POM

A good Page Object owns everything about one screen — all the locators, all the actions — and exposes clean named methods to the step definitions. The step definition should never contain a raw selector string. When a step says `loginPage.submitCredentials(username, password)`, the step definition doesn't know or care whether that button is a CSS class or an XPath.

What makes a POM bad is when step definitions start containing `page.click("#btn-submit")` directly, or when page methods do too many things at once — navigate AND fill AND assert all in one method. Those violations mean that when the UI changes, you're hunting through step definitions and page objects equally, which defeats the whole purpose of the pattern.

The other thing I enforce is that assertions never live in page objects. A page object is like a remote control — it presses buttons and fills fields. It doesn't judge whether the outcome was correct. Assertions belong in the test layer, either in the step definitions or in assertion helper classes.

---

## 9. ThreadLocal DriverManager — Why It Matters for Parallel Runs

In a parallel Cucumber run, TestNG starts multiple threads, and each thread picks up scenarios from the test queue. Each of those threads needs its own completely isolated browser session. We store all four objects — `Playwright`, `Browser`, `BrowserContext`, and `Page` — in separate ThreadLocal variables inside `DriverManager`.

The `@Before` hook creates a fresh set of these for the current thread. The `@After` hook closes them and calls `ThreadLocal.remove()` on all four. The result is that four parallel threads each run in their own independent Chromium session with zero shared state between them.

Without this pattern, you'd either have to create a new browser process per thread (extremely expensive) or accept that threads corrupt each other's state (which produces random, irreproducible failures).

---

## 10. PicoContainer Dependency Injection in Cucumber

The problem PicoContainer solves is sharing state between step definition classes without using static variables. If your login steps and dashboard steps need to share a `Page` reference or a logged-in user object, you can't just pass it directly because Cucumber instantiates step classes independently.

The naive solution is a static field, but static fields are shared across all threads — instant parallelism bug. PicoContainer's solution is to declare a shared context class, for example `TestContext`, and have every step class that needs it declare it as a constructor parameter. Cucumber and PicoContainer work together to instantiate `TestContext` once per scenario and inject it consistently into every step class within that scenario.

```java
public class LoginSteps {
    private final TestContext ctx;
    public LoginSteps(TestContext ctx) { this.ctx = ctx; } // PicoContainer injects this
}
```

Zero static state. Thread-safe. One context per scenario. It's one of those patterns that seems like overhead until the first time you try to run 4 parallel scenarios without it.

---

# C. BDD & Cucumber

## 11. BDD vs TDD vs ATDD

These three are related but aim at different levels of the stack.

**TDD** is a developer practice — you write a failing unit test first, then write just enough code to make it pass, then refactor. It's code-level, driven by the developer, and produces a safety net of fast unit tests.

**BDD** extends that idea outward to include the whole team. Instead of writing tests in code first, you write them in plain English using Gherkin — Given/When/Then. The key is that the BA, developer, and QA write the scenarios together before any code is written. It creates a shared understanding of what the feature should do, and the Gherkin scenarios become living documentation.

**ATDD** is similar to BDD but is specifically focused on acceptance criteria. The product owner defines the acceptance criteria, and those directly become the automated tests. The distinction from BDD is mostly one of emphasis — ATDD is more outcome-focused, BDD is more behaviour-focused.

---

## 12. Gherkin Keywords

`Feature` `Background` `Scenario` `Scenario Outline` `Given` `When` `Then` `And` `But` `Examples` `@tag` `#comment` `"""` (doc strings) `|` (data tables)

---

## 13. Scenario Outline + Background

`Background` is a way to avoid repeating the same `Given` steps at the top of every scenario in a feature file. It runs before each scenario — it's like a shared setup block for the whole file, not a global before hook.

`Scenario Outline` lets you run the same scenario with multiple data sets without duplicating the scenario. You use `<placeholders>` in the steps and provide the values in an `Examples` table.

```gherkin
Background:
  Given the application is on the login page

Scenario Outline: Login with multiple users
  When I login with "<username>" and "<password>"
  Then I should see the "<dashboard>" page
  Examples:
    | username | password | dashboard |
    | admin    | admin123 | Admin     |
    | user1    | pass1    | Standard  |
```

---

## 14. Hooks Lifecycle

```java
@Before(order = 1)      // lowest order runs FIRST in @Before
public void setup() { /* create browser, load config */ }

@BeforeStep
public void beforeEachStep() { /* log step name */ }

@AfterStep
public void afterEachStep(Scenario s) { /* screenshot on step failure */ }

@After(order = 1)       // highest order runs FIRST in @After
public void teardown(Scenario s) {
    if (s.isFailed()) { /* attach screenshot */ }
    DriverManager.removePage(); // CRITICAL: prevent ThreadLocal leak
}
```

**The order gotcha interviewers love:** in `@Before`, `order = 1` runs first (ascending). In `@After`, the order is reversed — the highest `order` value runs first. This is intentional so that whatever set up last tears down first.

---

## 15. Cucumber Expressions vs Regex

Cucumber Expressions are the modern, preferred approach. They're type-safe — `{string}` automatically captures a quoted string and passes it as a `String` parameter. `{int}` captures integers. They're much more readable than regex.

Regular expressions are still supported and sometimes needed for complex matching patterns — like optionally matching "click" or "tap" in the same step. But for the majority of steps, Cucumber Expressions are cleaner and less error-prone.

```java
// Cucumber Expression (preferred)
@When("I login with {string} and {string}")
public void login(String user, String pass) {}

// Regex (use when you need complex pattern matching)
@When("^I (?:click|tap) the (.+) button$")
public void click(String buttonName) {}
```

---

# D. Playwright & API Testing

## 16. Playwright vs Selenium — 5 Real Differences

The most important difference is the underlying protocol. Selenium communicates with the browser over HTTP — every command is a round-trip HTTP request to the WebDriver. Playwright uses a persistent WebSocket connection directly to the browser's DevTools Protocol, which means it gets real-time feedback from the browser rather than polling.

This protocol difference is what makes auto-waiting possible in Playwright. Because Playwright has a live connection to the browser's event system, it can watch for element state changes in real time. Selenium has no equivalent — you have to manually write `WebDriverWait` with `ExpectedConditions` for everything.

The `BrowserContext` is another major difference. In Selenium, test isolation means launching a new browser process. In Playwright, you can create hundreds of `BrowserContext` instances from a single browser — each one is a complete private session with its own cookies, storage, and state, but shares the browser process. For parallel testing, this is much cheaper.

Finally, network interception is built in. `page.route()` lets you intercept and mock any HTTP call the browser makes. In Selenium you need a third-party proxy like BrowserMobProxy to do the same thing.

| Feature | Playwright | Selenium |
|---|---|---|
| Protocol | CDP / BiDi (WebSocket) | WebDriver (HTTP) |
| Auto-waiting | Built-in on every action | Manual `WebDriverWait` |
| Contexts | Native BrowserContext isolation | Separate driver instances |
| Network interception | `page.route()` built-in | Needs proxy/BrowserMob |
| Speed | Faster (no HTTP round-trip) | Slower |

---

## 17. Auto-Waiting

Before Playwright executes any action — a click, a fill, a check — it runs through a checklist against the target element. The element must be attached to the DOM, visible (not hidden with `display:none` or `opacity:0`), stable (not mid-animation), enabled, and not obscured by another element. Only when all those conditions are satisfied does Playwright actually perform the action.

This eliminates the entire category of timing failures that plague Selenium tests. You never need `Thread.sleep()` or manual wait wrappers. If the element isn't ready, Playwright keeps retrying until it is, up to the configured timeout which defaults to 30 seconds.

The override is straightforward — `page.setDefaultTimeout(10000)` globally, or pass a `setTimeout` option per action if one specific step needs a different limit.

---

## 18. PlaywrightFactory / BrowserContext Isolation

```java
public static void initDriver(String browser) {
    Playwright playwright = Playwright.create();
    Browser b = switch (browser.toLowerCase()) {
        case "firefox" -> playwright.firefox().launch(options);
        case "webkit"  -> playwright.webkit().launch(options);
        default        -> playwright.chromium().launch(options);
    };
    BrowserContext ctx = b.newContext(contextOptions);
    Page page = ctx.newPage();
    DriverManager.setPlaywright(playwright);
    DriverManager.setBrowser(b);
    DriverManager.setContext(ctx);
    DriverManager.setPage(page);
}
```

---

## 19. REST Assured — Request Spec, Response Spec, Given/When/Then

```java
RequestSpecification reqSpec = new RequestSpecBuilder()
    .setBaseUri("https://api.example.com")
    .addHeader("Authorization", "Bearer " + token)
    .setContentType(ContentType.JSON)
    .build();

Response response =
    given().spec(reqSpec).body(payload)
    .when().post("/users")
    .then()
        .statusCode(201)
        .body("id", notNullValue())
    .extract().response();

String userId = response.jsonPath().getString("id");
```

---

## 20. API-Seed Pattern

The idea is simple: instead of navigating through five UI screens to reach the feature you actually want to test, you call the API directly in the `@Before` hook to pre-build the state — create the user, create the order, set the permissions — and then navigate the browser directly to the right page.

The benefit is dramatic. A login flow through the UI might take two minutes for a slow integration test. An API call to create an authenticated session takes 200 milliseconds. When you have 400 tests and each one skips a 2-minute UI setup, the runtime reduction is enormous.

In my experience this alone cut our suite runtime by around 40%. The tests also become more reliable because you're not chaining UI dependencies — a flaky login page can't cause a failure in a test that's supposed to be testing the checkout flow.

---

# E. Flaky Tests & Test Design

## 21. Flakiness — The 3-Source Model

When I see a flaky test, I always ask which of three things is non-deterministic: the test itself, the environment, or the system under test. The fix is completely different for each.

If it's the **test**, the cause is usually a hard-coded sleep, an unstable locator that breaks when the DOM changes slightly, a dependency on test execution order, or shared mutable state between parallel scenarios. These are all fixable by the automation team.

If it's the **environment**, you're dealing with things like Docker image drift between runs, network latency spikes in CI, or shared test data in a database being modified by a parallel run. You fix these with infrastructure — pinned Docker images, unique UUID-based test data per run, isolated test environments.

If it's the **system under test**, then the flakiness is actually exposing a real race condition or timing bug in the product. In that case it's not a test problem at all — it's a bug report.

---

## 22. Top Causes + One-Line Fixes

| Cause | Fix |
|---|---|
| `Thread.sleep(2000)` | Wait on state — `waitForSelector`, `waitForResponse` |
| Unstable locators (XPath on layout) | Use `data-testid`, ARIA roles |
| Shared test data in parallel | UUID-based unique data per test |
| Test ordering dependency | Make every test self-seeding with `@Before` API setup |
| Animations / transitions | Disable in test env; wait for end-state element |
| Network timing | `waitForResponse()` or wait for spinner to disappear |
| ThreadLocal leak | `removePage()` in `@After` every time |

---

## 23. Retry vs Quarantine — The Interview Answer

Retry and quarantine are not competing solutions — they serve different purposes and using the wrong one signals poor engineering judgement.

**Retry** hides the problem. It's a circuit-breaker, not a fix. The only time I'd accept retry in a pipeline is as a temporary measure while the root cause is actively being investigated, with a hard limit of two retries and alerting on any retry-triggered pass. If a test is retrying regularly, that's a debt ticket, not a closed issue.

**Quarantine** is the honest approach. You tag the test `@Quarantine`, exclude it from the main go/no-go pipeline, run it in a separate nightly job so it's still visible, and file a Jira ticket with a deadline to fix it. The main pipeline stays green, the flaky test doesn't block releases, and the problem doesn't get buried. The mistake engineers make is treating quarantine as permanent — it needs an owner and a deadline.

What I never do is add retries and declare it fixed. That just trains developers to ignore red builds.

---

## 24. Test Pyramid

```
         /\
        /E2E\        ~10% — slow, brittle, expensive. Only happy paths + critical flows.
       /------\
      / Integ  \     ~20% — service + API layer, component contracts
     /----------\
    /    Unit    \   ~70% — fast, isolated, cheap. Business logic, utilities, helpers.
   /--------------\
```

The ratios matter because E2E tests are 10 to 100 times slower than unit tests. A suite that is 90% E2E runs for 30 minutes and produces failures that take an hour to triage. Nobody trusts it. The pyramid inverts that — most of your confidence comes from fast, cheap unit tests, with E2E reserved for the critical user journeys that can only be validated through a real browser.

---

# F. CI/CD & Jenkins

## 25. Jenkins Core Concepts

| Term | Meaning |
|---|---|
| **Job / Project** | A configured task (build, test, deploy) |
| **Pipeline** | A multi-stage job defined in a Jenkinsfile |
| **Node / Agent** | Machine where the pipeline runs |
| **Executor** | A slot on a node (how many pipelines run in parallel) |
| **Workspace** | Working directory on the agent for the current build |
| **Artifact** | File saved after build (jar, test-report, screenshot) |
| **Upstream/Downstream** | Trigger chains between jobs |

---

## 26. Declarative Jenkinsfile Structure

```groovy
pipeline {
    agent any
    environment { BROWSER = 'chrome' }
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Build') {
            steps { sh 'mvn clean compile -q' }
        }
        stage('Test') {
            steps { sh 'mvn test -Dcucumber.filter.tags=@smoke' }
        }
        stage('Reports') {
            steps { allure includeProperties: false, results: [[path: 'target/allure-results']] }
        }
    }
    post {
        always { junit 'target/surefire-reports/*.xml' }
        failure { mail to: 'qa@team.com', subject: "Build failed: ${env.JOB_NAME}" }
    }
}
```

---

## 27. Parallel Stages in Jenkins

```groovy
stage('Cross-Browser') {
    parallel {
        stage('Chrome')  { steps { sh 'mvn test -Dbrowser=chrome' } }
        stage('Firefox') { steps { sh 'mvn test -Dbrowser=firefox' } }
        stage('WebKit')  { steps { sh 'mvn test -Dbrowser=webkit' } }
    }
}
```

---

## 28. GitHub Actions vs Jenkins

The core difference is hosting. Jenkins is self-hosted — you own and maintain the infrastructure, install plugins, manage agents. GitHub Actions is cloud-native, managed by GitHub. You write YAML workflow files instead of a Groovy Jenkinsfile, and you use community actions from the GitHub Marketplace instead of Jenkins plugins.

I'd recommend Jenkins for organisations that already have it, have complex custom agents, or need to keep builds entirely within their own infrastructure for compliance reasons. For greenfield projects or open-source repos, GitHub Actions is faster to set up and has tighter GitHub integration — PR checks, branch protection, and deployment environments are first-class citizens.

| | Jenkins | GitHub Actions |
|---|---|---|
| Hosting | Self-hosted (you manage infra) | Cloud-native (GitHub-managed runners) |
| Config | Jenkinsfile (Groovy) | `.github/workflows/*.yml` (YAML) |
| Ecosystem | 1,800+ plugins | GitHub Marketplace actions |

---

# G. Design Patterns

## 29. Singleton — All 4 Implementations

```java
// 1. Eager (thread-safe, always initialised at class load)
public class Config {
    private static final Config INSTANCE = new Config();
    private Config() {}
    public static Config get() { return INSTANCE; }
}

// 2. Lazy + Double-Checked Locking (thread-safe, deferred init)
public class Config {
    private static volatile Config instance;
    private Config() {}
    public static Config get() {
        if (instance == null) {
            synchronized (Config.class) {
                if (instance == null) instance = new Config();
            }
        }
        return instance;
    }
}

// 3. Bill Pugh (elegant — no synchronisation overhead at all)
public class Config {
    private Config() {}
    private static class Holder { static final Config INSTANCE = new Config(); }
    public static Config get() { return Holder.INSTANCE; }
}

// 4. Enum (reflection-proof, serialisation-safe — Joshua Bloch's recommendation)
public enum Config { INSTANCE; public String getBaseUrl() { return "https://..."; } }
```

**Thread-safety:** Eager ✅ | DCL ✅ (needs `volatile`) | Bill Pugh ✅ | Enum ✅ (strongest)

The `volatile` keyword in DCL is not optional. Without it, the JVM's memory model allows the write to `instance` to be visible to other threads before the object's constructor has finished running. You'd get a reference to a half-constructed object.

---

## 30. Factory Method — Driver Creation

The Factory Method pattern means the caller asks for an object without specifying the concrete class. In our framework, the `DriverFactory` takes a browser name as a string and returns the appropriate Playwright `Page` — the caller never directly instantiates `chromium` or `firefox`.

```java
public class DriverFactory {
    public static Page createPage(String browser) {
        return switch (browser) {
            case "firefox" -> Playwright.create().firefox().launch().newContext().newPage();
            case "webkit"  -> Playwright.create().webkit().launch().newContext().newPage();
            default        -> Playwright.create().chromium().launch().newContext().newPage();
        };
    }
}
```

Adding a new browser means adding one new `case`. Nothing else in the framework changes.

---

## 31. Builder — Test Config Models

The Builder pattern is the right choice when you have an object with many optional parameters. The alternative — a constructor with 8 parameters — is a maintenance nightmare and error-prone (easy to swap two `boolean` arguments silently).

```java
FrameworkConfig config = new FrameworkConfig.Builder()
    .browser("chrome")
    .headless(true)
    .baseUrl("https://staging.example.com")
    .timeout(30_000)
    .build();
```

The `build()` method is also the right place to validate that required combinations are present before the object is created.

---

## 32. Strategy — Dynamic Execution Modes

Strategy lets you swap algorithms or behaviours at runtime without changing the calling code. In test automation, this is useful when you want to support multiple interaction modes — direct click, hover, JavaScript click — and choose between them based on configuration or annotation.

```java
interface ExecutionStrategy { void execute(Page page, String locator); }
class ClickStrategy  implements ExecutionStrategy { public void execute(Page p, String l) { p.click(l); } }
class HoverStrategy  implements ExecutionStrategy { public void execute(Page p, String l) { p.hover(l); } }

executor.setStrategy(new ClickStrategy());
executor.run(page, "#submit");
```

---

## 33. SOLID — One Sentence Per Principle

**Single Responsibility:** A class should have one reason to change. `LoginPage` handles login UI only — not config loading, not reporting.

**Open/Closed:** Open for extension, closed for modification. You can add a `FirefoxDriver` without touching `ChromeDriver`.

**Liskov Substitution:** A subclass must be usable everywhere its parent is expected. `LoginPage extends BasePage` works anywhere the code expects a `BasePage`.

**Interface Segregation:** Don't force a class to implement methods it doesn't need. Split fat interfaces into focused ones.

**Dependency Inversion:** Depend on abstractions, not on concrete implementations. `BasePage` depends on the `Page` interface, not on a specific browser class.

---

# H. DSA Quick-Hits — Must-Know Patterns

## 34. Two-Pointer Template

```java
// Pair sum in sorted array
int l = 0, r = arr.length - 1;
while (l < r) {
    int sum = arr[l] + arr[r];
    if (sum == target) return new int[]{l, r};
    else if (sum < target) l++;
    else r--;
}
```
**Use for:** sorted pair problems, palindrome check, container with most water, removing duplicates in-place.

---

## 35. Sliding Window Template

```java
// Longest substring without repeating characters
Map<Character, Integer> seen = new HashMap<>();
int max = 0, l = 0;
for (int r = 0; r < s.length(); r++) {
    char c = s.charAt(r);
    if (seen.containsKey(c) && seen.get(c) >= l) l = seen.get(c) + 1;
    seen.put(c, r);
    max = Math.max(max, r - l + 1);
}
return max;
```
**Use for:** subarray/substring with a constraint, max/min window size, contiguous sum.

---

## 36. HashMap Frequency Count Template

```java
// Two sum
Map<Integer, Integer> map = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    int complement = target - nums[i];
    if (map.containsKey(complement)) return new int[]{map.get(complement), i};
    map.put(nums[i], i);
}
```
**Use for:** two-sum, anagram check, frequency counting, grouping anagrams.

---

## 37. Binary Search Template

```java
int l = 0, r = arr.length - 1;
while (l <= r) {
    int mid = l + (r - l) / 2; // always write it this way — avoids integer overflow
    if (arr[mid] == target) return mid;
    else if (arr[mid] < target) l = mid + 1;
    else r = mid - 1;
}
return -1;
```
**Use for:** sorted array search, rotated array, find boundary/peak element.

---

## 38. Stack-Based Problems

```java
// Valid parentheses
Deque<Character> stack = new ArrayDeque<>();
Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');
for (char c : s.toCharArray()) {
    if ("([{".indexOf(c) >= 0) stack.push(c);
    else if (stack.isEmpty() || stack.pop() != pairs.get(c)) return false;
}
return stack.isEmpty();
```
**Use for:** matching brackets, next greater element, monotonic stack (daily temperatures), evaluate expressions.

---

## 39. Recursion / Backtracking Skeleton

```java
void backtrack(int[] nums, int start, List<Integer> current, List<List<Integer>> result) {
    result.add(new ArrayList<>(current));           // add current state
    for (int i = start; i < nums.length; i++) {
        current.add(nums[i]);                       // make a choice
        backtrack(nums, i + 1, current, result);    // recurse with it
        current.remove(current.size() - 1);         // undo the choice
    }
}
```
**Use for:** subsets, permutations, combinations, word search, N-queens.

The "undo the choice" step is what makes it backtracking rather than plain recursion — it restores state so the next branch of the for loop starts clean.

---

## 40. Big-O Summary Table

| Algorithm / Operation | Time | Space |
|---|---|---|
| Array access | O(1) | — |
| Array search (unsorted) | O(n) | — |
| Binary search | O(log n) | O(1) |
| HashMap get/put | O(1) avg | O(n) |
| TreeMap get/put | O(log n) | O(n) |
| Sorting (comparison-based) | O(n log n) | O(log n) |
| BFS / DFS on graph | O(V + E) | O(V) |
| Merge sort | O(n log n) | O(n) |
| Quick sort (avg) | O(n log n) | O(log n) |

Always state average vs worst. HashMap is O(n) worst case when all keys collide. QuickSort is O(n²) worst case on already-sorted input with a bad pivot choice.

---

# I. Behavioral & Resume Anchors

## 41. "Walk Me Through Your Framework" — The 60-Second Pitch

*"We built a 7-layer enterprise BDD automation framework in Java. Playwright is the browser engine, Cucumber handles the Gherkin layer, TestNG is the runner, and REST Assured handles API calls within the test lifecycle. The architecture is fully parallel-safe — every browser session lives in a ThreadLocal, and we use PicoContainer for dependency injection between step classes, so there's zero shared mutable state across threads.*

*Configuration is type-safe through the Owner library — you pass an environment flag at runtime and the framework automatically picks the right properties file. Reports are Allure with Playwright trace attachments on failure, so any broken test can be replayed frame by frame without needing to reproduce it locally.*

*The whole thing runs on GitLab CI — nightly regression on a cron schedule and triggered smoke on every pull request."*

---

## 42. "Biggest Technical Challenge" — Model Answer

*"The hardest problem I've dealt with was parallel flakiness caused by ThreadLocal memory leaks. We had a suite of 400 tests that passed perfectly in sequential mode but showed 8 to 10 random failures every parallel run. The failures were in completely different tests each time — no consistent pattern.*

*Root cause: our DriverManager was storing the Page instance correctly per thread using ThreadLocal, but the @After hook wasn't calling ThreadLocal.remove(). TestNG reuses threads from a pool, so when a scenario finished and a new one started on the same thread, it inherited the stale browser session from the previous scenario — but only sometimes, depending on thread scheduling.*

*The fix was adding DriverManager.removePage() inside the @After hook with order=1 so it runs last in the teardown sequence. Failures dropped to zero. The lesson I took from it is that ThreadLocal is only half the pattern — the cleanup is equally important, and its absence creates bugs that are almost impossible to reproduce on demand."*

---

## 43. "How Did You Handle a Flaky Suite?" — Model Answer

*"First thing I do is measure. I tag suspected flaky tests and run a 10-iteration report to get an actual flake percentage — something like 'this test fails 3 out of 10 runs.' That gives you a baseline to verify your fix against.*

*Then I triage by source: is it the test, the environment, or the system under test? For the test layer, I look for Thread.sleep calls and replace them with Playwright's actionability checks, and I audit locators — any XPath based on position or layout structure gets replaced with a data-testid.*

*For environment issues, I pin Docker image versions and introduce UUID-based test data so parallel runs never touch the same records.*

*For anything that's actually a product bug — a genuine race condition in the application — I write up a clear repro, file it as a bug, and quarantine the test. That means tagging it @Quarantine, excluding it from the main pipeline, running it separately in a nightly job, and setting a deadline to fix it.*

*What I don't do is add retries and call it fixed. Retries hide the problem and eventually you have a pipeline where half the tests are retrying on every run and nobody trusts the results."*

---

## 44. "Why Leave Your Current Role?" — Safe Framing

Keep it entirely forward-looking — no criticism of the current employer, no mention of salary, no personal reasons.

*"I've built and owned the automation framework end-to-end at my current company — it's in a solid state and I'm proud of what the team has achieved with it. I'm looking for a role where I can apply that foundation to a larger-scale challenge, ideally working with a team that's pushing further into areas like performance testing, AI-assisted test generation, or genuinely shifting quality ownership further left into the development cycle. That's where I want to grow next."*

---

# J. Last 5-Min Mental Checklist

## 45. What Interviewers Check Even When They Don't Ask Directly

**On your answers:**
- [ ] Do you say "we" not "I" for team decisions? (shows you know how teams work)
- [ ] Do you give a concrete number? ("cut runtime by 40%", "400-test suite", "8–10 failures")
- [ ] Can you name the actual class or file? (DriverManager, PicoContainer, testng.xml)
- [ ] Do you volunteer the trade-off? ("retry is fast but hides problems")

**On your code:**
- [ ] Variable names tell a story — `isClickScrolling`, not `flag`
- [ ] Edge cases mentioned — null, empty, overflow (`mid = l + (r-l)/2` not `(l+r)/2`)
- [ ] Big-O stated before being asked

**On framework questions:**
- [ ] Don't forget `ThreadLocal.remove()` — interviewers test this specifically
- [ ] Know the order semantics: `@Before` lowest-first, `@After` highest-first
- [ ] `volatile` is **required** in Double-Checked Locking — without it the JVM can reorder the constructor write

**On behavioral:**
- [ ] Every story has: situation → your specific action → measurable result
- [ ] Failure stories are fine — the lesson is what they're evaluating, not the failure

**Mindset going in:**
> *"They're not checking if you know everything. They're checking if you think like an engineer — systematic, evidence-based, honest about trade-offs."*
