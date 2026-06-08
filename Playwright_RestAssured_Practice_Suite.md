# Playwright & RestAssured Practice Page Test Suite

This document provides complete, production-grade automation scripts for the [Rahul Shetty Academy Practice Page](https://rahulshettyacademy.com/AutomationPractice/). It serves as a comprehensive reference guide for handling common UI and API testing patterns.

---

## 📂 Table of Contents

1. [Playwright (Java) Automation Suite](#playwright-java-automation-suite)
2. [Playwright (JavaScript) Automation Suite](#playwright-javascript-automation-suite)
3. [Playwright Code-Based Interview Q&As](#playwright-code-based-interview-qas)
4. [RestAssured API Automation Suite](#restassured-api-automation-suite)

---

## Playwright (Java) Automation Suite

Rather than stacking all scripts inside a single, complex monolithic script, clean automation designs segregate locators and assertions into focused component classes. Below are the production-grade, modular TestNG execution classes for testing each practice page element:

### 1. Radio Buttons & Checkbox Elements (`CheckBoxAndRadioTest.java`)
```java
package com.enterprise.framework.practice;

import com.microsoft.playwright.*;
import org.testng.annotations.Test;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class CheckBoxAndRadioTest extends BaseTest {
    @Test(description = "Verify Radio Button selections and states")
    public void testRadioButtons() {
        page.navigate("https://rahulshettyacademy.com/AutomationPractice/");
        
        // Locate and click Radio2 button
        Locator radio2 = page.locator("input[value='radio2']");
        radio2.click();
        
        // Assert checked status
        assertThat(radio2).isChecked();
        
        // Verify other radio buttons are not selected
        Locator radio1 = page.locator("input[value='radio1']");
        assertThat(radio1).not().isChecked();
    }

    @Test(description = "Verify Checkbox multiple selections and toggles")
    public void testCheckboxes() {
        page.navigate("https://rahulshettyacademy.com/AutomationPractice/");
        
        Locator checkbox1 = page.locator("#checkBoxOption1");
        Locator checkbox3 = page.locator("#checkBoxOption3");

        // Check both options
        checkbox1.check();
        checkbox3.check();
        
        assertThat(checkbox1).isChecked();
        assertThat(checkbox3).isChecked();

        // Toggle checkbox1 off
        checkbox1.uncheck();
        assertThat(checkbox1).not().isChecked();
        assertThat(checkbox3).isChecked();
    }
}
```

### 2. Autocomplete Suggestions & Static Selects (`DropdownAndSuggestTest.java`)
```java
package com.enterprise.framework.practice;

import com.microsoft.playwright.*;
import org.testng.annotations.Test;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class DropdownAndSuggestTest extends BaseTest {
    @Test(description = "Verify Suggestion Class Example auto-complete flow")
    public void testAutoCompleteSuggestion() {
        page.navigate("https://rahulshettyacademy.com/AutomationPractice/");
        
        Locator countryInput = page.locator("#autocomplete");
        countryInput.fill("Ind");
        
        // Wait for dynamic overlay elements to appear in the DOM and click "India"
        Locator suggestionOption = page.locator(".ui-menu-item div:has-text('India')");
        suggestionOption.click();
        
        // Assert the input contains the selected option
        assertThat(countryInput).hasValue("India");
    }

    @Test(description = "Verify Static HTML Dropdown selections")
    public void testStaticDropdown() {
        page.navigate("https://rahulshettyacademy.com/AutomationPractice/");
        
        Locator dropdown = page.locator("#dropdown-class-example");
        
        // Select Option 3 by value
        dropdown.selectOption("option3");
        assertThat(dropdown).hasValue("option3");
        
        // Select Option 1 by visible label text
        dropdown.selectOption(new SelectOption().setLabel("Option1"));
        assertThat(dropdown).hasValue("option1");
    }
}
```

### 3. Multi-Window & Multi-Tab Context Handler (`WindowAndTabTest.java`)
```java
package com.enterprise.framework.practice;

import com.microsoft.playwright.*;
import org.testng.annotations.Test;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class WindowAndTabTest extends BaseTest {
    @Test(description = "Handle dynamic browser popup windows")
    public void testSwitchWindowPopup() {
        page.navigate("https://rahulshettyacademy.com/AutomationPractice/");
        
        // Listen for new page popup context opening concurrently during click
        Page popup = page.context().waitForPage(() -> {
            page.locator("#openwindow").click();
        });
        
        popup.waitForLoadState();
        System.out.println("Opened Popup URL: " + popup.url());
        
        // Verify title & layout details of the popup
        assertThat(popup).hasTitle("QAClick Academy - A Academy to Learn Earn & Shine in your QA Career");
        
        popup.close(); // Close only the popup window
    }

    @Test(description = "Handle dynamic redirection links opening in a new browser tab")
    public void testSwitchTabRedirection() {
        page.navigate("https://rahulshettyacademy.com/AutomationPractice/");
        
        // Redirections with target=\"_blank\" are intercepted as new pages in Playwright
        Page newTab = page.context().waitForPage(() -> {
            page.locator("#opentab").click();
        });
        
        newTab.waitForLoadState();
        System.out.println("Opened Tab URL: " + newTab.url());
        
        assertThat(newTab).hasURL("https://www.qaclickacademy.com/");
        
        newTab.close(); // Clean up tab resource
    }
}
```

### 4. Interceptive Native Dialog Handler (`JavaScriptDialogTest.java`)
```java
package com.enterprise.framework.practice;

import com.microsoft.playwright.*;
import org.testng.annotations.Test;

public class JavaScriptDialogTest extends BaseTest {
    @Test(description = "Verify JavaScript Alert intercepts and confirms")
    public void testNativeAlertInterception() {
        page.navigate("https://rahulshettyacademy.com/AutomationPractice/");
        
        // Playwright handles dialogs by auto-dismissing them unless a listener is declared beforehand
        page.onceDialog(dialog -> {
            System.out.println("Intercepted dialog type: " + dialog.type());
            System.out.println("Alert message content: " + dialog.message());
            assert dialog.message().contains("John Doe");
            dialog.accept(); // Confirms the alert (clicks OK)
        });
        
        page.locator("#name").fill("John Doe");
        page.locator("#alertbtn").click(); // Triggers the JS Alert dialog
    }

    @Test(description = "Verify JavaScript Confirm dialog cancellation flows")
    public void testNativeConfirmInterception() {
        page.navigate("https://rahulshettyacademy.com/AutomationPractice/");
        
        page.onceDialog(dialog -> {
            System.out.println("Confirm message content: " + dialog.message());
            dialog.dismiss(); // Cancels the dialog (clicks Cancel)
        });
        
        page.locator("#confirmbtn").click(); // Triggers the JS Confirm dialog
    }
}
```

### 5. Tabular Data Scraper & Accumulator (`WebTableScraperTest.java`)
```java
package com.enterprise.framework.practice;

import com.microsoft.playwright.*;
import org.testng.annotations.Test;

public class WebTableScraperTest extends BaseTest {
    @Test(description = "Iterate through course table columns and assert price values")
    public void testWebTableIteration() {
        page.navigate("https://rahulshettyacademy.com/AutomationPractice/");
        
        Locator coursesTable = page.locator("table[name='courses']");
        Locator rows = coursesTable.locator("tr");
        int rowCount = rows.count();
        
        boolean courseFound = false;
        for (int i = 1; i < rowCount; i++) {
            String courseTitle = rows.nth(i).locator("td").nth(1).textContent();
            if (courseTitle.contains("SoapUI")) {
                String priceText = rows.nth(i).locator("td").nth(2).textContent();
                System.out.println("Found Course: " + courseTitle + " | Price: " + priceText);
                assert priceText.equals("35");
                courseFound = true;
                break;
            }
        }
        assert courseFound : "Expected SoapUI course was not found in the grid!";
    }

    @Test(description = "Extract and sum amount column in scrollable fixed-header tables")
    public void testFixedHeaderTableSummation() {
        page.navigate("https://rahulshettyacademy.com/AutomationPractice/");
        
        Locator amountRows = page.locator(".tableFixHead tbody tr");
        int sumTotal = 0;
        int rowCount = amountRows.count();
        
        for (int i = 0; i < rowCount; i++) {
            String amountText = amountRows.nth(i).locator("td").nth(3).textContent();
            sumTotal += Integer.parseInt(amountText.trim());
        }
        
        // Assert sum matches the collected text displayed on screen
        String onScreenText = page.locator(".totalAmount").textContent(); // \"Total Amount Collected: 296\"
        int displayedAmount = Integer.parseInt(onScreenText.replaceAll("[^0-9]", ""));
        
        assert sumTotal == displayedAmount : \"Sum total \" + sumTotal + \" does not match screen total \" + displayedAmount;
    }
}
```

### 6. Hover Menus, Visibility Toggles & Frames Controls (`HoverAndFrameTest.java`)
```java
package com.enterprise.framework.practice;

import com.microsoft.playwright.*;
import org.testng.annotations.Test;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class HoverAndFrameTest extends BaseTest {
    @Test(description = "Interact with elements hidden under CSS hover flyouts")
    public void testHoverOverlayInteraction() {
        page.navigate("https://rahulshettyacademy.com/AutomationPractice/");
        
        Locator hoverBtn = page.locator("#mousehover");
        // Hover action triggers the CSS overlay visibility shift
        hoverBtn.hover();
        
        Locator topLink = page.locator("a[href='#top']");
        // Click the revealed element inside overlay
        topLink.click();
    }

    @Test(description = "Verify hide and show visibility toggling")
    public void testElementVisibilityToggle() {
        page.navigate("https://rahulshettyacademy.com/AutomationPractice/");
        
        Locator textInput = page.locator("#displayed-text");
        
        // Click Hide button and assert it is hidden
        page.locator("#hide-textbox").click();
        assertThat(textInput).isHidden();
        
        // Click Show button and assert it is visible
        page.locator("#show-textbox").click();
        assertThat(textInput).isVisible();
    }

    @Test(description = "Interact with elements embedded inside nested HTML iframe blocks")
    public void testIFrameInteractions() {
        page.navigate("https://rahulshettyacademy.com/AutomationPractice/");
        
        // Instantiate FrameLocator context mapping the iframe container ID
        FrameLocator frameContext = page.frameLocator("#courses-iframe");
        
        // Navigate inside the frame and query elements (e.g. login link)
        Locator registerLink = frameContext.locator("a[href*='sign_in']").first();
        assertThat(registerLink).isVisible();
        System.out.println("Frame Register text: " + registerLink.textContent());
    }
}
```

---

## Playwright (JavaScript) Automation Suite

Below are the production-grade, modular Playwright JavaScript spec files (`@playwright/test`) for testing each widget category on the practice page:

### 1. Radio Buttons & Checkbox Elements (`checkboxAndRadio.spec.js`)
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Radio Buttons & Checkbox Elements', () => {
    test('Verify Radio Button selections and states', async ({ page }) => {
        await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
        
        // Locate and click Radio2 button
        const radio2 = page.locator('input[value="radio2"]');
        await radio2.click();
        
        // Assert checked status
        await expect(radio2).toBeChecked();
        
        // Verify other radio buttons are not selected
        const radio1 = page.locator('input[value="radio1"]');
        await expect(radio1).not.toBeChecked();
    });

    test('Verify Checkbox multiple selections and toggles', async ({ page }) => {
        await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
        
        const checkbox1 = page.locator('#checkBoxOption1');
        const checkbox3 = page.locator('#checkBoxOption3');

        // Check both options
        await checkbox1.check();
        await checkbox3.check();
        
        await expect(checkbox1).toBeChecked();
        await expect(checkbox3).toBeChecked();

        // Toggle checkbox1 off
        await checkbox1.uncheck();
        await expect(checkbox1).not.toBeChecked();
        await expect(checkbox3).toBeChecked();
    });
});
```

### 2. Autocomplete Suggestions & Static Selects (`dropdownAndSuggest.spec.js`)
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Autocomplete Suggestions & Static Selects', () => {
    test('Verify Suggestion Class Example auto-complete flow', async ({ page }) => {
        await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
        
        const countryInput = page.locator('#autocomplete');
        await countryInput.fill('Ind');
        
        // Wait for dynamic overlay elements to appear in the DOM and click "India"
        const suggestionOption = page.locator('.ui-menu-item div:has-text("India")');
        await suggestionOption.click();
        
        // Assert the input contains the selected option
        await expect(countryInput).hasValue('India');
    });

    test('Verify Static HTML Dropdown selections', async ({ page }) => {
        await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
        
        const dropdown = page.locator('#dropdown-class-example');
        
        // Select Option 3 by value
        await dropdown.selectOption('option3');
        await expect(dropdown).hasValue('option3');
        
        // Select Option 1 by visible label text
        await dropdown.selectOption({ label: 'Option1' });
        await expect(dropdown).hasValue('option1');
    });
});
```

### 3. Multi-Window & Multi-Tab Context Handler (`windowAndTab.spec.js`)
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Multi-Window & Multi-Tab Handler', () => {
    test('Handle dynamic browser popup windows', async ({ page, context }) => {
        await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
        
        // Listen for new page popup context opening concurrently during click
        const [popup] = await Promise.all([
            context.waitForEvent('page'),
            page.locator('#openwindow').click()
        ]);
        
        await popup.waitForLoadState();
        console.log(`Opened Popup URL: ${popup.url()}`);
        
        // Verify title of the popup
        await expect(popup).toHaveTitle('QAClick Academy - A Academy to Learn Earn & Shine in your QA Career');
        
        await popup.close(); // Close only the popup window
    });

    test('Handle dynamic redirection links opening in a new browser tab', async ({ page, context }) => {
        await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
        
        // Redirections with target="_blank" are intercepted as new pages in Playwright
        const [newTab] = await Promise.all([
            context.waitForEvent('page'),
            page.locator('#opentab').click()
        ]);
        
        await newTab.waitForLoadState();
        console.log(`Opened Tab URL: ${newTab.url()}`);
        
        await expect(newTab).toHaveURL('https://www.qaclickacademy.com/');
        
        await newTab.close(); // Clean up tab resource
    });
});
```

### 4. Interceptive Native Dialog Handler (`javaScriptDialog.spec.js`)
```javascript
const { test, expect } = require('@playwright/test');

test.describe('JavaScript Dialog Interception', () => {
    test('Verify JavaScript Alert intercepts and confirms', async ({ page }) => {
        await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
        
        // Playwright handles dialogs by auto-dismissing them unless a listener is declared beforehand
        page.once('dialog', async dialog => {
            console.log(`Intercepted dialog type: ${dialog.type()}`);
            console.log(`Alert message content: ${dialog.message()}`);
            expect(dialog.message()).toContain('John Doe');
            await dialog.accept(); // Confirms the alert (clicks OK)
        });
        
        await page.locator('#name').fill('John Doe');
        await page.locator('#alertbtn').click(); // Triggers the JS Alert dialog
    });

    test('Verify JavaScript Confirm dialog cancellation flows', async ({ page }) => {
        await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
        
        page.once('dialog', async dialog => {
            console.log(`Confirm message content: ${dialog.message()}`);
            await dialog.dismiss(); // Cancels the dialog (clicks Cancel)
        });
        
        await page.locator('#confirmbtn').click(); // Triggers the JS Confirm dialog
    });
});
```

### 5. Tabular Data Scraper & Accumulator (`webTableScraper.spec.js`)
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Web Table Scraper & Summation', () => {
    test('Iterate through course table columns and assert price values', async ({ page }) => {
        await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
        
        const coursesTable = page.locator('table[name="courses"]');
        const rows = coursesTable.locator('tr');
        const rowCount = await rows.count();
        
        let courseFound = false;
        for (let i = 1; i < rowCount; i++) {
            const courseTitle = await rows.nth(i).locator('td').nth(1).textContent();
            if (courseTitle.includes('SoapUI')) {
                const priceText = await rows.nth(i).locator('td').nth(2).textContent();
                console.log(`Found Course: ${courseTitle} | Price: ${priceText}`);
                expect(priceText).toBe('35');
                courseFound = true;
                break;
            }
        }
        expect(courseFound).toBeTruthy();
    });

    test('Extract and sum amount column in scrollable fixed-header tables', async ({ page }) => {
        await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
        
        const amountRows = page.locator('.tableFixHead tbody tr');
        let sumTotal = 0;
        const rowCount = await amountRows.count();
        
        for (let i = 0; i < rowCount; i++) {
            const amountText = await amountRows.nth(i).locator('td').nth(3).textContent();
            sumTotal += parseInt(amountText.trim(), 10);
        }
        
        // Assert sum matches the collected text displayed on screen
        const onScreenText = await page.locator('.totalAmount').textContent(); // "Total Amount Collected: 296"
        const displayedAmount = parseInt(onScreenText.replace(/[^0-9]/g, ''), 10);
        
        expect(sumTotal).toBe(displayedAmount);
    });
});
```

### 6. Hover Menus, Visibility Toggles & Frames Controls (`hoverAndFrame.spec.js`)
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Hover, Visibility Toggles & Frame Interactions', () => {
    test('Interact with elements hidden under CSS hover flyouts', async ({ page }) => {
        await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
        
        const hoverBtn = page.locator('#mousehover');
        // Hover action triggers the CSS overlay visibility shift
        await hoverBtn.hover();
        
        const topLink = page.locator('a[href="#top"]');
        // Click the revealed element inside overlay
        await topLink.click();
    });

    test('Verify hide and show visibility toggling', async ({ page }) => {
        await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
        
        const textInput = page.locator('#displayed-text');
        
        // Click Hide button and assert it is hidden
        await page.locator('#hide-textbox').click();
        await expect(textInput).toBeHidden();
        
        // Click Show button and assert it is visible
        await page.locator('#show-textbox').click();
        await expect(textInput).toBeVisible();
    });

    test('Interact with elements embedded inside nested HTML iframe blocks', async ({ page }) => {
        await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
        
        // Instantiate FrameLocator context mapping the iframe container ID
        const frameContext = page.frameLocator('#courses-iframe');
        
        // Navigate inside the frame and query elements (e.g. login link)
        const registerLink = frameContext.locator("a[href*='sign_in']").first();
        await expect(registerLink).toBeVisible();
        console.log(`Frame Register text: ${await registerLink.textContent()}`);
    });
});
```

---

## Playwright Code-Based Interview Q&As

These technical, code-focused questions verify real-world implementation depth and debugging skills in Playwright:

### Q1: Write a code block demonstrating how to wait for dynamic auto-complete suggestions overlay dropdowns to populate, locate the item "India" when the index is unknown, and verify selection.

**Answer:**
Autocomplete suggestions are added asynchronously to the DOM. You fill the prefix, locate the dynamic dropdown elements, and click the item matching the target string:
```java
// 1. Target the autocomplete text field and key in input search string
Locator autocompleteInput = page.locator("#autocomplete");
autocompleteInput.fill("Ind");

// 2. Identify the dynamic overlay popup list options in DOM and target by text content
Locator targetOption = page.locator(".ui-menu-item div:has-text('India')");

// 3. Perform the click (Playwright automatically waits for it to become visible and clickable)
targetOption.click();

// 4. Validate output matches expected value
assertThat(autocompleteInput).hasValue("India");
```

> Hot take: *"Dynamic dropdown suggestions are asynchronous races. Do not use thread sleep or index selections like nth(0) because server latency and sorting shifts will cause CI tests to fail intermittently. Rely on text match locator wrappers (`has-text`) which leverage Playwright's built-in auto-waiting."*

---

### Q2: Contrast handling Javascript dialog alerts in Playwright versus Selenium. Write code to automatically check the message of a Javascript confirm popup and click "Cancel".

**Answer:**
Unlike Selenium (where you block thread execution and call `driver.switchTo().alert()`), Playwright is event-driven. By default, Playwright automatically dismisses (clicks Cancel on) all Javascript popups to prevent execution hangs. To interact with them, you must register a listener callback *before* trigger execution:
```java
// Register alert intercept listener BEFORE the button click
page.onceDialog(dialog -> {
    // Assert the dialog type is a confirm popup
    System.out.println("Type: " + dialog.type()); // \"confirm\"
    // Inspect alert text
    assert dialog.message().equals("Are you sure you want to proceed?");
    
    // Choose behavior: dismiss() clicks Cancel, accept() clicks OK
    dialog.dismiss();
});

// Click button that triggers dialog
page.locator("#confirmbtn").click();
```

> Hot take: *"Selenium forces synchronous blocking threads to handle alerts, whereas Playwright's event-driven handler intercepts them instantly. If you forget to register your listener BEFORE the action trigger, Playwright will auto-dismiss it before your handler can catch it. Always register dialog hook listeners preemptively."*

---

### Q3: Provide code to interact with a dynamic element inside a nested iFrame. What is the difference between `page.frame()` and `page.frameLocator()`?

**Answer:**
* `page.frame(nameOrUrl)` returns a static reference to a frame. If the frame re-renders or relocates, elements retrieved from it will cause stale element errors.
* `page.frameLocator(selector)` provides a locator query mapping that supports Playwright's **auto-waiting** and **auto-healing** behaviors. Element interactions are resolved dynamically on execution.
```java
// Create a dynamic frame context locator using the iframe's element ID
FrameLocator registerFrame = page.frameLocator("#courses-iframe");

// Locate, wait for visibility, and click the link directly inside iframe context
Locator registerBtn = registerFrame.locator("a[href*='sign_in']").first();
assertThat(registerBtn).isVisible();
registerBtn.click();
```

> Hot take: *"Static `page.frame()` references are a recipe for flaky tests because dynamic iframes reload their sub-DOM independently. Always use `FrameLocator` to leverage Playwright's auto-waiting and live locator resolution, ensuring you never face stale frame errors."*

---

### Q4: Write a Java block utilizing Playwright context events to click a button that opens a new browser window/tab, switch focus to it, assert its page title, and clean up.

**Answer:**
In Playwright, new contexts are captured using `waitForPage()` bound to browser contexts:
```java
// Wait for a new page event concurrently with the click trigger
Page newWindow = page.context().waitForPage(() -> {
    page.locator("#openwindow").click();
});

// Ensure document has finished loading
newWindow.waitForLoadState();

// Validate title details of the secondary window
assertThat(newWindow).hasTitle("QAClick Academy - A Academy to Learn Earn & Shine in your QA Career");

// Close the second tab context to reclaim memory
newWindow.close();
```

> Hot take: *"Never rely on indices like context.pages().get(1) to find new tabs. In parallel runs, pages can open in non-deterministic order. Always use the concurrent page listener callback wrapper to capture the specific page handle opened by your click action."*

---

### Q5: Write a custom loop script to read a web table of course data, find the row that has Instructor "Rahul Shetty" and Course "WebServices / REST API Testing", extract its Price column value, and assert it is "35".

**Answer:**
```java
Locator tableRows = page.locator("table[name='courses'] tr");
int rowCount = tableRows.count();
boolean targetFound = false;

// Iterate rows (skip index 0 containing table header row)
for (int i = 1; i < rowCount; i++) {
    Locator currentRow = tableRows.nth(i);
    String instructor = currentRow.locator("td").nth(0).textContent();
    String course = currentRow.locator("td").nth(1).textContent();
    
    if (instructor.contains("Rahul Shetty") && course.contains("WebServices / REST API Testing")) {
        String price = currentRow.locator("td").nth(2).textContent();
        assert price.trim().equals("35") : "Price mismatch: Expected 35, got " + price;
        targetFound = true;
        break;
    }
}
assert targetFound : "Target course and instructor combination not found!";
```

> Hot take: *"Table scraping loops are slow and CPU intensive. For production pipelines, prefer using XPath sibling selectors: `//table[@name='courses']//tr[td[1][contains(.,'Rahul Shetty')] and td[2][contains(.,'WebServices')]]/td[3]`. It delegates the query traversal to the browser's native C++ engine, speeding execution up to 5x."*

---

## RestAssured API Automation Suite

This section demonstrates how to use **RestAssured** for backend and integration testing in conjunction with the automation practice website, including checking for broken resource links and verifying backend API endpoints.

### 1. Broken Links Verifier (HTTP HEAD / GET Checks)
Automates checking all external reference anchor tags on the page for HTTP redirect or dead 404 links using concurrent HTTP requests.

```java
package com.enterprise.framework.practice;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.Browser;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Locator;
import java.util.List;

public class BrokenLinkChecker {
    public static void main(String[] args) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch();
            Page page = browser.newPage();
            page.navigate("https://rahulshettyacademy.com/AutomationPractice/");
            
            // Collect all link elements in the page
            List<String> urls = page.locator("li.gf-li a").allAttributeValues("href");
            
            System.out.println("Validating " + urls.size() + " footer link URLs using RestAssured...");
            
            for (String url : urls) {
                if (url == null || url.isEmpty() || url.startsWith("#")) {
                    continue;
                }
                
                // Fire lightweight HEAD requests to examine HTTP status codes without pulling full HTML bodies
                Response response = RestAssured.given()
                        .redirects().follow(true) // follow redirects to final target
                        .when()
                        .head(url);
                
                int statusCode = response.getStatusCode();
                if (statusCode >= 400) {
                    System.err.println("❌ BROKEN LINK FOUND: " + url + " responded with status: " + statusCode);
                } else {
                    System.out.println("✅ LINK OK: " + url + " (Status: " + statusCode + ")");
                }
            }
        }
    }
}
```

### 2. Dynamic Course Inventory REST API Integration Test
Demonstrates how to structure validation rules for downstream data providers feeding automation grids. In a real-world enterprise setting, you fetch the table data via backend REST APIs to verify UI-to-DB alignment.

```java
package com.enterprise.framework.practice;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

public class PracticeApiTest {

    @BeforeClass
    public void setup() {
        RestAssured.baseURI = "https://rahulshettyacademy.com";
    }

    @Test
    public void verifyCourseInventoryFeed() {
        // Assert that the inventory system API returns correct course configurations
        given()
            .contentType(ContentType.JSON)
            .queryParam("category", "automation")
        .when()
            .get("/api/v1/courses")
        .then()
            .statusCode(200)
            .header("Content-Type", containsString("application/json"))
            .body("instructor", equalTo("Rahul Shetty"))
            .body("courses.find { it.courseTitle == 'Selenium Webdriver with Java Basics + Advanced + Interview Guide' }.price", equalTo("30"))
            .body("courses.courseTitle", hasItems(
                "Learn SQL in Practical + Database Testing from Scratch",
                "Appium (Selenium) - Mobile Automation Testing from Scratch",
                "WebServices / REST API Testing with SoapUI"
            ));
    }
    
    @Test
    public void verifyAmountCollectedFeed() {
        // Assert that backend summation models are accurate
        given()
            .contentType(ContentType.JSON)
        .when()
            .get("/api/v1/collected-amounts")
        .then()
            .statusCode(200)
            .body("totalAmount", equalTo(296))
            .body("data.find { it.name == 'Ben' }.position", equalTo("Mechanic"))
            .body("data.find { it.name == 'Dwayne' }.amount", equalTo("48"));
    }
}
```

### 3. API-UI Hybrid Verification pattern
Accelerates regression suites by combining RestAssured database/state seeds with target UI automation runs.

```java
package com.enterprise.framework.practice;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import com.microsoft.playwright.*;
import org.testng.annotations.Test;
import java.util.List;
import static io.restassured.RestAssured.given;

public class HybridTest {

    @Test
    public void testProfileUpdateHybridFlow() {
        // 1. Seed user configuration settings via RestAssured REST calls in 0.5s
        String sessionCookie = given()
            .contentType(ContentType.JSON)
            .body("{\"username\":\"tester\",\"password\":\"pwd123\"}")
        .when()
            .post("https://rahulshettyacademy.com/api/v1/login")
        .then()
            .statusCode(200)
            .extract().cookie("session_id");

        // 2. Launch browser, inject session token directly into BrowserContext, and navigate past login screen
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch();
            BrowserContext context = browser.newContext();
            
            // Directly seed authenticated state cookies into browser sandbox
            context.addCookies(List.of(
                new com.microsoft.playwright.options.Cookie("session_id", sessionCookie)
                    .setDomain("rahulshettyacademy.com")
                    .setPath("/")
            ));
            
            Page page = context.newPage();
            page.navigate("https://rahulshettyacademy.com/AutomationPractice/");
            
            // 3. Begin testing protected page content directly (bypassing slow UI login form)
            Locator tableHeader = page.locator(".tableFixHead table th").first();
            com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat(tableHeader).hasText("Name");
        }
    }
}
```
