# FRAMEWORK_VISUALISER.md

> A text-based visual representation of the enterprise QA automation framework architecture.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    TEST EXECUTION ENTRY POINTS                  │
│  mvn test -Dtags=@smoke -Dbrowser=chromium -Denv=staging        │
│  TestNG Suite XML → parallel-testng.xml (5 threads)             │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              LAYER 1: FEATURE FILES (BDD / GHERKIN)             │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Product  │ │ Product  │ │ Product  │ │ Product  │   55+     │
│  │ Variant  │ │ Variant  │ │ Variant  │ │ Variant  │  feature  │
│  │    A     │ │    B     │ │    C     │ │    D     │   files   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│                                                                 │
│  Tags: @smoke @regression @wip @critical @variant               │
│  Syntax: Given / When / Then / Scenario Outline / Examples      │
└───────────────────────────────┬─────────────────────────────────┘
                                │ Cucumber Expression Matching
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│             LAYER 2: STEP DEFINITIONS (GLUE CODE)               │
│                                                                 │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐   │
│  │  Domain Steps  │  │  Common Steps  │  │  API Setup Steps│   │
│  │  @Given @When  │  │  Reusable      │  │  Create state   │   │
│  │  @Then @And    │  │  across 40+    │  │  via REST API   │   │
│  │  domain-scoped │  │  feature files │  │  before UI test │   │
│  └───────┬────────┘  └───────┬────────┘  └────────┬────────┘   │
└──────────┼───────────────────┼────────────────────┼─────────────┘
           │                   │                    │
           └───────────────────┼────────────────────┘
                               │ Delegation (zero UI logic in steps)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│             LAYER 3: PAGE OBJECT MODEL (POM)                    │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Base Page Class                         │  │
│  │  click() | type() | hover() | scroll() | waitForSpinner() │  │
│  └────────────────────────┬──────────────────────────────────┘  │
│                           │ extends                              │
│  ┌─────────┐ ┌──────────┐│┌──────────┐ ┌──────────┐           │
│  │ Login   │ │Dashboard ││ │ Form     │ │ Settings │           │
│  │ Page    │ │  Page    ││ │ Page     │ │  Page    │           │
│  └────┬────┘ └────┬─────┘│└────┬─────┘ └────┬─────┘           │
│       │           │       │     │             │                  │
│  ┌────▼───────────▼───────▼─────▼─────────────▼──────────────┐  │
│  │           JSON LOCATOR MAP (loaded at runtime)             │  │
│  │   { "emailField": "#email", "submitBtn": "//button" }     │  │
│  └────────────────────────────────────────────────────────────┘  │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│             LAYER 4: BASE LAYER (LIFECYCLE)                     │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              ThreadLocal<TestContext>                       │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │ │
│  │  │ Thread 1 │ │ Thread 2 │ │ Thread 3 │ │ Thread 4 │ ... │ │
│  │  │ Page     │ │ Page     │ │ Page     │ │ Page     │     │ │
│  │  │ Tokens   │ │ Tokens   │ │ Tokens   │ │ Tokens   │     │ │
│  │  │ Locators │ │ Locators │ │ Locators │ │ Locators │     │ │
│  │  │ Data     │ │ Data     │ │ Data     │ │ Data     │     │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  @Before: Playwright.create() → Browser → Context → Page       │
│  @After:  Screenshot → Close → Remove ThreadLocal               │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│             LAYER 5: UTILITIES                                  │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │REST API  │ │ JSON     │ │ Email    │ │ Database │          │
│  │Client    │ │ Utils    │ │ Verifier │ │ Queries  │          │
│  │(Rest     │ │(Jackson  │ │(Polling  │ │(MongoDB  │          │
│  │ Assured) │ │JSONPath) │ │ API)     │ │ Driver)  │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ File     │ │ Waits    │ │ Date /   │ │ Soft     │          │
│  │ Utils    │ │ Utils    │ │ Calendar │ │ Asserts  │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│             LAYER 6: CONFIGURATION                              │
│                                                                 │
│  ┌─────────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │  Properties     │  │  JSON Data   │  │  CSV Mappings   │   │
│  │  ─────────────  │  │  ──────────  │  │  ─────────────  │   │
│  │  URLs           │  │  Test data   │  │  TestID → Data  │   │
│  │  Credentials    │  │  Locator maps│  │  combinations   │   │
│  │  Browser type   │  │  API payloads│  │                 │   │
│  │  Environment    │  │  Expected    │  │                 │   │
│  │  Thread count   │  │  values      │  │                 │   │
│  └─────────────────┘  └──────────────┘  └─────────────────┘   │
│                                                                 │
│  Maven -D overrides: -Denv=staging -Dbrowser=firefox            │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│             LAYER 7: REPORTING                                  │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ ExtentReports│  │ Cucumber     │  │ Screenshots          │  │
│  │ HTML Report  │  │ JSON Output  │  │ ──────────────────── │  │
│  │ ──────────── │  │ ──────────── │  │ Auto-capture on fail │  │
│  │ Step logs    │  │ CI/CD        │  │ Base64 in report     │  │
│  │ Screenshots  │  │ dashboards   │  │ File on disk         │  │
│  │ Pie charts   │  │ Build gates  │  │ Full-page capture    │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
User writes Feature File
        │
        ▼
Cucumber parses Gherkin → matches Step Definitions
        │
        ▼
Step Definition delegates → Page Object method
        │
        ▼
Page Object reads JSON locator → calls Playwright API
        │
        ▼
Playwright drives Browser → interacts with web app
        │
        ▼
Results flow back → assertions in Step Definitions
        │
        ▼
Pass/Fail reported → ExtentReports + Cucumber JSON
        │
        ▼
CI/CD pipeline → consumes reports → build gate decision
```

---

## Parallel Execution Flow

```
Maven Surefire Plugin
        │
        ▼
TestNG Suite XML (thread-count=5, parallel=methods)
        │
        ├── Thread 1 ──→ @Before → Playwright → Browser₁ → Test₁ → @After
        │
        ├── Thread 2 ──→ @Before → Playwright → Browser₂ → Test₂ → @After
        │
        ├── Thread 3 ──→ @Before → Playwright → Browser₃ → Test₃ → @After
        │
        ├── Thread 4 ──→ @Before → Playwright → Browser₄ → Test₄ → @After
        │
        └── Thread 5 ──→ @Before → Playwright → Browser₅ → Test₅ → @After
                                                                │
                                                                ▼
                                                    Results Aggregated
                                                    into Single Report
```

---

## API + UI Hybrid Pattern

```
┌─────────────────────────────────────────┐
│          TEST SETUP (API Layer)         │
│                                         │
│  1. RestAssured POST → Create record    │
│  2. Store auth token in ThreadLocal     │
│  3. Store record ID in ThreadLocal      │
│     (Takes ~2 seconds)                  │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│        TEST EXECUTION (UI Layer)        │
│                                         │
│  4. Navigate to specific page           │
│  5. Validate the feature under test     │
│  6. Assert expected outcomes            │
│     (Tests only what matters)           │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│       VALIDATION (DB + API Layer)       │
│                                         │
│  7. Query database for the record       │
│  8. Assert DB state matches UI input    │
│  9. Verify notification email sent      │
│     (True end-to-end coverage)          │
└─────────────────────────────────────────┘
```

---

## Technology Dependency Map

```
                    ┌─────────┐
                    │  Maven  │ ← Build orchestration
                    └────┬────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
     ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
     │ TestNG  │   │Cucumber │   │Surefire │
     │         │   │  JVM    │   │ Plugin  │
     └────┬────┘   └────┬────┘   └─────────┘
          │              │
          └──────┬───────┘
                 │
           ┌─────▼─────┐
           │ Playwright │ ← Browser automation
           │   (Java)   │
           └─────┬──────┘
                 │
     ┌───────────┼───────────┐
     │           │           │
┌────▼───┐ ┌────▼───┐ ┌────▼────┐
│Chromium│ │Firefox │ │ WebKit  │
└────────┘ └────────┘ └─────────┘

Supporting Libraries:
├── RestAssured ──→ REST API client
├── Jackson ──→ JSON serialization
├── JSON-Path ──→ JSON traversal
├── Apache POI ──→ Excel I/O
├── OpenCSV ──→ CSV parsing
├── MongoDB Driver ──→ DB validation
└── ExtentReports ──→ HTML reporting
```

---

*All diagrams represent generic framework architecture — no project-specific details included.*
