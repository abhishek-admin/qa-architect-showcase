/**
 * QA Automation Framework Showcase Controller
 * Programmed programmatically to prevent Chrome CSP event-handler violations.
 */

// Global folder directory structure database (What & How, Execution Flow, Dependency Learnings, Code Skeletons)
const nodeDatabase = {
  pom_xml: {
    title: "pom.xml",
    path: "pom.xml",
    category: "Maven Dependency & Build Descriptor",
    whatHow: "Acts as the declarative manifest for Maven builds. It defines the project's object model (POM), compiler targets (Java 17), external dependencies, build profiles, and pipeline plugin steps.",
    flow: "Evaluated during initial Maven execution triggers (e.g., mvn test), packaging compile phases, and dependency tree resolutions in continuous integration pipelines.",
    learnings: "Orchestrates framework integrations (Playwright, Cucumber-Java, Cucumber-TestNG, RestAssured, Lombok, and Owner library). Gotcha: AspectJ weaver compiler configurations must be set up correctly to ensure Allure annotation listener injections capture metadata properly.",
    code: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.enterprise</groupId>
    <artifactId>qa-playwright-framework</artifactId>
    <version>2.0.0</version>
    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <playwright.version>1.44.0</playwright.version>
    </properties>
    <!-- Dependencies defined dynamically -->
</project>`
  },
  src_folder: {
    title: "src",
    path: "src/",
    category: "Project Root Source Package",
    whatHow: "The universal root containing both source-code modules ('main') and automated testing specs and descriptors ('test').",
    flow: "Initial build scanners pull this directory to isolate compiled binaries from resource folders.",
    learnings: "Organizing production framework utilities completely separate from testing scripts prevents packaging pollution during framework builds.",
    code: `src/
├── main/
│   └── java/com/enterprise/framework/
└── test/
    └── resources/features/`
  },
  main_folder: {
    title: "main",
    path: "src/main/",
    category: "Framework Engine Directory",
    whatHow: "The home directory for all operational classes, base structures, config wrappers, and reporting models that drive the framework.",
    flow: "Pre-compiled into binaries and bundled during framework imports or package distribution phases.",
    learnings: "Ensuring zero test scenarios live in the main directory allows it to be bundled as an importable JAR utility for multiple teams.",
    code: `src/main/
└── java/
    └── com/
        └── enterprise/
            └── framework/`
  },
  main_java_folder: {
    title: "java",
    path: "src/main/java/",
    category: "Java Source Directory",
    whatHow: "Standard Maven directory structure housing clean Java source code packages and core automation engineering logic.",
    flow: "Targeted by the Java compiler during compiler execution phases.",
    learnings: "Provides namespace separation, mapping package scopes neatly to file directories.",
    code: `package com.enterprise.framework;`
  },
  package_folder: {
    title: "com.enterprise.framework",
    path: "src/main/java/com/enterprise/framework/",
    category: "Core Package Namespace",
    whatHow: "Main namespace for the enterprise framework. Organizes structural areas into subpackages: driver, pages, steps, config, and utils.",
    flow: "Tethered to the application runtime environment and modular framework imports.",
    learnings: "Keeping a unified namespace enforces design consistency and simplifies library scans.",
    code: `package com.enterprise.framework;`
  },
  config_folder: {
    title: "config",
    path: "src/main/java/com/enterprise/framework/config/",
    category: "Configuration Directory",
    whatHow: "Aggregates structural settings interfaces and dynamic factories that translate configuration properties to type-safe Java wrappers.",
    flow: "Invoked at the earliest bootstrap stage before browser contexts or page instances spin up.",
    learnings: "Consolidating parameter managers eliminates scattered and error-prone standard properties loading loops.",
    code: `package com.enterprise.framework.config;`
  },
  framework_config: {
    title: "FrameworkConfig.java",
    path: "src/main/java/com/enterprise/framework/config/FrameworkConfig.java",
    category: "Configuration Interface",
    whatHow: "Leverages the Aeon Owner library to map key string values directly to strongly typed Java return values (Boolean, Int, String) using Java annotations.",
    flow: "Invoked by config factories during framework bootstrapping to parse active parameter maps.",
    learnings: "Replaces boilerplate Properties.load() logic. Gotcha: dynamic overrides can be set using system variables or terminal properties parameter inputs directly.",
    code: `package com.enterprise.framework.config;

import org.aeonbits.owner.Config;

@Config.Sources({
    "system:properties",
    "classpath:\${env}.properties"
})
public interface FrameworkConfig extends Config {
    @Key("browser")
    @DefaultValue("chrome")
    String browser();

    @Key("headless")
    @DefaultValue("true")
    boolean headless();
}`
  },
  config_factory: {
    title: "ConfigFactory.java",
    path: "src/main/java/com/enterprise/framework/config/ConfigFactory.java",
    category: "Configuration Factory",
    whatHow: "Implements a static factory lookup that scans runtime parameters to load correct staging, dev, or production settings files dynamically.",
    flow: "Runs first in suite loading phases, initializing values to static caches.",
    learnings: "Allows safe execution transitions across multi-region clusters by shifting environment parameters dynamically.",
    code: `package com.enterprise.framework.config;

import org.aeonbits.owner.ConfigFactory;

public final class ConfigFactory {
    private ConfigFactory() {}

    public static FrameworkConfig getConfig() {
        String env = System.getProperty("env", "staging");
        System.setProperty("env", env);
        return ConfigFactory.create(FrameworkConfig.class);
    }
}`
  },
  driver_folder: {
    title: "driver",
    path: "src/main/java/com/enterprise/framework/driver/",
    category: "Playwright Driver Layer",
    whatHow: "Houses drivers and ThreadLocal controllers to orchestrate browser spin-ups and sandboxed driver operations.",
    flow: "Manages session lifetimes, instantiating in @Before test runs and wiping references on test completion.",
    learnings: "Isolating web driver interactions strictly inside a dedicated package prevents thread-safety bugs across the wider suite code.",
    code: `package com.enterprise.framework.driver;`
  },
  driver_manager: {
    title: "DriverManager.java",
    path: "src/main/java/com/enterprise/framework/driver/DriverManager.java",
    category: "Thread-Safe Driver Manager",
    whatHow: "Encapsulates isolated ThreadLocal instances of Playwright's Page, BrowserContext, and Playwright interfaces, ensuring parallel thread-safety.",
    flow: "Active from driver creation hooks through UI interactions to final page destruction lifecycles.",
    learnings: "Critical for TestNG concurrent runs. Gotcha: always call threadLocal.remove() inside teardowns to avoid ThreadLocal memory leaks in continuous executors.",
    code: `package com.enterprise.framework.driver;

import com.microsoft.playwright.Page;

public final class DriverManager {
    private static final ThreadLocal<Page> PAGE = new ThreadLocal<>();

    public static Page getPage() { return PAGE.get(); }
    public static void setPage(Page page) { PAGE.set(page); }
    public static void unload() { PAGE.remove(); }
}`
  },
  playwright_factory: {
    title: "PlaywrightDriverFactory.java",
    path: "src/main/java/com/enterprise/framework/driver/PlaywrightDriverFactory.java",
    category: "Browser Factory Engine",
    whatHow: "Instantiates Playwright browser engines (Chromium, Firefox, WebKit) dynamically based on config settings and custom viewport specifications.",
    flow: "Invoked inside @Before hooks, generating browser context and page objects securely.",
    learnings: "Enables unified execution across local headless browsers and cloud selenium grids using single configuration parameters.",
    code: `package com.enterprise.framework.driver;

import com.microsoft.playwright.*;
import com.enterprise.framework.config.ConfigFactory;

public final class PlaywrightDriverFactory {
    public static Page createInstance() {
        Playwright playwright = Playwright.create();
        BrowserType browserType = playwright.chromium();
        Browser browser = browserType.launch(new BrowserType.LaunchOptions()
            .setHeadless(ConfigFactory.getConfig().headless()));
        return browser.newPage();
    }
}`
  },
  pages_folder: {
    title: "pages",
    path: "src/main/java/com/enterprise/framework/pages/",
    category: "Page Object Directory",
    whatHow: "Houses the Page Object Model (POM) layer where web selectors and atomic UI click or inputs methods reside.",
    flow: "Called directly within test steps to locate pages, inputs, grids, and dialog elements.",
    learnings: "Decouples locators completely from scenario steps, avoiding framework breakage when backend visual markup changes.",
    code: `package com.enterprise.framework.pages;`
  },
  base_page: {
    title: "BasePage.java",
    path: "src/main/java/com/enterprise/framework/pages/BasePage.java",
    category: "Abstract Base Page",
    whatHow: "Centralized parent page housing robust locator wrappers, custom element synchronization waiters, and screenshot capture tools.",
    flow: "Serves as the operational engine supporting all dedicated Page classes.",
    learnings: "Directly uses Playwright locator objects rather than obsolete Selenium element calls, ensuring automatic synchronization waiting.",
    code: `package com.enterprise.framework.pages;

import com.microsoft.playwright.Page;
import com.enterprise.framework.driver.DriverManager;

public abstract class BasePage {
    protected Page page;

    protected BasePage() {
        this.page = DriverManager.getPage();
    }

    protected void click(String selector) {
        page.click(selector);
    }
}`
  },
  login_page: {
    title: "LoginPage.java",
    path: "src/main/java/com/enterprise/framework/pages/LoginPage.java",
    category: "Login Page Module",
    whatHow: "Encapsulates auth locator paths (username inputs, dynamic passwords, submit buttons) and exposes standard workflows.",
    flow: "Navigated in early test workflows during auth procedures.",
    learnings: "Keeps assertions strictly outside Page Objects to prevent cross-contamination of logic. POM should purely describe pages.",
    code: `package com.enterprise.framework.pages;

public class LoginPage extends BasePage {
    private final String txtUser = "#username";
    private final String txtPass = "#password";
    private final String btnLogin = "button.submit";

    public void login(String user, String pass) {
        page.fill(txtUser, user);
        page.fill(txtPass, pass);
        click(btnLogin);
    }
}`
  },
  steps_folder: {
    title: "steps",
    path: "src/main/java/com/enterprise/framework/steps/",
    category: "BDD Binding Steps Directory",
    whatHow: "Aggregates BDD Cucumber Step Definitions and test Hooks capturing the execution flow.",
    flow: "Parses Gherkin steps, mapping actions directly to Java page method calls.",
    learnings: "Enables transparent BDD scenarios that are easily readable by business analysts.",
    code: `package com.enterprise.framework.steps;`
  },
  hooks: {
    title: "Hooks.java",
    path: "src/main/java/com/enterprise/framework/steps/Hooks.java",
    category: "Cucumber Hooks Engine",
    whatHow: "Manages scenario lifecycles using @Before and @After annotations. Sets up driver pages and handles errors.",
    flow: "Runs before and after every individual BDD scenario execution thread.",
    learnings: "Leverages Playwright context recordings and captures dynamic screenshots on failure, attaching files directly to Allure pipelines.",
    code: `package com.enterprise.framework.steps;

import io.cucumber.java.*;
import com.enterprise.framework.driver.*;

public final class Hooks {
    @Before
    public void setup() {
        DriverManager.setPage(PlaywrightDriverFactory.createInstance());
    }

    @After
    public void teardown(Scenario scenario) {
        if (scenario.isFailed()) {
            byte[] screenshot = DriverManager.getPage().screenshot();
            scenario.attach(screenshot, "image/png", "Error Screenshot");
        }
        DriverManager.unload();
    }
}`
  },
  login_steps: {
    title: "LoginSteps.java",
    path: "src/main/java/com/enterprise/framework/steps/LoginSteps.java",
    category: "Cucumber Step Definitions",
    whatHow: "Translates human-readable BDD Gherkin steps to structured Page Object actions and assertions.",
    flow: "Actively processes scenarios during Cucumber runner execution cycles.",
    learnings: "Thread safety is maintained by using dependency injectors (like PicoContainer) to share state across step definition classes cleanly.",
    code: `package com.enterprise.framework.steps;

import io.cucumber.java.en.*;
import com.enterprise.framework.pages.LoginPage;

public class LoginSteps {
    private LoginPage loginPage = new LoginPage();

    @Given("User is on the auth screen")
    public void navigateToAuth() {
        // Nav code
    }

    @When("User submits username {string} and password {string}")
    public void submitAuth(String user, String pass) {
        loginPage.login(user, pass);
    }
}`
  },
  utils_folder: {
    title: "utils",
    path: "src/main/java/com/enterprise/framework/utils/",
    category: "Utility Helper package",
    whatHow: "aggregates central helpers such as database query execution layers, file observers, and reporting bridges.",
    flow: "Utilized on demand across test steps or within setup hooks.",
    learnings: "Utility tools should be lightweight and generic to remain modular.",
    code: `package com.enterprise.framework.utils;`
  },
  api_helper: {
    title: "ApiHelper.java",
    path: "src/main/java/com/enterprise/framework/utils/ApiHelper.java",
    category: "RestAssured API Connector",
    whatHow: "Unified API utility encapsulating RestAssured setups, validating response codes and managing OAuth tokens.",
    flow: "Called inside test setup hooks to seed database entities or authenticate sessions quickly.",
    learnings: "Speeds up UI suites up to 300% by bypassing slow login UI pages and seeding session cookies directly into browser contexts.",
    code: `package com.enterprise.framework.utils;

import io.restassured.RestAssured;
import io.restassured.response.Response;

public class ApiHelper {
    public static String fetchAuthToken(String user, String pass) {
        Response response = RestAssured.given()
            .formParam("user", user)
            .formParam("pass", pass)
            .post("https://api.enterprise.com/v1/auth");
        return response.jsonPath().getString("token");
    }
}`
  },
  reporting_utils: {
    title: "ReportingUtils.java",
    path: "src/main/java/com/enterprise/framework/utils/ReportingUtils.java",
    category: "Allure Reporting Bridge",
    whatHow: "Custom logger routing trace statements to Allure context files and standard standard terminal pipelines.",
    flow: "Active throughout execution to record framework trace statements.",
    learnings: "Uses SLF4J abstractions rather than basic print calls, allowing runtime logging levels configuration without blocking threads.",
    code: `package com.enterprise.framework.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ReportingUtils {
    private static final Logger LOG = LoggerFactory.getLogger(ReportingUtils.class);

    public static void log(String message) {
        LOG.info(message);
    }
}`
  },
  test_folder: {
    title: "test",
    path: "src/test/",
    category: "Test Suite package",
    whatHow: "houses test specifications, cucumber feature descriptors, testng mappings, and pipeline runner contexts.",
    flow: "Pulled and evaluated by runner frameworks during test lifecycle execution.",
    learnings: "Keeping source files cleanly divided from test classes ensures framework packaging runs efficiently.",
    code: `src/test/
├── java/
└── resources/`
  },
  test_resources_folder: {
    title: "resources",
    path: "src/test/resources/",
    category: "Resources Package",
    whatHow: "Standard folder housing config settings, Cucumber features, templates, and SQL statements.",
    flow: "Loaded to classpath targets when building test pipelines.",
    learnings: "Separating assets from source packages simplifies file lookups in packaging bundles.",
    code: `src/test/resources/`
  },
  features_folder: {
    title: "features",
    path: "src/test/resources/features/",
    category: "Cucumber Features Folder",
    whatHow: "Houses Cucumber feature specifications mapping Gherkin scenarios to suite steps.",
    flow: "Scanned and evaluated by Cucumber runners at test startups.",
    learnings: "Keeps business logic readable, aligning developer efforts directly with design specs.",
    code: `src/test/resources/features/`
  },
  login_feature: {
    title: "login.feature",
    path: "src/test/resources/features/login.feature",
    category: "Gherkin Specification Feature",
    whatHow: "Specifies scenarios written in business-level Gherkin syntax (Given / When / Then). Maps the authentication criteria.",
    flow: "The primary entrypoint of test suites, parsed by Cucumber to resolve bindings.",
    learnings: "Bridges technical developers and product managers. Gotcha: keeping steps highly reusable avoids step duplication.",
    code: `Feature: Member Authentication
  As an active user
  I want to submit valid credentials
  So that I can access the system dashboard

  @Auth @Regression
  Scenario: Happy Path Member Login
    Given User is on the auth screen
    When User submits username "standard_user" and password "password123"
    Then User should be redirected to the home dashboard`
  },
  testng_xml: {
    title: "testng.xml",
    path: "src/test/resources/testng.xml",
    category: "TestNG Suite Mapping Descriptor",
    whatHow: "XML file mapping suite layouts, concurrent execution scopes, dynamic parameter settings, and listeners.",
    flow: "The central entrypoint targeting specific execution branches.",
    learnings: "Enables parallel execution controls. Gotcha: thread-count parameter limits must correspond to server infrastructure specifications.",
    code: `<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="Enterprise Automation Suite" parallel="tests" thread-count="4">
    <test name="Authentication Tests">
        <classes>
            <class name="com.enterprise.runners.CucumberRunner"/>
        </classes>
    </test>
</suite>`
  },
  runner_folder: {
    title: "runner",
    path: "src/test/java/com/enterprise/framework/runner/",
    category: "Test Runner Directory",
    whatHow: "Houses Cucumber execution entrypoints that coordinate sequential and parallel test runs.",
    flow: "Invoked by Maven/TestNG at test suite initiation.",
    learnings: "Decoupling execution configurations (runners) from test steps makes pipeline orchestration clean and flexible.",
    code: `src/test/java/com/enterprise/framework/runner/`
  },
  runner_test: {
    title: "RunnerTest.java",
    path: "src/test/java/com/enterprise/framework/runner/RunnerTest.java",
    category: "Sequential Cucumber Runner (JUnit)",
    whatHow: "Acts as the execution entrypoint using JUnit's Cucumber runner to run tests sequentially.",
    flow: "Scans features, glues step definitions, and generates Extent/HTML reports.",
    learnings: "Provides sequential safety. Gotcha: Ensure paths to features and stepdefinitions packages are specified correctly in @CucumberOptions.",
    code: `package com.enterprise.framework.runner;

import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import org.junit.runner.RunWith;
import com.enterprise.framework.pages.BasePage;

@RunWith(Cucumber.class)
@CucumberOptions(
    features = "src/test/resources/features",
    glue = {"com.enterprise.framework.steps"},
    tags = "@Smoke",
    plugin = {
        "pretty",
        "listeners.CustomListener:",
        "json:target/cucumber.json"
    }
)
public class RunnerTest extends BasePage { }`
  },
  parallel_runner: {
    title: "ParallelRunner.java",
    path: "src/test/java/com/enterprise/framework/runner/ParallelRunner.java",
    category: "Parallel TestNG Runner",
    whatHow: "Integrates Cucumber with TestNG to trigger parallel executions of up to 5 concurrent threads.",
    flow: "Spins up concurrent browser sessions dynamically, isolating each scenario.",
    learnings: "Accelerates pipeline execution by 5x. Gotcha: Requires thread-safe drivers (ThreadLocal) to prevent cross-thread contamination.",
    code: `package com.enterprise.framework.runner;

import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;
import org.testng.annotations.DataProvider;

@CucumberOptions(
    features = "src/test/resources/features",
    glue = {"com.enterprise.framework.steps"},
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
}`
  },
  configurations_properties: {
    title: "configurations.properties",
    path: "src/test/resources/configurations.properties",
    category: "External Configuration Properties",
    whatHow: "Key-value pair settings file containing target URLs, browser parameters, and generic credentials.",
    flow: "Parsed by PropertiesUtil at startup to load values to environmental variables.",
    learnings: "Keeps test variables completely out of compiled Java classes, facilitating smooth environment switching (Dev, QA, UAT).",
    code: `# Target Environment
Venture=Core Portal
env=UAT
baseurl=https://claims-dev.example.com
baseurl_CA=https://claims-uat.example.com

# Browser Parameters
browserType=chromium
headless=true

# Test Personas
CPLoginCredentials=claimant1@example.com:ClaimPass!123
CB1_CPLoginCredentials=claimant2@example.com:ClaimPass!123
B2_CPLoginCredentials=claimant3@example.com:ClaimPass!123
CB2_CPLoginCredentials=claimant4@example.com:ClaimPass!123
CALoginCredentials=adjuster1@example.com:AdjusterPass!456`
  }
};

// Global Layer Explanation Database for Mindmap
const layerDatabase = {
  feature: {
    title: "1. BDD Gherkin Specifications",
    badge: "Layer 1 of 7 · BDD Layer",
    desc: "Feature files contain the pure, executable specifications written in user-friendly business terms (Gherkin syntax: Given, When, Then). They serve as the single source of truth aligning developers, product owners, and manual testers on framework scope and intended behaviors. By separating specification from execution, the framework prevents documentation rot and acts as dynamic living documentation that remains current with every build.",
    nodeId: "node-feature",
    subs: ["sub-feature-1", "sub-feature-2"]
  },
  steps: {
    title: "2. Step Definitions Binding",
    badge: "Layer 2 of 7 · Binding Layer",
    desc: "Step definitions act as the glue between Gherkin steps and Java execution code. They capture step parameters and map inputs directly to Page Objects or API utilities, keeping scenarios focused purely on specifications. PicoContainer dependency injection is integrated here to share state across steps classes safely, eliminating dangerous global variables and enabling parallel safety.",
    nodeId: "node-steps",
    subs: ["sub-steps-1", "sub-steps-2"]
  },
  pages: {
    title: "3. Page Object Model (POM) & Component Isolation",
    badge: "Layer 3 of 7 · Page Object Layer",
    desc: "Page Objects encapsulate web page selectors and atomic UI interactions. By isolating locators within designated Java classes, they prevent suite breakage when target UI codebases change. Furthermore, shared widgets (navigation headers, custom tables) are modularized as reusable Page Components to minimize selector duplication.",
    nodeId: "node-pages",
    subs: ["sub-pages-1", "sub-pages-2"]
  },
  base: {
    title: "4. Base Driver & ThreadLocal Context Sandbox",
    badge: "Layer 4 of 7 · Execution Core",
    desc: "The Base Driver initializes target web browsers dynamically. It isolates BrowserContext and Page instances per execution thread using ThreadLocal, providing pristine, completely isolated sandboxes that enable safe, high-concurrency concurrent test suites without collision or session spillover.",
    nodeId: "node-base",
    subs: ["sub-base-1", "sub-base-2"]
  },
  utils: {
    title: "5. Utilities & REST API Integration",
    badge: "Layer 5 of 7 · Utility Layer",
    desc: "Utilities pack common tasks like database query executors, file observers, and dynamic logging managers. Crucially, it houses RestAssured API wrappers that trigger direct backend API requests to seed database entities or authenticate credentials instantly, accelerating execution speed up to 300% by bypassing slow UI pages.",
    nodeId: "node-utils",
    subs: ["sub-utils-1", "sub-utils-2"]
  },
  config: {
    title: "6. Configuration & Environment Registry",
    badge: "Layer 6 of 7 · Configuration Layer",
    desc: "The Configuration Layer maps system settings and properties files to strongly-typed Java interfaces (using Aeon Owner), enabling seamless environment transitions. It evaluates active build arguments at startup, parsing headless mode switches and remote grid URLs without tedious traditional inputstream loading code.",
    nodeId: "node-config",
    subs: ["sub-config-1", "sub-config-2"]
  },
  reporting: {
    title: "7. Diagnostics, Trace Logger & Allure Reporting",
    badge: "Layer 7 of 7 · Diagnostics Layer",
    desc: "The Reporting Layer captures suite results. It hooks into Cucumber lifecycle callbacks to generate reports (Allure, Extent, Cucumber HTML). Upon execution failure, the hooks automatically capture high-resolution screenshots, page DOM states, and Playwright browser trace log archives for instant developer diagnosis.",
    nodeId: "node-reporting",
    subs: ["sub-reporting-1", "sub-reporting-2"]
  }
};

// ELI15–ELI20 plain-English explanations for every file/folder data point
const eli20Database = {
  pom_xml: "Think of pom.xml as the shopping list + recipe for the whole project. It tells Maven which tools (libraries) to download and how to build and run everything, so anyone can spin up the exact same setup with a single command.",
  src_folder: "src is the big box holding all the code. It's split into two drawers: 'main' (the reusable framework engine) and 'test' (the actual tests) — so tools and tests never get tangled together.",
  main_folder: "This drawer holds the framework's engine — the reusable parts. No actual test scenarios live here, which means this code can be packaged up and shared with other teams like a library.",
  main_java_folder: "Just the standard Java source folder. Maven always looks here for code, and the folder path mirrors the package name so the computer knows exactly where each class lives.",
  package_folder: "A package is a labeled folder for related code. 'com.enterprise.framework' is the family name; inside it are smaller folders (driver, pages, steps, config, utils) that each do one specific job.",
  config_folder: "The settings drawer. Instead of hard-coding things like 'use Chrome' or 'run headless' all over the code, those choices live here so you can change behavior without touching real logic.",
  framework_config: "A simple list of settings written as a Java 'form'. You ask config.browser() and it hands back 'chrome'. The Owner library fills the blanks from a properties file automatically — no messy file-reading code.",
  config_factory: "A vending machine for settings. You ask it for the config, it figures out which environment you meant (staging/dev/prod), and gives you the right one — building it only once and caching it.",
  driver_folder: "The folder in charge of the browser. It opens, controls, and closes browsers, and keeps each parallel test in its own separate browser so they never bump into each other.",
  driver_manager: "Imagine each test getting its own private browser in its own room — that's ThreadLocal. This class hands every test thread its own Page, so 4 tests can run at once without sharing or corrupting each other's browser. Always clean up afterwards or memory leaks.",
  playwright_factory: "The browser factory. You ask it for a browser and it builds a fresh Chromium/Firefox/WebKit window set up exactly how your config says (headless or not, correct size), then hands you a ready-to-use page.",
  pages_folder: "Holds 'Page Objects' — one class per screen. Each class knows where the buttons and fields are on that page, so if the website changes, you only fix it in one place instead of everywhere.",
  base_page: "The parent class every page inherits from. It holds the shared helpers — click, type, wait, screenshot — so individual page classes stay short and don't repeat the same plumbing over and over.",
  login_page: "Represents the login screen. It knows the username box, password box, and login button, and offers a simple login(user, pass) action. It only describes the page — checking the result happens elsewhere.",
  steps_folder: "The translator folder. It turns plain-English test steps ('Given the user logs in') into the actual Java code that does the work.",
  hooks: "The setup/cleanup crew. Before each test it opens a fresh browser; after each test it closes it, and if the test failed it snaps a screenshot for the report. Runs automatically around every scenario.",
  login_steps: "The glue code that matches each Gherkin line to an action. When the test says 'When user submits username...', this class calls LoginPage.login() to actually perform it.",
  utils_folder: "A toolbox of helpers everyone shares — API callers, loggers, file readers. Generic, lightweight tools that don't belong to any single page or step.",
  api_helper: "A shortcut that talks to the server directly. Instead of slowly clicking through the login UI, it grabs a login token via an API call and injects it, making tests up to 3x faster.",
  reporting_utils: "The note-taker. It writes log messages into the test report and console using SLF4J, so you get a clean record of what happened without scattering raw print statements everywhere.",
  test_folder: "The drawer holding the actual tests — the feature files, the TestNG config, and the runners that kick everything off.",
  test_resources_folder: "A folder for non-code test assets: the Gherkin feature files, config files, and test data. Kept separate from code so it's easy to find.",
  features_folder: "Where the plain-English test scenarios (.feature files) live. Cucumber reads these at startup to figure out what to test.",
  login_feature: "The actual test written in everyday language: Given / When / Then. A product manager could read it and understand exactly what's being tested — without knowing any code.",
  testng_xml: "The conductor's sheet music. It tells TestNG which tests to run, how many to run at the same time (thread-count), and with which settings."
};

// ELI15–ELI20 plain-English explanations for the 7 mindmap layers
const layerEli20 = {
  feature: "Layer 1 is the test written in plain English. It's the single source of truth everyone agrees on — devs, testers, and product folks — describing what the app should do, not how the code works.",
  steps: "Layer 2 is the translator. It reads each English sentence from Layer 1 and runs the matching Java code, while safely passing shared data between steps so parallel tests don't clash.",
  pages: "Layer 3 keeps all the 'where is the button' knowledge in one place per screen. When the website's design changes, you fix one file instead of hundreds of tests.",
  base: "Layer 4 gives every running test its own private, isolated browser using ThreadLocal — so you can run many tests at once without them stepping on each other.",
  utils: "Layer 5 is the shared toolbox. Its star tool talks to the server's API directly to set up data or log in instantly, skipping slow UI clicks and speeding tests up to 3x.",
  config: "Layer 6 holds the settings (browser, environment, headless) in typed Java form, so switching from staging to production is a one-line change, not a code rewrite.",
  reporting: "Layer 7 records the results. It builds the reports and, when a test fails, automatically grabs a screenshot and browser trace so you can see exactly what went wrong."
};

// Learning documentation registry (rendered markdown previews)
const docsRegistry = [
  // Last-minute revision
  { file: "Last_45min_Revision_Set.md", title: "⚡ Last 45-Min Revision Set", icon: "⚡" },
  // Master Prep Bank
  { file: "Master_Interview_QA_Bank.md", title: "Master Interview Q&A Bank", icon: "🏆" },
  { file: "Programming_Practice_Guide.md", title: "Programming Practice (145 Qs)", icon: "💻" },
  // Java basics
  { file: "Java_Strings_Interview_Questions.md", title: "Java: Strings", icon: "☕" },
  { file: "Java_Arrays_Interview_Questions.md", title: "Java: Arrays", icon: "☕" },
  { file: "Java_LinkedList_Interview_Questions.md", title: "Java: LinkedList", icon: "☕" },
  { file: "Java_Collections_Framework_Interview_Questions.md", title: "Java: Collections Framework", icon: "☕" },
  // NeetCode 150 Study Guides
  { file: "NeetCode_150_Easy.md", title: "NeetCode 150: Easy", icon: "🟢" },
  { file: "NeetCode_150_Medium.md", title: "NeetCode 150: Medium", icon: "🟡" },
  { file: "NeetCode_150_Hard.md", title: "NeetCode 150: Hard", icon: "🔴" },
  // General Testing & Automation
  { file: "QA_Testing_Interview_Questions.md", title: "QA Testing Q&A Bank", icon: "🧪" },
  { file: "Playwright_BDD_Cucumber_Interview_Questions.md", title: "Playwright + BDD + Cucumber", icon: "🎭" },
  { file: "Playwright_RestAssured_Practice_Suite.md", title: "Playwright & RestAssured Practice Suite", icon: "🧪" },
  // Design Patterns & SOLID
  { file: "SOLID_Principles_QA_Guide.md", title: "SOLID Principles Q&A", icon: "📐" },
  // Framework Guides
  { file: "LEARNING.md", title: "Learning & Concepts", icon: "📘" },
  { file: "FRAMEWORK_CREATION_GUIDE.md", title: "E2E Framework Creation Guide", icon: "🛠️" },
  { file: "GUIDE.md", title: "Framework Guide", icon: "🧭" },
  { file: "FRAMEWORK_VISUALISER.md", title: "Architecture Visualiser", icon: "🗺️" },
  // Advanced & Production Topics
  { file: "AI_LLM_Testing_Guide.md", title: "AI & LLM Testing Tutorial", icon: "🤖" },
  { file: "Jenkins_CICD_Testing_Guide.md", title: "Jenkins & CI/CD Guide (60 Qs)", icon: "🏗️" },
  { file: "Flaky_Tests_CICD_Production_Interview_Questions.md", title: "Flaky Tests, CI/CD & Prod", icon: "🔄" },
  { file: "INTERVIEW_QA.md", title: "Framework Interview Q&A", icon: "💬" },
  { file: "Resume_Interview_QA.md", title: "Resume Interview Q&A (60 Qs)", icon: "🧑‍💼" },
  { file: "README.md", title: "README", icon: "📄" }
];

// Simulation timeline matrices
const simulatorTimeline = {
  login: [
    {
      time: "14:40:01", level: "info", text: "Initializing Maven compiler test pipeline execution context...",
      node: "pom_xml", layer: "config", subNode: "sub-config-2", pct: 10
    },
    {
      time: "14:40:02", level: "info", text: "Loading profile configurations dynamically using Owner registry...",
      node: "framework_config", layer: "config", subNode: "sub-config-1", pct: 20
    },
    {
      time: "14:40:03", level: "debug", text: "[CONFIG] Active Profile: staging | Thread Count: 4 | Browser: chromium | Headless: true",
      node: "config_factory", layer: "config", subNode: "sub-config-1", pct: 30
    },
    {
      time: "14:40:04", level: "info", text: "Spinning up sandboxed DriverManager context for thread group 'TestNG-Thread-01'...",
      node: "driver_manager", layer: "base", subNode: "sub-base-1", pct: 40
    },
    {
      time: "14:40:06", level: "debug", text: "[DRIVER] Playwright instance generated successfully. BrowserContext allocated with viewport 1280x720.",
      node: "playwright_factory", layer: "base", subNode: "sub-base-2", pct: 50
    },
    {
      time: "14:40:07", level: "info", text: "Invoking cucumber specs. Parsing cucumber feature: [login.feature]...",
      node: "login_feature", layer: "feature", subNode: "sub-feature-1", pct: 60
    },
    {
      time: "14:40:08", level: "debug", text: "[GHERKIN] Matching binding step: 'Given User is on the auth screen' -> hooks executing...",
      node: "hooks", layer: "steps", subNode: "sub-steps-2", pct: 65
    },
    {
      time: "14:40:09", level: "info", text: "Navigating to endpoint: https://staging.enterprise.com/auth ...",
      node: "login_steps", layer: "steps", subNode: "sub-steps-1", pct: 70
    },
    {
      time: "14:40:10", level: "debug", text: "[POM] LoginPage locators loaded. Selector maps: [#username, #password, button.submit]",
      node: "login_page", layer: "pages", subNode: "sub-pages-1", pct: 75
    },
    {
      time: "14:40:11", level: "info", text: "Playwright input fill actions: standard_user",
      node: "base_page", layer: "pages", subNode: "sub-pages-2", pct: 80
    },
    {
      time: "14:40:12", level: "info", text: "Playwright input fill actions: password123",
      node: "base_page", layer: "pages", subNode: "sub-pages-2", pct: 85
    },
    {
      time: "14:40:13", level: "debug", text: "[DRIVER] Click trigger sent to locator: button.submit",
      node: "base_page", layer: "pages", subNode: "sub-pages-2", pct: 90
    },
    {
      time: "14:40:14", level: "success", text: "[SUCCESS] Scenario 'Happy Path Member Login' PASSED.",
      node: "hooks", layer: "reporting", subNode: "sub-reporting-1", pct: 95
    },
    {
      time: "14:40:15", level: "success", text: "Releasing session. Generating Allure attachment records. Run complete in 14.8 seconds.",
      node: "reporting_utils", layer: "reporting", subNode: "sub-reporting-2", pct: 100
    }
  ],
  hybrid: [
    {
      time: "14:42:01", level: "info", text: "Initializing Maven compiler test pipeline execution context...",
      node: "pom_xml", layer: "config", subNode: "sub-config-2", pct: 10
    },
    {
      time: "14:42:02", level: "info", text: "Bypassing standard UI setup. Executing RestAssured authentication payload...",
      node: "api_helper", layer: "utils", subNode: "sub-utils-1", pct: 25
    },
    {
      time: "14:42:03", level: "debug", text: "[REST-API] POST request sent to: https://api.enterprise.com/v1/auth",
      node: "api_helper", layer: "utils", subNode: "sub-utils-2", pct: 40
    },
    {
      time: "14:42:04", level: "debug", text: "[REST-API] Response Status: 200 OK | Token: eyJhbGciOiJIUzI1NiIsIn...",
      node: "api_helper", layer: "utils", subNode: "sub-utils-2", pct: 50
    },
    {
      time: "14:42:05", level: "info", text: "Spinning up sandboxed DriverManager context & injecting credentials token...",
      node: "driver_manager", layer: "base", subNode: "sub-base-1", pct: 65
    },
    {
      time: "14:42:06", level: "debug", text: "[DRIVER] Injecting cookie: token=eyJhbGciOiJ... Domain: staging.enterprise.com",
      node: "playwright_factory", layer: "base", subNode: "sub-base-2", pct: 75
    },
    {
      time: "14:42:08", level: "info", text: "Navigating directly to inner dashboard view screen. UI bypassed completely.",
      node: "base_page", layer: "pages", subNode: "sub-pages-2", pct: 85
    },
    {
      time: "14:42:09", level: "success", text: "[SUCCESS] Scenario 'API-Seed Dashboard Verification' PASSED.",
      node: "hooks", layer: "reporting", subNode: "sub-reporting-1", pct: 95
    },
    {
      time: "14:42:10", level: "success", text: "Releasing session. Generating Allure attachment records. Run complete in 9.2 seconds.",
      node: "reporting_utils", layer: "reporting", subNode: "sub-reporting-2", pct: 100
    }
  ]
};

// State Variables
let activeTabId = "tab-overview";
let simulationInterval = null;
let currentSimStep = 0;

// Initialize when DOM loads
document.addEventListener("DOMContentLoaded", () => {
  initLauncher();
  initDashboard();
});

/**
 * LAUNCHER POPUP CONTEXT INITIALIZATION
 */
function initLauncher() {
  const btnLaunch = document.getElementById("btn-launch-dashboard");
  if (btnLaunch) {
    btnLaunch.addEventListener("click", () => {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.create({ url: 'fullpage.html' });
      } else {
        // Fallback for direct browser preview
        window.open('fullpage.html', '_blank');
      }
    });
  }
}

/**
 * DASHBOARD PAGE CONTEXT INITIALIZATION
 */
function initDashboard() {
  // Check if we are in the dashboard page context
  const sidebar = document.querySelector(".dashboard-sidebar");
  if (!sidebar) return;

  // 0. Mobile hamburger sidebar toggle
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const sidebarOverlay = document.getElementById("sidebar-overlay");
  const sidebarEl = document.getElementById("dashboard-sidebar");

  function closeSidebar() {
    sidebarEl.classList.remove("open");
    hamburgerBtn.classList.remove("open");
    sidebarOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", () => {
      const isOpen = sidebarEl.classList.toggle("open");
      hamburgerBtn.classList.toggle("open", isOpen);
      sidebarOverlay.classList.toggle("active", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
  }

  if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeSidebar);

  // 1. Tab Switching Registration
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const targetTab = item.getAttribute("data-tab");
      switchTab(targetTab);
      closeSidebar(); // auto-close drawer on mobile after nav
    });
  });

  // 2. Folder Tree Interaction Registration
  const treeNodes = document.querySelectorAll(".tree-node");
  treeNodes.forEach(node => {
    node.addEventListener("click", (e) => {
      e.stopPropagation();

      // If clicked node is a folder trigger
      const folderKey = node.getAttribute("data-folder");
      if (folderKey) {
        const childrenDiv = document.getElementById(`${folderKey}-children`);
        const expander = node.querySelector(".node-expander");
        
        if (childrenDiv) {
          const isExpanded = childrenDiv.classList.contains("expanded");
          if (isExpanded) {
            childrenDiv.classList.remove("expanded");
            childrenDiv.style.display = "none";
            if (expander) expander.classList.remove("expanded");
          } else {
            childrenDiv.classList.add("expanded");
            childrenDiv.style.display = "block";
            if (expander) expander.classList.add("expanded");
          }
        }
      }

      // If clicked node is an explainable file/folder
      const nodeKey = node.getAttribute("data-node") || node.getAttribute("data-folder");
      if (nodeKey && nodeDatabase[nodeKey]) {
        selectProjectNode(nodeKey);
      }
    });
  });

  // 3. Mindmap Interaction Registration
  const mindmapWrappers = document.querySelectorAll(".mindmap-node-wrapper");
  mindmapWrappers.forEach(wrap => {
    wrap.addEventListener("click", () => {
      const layerKey = wrap.getAttribute("data-layer");
      selectMindmapLayer(layerKey);
    });
  });

  // 4. Simulator Interaction Registration
  const btnStartSim = document.getElementById("btn-start-sim");
  const btnStopSim = document.getElementById("btn-stop-sim");
  const btnClearTerminal = document.getElementById("btn-clear-terminal");

  if (btnStartSim) {
    btnStartSim.addEventListener("click", startSimulation);
  }
  if (btnStopSim) {
    btnStopSim.addEventListener("click", stopSimulation);
  }
  if (btnClearTerminal) {
    btnClearTerminal.addEventListener("click", () => {
      const logsBody = document.getElementById("terminal-logs");
      if (logsBody) logsBody.innerHTML = "";
    });
  }

  // 5. Root ELI20 toggle + Settings dropdown + Learning Docs (no persistence)
  initPresentationControls();

  // 6. Interactive Flow Visualiser
  initFlowVisualiser();

  // Pre-load default selections
  selectMindmapLayer("feature");
}

/**
 * ROOT PRESENTATION CONTROLS
 * Defaults to clean "Presentation Mode" on every load (no localStorage),
 * so a page refresh always re-hides explanations and the docs module.
 */
function initPresentationControls() {
  // Force the clean default state regardless of any cached checkbox values
  document.body.classList.add("showcase-mode");
  document.body.classList.remove("eli-active");

  // --- ELI20 master toggle ---
  const chkEli20 = document.getElementById("chk-eli20");
  const mindCard = document.getElementById("mindmap-detail-card");
  const modeBadge = document.getElementById("root-mode-badge");
  const modeHint = document.getElementById("root-mode-hint");

  const applyEli20 = (on) => {
    document.body.classList.toggle("showcase-mode", !on);
    document.body.classList.toggle("eli-active", on);
    if (mindCard) mindCard.classList.toggle("study-mode-active", on);
    if (modeBadge) modeBadge.innerText = on ? "🎓 ELI20 Mode" : "🎤 Presentation Mode";
    if (modeHint) {
      modeHint.innerText = on
        ? "Showing plain-English explanations on every chapter & data point"
        : "Showing folder architecture & boilerplate only — explanations hidden";
    }
  };

  if (chkEli20) {
    chkEli20.checked = false; // reset on every load
    applyEli20(false);
    chkEli20.addEventListener("change", () => applyEli20(chkEli20.checked));
  }

  // --- Settings dropdown ---
  const btnSettings = document.getElementById("btn-settings");
  const dropdown = document.getElementById("settings-dropdown");
  if (btnSettings && dropdown) {
    btnSettings.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && e.target !== btnSettings) {
        dropdown.classList.remove("open");
      }
    });
  }

  // --- Learning Docs toggle ---
  const chkDocs = document.getElementById("chk-docs");
  const navDocs = document.getElementById("nav-docs");
  const navDesignGuide = document.getElementById("nav-design-guide");
  if (chkDocs && navDocs) {
    chkDocs.checked = false; // reset on every load
    navDocs.style.display = "none";
    if (navDesignGuide) navDesignGuide.style.display = "none";
    let docsInitialized = false;

    chkDocs.addEventListener("change", () => {
      if (chkDocs.checked) {
        navDocs.style.display = "flex";
        if (navDesignGuide) navDesignGuide.style.display = "flex";
        if (!docsInitialized) {
          buildDocsList();
          loadDesignGuide();
          docsInitialized = true;
        }
      } else {
        navDocs.style.display = "none";
        if (navDesignGuide) navDesignGuide.style.display = "none";
        if (activeTabId === "tab-docs" || activeTabId === "tab-design-guide") {
          switchTab("tab-overview");
        }
      }
    });
  }
}

/**
 * Builds the clickable Learning Docs file list and wires markdown rendering.
 */
function buildDocsList() {
  const listEl = document.getElementById("docs-file-list");
  if (!listEl) return;
  listEl.innerHTML = "";

  docsRegistry.forEach((doc, idx) => {
    const item = document.createElement("div");
    item.className = "docs-file-item" + (idx === 0 ? " active" : "");
    item.innerHTML = `<span class="docs-file-icon">${doc.icon}</span><span>${doc.title}</span>`;
    item.addEventListener("click", () => {
      listEl.querySelectorAll(".docs-file-item").forEach(n => n.classList.remove("active"));
      item.classList.add("active");
      loadMarkdownDoc(doc);
    });
    listEl.appendChild(item);
  });

  // Auto-load the first document
  loadMarkdownDoc(docsRegistry[0]);
}

/**
 * Finds a plain-text Table of Contents section in the rendered doc and makes
 * each entry clickable so it smooth-scrolls to the matching heading.
 * Works for TOCs written as plain bold labels + numbered lists (not markdown links).
 */
function wireTocScrolling(container) {
  const mdBody = container.querySelector(".md-body");
  if (!mdBody) return;

  let tocHeading = null;
  mdBody.querySelectorAll("h2, h3").forEach(h => {
    if (/table of contents/i.test(h.textContent)) tocHeading = h;
  });
  if (!tocHeading) return;

  const allHeadings = Array.from(mdBody.querySelectorAll("h1, h2, h3, h4"));
  const contentHeadings = allHeadings.filter(h => h !== tocHeading);

  // normalize: lowercase, remove punctuation/symbols, collapse spaces
  const normalize = (s) => s.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();

  // Map 1: full normalized heading text → element
  const headingMap = new Map();
  contentHeadings.forEach(h => headingMap.set(normalize(h.textContent), h));

  // Map 2: heading text WITHOUT leading "N." number → element
  // This is the key fix: <ol><li> strips numbers, so we must match against stripped headings
  const headingMapNoNum = new Map();
  contentHeadings.forEach(h => {
    const noNum = normalize(h.textContent.replace(/^\s*\d+\.\s*/, ""));
    headingMapNoNum.set(noNum, h);
  });

  // Map 3: number → element (for docs that render numbers in li text)
  const numberMap = new Map();
  contentHeadings.forEach(h => {
    const m = h.textContent.match(/^\s*(\d+)\.\s/);
    if (m) numberMap.set(m[1], h);
  });

  const scrollTo = (targetEl) => {
    const containerRect = container.getBoundingClientRect();
    const elRect = targetEl.getBoundingClientRect();
    const offset = elRect.top - containerRect.top + container.scrollTop - 16;
    container.scrollTo({ top: offset, behavior: "smooth" });
  };

  // findHeading: robust multi-strategy lookup
  // rawText = the raw (un-normalized) candidate string
  function findHeading(rawText) {
    // Strategy 1: exact full normalized match
    let h = headingMap.get(normalize(rawText)) || headingMapNoNum.get(normalize(rawText));
    if (h) return h;

    // Strategy 2: split on em-dash/en-dash BEFORE normalizing, try the part before the dash
    // e.g. "Jenkins core concepts — job, pipeline, node, executor" → "Jenkins core concepts"
    const rawBeforeDash = rawText.split(/\s*[—–]\s*/)[0].trim();
    if (rawBeforeDash !== rawText) {
      h = headingMapNoNum.get(normalize(rawBeforeDash)) || headingMap.get(normalize(rawBeforeDash));
      if (h) return h;
    }

    // Strategy 3: first 4 meaningful words (pre-dash) against no-num map
    const first4 = normalize(rawBeforeDash).split(" ").slice(0, 4).join(" ");
    if (first4.length > 6) {
      for (const [key, heading] of headingMapNoNum) {
        if (key.startsWith(first4)) return heading;
      }
      for (const [key, heading] of headingMapNoNum) {
        if (key.includes(first4)) return heading;
      }
    }

    return null;
  }

  let el = tocHeading.nextElementSibling;
  while (el) {
    const tag = el.tagName.toLowerCase();
    if ((tag === "h1" || tag === "h2") && !/<strong>/i.test(el.innerHTML) && !/table of contents/i.test(el.textContent)) break;

    if (tag === "p") {
      el.querySelectorAll("strong").forEach(strong => {
        const raw = strong.textContent.trim()
          .replace(/^[A-Z]\.\s*/, "")           // strip "A. "
          .replace(/\s*\(\d+\s*min\)\s*$/i, "") // strip "(4 min)"
          .trim();
        const match = findHeading(raw);
        if (match) {
          strong.style.cursor = "pointer";
          strong.style.color = "var(--accent-cyan, #7dd3fc)";
          strong.addEventListener("click", () => scrollTo(match));
        }
      });
    }

    if (tag === "ol" || tag === "ul") {
      el.querySelectorAll("li").forEach(li => {
        // Primary: use data-num set by renderMarkdown (most reliable)
        const dataNum = li.dataset.num;
        let targetHeading = dataNum ? numberMap.get(dataNum) : null;

        // Fallback: text-based matching using raw li text content
        if (!targetHeading) {
          targetHeading = findHeading(li.textContent.trim());
        }
        if (targetHeading) {
          li.style.cursor = "pointer";
          li.style.color = "var(--accent-cyan, #7dd3fc)";
          li.style.textDecoration = "underline";
          li.style.textDecorationStyle = "dotted";
          li.addEventListener("click", () => scrollTo(targetHeading));
          li.addEventListener("mouseenter", () => li.style.opacity = "0.75");
          li.addEventListener("mouseleave", () => li.style.opacity = "1");
        }
      });
    }

    el = el.nextElementSibling;
  }
}

/**
 * Fetches a markdown file and renders it into the docs preview panel.
 */
function loadMarkdownDoc(doc) {
  const target = document.getElementById("docs-rendered");
  if (!target) return;
  target.innerHTML = `<div class="docs-loading">Loading ${doc.title}…</div>`;

  if (doc.isHtml || doc.file.endsWith('.html')) {
    target.innerHTML = `<iframe src="${doc.file}" style="width: 100%; height: 100%; border: none; border-radius: 6px; background: var(--bg-primary);"></iframe>`;
    return;
  }

  fetch(encodeURI(doc.file))
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    })
    .then(md => {
      target.innerHTML = `<div class="md-body">${renderMarkdown(md)}</div>`;
      target.scrollTop = 0;

      // Wire interactive code line clicks
      wireInteractiveCodeLines(target);

      // Wire plain-text TOC items to scroll to their matching headings
      wireTocScrolling(target);

      // Wire anchor link scrolling
      target.querySelectorAll(".md-anchor-link").forEach(link => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const targetId = link.getAttribute("href").substring(1);
          const targetElement = target.querySelector(`[id="${targetId}"]`);
          if (targetElement) {
            const containerRect = target.getBoundingClientRect();
            const elementRect = targetElement.getBoundingClientRect();
            const relativeOffset = elementRect.top - containerRect.top + target.scrollTop;
            target.scrollTo({
              top: relativeOffset,
              behavior: "smooth"
            });
          }
        });
      });
    })
    .catch(err => {
      target.innerHTML = `<div class="docs-empty"><div class="placeholder-icon">⚠️</div>
        <p>Could not load <strong>${doc.file}</strong>.<br>${err.message}.<br>
        Open this page via the extension (not file://) so the docs can be fetched.</p></div>`;
    });
}

/**
 * Maps heading titles to appropriate chapter emojis dynamically.
 */
function getChapterEmoji(text) {
  const lower = text.toLowerCase();
  if (lower.includes("chapter 1:")) return "🏛️";
  if (lower.includes("chapter 2:")) return "⚙️";
  if (lower.includes("chapter 3:")) return "📁";
  if (lower.includes("chapter 4:")) return "📦";
  if (lower.includes("chapter 5:")) return "🎛️";
  if (lower.includes("chapter 6:")) return "🌐";
  if (lower.includes("chapter 7:")) return "🎒";
  if (lower.includes("chapter 8:")) return "🗺️";
  if (lower.includes("chapter 9:")) return "🚰";
  if (lower.includes("chapter 10:")) return "🏠";
  if (lower.includes("chapter 11:")) return "🧩";
  if (lower.includes("chapter 12:")) return "✍️";
  if (lower.includes("chapter 13:")) return "🎵";
  if (lower.includes("chapter 14:")) return "📊";
  if (lower.includes("chapter 15:")) return "📈";
  if (lower.includes("chapter 16:")) return "🚀";
  if (lower.includes("chapter 17:")) return "🪵";
  if (lower.includes("ui-based")) return "🖥️";
  if (lower.includes("api (restassured)")) return "🔌";
  if (lower.includes("best practices")) return "✅";
  if (lower.includes("worst practices")) return "⚠️";
  if (lower.includes("optimization")) return "⚡";
  if (lower.includes("troubleshooting")) return "🔧";
  return "📖";
}

/**
 * Fetches and renders the Framework Design Guide.
 */
function loadDesignGuide() {
  const target = document.getElementById("design-guide-rendered");
  const indexEl = document.getElementById("design-guide-index");
  if (!target || !indexEl) return;

  target.innerHTML = `<div class="docs-loading">Loading Design Guide…</div>`;
  indexEl.innerHTML = "";

  // isClickScrolling is a mutex flag: when the user clicks a TOC item and we programmatically
  // scroll the pane, the scroll event listener would normally fire and immediately update the
  // active TOC item — which causes a visual flicker. We set this flag true for ~800ms to tell
  // the scroll listener "ignore scroll events, I triggered them, not the user."
  let isClickScrolling = false;
  let scrollTimeout = null;

  fetch("How_to_Design_Framework.MD")
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    })
    .then(md => {
      target.innerHTML = `<div class="md-body">${renderMarkdown(md)}</div>`;
      target.scrollTop = 0;

      // Extract h2 elements and populate left-hand table of contents
      const headings = target.querySelectorAll("h2");
      headings.forEach((h2, idx) => {
        if (!h2.id) {
          h2.id = h2.textContent.toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");
        }

        const title = h2.textContent.replace(/^\d+\.\s+/, ""); // strip leading numbers if present
        const emoji = getChapterEmoji(h2.textContent);

        const item = document.createElement("div");
        item.className = "docs-file-item" + (idx === 0 ? " active" : "");
        item.innerHTML = `<span class="docs-file-icon">${emoji}</span><span>${title}</span>`;

        item.addEventListener("click", () => {
          isClickScrolling = true;
          indexEl.querySelectorAll(".docs-file-item").forEach(n => n.classList.remove("active"));
          item.classList.add("active");
          item.scrollIntoView({ behavior: "smooth", block: "nearest" });

          // Scroll target pane to heading
          const containerRect = target.getBoundingClientRect();
          const elementRect = h2.getBoundingClientRect();
          const relativeOffset = elementRect.top - containerRect.top + target.scrollTop;
          target.scrollTo({
            top: relativeOffset,
            behavior: "smooth"
          });

          if (scrollTimeout) clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            isClickScrolling = false;
          }, 800);
        });

        indexEl.appendChild(item);
      });

      // On scroll, figure out which heading is currently nearest the top of the panel
      // and highlight its TOC entry. The threshold (80px) gives a small buffer so the
      // heading is considered "active" just before it actually hits the very top edge.
      target.addEventListener("scroll", () => {
        if (isClickScrolling) return;

        let activeIdx = 0;
        const containerRect = target.getBoundingClientRect();

        // Walk every heading; keep updating activeIdx as long as headings are above the 80px threshold.
        // When we hit one that's below the threshold, stop — all remaining headings are off-screen below.
        for (let i = 0; i < headings.length; i++) {
          const h2 = headings[i];
          const elementRect = h2.getBoundingClientRect();
          if (elementRect.top - containerRect.top <= 80) {
            activeIdx = i;
          } else {
            break;
          }
        }

        const items = indexEl.querySelectorAll(".docs-file-item");
        items.forEach((item, idx) => {
          if (idx === activeIdx) {
            const wasActive = item.classList.contains("active");
            item.classList.add("active");
            if (!wasActive) {
              item.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
          } else {
            item.classList.remove("active");
          }
        });
      });

      // Wire anchor link scrolling within the document
      target.querySelectorAll(".md-anchor-link").forEach(link => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const targetId = link.getAttribute("href").substring(1);
          const targetElement = target.querySelector(`[id="${targetId}"]`);
          if (targetElement) {
            const containerRect = target.getBoundingClientRect();
            const elementRect = targetElement.getBoundingClientRect();
            const relativeOffset = elementRect.top - containerRect.top + target.scrollTop;
            target.scrollTo({
              top: relativeOffset,
              behavior: "smooth"
            });
          }
        });
      });
    })
    .catch(err => {
      target.innerHTML = `<div class="docs-empty"><div class="placeholder-icon">⚠️</div>
        <p>Could not load <strong>How_to_Design_Framework.MD</strong>.<br>${err.message}.<br>
        Open this page via the extension (not file://) so the docs can be fetched.</p></div>`;
    });
}

/**
 * Minimal, dependency-free Markdown → HTML renderer.
 * Handles headings, code fences, inline code, bold/italic, blockquotes,
 * lists, horizontal rules and links. Escapes HTML to stay CSP-safe.
 */
function renderMarkdown(md) {
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const inline = (s) => esc(s)
    .replace(/`([^`]+)`/g, '<code class="md-inline">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, href) => {
      if (href.startsWith("#")) {
        return `<a href="${href}" class="md-anchor-link">${text}</a>`;
      }
      return `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
    });

  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let html = "";
  // inCode tracks if we're inside a ```code fence``` — lines inside get buffered, not parsed as markdown
  // listType tracks whether an open <ul> or <ol> tag is pending a closing tag before the next block element
  let inCode = false, codeBuf = [], codeLang = "java";
  let listType = null; // "ul" | "ol"

  // Must close an open list before writing headings, blockquotes, tables etc., otherwise the HTML nesting breaks
  const closeList = () => { if (listType) { html += `</${listType}>`; listType = null; } };

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Code fences
    const fence = line.match(/^\s*```(.*)$/);
    if (fence) {
      if (inCode) {
        html += renderInteractiveCode(codeBuf, codeLang);
        codeBuf = []; inCode = false;
      } else {
        closeList(); inCode = true;
        codeLang = fence[1] ? fence[1].trim().toLowerCase() : "java";
      }
      continue;
    }
    if (inCode) { codeBuf.push(line); continue; }

    // Blank line
    if (/^\s*$/.test(line)) { closeList(); continue; }

    // Horizontal rule
    if (/^\s*(---|\*\*\*|___)\s*$/.test(line)) { closeList(); html += "<hr>"; continue; }

    // Headings
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      closeList();
      const lvl = h[1].length;
      const headingText = h[2];
      const id = headingText.toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      html += `<h${lvl} id="${id}">${inline(headingText)}</h${lvl}>`;
      continue;
    }

    // Blockquote
    if (/^>\s?/.test(line)) { closeList(); html += `<blockquote>${inline(line.replace(/^>\s?/, ""))}</blockquote>`; continue; }

    // GFM table: two-line lookahead — current line is header cells, next line must be |---|---| divider
    // We have to peek at lines[i+1] now because once we're past the header row it's too late to rewind
    if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length &&
        /^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$/.test(lines[i + 1])) {
      closeList();
      const cells = (row) => row.trim().replace(/^\||\|$/g, "").split("|").map(c => c.trim());
      let table = `<table><thead><tr>${cells(line).map(c => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>`;
      i += 2; // skip header + separator
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
        table += `<tr>${cells(lines[i]).map(c => `<td>${inline(c)}</td>`).join("")}</tr>`;
        i++;
      }
      i--; // step back; loop will increment
      table += "</tbody></table>";
      html += table;
      continue;
    }

    // Ordered list
    const ol = line.match(/^\s*(\d+)\.\s+(.*)$/);
    if (ol) {
      if (listType !== "ol") { closeList(); html += "<ol>"; listType = "ol"; }
      html += `<li data-num="${ol[1]}">${inline(ol[2])}</li>`; continue;
    }
    // Unordered list
    const ul = line.match(/^\s*[-*+]\s+(.*)$/);
    if (ul) {
      if (listType !== "ul") { closeList(); html += "<ul>"; listType = "ul"; }
      html += `<li>${inline(ul[1])}</li>`; continue;
    }

    // Paragraph
    closeList();
    html += `<p>${inline(line)}</p>`;
  }

  if (inCode) html += renderInteractiveCode(codeBuf, codeLang);
  closeList();
  return html;
}

/**
 * Handles switching active tab panels
 */
function switchTab(tabId) {
  // Update nav buttons
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    if (item.getAttribute("data-tab") === tabId) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Update tab panel visibility
  const panels = document.querySelectorAll(".page-tab-content");
  panels.forEach(panel => {
    if (panel.id === tabId) {
      panel.classList.add("active");
    } else {
      panel.classList.remove("active");
    }
  });

  activeTabId = tabId;
  
  // Re-render visualiser when switching to structure tab to ensure correct layout calculations
  if (tabId === "tab-structure") {
    renderFlowDiagram();
  }
  
  // If moving out of simulator tab, make sure we stop active simulator runs
  if (tabId !== "tab-simulator") {
    stopSimulation();
  }
}

/**
 * Renders technical details inside the folder tree details panel
 */
function selectProjectNode(nodeKey) {
  const data = nodeDatabase[nodeKey];
  if (!data) return;

  // Remove existing selections
  const selectedNodes = document.querySelectorAll(".tree-node");
  selectedNodes.forEach(node => node.classList.remove("selected-node"));

  // Find and select the target node UI
  const targetNode = document.querySelector(`[data-node="${nodeKey}"]`) || document.querySelector(`[data-folder="${nodeKey}"]`);
  if (targetNode) {
    targetNode.classList.add("selected-node");
  }

  // Toggle visible elements
  document.getElementById("details-empty").style.display = "none";
  const detailsActive = document.getElementById("details-active");
  detailsActive.style.display = "flex";
  detailsActive.classList.add("active");

  // Populate data
  document.getElementById("selected-node-title").innerText = data.title;
  document.getElementById("selected-node-path").innerText = data.path;
  document.getElementById("selected-node-category").innerText = data.category;
  document.getElementById("details-what-how").innerText = data.whatHow;
  document.getElementById("details-flow").innerText = data.flow;
  document.getElementById("details-learnings").innerText = data.learnings;
  document.getElementById("details-eli20").innerText = eli20Database[nodeKey] || data.whatHow;
  
  // Code preview
  const codePre = document.getElementById("details-code");
  const codeSec = document.getElementById("code-preview-section");
  if (data.code) {
    codePre.innerText = data.code;
    codeSec.style.display = "flex";
  } else {
    codeSec.style.display = "none";
  }
}

/**
 * Handles Layer Node clicks in Architecture Mindmap
 */
function selectMindmapLayer(layerKey) {
  const layer = layerDatabase[layerKey];
  if (!layer) return;

  // Clear previous nodes
  const nodes = document.querySelectorAll(".mindmap-node");
  nodes.forEach(node => node.classList.remove("active-layer"));

  // Select target node UI
  const targetNode = document.getElementById(layer.nodeId);
  if (targetNode) {
    targetNode.classList.add("active-layer");
  }

  // Highlight associated sub-nodes
  document.querySelectorAll(".mindmap-sub-node").forEach(sub => sub.classList.remove("active-sub"));
  if (layer.subs) {
    layer.subs.forEach(subId => {
      const subNode = document.getElementById(subId);
      if (subNode) {
        subNode.classList.add("active-sub");
      }
    });
  }

  // Set card contents
  document.getElementById("mindmap-badge").innerText = layer.badge;
  document.getElementById("mindmap-title").innerText = layer.title;
  document.getElementById("mindmap-desc").innerText = layer.desc;
  const mindEli20 = document.getElementById("mindmap-eli20");
  if (mindEli20) mindEli20.innerText = layerEli20[layerKey] || layer.desc;

  // Update animated path widths based on selection step
  const path = document.getElementById("mindmap-path");
  if (path) {
    const step = parseInt(targetNode.querySelector(".mindmap-node-step").innerText);
    const widthPct = ((step - 1) / 6) * 100;
    path.style.width = `${widthPct}%`;
  }
}

/**
 * LAUNCH SIMULATION WORKFLOW
 */
function startSimulation() {
  stopSimulation(); // safety clear

  const scenarioSelector = document.querySelector('input[name="sim-scenario"]:checked');
  const scenarioKey = scenarioSelector ? scenarioSelector.value : "login";
  const steps = simulatorTimeline[scenarioKey];
  
  if (!steps) return;

  // UI state updates
  document.getElementById("btn-start-sim").disabled = true;
  document.getElementById("btn-stop-sim").style.display = "block";
  document.getElementById("sim-status-label").innerText = "Simulator Status: Executing Suite...";
  
  // Clear logs terminal with header
  const logsBody = document.getElementById("terminal-logs");
  logsBody.innerHTML = `
    <div class="console-log-row">
      <span class="log-time">[${new Date().toLocaleTimeString()}]</span>
      <span class="log-level success">[SUCCESS]</span>
      <span class="log-text success-highlight">BOOTSTRAP: Launching Maven automation runner context...</span>
    </div>
  `;

  currentSimStep = 0;

  // Frame transition loop
  simulationInterval = setInterval(() => {
    if (currentSimStep >= steps.length) {
      // Loop ends successfully
      stopSimulation(true);
      return;
    }

    const frame = steps[currentSimStep];
    
    // 1. Output Terminal log row
    const logRow = document.createElement("div");
    logRow.className = "console-log-row";
    
    // Set level highlighting
    let levelHighlight = frame.level;
    let textClass = "";
    if (frame.level === "success") {
      textClass = "success-highlight";
    }

    logRow.innerHTML = `
      <span class="log-time">[${frame.time}]</span>
      <span class="log-level ${levelHighlight}">[${frame.level.toUpperCase()}]</span>
      <span class="log-text ${textClass}">${frame.text}</span>
    `;
    logsBody.appendChild(logRow);
    logsBody.scrollTop = logsBody.scrollHeight; // Auto-scroll to bottom

    // 2. Update Progress indicators
    document.getElementById("sim-progress-text").innerText = `${frame.pct}%`;
    document.getElementById("sim-progress-bar").style.width = `${frame.pct}%`;
    
    // 3. Highlight current Tree node
    document.querySelectorAll(".tree-node").forEach(node => node.classList.remove("active-highlight"));
    const targetTreeNode = document.querySelector(`[data-node="${frame.node}"]`) || document.querySelector(`[data-folder="${frame.node}"]`);
    if (targetTreeNode) {
      targetTreeNode.classList.add("active-highlight");
      document.getElementById("sim-active-node-text").innerText = targetTreeNode.querySelector(".node-name").innerText;
      
      // Walk up the DOM from the highlighted node to the root tree div.
      // Any "tree-children" container we encounter along the way is a collapsed folder — open it
      // so the active node is actually visible instead of hidden inside a collapsed subtree.
      let parent = targetTreeNode.parentElement;
      while (parent && parent.id !== "project-tree") {
        if (parent.classList.contains("tree-children")) {
          parent.classList.add("expanded");
          parent.style.display = "block";
          
          // Rotate associated expansion arrows
          const folderGroup = parent.previousElementSibling;
          if (folderGroup) {
            const arrow = folderGroup.querySelector(".node-expander");
            if (arrow) arrow.classList.add("expanded");
          }
        }
        parent = parent.parentElement;
      }
    }

    // 4. Highlight Mindmap node
    document.querySelectorAll(".mindmap-node").forEach(node => node.classList.remove("active-highlight"));
    const layerInfo = layerDatabase[frame.layer];
    if (layerInfo) {
      const targetMindNode = document.getElementById(layerInfo.nodeId);
      if (targetMindNode) {
        targetMindNode.classList.add("active-highlight");
        // Dynamically focus mindmap explanation card to match active simulation layer
        selectMindmapLayer(frame.layer);
      }
    }

    // 5. Highlight Mindmap sub-node dynamically
    document.querySelectorAll(".mindmap-sub-node").forEach(sub => sub.classList.remove("active-highlight"));
    if (frame.subNode) {
      const subElement = document.getElementById(frame.subNode);
      if (subElement) {
        subElement.classList.add("active-highlight");
      }
    }

    currentSimStep++;
  }, 1200); // 1.2 second ticks for high visibility scanning
}

/**
 * ABORT OR TEARDOWN ACTIVE SIMULATION RUNS
 */
function stopSimulation(isFinished = false) {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }

  // Restore triggers
  const btnStart = document.getElementById("btn-start-sim");
  if (btnStart) btnStart.disabled = false;
  
  const btnStop = document.getElementById("btn-stop-sim");
  if (btnStop) btnStop.style.display = "none";

  const statusLabel = document.getElementById("sim-status-label");
  if (statusLabel) {
    statusLabel.innerText = isFinished 
      ? "Simulator Status: Run Finished" 
      : "Simulator Status: Ready";
  }

  // Clean highlighting markers
  document.querySelectorAll(".tree-node").forEach(node => node.classList.remove("active-highlight"));
  document.querySelectorAll(".mindmap-node").forEach(node => node.classList.remove("active-highlight"));
  document.querySelectorAll(".mindmap-sub-node").forEach(sub => sub.classList.remove("active-highlight"));
}

/**
 * DYNAMIC FRAMEWORK FLOW VISUALISER CONTROLLER
 */
let flowInterval = null;
let currentFlowStep = 0;
let activeFlowType = "exec"; // "exec" | "json"
let animationFrameId = null;
let flowSpeedMultiplier = 1.0;

const flowData = {
  exec: {
    nodes: [
      { id: "fn-testng", label: "testng.xml", xPct: 12, yPct: 22, desc: "TestNG Trigger", detail: "Execution begins at testng.xml, which triggers the target test runner suites." },
      { id: "fn-runner", label: "ParallelRunner.java", xPct: 37, yPct: 22, desc: "Cucumber Runner Init", detail: "ParallelRunner scans feature folders, loads tags, and sets up Gherkin execution loops." },
      { id: "fn-feature", label: "login.feature", xPct: 62, yPct: 22, desc: "Gherkin Parsing", detail: "Cucumber reads steps ('Given / When / Then') and hooks into steps binding classes." },
      { id: "fn-hooks", label: "Hooks.java", xPct: 88, yPct: 22, desc: "Before Setup Hook", detail: "Hooks.java runs @Before annotation to initialize thread-safe browser contexts." },
      { id: "fn-factory", label: "PlaywrightDriverFactory", xPct: 88, yPct: 78, desc: "Driver Sandbox", detail: "Creates isolated page view instances and stores them inside DriverManager's ThreadLocal sandbox." },
      { id: "fn-steps", label: "LoginSteps.java", xPct: 62, yPct: 78, desc: "Step Definitions Bindings", detail: "Steps map English sentences directly to UI methods inside the LoginPage page objects." },
      { id: "fn-pom", label: "LoginPage.java", xPct: 37, yPct: 78, desc: "Page Object Model Action", detail: "LoginPage locates DOM elements and performs inputs, clicks, and page assertions." },
      { id: "fn-browser", label: "Chromium Browser Page", xPct: 12, yPct: 78, desc: "UI Render Target", detail: "Playwright CDP connects to Chromium browser pipe to execute visual user actions." }
    ],
    connections: [
      { from: "fn-testng", to: "fn-runner" },
      { from: "fn-runner", to: "fn-feature" },
      { from: "fn-feature", to: "fn-hooks" },
      { from: "fn-hooks", to: "fn-factory" },
      { from: "fn-factory", to: "fn-steps" },
      { from: "fn-steps", to: "fn-pom" },
      { from: "fn-pom", to: "fn-browser" }
    ],
    steps: [
      { activeNode: "fn-testng", activeLine: 0, text: "testng.xml: Suite & Thread Allocation", info: "The test execution lifecycle starts here. The testng.xml file defines the suite boundaries, sets the parallel execution mode (e.g. parallel=\"tests\"), allocates the thread-count pool, and maps the runners. TestNG orchestrates independent threads so that multiple feature classes can execute concurrently without colliding in the JVM." },
      { activeNode: "fn-runner", activeLine: 1, text: "ParallelRunner: Cucumber Engine Init", info: "ParallelRunner (which extends AbstractTestNGCucumberTests) initializes the Cucumber engine. It reads the @CucumberOptions configuration annotations, sets up target HTML/Allure report plugins, and scans the designated feature directories and step definition glue codes on the classpath to map the testing scope." },
      { activeNode: "fn-feature", activeLine: 2, text: "login.feature: Gherkin Spec Parsing", info: "The Cucumber engine parses Gherkin scenario steps (Given, When, Then) from login.feature. It loads the parsed steps into memory as sequential command queues. These plain-English steps serve as the readable specifications that business stakeholders inspect, keeping the automation living and self-documenting." },
      { activeNode: "fn-hooks", activeLine: 3, text: "Hooks.java: Before Lifecycle Setup", info: "Before execution begins on a scenario, Cucumber fires the @Before hook inside Hooks.java. This step instantiates the base test environment, loads global settings (like browser type and headless flags), and requests a new isolated page session from the driver factory for the current executing thread." },
      { activeNode: "fn-factory", activeLine: 4, text: "PlaywrightDriverFactory: Thread Sandbox", info: "The factory initializes the Playwright library and launches the Chromium/Firefox browser binary. It assigns a new isolated BrowserContext and Page to the thread, saving it in DriverManager's ThreadLocal wrapper. This isolates cookie caches, sessions, and viewports per thread to guarantee zero concurrency flakiness." },
      { activeNode: "fn-steps", activeLine: 5, text: "LoginSteps.java: Glue Code Binding", info: "Cucumber matches Gherkin text lines to annotated Java methods in LoginSteps.java using Cucumber Expressions. It extracts variables (like usernames or passwords) from feature files and passes them as arguments to the Page Object actions, keeping step definitions free of direct selector plumbing." },
      { activeNode: "fn-pom", activeLine: 6, text: "LoginPage.java: POM UI Action", info: "LoginPage encapsulates elements and behaviors. It retrieves selectors from locators.json at runtime and calls the BasePage/Playwright API wrapper methods. The class performs user actions like click() and fill(), utilizing Playwright auto-waiting logic to ensure elements are ready before interacting." },
      { activeNode: "fn-browser", activeLine: 7, text: "Chromium: CDP Page Interaction", info: "Playwright transmits commands over the Chrome DevTools Protocol (CDP) socket pipe to the browser window. Element inputs, cursor clicks, dialog acceptances, and page navigations are executed instantly. On test completion, the @After hook captures error screenshots, closes the context, and frees the ThreadLocal driver." }
    ]
  },
  json: {
    nodes: [
      { id: "fn-locators", label: "locators.json", xPct: 10, yPct: 22, desc: "Selector Coordinates Storage", detail: "External JSON files house the selector elements (e.g. usernameField: '#username') separate from code." },
      { id: "fn-data", label: "testdata.json", xPct: 10, yPct: 78, desc: "Input Parameters Data", detail: "Configuration parameters and test cases input values are kept in external data structures." },
      { id: "fn-utils", label: "JsonUtils.java", xPct: 32, yPct: 50, desc: "JSON Deserialiser Utility", detail: "JsonUtils reads the classpath file input streams and converts strings to Java Maps using Jackson/Gson." },
      { id: "fn-basepage", label: "BasePage.java", xPct: 54, yPct: 50, desc: "Locator Map Cache", detail: "BasePage loads locator maps at constructor stage, providing common click/type wrappers." },
      { id: "fn-loginpage", label: "LoginPage.java", xPct: 76, yPct: 50, desc: "Page Object Hydration", detail: "LoginPage inherits the locators list and uses page.fill(locators.get('btn'), data.get('val')) at runtime." },
      { id: "fn-driver", label: "DriverManager", xPct: 92, yPct: 50, desc: "Playwright Browser Action", detail: "Resolved selector queries are fired to the active page instance inside the current sandboxed thread." }
    ],
    connections: [
      { from: "fn-locators", to: "fn-utils" },
      { from: "fn-data", to: "fn-utils" },
      { from: "fn-utils", to: "fn-basepage" },
      { from: "fn-basepage", to: "fn-loginpage" },
      { from: "fn-loginpage", to: "fn-driver" }
    ],
    steps: [
      { activeNode: "fn-locators", activeLine: 0, text: "locators.json: Declarative Selector Repository", info: "UI elements (CSS selectors, XPath expressions, text tags) are stored externally in locators.json. This decouples HTML design structures from compiled Java source code. If a frontend button class is renamed, developers update the JSON dictionary file without needing to rebuild or recompile the Java code." },
      { activeNode: "fn-data", activeLine: 1, text: "testdata.json: Data-Driven Parameters Registry", info: "Externalizes all input parameter values (such as test credentials, amounts, and expected assertions). Storing test data in JSON allows QA engineers to scale test coverage by feeding different datasets or running dynamic combinations without altering core test logic." },
      { activeNode: "fn-utils", activeLine: 2, text: "JsonUtils.java: JSON Stream Deserialiser", info: "At framework bootstrap, the JsonUtils parser reads locators and data files from the project classpath. It parses the JSON text streams using mappers (like Jackson or Gson) and builds strongly-typed Map<String, String> collection models in memory for fast lookup." },
      { activeNode: "fn-basepage", activeLine: 3, text: "BasePage.java: Locator Map Caching", info: "BasePage acts as the parent class for all Page Objects. Its constructor caches the loaded locator maps from JsonUtils. It exposes generic, robust Playwright click/type action wrappers that automatically catch element synchronization problems and log errors to reports." },
      { activeNode: "fn-loginpage", activeLine: 4, text: "LoginPage.java: Dynamic Page Object Hydration", info: "LoginPage inherits from BasePage. Instead of hardcoded strings, its methods fetch locators dynamically: page.locator(locators.get(\"usernameField\")).fill(data.get(\"username\")). This runtime binding enables non-developers to maintain selectors and test cases easily." },
      { activeNode: "fn-driver", activeLine: 5, text: "DriverManager: CDP Element Execution & Cleanup", info: "The resolved locators and parameters are passed to the thread's active Playwright Page instance. Playwright translates these queries into Chrome DevTools Protocol commands, executing actions on the target element. Upon execution, memory caches are cleared to prevent memory leaks." }
    ]
  }
};

function initFlowVisualiser() {
  const selectEl = document.getElementById("flow-select");
  const speedEl = document.getElementById("flow-speed");
  const playBtn = document.getElementById("btn-play-flow");
  const resetBtn = document.getElementById("btn-reset-flow");
  
  if (!selectEl || !playBtn || !resetBtn) return;
  
  selectEl.addEventListener("change", (e) => {
    activeFlowType = e.target.value;
    resetFlow();
  });
  
  if (speedEl) {
    speedEl.addEventListener("change", (e) => {
      flowSpeedMultiplier = parseFloat(e.target.value) || 1.0;
    });
  }
  
  playBtn.addEventListener("click", () => {
    if (flowInterval || animationFrameId) {
      pauseFlow();
    } else {
      startFlow();
    }
  });
  
  resetBtn.addEventListener("click", resetFlow);
  
  // Render the initial static diagram
  renderFlowDiagram();
}

function renderFlowDiagram() {
  const canvas = document.getElementById("flow-canvas");
  if (!canvas) return;
  
  // Clear canvas
  canvas.innerHTML = "";
  
  const currentFlow = flowData[activeFlowType];
  const canvasW = canvas.clientWidth || 1000;
  const canvasH = canvas.clientHeight || 420;
  
  // 1. Render HTML nodes first so they exist in the DOM and can be measured
  const nodeDimensions = {};
  currentFlow.nodes.forEach(node => {
    const div = document.createElement("div");
    div.setAttribute("id", node.id);
    div.setAttribute("class", "flow-node");
    
    // Position elements centered at the percentage coordinate.
    // Append to DOM first to resolve text-based width/height layout offsets.
    canvas.appendChild(div);
    div.innerText = node.label;
    div.setAttribute("title", `${node.desc}: ${node.detail}`);
    
    const nodeW = div.offsetWidth || 100;
    const nodeH = div.offsetHeight || 30;
    
    const absoluteX = (node.xPct / 100) * canvasW - nodeW / 2;
    const absoluteY = (node.yPct / 100) * canvasH - nodeH / 2;
    
    div.style.left = `${absoluteX}px`;
    div.style.top = `${absoluteY}px`;
    
    nodeDimensions[node.id] = {
      x: absoluteX,
      y: absoluteY,
      width: nodeW,
      height: nodeH
    };
  });
  
  // 2. Create SVG overlay for connection paths
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "flow-svg-overlay");
  canvas.appendChild(svg);

  // Create SVG Defs for markers
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  
  // Define default arrowhead
  const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
  marker.setAttribute("id", "arrowhead");
  marker.setAttribute("viewBox", "0 0 10 10");
  marker.setAttribute("refX", "7");
  marker.setAttribute("refY", "5");
  marker.setAttribute("markerWidth", "6");
  marker.setAttribute("markerHeight", "6");
  marker.setAttribute("orient", "auto");
  const markerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  markerPath.setAttribute("d", "M 0 1.5 L 8 5 L 0 8.5 z");
  markerPath.setAttribute("fill", "rgba(255, 255, 255, 0.2)");
  marker.appendChild(markerPath);
  defs.appendChild(marker);

  // Define active arrowhead
  const markerActive = document.createElementNS("http://www.w3.org/2000/svg", "marker");
  markerActive.setAttribute("id", "arrowhead-active");
  markerActive.setAttribute("viewBox", "0 0 10 10");
  markerActive.setAttribute("refX", "7");
  markerActive.setAttribute("refY", "5");
  markerActive.setAttribute("markerWidth", "6");
  markerActive.setAttribute("markerHeight", "6");
  markerActive.setAttribute("orient", "auto");
  const markerPathActive = document.createElementNS("http://www.w3.org/2000/svg", "path");
  markerPathActive.setAttribute("d", "M 0 1.5 L 8 5 L 0 8.5 z");
  markerPathActive.setAttribute("fill", "#22d3ee");
  markerActive.appendChild(markerPathActive);
  defs.appendChild(markerActive);

  // Define completed arrowhead
  const markerCompleted = document.createElementNS("http://www.w3.org/2000/svg", "marker");
  markerCompleted.setAttribute("id", "arrowhead-completed");
  markerCompleted.setAttribute("viewBox", "0 0 10 10");
  markerCompleted.setAttribute("refX", "7");
  markerCompleted.setAttribute("refY", "5");
  markerCompleted.setAttribute("markerWidth", "6");
  markerCompleted.setAttribute("markerHeight", "6");
  markerCompleted.setAttribute("orient", "auto");
  const markerPathCompleted = document.createElementNS("http://www.w3.org/2000/svg", "path");
  markerPathCompleted.setAttribute("d", "M 0 1.5 L 8 5 L 0 8.5 z");
  markerPathCompleted.setAttribute("fill", "rgba(129, 140, 248, 0.65)");
  markerCompleted.appendChild(markerPathCompleted);
  defs.appendChild(markerCompleted);

  svg.appendChild(defs);
  
  // 3. Render connections edge-to-edge based on center alignments
  currentFlow.connections.forEach((conn, index) => {
    const fromNode = currentFlow.nodes.find(n => n.id === conn.from);
    const toNode = currentFlow.nodes.find(n => n.id === conn.to);
    if (!fromNode || !toNode) return;
    
    const fromDim = nodeDimensions[conn.from];
    const toDim = nodeDimensions[conn.to];
    
    const fromW = fromDim.width;
    const fromH = fromDim.height;
    const toW = toDim.width;
    const toH = toDim.height;
    
    const fromXCenter = fromDim.x + fromW / 2;
    const fromYCenter = fromDim.y + fromH / 2;
    const toXCenter = toDim.x + toW / 2;
    const toYCenter = toDim.y + toH / 2;
    
    const dx = toXCenter - fromXCenter;
    const dy = toYCenter - fromYCenter;
    
    let fromX, fromY, toX, toY;
    
    // Safety distance to prevent arrowhead clashing with node borders
    const padding = 6;
    
    if (Math.abs(dx) < 5) {
      // Vertically aligned nodes (centers match)
      fromX = fromXCenter;
      toX = toXCenter;
      if (dy > 0) {
        // Downward connection
        fromY = fromDim.y + fromH;
        toY = toDim.y - padding;
      } else {
        // Upward connection
        fromY = fromDim.y;
        toY = toDim.y + toH + padding;
      }
    } else {
      // Diagonal/Horizontal nodes
      if (dx > 0) {
        // Left to Right
        fromX = fromDim.x + fromW;
        fromY = fromYCenter;
        toX = toDim.x - padding;
        toY = toYCenter;
      } else {
        // Right to Left (backward loop)
        fromX = fromDim.x;
        fromY = fromYCenter;
        toX = toDim.x + toW + padding;
        toY = toYCenter;
      }
    }
    
    // Create line element
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("id", `line-${index}`);
    path.setAttribute("class", "flow-line");
    path.setAttribute("marker-end", "url(#arrowhead)");
    
    let d = `M ${fromX} ${fromY}`;
    if (Math.abs(fromY - toY) < 5) {
      // Nearly horizontal — straight line
      d += ` L ${toX} ${toY}`;
    } else if (Math.abs(fromX - toX) < 5) {
      // Nearly vertical — straight line
      d += ` L ${toX} ${toY}`;
    } else {
      // Diagonal — cubic Bezier S-curve. The two control points share the same X (midpoint between from and to)
      // but each uses the Y of its respective endpoint, so the curve smoothly bends between the two nodes.
      const controlX = fromX + (toX - fromX) * 0.5;
      d += ` C ${controlX} ${fromY}, ${controlX} ${toY}, ${toX} ${toY}`;
    }
    
    path.setAttribute("d", d);
    svg.appendChild(path);
  });
  
  // 4. Render energy pulse packet
  const pulse = document.createElement("div");
  pulse.setAttribute("id", "flow-pulse-packet");
  pulse.setAttribute("class", "flow-pulse");
  pulse.style.display = "none";
  
  // Insert high-fidelity glowing orb structure
  pulse.innerHTML = `
    <div class="pulse-particle"></div>
    <div class="pulse-trail"></div>
  `;
  canvas.appendChild(pulse);
  
  // Position pulse at initial node center point
  if (currentFlow.nodes.length > 0) {
    const firstNode = currentFlow.nodes[0];
    const firstDim = nodeDimensions[firstNode.id];
    const firstW = firstDim ? firstDim.width : 100;
    const firstH = firstDim ? firstDim.height : 30;
    const initX = firstDim.x + firstW / 2;
    const initY = firstDim.y + firstH / 2;
    pulse.style.transform = `translate3d(${initX}px, ${initY}px, 0) translate(-50%, -50%)`;
  }
  
  // Update detail card
  updateFlowExplanation(0);
}

function updateFlowExplanation(stepIndex) {
  const currentFlow = flowData[activeFlowType];
  const step = currentFlow.steps[stepIndex];
  if (!step) return;
  
  const badge = document.getElementById("flow-step-badge");
  const title = document.getElementById("flow-step-title");
  const desc = document.getElementById("flow-step-desc");
  
  if (badge) badge.innerText = `Step ${stepIndex + 1} of ${currentFlow.steps.length}`;
  if (title) title.innerText = step.text;
  if (desc) desc.innerText = step.info;
}

function startFlow() {
  const playBtn = document.getElementById("btn-play-flow");
  if (playBtn) playBtn.innerText = "⏸ Pause Flow";
  
  const currentFlow = flowData[activeFlowType];
  
  // If starting/finished, reset step counter
  if (currentFlowStep >= currentFlow.steps.length) {
    currentFlowStep = 0;
    // Clear node classes
    document.querySelectorAll(".flow-node").forEach(n => {
      n.classList.remove("active", "completed");
    });
    document.querySelectorAll(".flow-line").forEach(l => {
      l.classList.remove("active", "completed");
      l.setAttribute("marker-end", "url(#arrowhead)");
    });
  }
  
  runFlowLoop();
}

// runFlowLoop is a self-scheduling loop: instead of a setInterval that fires blindly every N ms,
// each call schedules the NEXT call via setTimeout only after the current animation finishes.
// This means animation and pause durations can vary per step without drift or overlap.
function runFlowLoop() {
  const currentFlow = flowData[activeFlowType];

  if (currentFlowStep >= currentFlow.steps.length) {
    stopFlow();
    return;
  }

  const step = currentFlow.steps[currentFlowStep];

  // Dividing by the multiplier speeds things up — 2x speed = half the wait time
  const transitionDuration = 1000 / flowSpeedMultiplier;
  const pauseDuration = 2200 / flowSpeedMultiplier;
  
  if (currentFlowStep === 0) {
    // Immediate highlight for first step
    highlightStepNode(step.activeNode);
    updateFlowExplanation(0);
    
    // Set timer for next transition step
    flowInterval = setTimeout(() => {
      currentFlowStep++;
      runFlowLoop();
    }, pauseDuration);
  } else {
    // Animate along connection path index = currentFlowStep - 1
    const lineIndex = currentFlowStep - 1;
    const pathEl = document.getElementById(`line-${lineIndex}`);
    
    // Activate connecting line
    if (pathEl) {
      pathEl.classList.add("active");
      pathEl.setAttribute("marker-end", "url(#arrowhead-active)");
    }
    
    animatePulseAlongPath(pathEl, transitionDuration, () => {
      // Complete connection line
      if (pathEl) {
        pathEl.classList.remove("active");
        pathEl.classList.add("completed");
        pathEl.setAttribute("marker-end", "url(#arrowhead-completed)");
      }
      
      // Highlight destination node
      highlightStepNode(step.activeNode);
      updateFlowExplanation(currentFlowStep);
      
      // Keep state static based on selected speed
      flowInterval = setTimeout(() => {
        currentFlowStep++;
        runFlowLoop();
      }, pauseDuration);
    });
  }
}

function highlightStepNode(activeNodeId) {
  const currentFlow = flowData[activeFlowType];
  const activeNodeIdx = currentFlow.steps.findIndex(s => s.activeNode === activeNodeId);
  
  document.querySelectorAll(".flow-node").forEach(n => {
    if (n.id === activeNodeId) {
      n.classList.add("active");
      n.classList.remove("completed");
    } else {
      const nodeStepIdx = currentFlow.steps.findIndex(s => s.activeNode === n.id);
      if (nodeStepIdx !== -1 && nodeStepIdx < activeNodeIdx) {
        n.classList.add("completed");
        n.classList.remove("active");
      } else {
        n.classList.remove("active", "completed");
      }
    }
  });
}

function animatePulseAlongPath(pathElement, duration, onComplete) {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  
  if (!pathElement) {
    onComplete();
    return;
  }
  
  const pathLength = pathElement.getTotalLength();
  const pulse = document.getElementById("flow-pulse-packet");
  if (!pulse) {
    onComplete();
    return;
  }
  
  pulse.style.display = "flex";
  pulse.style.transition = "none";
  
  const startTime = performance.now();

  function frame(now) {
    const elapsed = now - startTime;
    // progress goes 0 → 1 linearly over the duration; Math.min clamps it so it never exceeds 1
    const progress = Math.min(elapsed / duration, 1);

    // easeInOutCubic: starts slow, accelerates through the middle, slows at the end.
    // The two branches are a single cubic curve split at the midpoint (progress = 0.5).
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    // getPointAtLength() is a browser SVG API — give it a distance along the path, get back {x, y} coordinates
    const currentDistance = ease * pathLength;
    const point = pathElement.getPointAtLength(currentDistance);
    
    // GPU hardware accelerated translation. Symmetrical orb needs no tangent rotation.
    pulse.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%)`;
    
    if (progress < 1) {
      animationFrameId = requestAnimationFrame(frame);
    } else {
      onComplete();
    }
  }
  
  animationFrameId = requestAnimationFrame(frame);
}

function pauseFlow() {
  if (flowInterval) {
    clearTimeout(flowInterval);
    flowInterval = null;
  }
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  const playBtn = document.getElementById("btn-play-flow");
  if (playBtn) playBtn.innerText = "▶ Resume Flow";
}

function stopFlow() {
  pauseFlow();
  const playBtn = document.getElementById("btn-play-flow");
  if (playBtn) playBtn.innerText = "▶ Play Flow";
  
  const pulse = document.getElementById("flow-pulse-packet");
  if (pulse) pulse.style.display = "none";
}

function resetFlow() {
  stopFlow();
  currentFlowStep = 0;
  renderFlowDiagram();
}

// ============================================================
// HELPER FUNCTIONS FOR INTERACTIVE CODE VIEWER IN DASHBOARD
// ============================================================
function escAttr(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderInteractiveCode(codeLines, lang) {
  let html = `<div class="code-block-wrapper">
    <div class="code-block-header">
      <div class="code-block-title">Interactive Code Snippet</div>
      <div class="code-block-lang">${lang}</div>
    </div>
    <div class="code-block-body">`;

  codeLines.forEach((lineText, lineIdx) => {
    let explanation = generateExplanation(lineText, lang);
    let highlighted = highlight(lineText, lang);
    let hasExpl = explanation ? ' has-explanation' : '';
    let explAttr = explanation ? ` data-explanation="${escAttr(explanation)}"` : '';
    let codeAttr = ` data-code="${escAttr(lineText.trim())}"`;
    html += `<div class="code-line${hasExpl}"${codeAttr}${explAttr}>
      <span class="line-num">${lineIdx + 1}</span>
      <span class="line-content">${highlighted}</span>
    </div>`;
  });

  html += `</div></div>`;
  return html;
}

function wireInteractiveCodeLines(container) {
  let popup = document.getElementById('eli20-db-popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'eli20-db-popup';
    popup.className = 'eli20-dashboard-popup';
    popup.innerHTML = `
      <div class="popup-label">ELI20 Explanation</div>
      <div class="popup-code" id="eli20-db-popup-code"></div>
      <div class="popup-text" id="eli20-db-popup-text"></div>
      <div class="popup-dismiss">Click anywhere or press Esc to dismiss</div>
    `;
    document.body.appendChild(popup);

    document.addEventListener('click', (e) => {
      if (!popup.contains(e.target) && !e.target.closest('.code-line.has-explanation')) {
        hideDbPopup();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hideDbPopup();
    });
  }

  let activeLine = null;

  function showDbPopup(lineEl, codeText, explanationText) {
    if (activeLine === lineEl) {
      hideDbPopup();
      return;
    }
    if (activeLine) activeLine.classList.remove('active-line');
    activeLine = lineEl;
    lineEl.classList.add('active-line');

    const popupCode = document.getElementById('eli20-db-popup-code');
    const popupText = document.getElementById('eli20-db-popup-text');

    popupCode.textContent = codeText;
    popupText.textContent = explanationText;
    popup.classList.add('visible');

    const rect = lineEl.getBoundingClientRect();
    const ph = popup.offsetHeight;
    const pw = popup.offsetWidth;

    let top = rect.bottom + 8;
    let left = rect.left + 30;

    if (top + ph > window.innerHeight) top = rect.top - ph - 8;
    if (left + pw > window.innerWidth) left = window.innerWidth - pw - 16;
    if (left < 8) left = 8;

    popup.style.top = top + 'px';
    popup.style.left = left + 'px';
  }

  function hideDbPopup() {
    popup.classList.remove('visible');
    if (activeLine) {
      activeLine.classList.remove('active-line');
      activeLine = null;
    }
  }

  const lines = container.querySelectorAll('.code-line.has-explanation');
  lines.forEach(lineEl => {
    lineEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const code = lineEl.getAttribute('data-code');
      const expl = lineEl.getAttribute('data-explanation');
      showDbPopup(lineEl, code, expl);
    });
  });
}

// ─── SIMPLE SYNTAX HIGHLIGHT ───
function highlight(code, lang) {
  const matches = [];

  function addMatch(start, end, type) {
    matches.push({ start, end, type });
  }

  function runRegex(regex, type, groupIndex = 0) {
    if (regex.global) regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(code)) !== null) {
      let text = match[groupIndex];
      let start = match.index;
      if (groupIndex > 0) {
        start += match[0].indexOf(text);
      }
      addMatch(start, start + text.length, type);
    }
  }

  if (lang === 'java' || lang === 'unknown' || lang === '') {
    runRegex(/(\/\/.*$)/g, 'cm');
    runRegex(/(\/\*[\s\S]*?\*\/)/g, 'cm');
    runRegex(/("(?:[^"\\]|\\.)*")/g, 'str');
    runRegex(/('(?:[^'\\]|\\.)*')/g, 'str');
    runRegex(/(@\w+)/g, 'ann');
    runRegex(/\b(public|private|protected|static|final|abstract|class|interface|extends|implements|import|package|new|return|if|else|for|while|do|switch|case|default|break|continue|try|catch|finally|throw|throws|void|int|long|double|float|boolean|char|byte|short|null|true|false|this|super|instanceof)\b/g, 'kw');
    runRegex(/\b(\d+[lLfFdD]?)\b/g, 'num');
  }
  else if (lang === 'javascript' || lang === 'js' || lang === 'typescript' || lang === 'ts') {
    runRegex(/(\/\/.*$)/g, 'cm');
    runRegex(/(\/\*[\s\S]*?\*\/)/g, 'cm');
    runRegex(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g, 'str');
    runRegex(/\b(const|let|var|function|async|await|return|if|else|for|while|new|try|catch|finally|throw|import|export|from|require|module|class|extends|true|false|null|undefined|typeof|instanceof)\b/g, 'kw');
    runRegex(/\b(\d+)\b/g, 'num');
  }
  else if (lang === 'gherkin') {
    runRegex(/(#.*$)/g, 'cm');
    if (code.match(/^\s*(Feature:|Scenario:|Scenario Outline:|Given|When|Then|And|But|Background:|Examples:)/)) {
      let regex = /^\s*(Feature:|Scenario:|Scenario Outline:|Given|When|Then|And|But|Background:|Examples:)/g;
      let match;
      while ((match = regex.exec(code)) !== null) {
        let kwText = match[1];
        let spacesLen = match[0].length - kwText.length;
        addMatch(match.index + spacesLen, match.index + match[0].length, 'kw');
      }
    }
    runRegex(/("(?:[^"\\]|\\.)*")/g, 'str');
    runRegex(/(<\w+>)/g, 'tp');
    runRegex(/(@\w+)/g, 'ann');
  }
  else if (lang === 'xml') {
    runRegex(/(<!--[\s\S]*?-->)/g, 'cm');
    let tagRegex = /(<\/?[a-zA-Z0-9:-]+)/g;
    let match;
    while ((match = tagRegex.exec(code)) !== null) {
      let isClosing = match[0].startsWith('</');
      let prefixLen = isClosing ? 2 : 1;
      addMatch(match.index + prefixLen, match.index + match[0].length, 'kw');
    }
    runRegex(/("(?:[^"\\]|\\.)*")/g, 'str');
  }
  else if (lang === 'json') {
    let keyRegex = /("(?:[^"\\]|\\.)*")\s*:/g;
    let keyMatch;
    while ((keyMatch = keyRegex.exec(code)) !== null) {
      addMatch(keyMatch.index, keyMatch.index + keyMatch[1].length, 'tp');
    }
    let valRegex = /:(\s*)("(?:[^"\\]|\\.)*")/g;
    let valMatch;
    while ((valMatch = valRegex.exec(code)) !== null) {
      let valStart = valMatch.index + valMatch[0].indexOf(valMatch[2]);
      addMatch(valStart, valStart + valMatch[2].length, 'str');
    }
    runRegex(/\b(true|false|null)\b/g, 'kw');
    runRegex(/\b(\d+\.?\d*)\b/g, 'num');
  }
  else if (lang === 'yaml' || lang === 'yml') {
    runRegex(/(#.*$)/g, 'cm');
    let keyRegex = /^([\w_-]+):/gm;
    let keyMatch;
    while ((keyMatch = keyRegex.exec(code)) !== null) {
      addMatch(keyMatch.index, keyMatch.index + keyMatch[1].length, 'tp');
    }
    runRegex(/("(?:[^"\\]|\\.)*")/g, 'str');
  }
  else if (lang === 'properties') {
    runRegex(/(#.*$)/g, 'cm');
    let keyRegex = /^([\w._-]+)\s*=/gm;
    let keyMatch;
    while ((keyMatch = keyRegex.exec(code)) !== null) {
      addMatch(keyMatch.index, keyMatch.index + keyMatch[1].length, 'tp');
    }
  }

  // Sort by start position; when two matches start at the same spot, keep the longer one (b.end - a.end = descending)
  matches.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return b.end - a.end;
  });

  // Walk the sorted list and greedily pick non-overlapping matches.
  // lastEnd tracks where the previous match ended — any match starting before that position is skipped
  // because it would overlap with a match we already accepted.
  const activeMatches = [];
  let lastEnd = 0;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      activeMatches.push(m);
      lastEnd = m.end;
    }
  }

  let result = '';
  let i = 0;
  let matchIdx = 0;

  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  while (i < code.length) {
    if (matchIdx < activeMatches.length && i === activeMatches[matchIdx].start) {
      const m = activeMatches[matchIdx];
      const tokenText = code.substring(m.start, m.end);
      result += '<span class="' + m.type + '">' + escapeHTML(tokenText) + '</span>';
      i = m.end;
      matchIdx++;
    } else {
      result += escapeHTML(code[i]);
      i++;
    }
  }

  return result;
}

// ─── DYNAMIC EXPLANATION GENERATOR ───
function generateExplanation(line, lang) {
  let s = line.trim();
  if (!s || s.length <= 2) return null;
  if (["{", "}", "};", "});", ");", "]", "],", "},", "});", "));", "});", ");"].includes(s)) return null;
  if (s.startsWith("//") || s.startsWith("/*") || s.startsWith("*") || s.startsWith("*/")) {
    return "💬 Code comment: " + s.replace(/^[\/\*\s]+|[\/\*\s]+$/g, "");
  }
  if (s.startsWith("#") && ["gherkin", "properties", "yaml"].includes(lang)) {
    return "💬 Comment: " + s.replace(/^#\s*/, "");
  }

  if (lang === "java" || lang === "unknown" || lang === "") {
    if (s.startsWith("import ")) {
      let lib = s.replace("import ", "").replace(";", "");
      let parts = lib.split(".");
      let last = parts[parts.length - 1];
      if (last === "*") {
        return `📦 Import all classes from the '${parts.slice(0, -1).join(".")}' package — makes them available for use in this file`;
      }
      return `📦 Import '${last}' — brings this specific class into scope so we can use it below without the full package path`;
    }
    if (/^\s*(public\s+)?class\s+\w+/.test(s)) {
      let match = s.match(/class\s+(\w+)/);
      let name = match ? match[1] : "?";
      if (s.includes("extends")) {
        let parent = s.split("extends")[1].split("{")[0].split("<")[0].trim();
        return `🏗️ Class '${name}' extends '${parent}' — inherits all of the parent's methods and fields, adding or overriding its own`;
      }
      if (s.includes("implements")) {
        let iface = s.split("implements")[1].split("{")[0].trim();
        return `🏗️ Class '${name}' implements '${iface}' — promises to provide concrete bodies for all methods defined in that interface`;
      }
      return `🏗️ Class declaration '${name}' — this class bundles related data and behavior into one reusable unit`;
    }
    if (s.includes("abstract class")) {
      let match = s.match(/class\s+(\w+)/);
      let name = match ? match[1] : "?";
      return `🏗️ Abstract class '${name}' — a blueprint that cannot be instantiated directly; subclasses must fill in the abstract methods`;
    }
    if (/^\s*(public|private|protected|static|\@Override).*\(.*\)\s*\{?\s*$/.test(s) && !s.includes("new ") && !s.split("(")[0].includes("=")) {
      if (s.includes("main(")) {
        return `🚀 The main() method — JVM entry point. Execution starts here. We create test inputs, call our algorithm, and print the results`;
      }
      let match = s.match(/\b(\w+)\s*\(/);
      let mname = match ? match[1] : "method";
      if (s.includes("void")) {
        return `⚙️ Method '${mname}()' — performs an action but returns nothing (void). Think of it as a command: 'do this thing'`;
      }
      let rmatch = s.match(/(int|String|boolean|long|double|char|List|Map|Set|TreeNode|ListNode|Node|int\[\]|Object)\s+(\w+)\s*\(/);
      let rtype = rmatch ? rmatch[1] : "a value";
      return `⚙️ Method '${mname}()' — processes input and returns ${rtype}. This is where the core logic/algorithm lives`;
    }
    if (/^\s*\w+\s*\(.*\)\s*\{/.test(s) && !/(if|while|for|switch)/.test(s)) {
      let match = s.match(/(\w+)\s*\(/);
      if (match) {
        return `🔧 Constructor '${match[1]}()' — automatically called when you write 'new ${match[1]}(...)'. Initializes the object's state`;
      }
    }
    if (s.includes("new HashMap") || s.includes("new LinkedHashMap")) {
      let match = s.match(/(\w+)\s*=\s*new/);
      let vname = match ? match[1] : "map";
      let dtype = s.includes("new LinkedHashMap") ? "LinkedHashMap (preserves insertion order)" : "HashMap";
      return `🗂️ Create ${dtype} '${vname}' — a key→value lookup table. Average O(1) time for get/put operations. Like a dictionary where you look up words instantly`;
    }
    if (s.includes("new HashSet") || s.includes("new LinkedHashSet")) {
      let match = s.match(/(\w+)\s*=\s*new/);
      let vname = match ? match[1] : "set";
      return `🔵 Create HashSet '${vname}' — stores only unique elements. If you try to add a duplicate, .add() returns false. O(1) lookup`;
    }
    if (s.includes("new ArrayList")) {
      let match = s.match(/(\w+)\s*=\s*new/);
      let vname = match ? match[1] : "list";
      return `📋 Create ArrayList '${vname}' — a dynamic array that automatically grows as you add elements. Access by index in O(1)`;
    }
    if (s.includes("new PriorityQueue")) {
      let match = s.match(/(\w+)\s*=\s*new/);
      let vname = match ? match[1] : "pq";
      return `⛰️ Create PriorityQueue '${vname}' — a min-heap. The smallest element always sits at the top. poll() gives you the min in O(log n)`;
    }
    if (s.includes("new Stack")) {
      let match = s.match(/(\w+)\s*=\s*new/);
      let vname = match ? match[1] : "stack";
      return `📚 Create Stack '${vname}' — Last-In-First-Out (LIFO). push() adds to top, pop() removes from top. Think of a stack of plates`;
    }
    if (s.includes("new TreeMap")) {
      let match = s.match(/(\w+)\s*=\s*new/);
      let vname = match ? match[1] : "map";
      return `🌳 Create TreeMap '${vname}' — a sorted map backed by a Red-Black Tree. Keys are always in sorted order. O(log n) operations`;
    }
    if (s.includes("new TreeSet")) {
      return `🌳 Create TreeSet — stores unique elements in sorted order using a Red-Black Tree. O(log n) insert/lookup`;
    }
    if (s.includes("new StringBuilder")) {
      let match = s.match(/(\w+)\s*=\s*new/);
      let vname = match ? match[1] : "sb";
      return `🔤 Create StringBuilder '${vname}' — a mutable character buffer. MUCH faster than string concatenation in loops (avoids creating hundreds of temporary String objects)`;
    }
    if (s.includes("new ListNode") || s.includes("new Node")) {
      return `🔗 Create a new linked list node — each node holds a value and a 'next' pointer that chains to the following node`;
    }
    if (s.includes("new TreeNode")) {
      return `🌲 Create a new tree node — holds a value plus 'left' and 'right' child pointers forming a binary tree structure`;
    }
    if (s.includes("new ThreadLocal") || s.includes("ThreadLocal<")) {
      return `🧵 ThreadLocal variable — each thread gets its own independent copy of this value. Critical for parallel test execution: prevents threads from stepping on each other's data`;
    }
    if (/^\s*(final\s+)?(int|long|double|float|boolean|char|String|byte|short)\s+\w+\s*=/.test(s)) {
      let match = s.match(/(int|long|double|float|boolean|char|String|byte|short)\s+(\w+)\s*=\s*(.+)/);
      if (match) {
        let vtype = match[1], vname = match[2], vval = match[3].replace(";", "").trim();
        if (vval.length > 40) vval = vval.substring(0, 37) + "...";
        return `📌 Declare ${vtype} '${vname}' = ${vval} — this variable holds our working state as the algorithm progresses`;
      }
    }
    if (/^\s*(int|String|char|boolean|double|float|long)\[\]\s+\w+\s*=/.test(s)) {
      let match = s.match(/(\w+\[\])\s+(\w+)/);
      if (match) {
        return `📌 Create array '${match[2]}' of type ${match[1]} — a fixed-size collection of values stored contiguously in memory`;
      }
    }
    if (/^\s*for\s*\(/.test(s)) {
      if (s.includes(":")) {
        let match = s.match(/for\s*\(\s*\w+\s+(\w+)\s*:\s*(\w+)/);
        if (match) {
          return `🔄 Enhanced for-loop — visit each '${match[1]}' in '${match[2]}' one at a time, from first to last`;
        }
      }
      return `🔄 For-loop — repeat the code block, incrementing the counter each time until the boundary condition fails`;
    }
    if (/^\s*while\s*\(/.test(s)) {
      let match = s.match(/while\s*\((.+)\)/);
      let c = match ? match[1].trim() : "...";
      if (c.length > 50) c = c.substring(0, 47) + "...";
      return `🔄 While-loop — keep executing the body as long as (${c}) is true. The moment it's false, we exit`;
    }
    if (/^\s*if\s*\(/.test(s)) {
      let match = s.match(/if\s*\((.+)\)/);
      let c = match ? match[1].trim() : "...";
      if (c.length > 55) c = c.substring(0, 52) + "...";
      return `❓ Conditional check — if (${c}) evaluates to true, execute the next block; otherwise skip it entirely`;
    }
    if (/^\s*\}\s*else\s+if/.test(s)) {
      return `❓ Else-if — only checked when the previous 'if' was false. Allows chaining multiple conditions`;
    }
    if (/^\s*\}\s*else\s*\{/.test(s) || s === "else {") {
      return `❓ Else block — the fallback path. Executes when ALL previous if/else-if conditions were false`;
    }
    if (/^\s*return\s+/.test(s)) {
      let val = s.replace("return", "").replace(";", "").trim();
      if (val.length > 45) val = val.substring(0, 42) + "...";
      return `↩️ Return ${val} — send this value back to the caller. Method execution ends here`;
    }
    if (s.includes("System.out.println") || s.includes("System.out.print(")) {
      return `🖨️ Print to console — outputs the value to standard output so we can see the result during execution`;
    }
    if (s.startsWith("try")) {
      return `🛡️ Try block — execute this code, but if an exception is thrown, jump to the catch block instead of crashing`;
    }
    if (s.startsWith("catch")) {
      return `🛡️ Catch block — handles the exception thrown from the try block. The program continues instead of terminating`;
    }
    if (s.startsWith("finally")) {
      return `🛡️ Finally block — ALWAYS runs after try/catch regardless of success or failure. Used for cleanup (closing files, releasing resources)`;
    }
    if (s.startsWith("throw ")) {
      return `💥 Throw exception — signal that something went wrong. Execution halts and bubbles up to the nearest catch block`;
    }
    if (s.includes("Assert.")) {
      return `✅ Assertion — verify that the actual result matches the expected value. If they don't match, the test FAILS immediately with a descriptive message`;
    }
    if (s.includes(".add(")) {
      return `➕ Add element to the collection — the data structure grows by one entry`;
    }
    if (s.includes(".put(")) {
      return `➕ Insert/update a key-value pair in the map — if the key already exists, its old value is overwritten`;
    }
    if (s.includes(".poll(")) {
      return `⬆️ Poll (remove + return) the head element from the queue/heap — gives you the highest-priority item and removes it`;
    }
    if (s.includes(".peek(")) {
      return `👀 Peek at the top/head element WITHOUT removing it — useful for checking what's next in the queue/stack`;
    }
    if (s.includes(".push(")) {
      return `⬇️ Push element onto the top of the stack — it becomes the new top element (LIFO order)`;
    }
    if (s.includes(".pop(")) {
      return `⬆️ Pop the top element off the stack — removes and returns the most recently pushed item`;
    }
    if (s.includes("Arrays.sort(") || s.includes(".sort(")) {
      return `🔀 Sort elements in ascending order — this enables efficient patterns like binary search, two-pointer, or greedy approaches`;
    }
    if (s.includes("Collections.reverse(")) {
      return `🔀 Reverse the order of elements in the list — last becomes first, first becomes last`;
    }
    if (s.includes("Math.max(")) {
      return `📈 Take the maximum — keep track of the best/largest result seen so far as we iterate`;
    }
    if (s.includes("Math.min(")) {
      return `📉 Take the minimum — we want the smaller of the two options`;
    }
    if (s.includes("Math.sqrt(")) {
      return `📐 Square root — optimization: only need to check divisors up to √n to determine primality`;
    }
    if (s.includes("Math.pow(")) {
      return `📐 Raise to power — computes base^exponent for mathematical calculations`;
    }
    if (s.includes("^=")) {
      return `⊕ XOR assignment — the magic: a^a=0 and a^0=a. XOR-ing all numbers cancels out duplicates, leaving only the unique element`;
    }
    if (s.includes(".toCharArray()")) {
      return `🔤 Convert string → char array — lets us modify individual characters since Strings are immutable in Java`;
    }
    if (s.includes(".charAt(")) {
      return `🔤 Get the character at a specific index — zero-based, so charAt(0) is the first character`;
    }
    if (s.includes(".substring(")) {
      return `✂️ Extract a portion of the string — returns characters from startIndex (inclusive) to endIndex (exclusive)`;
    }
    if (s.includes(".split(")) {
      return `✂️ Split the string into parts using the delimiter — returns an array of substrings. Careful: the delimiter is a regex!`;
    }
    if (s.includes(".trim()") || s.includes(".strip()")) {
      return `✂️ Remove leading and trailing whitespace — prevents false mismatches in string comparisons`;
    }
    if (s.includes(".toLowerCase()")) {
      return `🔤 Convert to lowercase — standardizes text for case-insensitive comparison`;
    }
    if (s.includes(".toUpperCase()")) {
      return `🔤 Convert to uppercase — normalizes case for consistent matching`;
    }
    if (s.includes(".equals(")) {
      return `⚖️ Compare actual content (not memory addresses) — the CORRECT way to compare strings. Never use == for string values!`;
    }
    if (s.includes(".equalsIgnoreCase(")) {
      return `⚖️ Compare strings ignoring case — 'Hello'.equalsIgnoreCase('hello') returns true`;
    }
    if (s.includes(".contains(")) {
      return `🔍 Check if the string/collection contains this element — returns true if found, false otherwise`;
    }
    if (s.includes(".startsWith(")) {
      return `🔍 Check if the string begins with this prefix — useful for URL protocol or path validation`;
    }
    if (s.includes(".endsWith(")) {
      return `🔍 Check if the string ends with this suffix — useful for file extension checks`;
    }
    if (s.includes(".indexOf(")) {
      return `🔍 Find the position of the first occurrence — returns -1 if not found`;
    }
    if (s.includes(".replaceAll(")) {
      return `🔄 Replace all matches of the regex pattern with the replacement string — creates a new String`;
    }
    if (s.includes(".matches(")) {
      return `🔍 Test if the ENTIRE string matches this regex pattern — returns true/false`;
    }
    if (s.includes(".append(")) {
      return `🔤 Append to StringBuilder — efficiently builds the string character by character without creating new objects`;
    }
    if (s.includes(".toString()")) {
      return `🔤 Convert to immutable String — finalizes the StringBuilder content into a regular String`;
    }
    if (s.includes("String.format(")) {
      return `🔤 Format string with placeholders — %s for strings, %d for integers, %f for floats. Like printf but returns a String`;
    }
    if (s.includes("String.join(")) {
      return `🔤 Join strings with a delimiter between them — String.join(", ", list) produces 'a, b, c'`;
    }
    if (s.includes("String.valueOf(")) {
      return `🔤 Convert any value to its String representation — safer than .toString() because it handles null`;
    }
    if (s.includes(".intern()")) {
      return `🔤 Intern the string — move it into the String Constant Pool and return the canonical reference`;
    }
    if (s.includes(".concat(")) {
      return `🔤 Concatenate strings — creates a NEW String object (original stays unchanged because strings are immutable)`;
    }
    if (s.includes(".getOrDefault(")) {
      return `🔍 Get the value for this key, or return the default if the key doesn't exist — avoids NullPointerException`;
    }
    if (s.includes(".isEmpty()")) {
      return `❓ Check if empty — returns true if size/length is 0`;
    }
    if (s.includes(".length()")) {
      return `📏 Get string length — returns the number of characters`;
    }
    if (s.includes(".length") && !s.includes(".length()")) {
      return `📏 Array length property — returns the number of elements (no parentheses, unlike String.length())`;
    }
    if (s.startsWith("@Override")) {
      return `📝 @Override annotation — tells the compiler 'I'm intentionally overriding a parent method.' Catches typos in method names at compile-time`;
    }
    if (s.startsWith("@Test")) {
      return `🧪 @Test — marks this method as a test case. The test runner will automatically discover and execute it`;
    }
    if (s.startsWith("@Before")) {
      return `⏮️ @Before hook — runs BEFORE each test/scenario. Used for setup: initializing drivers, seeding data`;
    }
    if (s.startsWith("@After")) {
      return `⏭️ @After hook — runs AFTER each test/scenario. Used for teardown: screenshots on failure, closing browsers`;
    }
    if (s.startsWith("@CucumberOptions")) {
      return `⚙️ @CucumberOptions — configures the Cucumber test runner: which features to scan, step definition packages, report plugins, and tag filters`;
    }
    if (s.startsWith("@DataProvider")) {
      return `📊 @DataProvider — TestNG annotation that feeds data to test methods. parallel=true enables concurrent execution of scenarios`;
    }
    if (s.startsWith("@Given") || s.startsWith("@When") || s.startsWith("@Then")) {
      return `🥒 Cucumber step definition — maps a Gherkin step (Given/When/Then) to this Java method. Cucumber calls this when it sees the matching step text`;
    }
    if (s.includes("instanceof")) {
      return `❓ Type check — verify if the object is an instance of the specified class or its subclasses`;
    }
    if (s.endsWith("++;")) {
      let v = s.replace("++", "").replace(";", "").trim();
      return `➕ Increment '${v}' by 1 — move the pointer/counter forward`;
    }
    if (s.endsWith("--;")) {
      let v = s.replace("--", "").replace(";", "").trim();
      return `➖ Decrement '${v}' by 1 — move the pointer/counter backward`;
    }
    if (s.includes("this.") && s.includes("=")) {
      return `📌 Assign to instance field using 'this.' — distinguishes the object's field from a local variable with the same name`;
    }
    if (s.includes("super(")) {
      return `⬆️ Call parent constructor — must be the FIRST line in a child constructor. Sets up inherited state before child initialization`;
    }
    if (s.includes("switch") && s.includes("(")) {
      return `🔀 Switch statement — evaluate the expression and jump directly to the matching case label (faster than if-else chains for multiple values)`;
    }
    if (s.startsWith("case ")) {
      return `🏷️ Case label — execution enters here if the switch expression matches this value`;
    }
    if (s === "break;") {
      return `🛑 Break — exit the current loop or switch block immediately. Jump to the first line after the closing brace`;
    }
    if (s.startsWith("continue")) {
      return `⏭️ Continue — skip the rest of this iteration and jump straight to the next loop cycle`;
    }
    if (s.includes("new ") && s.includes("=")) {
      let match = s.match(/new\s+(\w+)/);
      if (match) {
        return `🔧 Create new instance of '${match[1]}' — allocate memory on the heap and call the constructor to initialize it`;
      }
    }
  }
  else if (["javascript", "js", "typescript", "ts"].includes(lang)) {
    if (s.includes("require(")) {
      let match = s.match(/require\(['"](.+?)['"]\)/);
      let lib = match ? match[1] : "module";
      return `📦 Import '${lib}' — loads this module so we can use its exported functions and objects`;
    }
    if (s.startsWith("import ")) {
      return `📦 ES module import — pulls in specific exports from another file or package`;
    }
    if (s.startsWith("test(") || s.startsWith("test.describe(")) {
      return `🧪 Define a test case — the test runner discovers this and executes the async callback inside`;
    }
    if (s.includes("async function") || s.includes("async (") || s.includes("async(")) {
      return `⚡ Async function — can use 'await' inside to pause execution until Promises resolve, making async code read like sync code`;
    }
    if (s.includes("await page.goto(")) {
      return `🌐 Navigate browser to this URL — await pauses until the page finishes loading`;
    }
    if (s.includes("await page.locator(") && s.includes(".click(")) {
      return `🖱️ Find element by selector and click it — Playwright auto-waits until it's visible, stable, and clickable`;
    }
    if (s.includes("await page.locator(") && s.includes(".fill(")) {
      return `⌨️ Find input field and type text — clears existing content first, then types the new value`;
    }
    if (s.includes("await expect(") || s.includes("expect(")) {
      return `✅ Assertion — verify the actual value matches expected. Test fails immediately with a clear error if it doesn't`;
    }
    if (s.includes("await request.get(")) {
      return `🌐 Send HTTP GET request — await pauses until the server responds. Used for fetching data from APIs`;
    }
    if (s.includes("await request.post(")) {
      return `🌐 Send HTTP POST request with body data — await pauses until the server processes and responds`;
    }
    if (s.includes("await response.json()") || s.includes("response.json()")) {
      return `📄 Parse response body as JSON — converts the raw text response into a JavaScript object we can inspect`;
    }
    if (s.includes("await page.route(") || s.includes("page.route(")) {
      return `🔀 Intercept network requests matching this URL pattern — we can mock/modify the response before the page sees it`;
    }
    if (s.includes("route.fulfill(")) {
      return `📨 Fulfill the intercepted request with a custom response — the page receives our mocked data instead of the real server's`;
    }
    if (s.includes("page.on(")) {
      return `📡 Register event listener — this callback fires whenever the specified browser event occurs`;
    }
    if (s.includes("page.frameLocator(")) {
      return `🖼️ Target an iframe — creates a locator scoped INSIDE the iframe's DOM, letting us interact with its elements`;
    }
    if (s.includes(".dragTo(")) {
      return `🖱️ Drag and drop — simulate dragging this element and dropping it onto the target element`;
    }
    if (s.includes(".setInputFiles(")) {
      return `📎 Attach file(s) to a file input — simulates the user selecting files in the file picker dialog`;
    }
    if (s.includes(".waitFor(")) {
      return `⏳ Wait for element to reach a specific state (visible, hidden, attached, detached) before proceeding`;
    }
    if (s.includes(".storageState(")) {
      return `💾 Save cookies + localStorage to a file — reusable for bypassing login in subsequent tests`;
    }
    if (s.includes("Promise.all(")) {
      return `⚡ Run multiple async operations in PARALLEL — much faster than sequential await. Resolves when ALL finish`;
    }
    if (s.includes("Promise.resolve(")) {
      return `⚡ Create an already-resolved Promise — useful for starting Promise chains or returning immediate values`;
    }
    if (s.includes("Promise.allSettled(")) {
      return `⚡ Wait for ALL promises regardless of success/failure — returns status objects for each`;
    }
    if (s.includes("Promise.race(")) {
      return `🏁 Race promises — resolves/rejects with whichever promise finishes FIRST`;
    }
    if (s.includes("new Promise(")) {
      return `⚡ Create a new Promise — wraps an async operation. Call resolve() on success, reject() on failure`;
    }
    if (s.includes("setTimeout(")) {
      return `⏰ Schedule code to run after a delay — callback goes to the macrotask queue, executes after microtasks`;
    }
    if (s.includes("console.log(")) {
      return `🖨️ Print to console — outputs the value for debugging and verification`;
    }
    if (s.includes("console.error(")) {
      return `🖨️ Print error to console — visually distinct from normal logs, appears in red`;
    }
    if (s.includes(".then(")) {
      return `⛓️ Promise .then() — this callback runs when the previous Promise resolves successfully. Returns a new Promise for chaining`;
    }
    if (s.includes(".catch(")) {
      return `⛓️ Promise .catch() — this callback runs if ANY Promise in the chain rejects (throws an error)`;
    }
    if (/^\s*(const|let|var)\s+/.test(s)) {
      let match = s.match(/(const|let|var)\s+(\w+)/);
      if (match) {
        let kw = match[1], vn = match[2];
        let scope_map = { "const": "constant (cannot reassign)", "let": "block-scoped (can reassign)", "var": "function-scoped (hoisted, legacy)" };
        return `📌 Declare ${scope_map[kw] || "variable"} '${vn}' — ${kw} determines the variable's scope and mutability rules`;
      }
    }
    if (/^\s*function\s+\w+/.test(s)) {
      let match = s.match(/function\s+(\w+)/);
      return `⚙️ Define function '${match ? match[1] : "func"}()' — a reusable block of logic that can be called by name`;
    }
    if (/^\s*return\s/.test(s)) {
      return `↩️ Return the result back to whoever called this function`;
    }
    if (s.includes("module.exports")) {
      return `📤 Export this object/config — makes it importable by other files using require()`;
    }
    if (s.startsWith("test.use(")) {
      return `⚙️ Configure test fixtures — apply shared settings (like pre-authenticated storage state) to all tests in this file`;
    }
    if (s.includes("projects:")) {
      return `⚙️ Test projects config — each project targets a different browser for cross-browser testing`;
    }
    if (s.includes("browserName:")) {
      return `🌐 Specify browser engine — chromium (Chrome/Edge), firefox, or webkit (Safari)`;
    }
    if (s.startsWith("if ") || s.startsWith("if(")) {
      return `❓ Conditional — execute the next block only if this condition is true`;
    }
    if (s === "else {" || s.includes("} else {")) {
      return `❓ Else — fallback when the if condition was false`;
    }
    if (/^\s*for\s*\(/.test(s)) {
      return `🔄 Loop — repeat for each iteration until the condition becomes false`;
    }
    if (s.startsWith("try")) {
      return `🛡️ Try — attempt this code; if it throws, jump to catch`;
    }
    if (s.startsWith("catch")) {
      return `🛡️ Catch — handle the error from the try block`;
    }
  }
  else if (lang === "gherkin") {
    if (s.startsWith("Feature:")) return `📋 Feature — high-level description of the business capability being tested`;
    if (s.startsWith("Scenario:") || s.startsWith("Scenario Outline:")) return `🧪 Scenario — one specific test case described in plain English with Given/When/Then steps`;
    if (s.startsWith("Given")) return `📍 Given — sets up the precondition. 'The world looks like THIS before we do anything'`;
    if (s.startsWith("When")) return `🎯 When — the user action or trigger event. 'The user DOES this thing'`;
    if (s.startsWith("Then")) return `✅ Then — the expected outcome. 'After the action, we expect THIS result'`;
    if (s.startsWith("And")) return `➕ And — additional step continuing from the previous Given/When/Then`;
    if (s.startsWith("Examples:")) return `📊 Examples table — data-driven: the scenario runs once per row, substituting the column values`;
    if (s.startsWith("@")) return `🏷️ Tag — label for filtering tests. e.g., @Smoke runs only smoke tests, @Regression runs the full suite`;
    if (s.startsWith("Background:")) return `📍 Background — shared steps that run before EVERY scenario in this feature file`;
  }
  else if (lang === "xml") {
    if (s.includes("<dependency>")) return `📦 Maven dependency block — declares a library the project needs. Maven downloads it automatically`;
    if (s.includes("<groupId>")) {
      let match = s.match(/>(.+)</);
      return `📦 Group ID '${match ? match[1] : ""}' — the organization/company that published this library`;
    }
    if (s.includes("<artifactId>")) {
      let match = s.match(/>(.+)</);
      return `📦 Artifact ID '${match ? match[1] : ""}' — the specific library name within the organization's group`;
    }
    if (s.includes("<version>")) {
      let match = s.match(/>(.+)</);
      return `📦 Version '${match ? match[1] : ""}' — pinned to ensure reproducible builds across all team members and CI`;
    }
    if (s.includes("<scope>")) {
      let match = s.match(/>(.+)</);
      return `📦 Scope '${match ? match[1] : ""}' — when this dependency is available (compile=always, test=only during testing)`;
    }
    if (s.includes("</dependency>")) return `📦 End of dependency declaration`;
  }
  else if (lang === "json") {
    if (s.includes(":")) {
      let key = s.split(":")[0].replace(/['"\s]/g, "");
      return `📄 JSON key '${key}' — maps to the value on the right. This data is consumed by the framework/tool at runtime`;
    }
  }
  else if (["properties", "ini", "config"].includes(lang)) {
    if (s.includes("=")) {
      let key = s.split("=")[0].trim();
      return `⚙️ Config: '${key}' — the framework reads this value at startup to configure behavior`;
    }
  }
  else if (["yaml", "yml"].includes(lang)) {
    if (s.includes(":") && !s.startsWith("#")) {
      let key = s.split(":")[0].trim();
      return `⚙️ YAML key '${key}' — configuration value used by the CI/CD pipeline or test runner`;
    }
  }

  return null;
}