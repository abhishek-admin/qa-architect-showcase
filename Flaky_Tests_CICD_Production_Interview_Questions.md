# Flaky Tests, CI/CD, Environments & Production Testing — SDET Interview Questions
> 5+ years SDET level. Covers flaky tests (UI + API), testing when things fail in production, environment testing, and a hands-on Jenkins / pipeline demo for people new to Jenkins.

---

## Table of Contents

**A. Flaky Tests**
1. What is a flaky test and why does it matter?
2. What are the common causes of flaky UI tests?
3. What are the common causes of flaky API tests?
4. How do you detect which tests are flaky?
5. How do you fix UI flakiness?
6. How do you fix API flakiness?
7. Should you auto-retry flaky tests? Retry vs quarantine.

**B. Production Failures**
8. A test passes in staging but fails in production — how do you investigate?
9. How do you test *in* production safely?
10. A bug reached production that your suite missed — what now?

**C. Environment Testing**
11. What is environment testing and environment parity?
12. How do you manage config and test data across environments?
13. How do you make environments reproducible? (Docker)

**D. Jenkins & CI/CD Pipelines**
14. What is CI/CD and why do testers care?
15. What is Jenkins? Core concepts.
16. **DEMO:** install Jenkins locally and run your first pipeline
17. **DEMO:** a real `Jenkinsfile` for a Maven + Playwright suite
18. Parallel / cross-browser execution in Jenkins
19. Publishing reports & artifacts
20. Triggers, parameters, and secrets
21. Jenkins vs GitHub Actions

---

# A. Flaky Tests

## 1. What is a flaky test and why does it matter?

**Answer:**
A **flaky test** is one that passes and fails on the *same code* without any change — its result is non-deterministic. Run it 10 times: 8 green, 2 red.

Why it matters at scale:
- **It destroys trust.** Once a suite is flaky, people stop believing red builds and start re-running until green — which means real regressions slip through.
- **It blocks pipelines.** A flaky test in a merge gate stalls every PR.
- **It hides real bugs.** A "flaky" failure is sometimes a genuine race condition in the *product*, not the test.

A useful definition for interviews: *"Flakiness is non-determinism in the test, the environment, or the system under test. My job is to find which of the three it is — because the fix is different for each."*

> Strong signal in interviews: *"A suite with a 1% flake rate is effectively useless at scale because it trains developers to ignore failing builds. I don't treat flakiness as a minor nuisance; I treat it as an active threat to pipeline integrity."*

---

## 2. What are the common causes of flaky UI tests?

**Answer:**

| Cause | Example | Real fix |
|---|---|---|
| **Hard sleeps / race conditions** | `Thread.sleep(2000)` then click | Web-first / explicit waits on state, not time |
| **Element not ready** | Click before hydration/animation done | Wait for actionability (visible + enabled + stable) |
| **Auto-waiting not used** | Manual `findElement` immediately | Use Playwright auto-waiting or Selenium `WebDriverWait` |
| **Unstable locators** | XPath tied to layout, dynamic IDs | Role/test-id locators (`data-testid`) |
| **Test data collisions** | Two tests use the same user in parallel | Unique data per test (UUID emails) |
| **Test ordering / shared state** | Test B depends on Test A's side effect | Independent, self-seeding tests |
| **Animations / transitions** | Modal still sliding in | Disable animations in test mode; wait for end-state |
| **Network timing** | Assert before XHR resolves | Wait for response / `networkidle` / spinner gone |
| **Viewport / focus** | Element off-screen, lost focus | Scroll into view; control window size |

**Golden rule:** *never assert on time, assert on state.*

```java
// ❌ flaky
Thread.sleep(3000);
assertTrue(driver.findElement(By.id("welcome")).isDisplayed());

// ✅ deterministic (Selenium)
new WebDriverWait(driver, Duration.ofSeconds(10))
    .until(ExpectedConditions.visibilityOfElementLocated(By.id("welcome")));
```

```java
// ✅ Playwright (Java) — web-first assertion auto-retries until timeout
assertThat(page.getByTestId("welcome")).isVisible();
```

> Strong signal in interviews: *"Whenever I see a hard sleep statement in a code review, it's an automatic reject. Sleeps are a lazy substitute for proper state synchronization. If you don't know the exact DOM or network state you are waiting for, you haven't finished designing the test."*

---

## 3. What are the common causes of flaky API tests?

**Answer:**

| Cause | Example | Real fix |
|---|---|---|
| **Async / eventual consistency** | POST returns 202, data not queryable yet | Poll the GET with backoff until it appears |
| **Shared mutable state** | Tests mutate the same record | Create-and-teardown per test; isolated tenants |
| **Rate limiting / throttling** | 429 under parallel load | Backoff + retry on 429; respect limits |
| **Time / ordering assumptions** | Assert `createdAt` exact value | Assert ranges/format, not exact timestamps |
| **Network blips** | Transient connection reset | Retry idempotent reads with capped attempts |
| **Test data leakage** | Leftover data from a prior run | Idempotent setup; unique keys |
| **Dependency on a flaky downstream** | 3rd-party sandbox is unstable | Mock/stub the unstable dependency; contract test |

```java
// ✅ poll for eventual consistency instead of sleeping
await().atMost(Duration.ofSeconds(15))
       .pollInterval(Duration.ofMillis(500))
       .untilAsserted(() ->
           given().get("/orders/" + id).then().statusCode(200));
```

> Strong signal in interviews: *"API flakiness usually boils down to data pollution or eventual consistency. I deal with eventual consistency by polling with bounded exponential backoff, and data pollution by ensuring every single test creates and cleans up its own unique, isolated resources."*

---

## 4. How do you detect which tests are flaky?

**Answer:**
You can't fix flakiness you can't *see*. Detection techniques:

1. **Re-run on failure and compare.** If a test fails then passes on retry with no code change → flaky. Most runners record this (e.g. TestNG `IRetryAnalyzer`, Playwright `--retries`, Surefire rerun).
2. **Flaky-test reports in CI.** Jenkins JUnit/Allure, GitHub Actions, or tools like **Playwright's flaky badge**, **Allure "retries"**, **Datadog/Launchable/BuildPulse** flag tests that flip.
3. **Nightly "stress" job.** Run the suite N times (e.g. `mvn test -Dsurefire.rerunFailingTestsCount=0` in a loop) and rank tests by failure rate.
4. **Quarantine list + dashboard.** Track flaky tests over time; measure flake rate as a quality KPI.

```bash
# crude local flake hunt — run a test 20x, count failures
for i in $(seq 1 20); do mvn -q -Dtest=CheckoutTest test || echo "FAIL run $i"; done
```

> Strong signal in interviews: *"You can't fix what you can't measure. I detect flakiness by graphing automated retry rates in CI over time. If a test fails and then passes in the same execution cycle, it's automatically flagged, quarantined, and assigned a ticket before it can pollute developer pipelines."*

---

## 5. How do you fix UI flakiness?

**Answer:** Attack the root cause, in this order:

1. **Replace sleeps with explicit/web-first waits.** Wait for the *condition* you actually need.
2. **Use resilient locators** — `getByRole`, `getByTestId`, accessible names — not brittle absolute XPath.
3. **Wait for the network/loading to settle**, not a fixed time.
4. **Disable animations** in a test profile (`prefers-reduced-motion`, CSS override).
5. **Isolate state** — each test seeds its own data via API (fast) before driving the UI.
6. **Control the environment** — fixed viewport, locale, timezone; clean session/storage.
7. **Last resort: a *small* retry** for genuinely non-deterministic 3rd-party widgets — but log it and quarantine, don't hide it.

A strong answer names the **API-seed-then-UI-verify** pattern: do setup over the API for speed and reliability, and only use the browser for the behavior you're actually testing.

> Strong signal in interviews: *"To eliminate UI flakiness, I leverage the API-seed-then-UI-verify pattern. I bypass the UI for test setup by seeding authentication and database state directly via API calls, so the browser is only used to test the exact UI path under inspection."*

---

## 6. How do you fix API flakiness?

**Answer:**
- **Poll for async results** with bounded retries + backoff (don't sleep).
- **Make tests idempotent and isolated** — unique resource keys, create + delete within the test.
- **Retry only safe (idempotent) operations**, and only on transient signals (429, 503, connection reset) — never blindly retry a POST that creates data.
- **Stub unstable downstreams** (WireMock/MockServer) so your test isn't hostage to a flaky sandbox; cover the real integration with a separate, tolerant contract test.
- **Assert tolerantly** — schema/format/ranges over exact volatile values.

```java
// retry only on transient status, capped
int attempts = 0;
Response r;
do {
    r = given().get("/health");
    if (r.statusCode() != 503) break;
    Thread.sleep(300L * (++attempts));   // linear backoff
} while (attempts < 3);
```

> Strong signal in interviews: *"I never retry a destructive API call like a POST or DELETE. If an API test fails, the only safe retry is on idempotent GET reads with a backoff, or by stubbing external dependencies using tools like WireMock to isolate the test target."*

---

## 7. Should you auto-retry flaky tests? Retry vs quarantine.

**Answer:**
This is a judgment question — interviewers want nuance, not dogma.

- **Auto-retry (e.g. `rerunFailingTestsCount=2`)** keeps pipelines green and is pragmatic for known-flaky 3rd-party flakiness. **Danger:** it *masks real intermittent bugs* and lets flakiness accumulate.
- **Quarantine** moves a flaky test out of the blocking gate into a non-blocking job, tagged and tracked, with a ticket to fix it. The gate stays trustworthy; the flaky test still runs and is visible.

**My stance:** retries are a *painkiller, not a cure*. Allow at most 1–2 retries to absorb true infra noise, **but** record every retry, surface a flake dashboard, and quarantine + ticket anything that flakes repeatedly. A green build that needed 3 retries is a warning, not a success.

> Strong signal in interviews: *"Auto-retrying in CI is a band-aid that hides architectural rot. I allow a single rerun to absorb network anomalies, but if a test fails the first time, it must emit a warning telemetry event and be quarantined. Pipelines must remain a high-trust system."*

---

# B. Production Failures

## 8. A test passes in staging but fails in production — how do you investigate?

**Answer:** Systematically narrow *what is different*. It's almost always environment, data, config, or timing — not the code logic.

A checklist I walk through:

1. **Reproduce & capture.** Re-run against prod; collect screenshot, video, trace, HAR, logs, correlation/trace ID.
2. **Diff the environments.** Config, feature flags, env vars, build/version, data shape, scale, 3rd-party endpoints (sandbox vs live), TLS/proxy, geo/CDN.
3. **Diff the data.** Prod has volume, edge cases, and real PII-shaped data staging doesn't. Pagination, sorting, unicode, huge lists.
4. **Timing & load.** Prod is slower/under load → race conditions your fast staging hid. Look for waits that assume speed.
5. **Permissions & secrets.** Prod creds/roles/scopes differ; rotated keys.
6. **Observability.** Pull the trace ID from the test and follow it through logs/APM (Datadog, New Relic, ELK) to the failing service.
7. **Classify:** is it a *test* problem (bad assumption), an *environment* problem, or a *real product bug*? Each routes differently.

> Strong signal in interviews: *"The first thing I check is the version and config delta between the two environments, then the data, then timing. I treat a prod-only failure as guilty of being a real bug until proven a test issue."*

---

## 9. How do you test *in* production safely?

**Answer:** Testing in production is normal at scale — you do it *safely* with guardrails:

| Technique | What it is |
|---|---|
| **Smoke / synthetic monitoring** | Lightweight read-only checks running 24/7 against prod (e.g. login, search) — alert on failure |
| **Canary releases** | Ship to 1% of traffic, watch metrics, then ramp |
| **Blue-green / dark launch** | New version live but not user-facing; test it, then switch traffic |
| **Feature flags** | Enable a feature for internal/test accounts only |
| **Shadow / mirror traffic** | Replay real traffic to the new version without affecting users |
| **Test accounts & data tagging** | Synthetic users + `is_test=true` data excluded from analytics/billing |
| **Read-only / non-destructive checks** | Verify without mutating real customer data |
| **Observability + SLOs** | Metrics, logs, traces, error budgets define "healthy" |

Key guardrails: **never pollute real customer data or analytics**, make synthetic data clearly tagged and cleanable, keep prod checks **idempotent and reversible**, and have **rollback** ready.

> Strong signal in interviews: *"Testing in production is the ultimate validation, but only if you have strict isolation. I enforce two golden rules: synthetic test data must be tagged so it is excluded from business metrics and billing, and transactions must be read-only or programmatically self-cleaning."*

---

## 10. A bug reached production that your suite missed — what now?

**Answer:** Treat it as a process improvement, not blame. The sequence:

1. **Mitigate first** — rollback / feature-flag off / hotfix. Stop the bleeding before testing theory.
2. **Reproduce** in a lower environment with the exact prod data/config that triggered it.
3. **Write the failing test first** (red) that captures the bug — this becomes a permanent **regression test**.
4. **Fix, watch it go green**, ship.
5. **Root-cause / blameless post-mortem:** *why did the suite miss it?* Missing scenario? Wrong environment? Untested data shape? Gap in coverage between unit/integration/E2E?
6. **Shift-left the lesson** — add the missing layer of coverage (often a cheap unit/contract test, not another slow E2E), add monitoring/alerting so it's caught faster next time.
7. **Track** escaped-defect metrics to see if your changes actually reduce escapes.

> The mature answer: *"Every production escape is a free test case. I encode it as a regression test so it can never escape again, then ask what class of bug it represents and add the cheapest coverage that catches that class."*

---

# C. Environment Testing

## 11. What is environment testing and environment parity?

**Answer:**
**Environment testing** is verifying the application behaves correctly across the environments it moves through — typically **DEV → QA/TEST → STAGING/UAT → PROD** — and that infra-level concerns (config, secrets, networking, scaling, integrations) are correct in each.

**Environment parity** means lower environments resemble production closely enough that passing there *predicts* passing in prod. The bigger the drift (different data, versions, scale, flags), the less your green build means. Most prod-only bugs are parity failures.

What to verify per environment: correct **build/version**, **config & feature flags**, **DB schema/migrations**, **3rd-party endpoints** (sandbox vs live), **secrets/permissions**, **DNS/TLS/proxy**, and **smoke of critical paths** right after deploy.

> Strong signal in interviews: *"Environment parity is a myth unless you enforce Infrastructure as Code. I verify parity by diffing config keys and dependencies automatically, because the most expensive production bugs are almost always caused by tiny, silent configuration drifts."*

---

## 12. How do you manage config and test data across environments?

**Answer:**

**Config** — externalize everything; never hardcode:
- Per-environment property files / profiles (`config-qa.properties`, `config-prod.properties`) selected by a `-Denv=qa` flag or `ENV` variable.
- Secrets come from a vault / CI credentials store, **never** committed.

```java
// pick config by env, fall back safely
String env = System.getProperty("env", "qa");
Properties p = load("config-" + env + ".properties");
String baseUrl = p.getProperty("base.url");
```

```bash
mvn test -Denv=staging -Dbrowser=chromium
```

**Test data** strategy, in order of preference:
1. **Self-seeding** — each test creates the data it needs via API, then cleans up (most reliable, parallel-safe).
2. **Unique keys** — UUID emails/usernames so parallel runs never collide.
3. **Ephemeral DB / containers** — spin a fresh DB per run.
4. **Curated seed sets** — versioned fixtures for read-only reference data.
- Avoid relying on shared, long-lived "magic" accounts that other tests mutate.

> Strong signal in interviews: *"My rule for test data is zero static dependencies. Tests must be completely self-reliant; they should dynamically register their own users and seed their own prerequisites via API endpoints at runtime to prevent parallel execution collisions."*

---

## 13. How do you make environments reproducible? (Docker)

**Answer:**
Reproducibility kills "works on my machine." Containerize the **app, its dependencies, and the test runner** so every run starts identical.

- **Docker / Docker Compose** to stand up app + DB + mocks together.
- **Pinned versions** (browser, JDK, image tags) — no `latest`.
- **Ephemeral**: create on pipeline start, destroy at end.

```yaml
# docker-compose.yml — app + db + mock, for an isolated test env
services:
  app:
    image: myapp:${TAG:-local}
    environment: [ "DB_URL=jdbc:postgresql://db:5432/app" ]
    depends_on: [ db ]
    ports: [ "8080:8080" ]
  db:
    image: postgres:16
    environment: [ "POSTGRES_DB=app", "POSTGRES_PASSWORD=test" ]
  wiremock:
    image: wiremock/wiremock:3.5.4
    ports: [ "9999:8080" ]
```

```bash
docker compose up -d        # bring the environment up
mvn test -Denv=docker       # run tests against it
docker compose down -v      # tear it all down, no leftovers
```

> Bonus: **Testcontainers** (Java) starts these containers *from inside* your test code, so the environment lifecycle is owned by the test itself — great for DB/integration tests.

> Strong signal in interviews: *"To guarantee reproducibility, I boot ephemeral mock environments locally and in CI using Docker Compose or Testcontainers. If a developer cannot spin up the exact same dependency stack and run the tests locally with a single command, your CI pipeline is a bottleneck."*

---

# D. Jenkins & CI/CD Pipelines

## 14. What is CI/CD and why do testers care?

**Answer:**
- **CI (Continuous Integration):** every code push is automatically built and **tested**, so integration problems surface in minutes, not at release.
- **CD (Continuous Delivery/Deployment):** every green build is automatically made releasable (Delivery) or actually released (Deployment).

For an SDET, CI/CD is **where your tests create value**: they run automatically on every change, gate merges, and give fast feedback. A test suite that only runs on your laptop barely matters; the same suite wired into a pipeline protects the whole team.

> Strong signal in interviews: *"An E2E test suite that runs manually on a local machine is just a script. It only becomes a quality gate when it is integrated into a merge block in the CI/CD pipeline, catching regressions before they ever touch the main branch."*

---

## 15. What is Jenkins? Core concepts.

**Answer:**
**Jenkins** is an open-source automation server that runs your build/test/deploy steps automatically. It's the classic self-hosted CI tool.

Core vocabulary (this is what interviewers check you actually know):

| Term | Meaning |
|---|---|
| **Job / Project** | A configured unit of work (build a repo, run tests) |
| **Pipeline** | A job defined as code, with multiple **stages** |
| **Jenkinsfile** | The pipeline-as-code file, committed to your repo |
| **Stage** | A logical phase: *Build*, *Test*, *Deploy* |
| **Step** | A single action inside a stage (`sh 'mvn test'`) |
| **Agent / Node** | The machine/container where the pipeline runs |
| **Executor** | A slot on an agent that runs one build at a time |
| **Declarative vs Scripted** | Two Jenkinsfile syntaxes — **Declarative** (structured, recommended) vs **Scripted** (Groovy, flexible) |
| **Trigger** | What starts a build (push webhook, SCM poll, cron, manual) |
| **Artifact** | A file the build produces and stores (report, jar) |
| **Credentials** | Securely stored secrets injected at runtime |
| **Plugin** | Add-ons (Git, JUnit, Allure, Docker, etc.) |

> Strong signal in interviews: *"I treat the Jenkinsfile as production code. By defining pipelines declaratively, versioning them in git alongside the application, and containerizing build agents, we ensure the build pipeline is as reproducible and robust as the product itself."*

---

## 16. DEMO: install Jenkins locally and run your first pipeline

**Answer:** Here's the fastest way to see Jenkins working on your own machine.

**Option A — Docker (cleanest, recommended):**

```bash
# 1. Run Jenkins in a container (LTS), persisting its data in a volume
docker run -d --name jenkins \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts

# 2. Get the one-time admin unlock password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

**Option B — Windows native:** download the installer from jenkins.io → install → it runs as a Windows service on `http://localhost:8080`. (You need a JDK installed.)

**First-run setup (both options):**
1. Open `http://localhost:8080`.
2. Paste the unlock password.
3. Choose **Install suggested plugins** (gets Git, Pipeline, JUnit, etc.).
4. Create your admin user.

**Create your first pipeline job (Hello World):**
1. **New Item** → name it `hello` → choose **Pipeline** → OK.
2. Scroll to **Pipeline** → **Definition: Pipeline script** → paste:

```groovy
pipeline {
    agent any
    stages {
        stage('Build')  { steps { echo 'Building…' } }
        stage('Test')   { steps { echo 'Running tests…' ; sh 'echo tests pass' } }
        stage('Deploy') { steps { echo 'Deploying…' } }
    }
}
```
3. **Save** → **Build Now**.
4. Click the build (#1) → **Console Output** to watch each stage run. The **Stage View** shows green boxes per stage.

> On Windows agents use `bat 'mvn test'` instead of `sh 'mvn test'` (Windows has no `sh`).

That's the whole loop: a job, a Jenkinsfile, stages, and console output. Everything else is more stages and plugins.

---

## 17. DEMO: a real `Jenkinsfile` for a Maven + Playwright suite

**Answer:** In practice you commit a `Jenkinsfile` to the repo root and point Jenkins at it (**Pipeline script from SCM**). Here's a realistic one for the kind of Java/Playwright/TestNG framework this repo demonstrates:

```groovy
pipeline {
    agent any

    tools { maven 'Maven3' ; jdk 'JDK17' }   // names configured in Jenkins → Global Tool Config

    parameters {
        choice(name: 'ENV',     choices: ['qa','staging','prod'], description: 'Target environment')
        choice(name: 'BROWSER', choices: ['chromium','firefox','webkit'], description: 'Browser')
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
        disableConcurrentBuilds()
    }

    triggers { pollSCM('H/5 * * * *') }       // check git every ~5 min (or use a webhook)

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Build') {
            steps { sh 'mvn -B clean compile' }
        }
        stage('Install Browsers') {
            steps { sh 'mvn -B exec:java -e -Dexec.mainClass=com.microsoft.playwright.CLI -Dexec.args="install --with-deps"' }
        }
        stage('Test') {
            steps {
                sh "mvn -B test -Denv=${params.ENV} -Dbrowser=${params.BROWSER}"
            }
        }
    }

    post {
        always {
            junit '**/target/surefire-reports/*.xml'           // publish results
            archiveArtifacts artifacts: 'target/**/*.png, target/**/trace.zip', allowEmptyArchive: true
            // If the Allure plugin is installed:
            // allure includeProperties: false, results: [[path: 'target/allure-results']]
        }
        failure {
            echo 'Build failed — notify the team (email/Slack plugin here).'
        }
    }
}
```

**Wire it up:** New Item → **Pipeline** → **Pipeline script from SCM** → Git → your repo URL → Script Path `Jenkinsfile`. Now every build pulls the repo and runs these stages.

Stage-by-stage in plain English: pull the code → compile → install Playwright browsers → run the tests against the chosen env/browser → always publish the JUnit results and screenshots/traces, even on failure.

---

## 18. Parallel / cross-browser execution in Jenkins

**Answer:** Two common ways:

**1. `parallel` block** — run browsers side by side in one pipeline:

```groovy
stage('Cross-browser') {
    parallel {
        stage('chromium') { steps { sh 'mvn -B test -Dbrowser=chromium' } }
        stage('firefox')  { steps { sh 'mvn -B test -Dbrowser=firefox'  } }
        stage('webkit')   { steps { sh 'mvn -B test -Dbrowser=webkit'   } }
    }
}
```

**2. Matrix** (declarative) — Jenkins expands combinations for you:

```groovy
stage('Matrix') {
  matrix {
    axes {
      axis { name 'BROWSER'; values 'chromium','firefox','webkit' }
    }
    stages {
      stage('test') { steps { sh "mvn -B test -Dbrowser=${BROWSER}" } }
    }
  }
}
```

Combine with TestNG/Surefire thread-level parallelism *inside* each run for two layers of concurrency. Make sure your tests are isolated (Q5/Q6) or parallelism will *create* flakiness.

> Strong signal in interviews: *"Before you parallelize a test suite to save time, you must ensure state isolation. Running tests in parallel on a suite with shared database records or shared user credentials will only trade slow tests for flaky tests. Clean architecture must precede speed."*

---

## 19. Publishing reports & artifacts

**Answer:**
A pipeline that doesn't surface results is half-built. Standard moves:
- **`junit '**/target/surefire-reports/*.xml'`** — native pass/fail trend graphs.
- **Allure / ExtentReports plugin** — rich HTML reports with steps, screenshots, history.
- **`archiveArtifacts`** — keep screenshots, videos, Playwright `trace.zip`, logs for debugging failures.
- **`publishHTML`** — host any static HTML report on the build page.
- Put these in `post { always { … } }` so they publish **even when tests fail** (that's exactly when you need them).

> Strong signal in interviews: *"A failing test in CI without diagnostic logs is a waste of time. I put Allure report generation and Playwright trace zips in the 'always' post-execution block, so the exact state of the DOM and network timeline is saved for every single failure."*

---

## 20. Triggers, parameters, and secrets

**Answer:**

**Triggers** — what starts a build:
- `pollSCM('H/5 * * * *')` — Jenkins polls Git on a schedule.
- **Webhook** (preferred) — Git server pings Jenkins on push → instant builds, no polling.
- `cron('H 2 * * *')` — nightly regression at ~2am.
- Manual / upstream-downstream (one job triggers another).

**Parameters** — make a job configurable at run time (`ENV`, `BROWSER`, `TAGS`) via `parameters { … }` (see Q17).

**Secrets/credentials** — never hardcode. Store in **Manage Jenkins → Credentials**, inject with `withCredentials`:

```groovy
withCredentials([string(credentialsId: 'GEMINI_API_KEY', variable: 'GEMINI_API_KEY')]) {
    sh 'mvn -B test -Dapi.key=$GEMINI_API_KEY'
}
```
The value is masked in logs.

> Strong signal in interviews: *"Any automation suite that commits plaintext passwords or API keys to a git repository is a security incident waiting to happen. I inject configuration variables at runtime and load secrets dynamically from credentials managers like Jenkins Vault."*

---

## 21. Jenkins vs GitHub Actions

**Answer:** Expect this comparison — show you can choose deliberately.

| | Jenkins | GitHub Actions |
|---|---|---|
| Hosting | Self-hosted (you run/maintain it) | Cloud (GitHub-hosted runners) or self-hosted |
| Config | `Jenkinsfile` (Groovy) | YAML workflows in `.github/workflows` |
| Setup cost | Higher — server, plugins, upkeep | Near-zero to start |
| Flexibility | Very high; huge plugin ecosystem | Great, big marketplace, tied to GitHub |
| Best when | Complex/on-prem/regulated, many agents | Repo already on GitHub, want fast setup |

The equivalent of the Q17 pipeline in GitHub Actions:

```yaml
name: tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix: { browser: [chromium, firefox, webkit] }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: '17', cache: maven }
      - run: mvn -B test -Dbrowser=${{ matrix.browser }}
      - uses: actions/upload-artifact@v4
        if: always()
        with: { name: reports-${{ matrix.browser }}, path: target/surefire-reports }
```

**Honest take:** for a personal/portfolio project, GitHub Actions is faster to stand up; Jenkins is what you'll meet in larger enterprises with on-prem or compliance needs. Knowing both — and *why* you'd pick each — is the senior answer.

> Strong signal in interviews: *"I don't argue over Jenkins versus GitHub Actions; they are tools to achieve the same goal. I select GitHub Actions for rapid cloud-native scaling and lower maintenance overhead, and Jenkins when we need custom on-prem agent management and complex stage controls."*

---

## Quick-reference cheat sheet

- **Flaky = non-determinism** in test, env, or product. Assert on **state, not time**. Detect with reruns + dashboards; fix the root cause; retry sparingly, quarantine + ticket the rest.
- **Prod-only failure** → diff **version → config → data → timing → permissions**; follow the trace ID; treat as a real bug until proven a test issue.
- **Test in prod** with smoke/synthetics, canaries, feature flags, tagged test data, and observability — never pollute real data.
- **Environment parity** is what makes a green build meaningful; externalize config, isolate/seed data, containerize for reproducibility.
- **CI/CD** is where tests earn their keep. **Jenkins** = jobs → pipelines (Jenkinsfile) → stages → steps on agents; publish reports in `post { always }`; secrets via credentials; parallelize across browsers.
