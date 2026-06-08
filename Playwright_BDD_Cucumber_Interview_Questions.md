# Playwright + BDD + Cucumber — SDET Interview Questions
> 5+ years SDET level. Covers Playwright Java API, BDD architecture, Cucumber lifecycle, PicoContainer DI, and parallel execution — all at senior engineering depth.

---

## 1. What is Playwright and how does it differ from Selenium WebDriver?

**Answer:**

| | Playwright (Java) | Selenium WebDriver |
|---|---|---|
| Browser protocol | CDP / WebSocket (direct) | WebDriver protocol (HTTP) |
| Auto-wait | Built-in on every action | Manual `WebDriverWait` required |
| Parallel browsers | Isolated `BrowserContext` per test | Separate driver instance required |
| Network interception | First-class API | Third-party proxy only |
| Trace/video | Built-in `Tracing` API | Third-party plugins |
| Speed | Faster (fewer round trips) | Slower |

Playwright connects directly to the browser's DevTools Protocol, eliminating the WebDriver HTTP layer. `BrowserContext` provides instant, isolated sessions without spawning a new browser process — critical for high-concurrency parallel runs.

> Hot take: *"Playwright isn't just a faster driver; it's a completely different runtime. Spawning isolated BrowserContexts instead of heavy browser processes makes parallel E2E testing practical rather than painful."*

---

## 2. What is `BrowserContext` and why is it central to Playwright's parallel model?

**Answer:**
`BrowserContext` is a complete, isolated browser session — its own cookies, local storage, cache, and auth state. Multiple contexts can run inside a single `Browser` process simultaneously.

```java
// One Browser process, two completely isolated user sessions
Playwright pw = Playwright.create();
Browser browser = pw.chromium().launch();

BrowserContext adminCtx  = browser.newContext();
BrowserContext viewerCtx = browser.newContext();

Page adminPage  = adminCtx.newPage();
Page viewerPage = viewerCtx.newPage();

// Both browse independently — no cookie or session leakage
adminPage.navigate("https://app.enterprise.com/admin");
viewerPage.navigate("https://app.enterprise.com/viewer");
```

In a `ThreadLocal` + TestNG parallel setup, each thread gets its own `BrowserContext` rather than its own `Browser` — significantly lighter on system resources.

> Hot take: *"If you launch a new browser process for every test, your E2E suite will quickly choke your CI server. Launch one browser process, and run every test in a separate, isolated BrowserContext. It's the only way to scale."*

---

## 3. How do you implement a `ThreadLocal` DriverManager with Playwright for parallel test safety?

**Answer:**

```java
public final class DriverManager {
    private static final ThreadLocal<Page>           PAGE     = new ThreadLocal<>();
    private static final ThreadLocal<BrowserContext> CONTEXT  = new ThreadLocal<>();
    private static final ThreadLocal<Playwright>     PW       = new ThreadLocal<>();

    public static void initDriver() {
        Playwright playwright = Playwright.create();
        Browser browser = playwright.chromium().launch(
            new BrowserType.LaunchOptions().setHeadless(ConfigFactory.getConfig().headless())
        );
        BrowserContext ctx  = browser.newContext();
        Page           page = ctx.newPage();

        PW.set(playwright);
        CONTEXT.set(ctx);
        PAGE.set(page);
    }

    public static Page     getPage()    { return PAGE.get();    }
    public static BrowserContext getContext() { return CONTEXT.get(); }

    public static void teardown() {
        if (CONTEXT.get() != null) CONTEXT.get().close();
        if (PW.get()      != null) PW.get().close();
        PAGE.remove();
        CONTEXT.remove();
        PW.remove();   // CRITICAL — prevents ThreadLocal memory leaks in thread-pool executors
    }
}
```

The `remove()` calls in teardown are non-negotiable — omitting them causes memory leaks in TestNG's thread pool because threads are reused across the suite lifetime.

> Hot take: *"ThreadLocal variables will cause memory leaks if you don't clean them up. Always call threadLocal.remove() in your teardown block, or you'll bleed memory in high-concurrency CI environments."*

---

## 4. What is BDD and how does Gherkin map to a Cucumber test lifecycle?

**Answer:**
BDD (Behaviour-Driven Development) expresses tests in plain English that non-technical stakeholders can validate. Gherkin provides the syntax; Cucumber is the JVM runner that parses it.

```gherkin
Feature: Member Authentication

  @Auth @Regression
  Scenario: Happy Path Member Login
    Given User is on the authentication screen
    When  User submits username "standard_user" and password "password123"
    Then  User should be redirected to the Home Dashboard
```

**Lifecycle:**
1. **CucumberRunner** reads `testng.xml` → finds feature files
2. **Cucumber parser** matches each step to `@Given/@When/@Then` annotated Java methods
3. **@Before Hooks** run → driver initialises
4. **Step Definitions** execute sequentially → Page Objects perform UI actions
5. **@After Hooks** run → screenshot on failure, driver tears down
6. **Allure/Extent plugin** generates the report from the Cucumber event stream

> Hot take: *"BDD is a communication tool, not a testing language. If your product managers and business analysts aren't reading your Gherkin features, you have a bloated E2E framework, not a BDD process."*

---

## 5. What is PicoContainer and why does Cucumber recommend it for dependency injection?

**Answer:**
PicoContainer is a lightweight DI container that Cucumber integrates with via `cucumber-picocontainer` dependency. When multiple step definition classes share state (e.g., a token obtained in one step needed in another), PicoContainer injects shared objects automatically — no static fields or singletons needed.

```java
// Shared context object
public class AuthContext {
    public String token;
    public String userId;
}

// Step class 1 — sets the token
public class LoginSteps {
    private final AuthContext ctx;

    public LoginSteps(AuthContext ctx) { this.ctx = ctx; }  // PicoContainer injects

    @When("User submits username {string} and password {string}")
    public void submitAuth(String user, String pass) {
        ctx.token = apiHelper.fetchAuthToken(user, pass);
    }
}

// Step class 2 — uses the same token
public class DashboardSteps {
    private final AuthContext ctx;

    public DashboardSteps(AuthContext ctx) { this.ctx = ctx; }

    @Then("User should see {int} dashboard items")
    public void verifyDashboard(int expected) {
        // ctx.token is populated by LoginSteps — same object, injected by PicoContainer
        int actual = apiHelper.getDashboardItemCount(ctx.token);
        Assert.assertEquals(actual, expected);
    }
}
```

PicoContainer creates one instance of `AuthContext` per scenario, keeping scenarios isolated. No static globals, no thread-safety concerns per scenario.

> Hot take: *"Do not share test state across steps using static variables or global caches. PicoContainer manages step-dependency lifetimes per scenario automatically, eliminating cross-thread data contamination."*

---

## 6. How do you configure a Cucumber + TestNG runner for parallel execution?

**Answer:**

```java
// CucumberRunner.java
@CucumberOptions(
    features  = "src/test/resources/features",
    glue      = "com.enterprise.framework.steps",
    plugin    = {
        "io.qameta.allure.cucumber7jvm.AllureCucumber7Jvm",
        "pretty",
        "html:target/cucumber-report.html"
    },
    tags      = "@Regression"
)
public class CucumberRunner extends AbstractTestNGCucumberTests {

    @Override
    @DataProvider(parallel = true)  // KEY — enables parallel scenario execution
    public Object[][] scenarios() {
        return super.scenarios();
    }
}
```

```xml
<!-- testng.xml -->
<suite name="Enterprise Suite" parallel="tests" thread-count="4">
    <test name="Regression">
        <classes>
            <class name="com.enterprise.runners.CucumberRunner"/>
        </classes>
    </test>
</suite>
```

`@DataProvider(parallel = true)` in the runner combined with TestNG's `thread-count` drives parallel scenario execution. Each scenario gets its own thread, and `ThreadLocal` in `DriverManager` ensures browser isolation.

> Hot take: *"Parallel TestNG execution is only as reliable as your cleanup hooks. Set parallel=true in your DataProvider, and make sure your Hooks close contexts immediately on teardown."*

---

## 7. How do you use Playwright's built-in auto-wait and when do you need explicit waits?

**Answer:**
Playwright automatically waits for elements to be **attached, visible, stable, enabled, and not obscured** before acting. This eliminates most `Thread.sleep()` calls.

```java
// Playwright auto-waits for button to be visible + enabled
page.click("button.submit");          // no wait needed

// Auto-wait on fill — waits for element to be editable
page.fill("#username", "standard_user");

// Explicit wait — when you need to wait for a CONDITION, not just element presence
page.waitForSelector(".spinner", new Page.WaitForSelectorOptions()
    .setState(WaitForSelectorState.HIDDEN));  // wait for loading spinner to disappear

// Wait for network idle (after form submission that triggers API call)
page.waitForLoadState(LoadState.NETWORKIDLE);

// Custom condition wait
page.waitForFunction("() => document.querySelectorAll('.row').length > 10");
```

The key insight: Playwright waits for **actionability** by default. Only add explicit waits for conditions that go beyond element readiness — network state, custom JS state, or animations.

> Hot take: *"Relying on hardcoded timeouts is the easiest way to make a test flaky. Let Playwright handle element actionability auto-waiting, and use explicit condition polling only for network or async state transitions."*

---

## 8. How do you intercept and mock API calls in Playwright Java?

**Answer:**

```java
// Intercept all requests to the analytics service — stub them out
page.route("**/api/v1/analytics/**", route -> {
    route.fulfill(new Route.FulfillOptions()
        .setStatus(200)
        .setContentType("application/json")
        .setBody("{\"status\":\"ok\"}"));
});

// Intercept and inspect request headers (e.g., verify auth token is sent)
page.route("**/api/users/**", route -> {
    Request request = route.request();
    String authHeader = request.headers().get("authorization");
    Assert.assertNotNull(authHeader, "Auth header missing on API call");
    Assert.assertTrue(authHeader.startsWith("Bearer "), "Token format incorrect");
    route.resume();  // let the real request through after inspection
});

// Simulate 500 error for negative testing
page.route("**/api/submit", route ->
    route.fulfill(new Route.FulfillOptions().setStatus(500)));
```

This eliminates dependency on backend state for negative path testing — you control the server response without touching infrastructure.

> Hot take: *"Do not let a slow or unstable downstream environment block your UI tests. Route and fulfill mock payloads directly inside Playwright to test edge cases and error states instantly without touching live servers."*

---

## 9. How do you capture screenshots and Playwright traces on test failure?

**Answer:**

```java
// In Hooks.java — triggered by Cucumber @After
@After
public void teardown(Scenario scenario) {
    if (scenario.isFailed()) {
        // Screenshot — attach to Cucumber / Allure report
        byte[] screenshot = DriverManager.getPage()
            .screenshot(new Page.ScreenshotOptions().setFullPage(true));
        scenario.attach(screenshot, "image/png", "Failure Screenshot");

        // DOM snapshot — useful for diagnosing dynamic content issues
        String html = DriverManager.getPage().content();
        scenario.attach(html.getBytes(), "text/html", "DOM Snapshot");
    }

    // Always stop tracing and save the archive
    DriverManager.getContext().tracing().stop(
        new Tracing.StopOptions()
            .setPath(Paths.get("target/traces/" + scenario.getName() + ".zip"))
    );

    DriverManager.teardown();
}

// Start tracing in @Before
@Before
public void setup(Scenario scenario) {
    DriverManager.initDriver();
    DriverManager.getContext().tracing().start(
        new Tracing.StartOptions()
            .setScreenshots(true)
            .setSnapshots(true)
            .setSources(true)
    );
}
```

Playwright traces include a step-by-step action replay, network log, and console output — far more diagnostic than a screenshot alone.

> Hot take: *"Screenshots show you what went wrong, but traces show you how it happened. Always capture and archive Playwright trace zips in CI to inspect full network, console, and DOM timelines for every failure."*

---

## 10. How do you handle Cucumber Scenario Outline with Examples for data-driven tests?

**Answer:**

```gherkin
Feature: Login Validation

  Scenario Outline: Login with various credential types
    Given User is on the authentication screen
    When  User submits username "<username>" and password "<password>"
    Then  Login result should be "<result>"

    Examples:
      | username        | password    | result    |
      | standard_user   | password123 | success   |
      | locked_out_user | password123 | locked    |
      | invalid_user    | wrongpass   | error     |
```

```java
@Then("Login result should be {string}")
public void verifyLoginResult(String expected) {
    switch (expected) {
        case "success" -> Assert.assertTrue(dashboardPage.isLoaded());
        case "locked"  -> Assert.assertTrue(loginPage.isAccountLockedMessageVisible());
        case "error"   -> Assert.assertTrue(loginPage.isInvalidCredentialErrorVisible());
        default        -> throw new IllegalArgumentException("Unknown result: " + expected);
    }
}
```

Each row in `Examples` becomes a separate Cucumber scenario — visible individually in Allure reports with its own pass/fail status.

> Hot take: *"Use Scenario Outlines for testing functional permutations, not for looping massive datasets. If you find yourself with 50 Examples rows, move the test logic down to the integration or unit level."*

---

## 11. How do you use Cucumber Tags for selective test execution?

**Answer:**

```gherkin
@Auth @Smoke
Scenario: Happy Path Login

@Auth @Regression @Negative
Scenario: Login with locked account
```

**Runner configuration:**

```java
// Run only Smoke tests
@CucumberOptions(tags = "@Smoke")

// Run Auth AND Regression (both tags must be present)
@CucumberOptions(tags = "@Auth and @Regression")

// Run Smoke OR Regression
@CucumberOptions(tags = "@Smoke or @Regression")

// Exclude flaky tests
@CucumberOptions(tags = "not @Flaky")
```

**CI/CD pipeline usage:**

```yaml
# GitLab CI — nightly regression, PR smoke gate
stages:
  - smoke
  - regression

smoke_gate:
  script: mvn test -Dtags="@Smoke" -Denv=staging

nightly_regression:
  script: mvn test -Dtags="@Regression" -Denv=staging
  rules:
    - if: $CI_PIPELINE_SOURCE == "schedule"
```

> Hot take: *"Tags are your pipeline's traffic control. Group your tests by lifecycle phase (like @Smoke and @Regression) so you can run the cheapest checks first and gate releases effectively."*

---

## 12. What is a Cucumber Hook and how do you scope hooks to specific tags?

**Answer:**

```java
// Global hook — runs for EVERY scenario
@Before
public void globalSetup(Scenario scenario) {
    log.info("Starting: {}", scenario.getName());
    DriverManager.initDriver();
}

// Tag-scoped hook — only runs for scenarios tagged @API
@Before("@API")
public void setupApiContext(Scenario scenario) {
    // Seed test data via REST Assured before API scenarios
    apiHelper.seedUser("standard_user", "password123");
}

// Order attribute controls hook sequence (lower = earlier)
@Before(order = 1)
public void initLogging() { /* runs first */ }

@Before(order = 2)
public void initDriver()  { /* runs second */ }

// After hook with order — higher order runs first in teardown
@After(order = 2)
public void captureScreenshot(Scenario scenario) { /* runs before driver close */ }

@After(order = 1)
public void closeDriver() { /* runs last in teardown */ }
```

> Hot take: *"Scoping hooks keeps setups lightweight. Do not run heavy global setups; use tag-scoped hooks (like @Before('@API')) to run data seeding or session injection only when a test actually needs it."*

---

## 13. How does Playwright's `page.evaluate()` work and when do you use it in tests?

**Answer:**
`evaluate()` executes a JavaScript expression in the browser context and returns the result to Java.

```java
// Scroll element into view (when Playwright auto-scroll isn't enough)
page.evaluate("document.querySelector('.lazy-load-section').scrollIntoView()");

// Read a value that isn't exposed via standard locators
String token = (String) page.evaluate(
    "() => localStorage.getItem('auth_token')");

// Trigger a custom app event
page.evaluate("window.dispatchEvent(new CustomEvent('app:ready'))");

// Count elements matching a selector (faster than locator.count() for complex DOM)
int rowCount = ((Number) page.evaluate(
    "document.querySelectorAll('table.data-table tr').length")).intValue();

// Inject a cookie (bypass login UI in hybrid API-seed tests)
page.evaluate("""
    document.cookie = 'session=abc123; path=/; domain=staging.enterprise.com';
""");
```

> Hot take: *"When Playwright's native API isn't enough, page.evaluate() lets you drop down to standard JavaScript. Use it to bypass login UIs by writing cookies or reading local storage directly in the browser's context."*

---

## 14. How do you implement API-seed hybrid testing with Playwright + REST Assured?

**Answer:**
The pattern: use REST Assured to authenticate and seed data via the API, then inject the session into the Playwright browser context, skipping slow UI login.

```java
@Before("@HybridSeed")
public void seedAndInjectSession() {
    // 1. Get auth token via REST Assured (fast API call)
    String token = ApiHelper.fetchAuthToken("standard_user", "password123");

    // 2. Seed required test data
    ApiHelper.createUser(token, "testUser42", "viewer");

    // 3. Inject session cookie directly into BrowserContext
    DriverManager.getContext().addCookies(List.of(
        new Cookie("auth_token", token)
            .setDomain("staging.enterprise.com")
            .setPath("/")
    ));

    // 4. Navigate directly to the target page — login UI bypassed
    DriverManager.getPage().navigate("https://staging.enterprise.com/dashboard");
}
```

This accelerates UI tests by up to 300% (our production suite metric) by eliminating the slow authentication flow from every test setup.

> Hot take: *"Bypassing the login page in UI tests is the single highest-leverage speed optimization you can make. Seed data and grab authentication cookies via API, then inject them directly into your browser context."*

---

## 15. How do you configure Allure reporting with Cucumber 7 and what do you attach for maximum diagnostic value?

**Answer:**

```xml
<!-- pom.xml dependencies -->
<dependency>
    <groupId>io.qameta.allure</groupId>
    <artifactId>allure-cucumber7-jvm</artifactId>
    <version>2.24.0</version>
</dependency>
```

```java
// CucumberOptions
@CucumberOptions(
    plugin = {"io.qameta.allure.cucumber7jvm.AllureCucumber7Jvm"}
)

// Enrich Allure report programmatically
@After
public void teardown(Scenario scenario) {
    if (scenario.isFailed()) {
        // Screenshot
        Allure.addAttachment("Screenshot",
            new ByteArrayInputStream(DriverManager.getPage()
                .screenshot(new Page.ScreenshotOptions().setFullPage(true))));

        // Playwright trace zip
        Path tracePath = Paths.get("target/traces/" + scenario.getName() + ".zip");
        DriverManager.getContext().tracing().stop(
            new Tracing.StopOptions().setPath(tracePath));
        Allure.addAttachment("Playwright Trace",
            new FileInputStream(tracePath.toFile()));

        // Browser console logs
        List<String> consoleLogs = pageConsoleLogs.get();
        Allure.addAttachment("Console Log",
            String.join("\n", consoleLogs));
    }
    DriverManager.teardown();
}
```

A well-enriched Allure report should tell the developer: what failed, what the page looked like at failure, what API calls were in-flight, and what JavaScript errors appeared in the console — all without needing to reproduce the scenario locally.

> Hot take: *"A test report is only useful if it prevents the need for manual reproduction. Attach HTML DOM snapshots, screenshots, console logs, and traces to ensure the developer has all diagnostics in one place."*
