# Java Strings — SDET Interview Questions
> 5+ years SDET level. Covers String operations as applied in test automation: assertions, data extraction, JSON parsing, log analysis, and API response validation.


---

## 1. Why is `String` immutable in Java and why does this matter in a test framework?

**Answer:**
`String` objects are immutable — every operation that appears to modify a string actually creates a new `String` object. The original is unchanged.

```java
String env = "staging";
env.toUpperCase(); // creates "STAGING" but env is still "staging"!
env = env.toUpperCase(); // correct — reassign the result
```

**Why it matters in automation:**
- **Thread safety:** Immutable strings can be safely shared across parallel test threads without synchronisation. Test config strings, base URLs, and credentials stored as `String` constants are inherently thread-safe.
- **String pool:** JVM caches string literals — `"staging" == "staging"` is `true` for literals, but `new String("staging") == new String("staging")` is `false`. Always use `.equals()` for string comparison in assertions.

> Hot take: *"Immutability is why we don't have to lock browser config strings in parallel execution. But beware: developers who run dynamic locator builders inside loops using simple String concatenation are silently thrashing the GC. Use StringBuilder or Webdriver/Playwright locator parametrization instead."*

---

## 2. What is the String pool and what is the risk of using `==` for String comparison?

**Answer:**
The String pool (part of the heap since Java 7) stores unique string literals. When you write `String a = "hello"`, the JVM checks the pool first — if it exists, `a` points to the pooled instance.

```java
String a = "staging";
String b = "staging";
String c = new String("staging");

a == b;          // true  — both point to the same pool entry
a == c;          // false — c is a new heap object outside the pool
a.equals(c);     // true  — compares character values

// In assertions — ALWAYS use equals
Assert.assertEquals(actualEnv, "staging");       // correct
Assert.assertTrue(actualEnv == "staging");        // WRONG — can silently pass or fail randomly
```

This is a classic cause of intermittent test failures when comparing response strings fetched at runtime (always outside the pool).

> Hot take: *"If you ever write Assert.assertTrue(str1 == str2) in a pull request, expect it to be blocked. It's not just a style issue—since dynamic JSON payloads parsed from APIs bypass the String Pool, == will lead to flaky false-negatives in CI that are impossible to debug locally."*

---

## 3. What is the difference between `String`, `StringBuilder`, and `StringBuffer`?

**Answer:**

| | String | StringBuilder | StringBuffer |
|---|---|---|---|
| Mutable | No | Yes | Yes |
| Thread-safe | Yes (immutable) | No | Yes (synchronised) |
| Performance | Slow for concat loops | Fastest | Slower than StringBuilder |

**In automation:**
- `String` — constants, config values, assertion messages
- `StringBuilder` — building dynamic SQL queries, log messages, or JSON strings in a loop
- `StringBuffer` — only needed if multiple threads write to the same string builder (rare in test code; usually use `ThreadLocal<StringBuilder>` instead)

```java
// BAD — creates 1000 String objects
String log = "";
for (String step : steps) {
    log = log + step + "\n";  // new String on every iteration
}

// GOOD — single buffer, no intermediate objects
StringBuilder sb = new StringBuilder();
for (String step : steps) {
    sb.append(step).append("\n");
}
String log = sb.toString();
```

> Hot take: *"Unless you are writing custom multi-threaded framework logs dispatchers, StringBuffer is obsolete. Use StringBuilder for loop operations, or better yet, use standard Java streams with Collectors.joining() to assemble dynamic test logs or XPath expressions."*

---

## 4. How do you extract values from API response strings using common String methods?

**Answer:**

```java
// Response body snippet (before JSON parsing libraries)
String response = "status=200,token=eyJhbGci.OiJIUzI1,userId=4821";

// Split on comma to get key=value pairs
String[] pairs = response.split(",");

// Extract token value
for (String pair : pairs) {
    if (pair.startsWith("token=")) {
        String token = pair.substring("token=".length());  // eyJhbGci.OiJIUzI1
        System.out.println("Extracted token: " + token);
    }
}

// Or via indexOf + substring
int start = response.indexOf("userId=") + "userId=".length();
int end   = response.indexOf(",", start);
String userId = end == -1
    ? response.substring(start)
    : response.substring(start, end);  // "4821"
```

> Hot take: *"Writing custom substring string-chopping logic to parse JSON or XML responses is an absolute anti-pattern. If you find yourself counting characters or using .indexOf(), stop and import a proper parser like Jackson or RestAssured's JsonPath."*

---

## 5. How do you validate API response content using String assertions in REST Assured?

**Answer:**

```java
Response response = given()
    .header("Authorization", "Bearer " + token)
.when()
    .get("/api/users/4821")
.then()
    .statusCode(200)
    .extract().response();

String body = response.asString();

// String-level assertions (before parsing)
Assert.assertTrue(body.contains("\"status\":\"active\""),
    "User should be active. Response: " + body);

Assert.assertFalse(body.contains("\"error\""),
    "Response contains unexpected error field");

// Case-insensitive check for header value
String contentType = response.header("Content-Type");
Assert.assertTrue(contentType.toLowerCase().contains("application/json"),
    "Expected JSON content type, got: " + contentType);
```

> Hot take: *"Validating a JSON API response using raw string .contains() is incredibly fragile. Minor shifts in JSON key order, indentation, or whitespaces will break your tests. Always deserialize to a POJO or use Hamcrest path matchers (like body("status", equalTo("active"))) instead."*

---

## 6. How does `String.format()` vs `String.formatted()` vs formatted with `MessageFormat` differ?

**Answer:**

```java
String user  = "standard_user";
String page  = "Dashboard";
int    items = 14;

// String.format — static, explicit format specifiers
String msg1 = String.format("User '%s' logged in. Page: %s. Items: %d", user, page, items);

// String.formatted — instance method (Java 15+), same behaviour
String msg2 = "User '%s' logged in. Page: %s. Items: %d".formatted(user, page, items);

// MessageFormat — supports positional params, useful for externalized error messages
String pattern = "User ''{0}'' logged in. Page: {1}. Items: {2}";
String msg3 = MessageFormat.format(pattern, user, page, items);
```

In automation: use `String.format()` for log messages and assertion descriptions, `MessageFormat` for error messages loaded from properties files.

> Hot take: *"Use Java 15+'s "".formatted() for clean, inline string templates in your test code. But remember, for standard logging statements in your framework, default to SLF4J placeholders (e.g., log.info("Running on: {}", env)) because they avoid eager evaluation costs."*

---

## 7. How do you use `String.split()` safely? What is the regex gotcha?

**Answer:**
`split()` takes a **regex**, not a plain delimiter string. Characters like `.`, `|`, `(`, `[` have special regex meaning.

```java
// BUG — "." in regex means "any character"
String csv = "login.feature|dashboard.feature|profile.feature";
String[] wrong = csv.split(".");   // splits on every character!

// FIX — escape the literal character
String[] correct = csv.split("\\|");    // split on literal |
String[] dots    = "v1.2.3".split("\\."); // split on literal .

// Limit param — split into at most N parts
String header = "Bearer eyJhbGci.OiJIUzI1.abc";
String[] parts = header.split(" ", 2);  // ["Bearer", "eyJhbGci.OiJIUzI1.abc"]
String token = parts[1];                // preserves dots in token
```

> Hot take: *"String.split with regex is a common source of brittle test setups. If you're splitting file paths or environment variables, use Guava's Splitter or Java's Paths.get(). They handle system-specific file separators and clean up empty strings automatically."*

---

## 8. How do you compare Strings case-insensitively in test assertions?

**Answer:**

```java
String actual   = response.jsonPath().getString("status");
String expected = "Active";

// equalsIgnoreCase — cleanest
Assert.assertTrue(actual.equalsIgnoreCase(expected),
    "Status mismatch: expected '" + expected + "' (ignore case), got '" + actual + "'");

// Normalise both sides — useful when trimming whitespace too
Assert.assertEquals(actual.trim().toLowerCase(), expected.trim().toLowerCase());

// REST Assured — body matcher ignoring case
given().when().get("/api/user/1").then()
    .body("status", equalToIgnoringCase("active"));
```

> Hot take: *"Don't normalize strings manually using .toLowerCase() before asserting; it hides the original text shape in failure reports. Use AssertJ's isEqualToIgnoringCase() or Hamcrest's equalToIgnoringCase() to keep assertion logs clear and readable."*

---

## 9. How do you trim and normalise whitespace in test data strings?

**Answer:**

```java
// strip() is preferred over trim() in Java 11+ — handles Unicode whitespace
String raw = "  standard_user  \t\n";
String clean = raw.strip();  // "standard_user"

// Collapse all internal whitespace (multiple spaces → single space)
String messy = "John   Doe   Smith";
String normalised = messy.replaceAll("\\s+", " ").strip();  // "John Doe Smith"

// Remove ALL whitespace (for token/ID comparison)
String noSpaces = messy.replaceAll("\\s", "");  // "JohnDoeSmith"
```

Always strip whitespace before comparing user-visible text assertions — UI frameworks often add non-breaking spaces or leading/trailing whitespace that breaks `.equals()`.

> Hot take: *"Modern UI frameworks (like React or Angular) render invisible non-breaking spaces (\u00a0) that standard .trim() ignores. Always use Java 11+'s .strip() or a regex-based white-space normalizer like replaceAll("\\s+", " ") before making text assertions on UI elements."*

---

## 10. How do you check if a String contains a valid format using `matches()` or `Pattern`?

**Answer:**

```java
// matches() — checks if ENTIRE string matches the regex
String email = "test.user@example.com";
boolean isValidEmail = email.matches("^[\\w.+-]+@[\\w-]+\\.[a-zA-Z]{2,}$");

// Pattern + Matcher — better for extraction and reuse (compiled once)
Pattern tokenPattern = Pattern.compile("eyJ[A-Za-z0-9._-]+");
Matcher matcher = tokenPattern.matcher(responseBody);

if (matcher.find()) {
    String jwt = matcher.group();  // extracted JWT token
}

// Pre-compiling the pattern as a constant avoids re-compilation on every test
private static final Pattern STATUS_CODE = Pattern.compile("\"statusCode\":(\\d{3})");
```

> Hot take: *"Avoid compiling Pattern instances inside your helper or Page Object methods. Re-compiling a regex pattern on every page interaction wastes CPU cycles. Compile them once as private static final Pattern constants at the class level."*

---

## 11. How do you build a dynamic Gherkin step or test log message from variables?

**Answer:**

```java
// Step pattern building for Cucumber dry-run validation
String user        = "standard_user";
String targetPage  = "Dashboard";

// Gherkin step string
String step = String.format(
    "When user '%s' navigates to the '%s' page", user, targetPage);
// "When user 'standard_user' navigates to the 'Dashboard' page"

// Structured assertion message — always include actual value
String expected = "Welcome, John";
String actual   = page.locator(".welcome-header").innerText();

Assert.assertEquals(actual.strip(), expected,
    String.format("Header mismatch on %s page for user %s. Got: [%s]",
        targetPage, user, actual));
```

Always include the **actual value** in assertion failure messages — it's the difference between a report that says "assertion failed" and one that tells you exactly what the page returned.

> Hot take: *"Keep variable formatting clean and consistent. If a step fails, the log must print the query parameters in a predictable format (like [User: standard_user, Page: Dashboard]). This enables log parsers to group related failures automatically."*

---

## 12. What are `contains()`, `startsWith()`, `endsWith()` and `indexOf()` — give automation examples.

**Answer:**

```java
String responseBody = "{\"status\":\"active\",\"role\":\"admin\",\"userId\":4821}";

// contains — check field presence
Assert.assertTrue(responseBody.contains("\"status\""),
    "Response missing status field");

// startsWith / endsWith — validate URL structure
String redirectUrl = "https://staging.enterprise.com/dashboard?tab=overview";
Assert.assertTrue(redirectUrl.startsWith("https://"),
    "URL should use HTTPS");
Assert.assertFalse(redirectUrl.endsWith("error"),
    "Should not redirect to error page");

// indexOf — extract JSON value without a full parser
int start = responseBody.indexOf("\"userId\":") + "\"userId\":".length();
int end   = responseBody.indexOf("}", start);
String userId = responseBody.substring(start, end == -1 ? responseBody.length() : end);
// "4821"
```

> Hot take: *"While these methods are handy for quick assertions, rely on them sparingly for complex test validation. If you're checking URLs, parse them with java.net.URI first so you can assert specifically on path, query parameters, or host instead of raw substrings."*

---

## 13. What is `String.join()` and how do you use it in automation?

**Answer:**

```java
// Build CSV row from test data
String row = String.join(",", "4821", "standard_user", "PASS", "14.8s");
// "4821,standard_user,PASS,14.8s"

// Build Gherkin tags for a filter query
List<String> tags = List.of("@Smoke", "@Auth", "@Regression");
String tagFilter = String.join(" or ", tags);
// "@Smoke or @Auth or @Regression"

// Joining on newline — build multi-line report section
String failedList = String.join("\n  - ", failedTests);
String report = "Failed Tests:\n  - " + failedList;
```

> Hot take: *"When assembling dynamic tags for test executors, String.join(" or ", tags) is standard. For more complex structures like generating dynamic CSV report headers, use Java Streams with Collectors.joining(",") to easily handle null checks and mapping in a single pass."*

---

## 14. How do you handle multi-line strings in test data with Java Text Blocks (Java 15+)?

**Answer:**
Text blocks eliminate escape sequences and string concatenation for multi-line content:

```java
// Without text block — messy escape sequences
String jsonOld = "{\n" +
    "  \"username\": \"standard_user\",\n" +
    "  \"password\": \"password123\"\n" +
    "}";

// With text block — clean, readable, indentation stripped automatically
String json = """
    {
      "username": "standard_user",
      "password": "password123"
    }
    """;

// Use directly in REST Assured
given()
    .contentType("application/json")
    .body(json)
.when()
    .post("/api/auth");
```

> Hot take: *"Java Text Blocks are the best feature for writing readable raw JSON request bodies or SQL seeds directly inside your test code. Just make sure your IDE is configured to handle line-endings (LF vs CRLF) consistently, otherwise multi-line strings can break in Linux-based CI containers."*

---

## 15. How do you convert between `String` and other types — and what are the automation pitfalls?

**Answer:**

```java
// String → int (throws NumberFormatException on invalid input)
String countText = page.locator(".result-count").innerText().trim(); // "42 results"
int count = Integer.parseInt(countText.replaceAll("[^0-9]", "")); // strip non-digits first

// int / long → String
String threadId = String.valueOf(Thread.currentThread().getId());

// String → boolean (case-insensitive "true")
boolean headless = Boolean.parseBoolean(System.getProperty("headless", "true"));

// String → char array (useful for character-by-character validation)
char[] chars = "eyJhbGci".toCharArray();

// Common automation pitfall — UI text often has invisible Unicode chars
String uiText = page.locator(".price").innerText(); // "₹1,499 " (non-breaking space)
double price = Double.parseDouble(
    uiText.replaceAll("[^0-9.]", ""));  // strip currency symbol + NBSP
```

Always use `replaceAll("[^\\d.]", "")` or `.strip()` before parsing numeric strings from UI elements — invisible characters and currency symbols cause `NumberFormatException` in production test runs.

> Hot take: *"Never assume the UI text format is clean enough for Double.parseDouble or Integer.parseInt. Always strip currencies, commas, and non-breaking spaces using a regex filter beforehand, and wrap the call in a try-catch to throw a descriptive framework exception instead of a raw NumberFormatException."*
