/* learn.js — Learning Lab v2: guided section-by-section teaching */
(function initLearnLab() {
  var root = document.getElementById('learn-root');
  if (!root) return;

  /* ================================================================
     CONTENT BANK — ground-0 teaching, one concept at a time
     Each section can have: h, intro, analogy, body, callouts[], code, code2, steps[]
     callout types: 'insight' | 'warning' | 'tip' | 'exercise'
     ================================================================ */
  var CONTENT = {

    'playwright-pom': {
      title: 'Playwright — Page Object Model',
      emoji: '🎭',
      tagline: 'Write tests that survive UI changes',
      level: 'Intermediate', time: '20 min',
      sections: [
        {
          h: '① The Problem — Why Your Tests Break So Often',
          intro: 'Imagine you write 50 tests that all contain this line: <code>page.click("#submit-btn-v2")</code>. The designer renames that button ID to <code>#btn-submit</code>. You now have 50 broken tests to fix.',
          body: 'This is the core pain point of brittle automation. The fix is the Page Object Model — a design pattern where <strong>each page of your app has exactly one class</strong> that owns all the locators and actions for that page. Your 50 tests call <code>checkoutPage.clickSubmit()</code>. When the ID changes, you fix it in <em>one place</em>.',
          callouts: [
            { type: 'insight', text: 'POM is not a Playwright feature — it is a design pattern you apply on top of any automation tool.' },
            { type: 'warning', text: 'Without POM, a single UI change cascades into dozens of test failures. With POM, it is a 30-second fix.' }
          ]
        },
        {
          h: '② Your First Page Object — Step by Step',
          intro: 'Let\'s build a LoginPage class from scratch. The goal: hide every locator inside the class and expose only meaningful actions.',
          code: `// ❌  BEFORE POM — selectors scattered everywhere
// tests/login.spec.ts
test('login works', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#email-input', 'alice@test.com');
  await page.fill('#pw-input', 'secret123');
  await page.click('button[type="submit"]');
  await expect(page.locator('.welcome-msg')).toBeVisible();
});

// If ANY selector changes → test breaks`,
          code2: `// ✅  AFTER POM — clean, resilient, readable
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  // Step 1: declare locators as private class fields
  private emailInput: Locator;
  private passwordInput: Locator;
  private submitBtn: Locator;

  constructor(private page: Page) {
    // Step 2: assign locators ONCE in the constructor
    this.emailInput    = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitBtn     = page.getByRole('button', { name: 'Log in' });
  }

  // Step 3: expose actions, not locators
  async goto()                              { await this.page.goto('/login'); }
  async fillEmail(email: string)            { await this.emailInput.fill(email); }
  async fillPassword(pw: string)            { await this.passwordInput.fill(pw); }
  async submit()                            { await this.submitBtn.click(); }

  // Combine steps into a higher-level action
  async login(email: string, pw: string) {
    await this.fillEmail(email);
    await this.fillPassword(pw);
    await this.submit();
  }
}`,
          callouts: [
            { type: 'tip', text: 'Use getByLabel/getByRole over CSS IDs. They reflect real user interaction and survive style/ID refactors.' }
          ]
        },
        {
          h: '③ Using the Page Object in a Test',
          body: 'Now your tests read like a plain-English script. Anyone — including a non-technical PM — can understand what each test does.',
          code: `// tests/auth.spec.ts
import { test, expect }    from '@playwright/test';
import { LoginPage }       from '../pages/LoginPage';
import { DashboardPage }   from '../pages/DashboardPage';

test('valid credentials land on dashboard', async ({ page }) => {
  const login     = new LoginPage(page);
  const dashboard = new DashboardPage(page);

  await login.goto();
  await login.login('alice@test.com', 'secret123');

  // Assertions stay in the TEST, never in the page object
  await expect(page).toHaveURL('/dashboard');
  await expect(dashboard.welcomeHeading).toContainText('Alice');
});

test('wrong password shows error', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('alice@test.com', 'WRONG');
  await expect(page.getByRole('alert')).toHaveText('Invalid credentials');
});`,
          callouts: [
            { type: 'warning', text: 'NEVER put expect() assertions inside a Page Object. Assertions belong in the test. Page objects = actions only.' }
          ]
        },
        {
          h: '④ Level Up — Fixtures (Remove All Boilerplate)',
          intro: 'Right now every test file does <code>const login = new LoginPage(page)</code>. That\'s repetition. Playwright Fixtures inject page objects automatically.',
          code: `// fixtures/index.ts  — define ONCE, use everywhere
import { test as base } from '@playwright/test';
import { LoginPage }    from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

// Declare the shape of our custom fixtures
type MyFixtures = {
  loginPage:  LoginPage;
  dashboard:  DashboardPage;
};

// Extend base test with our fixtures
export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));   // inject LoginPage into each test
  },
  dashboard: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});
export { expect } from '@playwright/test';`,
          code2: `// tests/auth.spec.ts — now completely boilerplate-free
import { test, expect } from '../fixtures';  // ← our custom test

test('login works', async ({ loginPage, dashboard }) => {
  // loginPage and dashboard are already instantiated for us
  await loginPage.goto();
  await loginPage.login('alice@test.com', 'secret');
  await expect(dashboard.welcomeHeading).toBeVisible();
});`,
          callouts: [
            { type: 'insight', text: 'Fixtures = dependency injection for Playwright. Playwright creates them, passes them in, and cleans them up. You never call new LoginPage() again.' }
          ]
        },
        {
          h: '⑤ Project Structure & Golden Rules',
          code: `project/
├── pages/
│   ├── LoginPage.ts          ← one file per page/feature
│   ├── DashboardPage.ts
│   ├── CheckoutPage.ts
│   └── components/
│       └── NavBar.ts         ← shared UI components get their own class
├── fixtures/
│   └── index.ts              ← all fixtures in one place
├── tests/
│   ├── auth.spec.ts
│   └── checkout.spec.ts
└── playwright.config.ts`,
          callouts: [
            { type: 'tip', text: '✅ Page objects own locators + actions\n✅ Tests own assertions + data\n✅ Fixtures own object creation\n❌ Never mix these responsibilities' },
            { type: 'exercise', text: 'Exercise: Build a SearchPage class with: locator for the search input, a search(query) method, and a getResults() method that returns the results locator. Then write one test using it.' }
          ]
        },
        {
          h: '⑥ Self-Check — Test Your Understanding',
          steps: [
            { q: 'Where should you put expect() — inside the Page Object or inside the test?', a: 'Always in the TEST. Page Objects are action-only. This keeps them reusable across different assertion scenarios.' },
            { q: 'What is the advantage of getByRole("button", { name: "Log in" }) over page.locator("#login-btn")?', a: 'getByRole reflects real user intent and survives ID/class renames. It also ensures the button is actually accessible (has a proper ARIA role).' },
            { q: 'You have 30 test files all importing LoginPage. The login URL changes from /login to /auth/login. How many files do you edit?', a: 'ONE — just LoginPage.ts. The goto() method is defined once. This is the entire point of POM.' }
          ]
        }
      ]
    },

    'async-await': {
      title: 'JavaScript — Promises & async/await',
      emoji: '⚡',
      tagline: 'Tame asynchronous code forever',
      level: 'Beginner', time: '25 min',
      sections: [
        {
          h: '① The Problem — JavaScript is Single-Threaded',
          intro: 'JavaScript runs on a single thread. It can only do one thing at a time. But fetching data from a server, reading a file, or waiting for a timer all take time. How does JS stay responsive without freezing?',
          analogy: '🍕 Analogy: You order a pizza. You don\'t stand at the door staring for 30 minutes. You go watch TV (do other work). When the doorbell rings (callback), you go get the pizza. JavaScript works the same way — it starts an async task, continues doing other things, and handles the result when it\'s ready.',
          callouts: [
            { type: 'insight', text: 'JavaScript never truly "waits". It starts a task, hands it off to the browser/Node runtime, and moves on. The result comes back via a callback, Promise, or await.' }
          ]
        },
        {
          h: '② Callbacks — The Old Way (and Why They\'re Painful)',
          body: 'Before Promises, everything was done with callbacks — functions you pass in to be called when the async work is done.',
          code: `// Callback style — fetch user, then their orders, then the product
getUserFromDB(userId, function(err, user) {
  if (err) return handleError(err);

  getOrdersForUser(user.id, function(err, orders) {
    if (err) return handleError(err);

    getProductDetails(orders[0].productId, function(err, product) {
      if (err) return handleError(err);

      console.log(product.name);
      // This is "Callback Hell" — pyramid of doom
    });
  });
});`,
          callouts: [
            { type: 'warning', text: 'Problems with callbacks: (1) Error handling at every level, (2) Code indents rightward to infinity, (3) Can\'t use try/catch, (4) Hard to read the execution order.' }
          ]
        },
        {
          h: '③ Promises — A Better Abstraction',
          intro: 'A Promise is an object representing a value that will be available <em>now, later, or never</em>. It has 3 states: <strong>pending</strong> (waiting), <strong>fulfilled</strong> (got a value), <strong>rejected</strong> (something went wrong).',
          code: `// The same logic with Promises — flat and chainable
getUserFromDB(userId)
  .then(user => getOrdersForUser(user.id))     // runs after getUserFromDB resolves
  .then(orders => getProductDetails(orders[0].productId))
  .then(product => console.log(product.name))   // final result
  .catch(err => handleError(err));               // ONE catch handles ALL errors above

// Creating your own Promise
function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);  // resolves after ms milliseconds
  });
}

// Using it
delay(1000).then(() => console.log('1 second passed'));`,
          callouts: [
            { type: 'insight', text: 'A .then() always returns a new Promise, which is why you can chain them. Each .then() receives the return value of the previous one.' }
          ]
        },
        {
          h: '④ async/await — Promises With a Clean Face',
          intro: 'async/await is just syntax sugar over Promises. Under the hood it is exactly the same — but it reads like synchronous code.',
          code: `// RULE 1: Mark a function async → it always returns a Promise
async function getProductForUser(userId) {

  // RULE 2: await pauses THIS function (not the whole program) until Promise resolves
  const user    = await getUserFromDB(userId);
  const orders  = await getOrdersForUser(user.id);
  const product = await getProductDetails(orders[0].productId);

  return product;  // returned value is wrapped in a Promise automatically
}

// RULE 3: Use try/catch for error handling — works like synchronous code
async function safe_getProduct(userId) {
  try {
    const product = await getProductForUser(userId);
    console.log(product.name);
  } catch (err) {
    console.error('Something went wrong:', err.message);
  }
}`,
          callouts: [
            { type: 'warning', text: 'Common mistake: forgetting await. If you write  const user = getUserFromDB(id)  without await, user will be a Promise object, NOT the user data. Always await async functions.' }
          ]
        },
        {
          h: '⑤ Parallel vs Sequential — The Key Performance Insight',
          intro: 'Sequential await calls wait for each one to finish before starting the next. If each takes 1 second, 3 calls = 3 seconds. But if they\'re independent, run them in parallel!',
          code: `// ❌ Sequential — total time = 1s + 1s + 1s = 3 seconds
const user    = await fetchUser(id);      // wait 1s
const orders  = await fetchOrders(id);   // wait another 1s
const prefs   = await fetchPrefs(id);    // wait another 1s

// ✅ Parallel with Promise.all — total time = ~1 second
const [user, orders, prefs] = await Promise.all([
  fetchUser(id),     // all 3 start at the same time
  fetchOrders(id),
  fetchPrefs(id),
]);
// Promise.all resolves when ALL three resolve
// Promise.all REJECTS if ANY one rejects`,
          code2: `// Other Promise combinators you need to know:

// Promise.allSettled — waits for ALL, never rejects
// Use when you want results even if some fail
const results = await Promise.allSettled([fetch('/a'), fetch('/b'), fetch('/broken')]);
results.forEach(r => {
  if (r.status === 'fulfilled') console.log('✅', r.value);
  else console.log('❌', r.reason);
});

// Promise.race — resolves/rejects as soon as the FIRST settles
// Use for timeouts
const data = await Promise.race([
  fetchData(),
  new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
]);`,
          callouts: [
            { type: 'tip', text: 'Use Promise.all when your tasks are independent. Use sequential await when each result depends on the previous (like: get user → get user\'s orders → get order details).' }
          ]
        },
        {
          h: '⑥ Common Traps & Self-Check',
          code: `// TRAP 1: await inside forEach doesn't work
// ❌ forEach is not async-aware
items.forEach(async (item) => {
  await processItem(item);  // runs but forEach doesn't wait for it
});

// ✅ Use for...of instead
for (const item of items) {
  await processItem(item);  // waits for each one
}

// ✅ Or run all in parallel
await Promise.all(items.map(item => processItem(item)));

// TRAP 2: Unhandled rejections
const data = fetchData();  // forgot await AND .catch()
// If fetchData() rejects → UnhandledPromiseRejection → process crash in Node.js

// TRAP 3: async in constructor — not allowed
class MyClass {
  constructor() {
    await this.init();  // ❌ SyntaxError — constructors can't be async
  }
  // ✅ Use a static factory method instead
  static async create() { const obj = new MyClass(); await obj.init(); return obj; }
}`,
          steps: [
            { q: 'What are the 3 states of a Promise?', a: 'pending (waiting), fulfilled (resolved with a value), rejected (failed with a reason).' },
            { q: 'You have 5 independent API calls. What\'s the fastest way to await all of them?', a: 'await Promise.all([call1(), call2(), call3(), call4(), call5()]) — all start simultaneously, total time = slowest single call.' },
            { q: 'What happens if you forget the await keyword before an async function call?', a: 'You get a Promise object instead of the resolved value. Your variable holds Promise { <pending> } not the actual data.' }
          ]
        }
      ]
    },

    'ts-generics': {
      title: 'TypeScript — Generics',
      emoji: '🔷',
      tagline: 'Write code that works for any type, safely',
      level: 'Intermediate', time: '20 min',
      sections: [
        {
          h: '① The Problem — Copy-Paste Code or Unsafe any',
          intro: 'You need a function that returns the first item of an array. But what type does it return?',
          code: `// Option A: Duplicate the function for every type (terrible)
function firstNumber(arr: number[]): number { return arr[0]; }
function firstString(arr: string[]): string  { return arr[0]; }
function firstUser(arr: User[]): User        { return arr[0]; }
// ... one per type, forever

// Option B: Use any (loses all type safety)
function first(arr: any[]): any { return arr[0]; }
const item = first([1, 2, 3]);
item.toUpperCase();  // TypeScript won't catch this — runtime crash!`,
          callouts: [
            { type: 'insight', text: 'Generics solve this exact problem. Write the function ONCE. TypeScript figures out the return type from what you pass in.' }
          ]
        },
        {
          h: '② Your First Generic — The <T> Syntax',
          intro: '<code>&lt;T&gt;</code> is a type parameter — a placeholder that gets filled in when the function is called. Think of T as a variable, but for types instead of values.',
          analogy: '📦 Analogy: A cardboard box is generic — it can hold books, shoes, or food. The box itself doesn\'t care what\'s inside. But once you put books in it, it\'s a "book box" and TypeScript knows that box.contents is a book, not a shoe.',
          code: `// One generic function replaces all the duplicates above
function first<T>(arr: T[]): T {
  return arr[0];
//       ^ T is inferred from what you pass in
}

// TypeScript INFERS T automatically — no need to write it explicitly
const n = first([1, 2, 3]);        // T = number → n: number
const s = first(['a', 'b', 'c']);  // T = string → s: string
const u = first(users);            // T = User   → u: User

// TypeScript now catches this error at compile time:
n.toUpperCase();  // ❌ Error: Property 'toUpperCase' does not exist on type 'number'`,
          callouts: [
            { type: 'tip', text: 'T is just a convention. You can use any name: <Item>, <Value>, <TData>. But T, U, K, V are standard and what interviewers expect to see.' }
          ]
        },
        {
          h: '③ Generic Interfaces & Classes',
          code: `// Generic Interface — a contract that works for any type
interface ApiResponse<T> {
  data: T;           // T is whatever the API returns
  status: number;
  message: string;
}

// Now use it for any endpoint
const userResp: ApiResponse<User>    = await fetchUser();
const listResp: ApiResponse<User[]>  = await fetchUsers();
const numResp:  ApiResponse<number>  = await fetchCount();

// T is replaced at the point of use — fully type-safe

// Generic Class — a Stack that works for any type
class Stack<T> {
  private items: T[] = [];

  push(item: T): void      { this.items.push(item); }
  pop():  T | undefined    { return this.items.pop(); }
  peek(): T | undefined    { return this.items[this.items.length - 1]; }
  isEmpty(): boolean       { return this.items.length === 0; }
}

const numStack = new Stack<number>();
numStack.push(1);
numStack.push('hello');  // ❌ TypeScript Error — string not assignable to number`,
          callouts: [
            { type: 'insight', text: 'When you write new Stack<number>(), TypeScript replaces every T in the class with number. Attempting to push a string is caught at compile time — zero runtime cost.' }
          ]
        },
        {
          h: '④ Constraints — Limiting What T Can Be',
          intro: 'Sometimes you need T to have certain properties. Use <code>extends</code> to constrain what types are allowed.',
          code: `// Problem: You want to print the .name property of any object
function printName<T>(item: T): void {
  console.log(item.name);  // ❌ Error — TypeScript doesn't know T has .name
}

// Solution: Constrain T to have at least a name property
function printName<T extends { name: string }>(item: T): void {
  console.log(item.name);  // ✅ TypeScript now knows .name exists
}

printName({ name: 'Alice', age: 30 });  // ✅ has name
printName({ age: 30 });                 // ❌ missing name — compile error

// Real-world: type-safe property getter
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
  //          ^ return type is exactly T[K], not any!
}

const user = { name: 'Alice', age: 30, email: 'alice@test.com' };
getProperty(user, 'name');   // ✅ returns string
getProperty(user, 'age');    // ✅ returns number
getProperty(user, 'phone');  // ❌ 'phone' is not a key of user — compile error`,
          callouts: [
            { type: 'tip', text: 'keyof T gives you a union of all property names: keyof {name: string; age: number} = "name" | "age". Combine with generics for type-safe object access.' }
          ]
        },
        {
          h: '⑤ Built-In Generic Utility Types',
          intro: 'TypeScript ships with powerful built-in generic types you should memorize — they come up in interviews constantly.',
          code: `interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Partial<T> — makes ALL properties optional
type UserUpdate = Partial<User>;
// { id?: number; name?: string; email?: string; password?: string }

// Required<T> — makes ALL properties required
// Readonly<T> — makes ALL properties immutable
const u: Readonly<User> = { id: 1, name: 'Alice', email: 'a@b.com', password: 'x' };
u.name = 'Bob';  // ❌ Error — cannot assign to readonly property

// Pick<T, K> — keep only the listed properties
type PublicUser = Pick<User, 'id' | 'name'>;
// { id: number; name: string }  ← no email, no password

// Omit<T, K> — remove listed properties
type SafeUser = Omit<User, 'password'>;
// { id: number; name: string; email: string }

// Record<K, V> — dictionary type
type UserMap = Record<string, User>;  // { [key: string]: User }

// ReturnType<F> — extract the return type of a function
function createUser() { return { id: 1, name: 'Alice' }; }
type CreatedUser = ReturnType<typeof createUser>;  // { id: number; name: string }`,
          callouts: [
            { type: 'exercise', text: 'Exercise: Given interface Product { id: number; name: string; price: number; stock: number; }, create: (1) a ReadonlyProduct type, (2) a ProductPreview with only id and name, (3) a ProductUpdate where all fields are optional except id.' }
          ]
        },
        {
          h: '⑥ Self-Check',
          steps: [
            { q: 'What is the difference between <T> and any?', a: 'any turns off type checking. <T> preserves type safety — TypeScript infers what T is from usage and enforces it throughout. With any, TypeScript trusts you blindly. With T, it verifies.' },
            { q: 'What does <T extends { id: string }> mean?', a: 'T must be a type that has at least an id property of type string. T can have other properties too, but id: string is required.' },
            { q: 'What does Omit<User, "password"> produce?', a: 'A new type identical to User but with the password property removed — useful for creating safe public-facing types.' }
          ]
        }
      ]
    },

    'rest-api-postman': {
      title: 'REST API Testing with Postman',
      emoji: '🔌',
      tagline: 'Test APIs like a pro, automate with Newman',
      level: 'Beginner', time: '20 min',
      sections: [
        {
          h: '① What is an API and Why Do We Test It?',
          analogy: '🍽️ Analogy: A restaurant kitchen (server) and a waiter (API). You (client) don\'t go into the kitchen. You tell the waiter what you want. The waiter fetches it and brings it back. The API is the waiter — it defines exactly what you can ask for and how to ask for it.',
          body: 'UI tests are slow and brittle. API tests are fast, stable, and test the actual business logic. A bug in the API affects every client (web, mobile, third-party) — catching it early is critical.',
          callouts: [
            { type: 'insight', text: 'API tests run 10-100x faster than UI tests. A good strategy: 70% API tests, 20% UI tests, 10% manual exploratory.' }
          ]
        },
        {
          h: '② HTTP Methods — The Verbs of REST',
          code: `GET    /api/users          → List all users (safe, idempotent, no body)
GET    /api/users/123      → Get user with ID 123
POST   /api/users          → Create a new user (body required, NOT idempotent)
PUT    /api/users/123      → Full replace user 123 (all fields required)
PATCH  /api/users/123      → Partial update (only changed fields)
DELETE /api/users/123      → Delete user 123 (idempotent)

// Status Code Quick Reference
200 OK            → Success (GET, PUT, PATCH)
201 Created       → New resource created (POST)
204 No Content    → Success, no body returned (DELETE)
400 Bad Request   → Client sent invalid data
401 Unauthorized  → Not logged in / no token
403 Forbidden     → Logged in but no permission
404 Not Found     → Resource doesn't exist
422 Unprocessable → Validation failed (right format, wrong data)
429 Too Many Req  → Rate limited
500 Server Error  → Bug on the server side`,
          callouts: [
            { type: 'tip', text: 'Idempotent = calling it multiple times gives the same result. GET, PUT, DELETE are idempotent. POST is not (creates a new resource each time).' }
          ]
        },
        {
          h: '③ Writing Postman Test Scripts',
          intro: 'Postman runs JavaScript in the Tests tab after each response. Use pm.test() to define assertions.',
          code: `// ── Postman Tests Tab (JavaScript) ──

// Basic checks every request should have
pm.test("Status is 200", () => {
    pm.response.to.have.status(200);
});
pm.test("Response time under 500ms", () => {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// Parse and validate the response body
const body = pm.response.json();

pm.test("Response has required fields", () => {
    pm.expect(body).to.have.property('id');
    pm.expect(body.name).to.be.a('string').and.not.empty;
    pm.expect(body.email).to.match(/^[^@]+@[^@]+\.[^@]+$/);
});

pm.test("ID is a positive integer", () => {
    pm.expect(body.id).to.be.a('number').and.above(0);
});

// Store values for chained requests
pm.environment.set("createdUserId", body.id);
pm.environment.set("authToken", body.token);`,
          callouts: [
            { type: 'tip', text: 'Use pm.environment.set() to pass data between requests. Common pattern: Request 1 creates a user → stores the ID → Request 2 fetches/updates that user using {{createdUserId}}.' }
          ]
        },
        {
          h: '④ Environment Variables & Pre-request Scripts',
          code: `// Variables in request URL:    {{baseUrl}}/api/users/{{userId}}
// Variables in headers:         Authorization: Bearer {{authToken}}

// Pre-request Script — auto-refresh token before each request
const tokenExpiry = pm.environment.get("tokenExpiry");
const now = Date.now();

if (!tokenExpiry || now > parseInt(tokenExpiry)) {
    // Token missing or expired — get a new one
    pm.sendRequest({
        url: pm.environment.get("baseUrl") + "/auth/login",
        method: "POST",
        header: { "Content-Type": "application/json" },
        body: {
            mode: "raw",
            raw: JSON.stringify({
                email:    pm.environment.get("testEmail"),
                password: pm.environment.get("testPassword")
            })
        }
    }, (err, res) => {
        const token = res.json().accessToken;
        pm.environment.set("authToken", token);
        pm.environment.set("tokenExpiry", now + 3600000); // 1hr
    });
}`,
          callouts: [
            { type: 'insight', text: 'Never hardcode credentials in tests. Store them in Postman Environments. Use different environments for dev/staging/prod — switch with one click.' }
          ]
        },
        {
          h: '⑤ Schema Validation & Newman CI',
          code: `// Schema validation in Postman Tests tab (using Ajv-style built-in)
const schema = {
    type: "object",
    required: ["id", "name", "email"],
    properties: {
        id:    { type: "integer", minimum: 1 },
        name:  { type: "string",  minLength: 1, maxLength: 100 },
        email: { type: "string",  format: "email" }
    },
    additionalProperties: false  // no extra fields allowed
};

pm.test("Response matches schema", () => {
    pm.response.to.have.jsonSchema(schema);
});`,
          code2: `# Run Postman collections in CI with Newman
npm install -g newman newman-reporter-htmlextra

# Export collection.json + environment.json from Postman

newman run collection.json \\
  --environment staging-env.json \\
  --reporters cli,htmlextra \\
  --reporter-htmlextra-export ./reports/api-report.html \\
  --delay-request 100 \\   # ms between requests
  --iteration-count 1 \\
  --bail                   # stop on first failure (remove for full run)

# Exit code 0 = all pass → CI green
# Exit code non-zero = failures → CI blocks merge`,
          callouts: [
            { type: 'exercise', text: 'Exercise: In Postman, create a test that: (1) POSTs to /users to create a user, (2) stores the returned ID, (3) GETs /users/{{id}}, (4) asserts the name matches what was sent in step 1.' }
          ]
        },
        {
          h: '⑥ Self-Check',
          steps: [
            { q: 'What is the difference between PUT and PATCH?', a: 'PUT replaces the entire resource — you must send all fields or missing ones become null. PATCH partially updates — you only send the fields you want to change.' },
            { q: 'A POST to /orders returns 200. Is that correct REST practice?', a: 'No. A successful resource creation should return 201 Created. 200 OK is for retrievals/updates. Returning 200 for a POST is technically incorrect per REST conventions.' },
            { q: 'What does pm.environment.set("userId", body.id) do and why is it useful?', a: 'It saves the returned ID into the Postman environment so the next request can reference it as {{userId}}. This enables request chaining — create → read → update → delete in sequence.' }
          ]
        }
      ]
    },

    'bdd-cucumber': {
      title: 'BDD with Cucumber',
      emoji: '🥒',
      tagline: 'Write tests that business stakeholders can read',
      level: 'Beginner', time: '20 min',
      sections: [
        {
          h: '① What is BDD and Why Does It Exist?',
          intro: 'Traditional test code like <code>cy.get(\'#btn\').click()</code> means nothing to a Product Manager or Business Analyst. They can\'t verify if the test captures the right requirement.',
          body: 'BDD (Behavior Driven Development) solves this with a shared language — <strong>Gherkin</strong> — that reads like plain English. Tests become living documentation that developers, QA, and business all read and agree on before a single line of production code is written.',
          callouts: [
            { type: 'insight', text: 'The "3 Amigos" meeting — BA, Dev, QA sitting together to write Gherkin scenarios — is the most valuable part of BDD. It catches misunderstandings before they become bugs.' }
          ]
        },
        {
          h: '② Gherkin Syntax — Learn It in 5 Minutes',
          code: `# login.feature
Feature: User Authentication
  As a registered user
  I want to log in to my account
  So that I can access my personalised dashboard

  # Background runs before EVERY scenario in this file
  Background:
    Given the app is running at "https://staging.app.com"

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter email "alice@example.com" and password "secret123"
    And I click the "Log In" button
    Then I should be on the "/dashboard" page
    And I should see the heading "Welcome, Alice"

  # Scenario Outline = data-driven, runs once per row in Examples
  Scenario Outline: Login fails with invalid credentials
    Given I am on the login page
    When I enter email "<email>" and password "<password>"
    And I click the "Log In" button
    Then I should see the error "<error_message>"

    Examples:
      | email              | password   | error_message             |
      | alice@example.com  | wrongpass  | Invalid email or password |
      | notanemail         | pass123    | Enter a valid email       |
      | alice@example.com  |            | Password is required      |`,
          callouts: [
            { type: 'tip', text: 'Given = precondition (system state). When = action the user takes. Then = observable outcome. And/But = continuation of the previous step type.' }
          ]
        },
        {
          h: '③ Step Definitions — Connecting Gherkin to Code',
          intro: 'Each Gherkin step maps to a function via regex or string patterns. This is your glue code.',
          code: `// step-definitions/login.steps.js
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect }            = require('@playwright/test');

// String in quotes → captured as a parameter (string)
Given('I am on the login page', async function() {
    // 'this' is the World object — shared state between steps
    await this.page.goto('/login');
});

When('I enter email {string} and password {string}',
  async function(email, password) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
});

When('I click the {string} button', async function(buttonName) {
    await this.page.getByRole('button', { name: buttonName }).click();
});

Then('I should be on the {string} page', async function(path) {
    await expect(this.page).toHaveURL(new RegExp(path));
});

Then('I should see the heading {string}', async function(text) {
    await expect(this.page.getByRole('heading', { name: text }))
        .toBeVisible();
});

Then('I should see the error {string}', async function(msg) {
    await expect(this.page.getByRole('alert')).toHaveText(msg);
});`,
          callouts: [
            { type: 'warning', text: 'Step definition strings must match the Gherkin EXACTLY (case-sensitive). Use {string} to capture text in quotes, {int} for integers, {float} for decimals.' }
          ]
        },
        {
          h: '④ The World Object — Sharing State Between Steps',
          code: `// support/world.js — runs ONCE, shared across all steps in a scenario
const { setWorldConstructor, Before, After } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

class CustomWorld {
    constructor() {
        this.browser  = null;
        this.context  = null;
        this.page     = null;
        this.testData = {};  // store anything you want to pass between steps
    }
}
setWorldConstructor(CustomWorld);

// Before hook — runs before EVERY scenario
Before(async function() {
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext();
    this.page    = await this.context.newPage();
});

// After hook — cleanup + screenshot on failure
After(async function(scenario) {
    if (scenario.result.status === 'FAILED') {
        const screenshot = await this.page.screenshot({ fullPage: true });
        this.attach(screenshot, 'image/png');  // attaches to Cucumber report
    }
    await this.browser.close();
});`,
          callouts: [
            { type: 'insight', text: 'this.testData is how you share data between step definitions. Example: create a user in a When step → store user.id in this.testData.userId → use it in the Then step.' }
          ]
        },
        {
          h: '⑤ Tags, Hooks & Reporting',
          code: `# Tag scenarios for selective running
@smoke @critical
Scenario: Successful login
  ...

@regression @slow
Scenario: Full checkout flow
  ...

@wip
Scenario: Feature still in progress
  ...`,
          code2: `# Run only smoke tests
npx cucumber-js --tags "@smoke"

# Run regression but NOT slow
npx cucumber-js --tags "@regression and not @slow"

# Skip work-in-progress
npx cucumber-js --tags "not @wip"

# cucumber.js config file
module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    require: ['step-definitions/**/*.js', 'support/**/*.js'],
    format: [
      'progress',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber.json'
    ],
    tags: 'not @wip'
  }
}`,
          callouts: [
            { type: 'exercise', text: 'Exercise: Write a feature file for a shopping cart: Scenario 1 — add an item and verify cart count increases. Scenario 2 Outline — add different quantities and verify the total price using an Examples table.' }
          ]
        },
        {
          h: '⑥ Self-Check',
          steps: [
            { q: 'What is the difference between Background and a @Before hook?', a: 'Background is Gherkin (visible to stakeholders) — runs Gherkin steps before each scenario in the file. @Before is code (JavaScript/Java) — runs programmatic setup like launching a browser. Both run before each scenario but serve different audiences.' },
            { q: 'You have 200 scenarios. How do you run only the ones tagged @smoke?', a: 'npx cucumber-js --tags "@smoke" — or configure it in cucumber.js as the default tag filter.' },
            { q: 'A Scenario Outline has an Examples table with 5 rows. How many times does it run?', a: '5 times — once per row. Each row substitutes its values into the <placeholder> fields in the scenario steps.' }
          ]
        }
      ]
    },

    'java-multithreading': {
      title: 'Java Multithreading',
      emoji: '☕',
      tagline: 'Write concurrent code without shooting yourself',
      level: 'Advanced', time: '25 min',
      sections: [
        {
          h: '① Why Multithreading? The Single-Thread Problem',
          analogy: '🏦 Analogy: A bank with one teller. Every customer waits in a single queue. Slow. Now open 4 teller windows — 4 customers served simultaneously. That\'s multithreading. But if two tellers try to update the same account at the same time, the balance could get corrupted — that\'s a race condition.',
          callouts: [
            { type: 'warning', text: 'Multithreading gives you speed but introduces new classes of bugs: race conditions, deadlocks, and visibility issues. Never add threads without understanding the trade-off.' }
          ]
        },
        {
          h: '② Creating Threads — 3 Ways',
          code: `// Way 1: extend Thread (bad — wastes your single inheritance)
class MyThread extends Thread {
    public void run() {
        System.out.println("Running in: " + Thread.currentThread().getName());
    }
}
new MyThread().start();  // .start() creates a new thread. .run() would be same thread!

// Way 2: implement Runnable (better — keeps inheritance free)
Runnable task = () -> System.out.println("Runnable: " + Thread.currentThread().getName());
new Thread(task).start();

// Way 3: ExecutorService (BEST for production)
// Manages a pool of threads — reuses them instead of creating new ones
ExecutorService pool = Executors.newFixedThreadPool(4);  // 4 worker threads
pool.submit(() -> System.out.println("Task 1"));
pool.submit(() -> System.out.println("Task 2"));
pool.shutdown();   // graceful stop — waits for tasks to finish
pool.awaitTermination(30, TimeUnit.SECONDS);`,
          callouts: [
            { type: 'warning', text: 'Always call .start() not .run(). Calling .run() executes the method on the CURRENT thread — no new thread is created. This is the #1 threading beginner mistake.' }
          ]
        },
        {
          h: '③ Race Conditions & How to Fix Them',
          code: `// ❌ Race condition — two threads read-modify-write simultaneously
class UnsafeCounter {
    int count = 0;
    void increment() { count++; }  // NOT atomic: read count, add 1, write back = 3 operations
}
// Thread A reads count=5, Thread B reads count=5
// Both add 1, both write 6 → result is 6, not 7 — value lost!

// ✅ Fix 1: synchronized — mutual exclusion lock
class SafeCounter {
    int count = 0;
    synchronized void increment() { count++; }  // only one thread at a time
}

// ✅ Fix 2: AtomicInteger — lock-free, faster than synchronized
import java.util.concurrent.atomic.AtomicInteger;
AtomicInteger counter = new AtomicInteger(0);
counter.incrementAndGet();         // atomic compare-and-swap (CAS) under the hood
int val = counter.get();           // thread-safe read
counter.compareAndSet(5, 10);      // set to 10 only if current value is 5

// ✅ Fix 3: synchronized block (finer-grained than method)
class BankAccount {
    private double balance;
    private final Object lock = new Object();

    void deposit(double amount) {
        synchronized(lock) {  // only lock the critical section, not the whole method
            balance += amount;
        }
    }
}`,
          callouts: [
            { type: 'insight', text: 'Prefer AtomicInteger/AtomicLong over synchronized for simple counters — they use CPU-level CAS instructions and are faster under contention.' }
          ]
        },
        {
          h: '④ CompletableFuture — Async Without Blocking',
          code: `// Old Future — blocks the calling thread
Future<User> future = executor.submit(() -> fetchUser(id));
User user = future.get();  // ← BLOCKS here until done

// ✅ CompletableFuture — non-blocking and composable
CompletableFuture<User> cf = CompletableFuture
    .supplyAsync(() -> fetchUser(id))           // runs in ForkJoinPool
    .thenApply(user -> enrichWithOrders(user))  // transforms result
    .thenApply(user -> addProfile(user))        // chains another transform
    .exceptionally(ex -> {                      // handles any error in the chain
        log.error("Failed", ex);
        return User.empty();
    });

// Run two tasks in PARALLEL and combine results
CompletableFuture<User>   userFuture   = CompletableFuture.supplyAsync(() -> fetchUser(id));
CompletableFuture<Orders> ordersFuture = CompletableFuture.supplyAsync(() -> fetchOrders(id));

CompletableFuture.allOf(userFuture, ordersFuture).join();  // wait for both
User   user   = userFuture.get();
Orders orders = ordersFuture.get();`,
          callouts: [
            { type: 'tip', text: 'CompletableFuture.allOf() is Java\'s equivalent of JavaScript\'s Promise.all() — starts multiple async tasks simultaneously and waits for all to complete.' }
          ]
        },
        {
          h: '⑤ volatile vs synchronized',
          code: `// volatile: guarantees VISIBILITY only
// When Thread A writes a volatile variable, Thread B sees the new value immediately
// (without volatile, threads may cache the value locally)
class Server {
    private volatile boolean running = true;  // volatile needed for cross-thread visibility

    void stop()  { running = false; }          // Thread A calls this
    void serve() {
        while (running) { /* ... */ }          // Thread B reads this — sees false immediately
    }
}

// volatile is NOT enough for compound operations
volatile int count = 0;
count++;  // ❌ still a race condition — this is read + add + write = 3 ops

// synchronized guarantees BOTH visibility AND atomicity
synchronized void increment() { count++; }  // ✅ atomic`,
          callouts: [
            { type: 'insight', text: 'Rule of thumb: volatile for simple flags (boolean, single read/write). synchronized or AtomicXxx for compound operations (read-modify-write like count++).' }
          ]
        },
        {
          h: '⑥ Self-Check',
          steps: [
            { q: 'What is a race condition? Give a concrete example.', a: 'Two threads read-modify-write the same variable concurrently, and the final value depends on who ran first. Example: two threads both read balance=100, both add $50, both write $150 — result is $150 not $200. One write was lost.' },
            { q: 'What is the difference between CompletableFuture and Future?', a: 'Future.get() blocks the calling thread. CompletableFuture is non-blocking and composable — you chain .thenApply()/.thenCompose() and it continues asynchronously without blocking any thread.' },
            { q: 'Why shouldn\'t you call thread.run() instead of thread.start()?', a: '.run() executes on the CURRENT thread — no new thread is created, no concurrency. .start() creates a new OS thread and calls run() on it. Common mistake that wastes the point of threading.' }
          ]
        }
      ]
    },

    'sql-window': {
      title: 'SQL Window Functions',
      emoji: '🗄️',
      tagline: 'Aggregate without losing rows',
      level: 'Intermediate', time: '20 min',
      sections: [
        {
          h: '① The Problem With GROUP BY',
          intro: 'GROUP BY collapses your data. Once you group, you lose the individual rows. Window functions let you have your cake and eat it too — aggregate AND keep every row.',
          code: `-- GROUP BY: you see the department average, but lose individual rows
SELECT department, AVG(salary) AS avg_sal
FROM employees
GROUP BY department;
-- Result: 3 rows (one per dept) — you can't see individual salaries anymore

-- Window function: EVERY row stays, plus the average appears alongside each
SELECT
    name,
    department,
    salary,
    AVG(salary) OVER (PARTITION BY department) AS dept_avg,
    salary - AVG(salary) OVER (PARTITION BY department) AS diff_from_avg
FROM employees;
-- Result: all 50 rows — each shows its own salary AND the dept average`,
          callouts: [
            { type: 'insight', text: 'OVER() is what makes it a window function. Without OVER(), AVG() is an aggregate (collapses rows). With OVER(), it becomes a window function (keeps rows).' }
          ]
        },
        {
          h: '② ROW_NUMBER, RANK, DENSE_RANK — Know the Difference',
          code: `SELECT
    name,
    salary,
    department,
    -- Unique sequential number — no ties, no gaps
    ROW_NUMBER()  OVER (PARTITION BY department ORDER BY salary DESC) AS row_num,
    -- 1, 2, 3, 4, 5

    -- Ties get the same rank — then SKIPS (gap)
    RANK()        OVER (PARTITION BY department ORDER BY salary DESC) AS rnk,
    -- 1, 2, 2, 4, 5  ← 3 is skipped after a tie at position 2

    -- Ties get the same rank — NO gap
    DENSE_RANK()  OVER (PARTITION BY department ORDER BY salary DESC) AS d_rnk
    -- 1, 2, 2, 3, 4  ← no gaps, continues from 3 after the tie
FROM employees;

-- Practical: Find the TOP EARNER per department
SELECT name, department, salary FROM (
    SELECT *,
        DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk
    FROM employees
) ranked
WHERE rnk = 1;  -- ← filters in outer query, window functions can't be in WHERE`,
          callouts: [
            { type: 'warning', text: 'You CANNOT use window functions in a WHERE clause — they\'re evaluated after WHERE. Wrap in a subquery or CTE, then filter on the result.' }
          ]
        },
        {
          h: '③ LAG & LEAD — Compare With Adjacent Rows',
          code: `-- LAG(col, n) = value from n rows BEFORE current row
-- LEAD(col, n) = value from n rows AFTER current row

-- Month-over-month revenue change
SELECT
    month,
    revenue,
    LAG(revenue, 1)  OVER (ORDER BY month)  AS prev_month_rev,
    LEAD(revenue, 1) OVER (ORDER BY month)  AS next_month_rev,

    -- Absolute change vs previous month
    revenue - LAG(revenue, 1) OVER (ORDER BY month)  AS mom_change,

    -- % change vs previous month
    ROUND(
        100.0 * (revenue - LAG(revenue, 1) OVER (ORDER BY month))
              / NULLIF(LAG(revenue, 1) OVER (ORDER BY month), 0),
        2
    ) AS mom_pct_change
FROM monthly_sales
ORDER BY month;`,
          callouts: [
            { type: 'tip', text: 'Use NULLIF(divisor, 0) to avoid division-by-zero errors when calculating percentage changes. It returns NULL instead of crashing when the previous value was 0.' }
          ]
        },
        {
          h: '④ Running Totals & Moving Averages',
          code: `-- Running total: sum of all rows up to and including current row
SELECT
    order_date,
    daily_sales,
    SUM(daily_sales) OVER (
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_total

FROM orders;

-- 7-day moving average (current day + 6 days before it)
SELECT
    sale_date,
    daily_sales,
    ROUND(
        AVG(daily_sales) OVER (
            ORDER BY sale_date
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ), 2
    ) AS moving_avg_7d
FROM daily_sales;

-- ROWS vs RANGE:
-- ROWS BETWEEN: counts physical rows (what you almost always want)
-- RANGE BETWEEN: includes ALL rows with the same ORDER BY value (can be surprising)`,
          callouts: [
            { type: 'exercise', text: 'Exercise: Write a query on a sales table (date, amount) that shows: each row\'s date + amount + cumulative total + 30-day moving average + rank by amount for that month.' }
          ]
        },
        {
          h: '⑤ NTILE & Percentiles',
          code: `-- NTILE(n): divide rows into n equal buckets
SELECT
    customer_id,
    total_spend,
    NTILE(4) OVER (ORDER BY total_spend DESC) AS quartile,
    CASE NTILE(4) OVER (ORDER BY total_spend DESC)
        WHEN 1 THEN 'Platinum'   -- top 25%
        WHEN 2 THEN 'Gold'
        WHEN 3 THEN 'Silver'
        ELSE        'Bronze'     -- bottom 25%
    END AS tier
FROM customer_totals;

-- PERCENTILE_CONT: find the value at a given percentile
SELECT
    department,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) AS median_salary,
    PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY salary) AS p90_salary
FROM employees
GROUP BY department;`,
          callouts: [
            { type: 'insight', text: 'NTILE doesn\'t give you the percentile VALUE — it gives you which bucket each row belongs to. Use PERCENTILE_CONT to get the actual value at a given percentile.' }
          ]
        },
        {
          h: '⑥ Self-Check',
          steps: [
            { q: 'What is the output difference between RANK and DENSE_RANK when two rows tie at position 2?', a: 'RANK: 1, 2, 2, 4 — skips 3 after the tie. DENSE_RANK: 1, 2, 2, 3 — no gap, continues consecutively.' },
            { q: 'Why can\'t you write WHERE row_num = 1 directly in the same query that defines row_num?', a: 'Window functions are evaluated AFTER WHERE. The WHERE clause runs before window functions are computed. Solution: wrap the query in a subquery or CTE, then filter in the outer query.' },
            { q: 'What does LAG(salary, 1) return for the very first row?', a: 'NULL — there is no previous row to look back at. Always use COALESCE(LAG(salary,1), 0) or similar if you need a fallback value.' }
          ]
        }
      ]
    },

    'cicd-jenkins': {
      title: 'CI/CD with Jenkins & GitLab',
      emoji: '⚙️',
      tagline: 'Automate from commit to production',
      level: 'Intermediate', time: '20 min',
      sections: [
        {
          h: '① CI/CD — What Problem Does It Solve?',
          analogy: '🏭 Analogy: Without CI/CD, releasing software is like building a car by having 50 people work in separate rooms for 3 months, then assembling everything at once on release day. With CI/CD, each person\'s part is integrated and tested every day — problems are caught when they\'re small.',
          body: '<strong>CI (Continuous Integration)</strong>: every code push triggers automated build + tests. Broken code is flagged in minutes, not discovered 3 months later. <strong>CD (Continuous Delivery)</strong>: every green build auto-deploys to staging. One-click to production. <strong>CD (Continuous Deployment)</strong>: every green build goes straight to production — no human intervention.',
          callouts: [
            { type: 'insight', text: 'Studies show that teams with CI/CD deploy 46x more frequently and recover from failures 96x faster than teams without it.' }
          ]
        },
        {
          h: '② Jenkins Declarative Pipeline',
          code: `// Jenkinsfile — lives in your repo root
pipeline {
    agent any   // run on any available Jenkins agent

    environment {
        NODE_ENV = 'test'
        BASE_URL = 'https://staging.example.com'
    }

    stages {
        stage('📦 Install') {
            steps { sh 'npm ci' }  // ci = clean install, reproducible
        }

        stage('🧪 Unit Tests') {
            steps { sh 'npm test -- --reporter=junit' }
            post {
                always {
                    // Publish test results regardless of pass/fail
                    junit 'test-results/*.xml'
                }
            }
        }

        stage('🎭 E2E Tests') {
            steps {
                sh 'npx playwright install --with-deps chromium'
                sh 'npx playwright test --shard=1/2 --reporter=html'
            }
            post {
                always {
                    publishHTML(target: [
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright Report'
                    ])
                }
                failure {
                    slackSend color: 'danger',
                        message: "❌ E2E failed on \${env.BRANCH_NAME} — \${env.BUILD_URL}"
                }
            }
        }

        stage('🚀 Deploy Staging') {
            when { branch 'main' }  // only deploy from main
            steps { sh './scripts/deploy.sh staging' }
        }
    }

    post {
        success { echo '✅ Pipeline passed!' }
        failure { echo '❌ Pipeline failed — check the report' }
    }
}`,
          callouts: [
            { type: 'tip', text: 'Always use npm ci (not npm install) in CI. ci uses package-lock.json for reproducible builds — npm install can silently upgrade packages and break things.' }
          ]
        },
        {
          h: '③ GitLab CI/CD (.gitlab-ci.yml)',
          code: `# .gitlab-ci.yml — lives in repo root
stages:
  - install
  - test
  - e2e
  - deploy

variables:
  NODE_IMAGE: node:20-alpine

# Cache node_modules between jobs (saves download time)
.node_cache: &node_cache
  cache:
    key: \${CI_COMMIT_REF_SLUG}
    paths: [node_modules/]

install:
  stage: install
  image: $NODE_IMAGE
  <<: *node_cache
  script: npm ci
  artifacts:
    paths: [node_modules/]
    expire_in: 1 hour

unit-tests:
  stage: test
  image: $NODE_IMAGE
  <<: *node_cache
  script: npm test
  artifacts:
    reports:
      junit: test-results/junit.xml
    when: always

e2e-tests:
  stage: e2e
  image: mcr.microsoft.com/playwright:v1.44.0-jammy
  parallel: 4   # GitLab splits automatically across 4 runners
  script:
    - npm ci
    - npx playwright test --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL
  artifacts:
    when: always
    paths: [playwright-report/]
    expire_in: 7 days

deploy-staging:
  stage: deploy
  script: ./scripts/deploy.sh staging
  environment:
    name: staging
    url: https://staging.example.com
  rules:
    - if: $CI_COMMIT_BRANCH == "main"`,
          callouts: [
            { type: 'insight', text: 'parallel: 4 in GitLab + --shard in Playwright = each of the 4 runners handles 1/4 of the tests simultaneously. A 40-minute suite becomes a 10-minute suite.' }
          ]
        },
        {
          h: '④ Quality Gates — Don\'t Ship Broken Code',
          code: `// Quality gates are checks that BLOCK the pipeline if thresholds aren't met

// 1. Coverage gate in Jenkins (using coverage-check plugin)
stage('Coverage Gate') {
    steps {
        sh 'npm test -- --coverage'
        publishCoverage adapters: [coberturaAdapter('coverage/cobertura.xml')],
            sourceFileResolver: sourceFiles('STORE_ALL_BUILD'),
            failNoReports: true,
            // Block if coverage drops below 80%
            thresholds: [[thresholdTarget: 'LINE', unhealthyThreshold: 80.0]]
    }
}

// 2. Performance gate — fail if response time > threshold
// In Playwright test
test('homepage loads under 2s', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(2000);
});

// 3. Accessibility gate
const results = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();
expect(results.violations).toHaveLength(0);`,
          callouts: [
            { type: 'exercise', text: 'Exercise: Write a Jenkinsfile or .gitlab-ci.yml with: install → unit tests (with JUnit report) → Playwright E2E → deploy to staging only on main branch. Add a Slack notification on E2E failure.' }
          ]
        },
        {
          h: '⑤ Self-Check',
          steps: [
            { q: 'What is the difference between Continuous Delivery and Continuous Deployment?', a: 'Continuous Delivery: every green build is deployable to production but requires a MANUAL approval gate. Continuous Deployment: every green build is automatically deployed to production — fully automated, no human gate.' },
            { q: 'Why use npm ci instead of npm install in CI?', a: 'npm ci uses package-lock.json to install exact versions — reproducible, deterministic. npm install can update patch versions silently and produce different results in CI vs local. npm ci also fails if package-lock.json is out of sync, catching drift early.' },
            { q: 'How does Playwright sharding (--shard=1/4) work in CI?', a: 'Playwright splits all test files across N agents. Agent 1 runs tests 1-25%, agent 2 runs 26-50% etc. Each agent runs independently in parallel. Use merge-reports to combine results into one HTML report.' }
          ]
        }
      ]
    },

    'service-virtualization': {
      title: 'Service Virtualization',
      emoji: '🔮',
      tagline: 'Test without depending on real services',
      level: 'Intermediate', time: '18 min',
      sections: [
        {
          h: '① The Problem — Flaky Dependencies',
          analogy: '🎭 Analogy: You\'re rehearsing a play but one actor keeps calling in sick. Do you cancel all rehearsals? No — you use an understudy. Service Virtualization is the understudy for external APIs.',
          body: 'Your tests depend on: payment gateways, third-party APIs, microservices still in development, systems with rate limits. When any of these are down, slow, or unavailable — your tests fail. Service virtualization replaces them with a controllable simulator.',
          callouts: [
            { type: 'insight', text: 'Mock = in-process stub (same language, test only). Virtual Service = standalone HTTP server (any language, shared by multiple tests/teams, can simulate latency and stateful behavior).' }
          ]
        },
        {
          h: '② WireMock — The Most Popular Tool',
          code: `// Option 1: WireMock standalone server
// Download wiremock-standalone.jar, run:
// java -jar wiremock-standalone.jar --port 8080

// Option 2: WireMock in your test (Java)
import com.github.tomakehurst.wiremock.WireMockServer;
import static com.github.tomakehurst.wiremock.client.WireMock.*;

WireMockServer server = new WireMockServer(8080);
server.start();

// Define a stub
server.stubFor(
    get(urlPathMatching("/api/users/\\d+"))
        .willReturn(
            aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody("{ \\"id\\": 1, \\"name\\": \\"Alice\\" }")
        )
);

// Now your code calls http://localhost:8080/api/users/123
// WireMock intercepts it and returns the stub response

server.stop();`,
          callouts: [
            { type: 'tip', text: 'Put WireMock stubs in JSON files in the mappings/ folder. WireMock loads them automatically on startup — no code required. Great for sharing with the whole team.' }
          ]
        },
        {
          h: '③ Playwright\'s Built-in Service Virtualization',
          intro: 'For browser-based testing, Playwright\'s <code>page.route()</code> intercepts HTTP requests at the browser level — no separate server needed.',
          code: `// Intercept and mock a GET request
await page.route('**/api/products/**', async route => {
    await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: { id: 42, name: 'Mock Product', price: 9.99, inStock: true }
    });
});

// Simulate a 503 Service Unavailable
await page.route('**/api/payments', route =>
    route.fulfill({ status: 503, body: 'Service temporarily unavailable' })
);

// Simulate network latency (2 second delay)
await page.route('**/api/reports', async route => {
    await page.waitForTimeout(2000);  // simulate slow endpoint
    await route.continue();           // then let the real request through
});

// Intercept, modify the REAL response (partial mock)
await page.route('**/api/user/me', async route => {
    const response = await route.fetch();   // call the real API
    const json     = await response.json();
    json.role = 'admin';                    // inject a field
    await route.fulfill({ response, json });
});`,
          callouts: [
            { type: 'insight', text: 'page.route() must be set up BEFORE the page action that triggers the request. Set routes in the test setup, not after page.goto().' }
          ]
        },
        {
          h: '④ When to Use Each Approach',
          code: `// Decision guide:

// page.route() — for Playwright UI tests
// ✅ No extra server, zero setup
// ✅ Perfect for browser-fetched APIs
// ❌ Only works for requests the browser makes

// WireMock standalone — for API/service layer testing
// ✅ Language-agnostic (any test tool can hit it)
// ✅ Shared across a team
// ✅ Supports stateful behavior (request 1 → state change → request 2 returns different data)
// ✅ Can record real API responses and replay them

// Scenarios that NEED service virtualization:
// • Payment gateway (can't hit real Stripe in tests — charges real money)
// • SMS/email providers (can't send real emails in tests)
// • Partner APIs with rate limits (10 calls/day in sandbox)
// • Services not yet built (parallel development teams)
// • Simulating error conditions (500s, timeouts, partial failures)
// • Performance/load testing (can't hammer production)`,
          callouts: [
            { type: 'exercise', text: 'Exercise: Use page.route() in Playwright to: (1) mock GET /api/user to return a logged-in user, (2) assert the dashboard shows the user\'s name, (3) then mock GET /api/user to return 401 and assert the login page appears.' }
          ]
        },
        {
          h: '⑤ Self-Check',
          steps: [
            { q: 'What is the difference between a mock and service virtualization?', a: 'A mock is in-process (inside the test, same language). Service virtualization is a standalone server that any consumer can hit. Mocks are simpler; virtual services are more realistic and shared.' },
            { q: 'You need to test how your app handles a payment gateway timeout. How do you do this safely?', a: 'Use page.route() or WireMock to simulate a delayed response (e.g., 30-second timeout). Never hit a real payment gateway in tests — it could create real charges and is unreliable.' },
            { q: 'When should you use page.route() vs WireMock?', a: 'page.route(): when testing browser-level behavior in Playwright — fast, no extra server. WireMock: when you need a shared virtual service for multiple teams/tools, stateful behavior, or non-browser tests.' }
          ]
        }
      ]
    },

    'docker-qa': {
      title: 'Docker for QA Engineers',
      emoji: '🐳',
      tagline: 'Kill "works on my machine" forever',
      level: 'Beginner', time: '18 min',
      sections: [
        {
          h: '① The "Works on My Machine" Problem',
          analogy: '📦 Analogy: Instead of giving a colleague a list of ingredients (install Node 20, set env var X, install these npm packages), you give them a lunchbox with everything already inside. That\'s a Docker container — it includes the app AND everything it needs to run.',
          callouts: [
            { type: 'insight', text: 'A Docker container is an isolated, reproducible environment. The SAME container runs identically on a MacBook, a Linux CI server, and a Windows machine. No more environment-specific bugs.' }
          ]
        },
        {
          h: '② Core Concepts',
          code: `// Key terms:
// Image    = blueprint/recipe (read-only, built from a Dockerfile)
// Container = running instance of an image (like a process from a program)
// Dockerfile = instructions to build an image
// Registry  = storage for images (Docker Hub, ECR, GCR)

// Essential Docker commands
docker pull node:20-alpine           // download image
docker images                        // list local images
docker run node:20-alpine node --version  // run a container, execute command, exit

docker run -d -p 3000:3000 my-app   // -d = detached (background)
                                    // -p host:container port mapping
docker ps                            // list running containers
docker logs <container-id>           // see container output
docker exec -it <id> sh              // open shell INSIDE running container
docker stop <id>                     // stop container
docker rm <id>                       // remove stopped container`,
          callouts: [
            { type: 'tip', text: 'Use -it for interactive sessions (docker exec -it container sh). Without it, the shell immediately exits.' }
          ]
        },
        {
          h: '③ Dockerfile — Containerise Your Tests',
          code: `# Dockerfile for Playwright tests
# Start from the official Playwright image — all browsers pre-installed
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

# Set working directory inside container
WORKDIR /app

# Copy package files first (layer caching — only re-run npm ci when package.json changes)
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the test files
COPY . .

# Default command when container starts
CMD ["npx", "playwright", "test", "--reporter=html"]`,
          code2: `# Build the image
docker build -t qa-playwright-tests .

# Run tests, mount report dir so you can open it locally
docker run --rm \\
  -e BASE_URL=https://staging.example.com \\
  -v $(pwd)/playwright-report:/app/playwright-report \\
  qa-playwright-tests

# Open the HTML report (on your host machine)
npx playwright show-report playwright-report`,
          callouts: [
            { type: 'tip', text: 'Order Dockerfile instructions from least-changed to most-changed. COPY package*.json + RUN npm ci before COPY . . — this way Docker caches the npm install layer and only re-runs it when dependencies change, not on every code change.' }
          ]
        },
        {
          h: '④ Docker Compose — Full Test Environment in One Command',
          code: `# docker-compose.yml
version: "3.9"

services:
  # Your application under test
  app:
    image: my-app:latest
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/testdb
      NODE_ENV: test
    depends_on:
      db:
        condition: service_healthy  # wait for DB health check before starting app

  # Test database
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: testdb
    volumes:
      - ./db/seed.sql:/docker-entrypoint-initdb.d/seed.sql  # auto-runs on start
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 5s
      retries: 5

  # WireMock for external API stubs
  wiremock:
    image: wiremock/wiremock:latest
    ports: ["8080:8080"]
    volumes:
      - ./wiremock/mappings:/home/wiremock/mappings

  # Playwright test runner
  playwright:
    build: .
    depends_on: [app, wiremock]
    environment:
      BASE_URL: http://app:3000      # uses Docker's internal DNS
      MOCK_API: http://wiremock:8080
    volumes:
      - ./playwright-report:/app/playwright-report`,
          code2: `# Start everything and run tests
docker compose up --exit-code-from playwright

# --exit-code-from playwright:
# → exit code = playwright's exit code
# → 0 = all tests pass (CI green)
# → non-zero = test failures (CI red)

# Tear down and clean volumes
docker compose down -v`,
          callouts: [
            { type: 'exercise', text: 'Exercise: Write a docker-compose.yml that runs your Playwright tests against a locally-built app image, with a PostgreSQL database seeded from a seed.sql file. The playwright service should output reports to a local folder.' }
          ]
        },
        {
          h: '⑤ Self-Check',
          steps: [
            { q: 'What is the difference between a Docker image and a Docker container?', a: 'Image = read-only blueprint (like a class). Container = running instance of an image (like an object). One image can spawn multiple containers simultaneously.' },
            { q: 'Why do you COPY package*.json before COPY . . in a Dockerfile?', a: 'Docker caches each instruction as a layer. If you copy everything first, any code change invalidates the cache and re-runs npm ci. By copying package.json first, npm ci only re-runs when dependencies change — making builds much faster.' },
            { q: 'In docker-compose, how do containers communicate with each other?', a: 'By service name. Docker Compose creates a shared network. The playwright container reaches the app container at http://app:3000 — the service name "app" resolves to the container\'s IP automatically.' }
          ]
        }
      ]
    }

  }; // end CONTENT

  // Merge external TS/DSA content if available
  if (typeof TS_LEARN_CONTENT !== 'undefined') {
    for (var key in TS_LEARN_CONTENT) {
      if (TS_LEARN_CONTENT.hasOwnProperty(key)) {
        CONTENT[key] = TS_LEARN_CONTENT[key];
      }
    }
  }

  /* ================================================================
     STATE
     ================================================================ */
  var state = {
    view: 'home',
    topicKey: null,
    sectionIdx: 0,
    searchQuery: '',
    activeCategory: 'all',  // 'all' | 'core' | 'ts' | 'dsa'
    understood: {}  // topicKey → Set of understood section indices
  };

  var TOPIC_LIST = Object.keys(CONTENT);

  /* ================================================================
     RENDER ROUTER
     ================================================================ */
  function render() {
    if (state.view === 'home') renderHome();
    else renderTopic();
  }

  /* ================================================================
     HOME — topic grid
     ================================================================ */
  function renderHome() {
    var q = state.searchQuery.toLowerCase();
    var filtered = TOPIC_LIST.filter(function(k) {
      if (!q) return true;
      var t = CONTENT[k];
      return (t.title + t.tagline).toLowerCase().includes(q) ||
        t.sections.some(function(s) { return s.h.toLowerCase().includes(q); });
    });

    var cards = filtered.map(function(k) {
      var t = CONTENT[k];
      var understood = state.understood[k] || {};
      var doneCount = Object.keys(understood).length;
      var totalSecs = t.sections.length;
      var pct = totalSecs ? Math.round((doneCount / totalSecs) * 100) : 0;
      var levelColor = { 'Beginner': '#48bb78', 'Intermediate': '#ecc94b', 'Advanced': '#fc8181' }[t.level] || '#4299e1';

      return '<div class="ltopic-card" data-topic="' + k + '">' +
        '<div class="ltopic-card-top">' +
          '<span class="ltopic-emoji">' + t.emoji + '</span>' +
          '<span class="ltopic-level" style="color:' + levelColor + '">' + t.level + '</span>' +
        '</div>' +
        '<div class="ltopic-title">' + escHtml(t.title) + '</div>' +
        '<div class="ltopic-tagline">' + escHtml(t.tagline) + '</div>' +
        '<div class="ltopic-meta">' +
          '<span>⏱ ' + t.time + '</span>' +
          '<span>' + totalSecs + ' sections</span>' +
        '</div>' +
        (pct > 0 ?
          '<div class="ltopic-progress-bar"><div class="ltopic-progress-fill" style="width:' + pct + '%"></div></div>' +
          '<div class="ltopic-progress-label">' + pct + '% done</div>'
        : '') +
      '</div>';
    }).join('');

    root.innerHTML =
      '<div class="lhome-wrap">' +
        '<div class="lhome-header">' +
          '<div>' +
            '<h2 class="quiz-title">📖 Learning Lab</h2>' +
            '<p class="quiz-subtitle">Guided lessons from ground zero. Click a topic to start.</p>' +
          '</div>' +
          '<input id="learn-search" class="quiz-input" style="max-width:280px" placeholder="🔍 Search topics..." value="' + escHtml(state.searchQuery) + '">' +
        '</div>' +
        '<div class="ltopic-grid">' +
          (cards || '<p class="lno-results">No topics match "' + escHtml(state.searchQuery) + '"</p>') +
        '</div>' +
      '</div>';

    document.getElementById('learn-search') && document.getElementById('learn-search').focus();
  }

  /* ================================================================
     TOPIC — section-by-section teaching
     ================================================================ */
  function renderTopic() {
    var t = CONTENT[state.topicKey];
    if (!t) { state.view = 'home'; render(); return; }

    var sec = t.sections[state.sectionIdx];
    var total = t.sections.length;
    var pct = Math.round(((state.sectionIdx + 1) / total) * 100);
    var understood = state.understood[state.topicKey] || {};
    var done = !!understood[state.sectionIdx];

    root.innerHTML =
      '<div class="ltopic-view">' +

        /* ── Top bar ── */
        '<div class="ltopic-topbar">' +
          '<button id="learn-back" class="lbtn lbtn-ghost">← Topics</button>' +
          '<div class="ltopic-topbar-center">' +
            '<span class="ltopic-topbar-title">' + t.emoji + ' ' + escHtml(t.title) + '</span>' +
            '<div class="ltopic-prog-wrap">' +
              '<div class="ltopic-prog-bar"><div class="ltopic-prog-fill" style="width:' + pct + '%"></div></div>' +
              '<span class="ltopic-prog-label">' + (state.sectionIdx + 1) + ' / ' + total + '</span>' +
            '</div>' +
          '</div>' +
          '<div style="width:80px"></div>' +
        '</div>' +

        /* ── Section pills nav ── */
        '<div class="lsec-pills">' +
          t.sections.map(function(s, i) {
            var isDone = !!(state.understood[state.topicKey] || {})[i];
            var cls = 'lsec-pill' + (i === state.sectionIdx ? ' lsec-pill-active' : '') + (isDone ? ' lsec-pill-done' : '');
            return '<button class="' + cls + '" data-sec-jump="' + i + '" title="' + escHtml(s.h) + '">' + (isDone ? '✓' : (i + 1)) + '</button>';
          }).join('') +
        '</div>' +

        /* ── Section content ── */
        '<div class="lsec-content">' +
          '<h2 class="lsec-heading">' + escHtml(sec.h) + '</h2>' +
          renderSectionBody(sec) +
        '</div>' +

        /* ── Navigation ── */
        '<div class="lsec-nav">' +
          '<button id="learn-prev" class="lbtn lbtn-secondary" ' + (state.sectionIdx === 0 ? 'disabled' : '') + '>← Previous</button>' +
          '<button id="learn-mark-done" class="lbtn ' + (done ? 'lbtn-done' : 'lbtn-primary') + '">' +
            (done ? '✓ Understood' : '✓ Mark as Understood') +
          '</button>' +
          '<button id="learn-next" class="lbtn lbtn-primary" ' + (state.sectionIdx === total - 1 ? 'disabled' : '') + '>Next →</button>' +
        '</div>' +

      '</div>';
  }

  function renderSectionBody(sec) {
    var html = '';

    /* Analogy box */
    if (sec.analogy) {
      html += '<div class="lcallout lcallout-analogy"><div class="lcallout-icon">🤔</div><div class="lcallout-body">' + escHtml(sec.analogy) + '</div></div>';
    }

    /* Intro text */
    if (sec.intro) {
      html += '<p class="lsec-intro">' + sec.intro + '</p>';
    }

    /* Body */
    if (sec.body) {
      html += '<p class="lsec-body-text">' + sec.body + '</p>';
    }

    /* Callouts BEFORE first code block */
    if (sec.callouts) {
      sec.callouts.forEach(function(c) {
        if (c.type !== 'exercise') html += renderCallout(c);
      });
    }

    /* Code block 1 */
    if (sec.code) {
      html += '<div class="lcode-wrap"><div class="lcode-header"><span class="lcode-lang">Code</span><button class="lcopy-btn" data-copy="1">Copy</button></div><pre class="lcode-block"><code id="code1-' + Math.random().toString(36).slice(2) + '">' + escHtml(sec.code) + '</code></pre></div>';
    }

    /* Code block 2 */
    if (sec.code2) {
      html += '<div class="lcode-wrap"><div class="lcode-header"><span class="lcode-lang">Follow-up</span><button class="lcopy-btn" data-copy="2">Copy</button></div><pre class="lcode-block"><code>' + escHtml(sec.code2) + '</code></pre></div>';
    }

    /* Steps (self-check Q&A) */
    if (sec.steps) {
      html += '<div class="lsteps-wrap">';
      sec.steps.forEach(function(step, i) {
        html += '<div class="lstep-card" data-step="' + i + '">' +
          '<div class="lstep-q"><span class="lstep-num">Q' + (i + 1) + '</span> ' + step.q + '</div>' +
          '<button class="lstep-reveal-btn" data-reveal="' + i + '">👁 Show Answer</button>' +
          '<div class="lstep-answer" id="step-ans-' + i + '" style="display:none"><span class="lstep-a-label">Answer:</span> ' + step.a + '</div>' +
        '</div>';
      });
      html += '</div>';
    }

    /* Exercise callout at end */
    if (sec.callouts) {
      sec.callouts.filter(function(c) { return c.type === 'exercise'; }).forEach(function(c) {
        html += renderCallout(c);
      });
    }

    return html;
  }

  function renderCallout(c) {
    var icons = { insight: '💡', warning: '⚠️', tip: '🎯', exercise: '📝', analogy: '🤔' };
    var labels = { insight: 'Key Insight', warning: 'Watch Out', tip: 'Pro Tip', exercise: 'Exercise', analogy: 'Analogy' };
    return '<div class="lcallout lcallout-' + c.type + '">' +
      '<div class="lcallout-icon">' + (icons[c.type] || '💡') + '</div>' +
      '<div class="lcallout-body"><strong>' + labels[c.type] + ':</strong> ' + escHtml(c.text).replace(/\n/g, '<br>') + '</div>' +
    '</div>';
  }

  /* ================================================================
     EVENTS
     ================================================================ */
  document.addEventListener('click', function(e) {
    /* Topic card */
    var card = e.target.closest('[data-topic]');
    if (card && root.contains(card)) {
      state.topicKey = card.getAttribute('data-topic');
      state.sectionIdx = 0;
      state.view = 'topic';
      render(); root.scrollIntoView({ behavior: 'smooth' }); return;
    }

    if (!root.contains(e.target)) return;


    /* Section pill jump */
    var pill = e.target.closest('[data-sec-jump]');
    if (pill) { state.sectionIdx = parseInt(pill.getAttribute('data-sec-jump'), 10); render(); return; }

    /* Back */
    if (e.target.id === 'learn-back') { state.view = 'home'; render(); return; }

    /* Prev / Next */
    if (e.target.id === 'learn-prev' && state.sectionIdx > 0) {
      state.sectionIdx--; render(); scrollSectionTop(); return;
    }
    if (e.target.id === 'learn-next') {
      var t = CONTENT[state.topicKey];
      if (state.sectionIdx < t.sections.length - 1) {
        state.sectionIdx++; render(); scrollSectionTop();
      }
      return;
    }

    /* Mark as understood */
    if (e.target.id === 'learn-mark-done') {
      if (!state.understood[state.topicKey]) state.understood[state.topicKey] = {};
      var already = state.understood[state.topicKey][state.sectionIdx];
      if (already) {
        delete state.understood[state.topicKey][state.sectionIdx];
      } else {
        state.understood[state.topicKey][state.sectionIdx] = true;
        /* Auto-advance if not last */
        var t2 = CONTENT[state.topicKey];
        if (state.sectionIdx < t2.sections.length - 1) {
          state.sectionIdx++;
          render(); scrollSectionTop(); return;
        }
      }
      render(); return;
    }

    /* Reveal answer */
    var revBtn = e.target.closest('[data-reveal]');
    if (revBtn) {
      var idx = revBtn.getAttribute('data-reveal');
      var ans = document.getElementById('step-ans-' + idx);
      if (ans) {
        var showing = ans.style.display !== 'none';
        ans.style.display = showing ? 'none' : 'block';
        revBtn.textContent = showing ? '👁 Show Answer' : '🙈 Hide Answer';
      }
      return;
    }

    /* Copy code */
    var copyBtn = e.target.closest('[data-copy]');
    if (copyBtn) {
      var which = copyBtn.getAttribute('data-copy');
      var wrap = copyBtn.closest('.lcode-wrap');
      if (wrap) {
        var code = wrap.querySelector('.lcode-block code');
        if (code) {
          navigator.clipboard.writeText(code.innerText).then(function() {
            copyBtn.textContent = '✓ Copied!';
            setTimeout(function() { copyBtn.textContent = 'Copy'; }, 2000);
          }).catch(function() {});
        }
      }
      return;
    }
  });

  document.addEventListener('input', function(e) {
    if (e.target.id === 'learn-search') {
      state.searchQuery = e.target.value;
      render();
    }
  });

  function scrollSectionTop() {
    var el = root.querySelector('.lsec-content');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function escHtml(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  render();
})();
