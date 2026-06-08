# Framework Deep-Dive Guide

> A comprehensive guide to understanding the architecture, layers, and design decisions of this enterprise QA automation framework.

---

## 1. Architecture Philosophy

This framework follows a **strict 7-layer architecture** where each layer has a single responsibility and communicates only with its adjacent layers. This ensures:

- **Separation of concerns** — changes in one layer don't ripple through others
- **Testability** — each layer can be validated independently
- **Maintainability** — new team members understand where to make changes
- **Scalability** — new features slot into the right layer without restructuring

```
Feature Files (Gherkin / BDD)
        ↓
Step Definitions (Glue Layer)
        ↓
Page Object Layer (Encapsulated UI Actions)
        ↓
Base Layer (Browser Lifecycle + Thread Context)
        ↓
Utilities Layer (API Client, JSON, Assertions, Mail, DB)
        ↓
Configuration Layer (Properties / JSON / CSV)
        ↓
Reporting Layer (ExtentReports + Cucumber HTML + CI JSON)
```

---

## 2. Layer 1 — Feature Files (BDD)

**Purpose:** Define test scenarios in business-readable language using Gherkin syntax.

**Key concepts:**
- Each `.feature` file covers one functional area (e.g., task management, document handling, login flows)
- `Given` sets up preconditions, `When` performs the action, `Then` validates the outcome
- `Background` blocks share common setup steps across scenarios within a file
- `Scenario Outline` + `Examples` tables enable data-driven testing
- Tags (`@smoke`, `@regression`, `@wip`) control execution scope

**Design rules:**
- Scenarios should be **declarative** ("User completes the form") not **imperative** ("User clicks field A, types value, clicks field B")
- One scenario = one behavior being validated
- Feature files serve as **living documentation** readable by non-technical stakeholders

---

## 3. Layer 2 — Step Definitions (Glue Code)

**Purpose:** Map Gherkin steps to Java code. Acts as the bridge layer.

**Key concepts:**
- Java classes annotated with `@Given`, `@When`, `@Then`, `@And`
- Organized by **domain** — separate classes for login, task management, common interactions, etc.
- Uses **Cucumber Expressions** (`{string}`, `{int}`) for typed parameters
- `DataTable` parameters handle tabular step inputs

**Design rules:**
- Step definitions contain **ZERO UI logic** — they delegate immediately to Page Objects
- Generic reusable steps (e.g., "User clicks on {string}") serve 40+ feature files
- State is shared between steps via `ThreadLocal` context, never via static fields

---

## 4. Layer 3 — Page Object Model (POM)

**Purpose:** Encapsulate all UI interactions for each page/section of the application.

**Key concepts:**
- One class per functional UI area
- Methods represent user actions: `clickSubmitButton()`, `enterLoanAmount(String)`, `verifyStatusDisplayed(String)`
- **JSON-driven locators** — selectors stored in external JSON files, loaded at runtime into `Map<String, String>`
- Action wrappers add logging, spinner waits, and retry logic around raw Playwright calls

**Design rules:**
- When the UI changes, **only the JSON locator file is updated** — no Java code changes
- Page Objects never contain test assertions about business logic — only UI interaction methods
- Each method is atomic and reusable

---

## 5. Layer 4 — Base Layer

**Purpose:** Manage Playwright browser lifecycle and provide thread-safe test context.

**Key concepts:**
- `@Before` Cucumber hook: Creates `Playwright` → `Browser` → `BrowserContext` → `Page`
- `@After` Cucumber hook: Screenshots on failure → closes browser chain → clears ThreadLocal
- `ThreadLocal<ContextPOJO>` — each parallel thread gets its own isolated copy of:
  - Browser page
  - Auth tokens
  - Locator maps
  - Test data

**Why ThreadLocal matters:**
- Without it: 5 parallel threads share one browser → race conditions → random failures
- With it: each thread is fully isolated → deterministic execution → zero flakiness from thread interference

---

## 6. Layer 5 — Utilities Layer

**Purpose:** Shared utility classes for non-UI operations.

| Utility | What It Does |
|---------|-------------|
| **REST API Client** | GET/POST/PUT/PATCH/DELETE via RestAssured. Creates test state, fetches auth tokens. |
| **JSON Utilities** | Loads locator maps, test data maps, dynamic configuration from JSON files. |
| **Properties Reader** | Reads environment config (URLs, credentials, browser type) from properties files. |
| **Email Verification** | Polls email testing service API to verify notification emails. |
| **Database Queries** | Connects to MongoDB to validate backend state matches UI. |
| **File Utilities** | Validates downloaded files — existence, size, content. |
| **Waits** | Explicit wait wrappers with meaningful timeout messages. |
| **Date/Calendar** | Date-picker interactions, date format parsing. |
| **Soft Assertions** | Collects all failures, reports at scenario end instead of failing on first. |

---

## 7. Layer 6 — Configuration Layer

**Purpose:** Externalize all environment-specific values and test data.

**Components:**
- `configurations.properties` — URLs, credentials, browser type, product variant, API endpoints
- JSON files — element locators, test data objects, dynamic configuration
- CSV files — test case ID to data combination mappings
- Maven `-D` flags — override any property for CI/CD: `-Denv=staging -Dbrowser=firefox`

**Design rule:** **ZERO hardcoded values** in Java code or feature files. Everything comes from config.

---

## 8. Layer 7 — Reporting Layer

**Purpose:** Generate actionable test execution reports.

**Reports generated:**
1. **ExtentReports HTML** — step-level logs, screenshots on failure, test metadata
2. **Cucumber JSON** — machine-readable for CI/CD dashboard integration
3. **Aggregated HTML Dashboard** — multi-feature pass/fail percentages and trends
4. **PDF Reports** — exportable for stakeholder distribution

**Auto-screenshot flow:**
1. @After hook checks `scenario.isFailed()`
2. Calls `page.screenshot()` for full-page capture
3. Embeds Base64 screenshot in ExtentReport
4. Saves screenshot file to disk for archival

---

## 9. Parallel Execution Architecture

```
Maven Surefire Plugin
        ↓
TestNG Suite XML (parallel-testng.xml, thread-count=5)
        ↓
5 Parallel Threads
        ↓
Each Thread → Runner → Its own Playwright → Browser → Context → Page
        ↓
ThreadLocal<ContextPOJO> isolates each thread's state
        ↓
Results aggregated → Cucumber JSON → ExtentReport
```

**Benefits:** 5× faster execution, zero test interference, independent browser sessions.

---

## 10. Multi-Product / White-Label Strategy

The framework supports multiple product variants from a single codebase:

- Configuration property specifies the active product variant
- JSON data files are organized per variant
- Feature files are tagged per variant for selective execution
- Same Page Objects and Step Definitions serve all variants
- Portal URLs and branding differ per variant via config switching

**Result:** One codebase, 6+ products, zero code duplication.

---

## 11. API + UI Hybrid Testing Pattern

**Problem:** Creating test state via UI is slow (30+ fields) and brittle.

**Solution:**
1. REST API Client creates the application record in desired state
2. Auth token and record ID stored in ThreadLocal
3. UI test launches and starts from the correct state
4. UI test focuses on validating the feature under test, not the setup flow

**Benefits:** Tests are 10× faster to set up, more targeted, and isolate only the feature under test.

---

## 12. CI/CD Integration

- **Execution:** `mvn test -Dtags=@smoke -Dbrowser=chromium -Dheadless=true -Denv=staging`
- **Reports:** `target/cucumber.json` consumed by pipeline reporting plugins
- **Environment:** Switched via Maven flags — zero code changes for different environments
- **Docker:** Playwright official Docker image includes all browser binaries
- **Build gates:** Fail the build if test pass rate drops below configurable threshold

---

*This guide covers the framework's architecture and design decisions for learning and interview preparation purposes.*
