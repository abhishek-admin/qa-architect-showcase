# How to Design a BDD Test Automation Framework — Complete Guide

> **Framework**: CP Core Web UI Automation  
> **Tech Stack**: Playwright (Java) + Cucumber BDD + TestNG + JUnit + RestAssured  
> **Java Version**: 11 | **Build Tool**: Maven  
> **Author**: Auto-generated comprehensive documentation from actual codebase analysis

---

## Table of Contents

1. [Chapter 1: The Vision & Architectural Philosophy](#chapter-1-the-vision--architectural-philosophy)
2. [Chapter 2: Setting the Stage — Developer Environment Setup](#chapter-2-setting-the-stage--developer-environment-setup)
3. [Chapter 3: Designing the Floor Plan — File Directory Structure](#chapter-3-designing-the-floor-plan--file-directory-structure)
4. [Chapter 4: Setting the Ingredients — Creating the pom.xml](#chapter-4-setting-the-ingredients--creating-the-pomxml)
5. [Chapter 5: The Command Center — Centralizing Configuration](#chapter-5-the-command-center--centralizing-configuration)
6. [Chapter 6: Laying the Foundation — Browser Contexts & Lifecycles](#chapter-6-laying-the-foundation--browser-contexts--lifecycles)
7. [Chapter 7: The Traveler's Backpack — Thread-Safe Claim State Management](#chapter-7-the-travelers-backpack--thread-safe-claim-state-management)
8. [Chapter 8: The Map Coordinates — Externalizing UI Locators to JSON](#chapter-8-the-map-coordinates--externalizing-ui-locators-to-json)
9. [Chapter 9: The Plumbing & Power Grid — Action Utilities and Waits](#chapter-9-the-plumbing--power-grid--action-utilities-and-waits)
10. [Chapter 10: Designing the Rooms — Structuring Page Objects](#chapter-10-designing-the-rooms--structuring-page-objects)
11. [Chapter 11: The Translation Layer — Step Definitions & Glue Code](#chapter-11-the-translation-layer--step-definitions--glue-code)
12. [Chapter 12: Dictating the Scenarios — Writing Gherkin Features](#chapter-12-dictating-the-scenarios--writing-gherkin-features)
13. [Chapter 13: The Conductor's Baton — Running Tests in Parallel](#chapter-13-the-conductors-baton--running-tests-in-parallel)
14. [Chapter 14: The Final Chronicle — Custom Extent & PDF Reports](#chapter-14-the-final-chronicle--custom-extent--pdf-reports)
15. [Chapter 15: Scaling to Complexity — Multi-Portal & Multi-Claimant Flows](#chapter-15-scaling-to-complexity--multi-portal--multi-claimant-flows)
16. [Chapter 16: Starting the Engines — Launching Test Pipelines](#chapter-16-starting-the-engines--launching-test-pipelines)
17. [Chapter 17: Preserving the Logs — Artifact Management](#chapter-17-preserving-the-logs--artifact-management)


## The Story of the Robot & the Claim: A Narrated Journey

Once upon a time, in the fast-paced kingdom of Fintech, there was a complex portal that processed thousands of claim applications daily. Filling out a single claim application was a multi-stage saga: verifying co-claimants, compiling tax forms, confirming credit histories, and checking state legislations. 

Doing this manually was like scaling a mountain in a storm—slow, exhausting, and prone to missteps. The developers built a fleet of robotic testers to run the gauntlet. But soon, the robots started colliding: they logged into the same browser windows, overwrote each other's credentials, got confused by different portals, and crashed at the first sign of a layout shift.

This guide tells the story of how we built a unified, self-healing framework structure that allowed 5 parallel robot threads to run in perfect harmony. It is a tale of laying clean foundations, routing the plumbing of utilities, partitioning isolated memory space, and establishing detailed report cards. Let us walk through the steps of this design journey.

---

18. [**UI-Based Framework — Full Design Analysis**](#18-ui-based-framework--full-design-analysis)
19. [**API (RestAssured) Framework — Full Design Analysis**](#19-api-restassured-framework--full-design-analysis)
20. [Best Practices Implemented](#20-best-practices-implemented)
21. [Worst Practices & Anti-Patterns Found](#21-worst-practices--anti-patterns-found)
22. [Optimization Recommendations](#22-optimization-recommendations)
23. [Troubleshooting Guide](#23-troubleshooting-guide)

---

## Chapter 1: The Vision & Architectural Philosophy

### What is this Framework?

This is an **enterprise-grade, end-to-end BDD (Behavior-Driven Development) test automation framework** built to test Core Portal's Customer Portal (CP) and Claim Adjuster (CA) web portals. It automates complex insurance claim application workflows involving multiple claimants, co-claimants, UCFA (Uniform Claim Filing Application) forms, task management, document uploads, and ACORD (Claim Industry Standards Maintenance Organization) data exports.

### ELI20 Explanation

Imagine you're building a robot that fills out claim applications on a website — clicking buttons, typing values, selecting dropdowns, verifying text — just like a human would. Now imagine that robot needs to:

- Fill applications for 1 to 6 claimants simultaneously
- Work across multiple company portals (Core Portal, Omni Claim, etc.)
- Validate data against XML standards (ACORD)
- Run 5 tests in parallel without interference
- Generate beautiful HTML/PDF reports with failure screenshots
- Call backend APIs to set up test data before UI verification

That's exactly what this framework does. It uses:
- **Playwright** (instead of Selenium) for browser automation — faster, more reliable, built-in waits
- **Cucumber** for writing tests in plain English (Gherkin syntax)
- **TestNG/JUnit** for test orchestration
- **RestAssured** for API calls
- **ExtentReports** for rich HTML + PDF reporting

### Why Playwright over Selenium?

| Feature | Playwright | Selenium |
|---------|-----------|----------|
| Auto-waits | Built-in (waits for elements automatically) | Manual waits required |
| Multi-browser | Chromium, Firefox, WebKit in one API | Separate drivers per browser |
| Network interception | Native support | Requires proxy tools |
| Speed | Faster (direct DevTools Protocol) | Slower (WebDriver protocol) |
| Codegen | `mvn exec:java ... codegen` records tests | No built-in recorder |
| Parallel isolation | BrowserContext per test (lightweight) | Full browser per test (heavy) |

---

## Chapter 2: Setting the Stage — Developer Environment Setup

### Software Requirements

| Tool | Version | Purpose |
|------|---------|---------|
| **Java JDK** | 11+ | Runtime & compilation |
| **Apache Maven** | 3.9+ | Dependency management & build |
| **IDE** | IntelliJ IDEA / VS Code | Development |
| **Git** | Latest | Version control |
| **Node.js** | 16+ (optional) | Playwright browser downloads |

### Installation Steps

#### Step 2.1: Install Java 11
```bash
# Windows (using Chocolatey)
choco install openjdk11

# macOS
brew install openjdk@11

# Verify
java -version   # Should show 11.x.x
```

#### Step 2.2: Install Maven
```bash
# Windows
choco install maven

# macOS
brew install maven

# Verify
mvn -version   # Should show 3.9+
```

#### Step 2.3: Clone & Build the Project
```bash
git clone <repository-url>
cd core_portal_web_ui
mvn clean install -DskipTests
```

#### Step 2.4: Install Playwright Browsers
```bash
mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="install"
```
This downloads Chromium, Firefox, and WebKit binaries that Playwright uses internally (no separate driver management like Selenium).

#### Step 2.5: Verify Setup
```bash
mvn clean test -Dxml=testng -Dcucumber.filter.tags="@Smoke"
```

---

## Chapter 3: Designing the Floor Plan — File Directory Structure

```
core_portal_web_ui/
│
├── pom.xml                              # Maven build configuration (all dependencies)
├── data.csv                             # Test case ↔ claimant pattern mapping
├── run.sh                               # Playwright codegen launcher (macOS/Linux)
├── record.sh                            # Playwright recorder for email validation
├── output.txt                           # Last execution log output
│
├── src/
│   ├── main/java/                       # FRAMEWORK CORE (shared across all tests)
│   │   ├── base/
│   │   │   ├── BasePage.java            # ★ Playwright lifecycle, hooks, ThreadLocal
│   │   │   ├── TestBase.java            # ★ ThreadLocal<ClaimInfo> accessor
│   │   │   ├── ClaimInfo.java            # ★ 50+ field data model per test thread
│   │   │   └── DynamicIPTracker.java  # IP-based geolocation fetcher
│   │   └── utils/
│   │       ├── api/
│   │       │   └── WebService.java      # ★ RestAssured wrapper (GET/POST/PUT/PATCH/DELETE)
│   │       ├── assertions/
│   │       │   ├── Assertions.java      # Custom assertion library
│   │       │   ├── SoftAssertions.java  # Soft assertions (continue on failure)
│   │       │   ├── AssertionUtils.java  # Assertion utilities
│   │       │   ├── AssertionLibrary.java
│   │       │   ├── IAssert.java         # Assertion interface
│   │       │   └── IAssertLifecycle.java
│   │       └── commons/
│   │           ├── ActionUtils.java     # ★ 30+ Playwright actions (click, hover, scroll, etc.)
│   │           ├── JSONUtils.java       # ★ JSON loader/parser (locators, ACORD, XPaths)
│   │           ├── PropertiesUtil.java  # ★ configurations.properties reader
│   │           ├── Waits.java           # Page/element wait utilities
│   │           ├── MailUtils.java       # Email validation (EmailService/YopMail)
│   │           ├── DateUtil.java        # Date formatting & comparison
│   │           ├── CalenderUtils.java   # Calendar UI validation
│   │           ├── FileUtils.java       # Excel/CSV file I/O
│   │           ├── MongoUtilNew.java    # MongoDB query utilities
│   │           ├── Loggers.java         # Logging wrapper
│   │           ├── RegexMapBuilder.java # Regex pattern matching for field validation
│   │           ├── UsStates.java        # US state code mappings
│   │           ├── CommonActions.java   # Shared common actions
│   │           └── XMLValidation.java   # XML validation utilities
│   │
│   ├── test/java/                       # TEST CODE
│   │   ├── runner/
│   │   │   ├── RunnerTest.java          # ★ JUnit Cucumber runner (sequential)
│   │   │   ├── ParallelRunner.java      # ★ TestNG parallel runner (5 threads)
│   │   │   └── SampleRun.java           # Standalone Playwright demo
│   │   ├── pages/                       # ★ PAGE OBJECT MODEL
│   │   │   ├── Login.java               # Login page actions
│   │   │   ├── Common.java              # Shared page actions
│   │   │   ├── UCFA.java                # UCFA form page (Customer Portal)
│   │   │   ├── UCFA_LO.java             # UCFA form page (Claim Adjuster portal)
│   │   │   ├── TaskManagement.java      # Task management page
│   │   │   ├── Documents.java           # Document upload/download page
│   │   │   ├── Alert.java               # Alert preferences page
│   │   │   ├── FileClaimWidget.java   # Apply-now widget page
│   │   │   ├── EditUser.java            # User editing page
│   │   │   ├── EmailValidation.java     # Email template validation page
│   │   │   ├── ClaimApplicationAcord.java# ACORD export page
│   │   │   ├── Acord.java               # ACORD data comparison
│   │   │   ├── AcordEnum.java           # ACORD field enumerations
│   │   │   ├── LOPdfValidation.java     # LO PDF report validation
│   │   │   ├── PrintPreview.java        # Print preview page
│   │   │   ├── ClaimForm500.java           # 1003 form validation
│   │   │   ├── UIValidation.java        # Cross-screen UI validation
│   │   │   └── WebService.java          # Page-level API service
│   │   ├── stepdefinitions/             # ★ CUCUMBER STEP DEFINITIONS
│   │   │   ├── Login.java               # Login step glue
│   │   │   ├── Common.java              # Common step glue
│   │   │   ├── UCFA.java                # UCFA step glue
│   │   │   ├── UCFA_LO.java             # UCFA LO step glue
│   │   │   ├── TaskManagement.java      # Task step glue
│   │   │   ├── ClaimApplicationAcord.java# ACORD step glue
│   │   │   ├── PrintPreview.java        # Print preview step glue
│   │   │   ├── EditUser.java            # Edit user step glue
│   │   │   └── AlertPrefEmailValidation.java # Alert/email step glue
│   │   ├── listeners/
│   │   │   └── CustomListener.java      # ★ ExtentReports Cucumber 7 plugin
│   │   └── testing/
│   │       └── FeatureConcatenator.java # Feature file merge utility
│   │
│   ├── test/resources/
│   │   ├── configurations.properties    # ★ All URLs, credentials, browser settings
│   │   ├── cucumber.properties          # Cucumber runtime options
│   │   └── TestDataJsons/
│   │       ├── Locators/                # UI locators by section
│   │       │   ├── Assets.json
│   │       │   ├── Credit.json
│   │       │   ├── Income.json
│   │       │   ├── Declaration.json
│   │       │   ├── GetStarted.json
│   │       │   └── RealEstate.json
│   │       ├── urlaJson/                # UCFA field-level maps
│   │       ├── Xpath.json               # Global XPath registry
│   │       ├── TaskManagement.json      # Task locators
│   │       ├── Ventures.json            # Per-venture URL overrides
│   │       └── Claimhub.json             # ClaimHub configuration
│   │
│   ├── features/                        # ★ GHERKIN FEATURE FILES (55+)
│   │   ├── UCFA.feature, UCFA_All_Combo.feature, UCFA_Final.feature
│   │   ├── Task.feature, TaskManagement.feature, TaskNotifications.feature
│   │   ├── DynamicTask.feature, DynamicTask_UI.feature, Resequence.feature
│   │   ├── DocManagement.feature, Doc_Managment_JV.feature
│   │   ├── ClaimApplicationAcord.feature, Acord.feature
│   │   ├── ApplyFlow.feature, Authorization.feature, AlertPref.feature
│   │   ├── DeepLink.feature, SSO.feature, ContactUs.feature
│   │   ├── LOPortal.feature, LO_Data_Validation.feature
│   │   ├── VOA.feature, ClaimCalculator.feature
│   │   └── ... (55+ total feature files)
│   │
│   ├── testng.xml                       # Sequential execution config
│   ├── parallel-testng.xml              # Parallel execution config (5 threads)
│   ├── run.bat                          # Windows sequential launcher
│   ├── prun.bat                         # Windows parallel launcher
│   └── k.bat                            # Kill leftover browser processes
│
├── Data Source/                          # DATA-DRIVEN FEATURE FILES
│   ├── B1/ ... B6/                      # Claimant 1-6 section features
│   ├── CB1/ ... CB6/                    # Co-claimant 1-6 features
│   ├── B1_B2_Combo/, B3_B4_Combo/, B5_B6_Combo/  # Multi-pair combos
│   ├── TestDataJsons/                   # External test data JSONs
│   ├── ApplyNow.feature
│   └── Claim_Submission.feature
│
├── Reports/
│   ├── FullReports/                     # Extent HTML reports
│   ├── PDF-Reports/                     # PDF summary reports
│   └── Screenshots/                     # Failure screenshots
│
└── target/
    ├── cucumber.json                    # Cucumber JSON output (CI integration)
    ├── HtmlReports/report.html          # Cucumber native HTML report
    └── test-classes/                    # Compiled test classes
```

### ELI20: Why This Structure?

Think of this like building a house:
- **`base/`** = The foundation (BasePage, TestBase, ClaimInfo) — everything sits on top of this
- **`utils/`** = The plumbing & electrical (ActionUtils, JSONUtils, Waits) — invisible but essential services
- **`pages/`** = The rooms (Login, UCFA, TaskManagement) — each page of the website is a "room" in code
- **`stepdefinitions/`** = The instruction manual (Gherkin → Java mapping) — translates English to robot commands
- **`features/`** = The blueprints (Gherkin scenarios) — what the robot should do, written in plain English
- **`listeners/`** = The security cameras (CustomListener) — records everything, takes photos on failure
- **`runner/`** = The foreman (RunnerTest, ParallelRunner) — decides which blueprints to execute and how

### Key Showcase: The Runner Files

Here is how the runners coordinate execution in this structure.

#### 1. `RunnerTest.java` (Sequential Runner)
This class executes scenarios sequentially using JUnit and Cucumber annotations. It acts as the execution entry point.

```java
package runner;

import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import org.junit.runner.RunWith;
import base.BasePage;

@RunWith(Cucumber.class)
@CucumberOptions(
    features = "src/features",           // Path to Gherkin feature files
    glue = {"stepdefinitions", "base"},   // Package bindings for steps and hooks
    tags = "@Smoke",                     // Target test scenarios to execute
    plugin = {
        "pretty",
        "listeners.CustomListener:",     // Extent & PDF reports logger
        "json:target/cucumber.json"      // JSON export for pipelines
    }
)
public class RunnerTest extends BasePage { }
```

#### 2. `ParallelRunner.java` (Parallel Runner)
This class delegates execution to TestNG to execute up to 5 parallel threads.

```java
package runner;

import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;
import org.testng.annotations.DataProvider;

@CucumberOptions(
    features = "src/features",
    glue = {"stepdefinitions", "base"},
    plugin = {
        "pretty",
        "listeners.CustomListener:",
        "json:target/cucumber.json"
    }
)
public class ParallelRunner extends AbstractTestNGCucumberTests {
    @Override
    @DataProvider(parallel = true)
    public Object[][] scenarios() {
        return super.scenarios();
    }
}
```

#### ELI20: The Test Runner Conductor
Think of the Runner like a **Movie Director (or Theater Conductor)**. The actors (step definitions) know their lines, and the script (feature files) is written out. But nothing happens until the Director stands up, calls "Action!", and reads the script scene by scene. The sequential runner is a director who shoots one scene at a time with a single camera crew. The parallel runner is a director who has 5 camera crews shooting 5 different scenes at the same time on different stages (threads).

---

### Key Showcase: The Configuration Files

Configuration management externalizes environments, URLs, browser types, and test credentials from Java source files.

#### 1. `configurations.properties` (The Config Center)
This properties file defines environment overrides, API gateways, and claimant login setups.

```properties
# Environment Configurations
Venture=Core Portal
env=UAT
baseurl=https://claims-dev.example.com
baseurl_CA=https://claims-uat.example.com

# Browser Configurations
browserType=chromium
headless=true

# Test Personas & Credentials
CPLoginCredentials=claimant1@example.com:ClaimPass!123
CB1_CPLoginCredentials=claimant2@example.com:ClaimPass!123
B2_CPLoginCredentials=claimant3@example.com:ClaimPass!123
CB2_CPLoginCredentials=claimant4@example.com:ClaimPass!123
CALoginCredentials=adjuster1@example.com:AdjusterPass!456
```

#### 2. `PropertiesUtil.java` (The Config Reader)
This class reads from `configurations.properties` to load properties dynamically at runtime.

```java
package utils;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class PropertiesUtil {
    private static Properties prop;

    // Static initializer block to load configurations once during class loading
    static {
        prop = new Properties();
        try {
            prop.load(new FileInputStream("src/test/resources/configurations.properties"));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static String getProperty(String key) {
        return prop.getProperty(key);
    }
}
```

#### ELI20: The Central Thermostat
Think of external configuration like a **Central Thermostat/Remote Control**. If you want to change the room temperature or switch TV channels, you don't rewrite the internal wiring of the air conditioner or rebuild the TV. You just press a button on the remote (edit the properties file). If you need to switch your tests from the developer sandbox to the QA server, you change the remote setting (`env=QA` and `baseurl=...`) without touching or compiling a single line of Java code.

---

## Chapter 4: Setting the Ingredients — Creating the pom.xml

### The Full pom.xml Breakdown

The `pom.xml` is the heart of any Maven project. It defines:
1. What libraries (dependencies) the project uses
2. How the project compiles
3. What Java version to target

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!-- Project Identity -->
    <groupId>org.example</groupId>
    <artifactId>product_cd_ui_automation</artifactId>
    <version>1.0-SNAPSHOT</version>

    <!-- Compiler Configuration -->
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>11</source>    <!-- Compile with Java 11 features -->
                    <target>11</target>    <!-- Target Java 11 bytecode -->
                </configuration>
            </plugin>
        </plugins>
    </build>

    <properties>
        <java.version>11</java.version>
    </properties>
```

### All 28 Dependencies Explained

#### 🎭 Browser Automation
```xml
<!-- PLAYWRIGHT: The browser automation engine (replaces Selenium) -->
<dependency>
    <groupId>com.microsoft.playwright</groupId>
    <artifactId>playwright</artifactId>
    <version>1.58.0</version>
</dependency>
```
**Why**: Playwright automates Chromium, Firefox, and WebKit browsers. It's faster than Selenium because it communicates directly via Chrome DevTools Protocol instead of the slower WebDriver protocol.

#### 🥒 BDD (Behavior-Driven Development)
```xml
<!-- CUCUMBER-JAVA: Connects Gherkin steps to Java methods -->
<dependency>
    <groupId>io.cucumber</groupId>
    <artifactId>cucumber-java</artifactId>
    <version>7.2.2</version>
</dependency>

<!-- CUCUMBER-JUNIT: Runs Cucumber with JUnit runner -->
<dependency>
    <groupId>io.cucumber</groupId>
    <artifactId>cucumber-junit</artifactId>
    <version>7.11.2</version>
    <scope>test</scope>
</dependency>
```
**Why**: Cucumber lets you write tests in English (Gherkin syntax: Given/When/Then) and maps each sentence to a Java method. This makes tests readable by non-developers (QA leads, product managers).

#### 🧪 Test Orchestration
```xml
<!-- TESTNG: Parallel execution engine -->
<dependency>
    <groupId>org.testng</groupId>
    <artifactId>testng</artifactId>
    <version>7.5.1</version>
</dependency>

<!-- JUNIT 4: Alternative test runner -->
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.13.2</version>
    <scope>test</scope>
</dependency>
```
**Why**: TestNG provides parallel execution (run 5 tests simultaneously). JUnit provides the `@RunWith(Cucumber.class)` annotation for sequential runs.

#### 📊 Reporting
```xml
<!-- EXTENT REPORTS: Beautiful HTML reports -->
<dependency>
    <groupId>com.aventstack</groupId>
    <artifactId>extentreports</artifactId>
    <version>5.0.9</version>
</dependency>

<!-- EXTENT-CUCUMBER7 ADAPTER: Bridges Cucumber events to ExtentReports -->
<dependency>
    <groupId>tech.grasshopper</groupId>
    <artifactId>extentreports-cucumber7-adapter</artifactId>
    <version>1.9.2</version>
</dependency>

<!-- CUCUMBER REPORTING: Aggregated reports for CI/CD -->
<dependency>
    <groupId>net.masterthought</groupId>
    <artifactId>cucumber-reporting</artifactId>
    <version>5.3.0</version>
</dependency>
```

#### 🌐 API Testing
```xml
<!-- REST-ASSURED: HTTP client for API calls -->
<dependency>
    <groupId>io.rest-assured</groupId>
    <artifactId>rest-assured</artifactId>
    <version>3.2.0</version>
</dependency>
```
**Why**: Used to set up test data via APIs before UI tests run (e.g., creating claim applications, generating auth tokens, adding tasks).

#### 📄 Data Processing
```xml
<!-- JACKSON: JSON/XML serialization/deserialization -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.13.4.2</version>
</dependency>

<!-- JSON-PATH: Navigate & query JSON structures -->
<dependency>
    <groupId>com.jayway.jsonpath</groupId>
    <artifactId>json-path</artifactId>
    <version>2.6.0</version>
</dependency>

<!-- JSON-SIMPLE: Lightweight JSON parsing for locator files -->
<dependency>
    <groupId>com.googlecode.json-simple</groupId>
    <artifactId>json-simple</artifactId>
    <version>1.1.1</version>
</dependency>

<!-- APACHE POI: Read/write Excel files -->
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>3.10-FINAL</version>
</dependency>

<!-- OPENCSV: Parse CSV files -->
<dependency>
    <groupId>net.sf.opencsv</groupId>
    <artifactId>opencsv</artifactId>
    <version>2.3</version>
</dependency>

<!-- COMMONS TEXT: String utilities -->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-text</artifactId>
    <version>1.11.0</version>
</dependency>

<!-- COMMONS CODEC: Base64 encoding (for screenshots) -->
<dependency>
    <groupId>commons-codec</groupId>
    <artifactId>commons-codec</artifactId>
    <version>1.14</version>
</dependency>
```

### ELI20: What is pom.xml?

Think of `pom.xml` as a **shopping list for your project**. Instead of manually downloading 28 JAR files from the internet and placing them in your project, Maven reads this list and downloads everything automatically. When you run `mvn clean install`, Maven:
1. Reads `pom.xml`
2. Downloads all 28 libraries from Maven Central (a giant online library store)
3. Compiles your Java 11 code
4. Runs your tests
5. Generates reports

---

## Chapter 5: The Command Center — Centralizing Configuration

### configurations.properties

This file is the **single source of truth** for all environment-specific settings. No hardcoded values exist in Java code.

```properties
# ═══════════════════════════════════════════
# VENTURE & ENVIRONMENT
# ═══════════════════════════════════════════
Venture=Core Portal              # Which company's portal to test
env=UAT                             # Environment (DEV, QA, UAT, PROD)
baseurl=https://claims-dev.example.com     # Customer Portal URL
baseurl_CA=https://claims-uat.example.com  # Claim Adjuster URL

# ═══════════════════════════════════════════
# BROWSER CONFIGURATION
# ═══════════════════════════════════════════
browserType=chromium                # chromium | firefox | webkit
headless=false                      # true = no visible browser window (CI mode)
record-execution=false              # true = record video of execution

# ═══════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════
AlertEndPoint=/coreclaimapp/cd/api/notifications/category
TaskEndPoint=/coreclaimapp/%portal/api/task
CreateUserEndPoint=/coreclaimapp/lo/api/retaillo/user/v2
CreateCustomerEndPoint=/coreusermgmt/cd/api/createusers
DocumentUploadEndPointLO=/coreclaim/api/tasks/documents

# ═══════════════════════════════════════════
# CREDENTIALS (per claimant persona)
# ═══════════════════════════════════════════
CPLoginCredentials=claimant1@example.com:ClaimPass!123
CB1_CPLoginCredentials=claimant2@example.com:ClaimPass!123
B2_CPLoginCredentials=claimant3@example.com:ClaimPass!123
CB2_CPLoginCredentials=claimant4@example.com:ClaimPass!123
CALoginCredentials=adjuster1@example.com:AdjusterPass!456

# Claimant name-to-email mapping (fs:fs = field separator)
CA_Name:Alex Mercerfs:fsadjuster1@example.com
B1:John Claimantfs:fsclaimant1@example.com
CB1:Jane CoClaimantfs:fsclaimant2@example.com
B2:Bob Claimantfs:fsclaimant3@example.com

# ═══════════════════════════════════════════
# SPECIAL CONFIGURATION
# ═══════════════════════════════════════════
AllTaskNames=<list of 50+ task names>
TaskCommentsDateFormat:"MM/dd/yyyy hh:mm a"
SpecialChar=Date,DOB,Date input From,Date input To,EmailId,titleHold,property type
```

### How Configuration is Loaded

```java
// PropertiesUtil.java — loads configurations.properties once per scenario
public class PropertiesUtil {
    private static Properties prop;

    public PropertiesUtil() {
        prop = new Properties();
        try {
            prop.load(new FileInputStream("src/test/resources/configurations.properties"));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static String getProperty(String key) {
        return prop.getProperty(key);
    }
}
```

### ELI20: Why External Configuration?

Imagine you deploy this framework to 4 different QA environments. Without external config, you'd need to edit Java code every time you switch environments. With `configurations.properties`, you just change one line:
```properties
Venture=QA30 Core    # Switch from Core Portal to QA30
```
No recompilation needed. The same compiled JAR works across all environments.

---

## Chapter 6: Laying the Foundation — Browser Contexts & Lifecycles

### BasePage.java — The Foundation

This is the most important class in the entire framework. It manages:
1. **Playwright browser lifecycle** (create → use → destroy)
2. **Thread safety** via `ThreadLocal` (each parallel thread gets its own browser)
3. **Test data initialization** via `@Before`/`@After` hooks

```java
public class BasePage {

    // ═══════════════════════════════════════════
    // THREADLOCAL: Each thread gets its own instance
    // ═══════════════════════════════════════════
    public static ThreadLocal<Page> tlPage = new ThreadLocal<>();
    public static ThreadLocal<Browser> tlBrowser = new ThreadLocal<>();
    public static ThreadLocal<BrowserContext> tlcontext = new ThreadLocal<>();
    public static ThreadLocal<Playwright> tlPlaywright = new ThreadLocal<>();

    // Shared (read-only after loading) locator maps
    public static LinkedHashMap<String, LinkedHashMap<String, Object>> locatorsMap;
    public static LinkedHashMap<String, LinkedHashMap<String, Object>> acordMap;
    public static LinkedHashMap<String, LinkedHashMap<String, Object>> lOMap;

    // ═══════════════════════════════════════════
    // BEFORE HOOK: Runs before every scenario
    // ═══════════════════════════════════════════
    @Before                           // Cucumber hook
    @BeforeMethod(alwaysRun = true)   // TestNG hook
    public void buildDataMaps() throws Throwable {
        // Step 1: Reset per-thread data container
        TestBase.resetClaimInfo();

        // Step 2: Load configuration properties
        new PropertiesUtil();

        // Step 3: Load venture URLs
        TestBase.getClaimInfo().setVentureMap(JSONUtils.loadCollaborations());
        BASE_URL = TestBase.getClaimInfo().getVentureMap()
            .get(PropertiesUtil.getProperty("Venture")).get("baseurl");

        // Step 4: Load all JSON data maps
        acordMap = JSONUtils.buildACORDMap();         // ACORD field maps
        locatorsMap = JSONUtils.buildLocatorsMap();    // UI locators
        lOMap = JSONUtils.buildLOMap();                // LO-specific locators

        // Step 5: Attach maps to thread-local ClaimInfo
        TestBase.getClaimInfo().setLocatorsMap(locatorsMap);
        TestBase.getClaimInfo().setAcordMap(acordMap);
        TestBase.getClaimInfo().setXpathMap(JSONUtils.buildXpathMap());
        TestBase.getClaimInfo().setDynamicTaskMap(JSONUtils.buildDynamicTaskMap());
    }

    // ═══════════════════════════════════════════
    // AFTER HOOK: Runs after every scenario
    // ═══════════════════════════════════════════
    @After                            // Cucumber hook
    @AfterMethod(alwaysRun = true)    // TestNG hook
    public void assertions() throws Exception {
        // Close browser resources
        if (BasePage.getPage() != null) {
            BasePage.getPage().close();
            BasePage.getBrowserContext().close();
        }
        // Clear per-scenario state
        TestBase.getClaimInfo().setClaimantSectionDataIndexMap(new LinkedHashMap<>());
    }

    // ═══════════════════════════════════════════
    // BROWSER LAUNCH
    // ═══════════════════════════════════════════
    public void launchUserDefinedBrowser() throws Exception {
        String browser = PropertiesUtil.getProperty("browserType");
        createPlaywrightPageInstance(browser);
        tlPage.set(getBrowserContext().newPage());
    }

    // ═══════════════════════════════════════════
    // PLAYWRIGHT INSTANCE CREATION
    // ═══════════════════════════════════════════
    public static ThreadLocal<BrowserContext> createPlaywrightPageInstance(
            String browserType) throws Exception {

        tlPlaywright.set(Playwright.create());
        boolean headless = false;

        // Launch the requested browser
        switch (browserType.toLowerCase()) {
            case "firefox":
                tlBrowser.set(Playwright.create().firefox()
                    .launch(new BrowserType.LaunchOptions().setHeadless(headless)));
                break;
            case "chrome": case "chromium":
                tlBrowser.set(Playwright.create().chromium()
                    .launch(new BrowserType.LaunchOptions().setHeadless(headless)));
                break;
            case "webkit":
                tlBrowser.set(Playwright.create().webkit()
                    .launch(new BrowserType.LaunchOptions().setHeadless(headless)));
                break;
            default:
                tlBrowser.set(Playwright.create().chromium()
                    .launch(new BrowserType.LaunchOptions().setHeadless(headless)));
        }

        // Create isolated BrowserContext with fixed viewport
        tlcontext.set(getBrowser().newContext(
            new Browser.NewContextOptions()
                .setScreenSize(1920, 1080)
                .setViewportSize(1680, 1050)
                .setAcceptDownloads(true)
        ));
        getBrowserContext().setDefaultTimeout(160000);  // 2.5 minute timeout
        return tlcontext;
    }
}
```

### ELI20: What is ThreadLocal?

Imagine a shared office with 5 desks. Each desk has its own phone, computer, and notepad. Even though they're in the same room, each person uses **only their own desk's equipment**.

`ThreadLocal` works the same way for parallel tests:
- Thread 1 → its own Playwright + Browser + Page + ClaimInfo
- Thread 2 → its own Playwright + Browser + Page + ClaimInfo
- Thread 3 → its own Playwright + Browser + Page + ClaimInfo

Without `ThreadLocal`, Thread 1 might accidentally close Thread 2's browser, or Thread 3 might read Thread 1's claim data. `ThreadLocal` prevents this chaos.

### TestBase.java — The ThreadLocal Accessor

```java
public class TestBase {
    private static ThreadLocal<ClaimInfo> claimInfo = new ThreadLocal<>();

    public static ClaimInfo getClaimInfo() {
        return claimInfo.get();
    }

    public static void resetClaimInfo() {
        claimInfo.set(new ClaimInfo());
    }
}
```

Every class in the framework accesses test data through `TestBase.getClaimInfo()`. This returns the **current thread's** ClaimInfo object — guaranteed thread-safe.

---

## Chapter 7: The Traveler's Backpack — Thread-Safe Claim State Management

### ClaimInfo.java — The State Container

`ClaimInfo` is a massive POJO (Plain Old Java Object) that holds **all runtime state** for a single test scenario. Think of it as a "backpack" that the test carries around, putting things in and taking things out as needed.

```java
public class ClaimInfo {

    // ═══════════════════════════════════════════
    // CLAIM IDENTITY
    // ═══════════════════════════════════════════
    private String claimNumber;          // e.g., "LN-123456"
    private String referenceId;         // Internal reference
    private String claimGuid;            // Unique claim case ID
    private String userID;              // Current user ID

    // ═══════════════════════════════════════════
    // API STATE
    // ═══════════════════════════════════════════
    private String bearerToken;         // CD portal auth token
    private String bearerToken_LO;      // LO portal auth token
    private String response;            // Last API response

    // ═══════════════════════════════════════════
    // TEST CONTEXT
    // ═══════════════════════════════════════════
    private String section;             // Current UCFA section (e.g., "Assets")
    private String currentClaimant;     // Current claimant (e.g., "B1", "CB2")
    private String currentLoggenInPortal;// "CD" or "LO"
    private String journey;             // "Purchase" or "Refinance"
    private String field;               // Current field being validated

    // ═══════════════════════════════════════════
    // LOCATOR MAPS (loaded from JSON)
    // ═══════════════════════════════════════════
    private LinkedHashMap<String, LinkedHashMap<String, Object>> locatorsMap;
    private LinkedHashMap<String, LinkedHashMap<String, Object>> acordMap;
    private LinkedHashMap<String, LinkedHashMap<String, Object>> lOMap;
    private LinkedHashMap<String, LinkedHashMap<String, String>> xpathMap;
    private LinkedHashMap<String, LinkedHashMap<String, String>> ventureMap;
    private LinkedHashMap<String, LinkedHashMap<String, String>> dynamicTaskMap;

    // ═══════════════════════════════════════════
    // TASK MANAGEMENT
    // ═══════════════════════════════════════════
    private int expTaskCount = 0;
    private int addedTaskCount;
    private int addedNotificationCount;
    private String taskId;
    private boolean isDynamicTask;
    private boolean isManual;
    private String option;
    private String invokeDynamicTask;
    private LinkedHashMap<String, Integer> expTaskCountMap;
    private LinkedHashMap<String, List<String>> claimantTaskMap;
    private LinkedHashMap<String, LinkedHashMap<String, String>> borrTaskMap;

    // ═══════════════════════════════════════════
    // COMMENTS & DOCUMENTS
    // ═══════════════════════════════════════════
    private LinkedHashMap<String, LinkedHashMap<String, LinkedHashMap<String, String>>> taskCommentsMap;
    private LinkedHashMap<String, LinkedHashMap<String, LinkedHashMap<String, String>>> loTaskCommentsMap;
    private LinkedHashMap<String, String> commentCountMap;
    private LinkedHashMap<String, List<String>> claimantDocumentMap;
    private LinkedHashMap<String, LinkedHashMap<String, List<String>>> borrDocMap;
    private LinkedHashMap<String, LinkedHashMap<String, List<String>>> borrDocMapLO;

    // ═══════════════════════════════════════════
    // DATA INDEXING
    // ═══════════════════════════════════════════
    private Map<String, Object> claimantSectionDataIndexMap;
    private LinkedHashMap<String, Integer> sectionIndexMap;
    private LinkedHashMap<String, Object> expectedMap;
    private LinkedHashMap<String, LinkedHashMap<String, String>> borKeyDataMap;
    private List<String> listOfElements;
    private boolean authorizedCoClaimant = false;

    // Constructor + Getters + Setters for all 50+ fields...
}
```

### ELI20: Why One Giant ClaimInfo Object?

In a claim application, a single test might need to:
1. Create a claim via API → stores `claimNumber`, `claimGuid`
2. Log in as Claimant 1 → uses `bearerToken`
3. Fill GetStarted section → uses `locatorsMap` for field locators
4. Switch to LO portal → uses `bearerToken_LO`, `currentLoggenInPortal`
5. Add tasks → updates `taskId`, `expTaskCount`
6. Validate ACORD export → uses `acordMap`

All this state needs to travel with the test. `ClaimInfo` is the "suitcase" that holds everything. Without it, you'd need to pass 50+ parameters between methods.

---

## Chapter 8: The Map Coordinates — Externalizing UI Locators to JSON

### The Problem with Hardcoded Locators

```java
// BAD: Hardcoded XPaths scattered across Java files
page.locator("//input[@id='firstName']").fill("John");
page.locator("//input[@id='lastName']").fill("Doe");
```

If the ID changes from `firstName` to `first_name`, you'd need to find-and-replace across dozens of files.

### The Solution: JSON Locator Files

All locators live in JSON files under `src/test/resources/TestDataJsons/Locators/`:

**Assets.json** (example):
```json
{
  "Bank Account": {
    "id": {
      "Account Type": "//select[@id='accountType']",
      "Financial Institution": "//input[@id='financialInstitution']",
      "Account Number": "//input[@id='accountNumber']",
      "Cash Value": "//input[@id='cashValue']"
    },
    "ACORD": {
      "Account Type": "ASSET/ASSET_DETAIL/AssetType",
      "Financial Institution": "ASSET/ASSET_DETAIL/FinancialInstitutionName",
      "Account Number": "ASSET/ASSET_DETAIL/AssetAccountIdentifier",
      "Cash Value": "ASSET/ASSET_DETAIL/AssetCashOrMarketValueAmount"
    },
    "LO": {
      "Account Type": "//select[@data-test='lo-accountType']"
    }
  }
}
```

**How JSONUtils loads them:**
```java
public class JSONUtils {

    // Loads ALL locator JSONs into a single nested map
    public static LinkedHashMap<String, LinkedHashMap<String, Object>> buildLocatorsMap() {
        LinkedHashMap<String, LinkedHashMap<String, Object>> map = new LinkedHashMap<>();
        // Read each JSON file from Locators/ directory
        // Parse and merge into map: Section → Field → XPath
        // Result: locatorsMap.get("Bank Account").get("id").get("Account Type")
        //       → "//select[@id='accountType']"
        return map;
    }

    // Loads ACORD mapping JSON
    public static LinkedHashMap<String, LinkedHashMap<String, Object>> buildACORDMap() { ... }

    // Loads global XPath registry
    public static LinkedHashMap<String, LinkedHashMap<String, String>> buildXpathMap() { ... }
}
```

**Xpath.json** (Global screen-level XPaths):
```json
{
  "Dashboard": {
    "header": "//h1[contains(.,'Dashboard')]",
    "claimCard": "//div[@class='claim-card']",
    "startApplication": "//button[contains(.,'Start Application')]"
  },
  "UCFA": {
    "getStartedTab": "//a[contains(.,'Get Started')]",
    "assetsTab": "//a[contains(.,'Assets')]",
    "creditTab": "//a[contains(.,'Credit')]",
    "saveAndContinue": "//button[contains(.,'Save and Continue')]"
  },
  "Task": {
    "taskList": "//div[@class='task-list']",
    "addTask": "//button[contains(.,'Add Task')]"
  }
}
```

**Ventures.json** (Multi-venture URL routing):
```json
{
  "Core Portal": {
    "baseurl": "https://claims-dev.example.com",
    "baseurl_CA": "https://claims-uat.example.com",
    "CP_CORE_PORTAL_URL": "https://claims-dev.example.com",
    "CA_CORE_PORTAL_URL": "https://claims-uat.example.com"
  },
  "QA30 Core": {
    "baseurl": "https://claims-qa30.example.com",
    "baseurl_CA": "https://claims-qa30.example.com"
  },
  "Omni Claim": {
    "baseurl": "https://claims-nxt.example.com",
    "baseurl_CA": "https://lo-claims-nxt.example.com"
  }
}
```

### ELI20: Why JSON Locators?

Imagine you're building IKEA furniture. The instruction manual doesn't say "grab the 5mm Allen key" — it shows a picture with a label "Tool A". If IKEA changes the tool size, they only update the label once in the legend, not on every page.

JSON locators work the same way:
- **Feature file says**: "Fill the 'Account Type' field"
- **JSON says**: 'Account Type' → `//select[@id='accountType']`
- **If the HTML changes**: Update ONE line in the JSON, not dozens of Java files

---

## Chapter 9: The Plumbing & Power Grid — Action Utilities and Waits

### ActionUtils.java — 30+ Playwright Wrapper Actions

Every Playwright operation is wrapped in a safe, reusable method with built-in wait + error handling:

```java
public class ActionUtils {

    // ═══════ CLICK ═══════
    public static String click(Locator loc) {
        try {
            loc.waitFor(new WaitForOptions().setTimeout(60000));
            loc.click();
        } catch (Exception e) {
            Assert.fail("Unable to click on locator -> " + loc);
            return e.toString();
        }
        return "";
    }

    // ═══════ HOVER ═══════
    public static String hover(Locator loc) {
        try {
            loc.waitFor(new WaitForOptions().setTimeout(60000));
            loc.hover();
        } catch (Exception e) {
            Assert.fail("Unable to hover on locator -> " + loc);
        }
        return "";
    }

    // ═══════ TEXT INPUT ═══════
    public static void enterText(Locator loc, String text) {
        loc.waitFor(new WaitForOptions().setTimeout(60000));
        loc.fill(text);
    }

    // ═══════ GET TEXT ═══════
    public static String getText(Locator loc) {
        loc.waitFor(new WaitForOptions().setTimeout(60000));
        return loc.innerText();
    }

    // ═══════ SELECT DROPDOWN ═══════
    public void selectElement(Locator loc, String value) {
        loc.selectOption(value);
    }

    // ═══════ NAVIGATION ═══════
    public static void navigateToApplication(Page page, String url) {
        page.navigate(url);
    }

    // ═══════ WAIT FOR SPINNER ═══════
    public static void waitTimeForSpinner(Page page) {
        // Waits for loading spinner to disappear
        page.waitForSelector("[alt='Loading']",
            new Page.WaitForSelectorOptions()
                .setState(WaitForSelectorState.DETACHED)
                .setTimeout(120000));
    }

    // ═══════ SCROLL ═══════
    public static void scrollToTop(Page page) { page.evaluate("window.scrollTo(0, 0)"); }
    public static void scrollToBottom(Page page) { page.evaluate("window.scrollTo(0, document.body.scrollHeight)"); }

    // ═══════ KEYBOARD ═══════
    public static void press(Locator loc, String key) { loc.press(key); }
    public static void keyDown(Page page, String key) { page.keyboard().down(key); }
    public static void keyUp(Page page, String key) { page.keyboard().up(key); }

    // ═══════ ELEMENT STATE ═══════
    public static boolean isVisible(Locator loc) { return loc.isVisible(); }
    public static boolean isEnabled(Locator loc) { return loc.isEnabled(); }
    public static boolean isChecked(Locator loc) { return loc.isChecked(); }
}
```

### Waits.java — Intelligent Wait Strategies

```java
public class Waits {

    // Wait for page to fully load
    public static void waitForPageLoad(Page page) {
        page.waitForLoadState();
    }

    // Wait for specific element with custom timeout
    public static void optionalWaitUntilElementIsVisible(Page page, String selector, int timeout) {
        try {
            page.waitForSelector(selector,
                new Page.WaitForSelectorOptions()
                    .setState(WaitForSelectorState.VISIBLE)
                    .setTimeout(timeout));
        } catch (Exception e) {
            // Element not found within timeout — continue silently
        }
    }
}
```

### ELI20: Why Wrapper Methods?

Raw Playwright:
```java
page.locator("//button[@id='submit']").waitFor(new WaitForOptions().setTimeout(60000));
page.locator("//button[@id='submit']").click();
```

With ActionUtils:
```java
ActionUtils.click(page.locator("//button[@id='submit']"));
```

The wrapper:
1. **Always waits** before acting (no stale element errors)
2. **Logs failures** with clear messages (easier debugging)
3. **Single point of change** if wait strategy needs updating

---

## Chapter 10: Designing the Rooms — Structuring Page Objects

### What is POM?

The **Page Object Model** is a design pattern where each web page (or screen) has a corresponding Java class. The class encapsulates all interactions with that page.

### Login.java (Page Object)

```java
package pages;

public class Login {

    // ═══════ CD PORTAL LOGIN ═══════
    public void loginToApplication(String userCredentials) throws Exception {
        TestBase.getClaimInfo().setCurrentLoggenInPortal("CD");

        // Parse credentials (format: "email:password" or property key)
        String[] credentials;
        if (userCredentials.contains(":")) {
            credentials = userCredentials.split(":");
        } else {
            credentials = PropertiesUtil.getProperty(userCredentials).split(":");
        }

        String userEmail = credentials[0];
        // Support dynamic usernames (for newly created users)
        if (userEmail.contains("%uniqueName")) {
            userEmail = TestBase.getClaimInfo().getUserName();
        }
        String password = credentials.length > 1 ? credentials[1]
            : PropertiesUtil.getProperty("CPLoginCredentials_Password");

        // Fill login form using Playwright's ARIA role selectors
        BasePage.getPage().getByRole(AriaRole.TEXTBOX,
            new Page.GetByRoleOptions().setName("Email Address")).fill(userEmail);
        BasePage.getPage().getByRole(AriaRole.TEXTBOX,
            new Page.GetByRoleOptions().setName("Password")).fill(password);
        BasePage.getPage().getByRole(AriaRole.TEXTBOX,
            new Page.GetByRoleOptions().setName("Password")).press("Enter");
    }

    // ═══════ LO PORTAL LOGIN ═══════
    public void loginToLOApplication(String userCredentials) throws Exception {
        TestBase.getClaimInfo().setCurrentLoggenInPortal("LO");
        String[] credentials = PropertiesUtil.getProperty(userCredentials).split(":");
        // ... SSO login flow for Claim Adjuster portal
        BasePage.getPage().locator("//input[@type='email']").pressSequentially(userEmail);
        BasePage.getPage().locator("//input[@type='submit']").click();
    }
}
```

### Other Page Objects

| Page Class | Purpose | Key Methods |
|-----------|---------|-------------|
| **Common.java** | Shared navigation, section switching | `navigateToSection()`, `switchClaimant()`, `saveAndContinue()` |
| **UCFA.java** | UCFA form interactions (CD portal) | `fillField()`, `selectDropdown()`, `validateField()`, `navigateToUCFA()` |
| **UCFA_LO.java** | UCFA form interactions (LO portal) | Same as UCFA but for LO-specific locators |
| **TaskManagement.java** | Task CRUD operations | `addTask()`, `editTask()`, `deleteTask()`, `addComment()`, `validateTask()` |
| **Documents.java** | Document upload/download | `uploadDocument()`, `downloadDocument()`, `validateDocumentList()` |
| **Alert.java** | Alert preference management | `setAlertPreference()`, `validateAlertStatus()` |
| **ClaimApplicationAcord.java** | ACORD export validation | `exportACORD()`, `validateACORDFields()`, `compareACORDWithUI()` |
| **Acord.java** | ACORD XML comparison | `parseACORDXML()`, `compareFieldValues()` |
| **PrintPreview.java** | Print preview validation | `openPrintPreview()`, `validatePrintFields()`, `exportPDF()` |
| **FileClaimWidget.java** | Apply-now widget flow | `fillApplyNowForm()`, `selectClaimType()` |
| **EditUser.java** | User profile editing | `editUserProfile()`, `updateCredentials()` |
| **EmailValidation.java** | Email template verification | `validateEmailContent()`, `checkEmailReceipt()` |

### ELI20: Why POM?

Without POM, step definitions would contain raw Playwright calls:
```java
@When("User fills the login form")
public void fillLogin() {
    page.locator("//input[@id='email']").fill("user@test.com");
    page.locator("//input[@id='pass']").fill("password");
    page.locator("//button[@id='login']").click();
}
```

If the login page changes (new field, different selector), you'd need to update **every step definition that touches login**.

With POM, step definitions call page methods:
```java
@When("User fills the login form")
public void fillLogin() {
    loginPage.loginToApplication("user@test.com:password");
}
```

Now there's **one place to update** when the login page changes: `pages/Login.java`.

---

## Chapter 11: The Translation Layer — Step Definitions & Glue Code

### What are Step Definitions?

Step definitions are Java methods annotated with `@Given`, `@When`, `@Then`, `@And` that **map Gherkin sentences to executable code**.

### Login.java (Step Definition)

```java
package stepdefinitions;

public class Login {

    pages.Login login = new pages.Login();  // Page object instance

    // ═══════ LAUNCH APPLICATION ═══════
    @Given("^User launches the \"([^\"]*)\" application$")
    public void userLaunchesTheApplication(String applicationUrl) throws Exception {
        // Step 1: Create new browser instance
        new BasePage().launchUserDefinedBrowser();

        // Step 2: Resolve venture-specific URL
        String ventureName = TestBase.getClaimInfo().getVentureName() == null
            ? PropertiesUtil.getProperty("Venture")
            : TestBase.getClaimInfo().getVentureName();

        // Step 3: Navigate to the application
        if (applicationUrl.contains("https://")) {
            BasePage.getPage().navigate(applicationUrl);
        } else {
            // applicationUrl is a key like "CP_CORE_PORTAL_URL"
            // Resolved from Ventures.json via ventureMap
            BasePage.getPage().navigate(
                TestBase.getClaimInfo().getVentureMap().get(ventureName).get(applicationUrl));
        }
    }

    // ═══════ LOGIN TO CD PORTAL ═══════
    @And("^User logins into CD application with \"([^\"]*)\"$")
    public void userLoginsIntoTheApplicationWith(String loginCredentials) throws Exception {
        TestBase.getClaimInfo().setCurrentLoggenInPortal("CD");
        login.loginToApplication(loginCredentials);    // Delegate to page object
        Thread.sleep(3000);
        ActionUtils.waitTimeForSpinner(BasePage.getPage());
        BasePage.getPage().locator("//div[@class='claim-list-container']//h1[contains(.,'Dashboard')]").waitFor();
    }

    // ═══════ LOGIN TO LO PORTAL ═══════
    @And("^User logins into LO application with \"([^\"]*)\"$")
    public void userLoginsIntoLOTheApplicationWith(String loginCredentials) throws Exception {
        login.loginToLOApplication(loginCredentials);
        ActionUtils.waitTimeForSpinner(BasePage.getPage());
    }

    // ═══════ WAIT FOR LOADER ═══════
    @And("^User waits for the loader$")
    public void userWaitsForTheLoader() throws Exception {
        Locator loader = BasePage.getPage().locator("[alt='Loading']");
        loader.waitFor(new Locator.WaitForOptions().setState(WaitForSelectorState.DETACHED));
    }
}
```

### The Chain: Gherkin → Step Definition → Page Object

```
Feature file (English):
  Given User launches the "CP_CORE_PORTAL_URL" application
  And User logins into CD application with "CPLoginCredentials"

        ↓ Cucumber matches regex

Step Definition (Java glue):
  userLaunchesTheApplication("CP_CORE_PORTAL_URL")
    → new BasePage().launchUserDefinedBrowser()
    → page.navigate(ventureMap.get("Core Portal").get("CP_CORE_PORTAL_URL"))

  userLoginsIntoTheApplicationWith("CPLoginCredentials")
    → login.loginToApplication("CPLoginCredentials")
        ↓ delegates to

Page Object (Java):
  loginToApplication("CPLoginCredentials")
    → PropertiesUtil.getProperty("CPLoginCredentials")
    → "claimant1@example.com:ClaimPass!123"
    → page.getByRole(TEXTBOX, "Email Address").fill("claimant1@example.com")
    → page.getByRole(TEXTBOX, "Password").fill("ClaimPass!123")
    → page.getByRole(TEXTBOX, "Password").press("Enter")
```

---

## Chapter 12: Dictating the Scenarios — Writing Gherkin Features

### What are Feature Files?

Feature files are written in **Gherkin** — a structured, human-readable language. Each file describes a feature (like "Login") and contains scenarios (specific test cases).

### Structure of a Feature File

```gherkin
@UCFA @Regression
Feature: UCFA Get Started Section

  Background:
    Given User launches the "CP_CORE_PORTAL_URL" application
    And User logins into CD application with "CPLoginCredentials"

  @UCFA_V3_UI_Web_TC71
  Scenario Outline: Validate Get Started section for single claimant
    When Applicant "<Claimant>" initiates the "Get Started" section
    And Applicant provides "Personal Info" details:
      | First Name | text | John    |
      | Last Name  | text | Smith   |
      | DOB        | date | 01/15/1990 |
      | SSN        | text | 123456789  |
    And Applicant provides "Contact Info" details:
      | Email    | text | john@test.com  |
      | Phone    | text | 555-123-4567   |
    Then Applicant clicks "Save and Continue"
    And Verify claimant "<Claimant>" data is saved correctly

    Examples:
      | Claimant | AccountDetails     |
      | B1       | CPLoginCredentials |
      | B2       | B2_CPLoginCredentials |
```

### Feature File Organization (55+ files)

#### Primary Features (`src/features/`)

| Category | Files | Description |
|----------|-------|-------------|
| **UCFA** | UCFA.feature, UCFA_All_Combo.feature, UCFA_Final.feature | Full UCFA workflow scenarios |
| **Tasks** | Task.feature, TaskManagement.feature, TaskNotifications.feature, DynamicTask.feature | Task CRUD, comments, notifications |
| **JV Tasks** | Task_LOS.feature, Task_PartnerA.feature, Task_PartnerB.feature, Task_PartnerC.feature | Joint venture-specific task flows |
| **Documents** | DocManagement.feature, Doc_Managment_JV.feature | Document upload/validation |
| **ACORD** | ClaimApplicationAcord.feature, Acord.feature, AcordClaimHub.feature | ACORD 2.0 export validation |
| **Auth** | Authorization.feature, AutoSubmit.feature, DeepLink.feature, SSO.feature | Authentication & consent flows |
| **Alerts** | AlertPref.feature, Notification_IAB.feature | Alert preferences |
| **LO Portal** | LOPortal.feature, LO_Data_Validation.feature, EditUser.feature, ManageUser.feature | Claim Adjuster portal |
| **Other** | VOA.feature, ClaimCalculator.feature, ContactUs.feature | Misc features |

#### Data-Driven Features (`Data Source/`)

```
Data Source/
├── B1/                         # Claimant 1 scenarios
│   ├── B1_GetStarted_Auth.feature        # B1 authorized Get Started
│   ├── B1_GetStarted_Married.feature     # B1 married Get Started
│   ├── B1_GetStarted_UnMarried.feature   # B1 unmarried Get Started
│   ├── B1_Assets.feature                 # B1 Assets section
│   ├── B1_Credit.feature                 # B1 Credit section
│   ├── B1_Income.feature                 # B1 Income section
│   ├── B1_Real_Estate.feature            # B1 Real Estate section
│   ├── B1_Declarations.feature           # B1 Declarations (Purchase)
│   ├── B1_Declaration_Refi.feature       # B1 Declarations (Refinance)
│   ├── B1_Auth.feature                   # B1 Authorization
│   ├── CB1_GetStarted_Auth.feature       # Co-Claimant 1 authorized
│   ├── CB1_Assets.feature                # Co-Claimant 1 Assets
│   └── ... (14+ files per claimant)
├── B2/ ... B6/                 # Claimants 2-6
├── CB1/ ... CB6/               # Co-claimants (via B1/ prefix naming)
├── B1_B2_Combo/                # B1+B2 combined purchase/refi
├── B3_B4_Combo/                # B3+B4 combined
└── B5_B6_Combo/                # B5+B6 combined
```

### Tag Conventions

```gherkin
@UCFA_V3_UI_Web_TC71       # Unique test case ID
@UCFA                       # Functional area
@Smoke                      # Execution suite
@Regression                 # Full regression
@Manual                     # Manual test (excluded from automation)
@CD                         # Customer Portal portal
@LO                         # Claim Adjuster portal
@ClaimHub                    # ClaimHub-specific
@TUNG3113                   # JIRA ticket reference
@PartnerB @PartnerA @PartnerC  # Joint venture names
```

### ELI20: Why Gherkin?

Gherkin is English, not code. When a product manager reads:
```gherkin
Given User launches the "CP_CORE_PORTAL_URL" application
And User logins into CD application with "CPLoginCredentials"
When Applicant "B1" initiates the "Assets" section
Then Verify claimant "B1" data is saved correctly
```
They understand exactly what the test does. No Java knowledge needed. This bridges the gap between business requirements and automated tests.

---

## Chapter 13: The Conductor's Baton — Running Tests in Parallel

### RunnerTest.java — Sequential Execution (JUnit)

```java
package runner;

@RunWith(Cucumber.class)
@CucumberOptions(
    features = "src/features",           // Where to find feature files
    glue = {"stepdefinitions", "base"},   // Where to find step definitions + hooks
    tags = "@Task_UI_Web_TC6670",        // Which scenarios to run (by tag)
    monochrome = false,                  // Colored console output
    plugin = {
        "pretty",                        // Human-readable console output
        "listeners.CustomListener:",     // ExtentReports integration
        "json:target/cucumber.json",     // JSON report for CI/CD
        "html:target/HtmlReports/report.html"  // HTML report
    }
)
public class RunnerTest extends BasePage { }
```

**How it works:**
1. JUnit's `@RunWith(Cucumber.class)` tells JUnit to use Cucumber as the test engine
2. `features = "src/features"` tells Cucumber where to find `.feature` files
3. `glue = {"stepdefinitions", "base"}` tells Cucumber where to find `@Given/@When/@Then` methods and `@Before/@After` hooks
4. `tags = "@Task_UI_Web_TC6670"` filters to run only scenarios with this tag
5. `plugin` configures output formats (console, JSON, HTML, ExtentReports)

**Configured in testng.xml:**
```xml
<suite name="Suite" verbose="1">
    <test name="Test">
        <classes>
            <class name="runner.RunnerTest" />
        </classes>
    </test>
</suite>
```

### ParallelRunner.java — Parallel Execution (TestNG)

```java
package runner;

public class ParallelRunner extends BasePage {
    // TestNG handles parallelism via parallel-testng.xml
    // Each test thread gets its own BasePage hooks (@BeforeMethod/@AfterMethod)
}
```

**Configured in parallel-testng.xml:**
```xml
<suite name="Bayview Release 1.0" parallel="tests" thread-count="5">
    <test name="Test">
        <classes>
            <class name="runner.ParallelRunner" />
        </classes>
    </test>
</suite>
```

**Key settings:**
- `parallel="tests"` — each `<test>` block runs in its own thread
- `thread-count="5"` — up to 5 tests execute simultaneously

### Thread Safety Architecture

```
Thread 1                     Thread 2                     Thread 3
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│ tlPlaywright[1]  │         │ tlPlaywright[2]  │         │ tlPlaywright[3]  │
│ tlBrowser[1]     │         │ tlBrowser[2]     │         │ tlBrowser[3]     │
│ tlContext[1]     │         │ tlContext[2]     │         │ tlContext[3]     │
│ tlPage[1]        │         │ tlPage[2]        │         │ tlPage[3]        │
│ ClaimInfo[1]      │         │ ClaimInfo[2]      │         │ ClaimInfo[3]      │
│ ├─ claimNumber    │         │ ├─ claimNumber    │         │ ├─ claimNumber    │
│ ├─ bearerToken   │         │ ├─ bearerToken   │         │ ├─ bearerToken   │
│ └─ locatorsMap   │         │ └─ locatorsMap   │         │ └─ locatorsMap   │
└─────────────────┘         └─────────────────┘         └─────────────────┘
      ↓ isolated                  ↓ isolated                  ↓ isolated
  [Chromium #1]              [Chromium #2]              [Chromium #3]
```

### ELI20: Sequential vs Parallel

**Sequential** = One cashier at a grocery store. Each customer (test) waits in line. Safe but slow.

**Parallel (5 threads)** = Five cashiers. Five customers (tests) are served simultaneously. 5x faster but each cashier needs their own register (ThreadLocal) to avoid giving Customer A's change to Customer B.

---

## Chapter 14: The Final Chronicle — Custom Extent & PDF Reports

### CustomListener.java — The Event Recorder

```java
package listeners;

public class CustomListener extends BasePage implements ConcurrentEventListener {

    private ExtentSparkReporter spark;       // HTML report
    private ExtentPDFCucumberReporter pdfReport; // PDF report
    private ExtentReports extent;

    // Thread-safe step tracking
    public volatile static ThreadLocal<ExtentTest> step = new ThreadLocal<>();
    ThreadLocal<ExtentTest> scenario = new ThreadLocal<>();
    Map<String, ExtentTest> feature = new HashMap<>();

    // ═══════ CONSTRUCTOR: Setup reports ═══════
    public CustomListener(String args) {
        String timeStamp = BasePage.getDateAndTimeStamp();
        this.spark = new ExtentSparkReporter(
            ReportsPath + "FullReports/" + "Test_Report_" + timeStamp + ".html");
        this.pdfReport = new ExtentPDFCucumberReporter(
            new File(ReportsPath + "PDF-Reports/" + "Test_Report_" + timeStamp + ".pdf"), "");
        this.extent = new ExtentReports();
    }

    // ═══════ EVENT REGISTRATION ═══════
    @Override
    public void setEventPublisher(EventPublisher publisher) {
        publisher.registerHandlerFor(TestRunStarted.class, this::runStarted);
        publisher.registerHandlerFor(TestRunFinished.class, this::runFinished);
        publisher.registerHandlerFor(TestSourceRead.class, this::featureRead);
        publisher.registerHandlerFor(TestCaseStarted.class, this::scenarioStarted);
        publisher.registerHandlerFor(TestCaseFinished.class, this::scenarioFinished);
        publisher.registerHandlerFor(TestStepStarted.class, this::stepStarted);
        publisher.registerHandlerFor(TestStepFinished.class, event -> {
            try { stepFinished(event); } catch (Exception e) { e.printStackTrace(); }
        });
    }

    // ═══════ RUN STARTED: Configure report theme ═══════
    private void runStarted(TestRunStarted event) {
        spark.config().setTheme(Theme.STANDARD);
        spark.config().setDocumentTitle("Automation Test Report");
        spark.config().setReportName("Automation Test Report");
        spark.config().thumbnailForBase64(true);
        spark.viewConfigurer().viewOrder()
            .as(new ViewName[]{ViewName.DASHBOARD, ViewName.TEST, ViewName.CATEGORY})
            .apply();
        extent.attachReporter(spark);
        extent.attachReporter(pdfReport);
    }

    // ═══════ STEP FINISHED: Log pass/fail + screenshot ═══════
    private void stepFinished(TestStepFinished event) throws Exception {
        Result result = event.getResult();
        if (result.getStatus().toString().equals("PASSED")) {
            step.get().log(Status.PASS, "Step Passed");
        } else {
            step.get().log(Status.FAIL, result.getError());
            // Capture screenshot on failure
            if (BasePage.getPage() != null) {
                step.get().addScreenCaptureFromBase64String(getScreenshotInBase64());
            }
        }
    }

    // ═══════ SCREENSHOT CAPTURE ═══════
    private String getScreenshotInBase64() throws Exception {
        byte[] screenshot = BasePage.getPage().screenshot(
            new Page.ScreenshotOptions().setFullPage(true));
        return Base64.encodeBase64String(screenshot);
    }

    // ═══════ RUN FINISHED: Flush reports ═══════
    private void runFinished(TestRunFinished event) {
        extent.flush();  // Write reports to disk
    }
}
```

### Report Outputs

| Report Type | Location | Format | Use Case |
|-------------|----------|--------|----------|
| **Extent HTML** | `Reports/FullReports/Test_Report_<timestamp>.html` | Interactive HTML | Team review, stakeholder demos |
| **Extent PDF** | `Reports/PDF-Reports/Test_Report_<timestamp>.pdf` | Static PDF | Email attachments, audit trail |
| **Cucumber HTML** | `target/HtmlReports/report.html` | Simple HTML | Quick local review |
| **Cucumber JSON** | `target/cucumber.json` | JSON | CI/CD pipeline integration (Jenkins, Azure DevOps) |
| **Screenshots** | Embedded in HTML report (Base64) | PNG | Failure debugging |

### ELI20: How Reporting Works

The CustomListener is like a **court reporter** — it sits in the background and records everything:
1. **Test run starts** → "Session opened at 10:00 AM"
2. **Scenario starts** → "Test Case: Validate Login"
3. **Step passes** → ✅ "Given User launches the application — PASSED"
4. **Step fails** → ❌ "Then Dashboard is visible — FAILED" + 📸 screenshot
5. **Test run ends** → Writes everything to HTML + PDF files

---

## Chapter 15: Scaling to Complexity — Multi-Portal & Multi-Claimant Flows

### Multi-Venture Architecture

The framework supports multiple company portals (Core Portal, QA30, Omni Claim, etc.) through a single configuration switch.

**Flow:**
```
configurations.properties          Ventures.json
┌─────────────────────┐       ┌─────────────────────────────────┐
│ Venture=Core Portal │ ──→ │ "Core Portal": {              │
└─────────────────────┘       │   "baseurl": "https://claims-dev..." │
                              │   "baseurl_CA": "https://retail.."│
                              │   "CP_CORE_PORTAL_URL": "..."   │
                              │ }                                 │
                              │ "QA30 Core": { ... }            │
                              │ "Omni Claim": { ... }          │
                              └─────────────────────────────────┘
```

To switch from Core Portal to QA30:
```properties
# Just change this ONE line:
Venture=QA30 Core
```

All URLs, endpoints, and configurations automatically resolve to QA30's environment.

### Multi-Claimant Architecture

Claim applications can involve up to 6 claimants + 6 co-claimants. The framework handles this through:

**data.csv** — maps test cases to claimant patterns:
```csv
TestCaseID,Pattern,Sections
TC001,B1:Authorised;Married&&CB1:Unauthorised;Married&&B2:Unauthorised,GetStarted|Assets|Credit
```

**Pattern Parsing:**
- `B1:Authorised;Married` → Claimant 1, Authorized user, Married status
- `CB1:Unauthorised;Married` → Co-Claimant 1, Unauthorized, Married
- `B2:Unauthorised` → Claimant 2, Unauthorized
- `&&` separates claimants
- `;` separates attributes
- `|` separates UCFA sections to test

**Credential Resolution:**
```
B1 → configurations.properties → "B1:John Claimantfs:fsclaimant1@example.com"
     → Name: John Claimant, Email: claimant1@example.com
CB1 → "CB1:Jane CoClaimantfs:fsclaimant2@example.com"
     → Name: Jane CoClaimant, Email: claimant2@example.com
```

**ELI20**: Imagine a family of 4 applying for a claim. Each person (B1, CB1, B2, CB2) needs to fill different sections. The framework creates a "playbook" for each person, runs their sections in order, and tracks all their data separately using `currentClaimant` in `ClaimInfo`.

---

## Chapter 16: Starting the Engines — Launching Test Pipelines

### Command Reference

#### Sequential Execution
```bash
# Using Maven directly
mvn clean install -Dxml=testng

# Using Windows batch script
cd src
run.bat

# With specific tag
mvn clean install -Dxml=testng -Dcucumber.filter.tags="@UCFA_V3_UI_Web_TC71"

# Multiple tags (AND)
mvn clean install -Dxml=testng -Dcucumber.filter.tags="@Smoke and not @Manual"

# Multiple tags (OR)
mvn clean install -Dxml=testng -Dcucumber.filter.tags="@UCFA or @Task"
```

#### Parallel Execution (5 threads)
```bash
# Using Maven directly
mvn clean install -Dxml=parallel-testng

# Using Windows batch script
cd src
prun.bat
```

#### Playwright Code Generation (Record tests by browsing)
```bash
# Record against main portal
./run.sh
# Internally: mvn exec:java -Dexec.mainClass=com.microsoft.playwright.CLI \
#   -Dexec.args="codegen https://claims-qa30.example.com"

# Record email validation flows
./record.sh
# Internally: mvn exec:java -Dexec.mainClass=com.microsoft.playwright.CLI \
#   -Dexec.args="codegen https://www.example.com"
```

#### Kill Leftover Browser Processes (Windows)
```bash
cd src
k.bat
# Internally: taskkill /F /IM chrome.exe & taskkill /F /IM node.exe
```

### Execution Lifecycle

```
mvn clean install -Dxml=testng -Dcucumber.filter.tags="@Smoke"
│
├── 1. Maven resolves dependencies
├── 2. Maven compiles src/main/java and src/test/java
├── 3. Maven reads testng.xml → finds runner.RunnerTest
├── 4. JUnit @RunWith(Cucumber.class) activates Cucumber
├── 5. Cucumber scans src/features/ for @Smoke tagged scenarios
├── 6. For EACH scenario:
│   ├── @Before hook (BasePage.buildDataMaps)
│   │   ├── Reset ClaimInfo
│   │   ├── Load configurations.properties
│   │   ├── Load Ventures.json → resolve URLs
│   │   ├── Load locator JSONs → build locatorsMap
│   │   ├── Load ACORD JSONs → build acordMap
│   │   └── Load XPath JSON → build xpathMap
│   ├── Execute steps (Given → When → Then)
│   │   ├── CustomListener records each step's result
│   │   └── On failure → capture screenshot
│   └── @After hook (BasePage.assertions)
│       ├── Close Page
│       ├── Close BrowserContext
│       └── Clear temporary state
├── 7. CustomListener flushes ExtentReports (HTML + PDF)
├── 8. Cucumber generates JSON + HTML reports
└── 9. Maven build completes
```

---

## Chapter 17: Preserving the Logs — Artifact Management

### Output Artifacts After Execution

| Artifact | Path | Description |
|----------|------|-------------|
| Extent HTML Report | `Reports/FullReports/Test_Automation-HTML-Report_<timestamp>.html` | Rich interactive report with dashboard, test details, categories, screenshots |
| Extent PDF Report | `Reports/PDF-Reports/Test_Automation-PDF-Report_<timestamp>.pdf` | Printable summary |
| Cucumber HTML | `target/HtmlReports/report.html` | Lightweight feature-centric report |
| Cucumber JSON | `target/cucumber.json` | Machine-readable (for Jenkins/Azure DevOps plugins) |
| Console Output | `output.txt` | Raw console log from last execution |

### Reading the Extent HTML Report

The Extent report has three views:
1. **Dashboard** — Pie charts showing pass/fail ratios, execution time, environment info
2. **Tests** — Expandable tree: Feature → Scenario → Steps, each with PASS/FAIL/SKIP status
3. **Categories** — Tests grouped by tags (@Smoke, @UCFA, etc.)

On failure, you'll see:
- The exact step that failed
- The error message/stack trace
- A **full-page screenshot** captured at the moment of failure

---

## 18. UI-Based Framework — Full Design Analysis

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    FEATURE FILES (Gherkin)                       │
│  UCFA.feature  Task.feature  Alert.feature  DocMgmt.feature    │
└────────────────────────────┬────────────────────────────────────┘
                             │ regex matching
┌────────────────────────────▼────────────────────────────────────┐
│                  STEP DEFINITIONS (Glue Code)                   │
│  Login.java  UCFA.java  Common.java  TaskManagement.java       │
└────────────────────────────┬────────────────────────────────────┘
                             │ delegates to
┌────────────────────────────▼────────────────────────────────────┐
│                    PAGE OBJECTS (POM)                            │
│  Login.java  UCFA.java  Common.java  TaskManagement.java       │
│  Documents.java  Alert.java  Acord.java  PrintPreview.java     │
└──────────┬─────────────────┬───────────────────┬───────────────┘
           │                 │                   │
┌──────────▼──────┐ ┌───────▼──────┐ ┌──────────▼──────────────┐
│  ActionUtils    │ │  JSONUtils   │ │  WebService (API)        │
│  (click, type,  │ │  (load       │ │  (RestAssured GET/POST/  │
│   wait, scroll) │ │   locators,  │ │   PUT/PATCH/DELETE)      │
│                 │ │   xpaths)    │ │                          │
└──────────┬──────┘ └───────┬──────┘ └──────────┬──────────────┘
           │                │                   │
┌──────────▼────────────────▼───────────────────▼──────────────┐
│                      BASE LAYER                               │
│  BasePage.java (ThreadLocal Playwright lifecycle)              │
│  TestBase.java (ThreadLocal<ClaimInfo> accessor)                │
│  ClaimInfo.java (50+ field data model)                         │
│  PropertiesUtil.java (configurations.properties)               │
└──────────────────────────┬───────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────┐
│              PLAYWRIGHT ENGINE                                │
│  Chromium / Firefox / WebKit                                  │
│  BrowserContext (isolated session per test)                   │
│  Page (single tab — the "robot's hands")                     │
└──────────────────────────────────────────────────────────────┘
```

### What's BEST About This UI Framework

#### 1. ✅ ThreadLocal-Based Thread Safety
```java
public static ThreadLocal<Page> tlPage = new ThreadLocal<>();
```
**Why it's great**: Guarantees zero cross-thread interference during parallel execution. Each of the 5 parallel threads has its own browser, context, page, and test data. This is the **gold standard** for parallel test frameworks.

#### 2. ✅ JSON-Externalized Locators
```json
{ "Bank Account": { "id": { "Account Type": "//select[@id='accountType']" } } }
```
**Why it's great**: When the UI changes, you update ONE JSON file instead of hunting through dozens of Java files. This dramatically reduces maintenance time.

#### 3. ✅ Multi-Venture Support via Ventures.json
**Why it's great**: One codebase tests multiple company portals. A single property change switches environments. Zero code duplication.

#### 4. ✅ Cucumber BDD with DataTable-Driven Steps
```gherkin
And Applicant provides "Contact Info" details:
  | Email | text | john@test.com |
  | Phone | text | 555-123-4567  |
```
**Why it's great**: Test data lives in the feature file, making scenarios self-documenting. Non-technical stakeholders can write and review tests.

#### 5. ✅ Comprehensive Reporting (HTML + PDF + JSON)
**Why it's great**: Three output formats serve different audiences — HTML for teams, PDF for management, JSON for CI/CD pipelines.

#### 6. ✅ Playwright over Selenium
**Why it's great**: Auto-waits, faster execution, built-in codegen for recording tests, native screenshot/video support, lighter BrowserContext isolation.

#### 7. ✅ API + UI Hybrid Testing
**Why it's great**: Tests use APIs to set up preconditions (create claims, generate tokens) then validate via UI. This is faster and more reliable than UI-only setup.

#### 8. ✅ Custom Listener with Screenshot on Failure
**Why it's great**: Every failure automatically captures a full-page screenshot, embedded directly in the report. No manual debugging needed to understand what went wrong.

### What's WORST About This UI Framework

#### 1. ❌ Static Mutable State in BasePage
```java
public static LinkedHashMap<String, LinkedHashMap<String, Object>> locatorsMap = new LinkedHashMap<>();
```
**Problem**: `locatorsMap`, `acordMap`, and `lOMap` are `static` fields, not `ThreadLocal`. In parallel execution, if Thread 1 writes to `locatorsMap` while Thread 2 reads it, you get race conditions or corrupted data.

**Fix**: Make these `ThreadLocal` or store them only inside `ClaimInfo` (which is already ThreadLocal).

#### 2. ❌ Thread.sleep() Usage
```java
Thread.sleep(3000);  // In Login step definition
Thread.sleep(5000);  // In LO login
```
**Problem**: `Thread.sleep()` is the **worst practice** in test automation. It wastes time (always waits the full duration even if the page is ready) and is flaky (may not wait long enough on slow environments).

**Fix**: Replace with Playwright's built-in waits:
```java
page.waitForSelector("//div[@class='dashboard']", new WaitForSelectorOptions().setTimeout(30000));
```

#### 3. ❌ Version Mismatches in pom.xml
```xml
<artifactId>cucumber-java</artifactId><version>7.2.2</version>
<artifactId>cucumber-junit</artifactId><version>7.11.2</version>
```
**Problem**: `cucumber-java` (7.2.2) and `cucumber-junit` (7.11.2) are different versions. This can cause subtle runtime errors, missing methods, or class conflicts.

**Fix**: Use the same version for all Cucumber dependencies:
```xml
<cucumber.version>7.11.2</cucumber.version>
```

#### 4. ❌ Duplicate Dependencies
```xml
<!-- jackson-databind appears TWICE -->
<dependency><artifactId>jackson-databind</artifactId><version>2.13.4.2</version></dependency>
<dependency><artifactId>jackson-databind</artifactId><version>2.13.4.2</version></dependency>

<!-- extentreports-cucumber7-adapter appears TWICE -->
<dependency><artifactId>extentreports-cucumber7-adapter</artifactId><version>1.9.2</version></dependency>
<dependency><artifactId>extentreports-cucumber7-adapter</artifactId><version>1.9.2</version></dependency>

<!-- Also has extentreports-cucumber4-adapter (old Cucumber 4) alongside cucumber7 adapter -->
```
**Problem**: Duplicate entries cause confusion. The Cucumber 4 adapter conflicts with the Cucumber 7 adapter.

**Fix**: Remove duplicates, remove the `cucumber4-adapter`.

#### 5. ❌ Outdated Library Versions
```xml
<artifactId>rest-assured</artifactId><version>3.2.0</version>          <!-- Latest: 5.x -->
<artifactId>poi-ooxml</artifactId><version>3.10-FINAL</version>       <!-- Latest: 5.x -->
<artifactId>opencsv</artifactId><version>2.3</version>                <!-- Latest: 5.x -->
```
**Problem**: Old versions have known vulnerabilities (CVEs), missing features, and poor performance. RestAssured 3.x is significantly behind 5.x.

#### 6. ❌ Hardcoded Timeout Values
```java
getBrowserContext().setDefaultTimeout(160000);  // 2.6 minutes
loc.waitFor(new WaitForOptions().setTimeout(60000));  // 1 minute everywhere
```
**Problem**: Timeouts should be configurable via properties, not hardcoded. Different environments (local vs CI) need different timeouts.

#### 7. ❌ Password Logging
```java
System.out.println("Cred>>" + userCredentials);  // Prints credentials to console
System.out.println("Payload????" + payload);      // May print sensitive API payloads
```
**Problem**: Credentials in logs are a **security vulnerability** (OWASP A07:2021 — Identification and Authentication Failures).

**Fix**: Never log credentials. Mask them:
```java
System.out.println("Cred>>" + userEmail + ":****");
```

#### 8. ❌ No Retry Mechanism for Flaky Tests
**Problem**: No `@Retry` annotation or retry plugin configured. If a test fails due to a transient network issue, it stays failed. In real-world UI testing, 5-10% of failures are transient.

#### 9. ❌ Exception Handling via Assert.fail()
```java
catch (Exception e) {
    Assert.fail("Unable to click on locator ->" + loc + "----Exception>>" + e.toString());
    return e.toString();  // Dead code — Assert.fail() throws
}
```
**Problem**: `Assert.fail()` throws an exception, so `return e.toString()` is unreachable. This pattern exists throughout `ActionUtils`.

#### 10. ❌ Multiple Playwright.create() Calls
```java
tlPlaywright.set(Playwright.create());
// Then inside switch:
tlBrowser.set(Playwright.create().firefox().launch(...));  // Another Playwright.create()!
```
**Problem**: Creates 2+ Playwright instances per test. The first one is stored in ThreadLocal but the switch cases create new ones. The stored one is never used and leaks resources.

---

## 19. API (RestAssured) Framework — Full Design Analysis

### Architecture

```
┌──────────────────────────────────────────────────┐
│              STEP DEFINITIONS                     │
│  Common.java, WebService.java (pages)             │
│  "Initiate a fullClaim claim via API"        │
│  "Get auth token for LO User"                    │
│  "Update the preference for claimant"             │
└───────────────────────┬──────────────────────────┘
                        │ calls
┌───────────────────────▼──────────────────────────┐
│          pages/WebService.java                    │
│  Builds headers, payloads, query params           │
│  Reads endpoints from configurations.properties   │
│  Delegates to utils/api/WebService                │
└───────────────────────┬──────────────────────────┘
                        │ delegates
┌───────────────────────▼──────────────────────────┐
│          utils/api/WebService.java                │
│  performAPIAction(action, url, headers, payload,  │
│                   credentials, queryMap, status)   │
│  ┌─────────────────────────────────────────┐     │
│  │ switch(action):                          │     │
│  │   GET  → RestAssured.given().headers()   │     │
│  │          .get(url)                       │     │
│  │   POST → RestAssured.given().headers()   │     │
│  │          .body(payload).post(url)        │     │
│  │   PUT  → RestAssured.given().headers()   │     │
│  │          .body(payload).put(url)         │     │
│  │   PATCH→ RestAssured.given().headers()   │     │
│  │          .body(payload).patch(url)       │     │
│  │   DELETE→ RestAssured.given().headers()  │     │
│  │          .body(payload).delete(url)      │     │
│  └─────────────────────────────────────────┘     │
│  validateStatusCode(expected, actual)             │
└──────────────────────────────────────────────────┘
```

### WebService.java — The RestAssured Wrapper

```java
public class WebService {

    public static Response performAPIAction(
            String action,              // "GET", "POST", "PUT", "PATCH", "DELETE"
            String endpointURL,         // Full URL
            HashMap<String, String> he, // Headers (Content-Type, Authorization, etc.)
            String payload,             // JSON request body
            HashMap<String, String> credentials,  // Username/password for auth
            HashMap<String, String> queryMap,      // Query parameters
            int expectedStatusCode      // Expected HTTP status (200, 201, etc.)
    ) throws Exception {

        Response re1 = null;
        switch (action.toLowerCase()) {
            case "get":
                re1 = RestAssured.given().headers(he).when().get(endpointURL);
                validateStatusCode(expectedStatusCode, re1.getStatusCode());
                break;

            case "post":
                if (credentials == null && queryMap == null) {
                    re1 = performPostRequest(endpointURL, he, payload);
                } else if (credentials == null) {
                    re1 = performPostRequest(endpointURL, he, payload, queryMap);
                } else {
                    re1 = performPostRequest(endpointURL, credentials, he, queryMap);
                }
                validateStatusCode(expectedStatusCode, re1.getStatusCode());
                break;

            case "put":
                re1 = RestAssured.given().headers(he).body(payload).when().put(endpointURL);
                validateStatusCode(expectedStatusCode, re1.getStatusCode());
                break;

            case "patch":
                re1 = RestAssured.given().urlEncodingEnabled(false)
                    .headers(he).body(payload).when().patch(endpointURL);
                validateStatusCode(expectedStatusCode, re1.getStatusCode());
                break;

            case "delete":
                re1 = RestAssured.given().headers(he).body(payload)
                    .when().delete(endpointURL);
                validateStatusCode(expectedStatusCode, re1.getStatusCode());
                break;
        }
        return re1;
    }
}
```

### API Usage in Test Scenarios

The API layer is used primarily for **test data setup** — not for API-only testing:

```gherkin
# Feature file
Given Initiate a "fullClaim" claim
And Get auth token for "LO" User "CA_Name"
And Switch to "LO" portal
And Set Dynamic Task level to "Option 0"
And Update the preference for claimant "B1":
  | Email | true |
  | Text  | true |
```

These steps call REST APIs to:
1. Create a claim application in the backend
2. Generate OAuth bearer tokens
3. Configure task settings
4. Set claimant notification preferences

Then the test switches to UI validation:
```gherkin
Given User launches the "CP_CORE_PORTAL_URL" application
And User logins into CD application with "CPLoginCredentials"
# ... UI validation continues
```

### What's BEST About the API Layer

#### 1. ✅ Single Entry Point (`performAPIAction`)
All HTTP methods go through one method. Easy to add logging, retry logic, or response validation in one place.

#### 2. ✅ Status Code Validation
```java
validateStatusCode(expectedStatusCode, re1.getStatusCode());
```
Every API call validates the response code, failing fast on unexpected responses.

#### 3. ✅ Flexible POST Overloads
Three `performPostRequest` variants handle different auth patterns (form-encoded credentials, query params, body payload).

#### 4. ✅ API + UI Hybrid Pattern
Using APIs for setup and UI for validation is the **ideal pattern** — fast setup, thorough validation.

### What's WORST About the API Layer

#### 1. ❌ No Response Logging/Capture
```java
System.out.println("response status code:" + re1.getStatusCode());
```
Only status code is logged, not the response body. When an API fails, you can't debug without the response content.

**Fix**: Log response body on failure:
```java
if (re1.getStatusCode() != expectedStatusCode) {
    System.out.println("Response body: " + re1.getBody().asString());
}
```

#### 2. ❌ No Request/Response Specification
RestAssured supports `RequestSpecification` and `ResponseSpecification` for reusable configs (base URI, content type, auth). This framework rebuilds headers/URLs from scratch every time.

**Fix**:
```java
RequestSpecification spec = RestAssured.given()
    .baseUri("https://claims-dev.example.com")
    .contentType(ContentType.JSON)
    .header("Authorization", "Bearer " + token);
```

#### 3. ❌ No Retry on Transient Failures
API calls to external services can fail due to network issues, rate limiting, or cold starts. No retry logic exists.

**Fix**: Add retry with exponential backoff:
```java
for (int attempt = 0; attempt < 3; attempt++) {
    re1 = RestAssured.given()...;
    if (re1.getStatusCode() == expectedStatusCode) break;
    Thread.sleep(1000 * (attempt + 1));
}
```

#### 4. ❌ `RestAssured.reset()` Called in Post Methods
```java
private static Response performPostRequest(...) {
    RestAssured.reset();  // Clears ALL RestAssured config including base URI
    return RestAssured.given().headers(headersMap).body(payload).post(endPointURL);
}
```
**Problem**: `RestAssured.reset()` clears global RestAssured configuration. In parallel execution, Thread 1's reset could clear Thread 2's configuration.

**Fix**: Don't use static RestAssured config. Use `RequestSpecification` instances instead.

#### 5. ❌ No Response Deserialization
Responses are returned as raw `Response` objects. Callers must manually parse JSON.

**Fix**: Use typed deserialization:
```java
ClaimResponse claim = response.as(ClaimResponse.class);
```

#### 6. ❌ Credentials in Debug Output
```java
System.out.println("HeaderMap>>>" + headersMap);  // May contain Authorization header
System.out.println("Payload????" + payload);       // May contain sensitive data
```
**Security risk**: Auth tokens and credentials should never appear in logs.

---

## 20. Best Practices Implemented

| # | Practice | Implementation |
|---|----------|---------------|
| 1 | **Thread Safety** | `ThreadLocal` for Page, Browser, BrowserContext, Playwright, ClaimInfo |
| 2 | **Page Object Model** | Separate `pages/` package with one class per screen |
| 3 | **BDD with Cucumber** | Feature files in Gherkin, step definitions as glue |
| 4 | **Externalized Configuration** | `configurations.properties`, `Ventures.json`, locator JSONs |
| 5 | **No Hardcoded Locators** | All XPaths/CSS in JSON files |
| 6 | **Multiple Report Formats** | Extent HTML, Extent PDF, Cucumber HTML, Cucumber JSON |
| 7 | **Screenshot on Failure** | `CustomListener` captures full-page screenshots |
| 8 | **API + UI Hybrid** | RestAssured for setup, Playwright for validation |
| 9 | **Multi-Venture Support** | Single codebase, configurable portal URLs |
| 10 | **Parallel Execution** | TestNG `parallel="tests"` with `thread-count="5"` |
| 11 | **Tag-Based Filtering** | `@Smoke`, `@Regression`, `@UCFA`, etc. |
| 12 | **Playwright Auto-Waits** | Built-in wait mechanisms in ActionUtils |
| 13 | **Data-Driven Testing** | Scenario Outlines with Examples tables, DataTables |
| 14 | **Isolated BrowserContexts** | Each test gets its own context (cookies, storage, cache isolated) |
| 15 | **Codegen Support** | `run.sh`/`record.sh` for recording new tests |

---

## 21. Worst Practices & Anti-Patterns Found

| # | Anti-Pattern | Location | Impact | Severity |
|---|-------------|----------|--------|----------|
| 1 | `Thread.sleep()` | `stepdefinitions/Login.java` | Slow, flaky tests | 🔴 High |
| 2 | Static mutable locator maps | `BasePage.java` | Race conditions in parallel | 🔴 High |
| 3 | Password logging | `pages/Login.java`, `WebService.java` | Security vulnerability | 🔴 High |
| 4 | Version mismatches | `pom.xml` (cucumber-java vs cucumber-junit) | Runtime errors | 🟡 Medium |
| 5 | Duplicate dependencies | `pom.xml` (jackson-databind, extent adapter) | Confusion | 🟡 Medium |
| 6 | Outdated libraries | RestAssured 3.x, POI 3.x, OpenCSV 2.x | CVEs, missing features | 🟡 Medium |
| 7 | Multiple `Playwright.create()` | `BasePage.createPlaywrightPageInstance()` | Resource leak | 🟡 Medium |
| 8 | Hardcoded timeouts | ActionUtils, BasePage | Inflexible across environments | 🟡 Medium |
| 9 | No retry mechanism | Entire framework | Flaky test failures | 🟡 Medium |
| 10 | Dead code after `Assert.fail()` | `ActionUtils.java` | Confusing, unreachable code | 🟢 Low |
| 11 | `RestAssured.reset()` in parallel | `WebService.java` | Thread-unsafe global state | 🔴 High |
| 12 | No CI/CD pipeline config | Root directory | Manual execution only | 🟡 Medium |
| 13 | Deprecated cucumber4 adapter | `pom.xml` | Conflicts with cucumber7 | 🟡 Medium |
| 14 | `fs:fs` custom separators | `configurations.properties` | Fragile parsing, hard to read | 🟢 Low |
| 15 | No environment-based profiles | `pom.xml` / `configurations.properties` | Manual config switching | 🟡 Medium |

---

## 22. Optimization Recommendations

### Priority 1: Critical Fixes

#### 1.1 Eliminate Thread.sleep()
```java
// BEFORE (bad)
Thread.sleep(3000);
ActionUtils.waitTimeForSpinner(BasePage.getPage());

// AFTER (good)
ActionUtils.waitTimeForSpinner(BasePage.getPage());
BasePage.getPage().locator("//div[@class='claim-list-container']//h1[contains(.,'Dashboard')]")
    .waitFor(new Locator.WaitForOptions().setTimeout(30000));
```

#### 1.2 Make Locator Maps ThreadLocal or Instance-Based
```java
// BEFORE (static, shared, dangerous)
public static LinkedHashMap<String, LinkedHashMap<String, Object>> locatorsMap;

// AFTER (stored only in ThreadLocal ClaimInfo)
// Remove static fields, use only:
TestBase.getClaimInfo().getLocatorsMap();
```

#### 1.3 Remove Credential Logging
```java
// BEFORE (security risk)
System.out.println("Cred>>" + userCredentials);

// AFTER (safe)
// Remove the line entirely, or:
Loggers.info("Attempting login for user: " + userEmail.substring(0, 3) + "***");
```

### Priority 2: Dependency Cleanup

#### 2.1 Align Cucumber Versions
```xml
<properties>
    <cucumber.version>7.11.2</cucumber.version>
</properties>

<dependency>
    <groupId>io.cucumber</groupId>
    <artifactId>cucumber-java</artifactId>
    <version>${cucumber.version}</version>
</dependency>
<dependency>
    <groupId>io.cucumber</groupId>
    <artifactId>cucumber-junit</artifactId>
    <version>${cucumber.version}</version>
</dependency>
```

#### 2.2 Remove Duplicates & Outdated Adapters
```xml
<!-- REMOVE these: -->
<!-- Duplicate jackson-databind -->
<!-- Duplicate extentreports-cucumber7-adapter -->
<!-- extentreports-cucumber4-adapter (conflicts with cucumber7) -->
```

#### 2.3 Upgrade Libraries
```xml
<!-- Upgrade RestAssured: 3.2.0 → 5.4.0 -->
<artifactId>rest-assured</artifactId>
<version>5.4.0</version>

<!-- Upgrade Apache POI: 3.10-FINAL → 5.2.5 -->
<artifactId>poi-ooxml</artifactId>
<version>5.2.5</version>

<!-- Upgrade OpenCSV: 2.3 → 5.9 -->
<artifactId>opencsv</artifactId>
<version>5.9</version>
```

### Priority 3: Architecture Improvements

#### 3.1 Add Retry Mechanism
```xml
<!-- pom.xml -->
<dependency>
    <groupId>io.cucumber</groupId>
    <artifactId>cucumber-testng</artifactId>
    <version>${cucumber.version}</version>
</dependency>
```
```java
// Or use TestNG's built-in retry:
@Test(retryAnalyzer = RetryAnalyzer.class)
```

#### 3.2 Add Maven Profiles for Environments
```xml
<profiles>
    <profile>
        <id>dev</id>
        <properties>
            <env>DEV</env>
            <config.file>dev-configurations.properties</config.file>
        </properties>
    </profile>
    <profile>
        <id>qa</id>
        <properties>
            <env>QA</env>
            <config.file>qa-configurations.properties</config.file>
        </properties>
    </profile>
</profiles>
```
Usage: `mvn clean install -Pqa -Dxml=testng`

#### 3.3 Add CI/CD Pipeline (Azure DevOps / GitHub Actions)
```yaml
# .github/workflows/test.yml
name: UI Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '11'
          distribution: 'temurin'
      - run: mvn clean install -DskipTests
      - run: mvn exec:java -Dexec.mainClass=com.microsoft.playwright.CLI -Dexec.args="install --with-deps"
      - run: mvn clean test -Dxml=testng -Dcucumber.filter.tags="@Smoke"
      - uses: actions/upload-artifact@v4
        with:
          name: test-reports
          path: Reports/
```

#### 3.4 Configurable Timeouts
```properties
# configurations.properties
default.timeout=60000
spinner.timeout=120000
page.load.timeout=30000
```
```java
// ActionUtils.java
int timeout = Integer.parseInt(PropertiesUtil.getProperty("default.timeout"));
loc.waitFor(new WaitForOptions().setTimeout(timeout));
```

#### 3.5 Fix Playwright Resource Leak
```java
// BEFORE (creates 2 Playwright instances)
tlPlaywright.set(Playwright.create());
tlBrowser.set(Playwright.create().firefox().launch(...));

// AFTER (uses single instance)
Playwright pw = Playwright.create();
tlPlaywright.set(pw);
switch (browserType) {
    case "firefox":
        tlBrowser.set(pw.firefox().launch(new LaunchOptions().setHeadless(headless)));
        break;
    case "chromium":
        tlBrowser.set(pw.chromium().launch(new LaunchOptions().setHeadless(headless)));
        break;
    // ...
}
```

#### 3.6 Add RequestSpecification for API Layer
```java
// Create reusable API spec
public static RequestSpecification getBaseSpec(String baseUrl, String token) {
    return RestAssured.given()
        .baseUri(baseUrl)
        .contentType(ContentType.JSON)
        .header("Authorization", "Bearer " + token)
        .filter(new RequestLoggingFilter())
        .filter(new ResponseLoggingFilter());
}

// Usage
Response response = getBaseSpec(BASE_URL, token)
    .body(payload)
    .post("/api/task");
```

---

## 23. Troubleshooting Guide

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|---------|
| `PlaywrightException: Browser not found` | Playwright browsers not installed | Run `mvn exec:java -Dexec.mainClass=com.microsoft.playwright.CLI -Dexec.args="install"` |
| `NullPointerException` in `ventureMap` | Venture name in properties doesn't match Ventures.json | Verify `Venture=` value exists as a key in `Ventures.json` |
| Tests pass locally but fail in CI | Headless mode not enabled | Set `headless=true` in `configurations.properties` |
| Parallel tests fail intermittently | Static mutable state in `BasePage` | Move `locatorsMap`/`acordMap`/`lOMap` to ThreadLocal or ClaimInfo only |
| `SocketTimeoutException` in API calls | Network issues, slow environment | Add retry logic to `WebService.performAPIAction()` |
| EmailService inbox empty | Public inboxes, messages evicted quickly | Use dedicated test email service or YopMail |
| `CucumberException: duplicate step` | Same regex in multiple step definition files | Ensure step regexes are unique across all step def classes |
| Report shows 0 tests | Tag mismatch | Verify `-Dcucumber.filter.tags` matches tags in feature files |
| Browser opens but navigates nowhere | URL key not found in Ventures.json | Check that `CP_CORE_PORTAL_URL` key exists for the selected venture |
| `OutOfMemoryError` during parallel run | Too many browser instances | Reduce `thread-count` in `parallel-testng.xml` or increase JVM heap: `mvn -Xmx4g ...` |

### Debugging Tips

1. **Enable Playwright traces**: 
   ```java
   context.tracing().start(new Tracing.StartOptions().setScreenshots(true).setSnapshots(true));
   // ... test runs ...
   context.tracing().stop(new Tracing.StopOptions().setPath(Paths.get("trace.zip")));
   ```
   Then view: `mvn exec:java -Dexec.mainClass=com.microsoft.playwright.CLI -Dexec.args="show-trace trace.zip"`

2. **Record video of test execution**:
   ```java
   context = browser.newContext(new Browser.NewContextOptions()
       .setRecordVideoDir(Paths.get("videos/"))
       .setRecordVideoSize(1280, 720));
   ```

3. **Slow down execution for debugging**:
   ```java
   browser = playwright.chromium().launch(new LaunchOptions()
       .setHeadless(false)
       .setSlowMo(500));  // 500ms delay between each action
   ```

---

## Summary

This framework is a **solid, production-grade BDD test automation solution** that demonstrates several enterprise-level design decisions:

**Strengths**: ThreadLocal thread safety, JSON-driven locators, multi-venture support, comprehensive reporting, Playwright's modern browser automation, API+UI hybrid testing, BDD readability.

**Weaknesses**: Thread.sleep usage, static mutable state, dependency version mismatches, credential logging, no retry mechanism, resource leaks, outdated libraries.

**Overall Assessment**: The framework's architecture is sound — the core patterns (ThreadLocal, POM, JSON locators, Cucumber BDD) are industry best practices. The weaknesses are implementation-level issues that can be fixed without architectural changes. With the optimizations listed in Section 22, this framework would be among the top-tier enterprise test automation solutions.

