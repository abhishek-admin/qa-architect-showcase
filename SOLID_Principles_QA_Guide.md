# SOLID Principles in Automation & Framework Design

> **Curated Reference Guide**: A deep-dive tutorial and interview preparation bank explaining SOLID design principles applied specifically to Test Automation Frameworks (Java / JavaScript / Playwright).

---

## 📂 Table of Contents

1. [Part 1: ELI20 SOLID Analogies in Automation](#part-1-eli20-solid-analogies-in-automation)
2. [Part 2: SOLID Principles Interview Q&A (20 Qs)](#part-2-solid-principles-interview-qa-20-qs)

---

## Part 1: ELI20 SOLID Analogies in Automation

Here is a simplified, plain-English breakdown of the SOLID principles, explained as if you are 20 years old, using test automation components:

### 1. Single Responsibility Principle (SRP)
* **Analogy**: *The Page Object class is a waiter, not the chef or the accountant.*
* **Automation Context**: A single class should do one thing. If you write a `LoginPage` class, its ONLY job is to model the login UI. It shouldn't connect to a SQL database to fetch test credentials, parse properties files, or generate Allure test reports. If the UI changes, you change `LoginPage`. If the database configuration changes, you shouldn't have to touch `LoginPage`.

### 2. Open/Closed Principle (OCP)
* **Analogy**: *The universal charging block. You don't open the block and resolder the wires to charge a new phone; you just plug in a new USB cable.*
* **Automation Context**: Code should be open for extension but closed for modification. If you need to add a new browser type (e.g. Firefox) to your framework, you shouldn't modify the existing `if-else` or `switch` statements inside your core browser setup. Instead, you design a browser loader mapping interface where adding Firefox is as simple as registering a new browser supplier class.

### 3. Liskov Substitution Principle (LSP)
* **Analogy**: *If it looks like a duck, quacks like a duck, but needs batteries, you probably broke substitution.*
* **Automation Context**: Subclasses must be fully substitutable for their parent classes without breaking the test suite. If you create a custom element wrapper `CustomButton` that inherits from `BaseWebElement`, it should support all methods of the parent. If you override `click()` in `CustomButton` but throw an `UnsupportedOperationException` because it's a disabled button, you violate LSP. Any test expecting a `BaseWebElement` will crash when given your subclass.

### 4. Interface Segregation Principle (ISP)
* **Analogy**: *A remote control with 100 buttons when you only use 3: power, volume, and channel.*
* **Automation Context**: Don't force test scripts or helpers to implement interface methods they don't need. Instead of a monolithic `TestHelper` interface containing both `click()`, `sendPostRequest()`, and `executeSqlCommand()`, split them into smaller, focused interfaces: `UiHelper`, `ApiHelper`, and `DatabaseHelper`. A UI-only test should not be forced to implement database helper methods.

### 5. Dependency Inversion Principle (DIP)
* **Analogy**: *Plugging a lamp into a wall outlet. The lamp depends on the general electricity socket abstraction, not the copper wires inside the wall.*
* **Automation Context**: High-level modules (like test scripts) should not depend on low-level modules (like concrete ChromeDriver instances). Instead, both should depend on abstractions (like the `WebDriver` interface in Selenium or the `Page` interface in Playwright). You instantiate the driver via factories and pass it using Dependency Injection (or ThreadLocal wrappers), so the test script never knows or cares about the specific browser implementation.

---

## Part 2: SOLID Principles Interview Q&A (20 Qs)

#### Q1: Give an example of how a standard Page Object Model class might violate the Single Responsibility Principle (SRP). How do you refactor it?
**Answer:**  
An SRP violation occurs when a Page Object class models UI elements, handles test data generation, and executes backend verification API calls.
* **Violation example**:
```java
// VIOLATION: LoginPage is locator model, API client, and DB reader
public class LoginPage {
    private Page page;
    
    public LoginPage(Page page) {
        this.page = page;
    }
    
    public void login(String username, String password) {
        page.fill("#user", username);
        page.fill("#pass", password);
        page.click("#login-btn");
    }

    public String getUserStatusFromDB(String userId) {
        // SQL connection code to query database...
        return "Active";
    }

    public void verifyUserSessionApi(String token) {
        // HTTP client RestAssured call...
    }
}
```
* **Refactored Design**: Segregate the DB query and API validation into helper classes (`UserDatabaseClient` and `SessionApiClient`), leaving `LoginPage` with a single reason to change: UI structure updates.
```java
public class LoginPage {
    private Page page;

    public LoginPage(Page page) {
        this.page = page;
    }

    public void login(String username, String password) {
        page.fill("#user", username);
        page.fill("#pass", password);
        page.click("#login-btn");
    }
}
```

---

#### Q2: Write a JavaScript snippet in Playwright demonstrating SRP violation by mixing UI test steps with browser setup, and show the refactored code.
**Answer:**  
* **Violation**:
```javascript
// VIOLATION: The test file manages browser lifecycle, page actions, and test assertions in one place
const { chromium } = require('playwright');
const { test, expect } = require('@playwright/test');

test('Submit Claim Form', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('https://claims-dev.example.com');
    await page.fill('#claim-id', 'CLM-889');
    await page.click('#submit-btn');
    
    await expect(page.locator('#success-msg')).toBeVisible();
    await browser.close();
});
```
* **Refactored Design**: Let Playwright's test runner fixtures manage the context/browser lifecycle, and use Page Objects for modeling actions:
```javascript
// pageObject/ClaimsPage.js
class ClaimsPage {
    constructor(page) {
        this.page = page;
        this.claimInput = page.locator('#claim-id');
        this.submitBtn = page.locator('#submit-btn');
    }
    async submitClaim(id) {
        await this.claimInput.fill(id);
        await this.submitBtn.click();
    }
}
module.exports = { ClaimsPage };

// test.spec.js
const { test, expect } = require('@playwright/test');
const { ClaimsPage: ClaimsPageTest } = require('./pageObject/ClaimsPage');

test('Submit Claim Form', async ({ page }) => {
    const claimsPage = new ClaimsPageTest(page);
    await page.goto('https://claims-dev.example.com');
    await claimsPage.submitClaim('CLM-889');
    await expect(page.locator('#success-msg')).toBeVisible();
});
```

---

#### Q3: How do we apply the Open/Closed Principle (OCP) to a Browser Setup Factory to prevent code modifications when adding a new browser?
**Answer:**  
If a browser factory uses a switch statement matching string inputs, adding a new browser (e.g. `Safari` or `Edge`) requires modifying the factory method. Under OCP, we replace the `switch` block with a `Map` of browser supplier functional interfaces.
* **OCP Compliant Factory (Java)**:
```java
package com.enterprise.framework.driver;

import com.microsoft.playwright.*;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Supplier;

public final class BrowserFactory {
    private static final Map<String, Supplier<Browser>> BROWSER_MAP = new HashMap<>();

    static {
        Playwright playwright = Playwright.create();
        BROWSER_MAP.put("chrome", () -> playwright.chromium().launch());
        BROWSER_MAP.put("firefox", () -> playwright.firefox().launch());
        BROWSER_MAP.put("webkit", () -> playwright.webkit().launch());
    }

    public static Browser getBrowser(String name) {
        Supplier<Browser> supplier = BROWSER_MAP.get(name.toLowerCase());
        if (supplier == null) {
            throw new IllegalArgumentException("Unsupported browser: " + name);
        }
        return supplier.get();
    }

    // New browsers can be registered dynamically at runtime without editing class source
    public static void registerBrowser(String name, Supplier<Browser> supplier) {
        BROWSER_MAP.put(name.toLowerCase(), supplier);
    }
}
```

---

#### Q4: Write an OCP-compliant Browser Factory in Playwright JavaScript.
**Answer:**  
Using key-value lookup functions maps the configuration to launcher methods cleanly:
```javascript
const { chromium, firefox, webkit } = require('@playwright/test');

const browserLaunchers = {
    chrome: async (options) => await chromium.launch(options),
    firefox: async (options) => await firefox.launch(options),
    webkit: async (options) => await webkit.launch(options)
};

class PlaywrightBrowserFactory {
    static async createInstance(browserName, options = {}) {
        const launcher = browserLaunchers[browserName.toLowerCase()];
        if (!launcher) {
            throw new Error(`Unsupported browser engine: ${browserName}`);
        }
        return await launcher(options);
    }
    
    // Extensibility: register new setups dynamically
    static registerLauncher(name, launcherFn) {
        browserLaunchers[name.toLowerCase()] = launcherFn;
    }
}

module.exports = { PlaywrightBrowserFactory };
```

---

#### Q5: Explain how custom Element wrappers can violate the Liskov Substitution Principle (LSP).
**Answer:**  
In Java frameworks, we often create a wrapper class to represent specific elements (like `Button` or `TextBox`) derived from a parent `Element` class. If the subclass disables or changes parent operations (e.g., throwing exceptions on inherited methods), it violates LSP.
* **LSP Violation**:
```java
class BaseElement {
    public void click() {
        System.out.println("Click element");
    }
}

class ReadOnlyLabel extends BaseElement {
    @Override
    public void click() {
        // VIOLATION: A read-only label does not support clicking, breaking substitution
        throw new UnsupportedOperationException("Cannot click read-only label");
    }
}
```
If a test loops through a list of `BaseElement` objects and invokes `click()`, it will crash if it encounters a `ReadOnlyLabel`. The label subclass is not substitutable for its parent. Instead, extract `Clickable` into a separate interface or hierarchy.

---

#### Q6: Refactor the LSP violation in Q5 to conform to SOLID principles.
**Answer:**  
Separate the concerns into distinct interfaces or hierarchies so subclasses don't inherit methods they cannot fulfill:
```java
interface Renderable {
    void draw();
}

interface Clickable {
    void click();
}

class BaseLabel implements Renderable {
    public void draw() {
        System.out.println("Rendering text label");
    }
}

class CustomButton implements Renderable, Clickable {
    public void draw() {
        System.out.println("Rendering button border");
    }
    public void click() {
        System.out.println("Button clicked!");
    }
}
```

---

#### Q7: Describe a violation of the Interface Segregation Principle (ISP) in test helpers, and show the refactored interface structure.
**Answer:**  
An ISP violation occurs when we write a massive, single interface containing all utility functions, forcing mock classes or specific test suites to implement methods they don't care about.
* **Violation**:
```java
// VIOLATION: Forcing client implementations to build unnecessary methods
interface AutomationHelper {
    void click(String selector);
    void sendPost(String url, String body);
    void queryDB(String sql);
}

class MobileUiTestHelper implements AutomationHelper {
    public void click(String selector) { /* UI click code */ }
    public void sendPost(String url, String body) {
        throw new UnsupportedOperationException("No API helper needed in mobile UI tests");
    }
    public void queryDB(String sql) {
        throw new UnsupportedOperationException("No Database helper needed in mobile UI tests");
    }
}
```
* **Refactored Design**: Segregate the monolithic interface:
```java
interface ClickableHelper {
    void click(String selector);
}

interface ApiHelper {
    void sendPost(String url, String body);
}

interface DbHelper {
    void queryDB(String sql);
}

class MobileUiTestHelper implements ClickableHelper {
    public void click(String selector) { /* UI click code */ }
}
```

---

#### Q8: Write a JavaScript snippet modeling ISP for page component capabilities (e.g. Searchable, Sortable, Filterable tables).
**Answer:**  
In JavaScript, we can implement interface separation using mixins or composition, ensuring helper classes only consume needed methods:
```javascript
// Capability mixins
const canSearch = (state) => ({
    search: async (query) => {
        await state.page.fill('#search', query);
        await state.page.click('#search-btn');
    }
});

const canSort = (state) => ({
    sortByColumn: async (colName) => {
        await state.page.click(`th:has-text("${colName}")`);
    }
});

// A read-only static grid only needs sorting, not searching
class StaticGrid {
    constructor(page) {
        this.page = page;
        Object.assign(this, canSort(this)); // Composition: only imports sorting
    }
}

// A dynamic data table needs both search and sorting capabilities
class InteractiveDataTable {
    constructor(page) {
        this.page = page;
        Object.assign(this, canSearch(this), canSort(this));
    }
}
```

---

#### Q9: Explain the Dependency Inversion Principle (DIP) in the context of framework browser configurations.
**Answer:**  
DIP states that high-level modules (test scripts) should not import or instantiate low-level concrete modules (like `ChromeDriver` or `FirefoxDriver`) directly. Instead, they should interact via abstractions (like `WebDriver` or Playwright's `Page` interface), and the drivers should be injected dynamically.
* **DIP Violation**:
```java
// VIOLATION: Test class is tightly coupled to ChromeDriver concrete implementation
public class SearchTest {
    private ChromeDriver driver;

    @BeforeMethod
    public void setup() {
        this.driver = new ChromeDriver(); // Tight coupling
    }

    @Test
    public void searchItem() {
        driver.get("https://example.com");
    }
}
```
* **DIP Refactored Design**:
```java
public class SearchTest {
    private WebDriver driver; // Depends on abstraction

    @BeforeMethod
    public void setup() {
        // The driver instance is dynamically supplied by DriverFactory
        this.driver = DriverFactory.getDriver(); 
    }

    @Test
    public void searchItem() {
        driver.get("https://example.com");
    }
}
```

---

#### Q10: How does dependency injection (DI) resolve DIP violations in Playwright JS test files?
**Answer:**  
Playwright JS uses built-in **fixtures** to inject dependencies like `page` or `context` directly into test runs. This completely decouples test logic from browser initialization:
```javascript
// Playwright automatically manages and injects the 'page' abstraction 
// without the test file importing chromium/firefox directly.
const { test, expect } = require('@playwright/test');

test('Test with Dependency Injection', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
});
```

---

#### Q11: Explain how the design of Playwright's `BrowserContext` class represents the Single Responsibility Principle (SRP).
**Answer:**  
In legacy Selenium, a `WebDriver` instance represents both the browser process and the session state. If you want to clear cookies, you have to execute commands on the browser window directly.  
Playwright separates these responsibilities:
- `Browser` is responsible only for starting/stopping the browser process.
- `BrowserContext` is responsible only for holding isolated user profiles, cookie state, cache storage, and certificates.
- `Page` is responsible only for DOM interactions within a specific tab.
By delegating session isolation entirely to `BrowserContext`, Playwright prevents the browser process class from violating SRP.

---

#### Q12: How does the Open/Closed Principle apply to Test Reporting Listeners (e.g. TestNG TestListenerAdapter)?
**Answer:**  
Test execution tools (like TestNG or Cucumber runners) provide **Listener Interfaces** (e.g., `ITestListener`). When you want to add new reporting formats (like Allure, ExtentReports, or Console logs), you write a class implementing the listener interfaces rather than modifying the test executor code. The runner engine is closed for modifications but open for new reporting extensions.

---

#### Q13: Write a Java example of how to implement Configuration Property loaders complying with OCP.
**Answer:**  
Instead of hardcoding file properties reader setups inside `ConfigManager`, use abstract loaders that parse different sources (Properties, JSON, System Env) dynamically:
```java
package com.enterprise.framework.config;

import java.util.Map;

interface ConfigurationLoader {
    Map<String, String> loadSettings();
}

class PropertiesFileLoader implements ConfigurationLoader {
    public Map<String, String> loadSettings() {
        // Loads from config.properties file...
        return Map.of("browser", "chrome");
    }
}

class EnvVariablesLoader implements ConfigurationLoader {
    public Map<String, String> loadSettings() {
        // Loads from System.getenv()...
        return Map.of("browser", System.getenv("BROWSER"));
    }
}

// ConfigManager parses settings from any registered loader without modifying its source code
public final class ConfigManager {
    public static void printSettings(ConfigurationLoader loader) {
        Map<String, String> config = loader.loadSettings();
        System.out.println("Config browser: " + config.get("browser"));
    }
}
```

---

#### Q14: Explain Liskov Substitution Principle (LSP) in the context of custom Assertion Libraries.
**Answer:**  
If you write a custom assertion class that inherits from a parent assertion framework (e.g., extending TestNG's `SoftAssert` or Playwright's `expect` matchers), the overridden assertion methods must follow the exact same exception contracts. If a parent method throws `AssertionError` on failure, but your custom assertion prints to console and returns a boolean value instead, you violate LSP. Substituted instances will fail to trigger test failures in the runner.

---

#### Q15: Why are static helper utilities (like `BrowserUtils.java`) common SOLID violation hubs, and what is the refactored approach?
**Answer:**  
Static utilities accumulate unrelated helper functions over time (handling screenshots, parsing JSON files, formatting dates, waiting for UI elements), which directly violates **SRP**. It also introduces tight coupling, violating **DIP** because test scripts import concrete utility classes, making mocking impossible.  
* **Refactoring**: Replace monolithic static classes with smaller, injected components:
```java
// Refactored Date Formatter component
public class DateFormatter {
    public String getFormattedDate() {
        return java.time.LocalDate.now().toString();
    }
}

// Refactored Screenshot capture component
public class ScreenGrabber {
    private Page page;
    public ScreenGrabber(Page page) {
        this.page = page;
    }
    public void capture(String path) {
        page.screenshot(new Page.ScreenshotOptions().setPath(java.nio.file.Paths.get(path)));
    }
}
```

---

#### Q16: How does the Interface Segregation Principle (ISP) prevent Cucumber Step Definition pollution?
**Answer:**  
If a Cucumber Step Definition class implements a giant global state manager, steps become hard to maintain. Under ISP, we split step definitions by module (e.g. `LoginSteps`, `BillingSteps`, `ReportSteps`). Each class is segregated to handle only Gherkin step expressions related to its boundary, avoiding code pollution.

---

#### Q17: Provide a Playwright JS fixture code snippet demonstrating OCP in page instantiation.
**Answer:**  
By using Playwright custom fixtures, we can dynamically load Page Object pages based on test scripts, closing the core script to modification when elements update:
```javascript
const { test: baseTest } = require('@playwright/test');
const { ClaimsPage } = require('./ClaimsPage');

// Extend base test to declareClaimsPage fixture
const test = baseTest.extend({
    claimsPage: async ({ page }, use) => {
        const claimsPage = new ClaimsPage(page);
        await page.goto('/claims');
        await use(claimsPage); // Injected into test scripts
    }
});

module.exports = { test };
```

---

#### Q18: Explain how Liskov Substitution Principle applies when executing tests in parallel across headless and headful browser modes.
**Answer:**  
A test execution configuration must yield identical results regardless of whether the browser is launched headful or headless. If a headless browser run behaves differently (e.g., throwing element visibility errors due to different viewport initialization or GPU rendering bugs), it indicates that the headless mode cannot serve as a direct Liskov substitute for headful mode. You must configure default viewports and flags explicitly to align them.

---

#### Q19: How does the Dependency Inversion Principle (DIP) simplify mocking REST APIs in Playwright tests?
**Answer:**  
Since Playwright UI tests do not depend directly on physical network connections, but rather interface with the network layer via routing abstractions (`page.route()`), we can invert dependencies by intercepting requests and returning mocked JSON payloads. This eliminates direct dependencies on actual backend server states:
```javascript
// Test scripts depend on abstract routes, bypassing concrete API endpoints
await page.route('**/api/v1/user', async (route) => {
    await route.fulfill({
        status: 200,
        body: JSON.stringify({ name: 'Mock User' })
    });
});
```

---

#### Q20: Give a code block demonstrating SRP violation in an API Client class, and show the refactored approach.
**Answer:**  
* **Violation**: Mixing request setup, URI resolution, response parsing, and validation assertions in the same class.
```java
// VIOLATION: ApiClient sends requests AND asserts on results
public class UserApiClient {
    public void createUser(String name) {
        Response response = RestAssured.given()
            .body("{\"name\":\"" + name + "\"}")
            .post("https://api.example.com/users");
            
        // Assertion inside client class violates SRP
        assert response.getStatusCode() == 201;
        assert response.jsonPath().getString("status").equals("success");
    }
}
```
* **Refactored Design**: Segregate request execution (Client) from result evaluation (Validation/Test Script):
```java
public class UserApiClient {
    public Response createUser(String name) {
        return RestAssured.given()
            .body("{\"name\":\"" + name + "\"}")
            .post("https://api.example.com/users");
    }
}

// Validation happens inside the test script execution block
public class UserApiTest {
    @Test
    public void testCreation() {
        UserApiClient client = new UserApiClient();
        Response res = client.createUser("John Doe");
        
        res.then()
           .statusCode(201)
           .body("status", equalTo("success"));
    }
}
```
