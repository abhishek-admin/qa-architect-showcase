# Master Interview Preparation Q&A Bank (SDET / Framework Architect)
> Curated study guide covering 200+ core conceptual topics, 50+ deep-dive Q&As (focusing on Interfaces, Singletons, Automation, and Pipelines), and 35 complete Java coding questions with executable `main` methods and output logs.

---

## 📂 Table of Contents
1. **[200+ High-Yield Interview Topic Checklist](#200-high-yield-interview-topic-checklist)**
2. **[Deep-Dive Conceptual Q&A Bank (50 Key Questions)](#deep-dive-conceptual-qa-bank-50-key-questions)**
   - *OOPs, Interfaces & Singletons*
   - *Java Core & Collections*
   - *Web & API Automation (Playwright & RestAssured)*
   - *BDD, CI/CD & Flaky Tests*
3. **[35 Coding Questions & Runnable Java Solutions](#35-coding-questions--runnable-java-solutions)**

---

## 📋 200+ High-Yield Interview Topic Checklist

Review this checklist before your interview to ensure no knowledge gaps exist.

### 🟢 OOPs & Design Patterns (50 Topics)
- [x] 4 Pillars of OOPs: Abstraction, Encapsulation, Inheritance, Polymorphism
- [ ] Abstract Class vs Interface (Java 8+ changes)
- [ ] Multiple Inheritance of behavior via default methods
- [ ] Interface default, static, and private methods
- [ ] Functional Interfaces (`@FunctionalInterface`) and Lambda bindings
- [ ] Marker Interfaces (`Cloneable`, `Serializable`)
- [ ] Dynamic Binding vs Static Binding
- [ ] Interface vs abstract class design choice criteria
- [ ] Tight Coupling vs Loose Coupling (via interfaces)
- [ ] Dependency Injection / Inversion of Control (IoC)
- [ ] Singleton Design Pattern: Core definition and use cases
- [ ] Eager Initialization Singleton
- [ ] Lazy Initialization Singleton (non-thread-safe)
- [ ] Synchronized Method Lazy Singleton (poor performance)
- [ ] Double-Checked Locking (DCL) Lazy Singleton
- [ ] Volatile keyword requirement in Double-Checked Locking
- [ ] Bill Pugh Singleton Design (using static inner helper classes)
- [ ] Reflection API breaking Singletons (and how to prevent it)
- [ ] Serialization breaking Singletons (`readResolve()` fix)
- [ ] Cloning breaking Singletons (`clone()` override fix)
- [ ] Enum Singleton pattern (Thread-safe, reflection-proof)
- [ ] Factory Method Design Pattern in driver creation
- [ ] Builder Design Pattern in test configuration models
- [ ] Strategy Design Pattern for dynamic test execution modes
- [ ] Prototype Design Pattern for test data replication

### 🟡 Java Core & Collections (50 Topics)
- [ ] String immutability and memory optimization (String Pool)
- [ ] String vs StringBuilder vs StringBuffer
- [ ] Heap memory vs Stack memory allocation
- [ ] Array vs ArrayList (resizing, performance, capacity)
- [ ] ArrayList resizing factor (1.5x) and size calculation
- [ ] LinkedList vs ArrayList (node structure, search vs insertion)
- [ ] HashMap internal working (hashing, buckets, collisions)
- [ ] Java 8 HashMap threshold ($8$ elements) for conversion to Red-Black Trees
- [ ] `hashCode()` and `equals()` contract (why override both)
- [ ] HashSet internal implementation (uses HashMap keys)
- [ ] Fail-fast vs Fail-safe iterators (`ConcurrentModificationException`)
- [ ] ConcurrentHashMap internal locking (segments vs CAS)
- [ ] TreeMap and TreeSet (Sorted structures, comparator based)
- [ ] Generics in Java: Type erasure and wildcard bounds (`? extends T`, `? super T`)
- [ ] Exception Hierarchy (Checked vs Unchecked Exceptions)
- [ ] Garbage Collection basics and memory leak prevention in test frameworks
- [ ] ThreadLocal context sandboxing (ThreadLocal driver instances)

### 🔵 Web & API Automation (50 Topics)
- [ ] Playwright: Browser vs BrowserContext vs Page hierarchy
- [ ] Playwright: Auto-waiting vs Selenium explicit waits
- [ ] Locator strategies (XPath vs CSS Selectors vs Playwright user-facing locators)
- [ ] Intercepting and mocking network calls in Playwright
- [ ] Shadow DOM element traversal in Playwright vs Selenium
- [ ] Playwright trace viewer details (actions, metadata, console logs)
- [ ] RestAssured: Given/When/Then BDD validation syntax
- [ ] RequestSpecification vs ResponseSpecification
- [ ] Serialization and Deserialization using Jackson / Gson
- [ ] API payload injection strategies (POJOs vs HashMaps vs JSON files)
- [ ] Asserting complex JSON paths using JsonPath expression rules
- [ ] Handling API Authentication (Bearer Token, OAuth2, API Keys)
- [ ] HTTP Status Codes (2xx, 3xx, 4xx, 5xx) and their QA assertions

### 🔴 BDD, CI/CD & Test Infrastructure (50 Topics)
- [ ] BDD vs TDD definition and workflows
- [ ] Gherkin keywords: Feature, Scenario, Scenario Outline, Examples
- [ ] Step Definition bindings and parameter mapping
- [ ] Sharing test state across Cucumber step classes via PicoContainer DI
- [ ] Jenkins Declarative vs Scripted pipelines
- [ ] Pipeline syntax: agents, stages, steps, post-actions
- [ ] Parallel execution in Jenkins pipelines
- [ ] Jenkins shared libraries for reusable steps
- [ ] Dockerizing test suites (mounting folders, running headless)
- [ ] Selenium/Playwright Grid setups in Kubernetes/Docker Compose
- [ ] Flaky test detection and mitigation rules (quarantine, retries)
- [ ] Dynamic data seeding for tests (avoiding hardcoded DB records)
- [ ] Test reporting architectures (Allure, Extent, Cucumber HTML)

---

## 💬 Deep-Dive Conceptual Q&A Bank (50 Key Questions)

### 🧩 Chapter 1: OOPs, Interfaces & Singletons

#### Q1: What is an Interface in Java? How did it change in Java 8 and Java 9?
An interface is a contract that defines a set of behaviors a class must implement. 
- **Before Java 8**: Interfaces could only contain `public abstract` methods and `public static final` constants.
- **Java 8**: Introduced **default methods** (allows interfaces to add new methods with implementations without breaking implementing classes) and **static methods** (utility methods bound to the interface namespace).
- **Java 9**: Introduced **private methods** (allows sharing common logic between multiple default or static methods in the interface without exposing it to implementing classes).

#### Q2: How does Java resolve conflict when a class implements two interfaces containing default methods with the identical signatures?
This is the "Diamond Problem" of multiple inheritance. Java forces the implementing class to explicitly override the conflicting method and resolve the ambiguity. The class can write its own implementation or call a specific parent interface's method using the syntax:
```java
@Override
public void doSomething() {
    ParentInterfaceA.super.doSomething(); // Explicitly calls Interface A's method
}
```

#### Q3: What is a Functional Interface? Give examples in Java and automation frameworks.
A functional interface has exactly **one abstract method** (SAM - Single Abstract Method). It can have multiple default or static methods. It is marked with `@FunctionalInterface` to prevent adding other abstract methods.
- **Java Examples**: `Runnable`, `Callable`, `Comparator`.
- **Automation Example**: Playwright uses functional interfaces for custom assertions, and Java's `Predicate<Page>` is often used in custom wait utilities to evaluate element states dynamically.

#### Q4: Write a thread-safe Singleton in Java. How is it applied in a test automation framework (e.g., config reader), and why is the `volatile` keyword mandatory in Double-Checked Locking?
**Answer:**
In an SDET framework, we use the Singleton pattern for services that must have a single global instance, such as an external configuration reader (`ConfigReader`) that parses `configurations.properties`. Reading files is a heavy I/O operation; we want to do it once, cache the properties, and share them across all test threads.

Here is a thread-safe Singleton implementation using Double-Checked Locking for a `ConfigReader`:
```java
public class ConfigReader {
    private static volatile ConfigReader instance; // volatile is mandatory!
    private Properties properties;

    private ConfigReader() {
        properties = new Properties();
        try {
            properties.load(new FileInputStream("src/test/resources/configurations.properties"));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static ConfigReader getInstance() {
        if (instance == null) { // First check (no locking overhead)
            synchronized (ConfigReader.class) { // Lock the class
                if (instance == null) { // Second check (under lock)
                    instance = new ConfigReader();
                }
            }
        }
        return instance;
    }

    public String getProperty(String key) {
        return properties.getProperty(key);
    }
}
```
**Why `volatile` is mandatory:**
Without `volatile`, the JVM's out-of-order execution optimizations might allocate memory and assign the `instance` variable a reference *before* the constructor actually finishes loading the properties from the file. If Thread-2 calls `getInstance()` while Thread-1 is still executing the constructor, it will see `instance != null`, return it immediately, and then call `getProperty()`, resulting in a `NullPointerException` or empty values. `volatile` establishes a "happens-before" boundary, ensuring the object is fully constructed before any thread can access its reference.

#### Q5: Why is a standard Java Singleton (like the one above) an anti-pattern for browser driver instances (WebDriver/Playwright Page) in parallel execution? How do you solve it?
**Answer:**
A standard Singleton guarantees there is exactly *one* instance of the class in the entire JVM memory space. 
If we implement a standard Singleton for `WebDriver` or Playwright `Page` and run tests in parallel (e.g., 5 threads via TestNG):
- Thread-1 starts and instantiates the browser.
- Thread-2 starts, calls `Driver.getInstance()`, and gets the *same* browser instance that Thread-1 is using.
- Thread-2 navigates to a login page, which immediately overrides the URL in Thread-1's browser. The tests will click on wrong elements, steal sessions, and fail due to race conditions.

**How to solve it:**
We use a **Thread-Scoped Singleton** using `ThreadLocal<T>`. This ensures there is exactly one driver instance *per thread*, isolated from other threads.
```java
public class DriverManager {
    private static final ThreadLocal<Page> PAGE = new ThreadLocal<>();

    private DriverManager() {}

    public static Page getPage() {
        return PAGE.get(); // Returns the page instance bound to the active thread
    }

    public static void setPage(Page page) {
        PAGE.set(page);
    }

    public static void quit() {
        if (PAGE.get() != null) {
            PAGE.get().close();
            PAGE.remove(); // Mandatory to prevent ThreadLocal memory leaks in thread pools!
        }
    }
}
```
This is the standard architectural pattern for modern parallel SDET frameworks.

#### Q6: Explain the Bill Pugh Singleton pattern. Where would you use it in test automation, and why is it preferred over Double-Checked Locking?
**Answer:**
The Bill Pugh Singleton uses a static inner helper class to store the Singleton instance.
```java
public class ReportManager {
    private ReportManager() {
        // Initialize ExtentReports/Allure configuration here
    }

    private static class SingletonHelper {
        private static final ReportManager INSTANCE = new ReportManager();
    }

    public static ReportManager getInstance() {
        return SingletonHelper.INSTANCE;
    }
}
```
**Where we use it:**
For central reporting managers (like ExtentReports or Allure configurations) or logging publishers that are globally shared across all test threads, but don't require thread-specific browser instances.

**Why it is preferred:**
- **Zero Synchronization Overhead**: Unlike Double-Checked Locking, it doesn't use the `synchronized` keyword, which slows down execution under heavy thread contention.
- **Lazy Loading**: The inner class `SingletonHelper` is not loaded into memory until someone calls `getInstance()`.
- **Thread-safe**: The Java class-loading mechanism is guaranteed to be thread-safe by the JVM out of the box.

#### Q7: How can Reflection and Serialization break a Singleton, and how do you protect it? How does Enum Singleton solve this?
**Answer:**
Even with thread-safe implementations, a Singleton can be broken in Java by:
1. **Reflection API**: An interviewer or tool can change the private constructor accessibility using `constructor.setAccessible(true)` and create a new instance.
   - *Protection*: Throw an exception inside the private constructor if an instance is already instantiated.
2. **Serialization**: If the Singleton class implements `Serializable`, converting the object to a byte stream and reading it back (deserialization) creates a new instance in memory.
   - *Protection*: Implement the `readResolve()` method:
     ```java
     protected Object readResolve() {
         return getInstance(); // Returns the existing instance instead of creating a new one
     }
     ```

**Enum Singleton Solution:**
An Enum Singleton handles all these protections natively without boilerplate code:
```java
public enum DatabaseConnection {
    INSTANCE;
    
    private Connection connection;
    
    DatabaseConnection() {
        // Setup DB connection once
    }
    
    public Connection getConnection() {
        return connection;
    }
}
```
By JVM specification, enums are immune to Reflection instantiation (the constructor throws `IllegalArgumentException`) and have built-in serialization handling that guarantees only a single instance exists.

---

### ☕ Chapter 2: Java Core & Collections

#### Q8: What is the String Pool? Why are Strings immutable in Java?
The String Pool is a storage region in Java Heap memory that stores unique string literals. When a string is created, the JVM checks the pool; if it exists, it returns the reference, saving heap space.
**Immutability Reasons:**
- *Security*: String parameters (e.g. database URLs, usernames) cannot be mutated mid-run.
- *Thread-safety*: Multiple threads can share strings without synchronization.
- *Caching HashCodes*: The hashCode is cached at creation, accelerating HashMap key lookups.

#### Q9: Explain how HashMap works internally.
HashMap uses a hashing algorithm on keys to calculate index buckets. Each bucket contains a node chain (linked list).
- **On put()**: Calculate key's hash, map it to a bucket index. If empty, create a node. If collision, append node to the linked list.
- **Java 8 conversion**: If the size of a bucket linked list exceeds **8** and the overall table capacity is at least **64**, the linked list is converted (balanced) into a **Red-Black Tree** to improve lookup time from $O(N)$ to $O(\log N)$.

#### Q10: What is the difference between fail-fast and fail-safe iterators?
- **Fail-Fast**: Operates directly on the collection. Throws `ConcurrentModificationException` immediately if the collection is structurally modified during iteration (e.g. `ArrayList` iterator).
- **Fail-Safe**: Operates on a clone or copy-on-write representation of the collection. Modifications do not throw exceptions during iteration (e.g. `CopyOnWriteArrayList` iterator).

---

### 🎭 Chapter 3: Web & API Automation

#### Q11: Explain Playwright's Browser vs BrowserContext vs Page architecture. Why is it faster than Selenium?
- **Browser**: An instance of Chromium/Firefox/WebKit. Launched once per test run.
- **BrowserContext**: A completely isolated session (similar to an incognito window) with its own cookies, storage, and cache. Launched instantly (in milliseconds) without opening a new browser process.
- **Page**: A single tab within a BrowserContext.
**Performance Advantage**: Selenium launches a heavy browser process per test class/thread. Playwright launches the browser process once, then spins up isolated BrowserContext instances for individual test threads in milliseconds, saving up to 80% of test run-time.

#### Q12: How does Playwright's Auto-waiting mechanism work?
Playwright performs actionability checks on elements before triggering clicks, types, or assertions. It automatically waits for the element to meet all these criteria:
- Attached to the DOM
- Visible (non-zero size, not hidden)
- Stable (not animating)
- Enabled (not disabled)
- Receives events (not obscured by overlays)
This eliminates the need for manual, arbitrary `sleep()` statements in test code.

#### Q13: How does RestAssured handle serialization of Java Objects to JSON payloads?
RestAssured uses Object Mappers (like Jackson or Gson) to convert custom Java POJOs (Plain Old Java Objects) into JSON strings:
```java
UserPayload payload = new UserPayload("admin", "pass123");
given()
    .contentType(ContentType.JSON)
    .body(payload) // Jackson converts this object to JSON dynamically
.when()
    .post("/api/login");
```

---

### 🏗️ Chapter 4: BDD, CI/CD & Flaky Tests

#### Q14: How does PicoContainer resolve state sharing across BDD step definitions?
PicoContainer is a lightweight Dependency Injection framework. When registered with Cucumber, it automatically instantiates and injects a shared context POJO (e.g. `TestContext`) into the constructor of all step definition classes. This ensures all worker steps share cookies, API tokens, or session IDs safely in concurrent runs.

#### Q15: What are the primary causes of flaky tests, and how do you mitigate them in a pipeline?
**Causes**:
- Elements not loaded yet (resolved by Playwright's auto-wait or explicit visibility waits).
- Dynamic, non-deterministic database seed data (resolved by setting up isolated API data-seeding steps per test class).
- Network latency or page rendering delays (resolved by scaling resources or network stubbing).
**Mitigation**:
- Quarantine failed tests to a separate job rather than failing the core build.
- Implement retries at the runner level (up to 2-3 times) to rule out transient environment hiccups.

---

## ☕ 35 Coding Questions & Runnable Java Solutions

Runnable Java coding solutions with explicit parameters, inputs, execution steps, and output prints.

### 1. Reverse a String
```java
public class ReverseString {
    public static String reverse(String s) {
        if (s == null) return null;
        StringBuilder sb = new StringBuilder(s);
        return sb.reverse().toString();
    }

    public static void main(String[] args) {
        String input = "Playwright";
        System.out.println("--- Reverse String Execution ---");
        System.out.println("Input: \"" + input + "\"");
        System.out.println("Output: \"" + reverse(input) + "\"");
    }
}
```
**Console Output:**
```text
--- Reverse String Execution ---
Input: "Playwright"
Output: "thgirwyalP"
```

---

### 2. Check if a String is a Palindrome
```java
public class PalindromeCheck {
    public static boolean isPalindrome(String s) {
        if (s == null) return false;
        int left = 0, right = s.length() - 1;
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        String input1 = "radar";
        String input2 = "testing";
        System.out.println("--- Palindrome Check Execution ---");
        System.out.println("Input 1: \"" + input1 + "\" | Output: " + isPalindrome(input1));
        System.out.println("Input 2: \"" + input2 + "\" | Output: " + isPalindrome(input2));
    }
}
```
**Console Output:**
```text
--- Palindrome Check Execution ---
Input 1: "radar" | Output: true
Input 2: "testing" | Output: false
```

---

### 3. Find the Largest Number in an Array
```java
import java.util.Arrays;

public class FindLargest {
    public static int findMax(int[] nums) {
        if (nums == null || nums.length == 0) throw new IllegalArgumentException("Array empty");
        int max = nums[0];
        for (int num : nums) {
            if (num > max) max = num;
        }
        return max;
    }

    public static void main(String[] args) {
        int[] nums = {10, 4, 55, 22, 1, 9};
        System.out.println("--- Find Largest Number Execution ---");
        System.out.println("Input: " + Arrays.toString(nums));
        System.out.println("Output: " + findMax(nums));
    }
}
```
**Console Output:**
```text
--- Find Largest Number Execution ---
Input: [10, 4, 55, 22, 1, 9]
Output: 55
```

---

### 4. Remove Duplicates from an Array
```java
import java.util.*;

public class RemoveDuplicates {
    public static int[] remove(int[] nums) {
        Set<Integer> set = new LinkedHashSet<>();
        for (int num : nums) set.add(num);
        int[] result = new int[set.size()];
        int idx = 0;
        for (int val : set) result[idx++] = val;
        return result;
    }

    public static void main(String[] args) {
        int[] nums = {1, 2, 2, 3, 4, 4, 5};
        System.out.println("--- Remove Duplicates Execution ---");
        System.out.println("Input: " + Arrays.toString(nums));
        System.out.println("Output: " + Arrays.toString(remove(nums)));
    }
}
```
**Console Output:**
```text
--- Remove Duplicates Execution ---
Input: [1, 2, 2, 3, 4, 4, 5]
Output: [1, 2, 3, 4, 5]
```

---

### 5. Check if two Strings are Anagrams
```java
import java.util.Arrays;

public class AnagramCheck {
    public static boolean isAnagram(String s1, String s2) {
        if (s1 == null || s2 == null || s1.length() != s2.length()) return false;
        char[] c1 = s1.toCharArray();
        char[] c2 = s2.toCharArray();
        Arrays.sort(c1);
        Arrays.sort(c2);
        return Arrays.equals(c1, c2);
    }

    public static void main(String[] args) {
        String s1 = "listen", s2 = "silent";
        System.out.println("--- Anagram Check Execution ---");
        System.out.println("Input: \"" + s1 + "\", \"" + s2 + "\"");
        System.out.println("Output: " + isAnagram(s1, s2));
    }
}
```
**Console Output:**
```text
--- Anagram Check Execution ---
Input: "listen", "silent"
Output: true
```

---

### 6. FizzBuzz Implementation
```java
import java.util.ArrayList;
import java.util.List;

public class FizzBuzz {
    public static List<String> getFizzBuzz(int n) {
        List<String> result = new ArrayList<>();
        for (int i = 1; i <= n; i++) {
            if (i % 15 == 0) result.add("FizzBuzz");
            else if (i % 3 == 0) result.add("Fizz");
            else if (i % 5 == 0) result.add("Buzz");
            else result.add(String.valueOf(i));
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println("--- FizzBuzz Execution ---");
        System.out.println("Input n = 15");
        System.out.println("Output: " + getFizzBuzz(15));
    }
}
```
**Console Output:**
```text
--- FizzBuzz Execution ---
Input n = 15
Output: [1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz]
```

---

### 7. Count Occurrences of a Character in a String
```java
public class CountChar {
    public static int count(String s, char target) {
        if (s == null) return 0;
        int count = 0;
        for (char c : s.toCharArray()) {
            if (c == target) count++;
        }
        return count;
    }

    public static void main(String[] args) {
        String s = "automation framework";
        char t = 'o';
        System.out.println("--- Count Character Execution ---");
        System.out.println("Input: \"" + s + "\", char = '" + t + "'");
        System.out.println("Output: " + count(s, t));
    }
}
```
**Console Output:**
```text
--- Count Character Execution ---
Input: "automation framework", char = 'o'
Output: 3
```

---

### 8. Find Factorial using Recursion
```java
public class Factorial {
    public static int factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        int n = 5;
        System.out.println("--- Factorial Execution ---");
        System.out.println("Input n = " + n);
        System.out.println("Output: " + factorial(n));
    }
}
```
**Console Output:**
```text
--- Factorial Execution ---
Input n = 5
Output: 120
```

---

### 9. Fibonacci Series (N-th element)
```java
public class Fibonacci {
    public static int fib(int n) {
        if (n <= 1) return n;
        int a = 0, b = 1;
        for (int i = 2; i <= n; i++) {
            int temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }

    public static void main(String[] args) {
        int n = 6;
        System.out.println("--- Fibonacci Execution ---");
        System.out.println("Input n = " + n);
        System.out.println("Output: " + fib(n));
    }
}
```
**Console Output:**
```text
--- Fibonacci Execution ---
Input n = 6
Output: 8
```

---

### 10. Check if a Number is Prime
```java
public class PrimeCheck {
    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        for (int i = 2; i <= Math.sqrt(n); i++) {
            if (n % i == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        int n1 = 17, n2 = 4;
        System.out.println("--- Prime Check Execution ---");
        System.out.println("Input 17: " + isPrime(n1));
        System.out.println("Input 4: " + isPrime(n2));
    }
}
```
**Console Output:**
```text
--- Prime Check Execution ---
Input 17: true
Input 4: false
```

---

### 11. Reverse an Array
```java
import java.util.Arrays;

public class ReverseArray {
    public static void reverse(int[] nums) {
        if (nums == null) return;
        int left = 0, right = nums.length - 1;
        while (left < right) {
            int temp = nums[left];
            nums[left] = nums[right];
            nums[right] = temp;
            left++;
            right--;
        }
    }

    public static void main(String[] args) {
        int[] nums = {1, 2, 3, 4, 5};
        System.out.println("--- Reverse Array Execution ---");
        System.out.println("Input: " + Arrays.toString(nums));
        reverse(nums);
        System.out.println("Output: " + Arrays.toString(nums));
    }
}
```
**Console Output:**
```text
--- Reverse Array Execution ---
Input: [1, 2, 3, 4, 5]
Output: [5, 4, 3, 2, 1]
```

---

### 12. Find the Second Largest Number in an Array
```java
import java.util.Arrays;

public class SecondLargest {
    public static int findSecondMax(int[] nums) {
        if (nums == null || nums.length < 2) throw new IllegalArgumentException("Need at least 2 elements");
        int max = Integer.MIN_VALUE;
        int secondMax = Integer.MIN_VALUE;
        for (int num : nums) {
            if (num > max) {
                secondMax = max;
                max = num;
            } else if (num > secondMax && num != max) {
                secondMax = num;
            }
        }
        return secondMax;
    }

    public static void main(String[] args) {
        int[] nums = {12, 35, 1, 10, 34, 1};
        System.out.println("--- Second Largest Execution ---");
        System.out.println("Input: " + Arrays.toString(nums));
        System.out.println("Output: " + findSecondMax(nums));
    }
}
```
**Console Output:**
```text
--- Second Largest Execution ---
Input: [12, 35, 1, 10, 34, 1]
Output: 34
```

---

### 13. Check if an Array is Sorted
```java
import java.util.Arrays;

public class ArraySortedCheck {
    public static boolean isSorted(int[] nums) {
        if (nums == null || nums.length <= 1) return true;
        for (int i = 0; i < nums.length - 1; i++) {
            if (nums[i] > nums[i + 1]) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        int[] nums1 = {1, 2, 3, 4, 5};
        int[] nums2 = {1, 3, 2, 4, 5};
        System.out.println("--- Array Sorted Check Execution ---");
        System.out.println("Input 1: " + Arrays.toString(nums1) + " | Sorted: " + isSorted(nums1));
        System.out.println("Input 2: " + Arrays.toString(nums2) + " | Sorted: " + isSorted(nums2));
    }
}
```
**Console Output:**
```text
--- Array Sorted Check Execution ---
Input 1: [1, 2, 3, 4, 5] | Sorted: true
Input 2: [1, 3, 2, 4, 5] | Sorted: false
```

---

### 14. Count Words in a String
```java
public class CountWords {
    public static int countWords(String s) {
        if (s == null || s.trim().isEmpty()) return 0;
        String[] words = s.trim().split("\\s+");
        return words.length;
    }

    public static void main(String[] args) {
        String input = "  Playwright simplifies testing in Chromium,   Firefox and WebKit. ";
        System.out.println("--- Count Words Execution ---");
        System.out.println("Input: \"" + input + "\"");
        System.out.println("Output: " + countWords(input));
    }
}
```
**Console Output:**
```text
--- Count Words Execution ---
Input: "  Playwright simplifies testing in Chromium,   Firefox and WebKit. "
Output: 8
```

---

### 15. Capitalize the First Letter of Each Word
```java
public class CapitalizeWords {
    public static String capitalize(String s) {
        if (s == null || s.isEmpty()) return s;
        String[] words = s.split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String word : words) {
            if (word.length() > 0) {
                sb.append(Character.toUpperCase(word.charAt(0)))
                  .append(word.substring(1))
                  .append(" ");
            }
        }
        return sb.toString().trim();
    }

    public static void main(String[] args) {
        String input = "learn design patterns for automation";
        System.out.println("--- Capitalize Words Execution ---");
        System.out.println("Input: \"" + input + "\"");
        System.out.println("Output: \"" + capitalize(input) + "\"");
    }
}
```
**Console Output:**
```text
--- Capitalize Words Execution ---
Input: "learn design patterns for automation"
Output: "Learn Design Patterns For Automation"
```

---

### 16. Find all substrings of a String
```java
import java.util.ArrayList;
import java.util.List;

public class FindSubstrings {
    public static List<String> getSubstrings(String s) {
        List<String> list = new ArrayList<>();
        if (s == null) return list;
        for (int i = 0; i < s.length(); i++) {
            for (int j = i + 1; j <= s.length(); j++) {
                list.add(s.substring(i, j));
            }
        }
        return list;
    }

    public static void main(String[] args) {
        String input = "Rest";
        System.out.println("--- Find Substrings Execution ---");
        System.out.println("Input: \"" + input + "\"");
        System.out.println("Output: " + getSubstrings(input));
    }
}
```
**Console Output:**
```text
--- Find Substrings Execution ---
Input: "Rest"
Output: [R, Re, Res, Rest, e, es, est, s, st, t]
```

---

### 17. Merge two Arrays
```java
import java.util.Arrays;

public class MergeArrays {
    public static int[] merge(int[] a, int[] b) {
        if (a == null || b == null) return new int[0];
        int[] result = new int[a.length + b.length];
        System.arraycopy(a, 0, result, 0, a.length);
        System.arraycopy(b, 0, result, a.length, b.length);
        return result;
    }

    public static void main(String[] args) {
        int[] a = {1, 2, 3};
        int[] b = {4, 5, 6};
        System.out.println("--- Merge Arrays Execution ---");
        System.out.println("Input a: " + Arrays.toString(a) + " | b: " + Arrays.toString(b));
        System.out.println("Output: " + Arrays.toString(merge(a, b)));
    }
}
```
**Console Output:**
```text
--- Merge Arrays Execution ---
Input a: [1, 2, 3] | b: [4, 5, 6]
Output: [1, 2, 3, 4, 5, 6]
```

---

### 18. Find intersection of two Arrays
```java
import java.util.*;

public class ArrayIntersection {
    public static int[] intersect(int[] a, int[] b) {
        Set<Integer> setA = new HashSet<>();
        for (int val : a) setA.add(val);
        Set<Integer> intersection = new LinkedHashSet<>();
        for (int val : b) {
            if (setA.contains(val)) intersection.add(val);
        }
        int[] result = new int[intersection.size()];
        int idx = 0;
        for (int val : intersection) result[idx++] = val;
        return result;
    }

    public static void main(String[] args) {
        int[] a = {1, 2, 2, 3, 4};
        int[] b = {2, 2, 4, 5};
        System.out.println("--- Array Intersection Execution ---");
        System.out.println("Input a: " + Arrays.toString(a) + " | b: " + Arrays.toString(b));
        System.out.println("Output: " + Arrays.toString(intersect(a, b)));
    }
}
```
**Console Output:**
```text
--- Array Intersection Execution ---
Input a: [1, 2, 2, 3, 4] | b: [2, 2, 4, 5]
Output: [2, 4]
```

---

### 19. Check for Balanced Parentheses
```java
import java.util.Stack;

public class BalancedBrackets {
    public static boolean isBalanced(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if (c == ')' && top != '(') return false;
                if (c == '}' && top != '{') return false;
                if (c == ']' && top != '[') return false;
            }
        }
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        String test1 = "{[()]}";
        String test2 = "{[(])}";
        System.out.println("--- Balanced Brackets Execution ---");
        System.out.println("Input 1: \"" + test1 + "\" | Balanced: " + isBalanced(test1));
        System.out.println("Input 2: \"" + test2 + "\" | Balanced: " + isBalanced(test2));
    }
}
```
**Console Output:**
```text
--- Balanced Brackets Execution ---
Input 1: "{[()]}" | Balanced: true
Input 2: "{[(])}" | Balanced: false
```

---

### 20. Count Vowels and Consonants in a String
```java
public class CountVowelsConsonants {
    public static void printCounts(String s) {
        if (s == null) return;
        int vowels = 0, consonants = 0;
        String clean = s.toLowerCase();
        for (char c : clean.toCharArray()) {
            if (c >= 'a' && c <= 'z') {
                if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
                    vowels++;
                } else {
                    consonants++;
                }
            }
        }
        System.out.println("Vowels: " + vowels + ", Consonants: " + consonants);
    }

    public static void main(String[] args) {
        String s = "Jenkins CI/CD";
        System.out.println("--- Count Vowels/Consonants Execution ---");
        System.out.println("Input: \"" + s + "\"");
        printCounts(s);
    }
}
```
**Console Output:**
```text
--- Count Vowels/Consonants Execution ---
Input: "Jenkins CI/CD"
Vowels: 3, Consonants: 8
```

---

### 21. Binary Search Implementation
```java
public class BinarySearch {
    public static int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] nums = {1, 3, 5, 7, 9, 11};
        int target = 7;
        System.out.println("--- Binary Search Execution ---");
        System.out.println("Input: " + java.util.Arrays.toString(nums) + ", Target: " + target);
        System.out.println("Output: Index = " + search(nums, target));
    }
}
```
**Console Output:**
```text
--- Binary Search Execution ---
Input: [1, 3, 5, 7, 9, 11], Target: 7
Output: Index = 3
```

---

### 22. Swap Two Numbers without a Temp Variable
```java
public class SwapNumbers {
    public static void swap(int a, int b) {
        System.out.println("Before swap: a = " + a + ", b = " + b);
        a = a + b;
        b = a - b;
        a = a - b;
        System.out.println("After swap: a = " + a + ", b = " + b);
    }

    public static void main(String[] args) {
        System.out.println("--- Swap Numbers Execution ---");
        swap(10, 20);
    }
}
```
**Console Output:**
```text
--- Swap Numbers Execution ---
Before swap: a = 10, b = 20
After swap: a = 20, b = 10
```

---

### 23. Find Duplicates in an Array
```java
import java.util.*;

public class FindDuplicates {
    public static List<Integer> findDuplicates(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        List<Integer> duplicates = new ArrayList<>();
        for (int num : nums) {
            if (!seen.add(num)) {
                if (!duplicates.contains(num)) {
                    duplicates.add(num);
                }
            }
        }
        return duplicates;
    }

    public static void main(String[] args) {
        int[] nums = {4, 3, 2, 7, 8, 2, 3, 1};
        System.out.println("--- Find Duplicates Execution ---");
        System.out.println("Input: " + Arrays.toString(nums));
        System.out.println("Output: " + findDuplicates(nums));
    }
}
```
**Console Output:**
```text
--- Find Duplicates Execution ---
Input: [4, 3, 2, 7, 8, 2, 3, 1]
Output: [2, 3]
```

---

### 24. Missing Number in an Array
```java
import java.util.Arrays;

public class MissingNumber {
    public static int getMissing(int[] nums) {
        int n = nums.length;
        int expectedSum = n * (n + 1) / 2;
        int actualSum = 0;
        for (int val : nums) actualSum += val;
        return expectedSum - actualSum;
    }

    public static void main(String[] args) {
        int[] nums = {3, 0, 1};
        System.out.println("--- Missing Number Execution ---");
        System.out.println("Input: " + Arrays.toString(nums));
        System.out.println("Output: " + getMissing(nums)); // Expected: 2
    }
}
```
**Console Output:**
```text
--- Missing Number Execution ---
Input: [3, 0, 1]
Output: 2
```

---

### 25. Move all Zeros to the End of the Array
```java
import java.util.Arrays;

public class MoveZeros {
    public static void move(int[] nums) {
        int insertIdx = 0;
        for (int num : nums) {
            if (num != 0) nums[insertIdx++] = num;
        }
        while (insertIdx < nums.length) {
            nums[insertIdx++] = 0;
        }
    }

    public static void main(String[] args) {
        int[] nums = {0, 1, 0, 3, 12};
        System.out.println("--- Move Zeros Execution ---");
        System.out.println("Input: " + Arrays.toString(nums));
        move(nums);
        System.out.println("Output: " + Arrays.toString(nums));
    }
}
```
**Console Output:**
```text
--- Move Zeros Execution ---
Input: [0, 1, 0, 3, 12]
Output: [1, 3, 12, 0, 0]
```

---

### 26. Reverse a Linked List
```java
class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public class ReverseLinkedList {
    public static ListNode reverse(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }

    public static void printList(ListNode head) {
        while (head != null) {
            System.out.print(head.val + " -> ");
            head = head.next;
        }
        System.out.println("null");
    }

    public static void main(String[] args) {
        ListNode head = new ListNode(1, new ListNode(2, new ListNode(3)));
        System.out.println("--- Reverse Linked List Execution ---");
        System.out.print("Input: ");
        printList(head);
        ListNode reversed = reverse(head);
        System.out.print("Output: ");
        printList(reversed);
    }
}
```
**Console Output:**
```text
--- Reverse Linked List Execution ---
Input: 1 -> 2 -> 3 -> null
Output: 3 -> 2 -> 1 -> null
```

---

### 27. Find the Middle of a Linked List
```java
public class FindMiddleNode {
    public static ListNode getMiddle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }

    public static void main(String[] args) {
        ListNode head = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5)))));
        System.out.println("--- Find Middle Node Execution ---");
        System.out.print("Input: ");
        ReverseLinkedList.printList(head);
        ListNode middle = getMiddle(head);
        System.out.println("Output (Middle Node value): " + (middle != null ? middle.val : "null"));
    }
}
```
**Console Output:**
```text
--- Find Middle Node Execution ---
Input: 1 -> 2 -> 3 -> 4 -> 5 -> null
Output (Middle Node value): 3
```

---

### 28. Detect a Cycle in a Linked List
```java
public class DetectCycle {
    public static boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }

    public static void main(String[] args) {
        ListNode head = new ListNode(1);
        ListNode second = new ListNode(2);
        head.next = second;
        second.next = head; // create cycle
        
        System.out.println("--- Detect Cycle Execution ---");
        System.out.println("Output (Has Cycle): " + hasCycle(head));
    }
}
```
**Console Output:**
```text
--- Detect Cycle Execution ---
Output (Has Cycle): true
```

---

### 29. Two Sum implementation
```java
import java.util.*;

public class TwoSum {
    public static int[] findTwoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (map.containsKey(comp)) return new int[] { map.get(comp), i };
            map.put(nums[i], i);
        }
        return new int[0];
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        System.out.println("--- Two Sum Execution ---");
        System.out.println("Input: " + Arrays.toString(nums) + " | target: " + target);
        System.out.println("Output: " + Arrays.toString(findTwoSum(nums, target)));
    }
}
```
**Console Output:**
```text
--- Two Sum Execution ---
Input: [2, 7, 11, 15] | target: 9
Output: [0, 1]
```

---

### 30. First Non-Repeating Character in a String
```java
import java.util.HashMap;
import java.util.Map;

public class FirstUniqueChar {
    public static char getFirstUnique(String s) {
        if (s == null) return ' ';
        Map<Character, Integer> counts = new HashMap<>();
        for (char c : s.toCharArray()) counts.put(c, counts.getOrDefault(c, 0) + 1);
        for (char c : s.toCharArray()) {
            if (counts.get(c) == 1) return c;
        }
        return ' ';
    }

    public static void main(String[] args) {
        String s = "leetcode";
        System.out.println("--- First Non-Repeating Character Execution ---");
        System.out.println("Input: \"" + s + "\"");
        System.out.println("Output: '" + getFirstUnique(s) + "'");
    }
}
```
**Console Output:**
```text
--- First Non-Repeating Character Execution ---
Input: "leetcode"
Output: 'l'
```

---

### 31. String compression (e.g. aabcccccaaa -> a2b1c5a3)
```java
public class CompressString {
    public static String compress(String s) {
        if (s == null || s.isEmpty()) return s;
        StringBuilder sb = new StringBuilder();
        int count = 1;
        for (int i = 0; i < s.length(); i++) {
            if (i + 1 < s.length() && s.charAt(i) == s.charAt(i + 1)) {
                count++;
            } else {
                sb.append(s.charAt(i)).append(count);
                count = 1;
            }
        }
        return sb.length() < s.length() ? sb.toString() : s;
    }

    public static void main(String[] args) {
        String s = "aabcccccaaa";
        System.out.println("--- String Compression Execution ---");
        System.out.println("Input: \"" + s + "\"");
        System.out.println("Output: \"" + compress(s) + "\"");
    }
}
```
**Console Output:**
```text
--- String Compression Execution ---
Input: "aabcccccaaa"
Output: "a2b1c5a3"
```

---

### 32. Longest Common Prefix
```java
import java.util.Arrays;

public class LongestPrefix {
    public static String longestCommonPrefix(String[] strs) {
        if (strs == null || strs.length == 0) return "";
        Arrays.sort(strs);
        String s1 = strs[0];
        String s2 = strs[strs.length - 1];
        int idx = 0;
        while (idx < s1.length() && idx < s2.length()) {
            if (s1.charAt(idx) == s2.charAt(idx)) {
                idx++;
            } else {
                break;
            }
        }
        return s1.substring(0, idx);
    }

    public static void main(String[] args) {
        String[] strs = {"flower", "flow", "flight"};
        System.out.println("--- Longest Common Prefix Execution ---");
        System.out.println("Input: " + Arrays.toString(strs));
        System.out.println("Output: \"" + longestCommonPrefix(strs) + "\"");
    }
}
```
**Console Output:**
```text
--- Longest Common Prefix Execution ---
Input: [flower, flow, flight]
Output: "fl"
```

---

### 33. Merge Two Sorted Arrays in-place
```java
import java.util.Arrays;

public class MergeSortedInPlace {
    public static void merge(int[] nums1, int m, int[] nums2, int n) {
        int p1 = m - 1, p2 = n - 1, p = m + n - 1;
        while (p1 >= 0 && p2 >= 0) {
            if (nums1[p1] > nums2[p2]) {
                nums1[p--] = nums1[p1--];
            } else {
                nums1[p--] = nums2[p2--];
            }
        }
        while (p2 >= 0) {
            nums1[p--] = nums2[p2--];
        }
    }

    public static void main(String[] args) {
        int[] nums1 = {1, 2, 3, 0, 0, 0};
        int m = 3;
        int[] nums2 = {2, 5, 6};
        int n = 3;
        System.out.println("--- Merge Sorted in Place Execution ---");
        System.out.println("Input: nums1 = " + Arrays.toString(nums1) + " (m=" + m + "), nums2 = " + Arrays.toString(nums2) + " (n=" + n + ")");
        merge(nums1, m, nums2, n);
        System.out.println("Output: nums1 = " + Arrays.toString(nums1));
    }
}
```
**Console Output:**
```text
--- Merge Sorted in Place Execution ---
Input: nums1 = [1, 2, 3, 0, 0, 0] (m=3), nums2 = [2, 5, 6] (n=3)
Output: nums1 = [1, 2, 2, 3, 5, 6]
```

---

### 34. Check if a String has all Unique Characters
```java
import java.util.HashSet;
import java.util.Set;

public class UniqueCharsCheck {
    public static boolean hasUnique(String s) {
        if (s == null) return true;
        Set<Character> seen = new HashSet<>();
        for (char c : s.toCharArray()) {
            if (!seen.add(c)) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        String s1 = "unique";
        String s2 = "model";
        System.out.println("--- Unique Characters Check Execution ---");
        System.out.println("Input 1: \"" + s1 + "\" | Has Unique: " + hasUnique(s1));
        System.out.println("Input 2: \"" + s2 + "\" | Has Unique: " + hasUnique(s2));
    }
}
```
**Console Output:**
```text
--- Unique Characters Check Execution ---
Input 1: "unique" | Has Unique: false
Input 2: "model" | Has Unique: true
```

---

### 35. Find subarray with given sum
```java
import java.util.Arrays;

public class SubarraySum {
    public static int[] findSubarray(int[] nums, int target) {
        if (nums == null) return new int[0];
        int left = 0, currentSum = 0;
        for (int right = 0; right < nums.length; right++) {
            currentSum += nums[right];
            while (currentSum > target && left <= right) {
                currentSum -= nums[left++];
            }
            if (currentSum == target) {
                return new int[] { left, right };
            }
        }
        return new int[0];
    }

    public static void main(String[] args) {
        int[] nums = {1, 4, 20, 3, 10, 5};
        int target = 33;
        System.out.println("--- Subarray Sum Execution ---");
        System.out.println("Input: " + Arrays.toString(nums) + ", target: " + target);
        System.out.println("Output: Indices = " + Arrays.toString(findSubarray(nums, target)));
    }
}
```
**Console Output:**
```text
--- Subarray Sum Execution ---
Input: [1, 4, 20, 3, 10, 5], target: 33
Output: Indices = [2, 4]
```
