/* ═══════════════════════════════════════════════════════════
   WHAT IS — Interview Q&A Bank   (whatis.js)
═══════════════════════════════════════════════════════════ */
const WI_CHAPTERS = [
  {
    id: 'bdd',
    title: '🥒 BDD & Cucumber',
    sections: [
      {
        title: '📖 Core BDD Concepts',
        qs: [
          { q: 'What is BDD (Behavior-Driven Development)?', a: '<span class="wi-ans-key">BDD is a development methodology where tests are written in plain English from the user\'s perspective</span> using a Given/When/Then syntax. It bridges the communication gap between business stakeholders, QA, and developers by making test scenarios readable by everyone on the team.<span class="wi-ans-tip">Lead with: "BDD is about collaboration, not just automation — the Gherkin scenarios are living documentation that the business can validate."</span>' },
          { q: 'How does BDD differ from TDD?', a: '<span class="wi-ans-key">TDD focuses on testing individual code units from a developer\'s perspective; BDD focuses on user behavior from a stakeholder\'s perspective.</span> TDD uses JUnit/TestNG assertions; BDD uses Gherkin feature files. BDD generates business-readable reports; TDD generates technical pass/fail output.' },
          { q: 'What is Gherkin and what are its key keywords?', a: '<span class="wi-ans-key">Gherkin is the plain-text DSL used to write BDD scenarios.</span> Keywords: <b>Feature</b> (describes the functionality), <b>Scenario</b> (one test case), <b>Given</b> (precondition), <b>When</b> (action), <b>Then</b> (assertion), <b>And/But</b> (chain steps), <b>Background</b> (shared setup), <b>Scenario Outline</b> (data-driven), <b>Examples</b> (data table).' },
          { q: 'What is a Feature file?', a: '<span class="wi-ans-key">A Feature file is a plain-text .feature file that contains one Feature and one or more Scenarios written in Gherkin.</span> It lives under src/test/resources/features/ and is version-controlled as living documentation. Each file should describe one functional area (e.g., Login, Checkout).' },
          { q: 'What is a Scenario Outline and when do you use it?', a: '<span class="wi-ans-key">Scenario Outline is a parameterized template that runs the same test steps with different data rows from an Examples table.</span> Use it for form validation, login with valid/invalid credentials, or any test that differs only in input/output data. It avoids copy-pasting scenarios.' },
          { q: 'What is a Background block in Cucumber?', a: '<span class="wi-ans-key">Background contains Given steps shared by all scenarios in the same feature file — it runs before every scenario in that file.</span> Use it for common preconditions like navigating to a URL or logging in. Do not abuse it — if two scenarios need different setups, Background is the wrong tool.' },
          { q: 'How do you organize feature files in a large project?', a: '<span class="wi-ans-key">Organize by functional domain — one feature file per bounded context (authentication, checkout, dashboard).</span> For multi-product systems, add a top-level subdirectory per product. Use tags (@smoke, @regression, @wip) for cross-cutting groupings that CI/CD filters on.' },
          { q: 'What are Cucumber tags and how are they used for execution control?', a: '<span class="wi-ans-key">Tags are labels prefixed with @ placed above Scenario or Feature and used to filter which tests run.</span> In @CucumberOptions: <code>tags = "@smoke"</code>. In Maven CLI: <code>-Dcucumber.filter.tags="@regression and not @wip"</code>. CI pipelines run different tag sets on PR vs nightly.' },
          { q: 'Can you explain the difference between Scenario and Scenario Outline?', a: '<span class="wi-ans-key">Scenario runs once with hardcoded values; Scenario Outline runs N times, once per row in the Examples table.</span> Scenario Outline generates N individual test reports. Use Scenario for unique flows, Scenario Outline for data-driven repetition.' },
          { q: 'How do you write a good Gherkin scenario?', a: '<span class="wi-ans-key">Focus on user behavior, not UI mechanics — "When user submits login form" not "When user clicks button with id=submit".</span> Keep each scenario under 5 steps. Use present tense. Scenarios should be independent and not rely on ordering. One scenario = one behavior.' },
        ]
      },
      {
        title: '⚙️ Cucumber Lifecycle & Hooks',
        qs: [
          { q: 'What are Cucumber Hooks and what types exist?', a: '<span class="wi-ans-key">Hooks are lifecycle methods that run at specific points: @Before (before each scenario), @After (after each scenario), @BeforeStep, @AfterStep.</span> They support an <code>order</code> parameter for sequencing. Use @Before for browser setup and @After for screenshot capture and teardown.' },
          { q: 'How do you attach screenshots on test failure in Cucumber?', a: '<span class="wi-ans-key">In the @After hook, check if the scenario failed via <code>scenario.isFailed()</code>, then capture a screenshot and attach it via <code>scenario.attach()</code>.</span> <div class="wi-code-block">@After\npublic void tearDown(Scenario scenario) {\n  if (scenario.isFailed()) {\n    byte[] screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);\n    scenario.attach(screenshot, "image/png", "failure-screenshot");\n  }\n  driver.quit();\n}</div>' },
          { q: 'What is the Cucumber dry-run option?', a: '<span class="wi-ans-key">dryRun = true in @CucumberOptions validates that all Gherkin steps have matching step definitions without actually executing tests.</span> It quickly surfaces "undefined step" errors when adding new feature files. Never run in CI — use it locally as a sanity check.' },
          { q: 'How do you share state between step definitions in Cucumber?', a: '<span class="wi-ans-key">Use Dependency Injection (PicoContainer or Guice) or ThreadLocal context objects.</span> Never use static mutable fields — they break parallel execution. With PicoContainer, create a shared context class; Cucumber injects it via constructor into every step definition class that needs it.' },
          { q: 'Can you explain PicoContainer dependency injection in Cucumber?', a: '<span class="wi-ans-key">PicoContainer is a lightweight DI container that Cucumber uses to inject shared objects into step definition classes via constructor injection.</span> Add <code>cucumber-picocontainer</code> dependency. Create a context class (e.g., TestContext) holding shared state. Any step class whose constructor takes TestContext gets it auto-injected.' },
          { q: 'What is the difference between @Before and @BeforeAll in Cucumber?', a: '<span class="wi-ans-key">@Before runs before each individual scenario; there is no @BeforeAll in Cucumber — use TestNG @BeforeSuite or a static initializer for suite-level setup.</span> For one-time setup (e.g., starting a test server), use a custom plugin or TestNG integration.' },
          { q: 'How do you implement Cucumber with TestNG?', a: '<span class="wi-ans-key">Create a runner class annotated with @CucumberOptions and extend AbstractTestNGCucumberTests.</span> TestNG drives the runner; Cucumber drives scenario discovery. Parallel execution is configured in testng.xml using the dataProvider thread count.' },
          { q: 'What are Cucumber plugins and which ones do you use?', a: '<span class="wi-ans-key">Plugins generate reports and outputs: <code>pretty</code> (console), <code>json:target/cucumber.json</code> (CI integration), <code>html:target/reports</code> (HTML report), <code>junit:target/cucumber.xml</code> (CI JUnit format).</span> Third-party: ExtentCucumberAdapter for rich HTML dashboards with screenshots embedded.' },
          { q: 'How do you generate Extent Reports with Cucumber?', a: '<span class="wi-ans-key">Add extent-cucumber7-adapter dependency, add a plugin reference in @CucumberOptions, and create an extent.properties config file.</span> The adapter hooks into Cucumber\'s event bus and auto-generates a rich HTML report with step-level pass/fail, screenshots, and tags.' },
          { q: 'What is a Cucumber Runner class?', a: '<span class="wi-ans-key">The Runner class is a Java class annotated with @RunWith(Cucumber.class) (JUnit) or extending AbstractTestNGCucumberTests (TestNG) plus @CucumberOptions to configure features path, glue path, tags, and plugins.</span> It is the entry point that connects Gherkin scenarios to step definitions.' },
        ]
      },
      {
        title: '🧩 Step Definitions & Expressions',
        qs: [
          { q: 'What is a Step Definition in Cucumber?', a: '<span class="wi-ans-key">A Step Definition is a Java method annotated with @Given, @When, @Then, @And, @But that maps to a Gherkin step via a string pattern.</span> It contains the automation code that implements the behavior described by the Gherkin step.' },
          { q: 'What is the difference between Cucumber Expressions and Regex in step definitions?', a: '<span class="wi-ans-key">Cucumber Expressions use typed placeholders ({string}, {int}, {word}) — simpler and self-documenting. Regex uses capture groups — more powerful for complex matching.</span> Cucumber Expressions cover 95% of use cases. Prefer them unless you need lookbehind, lookahead, or non-standard matching.' },
          { q: 'How do you handle a DataTable in step definitions?', a: '<span class="wi-ans-key">DataTable is passed as a parameter to a step method and can be converted to List&lt;List&lt;String&gt;&gt;, List&lt;Map&lt;String,String&gt;&gt;, or a custom POJO via DataTable.asMaps() or DataTable.as().</span> Use it for tabular input data like multiple users, product lists, or config combinations.' },
          { q: 'How do you implement data-driven testing in Cucumber?', a: '<span class="wi-ans-key">Two approaches: (1) Scenario Outline with Examples table — Cucumber generates one test per row; (2) Load external JSON/CSV in step definitions and iterate programmatically.</span> Scenario Outline is preferred for small datasets visible in the feature file. External files suit large datasets or dynamically generated test data.' },
          { q: 'Can you explain what "glue" means in CucumberOptions?', a: '<span class="wi-ans-key">Glue is the package path(s) where Cucumber looks for step definitions and hooks.</span> Setting <code>glue = {"com.company.steps", "com.company.hooks"}</code> tells Cucumber to scan those packages. Incorrect glue causes "Undefined step" errors even when step definitions exist.' },
          { q: 'How do you avoid duplicate step definitions in large test suites?', a: '<span class="wi-ans-key">Keep step definitions at a high behavioral level, not UI mechanics level — reuse steps by making them generic (e.g., "I navigate to {page}").</span> Organize by domain, not by feature file. Use a shared CommonSteps class for steps that appear in multiple feature files.' },
          { q: 'What happens if two step definitions match the same Gherkin step?', a: '<span class="wi-ans-key">Cucumber throws an AmbiguousStepDefinitionsException and fails the build.</span> Resolve by making patterns more specific, renaming one step, or merging the two implementations into one step definition with conditional logic.' },
          { q: 'How do you pass a multiline string (docstring) to a step?', a: '<span class="wi-ans-key">Use triple-quoted """ syntax in Gherkin — Cucumber passes it as a String parameter to the step method.</span> Useful for passing JSON bodies, SQL queries, or multiline text to API or DB steps without escaping.' },
        ]
      },
      {
        title: '⚡ Parallel Execution & Advanced',
        qs: [
          { q: 'How do you run Cucumber tests in parallel with TestNG?', a: '<span class="wi-ans-key">In testng.xml, set <code>data-provider-thread-count="4"</code> in AbstractTestNGCucumberTests which uses a DataProvider per scenario.</span> Each scenario runs in its own thread. Ensure all shared resources (driver, context) are ThreadLocal-isolated to prevent data collisions.' },
          { q: 'What is the risk of using static fields in parallel Cucumber tests?', a: '<span class="wi-ans-key">Static mutable fields are shared across all threads, causing race conditions: Thread A\'s test data overwrites Thread B\'s mid-execution.</span> The fix: use ThreadLocal&lt;T&gt; for any per-test state, or inject via PicoContainer with thread-scoped context objects.' },
          { q: 'How do you retry flaky tests in Cucumber?', a: '<span class="wi-ans-key">Implement a Cucumber RetryAnalyzer by creating a class implementing IRetryAnalyzer (TestNG) or use the cucumber-retry plugin.</span> Configure max retries and tag scenarios with @flaky. Report retried tests separately in CI to track flakiness trends.' },
          { q: 'How do you integrate Cucumber with Jenkins CI?', a: '<span class="wi-ans-key">Run tests via <code>mvn test -Dcucumber.filter.tags="@regression"</code> in Jenkins. Publish the JSON report using the Cucumber Jenkins plugin or parse it with allure.</span> Archive artifacts (reports/, screenshots/). Fail the pipeline on non-zero Maven exit code.' },
          { q: 'What is the Cucumber EventBus and how can you use it?', a: '<span class="wi-ans-key">EventBus is Cucumber\'s internal event system. You can listen to events (TestRunStarted, TestCaseStarted, TestStepFinished) by implementing a custom EventListener plugin.</span> Use it to build custom reporters, integrate with monitoring tools, or push real-time test results to Slack or dashboards.' },
        ]
      },
    ]
  },
  {
    id: 'playwright',
    title: '🎭 Playwright Java',
    sections: [
      {
        title: '🏗️ Core Architecture',
        qs: [
          { q: 'What is Playwright and why choose it over Selenium?', a: '<span class="wi-ans-key">Playwright is a browser automation library that communicates directly via Chrome DevTools Protocol (CDP), eliminating the WebDriver HTTP layer.</span> Advantages: built-in auto-waiting, isolated BrowserContext for parallel tests, native network interception, multi-browser support in one run, faster execution due to fewer round trips.<span class="wi-ans-tip">"Playwright isn\'t just faster Selenium — it\'s a fundamentally different runtime model."</span>' },
          { q: 'Can you explain the Playwright object hierarchy?', a: '<span class="wi-ans-key">Playwright → Browser → BrowserContext → Page.</span> Playwright manages the browser process lifecycle. Browser represents one browser type (Chromium/Firefox/WebKit). BrowserContext is an isolated session (own cookies/storage). Page is a single tab. Each level has independent lifecycle management.' },
          { q: 'What is BrowserContext and why is it important?', a: '<span class="wi-ans-key">BrowserContext is a fully isolated browser session — its own cookies, localStorage, cache, and auth state.</span> Multiple contexts share one Browser process but are completely isolated. This enables true parallel testing without spawning multiple browser processes, saving 60-80% memory vs Selenium Grid approach.' },
          { q: 'How does Playwright\'s auto-waiting mechanism work?', a: '<span class="wi-ans-key">Before every action (click, fill, check), Playwright automatically waits for the element to be: attached to DOM, visible, stable (not animating), enabled, and ready to receive events.</span> This eliminates 90% of explicit waits. You can configure action timeout globally via browserContext.setDefaultTimeout().' },
          { q: 'What is a Locator in Playwright and how is it different from ElementHandle?', a: '<span class="wi-ans-key">A Locator is a lazy reference that re-queries the DOM on each action, making it retry-safe for dynamic elements. ElementHandle is a snapshot reference that can become stale.</span> Always use Locators — they are auto-retrying, composable, and work correctly in dynamic SPAs. ElementHandle is legacy API.' },
          { q: 'How do you implement a ThreadLocal DriverManager with Playwright?', a: '<span class="wi-ans-key">Use ThreadLocal&lt;Page&gt;, ThreadLocal&lt;BrowserContext&gt;, and ThreadLocal&lt;Playwright&gt; with static getters and a teardown that calls remove() on all three.</span><div class="wi-code-block">public final class DriverManager {\n  private static final ThreadLocal&lt;Page&gt; PAGE = new ThreadLocal&lt;&gt;();\n  public static Page getPage() { return PAGE.get(); }\n  public static void teardown() { \n    PAGE.get().context().close();\n    PAGE.remove(); // CRITICAL — prevents memory leak in thread pool\n  }\n}</div>' },
          { q: 'What browser types does Playwright support?', a: '<span class="wi-ans-key">Chromium (Chrome/Edge), Firefox, and WebKit (Safari).</span> All three are bundled with Playwright — no separate driver downloads. You can run the same test suite across all three browsers in parallel to catch browser-specific rendering bugs.' },
          { q: 'How do you launch Playwright in headless vs headed mode?', a: '<span class="wi-ans-key">Pass LaunchOptions to the launch call: <code>new BrowserType.LaunchOptions().setHeadless(false)</code> for headed (visible browser).</span> Headless is the default for CI. Headed is useful for local debugging. You can also set slowMo to slow down actions for visual observation.' },
        ]
      },
      {
        title: '🎯 Locators & Selectors',
        qs: [
          { q: 'What are the recommended locator strategies in Playwright?', a: '<span class="wi-ans-key">Priority order: getByRole() → getByLabel() → getByText() → getByTestId() → CSS → XPath (last resort).</span> Role-based and label-based locators are most resilient to UI changes. Avoid positional CSS selectors like nth-child. Add data-testid attributes to elements that lack semantic roles.' },
          { q: 'How do you use getByRole() in Playwright?', a: '<span class="wi-ans-key">getByRole() selects elements by their ARIA role — the most resilient locator strategy.</span> Examples: <code>page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Submit"))</code>. Works for: button, link, textbox, heading, checkbox, radio, combobox, listitem, etc.' },
          { q: 'How do you handle dynamic elements with no stable ID?', a: '<span class="wi-ans-key">Use combination locators: filter by text + role, or add data-testid to the element in the application code.</span> If you can\'t modify the app: use <code>locator.filter(new Locator.FilterOptions().setHasText("Submit"))</code> or chain locators like <code>page.locator(".card").filter(...).locator("button")</code>.' },
          { q: 'How do you locate an element inside a shadow DOM?', a: '<span class="wi-ans-key">Playwright automatically pierces shadow DOM boundaries — use CSS selectors normally and Playwright handles the traversal.</span> Use <code>page.locator("my-component >> .inner-element")</code> syntax or just standard CSS — Playwright\'s engine is shadow-DOM aware by default, unlike Selenium.' },
          { q: 'How do you handle elements inside iframes?', a: '<span class="wi-ans-key">Use <code>page.frameLocator("iframe-selector")</code> to get a FrameLocator, then chain locators on it exactly like on the main page.</span><div class="wi-code-block">FrameLocator frame = page.frameLocator("#payment-iframe");\nframe.getByLabel("Card number").fill("4111111111111111");</div>' },
          { q: 'What is locator.filter() and when do you use it?', a: '<span class="wi-ans-key">filter() narrows a locator to elements matching additional conditions — by visible text or a child locator.</span> Example: find a table row that contains "John Doe" — <code>page.locator("tr").filter(new Locator.FilterOptions().setHasText("John Doe"))</code>. Essential for lists of identical elements.' },
          { q: 'How do you handle a list of elements and assert their count?', a: '<span class="wi-ans-key">Use <code>locator.all()</code> to get List&lt;Locator&gt; for iteration, or <code>assertThat(locator).hasCount(N)</code> for count assertion.</span> Never use elementHandles().size() — it\'s a snapshot. Locator count assertions auto-retry until the count matches or timeout.' },
          { q: 'How do you select an option from a dropdown?', a: '<span class="wi-ans-key">For native &lt;select&gt; elements: <code>page.locator("#country").selectOption("India")</code> or selectOption by value/index.</span> For custom dropdowns (div-based): click the trigger, wait for options list to appear, then click the desired option. Never use static sleep — use waitFor().' },
        ]
      },
      {
        title: '🌐 Network & API Interception',
        qs: [
          { q: 'How do you mock API responses in Playwright?', a: '<span class="wi-ans-key">Use <code>page.route()</code> to intercept and fulfill requests with mock data without hitting the real server.</span><div class="wi-code-block">page.route("**/api/products", route -> route.fulfill(\n  new Route.FulfillOptions()\n    .setStatus(200)\n    .setContentType("application/json")\n    .setBody("[{\"id\":1,\"name\":\"Laptop\"}]")\n));</div>' },
          { q: 'How do you wait for an API response in Playwright?', a: '<span class="wi-ans-key">Use <code>page.waitForResponse()</code> to wait for a specific network response before proceeding.</span><div class="wi-code-block">Response response = page.waitForResponse(\n  r -> r.url().contains("/api/login") && r.status() == 200,\n  () -> page.getByRole(AriaRole.BUTTON, ...).click()\n);</div>This is far better than fixed sleep for async-triggered API calls.' },
          { q: 'How do you intercept and modify a request before it reaches the server?', a: '<span class="wi-ans-key">Use <code>route.continue()</code> with modified options to pass through with changes, or <code>route.abort()</code> to block.</span><div class="wi-code-block">page.route("**/api/config", route -> {\n  route.resume(new Route.ResumeOptions()\n    .setHeaders(Map.of("X-Test-Flag", "enabled")));\n});</div>' },
          { q: 'Can you explain Playwright\'s network HAR recording?', a: '<span class="wi-ans-key">HAR (HTTP Archive) recording captures all network requests/responses during a test run into a .har file for replay or analysis.</span> Use <code>browser.newContext(new Browser.NewContextOptions().setRecordHarPath(Paths.get("trace.har")))</code>. Great for diagnosing production incidents by replaying real traffic patterns in tests.' },
          { q: 'How do you test authenticated flows without repeating login every test?', a: '<span class="wi-ans-key">Save auth state to a JSON file after one login, then reuse it via <code>browser.newContext(new Browser.NewContextOptions().setStorageStatePath(...))</code>.</span> This skips the login flow for every test, saving 3-10 seconds per test in large suites. Store separate state files for different user roles.' },
        ]
      },
      {
        title: '🔍 Assertions & Debugging',
        qs: [
          { q: 'How do you use Playwright\'s built-in assertions?', a: '<span class="wi-ans-key">Use the static <code>assertThat()</code> method from PlaywrightAssertions for auto-retrying assertions.</span> Examples: <code>assertThat(page.locator(".status")).hasText("Active")</code>. These retry until the condition is met or timeout. Never use assertEquals() directly — it doesn\'t retry for async DOM updates.' },
          { q: 'What is the Playwright Trace Viewer?', a: '<span class="wi-ans-key">Trace Viewer is a UI tool that replays a recorded test execution showing every action, DOM snapshot before/after, network requests, console logs, and screenshots.</span> Enable with <code>context.tracing().start()</code>. Run with <code>mvn playwright:show-trace trace.zip</code>. Invaluable for debugging CI failures without local reproduction.' },
          { q: 'How do you capture screenshots in Playwright?', a: '<span class="wi-ans-key">Programmatic: <code>page.screenshot(new Page.ScreenshotOptions().setPath(Paths.get("screenshot.png")))</code>. In config: set screenshot to "only-on-failure" or "on".</span> For full-page screenshots add <code>.setFullPage(true)</code>. Attach screenshots to Cucumber/TestNG reports in the teardown hook.' },
          { q: 'How do you capture video of test execution in Playwright?', a: '<span class="wi-ans-key">Set <code>recordVideo</code> in BrowserContext options: <code>new Browser.NewContextOptions().setRecordVideoDir(Paths.get("videos/"))</code>.</span> Video is saved when the context closes. Set recordVideoSize to control resolution. Combine with trace for complete failure evidence in CI.' },
          { q: 'How do you debug a failing Playwright test?', a: '<span class="wi-ans-key">Step 1: Run with <code>setHeadless(false)</code> and <code>setSlowMo(500)</code> to observe visually. Step 2: Enable trace recording. Step 3: Use Playwright Inspector with <code>PWDEBUG=1</code> env var.</span> Inspector pauses execution and lets you step through actions, inspect locators live, and see the DOM state at each step.' },
          { q: 'What is Playwright\'s page.pause() and when is it useful?', a: '<span class="wi-ans-key">page.pause() halts test execution and opens the Playwright Inspector — useful for interactive debugging of a specific point in a test.</span> Use it in headed mode to inspect element state, try selector variants live, and understand why a locator isn\'t finding an element.' },
        ]
      },
      {
        title: '⚡ Parallel & Advanced',
        qs: [
          { q: 'How do you run Playwright tests in parallel with TestNG?', a: '<span class="wi-ans-key">Configure testng.xml with parallel="methods" or parallel="classes" and thread-count. Each thread gets its own BrowserContext via ThreadLocal DriverManager.</span> Never share a Page or BrowserContext across threads. Use @BeforeMethod to init and @AfterMethod to teardown per-thread browser resources.' },
          { q: 'How do you handle file uploads in Playwright?', a: '<span class="wi-ans-key">For &lt;input type="file"&gt;: <code>page.locator("#file-input").setInputFiles(Paths.get("test-doc.pdf"))</code>. For drag-drop uploads or custom file dialogs: listen with <code>page.onFileChooser()</code>.</span><div class="wi-code-block">page.onFileChooser(chooser -> {\n  chooser.setFiles(Paths.get("src/test/resources/test.pdf"));\n});\npage.locator(".upload-zone").click();</div>' },
          { q: 'How do you test a new browser tab or popup?', a: '<span class="wi-ans-key">Use <code>page.waitForPopup()</code> to capture a new page/tab opened by an action.</span><div class="wi-code-block">Page newPage = page.waitForPopup(() -> {\n  page.getByText("Open in new tab").click();\n});\nnewPage.waitForLoadState();\nassertThat(newPage).hasURL(Pattern.compile("/terms"));</div>' },
          { q: 'How do you handle alert/confirm dialogs in Playwright?', a: '<span class="wi-ans-key">Register a dialog listener before triggering the action: <code>page.onDialog(dialog -> dialog.accept())</code> or <code>dialog.dismiss()</code>.</span> The listener must be registered before the dialog triggers. For dialogs with text input, use <code>dialog.accept("input text")</code>.' },
          { q: 'How do you perform keyboard actions in Playwright?', a: '<span class="wi-ans-key">Use <code>page.keyboard().press("Enter")</code>, <code>page.keyboard().type("Hello")</code>, or <code>locator.press("Tab")</code> for element-focused keys.</span> For key combinations: <code>page.keyboard().press("Control+A")</code>. Use <code>locator.fill()</code> for input text — it replaces existing content instantly.' },
          { q: 'How do you scroll to an element in Playwright?', a: '<span class="wi-ans-key">Playwright auto-scrolls before interactions. For explicit scroll: <code>locator.scrollIntoViewIfNeeded()</code> or <code>page.mouse().wheel(0, 500)</code> for pixel scrolling.</span> For infinite scroll testing: scroll in a loop while checking for new elements, then break when content stops loading.' },
        ]
      },
    ]
  },
  {
    id: 'java',
    title: '☕ Java Core',
    sections: [
      {
        title: '🔤 Strings & Primitives',
        qs: [
          { q: 'Why is String immutable in Java?', a: '<span class="wi-ans-key">String is immutable because it is stored in the String Pool — multiple references can point to the same String object safely. Immutability enables safe sharing, caching of hashCode, and thread-safety without synchronization.</span> If Strings were mutable, changing one reference would corrupt all others pointing to the same pool entry.' },
          { q: 'What is the String Pool and how does it work?', a: '<span class="wi-ans-key">The String Pool is a special heap area where JVM caches String literals.</span> When you write <code>String s = "hello"</code>, JVM checks the pool — if "hello" exists, it returns the existing reference. <code>new String("hello")</code> always creates a new heap object, bypassing the pool. Use <code>intern()</code> to add a runtime string to the pool.' },
          { q: 'What is the difference between String, StringBuilder, and StringBuffer?', a: '<span class="wi-ans-key">String: immutable, thread-safe, slow for repeated concatenation (creates new objects). StringBuilder: mutable, NOT thread-safe, fastest for single-threaded concatenation. StringBuffer: mutable, thread-safe via synchronized methods, slower than StringBuilder.</span> Use StringBuilder in loops; String for constants; StringBuffer only when multiple threads share the same builder (rare).' },
          { q: 'How does Java handle == vs .equals() for Strings?', a: '<span class="wi-ans-key">== compares object references (memory address). .equals() compares content.</span> String literals from the pool may pass == because they share the same reference, but this is unreliable — always use .equals() for String comparison. Use Objects.equals() to handle nulls safely.' },
          { q: 'What is autoboxing and unboxing in Java?', a: '<span class="wi-ans-key">Autoboxing: automatic conversion of primitive to wrapper (int → Integer). Unboxing: wrapper to primitive (Integer → int).</span> NullPointerException risk: unboxing a null Integer throws NPE. Performance cost: autoboxing in tight loops creates many short-lived objects — use primitives in performance-critical code.' },
          { q: 'What is the difference between int and Integer in Java?', a: '<span class="wi-ans-key">int is a primitive stored on the stack (4 bytes, no null, no methods). Integer is a wrapper object on the heap with methods like parseInt(), compareTo(), and the ability to be null.</span> Integer caches values -128 to 127 (Integer.valueOf()) — comparing cached values with == returns true, which can fool you.' },
        ]
      },
      {
        title: '🗂️ Collections Framework',
        qs: [
          { q: 'How does HashMap work internally in Java?', a: '<span class="wi-ans-key">HashMap uses an array of buckets. The key\'s hashCode() determines the bucket index. Within a bucket, entries with same hash are stored as a linked list (or Red-Black Tree if list length exceeds 8, Java 8+).</span> get() and put() are O(1) average. Worst case is O(log n) with treeified buckets. Load factor 0.75 triggers resize at 75% capacity.' },
          { q: 'What is the contract between hashCode() and equals()?', a: '<span class="wi-ans-key">If two objects are equal via equals(), they MUST have the same hashCode(). The converse is not required — two objects with the same hashCode may not be equal (hash collision).</span> Violating this contract breaks HashMap/HashSet — equal keys may be stored twice, or get() may fail to find an existing key.' },
          { q: 'What is the difference between ArrayList and LinkedList?', a: '<span class="wi-ans-key">ArrayList: backed by a dynamic array. get(i) is O(1), add/remove in middle is O(n) (shift). LinkedList: doubly linked nodes. get(i) is O(n), add/remove at ends is O(1).</span> Use ArrayList for random access and iteration. Use LinkedList when you frequently add/remove from both ends (Queue/Deque operations).' },
          { q: 'How does ArrayList resize internally?', a: '<span class="wi-ans-key">When capacity is exceeded, ArrayList creates a new array 1.5× larger and copies all elements.</span> Default initial capacity is 10. Pre-size with <code>new ArrayList&lt;&gt;(expectedSize)</code> if you know the count to avoid repeated resizing in large datasets. Each resize is O(n).' },
          { q: 'What is the difference between HashMap and ConcurrentHashMap?', a: '<span class="wi-ans-key">HashMap is not thread-safe — concurrent modification causes ConcurrentModificationException. ConcurrentHashMap is thread-safe using segment-level locking (Java 7) or CAS + synchronized buckets (Java 8+).</span> ConcurrentHashMap allows concurrent reads always; writes lock only the affected bucket, not the entire map.' },
          { q: 'What is the difference between fail-fast and fail-safe iterators?', a: '<span class="wi-ans-key">Fail-fast iterators (ArrayList, HashMap) throw ConcurrentModificationException if the collection is modified during iteration. Fail-safe iterators (CopyOnWriteArrayList, ConcurrentHashMap) iterate over a snapshot and never throw.</span> The trade-off: fail-safe uses more memory (snapshot copy) and may not see the latest modifications.' },
          { q: 'What is a TreeMap and when do you use it?', a: '<span class="wi-ans-key">TreeMap stores entries sorted by key using a Red-Black Tree. get/put/remove are O(log n).</span> Use it when you need natural key ordering (alphabetical, numeric) or range queries (subMap, headMap, tailMap). Keys must implement Comparable or you must provide a Comparator.' },
          { q: 'What is the difference between HashSet and LinkedHashSet and TreeSet?', a: '<span class="wi-ans-key">HashSet: unordered, O(1) ops, no duplicates. LinkedHashSet: insertion-ordered, O(1) ops. TreeSet: sorted order, O(log n) ops.</span> Use HashSet for fast membership tests. LinkedHashSet when order of insertion matters. TreeSet for sorted unique collections or range-based queries.' },
          { q: 'What is a PriorityQueue in Java?', a: '<span class="wi-ans-key">PriorityQueue is a min-heap by default — poll() always returns the smallest element.</span> Uses natural ordering or a provided Comparator. Not thread-safe. Used in Dijkstra\'s algorithm, task scheduling, and any "process the most urgent item first" pattern. Peek is O(1), poll is O(log n).' },
          { q: 'How does Java\'s Deque differ from Stack?', a: '<span class="wi-ans-key">Deque (ArrayDeque) supports insertion/removal from both ends — it works as both a stack (LIFO) and a queue (FIFO).</span> ArrayDeque is faster than Stack (synchronized) and LinkedList (pointer overhead). Use ArrayDeque whenever you need a stack in Java — Stack is legacy.' },
          { q: 'What are generics in Java and what is type erasure?', a: '<span class="wi-ans-key">Generics provide compile-time type safety for collections and methods (e.g., List&lt;String&gt; only accepts Strings).</span> Type erasure: the generic type parameter is removed at runtime — all generic types become Object or their bound. This means List&lt;String&gt; and List&lt;Integer&gt; are the same type at runtime, which limits reflection-based operations.' },
        ]
      },
      {
        title: '🔄 Streams & Lambda (Java 8+)',
        qs: [
          { q: 'What is a Stream in Java 8?', a: '<span class="wi-ans-key">A Stream is a sequence of elements from a source (collection, array, I/O) that supports functional-style operations (filter, map, reduce) without modifying the source.</span> Streams are lazy — intermediate operations (filter, map) are not evaluated until a terminal operation (collect, forEach, count) is called.' },
          { q: 'What is the difference between map() and flatMap() in streams?', a: '<span class="wi-ans-key">map() transforms each element to one output element (1-to-1). flatMap() transforms each element to zero or more elements and flattens the resulting streams into one (1-to-many).</span> Example: converting List&lt;List&lt;String&gt;&gt; to List&lt;String&gt; uses flatMap(Collection::stream).' },
          { q: 'What is a functional interface in Java?', a: '<span class="wi-ans-key">A functional interface has exactly one abstract method and is annotated @FunctionalInterface.</span> Built-in examples: Runnable (no args, no return), Callable (no args, returns T), Predicate&lt;T&gt; (test → boolean), Function&lt;T,R&gt; (apply → R), Consumer&lt;T&gt; (accept → void), Supplier&lt;T&gt; (get → T). Lambdas are shorthand implementations.' },
          { q: 'What is the difference between Predicate, Function, and Consumer?', a: '<span class="wi-ans-key">Predicate&lt;T&gt;: takes T, returns boolean (use for filter). Function&lt;T,R&gt;: takes T, returns R (use for map). Consumer&lt;T&gt;: takes T, returns void (use for forEach side effects).</span> They can be composed: predicate.and(other), function.andThen(other).' },
          { q: 'How do you collect stream results in Java?', a: '<span class="wi-ans-key">Use Collectors.toList(), Collectors.toSet(), Collectors.toMap(), Collectors.groupingBy(), Collectors.joining().</span> Example: <code>list.stream().filter(s -> s.startsWith("A")).collect(Collectors.toList())</code>. Java 16+: use .toList() directly (returns unmodifiable list).' },
          { q: 'What is Optional in Java and how do you use it?', a: '<span class="wi-ans-key">Optional&lt;T&gt; is a container that may or may not contain a non-null value — it prevents NullPointerException by making nullability explicit.</span> Use orElse(default), orElseGet(supplier), orElseThrow(), map(), filter(). Never call get() without isPresent() check — that\'s worse than direct null handling.' },
        ]
      },
      {
        title: '🧵 Concurrency & Memory',
        qs: [
          { q: 'What is the volatile keyword in Java?', a: '<span class="wi-ans-key">volatile guarantees that reads and writes to a variable are always from main memory, not a CPU cache.</span> Prevents visibility issues in multi-threaded programs where one thread\'s write isn\'t seen by another thread. Required in Double-Checked Locking Singleton to prevent partial construction of the instance being visible.' },
          { q: 'What is the difference between synchronized and ReentrantLock?', a: '<span class="wi-ans-key">synchronized is simpler — automatic lock/unlock, supports only one condition. ReentrantLock is explicit — you must unlock in finally{}, supports multiple conditions, tryLock(), timed lock, fairness policy.</span> Prefer synchronized for simple cases. Use ReentrantLock when you need advanced features like interruptible lock acquisition.' },
          { q: 'What is ThreadLocal in Java?', a: '<span class="wi-ans-key">ThreadLocal provides thread-local variables — each thread accessing the variable gets its own independent copy, never shared with other threads.</span> Used in Playwright/Selenium frameworks to store the browser/driver instance per thread. Always call remove() in teardown to prevent memory leaks in thread pools.' },
          { q: 'What is a deadlock and how do you prevent it?', a: '<span class="wi-ans-key">Deadlock occurs when two or more threads are blocked forever, each waiting for a lock held by the other.</span> Prevention: always acquire locks in the same order, use tryLock() with timeout, minimize lock scope, prefer immutable objects. Detect with jstack — look for "waiting to lock" in circular dependencies.' },
          { q: 'What is the difference between Runnable and Callable?', a: '<span class="wi-ans-key">Runnable: run() returns void, cannot throw checked exceptions. Callable&lt;T&gt;: call() returns T, can throw Exception.</span> Submit Callable to ExecutorService via submit() to get a Future&lt;T&gt; — you can check completion, get the result, and handle exceptions from the async task.' },
          { q: 'How does garbage collection work in Java (high level)?', a: '<span class="wi-ans-key">JVM automatically frees heap memory for objects with no live references.</span> Young Generation (Eden + Survivor spaces) holds new objects — Minor GC runs frequently here. Objects surviving multiple GCs are promoted to Old Generation — Major GC (Stop-the-World) is less frequent but longer. Modern GCs (G1, ZGC) minimize pause times.' },
        ]
      },
    ]
  },
  {
    id: 'oops',
    title: '🏗️ OOPs & Design Patterns',
    sections: [
      {
        title: '🔑 Four Pillars of OOPs',
        qs: [
          { q: 'What are the four pillars of OOPs?', a: '<span class="wi-ans-key">Encapsulation: bundling data and methods, hiding internal state via access modifiers. Abstraction: exposing only essential behavior via interfaces/abstract classes. Inheritance: child class inherits parent\'s state and behavior. Polymorphism: one interface, many implementations — method overriding (runtime) and overloading (compile time).</span>' },
          { q: 'What is Encapsulation and why is it important?', a: '<span class="wi-ans-key">Encapsulation hides internal implementation behind a public interface — private fields + public getters/setters.</span> Benefits: controls how data is accessed/modified, enables validation in setters, changes to internals don\'t break callers. In test frameworks: Page Object Model is encapsulation — selectors are private, actions are public methods.' },
          { q: 'What is the difference between Abstraction and Encapsulation?', a: '<span class="wi-ans-key">Abstraction hides complexity — shows WHAT an object does (interface/abstract class). Encapsulation hides state — controls HOW internal data is accessed (private fields + public methods).</span> They work together: an interface defines what a class does (abstraction); the implementing class hides its data (encapsulation).' },
          { q: 'What is polymorphism in Java?', a: '<span class="wi-ans-key">Runtime polymorphism (overriding): a subclass provides its own implementation of a parent method — the correct version is chosen at runtime based on the actual object type. Compile-time polymorphism (overloading): multiple methods with the same name but different parameter signatures.</span> Runtime polymorphism enables the Open/Closed Principle.' },
          { q: 'What is the difference between method overriding and overloading?', a: '<span class="wi-ans-key">Overriding: subclass redefines parent method with same signature — resolved at runtime (dynamic dispatch). Overloading: multiple methods in same class with same name but different parameters — resolved at compile time.</span> @Override annotation enforces correct overriding signature at compile time.' },
          { q: 'What is inheritance and what are its limitations?', a: '<span class="wi-ans-key">Inheritance allows a class to reuse state and behavior from a parent class via extends.</span> Limitations: tight coupling (child depends on parent internals), fragile base class problem (parent changes break children), Java only supports single class inheritance. Prefer composition over inheritance for flexibility.' },
        ]
      },
      {
        title: '📐 Interfaces & Abstract Classes',
        qs: [
          { q: 'What is the difference between Interface and Abstract Class?', a: '<span class="wi-ans-key">Interface: defines a contract (what), no state, supports multiple inheritance, all methods implicitly public. Abstract class: partial implementation, can have state and constructors, single inheritance only.</span> Rule: if you\'re defining a capability (Runnable, Comparable), use interface. If you\'re defining a base type with shared behavior, use abstract class.' },
          { q: 'What are default methods in Java interfaces (Java 8)?', a: '<span class="wi-ans-key">Default methods allow interfaces to have concrete method implementations without breaking existing implementing classes.</span> Use case: adding new methods to existing interfaces (e.g., Collection.forEach()). If a class implements two interfaces with the same default method, it MUST override it to resolve the diamond problem.' },
          { q: 'Can an interface have static methods in Java 8+?', a: '<span class="wi-ans-key">Yes — static methods in interfaces are utility methods that belong to the interface type itself, not to instances.</span> They cannot be overridden by implementing classes. Use them for factory methods or helper utilities tightly coupled to the interface (e.g., Comparator.comparing()). Accessed via InterfaceName.method().' },
          { q: 'What is a Functional Interface in Java?', a: '<span class="wi-ans-key">A functional interface has exactly one abstract method and can be used as a lambda target.</span> @FunctionalInterface annotation enforces this at compile time. Examples: Runnable, Callable, Comparator, Predicate, Function, Consumer, Supplier. The foundation of Java 8 streams and lambda expressions.' },
          { q: 'What is a Marker Interface?', a: '<span class="wi-ans-key">A marker interface has no methods — it just marks a class as having a certain property.</span> Examples: Serializable (marks object as serializable), Cloneable (allows clone()), RandomAccess (List supports O(1) indexed access). Modern Java prefers annotations over marker interfaces, but they still appear in legacy APIs.' },
          { q: 'Can you achieve multiple inheritance in Java?', a: '<span class="wi-ans-key">Java doesn\'t support multiple class inheritance (diamond problem), but a class can implement multiple interfaces.</span> Java 8 default methods introduced limited multiple inheritance of behavior — if two interfaces provide conflicting defaults, the implementing class must override to resolve it explicitly.' },
        ]
      },
      {
        title: '🔄 SOLID Principles',
        qs: [
          { q: 'What is the Single Responsibility Principle (SRP)?', a: '<span class="wi-ans-key">A class should have only one reason to change — it should do one thing well.</span> In QA frameworks: LoginPage only handles login UI actions, not test data generation or report writing. A class that reads config, connects to DB, and sends emails violates SRP and is fragile.' },
          { q: 'What is the Open/Closed Principle (OCP)?', a: '<span class="wi-ans-key">Software entities should be open for extension but closed for modification — add new behavior by adding code, not changing existing code.</span> Example: if adding a new browser type requires modifying existing DriverFactory switch-case, that violates OCP. Fix: use a strategy/factory pattern where new browsers are new classes, not new cases.' },
          { q: 'What is the Liskov Substitution Principle (LSP)?', a: '<span class="wi-ans-key">Subtypes must be substitutable for their base types without altering program correctness.</span> Violation example: a ReadOnlyList extends ArrayList but throws UnsupportedOperationException on add() — callers expecting an ArrayList will break. Fix the hierarchy or use composition.' },
          { q: 'What is the Interface Segregation Principle (ISP)?', a: '<span class="wi-ans-key">Clients should not be forced to implement interfaces they don\'t use — prefer many small, specific interfaces over one large interface.</span> Example: don\'t force a ReadOnlyRepository to implement save() and delete() by bundling them into one IRepository interface. Split into IReadRepository and IWriteRepository.' },
          { q: 'What is the Dependency Inversion Principle (DIP)?', a: '<span class="wi-ans-key">High-level modules should not depend on low-level modules — both should depend on abstractions.</span> Example: a test class should depend on a IBrowser interface, not directly on ChromeDriver. This allows swapping implementations (Chrome → Firefox) without changing test code. Foundation of Dependency Injection frameworks.' },
        ]
      },
      {
        title: '🎨 Design Patterns',
        qs: [
          { q: 'What is the Singleton Design Pattern?', a: '<span class="wi-ans-key">Singleton ensures a class has only one instance and provides a global access point to it.</span> Thread-safe implementation: Bill Pugh (static inner class) or Enum singleton. Used in test frameworks for: config manager, driver manager, report manager. Risk: global state makes unit testing harder — consider dependency injection as an alternative.' },
          { q: 'How do you implement a thread-safe Singleton in Java?', a: '<span class="wi-ans-key">Bill Pugh (best): static inner helper class — lazy, thread-safe without synchronization overhead.</span><div class="wi-code-block">public class Config {\n  private Config() {}\n  private static class Holder {\n    static final Config INSTANCE = new Config();\n  }\n  public static Config getInstance() { return Holder.INSTANCE; }\n}</div>Alternative: Enum singleton — also reflection-proof and serialization-safe.' },
          { q: 'What is the Factory Design Pattern?', a: '<span class="wi-ans-key">Factory encapsulates object creation logic — clients request an object by type without knowing the concrete class.</span> In test frameworks: BrowserFactory.getDriver("chrome") returns a Chromium Page, getDriver("firefox") returns Firefox Page. Adding a new browser is a new class, not a modification of existing code (OCP).' },
          { q: 'What is the Builder Design Pattern?', a: '<span class="wi-ans-key">Builder constructs complex objects step by step, separating construction from representation.</span><div class="wi-code-block">TestConfig config = new TestConfig.Builder()\n  .browser("chrome")\n  .headless(true)\n  .timeout(30000)\n  .build();</div>Avoids telescoping constructors. Each setter returns the builder (fluent API). build() validates and creates the final immutable object.' },
          { q: 'What is the Page Object Model (POM) design pattern?', a: '<span class="wi-ans-key">POM encapsulates a web page\'s selectors and interactions in a dedicated class, separating test logic from page implementation details.</span> Each page = one class. Selectors are private fields. Public methods represent user actions (login(), addToCart()). Tests call page methods, never access locators directly. When UI changes, only the POM class changes, not every test.' },
          { q: 'What is the Strategy Design Pattern?', a: '<span class="wi-ans-key">Strategy defines a family of algorithms behind a common interface, making them interchangeable at runtime.</span> Test framework example: execution strategy interface with LocalStrategy, GridStrategy, DockerStrategy implementations. The test runner holds a reference to the interface — swap strategies via config without changing test code.' },
          { q: 'What is the Observer Design Pattern?', a: '<span class="wi-ans-key">Observer defines a one-to-many dependency — when one object (subject) changes state, all dependents (observers) are notified automatically.</span> In test frameworks: Cucumber EventBus uses Observer — test lifecycle events (TestStarted, TestFinished) notify registered listeners (reporters, screenshot capturer, Slack notifier).' },
          { q: 'What is the Decorator Design Pattern?', a: '<span class="wi-ans-key">Decorator wraps an object to add behavior dynamically without changing its class.</span> Example: wrap a basic WebDriver/Page with a LoggingPage decorator that logs every action. Stack decorators: LoggingPage(RetryingPage(BasePage)) — each adds a cross-cutting concern without modifying the core implementation.' },
        ]
      },
    ]
  },
  {
    id: 'testng',
    title: '🧪 TestNG & Framework',
    sections: [
      {
        title: '⚙️ TestNG Core',
        qs: [
          { q: 'What is TestNG and how does it differ from JUnit?', a: '<span class="wi-ans-key">TestNG is a testing framework inspired by JUnit but with more advanced features: parallel execution configuration, data providers, test groups, suite XML configuration, and flexible dependency management.</span> JUnit 5 is now competitive, but TestNG\'s testng.xml provides declarative parallelism control without annotations, which is better for large enterprise suites.' },
          { q: 'What are the TestNG annotations and their execution order?', a: '<span class="wi-ans-key">Execution order: @BeforeSuite → @BeforeTest → @BeforeClass → @BeforeMethod → @Test → @AfterMethod → @AfterClass → @AfterTest → @AfterSuite.</span> @BeforeSuite runs once for the entire suite. @BeforeMethod runs before every @Test method. Understanding this order is critical for correct setup/teardown in parallel environments.' },
          { q: 'How do you run tests in parallel with TestNG?', a: '<span class="wi-ans-key">Configure testng.xml: set parallel="methods" (each method in its own thread), "classes" (each class in its own thread), or "tests" (each &lt;test&gt; tag in its own thread), plus thread-count.</span><div class="wi-code-block">&lt;suite name="Regression" parallel="methods" thread-count="4"&gt;</div>Ensure all per-test resources (driver, test data) are ThreadLocal-isolated.' },
          { q: 'What is a TestNG DataProvider?', a: '<span class="wi-ans-key">DataProvider is an annotation that feeds test methods with multiple data sets — each data set runs as a separate test iteration.</span><div class="wi-code-block">@DataProvider(name = "loginData")\npublic Object[][] loginData() {\n  return new Object[][] { {"admin","pass123"}, {"user","secret"} };\n}\n@Test(dataProvider = "loginData")\npublic void testLogin(String user, String pass) {...}</div>' },
          { q: 'How do you group tests in TestNG?', a: '<span class="wi-ans-key">Use groups attribute in @Test annotation: <code>@Test(groups = {"smoke", "login"})</code>. In testng.xml, include/exclude groups.</span> Group hierarchy: define meta-groups like "regression" = "smoke" + "sanity" + "functional" in testng.xml. Run subsets in CI: smoke on every push, regression nightly.' },
          { q: 'What is test dependency in TestNG?', a: '<span class="wi-ans-key">dependsOnMethods = {"loginTest"} makes a test run only if the dependent test passes.</span> Use sparingly — hard test dependencies reduce test isolation. Better approach: use setup methods to establish prerequisite state, not test-to-test dependencies. Dependent tests that are skipped are marked as SKIP in the report.' },
          { q: 'How do you implement IRetryAnalyzer in TestNG?', a: '<span class="wi-ans-key">Implement IRetryAnalyzer interface with retry() method that returns true to retry.</span><div class="wi-code-block">public class RetryAnalyzer implements IRetryAnalyzer {\n  int count = 0; int MAX = 2;\n  public boolean retry(ITestResult result) {\n    if (count &lt; MAX) { count++; return true; }\n    return false;\n  }\n}</div>Apply via @Test(retryAnalyzer = RetryAnalyzer.class) or a global IAnnotationTransformer listener.' },
          { q: 'What is an ITestListener in TestNG?', a: '<span class="wi-ans-key">ITestListener provides hooks for test lifecycle events: onTestStart, onTestSuccess, onTestFailure, onTestSkipped.</span> Use it to: capture screenshots on failure, log to external dashboards, send Slack notifications for failures, update test management tools (JIRA, TestRail). Register in testng.xml &lt;listeners&gt; block or @Listeners annotation.' },
          { q: 'How do you soft assert in TestNG?', a: '<span class="wi-ans-key">SoftAssert collects all assertion failures and reports them at the end — tests continue even after a failure.</span><div class="wi-code-block">SoftAssert sa = new SoftAssert();\nsa.assertEquals(title, "Dashboard");\nsa.assertTrue(menuVisible);\nsa.assertAll(); // throws if any assertion failed</div>Use for validating multiple fields in one test. Don\'t forget assertAll() — omitting it means failures are silently swallowed.' },
        ]
      },
      {
        title: '🏛️ Framework Architecture',
        qs: [
          { q: 'Can you explain your 7-layer BDD framework architecture?', a: '<span class="wi-ans-key">Layer 1: Feature Files (Gherkin). Layer 2: Step Definitions. Layer 3: Page Objects / Page Components. Layer 4: DriverManager (ThreadLocal browser). Layer 5: ConfigFactory (env config). Layer 6: Utils (ApiHelper, ReportingUtils). Layer 7: Hooks & Listeners (lifecycle management).</span> Each layer has one responsibility; dependencies flow downward only.' },
          { q: 'How do you manage test configuration across environments (dev/staging/prod)?', a: '<span class="wi-ans-key">Use a ConfigFactory with a Singleton that reads the environment name from a Maven/system property and loads the corresponding .properties or .yaml file.</span> Never hardcode URLs. Structure: config/dev.properties, config/staging.properties. CI passes <code>-Denv=staging</code>. All test code reads via Config.get("baseUrl") — switching environments requires zero code changes.' },
          { q: 'What is the Page Component pattern and how does it differ from POM?', a: '<span class="wi-ans-key">Page Component represents reusable UI sections that appear across multiple pages (navigation header, sidebar, data table, toast notifications).</span> POM = one class per page. Component = one class per reusable section. Pages compose components: LoginPage extends BasePage and holds a NavComponent. This prevents duplicating header/footer selectors across every page class.' },
          { q: 'How do you handle test data management in your framework?', a: '<span class="wi-ans-key">Three-tier approach: (1) Static data in JSON/YAML under src/test/resources/testdata/ for fixed reference data. (2) Dynamic data via REST API calls in @Before hooks (create user, seed DB). (3) Faker library for randomized data fields.</span> Never share mutable test data across parallel tests — each test creates its own independent data set.' },
          { q: 'How do you ensure test isolation in a parallel test suite?', a: '<span class="wi-ans-key">Each test must be completely independent: own browser context (ThreadLocal), own test user (created via API in @BeforeMethod), own test data (no shared state), own cleanup in @AfterMethod.</span> Tests should be runnable in any order and in parallel without flakiness. A test that requires another test to run first is not isolated.' },
        ]
      },
    ]
  },
  {
    id: 'api',
    title: '🌐 REST Assured & API',
    sections: [
      {
        title: '📡 REST Assured Fundamentals',
        qs: [
          { q: 'What is REST Assured and what is its BDD syntax?', a: '<span class="wi-ans-key">REST Assured is a Java library for testing RESTful APIs using a fluent Given/When/Then DSL that mirrors Cucumber\'s BDD style.</span><div class="wi-code-block">given()\n  .header("Authorization", "Bearer " + token)\n  .body(requestPayload)\n.when()\n  .post("/api/users")\n.then()\n  .statusCode(201)\n  .body("id", notNullValue());</div>' },
          { q: 'What is RequestSpecification in REST Assured?', a: '<span class="wi-ans-key">RequestSpecification is a reusable request template — define common headers, auth, base URI once and share across all tests.</span><div class="wi-code-block">RequestSpecification spec = new RequestSpecBuilder()\n  .setBaseUri("https://api.example.com")\n  .addHeader("Accept", "application/json")\n  .setAuth(oauth2("token"))\n  .build();\ngiven(spec).when().get("/products").then().statusCode(200);</div>' },
          { q: 'What is ResponseSpecification in REST Assured?', a: '<span class="wi-ans-key">ResponseSpecification is a reusable response assertion template — define expected status codes, content types, and headers once.</span><div class="wi-code-block">ResponseSpecification respSpec = new ResponseSpecBuilder()\n  .expectStatusCode(200)\n  .expectContentType(ContentType.JSON)\n  .build();\ngiven(spec).when().get("/health").then().spec(respSpec);</div>Combine with RequestSpecification for DRY test code.' },
          { q: 'How do you extract values from a JSON response in REST Assured?', a: '<span class="wi-ans-key">Use response.jsonPath().get() with JsonPath expressions, or extract().path() inline.</span><div class="wi-code-block">String token = given().body(creds).post("/login")\n  .then().statusCode(200)\n  .extract().jsonPath().getString("data.token");\n\n// Or: extract a list\nList&lt;String&gt; names = response.jsonPath().getList("products.name");</div>' },
          { q: 'How do you handle authentication in REST Assured?', a: '<span class="wi-ans-key">Four approaches: Basic auth (.auth().basic(user, pass)), Bearer token (.header("Authorization", "Bearer "+token)), OAuth2 (.auth().oauth2(token)), API Key (.header("X-API-Key", key)).</span> Set auth in RequestSpecification so all tests in a suite inherit it. Fetch tokens dynamically in @BeforeSuite to avoid hardcoded credentials.' },
          { q: 'How do you serialize a POJO to JSON in REST Assured?', a: '<span class="wi-ans-key">REST Assured integrates with Jackson/Gson automatically — pass a POJO directly to .body() and it serializes to JSON.</span><div class="wi-code-block">CreateUserRequest req = new CreateUserRequest("John", "john@test.com");\ngiven().contentType(ContentType.JSON)\n  .body(req)\n.when().post("/users")\n.then().statusCode(201);</div>Ensure Jackson is on the classpath; REST Assured auto-detects it.' },
          { q: 'How do you deserialize a JSON response to a POJO?', a: '<span class="wi-ans-key">Use <code>.as(ClassName.class)</code> to deserialize the response body into a POJO.</span><div class="wi-code-block">UserResponse user = given().get("/users/1")\n  .then().statusCode(200)\n  .extract().as(UserResponse.class);\nassertEquals(user.getName(), "John");</div>The POJO needs Jackson annotations or a no-arg constructor + public setters.' },
          { q: 'How do you validate a nested JSON field in REST Assured?', a: '<span class="wi-ans-key">Use JsonPath dot notation for nested fields and bracket notation for arrays.</span><div class="wi-code-block">// Assert nested field\n.body("data.user.email", equalTo("john@test.com"))\n// Assert array element\n.body("products[0].name", equalTo("Laptop"))\n// Assert array size\n.body("products.size()", equalTo(5))\n// Hamcrest on list\n.body("products.name", hasItems("Laptop", "Mouse"))</div>' },
        ]
      },
      {
        title: '🔧 HTTP & API Concepts',
        qs: [
          { q: 'What are the HTTP methods and when do you use each?', a: '<span class="wi-ans-key">GET: retrieve resource (idempotent, no body). POST: create resource (non-idempotent). PUT: replace entire resource (idempotent). PATCH: partial update (idempotent). DELETE: remove resource (idempotent).</span> Idempotent = same request N times has same effect as 1 time. POST is not idempotent — submitting twice may create two records.' },
          { q: 'What do HTTP status code ranges mean?', a: '<span class="wi-ans-key">2xx Success: 200 OK, 201 Created, 204 No Content. 3xx Redirect: 301 Moved, 302 Found. 4xx Client Error: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable. 5xx Server Error: 500 Internal, 503 Service Unavailable.</span> In tests: assert 201 on POST, 200 on GET, 204 on DELETE.' },
          { q: 'What is the difference between authentication and authorization?', a: '<span class="wi-ans-key">Authentication: proving who you are (login with username/password, token verification). Authorization: what you are allowed to do (role-based access control).</span> A valid token (authenticated) may still get 403 Forbidden if that user lacks permission for the resource (not authorized). Test both: authenticated wrong role → 403, unauthenticated → 401.' },
          { q: 'What is an API contract test?', a: '<span class="wi-ans-key">Contract testing verifies that an API producer and consumer agree on the API format — field names, types, required fields, status codes.</span> Tools: Pact for consumer-driven contract testing. In REST Assured: validate response schema with JSON Schema validator. Contract tests catch breaking API changes before they reach integration tests.' },
          { q: 'How do you test API pagination?', a: '<span class="wi-ans-key">Assert: first page returns correct count and has nextPage link. Navigate via next page token/offset. Last page has no nextPage. Out-of-range page returns empty array (not 404).</span><div class="wi-code-block">given().queryParam("page", 1).queryParam("size", 10)\n  .get("/products")\n  .then().body("items.size()", equalTo(10))\n         .body("hasNext", equalTo(true));</div>' },
          { q: 'How do you test error responses in REST Assured?', a: '<span class="wi-ans-key">Test all error paths: 400 (invalid payload), 401 (missing/invalid token), 403 (wrong role), 404 (non-existent resource), 409 (duplicate), 422 (validation failure).</span> Assert both the status code AND the error response body structure — verify error message, error code field, and that no sensitive data leaks in the error response.' },
        ]
      },
    ]
  },
  {
    id: 'cicd',
    title: '🚀 CI/CD & DevOps',
    sections: [
      {
        title: '🔧 Jenkins Fundamentals',
        qs: [
          { q: 'What is Jenkins and why is it used for test automation?', a: '<span class="wi-ans-key">Jenkins is an open-source CI/CD automation server that orchestrates build, test, and deployment pipelines.</span> For test automation: triggers test suites on every code push, publishes test reports, sends failure notifications, runs parallel test execution across agents, and gates deployments on test passage.' },
          { q: 'What is the difference between Freestyle and Pipeline jobs in Jenkins?', a: '<span class="wi-ans-key">Freestyle: UI-configured, limited scripting, hard to version-control. Pipeline (Declarative or Scripted): pipeline-as-code in Jenkinsfile, checked into the repo, version-controlled, supports parallel stages, more powerful.</span> Always use Pipeline — Freestyle is legacy. Declarative pipeline is readable; Scripted is more flexible for complex logic.' },
          { q: 'What is a Jenkinsfile and what are its key sections?', a: '<span class="wi-ans-key">Jenkinsfile is a text file in the repo root defining the entire pipeline as code.</span> Key sections: agent (where to run), stages (logical phases), steps (commands in each stage), post (always/success/failure cleanup), environment (variables), parameters (runtime inputs). Declarative syntax with pipeline { } block.' },
          { q: 'How do you run tests in parallel stages in Jenkins?', a: '<span class="wi-ans-key">Use the parallel block inside a stage to run branches concurrently.</span><div class="wi-code-block">stage("Test") {\n  parallel {\n    stage("Smoke") { steps { sh "mvn test -Dgroups=smoke" } }\n    stage("API") { steps { sh "mvn test -Dgroups=api" } }\n  }\n}</div>Both stages run simultaneously on available agents, reducing total pipeline time.' },
          { q: 'What are Jenkins agents and how do they relate to test execution?', a: '<span class="wi-ans-key">Agents are machines (physical, VM, Docker container) that execute Jenkins pipeline stages.</span> Distributed agents allow parallel test execution across multiple machines. Docker agents ensure a clean, consistent environment for every build — no "works on my machine" issues. Kubernetes agents auto-scale based on queue depth.' },
          { q: 'How do you archive test artifacts in Jenkins?', a: '<span class="wi-ans-key">In the post section or after test step: <code>archiveArtifacts artifacts: "target/reports/**, target/screenshots/**"</code>.</span> Publish HTML reports: use the HTML Publisher Plugin. Publish JUnit XML: <code>junit "target/surefire-reports/*.xml"</code> — enables Jenkins to show pass/fail trends per test method over time.' },
          { q: 'How do you trigger a Jenkins pipeline on a GitHub push?', a: '<span class="wi-ans-key">Install GitHub plugin, configure webhook in GitHub repo settings pointing to Jenkins URL /github-webhook/, add <code>triggers { githubPush() }</code> in Jenkinsfile.</span> For PR triggers: use GitHub Branch Source plugin — pipeline runs on every PR, reports status back to GitHub. Gate merges on green builds.' },
          { q: 'How do you manage secrets in Jenkins?', a: '<span class="wi-ans-key">Use Jenkins Credentials Store — never hardcode secrets in Jenkinsfile.</span><div class="wi-code-block">environment {\n  API_KEY = credentials("api-key-prod")\n}\nsteps { sh "curl -H \'X-API-Key: ${API_KEY}\' ..." }</div>Jenkins masks credential values in logs. Use secret text for tokens, username/password for basic auth, SSH key for Git.' },
        ]
      },
      {
        title: '🧩 CI/CD Concepts',
        qs: [
          { q: 'What is the difference between Continuous Integration, Delivery, and Deployment?', a: '<span class="wi-ans-key">CI: automatically build and test on every commit — catches integration bugs early. CD (Delivery): CI + automated release to staging, but production deployment requires manual approval. CD (Deployment): fully automated — every green build goes straight to production.</span> Most enterprises practice CI + Delivery. Full Deployment requires high test coverage and feature flags.' },
          { q: 'What is a test pyramid and how does it apply to CI/CD?', a: '<span class="wi-ans-key">Test pyramid: many fast unit tests at the base → fewer integration tests in middle → few slow E2E tests at the top.</span> In CI/CD: unit tests run on every commit (seconds), integration tests on PR (minutes), E2E/UI tests in nightly or pre-release pipeline (hours). Inverting the pyramid (many E2E tests) makes CI slow and brittle.' },
          { q: 'How do you handle flaky tests in a CI pipeline?', a: '<span class="wi-ans-key">Strategies: quarantine flaky tests (run separately, don\'t block pipeline), auto-retry on failure (up to 2 retries), track flakiness metrics, fix root causes (timing issues, test data conflicts, environment instability).</span> Never ignore flaky tests — they erode confidence in the suite. A test that sometimes passes is not a passing test.' },
          { q: 'What is Docker and how is it used in test automation?', a: '<span class="wi-ans-key">Docker packages the test environment (JDK, browser, dependencies) into a container that runs identically everywhere.</span> Benefits: consistent environment across dev/CI/CD, parallel test execution in isolated containers, no "browser not installed" CI failures. Playwright ships its own browser binaries inside the container image.' },
          { q: 'What is Selenium Grid and when would you use it vs Playwright?', a: '<span class="wi-ans-key">Selenium Grid distributes Selenium WebDriver tests across multiple machines/browsers in a hub-node topology.</span> Use Selenium Grid for legacy Selenium suites or when cross-browser coverage requires physical devices. Prefer Playwright for new projects — BrowserContext isolation provides parallel execution without Grid\'s infrastructure overhead.' },
          { q: 'How do you integrate test results with Allure Reports?', a: '<span class="wi-ans-key">Add allure-testng (or allure-cucumber) dependency, add the Allure listener. Run tests — results written to allure-results/ folder. Then run <code>allure generate allure-results/</code> to build the HTML report.</span> Allure provides: step-level pass/fail, attachments (screenshots, logs), timeline view, flakiness tracking. Publish in Jenkins via Allure Plugin.' },
        ]
      },
    ]
  },
  {
    id: 'coding',
    title: '💻 Coding Challenges',
    sections: [
      {
        title: '📊 Arrays & Strings',
        qs: [
          { q: 'How do you find the two numbers in an array that sum to a target?', a: '<span class="wi-ans-key">Use a HashMap to store complements — one pass O(n) solution.</span><div class="wi-code-block">public int[] twoSum(int[] nums, int target) {\n  Map&lt;Integer, Integer&gt; map = new HashMap&lt;&gt;();\n  for (int i = 0; i &lt; nums.length; i++) {\n    int complement = target - nums[i];\n    if (map.containsKey(complement))\n      return new int[]{map.get(complement), i};\n    map.put(nums[i], i);\n  }\n  return new int[]{};\n}\n// Time: O(n), Space: O(n)</div>', coding: true },
          { q: 'How do you check if a string is a palindrome?', a: '<span class="wi-ans-key">Two-pointer approach — compare characters from both ends moving inward.</span><div class="wi-code-block">public boolean isPalindrome(String s) {\n  s = s.toLowerCase().replaceAll("[^a-z0-9]", "");\n  int l = 0, r = s.length() - 1;\n  while (l &lt; r) {\n    if (s.charAt(l) != s.charAt(r)) return false;\n    l++; r--;\n  }\n  return true;\n}\n// Time: O(n), Space: O(1)</div>', coding: true },
          { q: 'How do you find the maximum subarray sum (Kadane\'s Algorithm)?', a: '<span class="wi-ans-key">Track current sum and global max — reset current sum to 0 if it goes negative.</span><div class="wi-code-block">public int maxSubArray(int[] nums) {\n  int maxSum = nums[0], curSum = nums[0];\n  for (int i = 1; i &lt; nums.length; i++) {\n    curSum = Math.max(nums[i], curSum + nums[i]);\n    maxSum = Math.max(maxSum, curSum);\n  }\n  return maxSum;\n}\n// Time: O(n), Space: O(1)</div>', coding: true },
          { q: 'How do you check if two strings are anagrams?', a: '<span class="wi-ans-key">Count character frequencies — use an int[26] array for O(n) space instead of HashMap.</span><div class="wi-code-block">public boolean isAnagram(String s, String t) {\n  if (s.length() != t.length()) return false;\n  int[] count = new int[26];\n  for (char c : s.toCharArray()) count[c - \'a\']++;\n  for (char c : t.toCharArray()) count[c - \'a\']--;\n  for (int n : count) if (n != 0) return false;\n  return true;\n}\n// Time: O(n), Space: O(1)</div>', coding: true },
          { q: 'How do you find all duplicates in an array?', a: '<span class="wi-ans-key">Use a HashSet — add each element; if add() returns false it\'s a duplicate.</span><div class="wi-code-block">public List&lt;Integer&gt; findDuplicates(int[] nums) {\n  Set&lt;Integer&gt; seen = new HashSet&lt;&gt;();\n  List&lt;Integer&gt; result = new ArrayList&lt;&gt;();\n  for (int n : nums) {\n    if (!seen.add(n)) result.add(n);\n  }\n  return result;\n}\n// Time: O(n), Space: O(n)</div>', coding: true },
          { q: 'How do you find the longest common prefix among a list of strings?', a: '<span class="wi-ans-key">Use the first string as a reference and progressively shorten it while checking against all other strings.</span><div class="wi-code-block">public String longestCommonPrefix(String[] strs) {\n  String prefix = strs[0];\n  for (int i = 1; i &lt; strs.length; i++)\n    while (!strs[i].startsWith(prefix))\n      prefix = prefix.substring(0, prefix.length() - 1);\n  return prefix;\n}\n// Time: O(S) total chars, Space: O(1)</div>', coding: true },
          { q: 'How do you rotate an array by k positions?', a: '<span class="wi-ans-key">Three-reverse trick — reverse entire array, then reverse first k, then reverse remainder.</span><div class="wi-code-block">public void rotate(int[] nums, int k) {\n  k %= nums.length;\n  reverse(nums, 0, nums.length - 1);\n  reverse(nums, 0, k - 1);\n  reverse(nums, k, nums.length - 1);\n}\nvoid reverse(int[] a, int l, int r) {\n  while (l &lt; r) { int t = a[l]; a[l++] = a[r]; a[r--] = t; }\n}\n// Time: O(n), Space: O(1)</div>', coding: true },
          { q: 'How do you find the missing number in an array of 0 to n?', a: '<span class="wi-ans-key">Use the Gauss formula: expected sum = n*(n+1)/2, subtract actual sum.</span><div class="wi-code-block">public int missingNumber(int[] nums) {\n  int n = nums.length;\n  int expected = n * (n + 1) / 2;\n  int actual = 0;\n  for (int num : nums) actual += num;\n  return expected - actual;\n}\n// Time: O(n), Space: O(1) — no extra data structure needed</div>', coding: true },
        ]
      },
      {
        title: '🔗 Linked Lists',
        qs: [
          { q: 'How do you reverse a singly linked list?', a: '<span class="wi-ans-key">Iterative three-pointer approach — prev, curr, next.</span><div class="wi-code-block">public ListNode reverseList(ListNode head) {\n  ListNode prev = null, curr = head;\n  while (curr != null) {\n    ListNode next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}\n// Time: O(n), Space: O(1)</div>', coding: true },
          { q: 'How do you detect a cycle in a linked list?', a: '<span class="wi-ans-key">Floyd\'s cycle detection — slow pointer moves 1 step, fast pointer moves 2 steps. If they meet, there\'s a cycle.</span><div class="wi-code-block">public boolean hasCycle(ListNode head) {\n  ListNode slow = head, fast = head;\n  while (fast != null && fast.next != null) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow == fast) return true;\n  }\n  return false;\n}\n// Time: O(n), Space: O(1)</div>', coding: true },
          { q: 'How do you find the middle node of a linked list?', a: '<span class="wi-ans-key">Slow/fast pointer — when fast reaches end, slow is at the middle.</span><div class="wi-code-block">public ListNode middleNode(ListNode head) {\n  ListNode slow = head, fast = head;\n  while (fast != null && fast.next != null) {\n    slow = slow.next;\n    fast = fast.next.next;\n  }\n  return slow;\n}\n// For even-length list, returns second middle node</div>', coding: true },
          { q: 'How do you merge two sorted linked lists?', a: '<span class="wi-ans-key">Use a dummy head node and compare nodes from both lists iteratively.</span><div class="wi-code-block">public ListNode mergeTwoLists(ListNode l1, ListNode l2) {\n  ListNode dummy = new ListNode(0), cur = dummy;\n  while (l1 != null && l2 != null) {\n    if (l1.val &lt;= l2.val) { cur.next = l1; l1 = l1.next; }\n    else { cur.next = l2; l2 = l2.next; }\n    cur = cur.next;\n  }\n  cur.next = l1 != null ? l1 : l2;\n  return dummy.next;\n}\n// Time: O(n+m), Space: O(1)</div>', coding: true },
        ]
      },
      {
        title: '🌳 Trees & Graphs',
        qs: [
          { q: 'How do you find the maximum depth of a binary tree?', a: '<span class="wi-ans-key">Recursive DFS — depth = 1 + max(leftDepth, rightDepth).</span><div class="wi-code-block">public int maxDepth(TreeNode root) {\n  if (root == null) return 0;\n  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}\n// Time: O(n), Space: O(h) where h is height</div>', coding: true },
          { q: 'How do you check if a binary tree is balanced?', a: '<span class="wi-ans-key">Return height from bottom up — return -1 to signal unbalanced subtree detected.</span><div class="wi-code-block">public boolean isBalanced(TreeNode root) {\n  return height(root) != -1;\n}\nint height(TreeNode node) {\n  if (node == null) return 0;\n  int l = height(node.left);\n  int r = height(node.right);\n  if (l == -1 || r == -1 || Math.abs(l-r) > 1) return -1;\n  return 1 + Math.max(l, r);\n}</div>', coding: true },
          { q: 'How do you perform level-order traversal (BFS) of a binary tree?', a: '<span class="wi-ans-key">Use a Queue — process each level by iterating over its current size.</span><div class="wi-code-block">public List&lt;List&lt;Integer&gt;&gt; levelOrder(TreeNode root) {\n  List&lt;List&lt;Integer&gt;&gt; res = new ArrayList&lt;&gt;();\n  if (root == null) return res;\n  Queue&lt;TreeNode&gt; q = new LinkedList&lt;&gt;();\n  q.offer(root);\n  while (!q.isEmpty()) {\n    int size = q.size();\n    List&lt;Integer&gt; level = new ArrayList&lt;&gt;();\n    for (int i = 0; i &lt; size; i++) {\n      TreeNode n = q.poll();\n      level.add(n.val);\n      if (n.left != null) q.offer(n.left);\n      if (n.right != null) q.offer(n.right);\n    }\n    res.add(level);\n  }\n  return res;\n}</div>', coding: true },
          { q: 'How do you validate a Binary Search Tree?', a: '<span class="wi-ans-key">Pass valid min/max bounds down the recursion — every node must be within its valid range.</span><div class="wi-code-block">public boolean isValidBST(TreeNode root) {\n  return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);\n}\nboolean validate(TreeNode n, long min, long max) {\n  if (n == null) return true;\n  if (n.val &lt;= min || n.val &gt;= max) return false;\n  return validate(n.left, min, n.val) &&\n         validate(n.right, n.val, max);\n}</div>', coding: true },
        ]
      },
      {
        title: '🔢 Hashmaps & Sliding Window',
        qs: [
          { q: 'How do you find the first non-repeating character in a string?', a: '<span class="wi-ans-key">Two passes: count frequencies in first pass, find first with count 1 in second pass.</span><div class="wi-code-block">public int firstUniqChar(String s) {\n  int[] count = new int[26];\n  for (char c : s.toCharArray()) count[c - \'a\']++;\n  for (int i = 0; i &lt; s.length(); i++)\n    if (count[s.charAt(i) - \'a\'] == 1) return i;\n  return -1;\n}\n// Time: O(n), Space: O(1)</div>', coding: true },
          { q: 'How do you find the longest substring without repeating characters?', a: '<span class="wi-ans-key">Sliding window with HashMap tracking last seen index — jump left pointer past the duplicate.</span><div class="wi-code-block">public int lengthOfLongestSubstring(String s) {\n  Map&lt;Character, Integer&gt; map = new HashMap&lt;&gt;();\n  int max = 0, left = 0;\n  for (int right = 0; right &lt; s.length(); right++) {\n    char c = s.charAt(right);\n    if (map.containsKey(c))\n      left = Math.max(left, map.get(c) + 1);\n    map.put(c, right);\n    max = Math.max(max, right - left + 1);\n  }\n  return max;\n}\n// Time: O(n), Space: O(min(n,charset))</div>', coding: true },
          { q: 'How do you find the maximum sum subarray of size k?', a: '<span class="wi-ans-key">Sliding window — add the new element, subtract the element leaving the window.</span><div class="wi-code-block">public int maxSumSubarray(int[] nums, int k) {\n  int windowSum = 0, maxSum = 0;\n  for (int i = 0; i &lt; k; i++) windowSum += nums[i];\n  maxSum = windowSum;\n  for (int i = k; i &lt; nums.length; i++) {\n    windowSum += nums[i] - nums[i - k];\n    maxSum = Math.max(maxSum, windowSum);\n  }\n  return maxSum;\n}\n// Time: O(n), Space: O(1)</div>', coding: true },
          { q: 'How do you group anagrams together from a list of strings?', a: '<span class="wi-ans-key">Sort each string as the HashMap key — anagrams share the same sorted form.</span><div class="wi-code-block">public List&lt;List&lt;String&gt;&gt; groupAnagrams(String[] strs) {\n  Map&lt;String, List&lt;String&gt;&gt; map = new HashMap&lt;&gt;();\n  for (String s : strs) {\n    char[] ca = s.toCharArray();\n    Arrays.sort(ca);\n    String key = new String(ca);\n    map.computeIfAbsent(key, k -> new ArrayList&lt;&gt;()).add(s);\n  }\n  return new ArrayList&lt;&gt;(map.values());\n}\n// Time: O(n * k log k), Space: O(n*k)</div>', coding: true },
        ]
      },
    ]
  },
];

/* ═══════ RENDERER ═══════ */
(function() {
  const STORAGE_KEY = 'wi_revealed';

  function getRevealed() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch(e) { return {}; }
  }
  function saveRevealed(obj) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); } catch(e){}
  }

  function countQs(chapter) {
    return chapter.sections.reduce((a, s) => a + s.qs.length, 0);
  }

  function renderChapterTabs(container) {
    const revealed = getRevealed();
    WI_CHAPTERS.forEach((ch, ci) => {
      const total = countQs(ch);
      const done = WI_CHAPTERS[ci].sections.reduce((a, s, si) =>
        a + s.qs.filter((_, qi) => revealed[`${ci}-${si}-${qi}`]).length, 0);
      const btn = document.createElement('button');
      btn.className = 'wi-chapter-tab' + (ci === 0 ? ' active' : '');
      btn.dataset.ci = ci;
      btn.innerHTML = `${ch.title} <span class="wi-tab-count">${done}/${total}</span>`;
      container.appendChild(btn);
    });
  }

  function renderChapter(chapter, ci, revealed) {
    const div = document.createElement('div');
    div.className = 'wi-chapter-body' + (ci === 0 ? ' active' : '');
    div.id = `wi-ch-${ci}`;

    chapter.sections.forEach((sec, si) => {
      const secEl = document.createElement('div');
      secEl.className = 'wi-section open';

      const doneInSec = sec.qs.filter((_, qi) => revealed[`${ci}-${si}-${qi}`]).length;
      secEl.innerHTML = `
        <div class="wi-section-header">
          <span class="wi-section-title">${sec.title}</span>
          <span class="wi-section-meta">
            <span class="wi-section-count">${doneInSec}/${sec.qs.length} revealed</span>
            <span class="wi-section-arrow">▲</span>
          </span>
        </div>
        <div class="wi-section-body"></div>`;

      const body = secEl.querySelector('.wi-section-body');
      sec.qs.forEach((qa, qi) => {
        const key = `${ci}-${si}-${qi}`;
        const isRevealed = !!revealed[key];
        const card = document.createElement('div');
        card.className = `wi-qa-card${qa.coding ? ' coding-q' : ''}${isRevealed ? ' revealed' : ''}`;
        card.dataset.key = key;
        card.innerHTML = `
          <div class="wi-qa-question">
            <span class="wi-q-num">Q${qi + 1}</span>
            <span class="wi-q-text">${qa.q}</span>
            <span class="wi-q-toggle">▼</span>
          </div>
          <div class="wi-qa-answer">${qa.a}</div>`;
        body.appendChild(card);
      });

      secEl.querySelector('.wi-section-header').addEventListener('click', () => {
        secEl.classList.toggle('open');
      });

      div.appendChild(secEl);
    });

    div.innerHTML += `<div class="wi-chapter-complete" id="wi-complete-${ci}">🎉 All questions revealed for this chapter! Great work.</div>`;
    return div;
  }

  function updateProgress(container, ci) {
    const revealed = getRevealed();
    const chapter = WI_CHAPTERS[ci];
    const total = countQs(chapter);
    const done = chapter.sections.reduce((a, s, si) =>
      a + s.qs.filter((_, qi) => revealed[`${ci}-${si}-${qi}`]).length, 0);

    const fill = container.querySelector('#wi-progress-fill');
    const label = container.querySelector('#wi-progress-label');
    if (fill) fill.style.width = total ? `${(done/total)*100}%` : '0%';
    if (label) label.textContent = `${done} / ${total} revealed`;

    // Update chapter tab count
    const tab = container.querySelector(`.wi-chapter-tab[data-ci="${ci}"]`);
    if (tab) tab.querySelector('.wi-tab-count').textContent = `${done}/${total}`;

    // Update section counts
    const chBody = container.querySelector(`#wi-ch-${ci}`);
    if (chBody) {
      chapter.sections.forEach((sec, si) => {
        const counts = chBody.querySelectorAll('.wi-section-count');
        if (counts[si]) {
          const secDone = sec.qs.filter((_, qi) => revealed[`${ci}-${si}-${qi}`]).length;
          counts[si].textContent = `${secDone}/${sec.qs.length} revealed`;
        }
      });
    }

    // Show completion banner
    const banner = container.querySelector(`#wi-complete-${ci}`);
    if (banner) banner.classList.toggle('show', done === total && total > 0);
  }

  function filterCards(container, ci, query) {
    const chBody = container.querySelector(`#wi-ch-${ci}`);
    if (!chBody) return;
    const q = query.toLowerCase().trim();
    let visible = 0;
    chBody.querySelectorAll('.wi-qa-card').forEach(card => {
      const text = card.querySelector('.wi-q-text').textContent.toLowerCase();
      const show = !q || text.includes(q);
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    const count = container.querySelector('.wi-search-count');
    if (count) count.textContent = q ? `${visible} match${visible !== 1 ? 'es' : ''}` : '';

    // Show no-results
    let nr = chBody.querySelector('.wi-no-results');
    if (!nr) { nr = document.createElement('div'); nr.className = 'wi-no-results'; chBody.appendChild(nr); }
    nr.style.display = (q && visible === 0) ? '' : 'none';
    nr.textContent = `No questions matching "${query}"`;
  }

  function mount() {
    const root = document.getElementById('wi-root');
    if (!root) return;
    const revealed = getRevealed();

    root.innerHTML = `
      <div class="tab-header wi-header">
        <h1>📋 What Is — Interview Q&A Bank</h1>
        <p>Click any question to reveal the best answer. Yellow highlight = what the interviewer wants to hear. Track your progress per chapter.</p>
        <div class="wi-progress-bar-wrap">
          <div class="wi-progress-bar-bg"><div class="wi-progress-bar-fill" id="wi-progress-fill" style="width:0%"></div></div>
          <span class="wi-progress-label" id="wi-progress-label">0 / 0 revealed</span>
        </div>
      </div>
      <div class="wi-search-wrap">
        <span class="wi-search-icon">🔍</span>
        <input type="text" class="wi-search-input" placeholder="Search questions across this chapter..." id="wi-search">
        <span class="wi-search-count"></span>
      </div>
      <div class="wi-chapter-tabs" id="wi-chapter-tabs"></div>
      <div id="wi-chapter-bodies"></div>`;

    const tabsContainer = root.querySelector('#wi-chapter-tabs');
    const bodiesContainer = root.querySelector('#wi-chapter-bodies');

    renderChapterTabs(tabsContainer);
    WI_CHAPTERS.forEach((ch, ci) => {
      bodiesContainer.appendChild(renderChapter(ch, ci, revealed));
    });

    let activeCi = 0;
    updateProgress(root, activeCi);

    // Chapter tab switching
    tabsContainer.addEventListener('click', e => {
      const btn = e.target.closest('.wi-chapter-tab');
      if (!btn) return;
      activeCi = parseInt(btn.dataset.ci);
      tabsContainer.querySelectorAll('.wi-chapter-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      bodiesContainer.querySelectorAll('.wi-chapter-body').forEach(b => b.classList.remove('active'));
      bodiesContainer.querySelector(`#wi-ch-${activeCi}`).classList.add('active');
      root.querySelector('#wi-search').value = '';
      root.querySelector('.wi-search-count').textContent = '';
      updateProgress(root, activeCi);
    });

    // Card reveal on click
    bodiesContainer.addEventListener('click', e => {
      const card = e.target.closest('.wi-qa-card');
      if (!card) return;
      const key = card.dataset.key;
      const rev = getRevealed();
      if (card.classList.toggle('revealed')) {
        rev[key] = true;
      } else {
        delete rev[key];
      }
      saveRevealed(rev);
      updateProgress(root, activeCi);
    });

    // Search
    root.querySelector('#wi-search').addEventListener('input', e => {
      filterCards(root, activeCi, e.target.value);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
