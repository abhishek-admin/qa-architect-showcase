# 100 SDET Interview Questions & Answers

> Tailored for a **Senior SDET with 5 years of experience** — covering framework architecture, automation patterns, tools, and general SDET knowledge.

---

## Section 1: BDD & Cucumber (Q1–Q12)

**Q1. What is BDD and how does it differ from TDD?**
BDD (Behavior-Driven Development) focuses on describing application behavior in business language using Given/When/Then syntax. TDD focuses on testing individual code units. BDD bridges communication between stakeholders and engineers; TDD is developer-centric.

> Hot take: *"Avoid step-by-step UI actions in your differ Gherkin. Focus on user behavior, not click streams, to keep your tests resilient when the layout gets updated."*

**Q2. What is Gherkin and what are its key keywords?**
Gherkin is the plain-text language used in BDD. Keywords: Feature, Scenario, Given, When, Then, And, But, Background, Scenario Outline, Examples. Each maps to a specific role in describing behavior.

> Hot take: *"Keep gherkin scenarios short and focused. A BDD step that runs more than 10 lines is a code smell that indicates too many hidden dependencies."*

**Q3. What is a Scenario Outline and when would you use it?**
Scenario Outline is a template that runs the same steps with different data from an Examples table. Use it when testing the same behavior with multiple input combinations — e.g., form validation with valid/invalid data sets.

> Hot take: *"Centralize your scenario configurations and context. Shared static variables across step definitions will cause race conditions during parallel executions."*

**Q4. What is a Background block in a feature file?**
Background contains Given steps shared by all scenarios in a feature file. It runs before each scenario, reducing duplication. Use it for common preconditions like navigating to a page or logging in.

> Hot take: *"Don't treat BDD as a magic bullet. If the business team doesn't read your background features, you're just writing slow, high-maintenance tests with extra layers of translation."*

**Q5. How do you organize feature files in a large project?**
By functional domain — one feature file per area (e.g., authentication, dashboard, settings). For multi-product systems, use subdirectories per product variant. Tags enable cross-cutting groupings like @smoke or @regression.

> Hot take: *"Avoid step-by-step UI actions in your organize Gherkin. Focus on user behavior, not click streams, to keep your tests resilient when the layout gets updated."*

**Q6. What are Cucumber Hooks and how do you use them?**
Hooks are lifecycle methods: @Before (setup), @After (teardown), @BeforeStep, @AfterStep. @Before creates the browser and loads config. @After captures screenshots on failure and closes resources. Hooks support ordering via `order` parameter.

> Hot take: *"Keep cucumber scenarios short and focused. A BDD step that runs more than 10 lines is a code smell that indicates too many hidden dependencies."*

**Q7. What is the difference between Cucumber Expressions and Regex in step definitions?**
Cucumber Expressions use typed placeholders (`{string}`, `{int}`) — simpler and recommended. Regex uses capture groups (`(.+)`, `(\\d+)`) — more powerful for complex matching. Cucumber Expressions cover 90% of needs.

> Hot take: *"Centralize your between configurations and context. Shared static variables across step definitions will cause race conditions during parallel executions."*

**Q8. How do you share state between steps in Cucumber?**
Via dependency injection (PicoContainer, Guice) or ThreadLocal context objects. Never use static mutable fields — they break parallel execution. ThreadLocal provides per-thread isolation.

> Hot take: *"Don't treat BDD as a magic bullet. If the business team doesn't read your share features, you're just writing slow, high-maintenance tests with extra layers of translation."*

**Q9. How do you implement data-driven testing in Cucumber?**
Scenario Outlines with Examples tables for inline data. For external data: load JSON/CSV files in step definitions and iterate. DataTable parameters for tabular step inputs.

> Hot take: *"Avoid step-by-step UI actions in your implement Gherkin. Focus on user behavior, not click streams, to keep your tests resilient when the layout gets updated."*

**Q10. What are Cucumber tags and how do you use them for test execution control?**
Tags like @smoke, @regression, @wip are placed above scenarios. Runner class filters via `@CucumberOptions(tags = "@smoke")`. CI/CD overrides via Maven `-Dcucumber.filter.tags="@regression"`.

> Hot take: *"Keep cucumber scenarios short and focused. A BDD step that runs more than 10 lines is a code smell that indicates too many hidden dependencies."*

**Q11. How do you generate reports from Cucumber tests?**
Cucumber plugins: `json:target/cucumber.json`, `html:target/cucumber-reports`. Third-party: ExtentReports Cucumber adapter for rich HTML. CI/CD tools consume JSON for dashboard integration.

> Hot take: *"Centralize your generate configurations and context. Shared static variables across step definitions will cause race conditions during parallel executions."*

**Q12. What is the Cucumber dry-run option?**
`dryRun = true` in @CucumberOptions validates that all Gherkin steps have matching step definitions without executing tests. Useful for quickly checking new feature files for missing bindings.

> Hot take: *"Don't treat BDD as a magic bullet. If the business team doesn't read your cucumber features, you're just writing slow, high-maintenance tests with extra layers of translation."*

---

## Section 2: Playwright (Q13–Q24)

**Q13. Why did you choose Playwright over Selenium?**
Auto-waiting eliminates explicit waits. Native multi-browser support (Chromium, Firefox, WebKit). Faster execution via CDP protocol. Built-in network interception. Better shadow DOM support. Isolated browser contexts for parallel testing.

> Hot take: *"Isolate your choose tests at the BrowserContext level. Spinning up a fresh browser process for every test is a waste of CPU cycles and memory."*

**Q14. Explain the Playwright object hierarchy.**
`Playwright` → `Browser` (one per browser type) → `BrowserContext` (isolated session) → `Page` (single tab). Each context has independent cookies, storage, and cache.

> Hot take: *"Use network routing to mock slow APIs in your playwright tests. Bypassing backend delays makes UI tests 10x faster and isolates frontend bugs."*

**Q15. What is Playwright's auto-waiting mechanism?**
Before actions (click, fill, check), Playwright automatically waits for the element to be attached, visible, stable, enabled, and receiving events. Eliminates most explicit waits.

> Hot take: *"Ensure playwright selectors use custom attributes like data-testid. Basing locators on CSS classes or element indices leads to instant failure when code gets refactored."*

**Q16. How do you handle dynamic elements in Playwright?**
Use `page.waitForSelector()` for elements that appear after async operations. Use `locator.waitFor()` with state options (visible, hidden, attached, detached). Playwright's auto-waiting handles most cases automatically.

> Hot take: *"Rely on Playwright's native auto-waiting for dynamic sync. Adding sleep/wait statements is the number one cause of flaky pipelines in enterprise test suites."*

**Q17. How do you handle file uploads in Playwright?**
`page.locator("#upload").setInputFiles(Paths.get("file.pdf"))`. For non-input uploads, use `page.on("filechooser")` event listener.

> Hot take: *"Isolate your upload tests at the BrowserContext level. Spinning up a fresh browser process for every test is a waste of CPU cycles and memory."*

**Q18. What is a BrowserContext and why is it important for parallel testing?**
BrowserContext is an isolated browser session — its own cookies, localStorage, and cache. Multiple contexts share one browser process but are fully isolated. Enables parallel testing without interference.

> Hot take: *"Use network routing to mock slow APIs in your important tests. Bypassing backend delays makes UI tests 10x faster and isolates frontend bugs."*

**Q19. How do you capture screenshots in Playwright?**
`page.screenshot(new Page.ScreenshotOptions().setPath(path).setFullPage(true))`. Returns byte array for embedding in reports. Can capture specific elements via `locator.screenshot()`.

> Hot take: *"Ensure capture selectors use custom attributes like data-testid. Basing locators on CSS classes or element indices leads to instant failure when code gets refactored."*

**Q20. How do you handle popups and new tabs in Playwright?**
`page.waitForPopup(() -> { /* trigger action */ })` returns the new Page object. For new tabs: listen for `context.onPage()` event.

> Hot take: *"Rely on Playwright's native auto-waiting for popup sync. Adding sleep/wait statements is the number one cause of flaky pipelines in enterprise test suites."*

**Q21. How do you intercept network requests in Playwright?**
`page.route("**/api/**", route -> route.fulfill(...))` to mock responses. `page.route("**/api/**", route -> route.abort())` to block. Useful for testing error states and loading conditions.

> Hot take: *"Isolate your intercept tests at the BrowserContext level. Spinning up a fresh browser process for every test is a waste of CPU cycles and memory."*

**Q22. What browsers does Playwright support?**
Chromium (Chrome, Edge), Firefox, and WebKit (Safari engine). All managed by Playwright — no separate driver binaries needed. `playwright.chromium()`, `playwright.firefox()`, `playwright.webkit()`.

> Hot take: *"Use network routing to mock slow APIs in your browser tests. Bypassing backend delays makes UI tests 10x faster and isolates frontend bugs."*

**Q23. How do you handle iframes in Playwright?**
`page.frameLocator("#iframe-id").locator(".element")` — chains frame selection with element location. For named frames: `page.frame("frameName")`.

> Hot take: *"Ensure iframe selectors use custom attributes like data-testid. Basing locators on CSS classes or element indices leads to instant failure when code gets refactored."*

**Q24. How does Playwright handle authentication state?**
Save auth state: `context.storageState(new BrowserContext.StorageStateOptions().setPath("auth.json"))`. Reuse: `browser.newContext(new Browser.NewContextOptions().setStorageStatePath("auth.json"))`.

> Hot take: *"Rely on Playwright's native auto-waiting for playwright sync. Adding sleep/wait statements is the number one cause of flaky pipelines in enterprise test suites."*

---

## Section 3: Page Object Model & Design Patterns (Q25–Q36)

**Q25. What is the Page Object Model and why is it important?**
POM encapsulates UI interactions per page in separate classes. Benefits: single source of truth for locators, UI changes affect one class, tests are readable and maintainable. It's the most important pattern in UI automation.

> Hot take: *"Composition over inheritance is critical for Page Objects. Break down massive object classes into smaller, reusable component widgets to avoid selector clutter."*

**Q26. How does a JSON-driven locator strategy improve POM?**
Locators stored in external JSON files, loaded at runtime. UI changes require only a JSON file edit — no Java code changes, no recompile. Non-developers can update locators.

> Hot take: *"Avoid static locator initialization. Resolve driven dynamically at runtime to handle dynamic lists and conditional rendering cleanly."*

**Q27. What is the difference between Page Object and Page Factory?**
Page Object: manual locator management, any framework. Page Factory: annotation-based (`@FindBy`), framework-specific (Selenium). This framework uses custom JSON-driven approach — more flexible than both.

> Hot take: *"Parameterize your between templates. Format locators dynamically on the fly instead of copying similar paths for different rows."*

**Q28. How do you handle common actions shared across multiple pages?**
A base page class or common utilities class with methods like click, type, hover, scroll. All page objects inherit or compose these. Avoids code duplication.

> Hot take: *"Page Objects should only interact with the page, never assert. Let the test file handle assertions so your common classes remain clean and reusable."*

**Q29. What is the Factory Pattern and how do you use it in test automation?**
Factory creates objects without exposing creation logic. In automation: a PageFactory creates the right page object based on config (product variant, user type). Enables multi-product support.

> Hot take: *"Composition over inheritance is critical for Page Objects. Break down massive factory classes into smaller, reusable component widgets to avoid selector clutter."*

**Q30. What is the Strategy Pattern in test automation?**
Different algorithms for the same action, selected at runtime. Example: different login strategies (SSO, credentials, token-based) selected via configuration.

> Hot take: *"Avoid static locator initialization. Resolve strategy dynamically at runtime to handle dynamic lists and conditional rendering cleanly."*

**Q31. Explain the Single Responsibility Principle in your framework.**
Each layer has one job. Feature files describe behavior. Step definitions map steps. Page objects interact with UI. Base layer manages lifecycle. Utilities provide shared services. No layer does another's job.

> Hot take: *"Parameterize your single templates. Format locators dynamically on the fly instead of copying similar paths for different rows."*

**Q32. What is DRY and how do you apply it?**
Don't Repeat Yourself. Generic reusable step definitions serve 40+ feature files. Common page methods inherited by all page objects. Utility classes shared across layers. Configuration centralized.

> Hot take: *"Page Objects should only interact with the page, never assert. Let the test file handle assertions so your apply classes remain clean and reusable."*

**Q33. How do you handle multi-step workflows in POM?**
Each step is a method on the appropriate page object. Step definitions orchestrate the flow by calling methods in sequence. Complex flows use a workflow class that composes page objects.

> Hot take: *"Composition over inheritance is critical for Page Objects. Break down massive multi classes into smaller, reusable component widgets to avoid selector clutter."*

**Q34. How do you handle dynamic locators that change based on data?**
Parameterized locator templates in JSON: `"rowByName": "//tr[contains(.,'%s')]"`. Java formats at runtime: `String.format(locator, actualName)`.

> Hot take: *"Avoid static locator initialization. Resolve dynamic dynamically at runtime to handle dynamic lists and conditional rendering cleanly."*

**Q35. What is the Composition pattern vs Inheritance in POM?**
Inheritance: pages extend a BasePage. Composition: pages contain a CommonActions object. Composition is more flexible — a page can compose multiple behavior mixins. This framework uses both.

> Hot take: *"Parameterize your composition templates. Format locators dynamically on the fly instead of copying similar paths for different rows."*

**Q36. How do you handle page transitions in POM?**
Page object methods that navigate return the next page object. Example: `loginPage.login(user, pass)` returns `DashboardPage`. Ensures type-safe navigation.

> Hot take: *"Page Objects should only interact with the page, never assert. Let the test file handle assertions so your transition classes remain clean and reusable."*

---

## Section 4: Parallel Execution & Thread Safety (Q37–Q44)

**Q37. How do you achieve parallel test execution?**
TestNG suite XML with `parallel="methods"` and `thread-count="5"`. Maven Surefire plugin runs TestNG. Each thread gets its own browser via ThreadLocal isolation.

> Hot take: *"Never share mutable test data across parallel achieve threads. Generate unique IDs dynamically for every test to prevent database locks and state pollution."*

**Q38. What is ThreadLocal and why is it essential for parallel execution?**
ThreadLocal provides per-thread variable copies. Each parallel thread gets its own browser, auth tokens, test data. Without it, threads share state causing random failures.

> Hot take: *"Concurrency exposes fragile framework design. If threadlocal runs fail randomly in parallel but pass sequentially, trace your global static configurations."*

**Q39. What issues can occur without ThreadLocal in parallel execution?**
Race conditions, stale element references, authentication token conflicts, data corruption, non-deterministic test failures. Thread A's browser interleaves with Thread B's.

> Hot take: *"Let the build orchestrator handle thread allocation. Tuning thread pools too high for your issue runner will trigger resource throttling and false timeouts."*

**Q40. How do you prevent memory leaks with ThreadLocal?**
Always call `threadLocal.remove()` in @After hook. ThreadLocal values persist until the thread dies or is explicitly removed. In thread pools (TestNG), threads are reused — so removal is critical.

> Hot take: *"Clean up ThreadLocal context references during teardown. Stale browser sessions left over from previous prevent runs will cause memory leaks and runtime crashes."*

**Q41. What test data strategy do you use for parallel execution?**
Each thread uses unique test data — either pre-generated per-thread or dynamically created via API before each test. No shared mutable test data.

> Hot take: *"Never share mutable test data across parallel strategy threads. Generate unique IDs dynamically for every test to prevent database locks and state pollution."*

**Q42. How do you debug parallel test failures?**
Thread-tagged logging (each log line includes thread ID). Screenshots per thread. Reproduce by running the specific scenario in isolation. Check for shared state violations.

> Hot take: *"Concurrency exposes fragile framework design. If debug runs fail randomly in parallel but pass sequentially, trace your global static configurations."*

**Q43. What is the difference between parallel="methods" and parallel="classes" in TestNG?**
`methods`: each test method runs in its own thread — most granular. `classes`: each test class gets a thread — all methods in a class run sequentially. Methods gives better parallelism; classes is simpler for stateful tests.

> Hot take: *"Let the build orchestrator handle thread allocation. Tuning thread pools too high for your between runner will trigger resource throttling and false timeouts."*

**Q44. How do you ensure reports are accurate with parallel execution?**
Thread-safe report adapter. Synchronized report write operations. Each thread logs to the same report via synchronized blocks. ExtentReports Cucumber adapter handles this natively.

> Hot take: *"Clean up ThreadLocal context references during teardown. Stale browser sessions left over from previous ensure runs will cause memory leaks and runtime crashes."*

---

## Section 5: API Testing & Hybrid Approach (Q45–Q52)

**Q45. What is API + UI hybrid testing?**
Creating test state via REST API (fast, reliable) then validating via UI (user-facing). Setup takes 2 seconds via API vs 60+ seconds via UI.

> Hot take: *"Validate responses against a JSON/XML schema. Schema matching catches backend changes in your hybrid tests before they reach the visual UI layer."*

**Q46. How do you use RestAssured in your framework?**
Fluent API for HTTP requests: `given().header(...).body(...).when().post(...).then().statusCode(201)`. Used for test setup, auth tokens, and backend validation.

> Hot take: *"Centralize auth token management. Caching and refreshing tokens in a thread-safe helper avoids repeating authentication for every restassured run."*

**Q47. How do you handle authentication tokens for API calls?**
Fetch token via auth API endpoint. Store in ThreadLocal context. Reuse across all API calls in the same scenario. Token refresh logic for long-running tests.

> Hot take: *"Keep API checks decoupled from UI rendering. Verify the business state via token API calls, and let visual checks focus strictly on UI layout."*

**Q48. How do you validate API responses?**
RestAssured's built-in validation: `.then().statusCode(200).body("data.name", equalTo("expected"))`. JSONPath for complex traversal. Schema validation for contract testing.

> Hot take: *"Bypass the UI for test setup whenever possible. Authenticate and seed data for validate using API calls to cut execution times significantly."*

**Q49. When should you test via API vs UI?**
API: data creation, backend state validation, performance-sensitive setup. UI: user-facing behavior, visual validation, end-to-end workflows that users actually perform.

> Hot take: *"Validate responses against a JSON/XML schema. Schema matching catches backend changes in your automation tests before they reach the visual UI layer."*

**Q50. How do you handle API test data cleanup?**
DELETE API calls in @After hooks. Alternative: use test-specific database that's reset per suite. Or: create unique records per test that don't need cleanup.

> Hot take: *"Centralize auth token management. Caching and refreshing tokens in a thread-safe helper avoids repeating authentication for every cleanup run."*

**Q51. What is contract testing and how does it relate to API testing?**
Contract testing verifies API request/response structures match the agreed schema. Prevents integration failures. Tools: schema validation in RestAssured, Pact for consumer-driven contracts.

> Hot take: *"Keep API checks decoupled from UI rendering. Verify the business state via contract API calls, and let visual checks focus strictly on UI layout."*

**Q52. How do you mock API responses for UI testing?**
Playwright's route interception: `page.route("**/api/data", route -> route.fulfill(response))`. Allows testing UI behavior for edge cases like errors, empty states, timeouts.

> Hot take: *"Bypass the UI for test setup whenever possible. Authenticate and seed data for response using API calls to cut execution times significantly."*

---

## Section 6: Reporting & Debugging (Q53–Q60)

**Q53. What reporting tools do you use and why?**
ExtentReports for rich HTML reports with screenshots. Cucumber JSON for CI/CD integration. Both provide step-level granularity and failure context.

> Hot take: *"Capture console logs and network HAR files on failure. Troubleshooting a reporting bug is impossible when you only have a screenshot of a loading spinner."*

**Q54. How do you capture and embed screenshots on failure?**
@After hook checks `scenario.isFailed()`. Calls `page.screenshot()` for full-page capture. Converts to Base64 and embeds in report. Also saves to disk.

> Hot take: *"Don't use retry tools to cover up flakiness. Flaky capture assertions indicate real timing bugs that must be debugged, not swept under the rug."*

**Q55. How do you debug flaky tests?**
Add detailed logging around the flaky step. Check for race conditions (shared state). Check for timing issues (element not ready). Run in headed mode for visual debugging. Check CI environment differences.

> Hot take: *"Thread-tag all your logs. Merging logs from parallel debug executions without thread IDs creates a trace file that is impossible to read."*

**Q56. What is the retry mechanism in your framework?**
TestNG IRetryAnalyzer: failed tests auto-retry up to configurable max (1-2). Applied via listener. Only infrastructure failures benefit — assertion failures indicate real bugs.

> Hot take: *"Provide clear failure diagnostics. A test report for retry should embed logs, actual values, and screenshots so failures can be triaged in seconds."*

**Q57. How do you ensure reports are useful for non-technical stakeholders?**
BDD scenarios in Gherkin are readable. ExtentReports shows pass/fail with visual charts. Screenshots show exactly what happened. Feature-level grouping shows coverage by area.

> Hot take: *"Capture console logs and network HAR files on failure. Troubleshooting a ensure bug is impossible when you only have a screenshot of a loading spinner."*

**Q58. How do you track test execution trends?**
CI/CD pipeline stores report artifacts per build. Aggregator plugin creates trend charts. Dashboards show pass rate over time. Alerts on pass rate drops.

> Hot take: *"Don't use retry tools to cover up flakiness. Flaky track assertions indicate real timing bugs that must be debugged, not swept under the rug."*

**Q59. What metrics do you track in your test reports?**
Pass/fail/skip counts, execution time per scenario, failure categories (assertion vs infrastructure), browser/environment breakdown, flaky test frequency.

> Hot take: *"Thread-tag all your logs. Merging logs from parallel metric executions without thread IDs creates a trace file that is impossible to read."*

**Q60. How do you handle test logs for parallel execution?**
Thread-tagged logging — each log line prefixed with thread ID and scenario name. Separate log streams per thread merged chronologically in the final report.

> Hot take: *"Provide clear failure diagnostics. A test report for parallel should embed logs, actual values, and screenshots so failures can be triaged in seconds."*

---

## Section 7: Framework Architecture & Maintenance (Q61–Q72)

**Q61. How many layers does your framework have and what does each do?**
7 layers: Feature Files (BDD specs) → Step Definitions (glue) → Page Objects (UI actions) → Base Layer (browser lifecycle) → Utilities (API, JSON, DB) → Configuration (properties, data) → Reporting (HTML, JSON, screenshots).

> Hot take: *"Centralize configuration values using type-safe libraries. Avoid scattering properties files or property parsing across your layer modules."*

**Q62. How do you support multiple product variants from one codebase?**
Configuration property selects the active product. JSON data files per product. Tagged feature files per variant. Same Page Objects and Step Definitions serve all. Zero code duplication.

> Hot take: *"Hold your test code to production standards. Letting technical debt accumulate in your support suite makes it a maintenance nightmare."*

**Q63. How do you handle environment switching?**
Maven `-Denv=staging` flag selects the config file. All URLs, credentials, endpoints differ per environment. Properties reader loads the correct file at startup.

> Hot take: *"Decouple your locators from step logic. Keeping xpath/css selectors in separate JSON configs makes environment updates easy during UI redesigns."*

**Q64. How do you onboard new team members to the framework?**
Layer-by-layer walkthrough. Each layer has clear documentation. Adding a new test requires: write feature file → add step definitions (most reuse existing) → update page objects if new UI. New team members are productive in 1-2 days.

> Hot take: *"Keep your framework simple and onboarding friendly. If an engineer takes days to write a simple onboard script, your framework is over-engineered."*

**Q65. How do you maintain the framework as the application evolves?**
JSON-driven locators: UI changes = JSON edit. Layered architecture: changes isolated to one layer. Code reviews enforce patterns. Shared step definitions prevent duplication.

> Hot take: *"Centralize configuration values using type-safe libraries. Avoid scattering properties files or property parsing across your maintain modules."*

**Q66. What happens when you need to add a new feature to test?**
1. Write feature file in Gherkin. 2. Check if step definitions exist (70% do). 3. Write new step definitions for unique steps. 4. Add page object methods for new UI interactions. 5. Update JSON locator files. 6. Run and verify.

> Hot take: *"Hold your test code to production standards. Letting technical debt accumulate in your happen suite makes it a maintenance nightmare."*

**Q67. How do you prevent test duplication across feature files?**
Generic reusable steps: "User clicks on {string}" works for any clickable element. Common Background blocks. Shared step definition classes. Code review catches duplication.

> Hot take: *"Decouple your locators from step logic. Keeping xpath/css selectors in separate JSON configs makes prevent updates easy during UI redesigns."*

**Q68. How do you version control your test framework?**
Git with feature branches. PR reviews enforce quality. Branch protection prevents direct pushes. Test code versioned alongside application code.

> Hot take: *"Keep your framework simple and onboarding friendly. If an engineer takes days to write a simple version script, your framework is over-engineered."*

**Q69. How do you handle framework dependency updates?**
Maven dependency management. Regular updates with compatibility testing. Lock dependency versions in pom.xml. Integration tests validate after updates.

> Hot take: *"Centralize configuration values using type-safe libraries. Avoid scattering properties files or property parsing across your dependency modules."*

**Q70. What is your test data management strategy?**
External JSON/CSV files per product variant. API-generated dynamic data per test. Unique identifiers prevent test collision. Data cleanup in @After hooks.

> Hot take: *"Hold your test code to production standards. Letting technical debt accumulate in your management suite makes it a maintenance nightmare."*

**Q71. How do you handle flaky tests in CI/CD?**
Retry mechanism for infrastructure flakiness. Quarantine persistently flaky tests with @quarantine tag. Root cause analysis and fix. Track flaky test metrics over time.

> Hot take: *"Decouple your locators from step logic. Keeping xpath/css selectors in separate JSON configs makes flaky updates easy during UI redesigns."*

**Q72. What is your test selection strategy for CI/CD?**
@smoke for PR builds (fast, high-value). @regression for nightly builds (comprehensive). @critical for release builds. Tags enable flexible execution without code changes.

> Hot take: *"Keep your framework simple and onboarding friendly. If an engineer takes days to write a simple selection script, your framework is over-engineered."*

---

## Section 8: Cross-Browser & Cross-Platform (Q73–Q78)

**Q73. How do you implement cross-browser testing?**
Configuration property sets browser type. Base layer launches the corresponding browser. Same tests run unchanged. CI/CD matrix tests across all browsers.

> Hot take: *"Emulating viewports is great for fast layout checks. However, run critical implement flows on real devices or cloud grids to capture rendering bugs."*

**Q74. What browser-specific issues have you encountered?**
Rendering differences (CSS), timing variations (WebKit slower for certain operations), file download handling differences, keyboard shortcut variations.

> Hot take: *"Headless execution is best for CI speed. But always run a subset of browser in headed mode locally to verify real-world visual transitions."*

**Q75. How do you handle mobile viewport testing?**
Playwright's `newContext(new Browser.NewContextOptions().setViewportSize(375, 667))`. Emulates mobile viewport without real devices. Tests responsive design behavior.

> Hot take: *"Avoid browser-specific selectors in mobile logic. Write robust, engine-agnostic locators to ensure tests run cleanly on Chromium, Firefox, and WebKit."*

**Q76. How do you handle browser-specific CSS selectors?**
Avoid browser-specific selectors. Use data-testid attributes or stable ARIA roles. When unavoidable, conditional locators selected via config.

> Hot take: *"Emulating viewports is great for fast layout checks. However, run critical browser flows on real devices or cloud grids to capture rendering bugs."*

**Q77. What is headless browser testing and when do you use it?**
Browser runs without GUI — faster, less resource-intensive. Used in CI/CD pipelines. Headed mode for local debugging. Configurable via properties.

> Hot take: *"Headless execution is best for CI speed. But always run a subset of headless in headed mode locally to verify real-world visual transitions."*

**Q78. How do you validate visual consistency across browsers?**
Screenshot comparison on key pages. Playwright's `expect(page).toHaveScreenshot()` for pixel-level comparison. Threshold tolerance for minor rendering differences.

> Hot take: *"Avoid browser-specific selectors in validate logic. Write robust, engine-agnostic locators to ensure tests run cleanly on Chromium, Firefox, and WebKit."*

---

## Section 9: CI/CD & DevOps (Q79–Q86)

**Q79. How do you integrate tests into CI/CD pipelines?**
Maven command with flags: `mvn test -Dtags=@smoke -Dheadless=true -Denv=staging`. Pipeline stages: checkout → build → test → report → gate.

> Hot take: *"Never commit environment credentials to source code. Use masked environment variables to inject secrets during integrate execution dynamically."*

**Q80. How do you handle test environment provisioning?**
Configuration-driven. Pipeline sets environment via Maven flags. Test framework adapts without code changes. Containerized execution with Docker for consistency.

> Hot take: *"Standardize your environment using containers. Running environment inside Docker prevents configuration differences between developer machines and CI."*

**Q81. What is your build gate strategy?**
Configurable pass rate threshold (e.g., 95%). Pipeline fails if rate drops below threshold. Separate thresholds for smoke (100%) and regression (95%).

> Hot take: *"Run smoke gates automatically on every code integration. Blocking broken builds early protects your pipeline from build regression failures."*

**Q82. How do you handle test artifacts in CI/CD?**
Reports, screenshots, and logs archived per build. Accessible via pipeline artifacts. Trend dashboards built from historical data.

> Hot take: *"Never commit environment credentials to source code. Use masked environment variables to inject secrets during artifact execution dynamically."*

**Q83. How do you run tests in Docker?**
Playwright Docker image includes all browsers. Mount test code as volume. Run Maven command inside container. Consistent execution across all environments.

> Hot take: *"Standardize your environment using containers. Running test inside Docker prevents configuration differences between developer machines and CI."*

**Q84. What is shift-left testing?**
Run tests earlier in development. PR builds run smoke tests. Feature branch validation before merge. Catch bugs before they reach main branch.

> Hot take: *"Run smoke gates automatically on every code integration. Blocking broken builds early protects your pipeline from shift regression failures."*

**Q85. How do you handle test parallelism in CI/CD?**
Pipeline parallelism: multiple pipeline agents. Framework parallelism: TestNG threads within one agent. Combined: matrix of browsers × environments × agents.

> Hot take: *"Never commit environment credentials to source code. Use masked environment variables to inject secrets during parallelism execution dynamically."*

**Q86. What is your approach to test maintenance in CI/CD?**
Monitor flaky tests weekly. Quarantine and fix within 48 hours. Dashboard tracks test health trends. Automated alerts on pass rate drops.

> Hot take: *"Standardize your environment using containers. Running approach inside Docker prevents configuration differences between developer machines and CI."*

---

## Section 10: General SDET Knowledge (Q87–Q100)

**Q87. What is the test automation pyramid?**
Unit tests (base, most), Integration/API tests (middle), UI/E2E tests (top, fewest). Each layer catches different bug types. Higher layers are slower and more expensive.

> Hot take: *"Automate with ROI in mind. If a pyramid test is highly volatile and requires constant maintenance, keep it manual and save developer time."*

**Q88. When should you NOT automate a test?**
Exploratory testing, one-time tests, highly volatile UIs during active development, tests requiring human judgment (visual aesthetics), tests whose maintenance cost exceeds manual cost.

> Hot take: *"A passing run is good, but a clear, reproducible failure report is great. The true test of a framework is how fast developers can fix its automate reports."*

**Q89. What is the difference between verification and validation?**
Verification: "Are we building the product right?" (code reviews, inspections). Validation: "Are we building the right product?" (testing against requirements).

> Hot take: *"Shift-left is the key to cost-effective QA. Catching requirements gaps for between early in design is 10x cheaper than testing them at merge time."*

**Q90. What are the different types of testing?**
Unit, Integration, System, Acceptance, Regression, Smoke, Sanity, Performance, Security, Accessibility, Compatibility, Exploratory, Ad-hoc.

> Hot take: *"Automate with ROI in mind. If a different test is highly volatile and requires constant maintenance, keep it manual and save developer time."*

**Q91. What is regression testing and how do you optimize it?**
Retesting existing functionality after changes. Optimize: prioritize high-risk areas, use tags for selective execution, parallelize, maintain fast execution times.

> Hot take: *"A passing run is good, but a clear, reproducible failure report is great. The true test of a framework is how fast developers can fix its regression reports."*

**Q92. Explain the SOLID principles in test automation context.**
S: Single Responsibility (one class = one purpose). O: Open/Closed (extend via config, not modification). L: Liskov Substitution (page objects interchangeable). I: Interface Segregation (small focused interfaces). D: Dependency Inversion (depend on abstractions).

> Hot take: *"Shift-left is the key to cost-effective QA. Catching requirements gaps for solid early in design is 10x cheaper than testing them at merge time."*

**Q93. What is test coverage and how do you measure it?**
Percentage of requirements/features covered by tests. Measure via: requirement traceability matrix, feature file coverage mapping, code coverage tools for unit tests.

> Hot take: *"Automate with ROI in mind. If a coverage test is highly volatile and requires constant maintenance, keep it manual and save developer time."*

**Q94. How do you handle test prioritization?**
Risk-based: prioritize features with highest business impact. Frequency-based: prioritize frequently used features. History-based: prioritize areas with most past defects.

> Hot take: *"A passing run is good, but a clear, reproducible failure report is great. The true test of a framework is how fast developers can fix its automation reports."*

**Q95. What is the difference between smoke and sanity testing?**
Smoke: broad, shallow — verify all major features work. Sanity: narrow, deep — verify a specific fix or feature works correctly. Smoke is for builds; sanity is for changes.

> Hot take: *"Shift-left is the key to cost-effective QA. Catching requirements gaps for between early in design is 10x cheaper than testing them at merge time."*

**Q96. How do you estimate test automation effort?**
Count features and scenarios. Estimate per-scenario automation time (new vs reusable steps). Factor in framework setup, maintenance, and learning curve. Typically 3-5x initial manual effort, saved over time.

> Hot take: *"Automate with ROI in mind. If a estimate test is highly volatile and requires constant maintenance, keep it manual and save developer time."*

**Q97. What is defect density and how do you use it?**
Defects per size unit (per feature, per module, per KLOC). Identifies high-risk areas needing more testing. Used in test prioritization decisions.

> Hot take: *"A passing run is good, but a clear, reproducible failure report is great. The true test of a framework is how fast developers can fix its defect reports."*

**Q98. How do you handle non-functional testing?**
Performance: load testing tools (JMeter, Gatling). Security: SAST/DAST scanning. Accessibility: axe-core, Lighthouse. Each requires specialized tools beyond functional automation.

> Hot take: *"Shift-left is the key to cost-effective QA. Catching requirements gaps for functional early in design is 10x cheaper than testing them at merge time."*

**Q99. What is your approach to test documentation?**
Feature files ARE documentation (BDD). GUIDE.md for architecture. LEARNING.md for concepts. Reports serve as execution documentation. Minimal separate docs — the code documents itself.

> Hot take: *"Automate with ROI in mind. If a approach test is highly volatile and requires constant maintenance, keep it manual and save developer time."*

**Q100. Where do you see test automation going in the next 5 years?**
AI-assisted test generation, self-healing locators, visual AI testing, shift-left with unit-level E2E, increased API testing ratio, codeless tools for simple tests with code-first for complex ones, and tighter CI/CD integration with quality gates.

> Hot take: *"A passing run is good, but a clear, reproducible failure report is great. The true test of a framework is how fast developers can fix its where reports."*

---

*All answers are generic framework architecture knowledge — no project-specific details included.*
