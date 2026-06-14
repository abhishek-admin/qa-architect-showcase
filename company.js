/* company.js — Company-wise Interview Tracker & Prep Bank */
(function(){

/* ══════════════════════════════════════
   COMPANY DATA
══════════════════════════════════════ */
const COMPANIES = [
  {
    id: 'ltim',
    name: 'LTIMindtree',
    logo: '🔷',
    rounds: [
      {
        round: 'R1 — Technical Screening',
        status: 'cleared',
        date: '2026-06-13',
        interviewer: 'Unknown (same person will take R2)',
        duration: '12 mins',
        format: 'Programming only — 3 Playwright JS questions',
        note: 'Interview ended in 12 mins. Not confident on answers. Need solid Playwright JS prep for R2.',
        questions: [
          {
            asked: 'Q1: POST API — Write Playwright test to validate status 201 and response body for createNewRecord endpoint',
            myAnswer: `const{test,expect} = require('@playwright/test');
test('Validate response code 201 and response body', async({request})=>{
  const response = await request.post('v1/createNewRecord',{
    headers:{ 'Content-type':'Application/json', 'Authorization':'Basic 12345' },
    data: Json.stringify({ "CustomerMasterlist":[{...}] })
  });
  expect(response.status()).toBe(201);
  const responseBody = await response.json();
  expect(responseBody.toEqual({...})
})`,
            mistakes: [
              '❌ Json.stringify() → should be JSON.stringify()',
              '❌ "CustomerMasterlist" → should be "CustomerMasterList" (capital L — matches the request spec)',
              '❌ expect(responseBody.toEqual({}) → missing closing )) — syntax error. Should be: expect(responseBody).toEqual({...})',
              '❌ Missing await on response.status() — but actually .status() is synchronous in Playwright, so this is OK',
              '❌ UUID assertion: expect.String() → should be expect.stringMatching(/.../) or expect.any(String)',
              '❌ Missing comma after UUID field in toEqual object',
              '❌ baseURL not set — in real test use baseURL in playwright.config.js and just pass the path',
            ],
            correctAnswer: `const { test, expect } = require('@playwright/test');

test('POST /v1/createNewRecord - 201 and response body', async ({ request }) => {
  const payload = {
    CustomerMasterList: [{
      CustomerID: 100,
      CustomerName: "Ramaraj",
      ProofID: "X-0001",
      Address: "First Street",
      City: "Chennai",
      State: "TN",
      BranchCode: "TN001",
      AccountNumber: 600001
    }]
  };

  const response = await request.post('https://api.example.com/v1/createNewRecord', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic 123455'
    },
    data: JSON.stringify(payload)
  });

  // Assert status code
  expect(response.status()).toBe(201);

  // Assert response body
  const body = await response.json();
  expect(body).toMatchObject({
    CustomerID: 100,
    UUID: expect.stringMatching(/\\d{4}-\\d{3}-\\d{6}/),
    CustomerName: "Ramaraj",
    Address: "First Street",
    City: "Chennai",
    State: "TN"
  });
});`
          },
          {
            asked: 'Q2: UI Test — Login to Facebook, fill username+password, click login, validate profile name',
            myAnswer: `test('validate login,submit and name', async({ page )} => {
  await page.goto("www.facebook.com");
  await page.fill("[placeholder:usernmae]","abhishekfb123");
  await page.fill("[placeholder:password]","admin1admin");
  await page.click(['name="login"']);
  await page.waitforNavigation();
  const username = await page.innerText("//label[accountName] and title[\\"username\\"]");
  expect username.toBe("profitle name");
})`,
            mistakes: [
              '❌ async({ page )} → syntax error — should be async ({ page }) =>',
              '❌ goto("www.facebook.com") → missing https:// — browser won\'t resolve. Use "https://www.facebook.com"',
              '❌ [placeholder:usernmae] → typo "usernmae" + wrong CSS selector syntax. Should be [placeholder="username"] or use getByPlaceholder()',
              '❌ page.click([\'name="login"\']) → array passed instead of string selector',
              '❌ page.waitforNavigation() → camelCase wrong: waitForNavigation() (capital F) — also deprecated, prefer waitForURL()',
              '❌ XPath "//label[accountName] and title[\\"username\\"]" → completely invalid XPath',
              '❌ expect username.toBe() → should be expect(username).toBe() — missing parentheses',
              '❌ expect assertion not awaited properly for locator-based assertions',
            ],
            correctAnswer: `const { test, expect } = require('@playwright/test');

test('Facebook login and validate profile name', async ({ page }) => {
  await page.goto('https://www.facebook.com');

  // Fill credentials
  await page.getByLabel('Email or phone number').fill('abhishekfb123');
  await page.getByLabel('Password').fill('admin1admin');

  // Click login button
  await page.getByRole('button', { name: 'Log in' }).click();

  // Wait for navigation to complete
  await page.waitForURL('**/');

  // Assert profile/display name visible
  const profileName = await page.getByTitle('Profile').innerText();
  expect(profileName).toBe('Abhishek');

  // Alternative — assert a locator using Playwright's built-in expect
  await expect(page.getByRole('heading', { name: 'Abhishek' })).toBeVisible();
});`
          },
          {
            asked: 'Q3: (Third question — recall what was asked and your answer here)',
            myAnswer: 'Not recorded yet — update this after recalling',
            mistakes: ['Add your answer once recalled'],
            correctAnswer: 'Add correct answer once question is recalled'
          }
        ]
      },
      {
        round: 'R2 — Technical Deep Dive (Upcoming)',
        status: 'upcoming',
        date: 'TBD',
        interviewer: 'Same as R1',
        format: 'Programming focus — likely Playwright JS again',
        note: 'Same interviewer from R1. Expect more coding. Practice the Q&A bank below.',
        questions: []
      }
    ]
  },
  {
    id: 'innovationm',
    name: 'InnovationM',
    logo: '🔶',
    rounds: [
      {
        round: 'R1 — Screening',
        status: 'pending',
        date: 'Rescheduled — date TBD',
        interviewer: 'TBD',
        format: 'TBD',
        note: 'Interview did not happen. Will be rescheduled.',
        questions: []
      }
    ]
  }
];


/* ══════════════════════════════════════
   LTIM R2 PREP — SCENARIO-BASED CODING CHALLENGES
══════════════════════════════════════ */
const LTIM_PREP = [
  /* ─────────────────────────────────────────────────────────────────────
     CATEGORY 1 — POST API SCENARIOS
     Format: spec is given (URL, method, headers, body, response)
             Task: write the full Playwright JS test
  ───────────────────────────────────────────────────────────────────── */
  {
    category: '📮 POST API Scenarios',
    qs: [
      {
        q: `SCENARIO 1 (same as R1 — master this first)
URL: POST /v1/createNewRecord
Auth: Basic "123455"
Headers: Content-Type: application/json
Request body:
  { "CustomerMasterList": [{ "CustomerID": 100, "CustomerName": "Ramaraj",
    "ProofID": "X-0001", "Address": "First Street", "City": "Chennai",
    "State": "TN", "BranchCode": "TN001", "AccountNumber": 600001 }] }
Response (201):
  { "CustomerID": 100, "UUID": "1234-123-123123",
    "CustomerName": "Ramaraj", "Address": "First Street",
    "City": "Chennai", "State": "TN" }
TASK: Write the complete Playwright JS test.`,
        a: `<b>Key points:</b> JSON.stringify() not Json.stringify() • CustomerMasterList capital L • expect(body) not expect(body.toEqual • UUID is dynamic → use toBeTruthy() or expect.any(String)`,
        code: `const { test, expect } = require('@playwright/test');

test('POST /v1/createNewRecord — 201 and body validation', async ({ request }) => {
  const response = await request.post('https://api.example.com/v1/createNewRecord', {
    headers: {
      'Content-Type': 'application/json',   // capital T and Y
      'Authorization': 'Basic 123455'
    },
    data: {                                  // pass object directly — no JSON.stringify needed
      CustomerMasterList: [{                 // capital L — must match spec exactly
        CustomerID: 100,
        CustomerName: 'Ramaraj',
        ProofID: 'X-0001',
        Address: 'First Street',
        City: 'Chennai',
        State: 'TN',
        BranchCode: 'TN001',
        AccountNumber: 600001
      }]
    }
  });

  // Status assertion
  expect(response.status()).toBe(201);

  // Body assertions
  const body = await response.json();        // must await

  expect(body).toMatchObject({               // toMatchObject allows extra fields
    CustomerID: 100,
    CustomerName: 'Ramaraj',
    Address: 'First Street',
    City: 'Chennai',
    State: 'TN'
  });

  // UUID is dynamic — just verify it exists
  expect(body.UUID).toBeTruthy();
  expect(typeof body.UUID).toBe('string');
});`
      },
      {
        q: `SCENARIO 2 — Create an Employee record
URL: POST /api/v2/employees
Auth: Bearer token "eyJhbGciOi..."
Headers: Content-Type: application/json, Accept: application/json
Request body:
  { "empId": "EMP001", "name": "Priya Sharma",
    "department": "Engineering", "salary": 85000, "joinDate": "2026-06-14" }
Response (201):
  { "empId": "EMP001", "name": "Priya Sharma", "department": "Engineering",
    "recordId": "auto-generated-uuid", "status": "ACTIVE" }
TASK: Write the complete test. Assert 201, assert name and department, assert recordId is not null.`,
        a: `<b>Pattern:</b> Bearer token goes in header as "Bearer <token>" • Assert status first, then body • recordId is server-generated → toBeTruthy() • status field should equal "ACTIVE"`,
        code: `const { test, expect } = require('@playwright/test');

test('POST /api/v2/employees — create employee and validate response', async ({ request }) => {
  const response = await request.post('https://api.example.com/api/v2/employees', {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer eyJhbGciOi...'
    },
    data: {
      empId: 'EMP001',
      name: 'Priya Sharma',
      department: 'Engineering',
      salary: 85000,
      joinDate: '2026-06-14'
    }
  });

  // Status
  expect(response.status()).toBe(201);

  // Body
  const body = await response.json();

  expect(body.empId).toBe('EMP001');
  expect(body.name).toBe('Priya Sharma');
  expect(body.department).toBe('Engineering');
  expect(body.status).toBe('ACTIVE');

  // Server-generated field
  expect(body.recordId).toBeTruthy();
  expect(body.recordId).not.toBeNull();
});`
      },
      {
        q: `SCENARIO 3 — Create Order with nested items array
URL: POST /api/orders
Auth: Basic "admin:password" (base64 encode it)
Headers: Content-Type: application/json
Request body:
  { "orderId": "ORD-500", "customerId": "CUST-100",
    "items": [
      { "productId": "P001", "name": "Laptop", "qty": 1, "price": 75000 },
      { "productId": "P002", "name": "Mouse",  "qty": 2, "price": 1500  }
    ],
    "totalAmount": 78000 }
Response (201):
  { "orderId": "ORD-500", "status": "CONFIRMED",
    "items": [...], "invoiceNo": "INV-2026-001", "totalAmount": 78000 }
TASK: Assert 201, orderId, status CONFIRMED, invoiceNo exists, items has 2 elements.`,
        a: `<b>Pattern:</b> Nested array in body — check array length with toHaveLength() or check .length • Buffer.from('admin:password').toString('base64') for Basic auth encoding`,
        code: `const { test, expect } = require('@playwright/test');

test('POST /api/orders — create order with multiple items', async ({ request }) => {
  // Encode Basic auth credentials
  const credentials = Buffer.from('admin:password').toString('base64');

  const response = await request.post('https://api.example.com/api/orders', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Basic \${credentials}\`
    },
    data: {
      orderId: 'ORD-500',
      customerId: 'CUST-100',
      items: [
        { productId: 'P001', name: 'Laptop', qty: 1, price: 75000 },
        { productId: 'P002', name: 'Mouse',  qty: 2, price: 1500  }
      ],
      totalAmount: 78000
    }
  });

  expect(response.status()).toBe(201);

  const body = await response.json();

  expect(body.orderId).toBe('ORD-500');
  expect(body.status).toBe('CONFIRMED');
  expect(body.totalAmount).toBe(78000);

  // Server-generated invoice number
  expect(body.invoiceNo).toBeTruthy();

  // Nested array assertions
  expect(body.items).toHaveLength(2);
  expect(body.items[0].productId).toBe('P001');
  expect(body.items[1].name).toBe('Mouse');
});`
      },
      {
        q: `SCENARIO 4 — Submit a form (Login API)
URL: POST /api/auth/login
No auth header (this IS the auth endpoint)
Headers: Content-Type: application/json
Request body:
  { "username": "testuser@ltim.com", "password": "Test@123" }
Response (200):
  { "token": "eyJhbGci...", "expiresIn": 3600, "userId": "U-001", "role": "TESTER" }
TASK: Assert 200, token exists and is a string, expiresIn is a number, role equals "TESTER".`,
        a: `<b>Pattern:</b> Login → 200 not 201 • token is dynamic → check type is string • typeof check for number • This token is then used in all subsequent requests`,
        code: `const { test, expect } = require('@playwright/test');

test('POST /api/auth/login — successful login returns token', async ({ request }) => {
  const response = await request.post('https://api.example.com/api/auth/login', {
    headers: { 'Content-Type': 'application/json' },
    data: {
      username: 'testuser@ltim.com',
      password: 'Test@123'
    }
  });

  // Login returns 200, not 201
  expect(response.status()).toBe(200);

  const body = await response.json();

  // Token — dynamic, just verify it exists and is a string
  expect(body.token).toBeTruthy();
  expect(typeof body.token).toBe('string');

  // Numeric field
  expect(typeof body.expiresIn).toBe('number');
  expect(body.expiresIn).toBeGreaterThan(0);

  // Static fields
  expect(body.userId).toBe('U-001');
  expect(body.role).toBe('TESTER');
});`
      },
      {
        q: `SCENARIO 5 — POST with query params AND body
URL: POST /api/v1/products?category=electronics&warehouse=TN001
Auth: Bearer token
Headers: Content-Type: application/json
Request body:
  { "productId": "P-999", "name": "Keyboard", "price": 2500, "stock": 50 }
Response (201):
  { "productId": "P-999", "name": "Keyboard", "price": 2500,
    "category": "electronics", "warehouse": "TN001", "createdAt": "2026-06-14T10:00:00Z" }
TASK: Assert 201, category and warehouse in response match query params, createdAt is truthy.`,
        a: `<b>Pattern:</b> Query params go in the URL string directly, OR use params option in request. Assert response reflects the query param values.`,
        code: `const { test, expect } = require('@playwright/test');

test('POST /api/v1/products — create product with query params', async ({ request }) => {
  const response = await request.post(
    'https://api.example.com/api/v1/products?category=electronics&warehouse=TN001',
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOi...'
      },
      data: {
        productId: 'P-999',
        name: 'Keyboard',
        price: 2500,
        stock: 50
      }
    }
  );

  expect(response.status()).toBe(201);

  const body = await response.json();

  expect(body.productId).toBe('P-999');
  expect(body.name).toBe('Keyboard');
  expect(body.price).toBe(2500);

  // Response must reflect query params
  expect(body.category).toBe('electronics');
  expect(body.warehouse).toBe('TN001');

  // Timestamp — dynamic, just verify it exists
  expect(body.createdAt).toBeTruthy();
});`
      },
    ]
  },

  /* ─────────────────────────────────────────────────────────────────────
     CATEGORY 2 — GET API SCENARIOS
  ───────────────────────────────────────────────────────────────────── */
  {
    category: '📥 GET API Scenarios',
    qs: [
      {
        q: `SCENARIO 6 — GET single record by ID
URL: GET /api/v1/customers/100
Auth: Bearer token
Expected Response (200):
  { "CustomerID": 100, "CustomerName": "Ramaraj",
    "City": "Chennai", "State": "TN", "status": "ACTIVE" }
TASK: Assert 200, CustomerID is 100, status is ACTIVE.`,
        a: `<b>Pattern:</b> GET by ID — no request body • Assert exact values on known fields • status field is a string comparison`,
        code: `const { test, expect } = require('@playwright/test');

test('GET /api/v1/customers/100 — fetch customer by ID', async ({ request }) => {
  const response = await request.get('https://api.example.com/api/v1/customers/100', {
    headers: {
      'Authorization': 'Bearer eyJhbGciOi...'
    }
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.CustomerID).toBe(100);
  expect(body.CustomerName).toBe('Ramaraj');
  expect(body.City).toBe('Chennai');
  expect(body.State).toBe('TN');
  expect(body.status).toBe('ACTIVE');
});`
      },
      {
        q: `SCENARIO 7 — GET list and validate array
URL: GET /api/v1/customers?state=TN&status=ACTIVE
Auth: Bearer token
Expected Response (200):
  [ { "CustomerID": 100, "CustomerName": "Ramaraj", "City": "Chennai", "State": "TN" },
    { "CustomerID": 101, "CustomerName": "Suresh",  "City": "Madurai", "State": "TN" } ]
TASK: Assert 200, response is an array, length is 2, first customer ID is 100.`,
        a: `<b>Pattern:</b> Array response — check Array.isArray() first • check .length • access elements by index • Every item should have the required fields`,
        code: `const { test, expect } = require('@playwright/test');

test('GET /api/v1/customers — list customers filtered by state', async ({ request }) => {
  const response = await request.get(
    'https://api.example.com/api/v1/customers?state=TN&status=ACTIVE',
    {
      headers: { 'Authorization': 'Bearer eyJhbGciOi...' }
    }
  );

  expect(response.status()).toBe(200);

  const body = await response.json();

  // Validate it's an array
  expect(Array.isArray(body)).toBe(true);

  // Validate count
  expect(body).toHaveLength(2);

  // Validate first record
  expect(body[0].CustomerID).toBe(100);
  expect(body[0].CustomerName).toBe('Ramaraj');
  expect(body[0].State).toBe('TN');

  // Validate all items have required fields
  body.forEach(customer => {
    expect(customer.CustomerID).toBeTruthy();
    expect(customer.State).toBe('TN');
  });
});`
      },
      {
        q: `SCENARIO 8 — GET and assert 404 for non-existent record
URL: GET /api/v1/customers/9999
Auth: Bearer token
Expected Response (404):
  { "error": "Customer not found", "code": "CUSTOMER_NOT_FOUND" }
TASK: Assert 404, error message contains "not found", error code is "CUSTOMER_NOT_FOUND".`,
        a: `<b>Pattern:</b> Negative test — expect 404 not 200 • Assert error body fields • toContain() for partial string match`,
        code: `const { test, expect } = require('@playwright/test');

test('GET /api/v1/customers/9999 — non-existent customer returns 404', async ({ request }) => {
  const response = await request.get('https://api.example.com/api/v1/customers/9999', {
    headers: { 'Authorization': 'Bearer eyJhbGciOi...' }
  });

  // Assert 404 — this IS the expected outcome, not a failure
  expect(response.status()).toBe(404);

  const body = await response.json();

  // Assert error body
  expect(body.error).toContain('not found');    // partial match
  expect(body.code).toBe('CUSTOMER_NOT_FOUND'); // exact match
});`
      },
      {
        q: `SCENARIO 9 — GET with path parameter and multiple query params
URL: GET /api/v2/reports/monthly?year=2026&month=06&format=json
Auth: Basic auth
Expected Response (200):
  { "reportId": "RPT-2026-06", "totalTransactions": 1540,
    "totalRevenue": 4500000, "currency": "INR",
    "generatedAt": "2026-06-14T00:00:00Z" }
TASK: Assert 200, totalTransactions is greater than 0, currency is INR, reportId matches pattern RPT-YYYY-MM.`,
        a: `<b>Pattern:</b> Query params in URL string • toBeGreaterThan() for numeric assertions • toMatch() with regex for pattern match`,
        code: `const { test, expect } = require('@playwright/test');

test('GET /api/v2/reports/monthly — monthly report generation', async ({ request }) => {
  const credentials = Buffer.from('admin:password').toString('base64');

  const response = await request.get(
    'https://api.example.com/api/v2/reports/monthly?year=2026&month=06&format=json',
    {
      headers: { 'Authorization': \`Basic \${credentials}\` }
    }
  );

  expect(response.status()).toBe(200);

  const body = await response.json();

  // Numeric range assertion
  expect(body.totalTransactions).toBeGreaterThan(0);
  expect(body.totalRevenue).toBeGreaterThan(0);

  // Exact match
  expect(body.currency).toBe('INR');

  // Pattern match using regex
  expect(body.reportId).toMatch(/^RPT-\\d{4}-\\d{2}$/);

  // Timestamp — exists
  expect(body.generatedAt).toBeTruthy();
});`
      },
    ]
  },

  /* ─────────────────────────────────────────────────────────────────────
     CATEGORY 3 — PUT / PATCH / DELETE SCENARIOS
  ───────────────────────────────────────────────────────────────────── */
  {
    category: '🔄 PUT / PATCH / DELETE Scenarios',
    qs: [
      {
        q: `SCENARIO 10 — PUT to update a record
URL: PUT /api/v1/customers/100
Auth: Bearer token
Headers: Content-Type: application/json
Request body:
  { "CustomerName": "Ramaraj Updated", "City": "Coimbatore", "State": "TN" }
Response (200):
  { "CustomerID": 100, "CustomerName": "Ramaraj Updated",
    "City": "Coimbatore", "State": "TN", "updatedAt": "2026-06-14T10:00:00Z" }
TASK: Assert 200, CustomerName is updated, City is Coimbatore, updatedAt is truthy.`,
        a: `<b>Pattern:</b> PUT = full replace • Assert the updated values in response • updatedAt is server-generated timestamp → toBeTruthy()`,
        code: `const { test, expect } = require('@playwright/test');

test('PUT /api/v1/customers/100 — update customer details', async ({ request }) => {
  const response = await request.put('https://api.example.com/api/v1/customers/100', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOi...'
    },
    data: {
      CustomerName: 'Ramaraj Updated',
      City: 'Coimbatore',
      State: 'TN'
    }
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.CustomerID).toBe(100);
  expect(body.CustomerName).toBe('Ramaraj Updated');
  expect(body.City).toBe('Coimbatore');
  expect(body.State).toBe('TN');
  expect(body.updatedAt).toBeTruthy();
});`
      },
      {
        q: `SCENARIO 11 — PATCH to partially update a record
URL: PATCH /api/v1/employees/EMP001
Auth: Bearer token
Headers: Content-Type: application/json
Request body (only fields being changed):
  { "department": "QA Automation", "salary": 92000 }
Response (200):
  { "empId": "EMP001", "name": "Priya Sharma",
    "department": "QA Automation", "salary": 92000, "status": "ACTIVE" }
TASK: Assert 200, department changed to QA Automation, salary is 92000, name unchanged.`,
        a: `<b>Pattern:</b> PATCH = partial update (only send changed fields) • Assert changed fields AND verify unchanged fields remain intact`,
        code: `const { test, expect } = require('@playwright/test');

test('PATCH /api/v1/employees/EMP001 — partial update department and salary', async ({ request }) => {
  const response = await request.patch('https://api.example.com/api/v1/employees/EMP001', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOi...'
    },
    data: {
      department: 'QA Automation',
      salary: 92000
    }
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  // Changed fields — verify update worked
  expect(body.department).toBe('QA Automation');
  expect(body.salary).toBe(92000);

  // Unchanged fields — verify PATCH didn't wipe them
  expect(body.empId).toBe('EMP001');
  expect(body.name).toBe('Priya Sharma');
  expect(body.status).toBe('ACTIVE');
});`
      },
      {
        q: `SCENARIO 12 — DELETE and verify record is gone
URL: DELETE /api/v1/customers/100
Auth: Bearer token
Expected Response: 204 No Content (empty body)
Then: GET /api/v1/customers/100 should return 404
TASK: Assert DELETE returns 204, then GET returns 404.`,
        a: `<b>Pattern:</b> DELETE → 204 means no body returned • Follow-up GET proves deletion • This two-step pattern proves end-to-end correctness`,
        code: `const { test, expect } = require('@playwright/test');

test('DELETE /api/v1/customers/100 — delete and verify gone', async ({ request }) => {
  const headers = { 'Authorization': 'Bearer eyJhbGciOi...' };

  // Step 1: Delete the customer
  const deleteResponse = await request.delete(
    'https://api.example.com/api/v1/customers/100',
    { headers }
  );

  // 204 No Content — success, no body
  expect(deleteResponse.status()).toBe(204);

  // Step 2: Verify it no longer exists
  const getResponse = await request.get(
    'https://api.example.com/api/v1/customers/100',
    { headers }
  );

  expect(getResponse.status()).toBe(404);
});`
      },
    ]
  },

  /* ─────────────────────────────────────────────────────────────────────
     CATEGORY 4 — UI SCENARIOS (same format as R1 Q2)
  ───────────────────────────────────────────────────────────────────── */
  {
    category: '🖥️ UI Test Scenarios',
    qs: [
      {
        q: `SCENARIO 13 (same pattern as R1 Q2 — Facebook login)
URL: https://www.saucedemo.com
Steps:
  1. Navigate to the site
  2. Fill username: standard_user
  3. Fill password: secret_sauce
  4. Click the Login button
  5. Assert URL contains /inventory
  6. Assert page heading "Products" is visible
TASK: Write the complete Playwright UI test.`,
        a: `<b>Key points:</b> Use getByLabel() for inputs or getByPlaceholder() • getByRole('button') for login button • Use expect(page).toHaveURL() for URL • Use expect(locator).toBeVisible() for element`,
        code: `const { test, expect } = require('@playwright/test');

test('Login to SauceDemo and verify Products page', async ({ page }) => {
  // Step 1: Navigate
  await page.goto('https://www.saucedemo.com');

  // Step 2 & 3: Fill credentials
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');

  // Step 4: Click login
  await page.getByRole('button', { name: 'Login' }).click();

  // Step 5: Assert URL
  await expect(page).toHaveURL(/.*inventory/);

  // Step 6: Assert heading visible
  await expect(page.getByText('Products')).toBeVisible();
});`
      },
      {
        q: `SCENARIO 14 — Login, navigate to a page, assert a text
Site: https://the-internet.herokuapp.com/login
Steps:
  1. Navigate to /login
  2. Fill username: tomsmith
  3. Fill password: SuperSecretPassword!
  4. Click Login button
  5. Assert URL ends in /secure
  6. Assert text "You logged into a secure area!" is visible
  7. Click Logout
  8. Assert URL is back to /login
TASK: Write complete test including logout.`,
        a: `<b>Pattern:</b> Full round-trip test — login → assert secure → logout → assert back to login. Use toContain() for URL partial match.`,
        code: `const { test, expect } = require('@playwright/test');

test('Login, verify secure area, logout', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');

  await page.getByLabel('Username').fill('tomsmith');
  await page.getByLabel('Password').fill('SuperSecretPassword!');
  await page.getByRole('button', { name: 'Login' }).click();

  // Assert navigated to secure page
  await expect(page).toHaveURL(/.*\\/secure/);
  await expect(page.getByText('You logged into a secure area!')).toBeVisible();

  // Logout
  await page.getByRole('link', { name: 'Logout' }).click();

  // Assert back to login
  await expect(page).toHaveURL(/.*\\/login/);
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});`
      },
      {
        q: `SCENARIO 15 — Fill a form with multiple field types
Site: any form page
Fields:
  - Text input: Full Name → "Abhishek Srivastava"
  - Email input: Email → "abhishek@ltim.com"
  - Dropdown <select>: Department → "Engineering"
  - Checkbox: "I agree to terms" → check it
  - Submit button: click
Expected: Success message "Form submitted successfully" appears
TASK: Write the complete Playwright test.`,
        a: `<b>Pattern:</b> Multiple input types in one test • selectOption() for dropdowns • check() for checkboxes • Assert success message after submit`,
        code: `const { test, expect } = require('@playwright/test');

test('Submit multi-field form', async ({ page }) => {
  await page.goto('https://example.com/register');

  // Text input
  await page.getByLabel('Full Name').fill('Abhishek Srivastava');

  // Email input
  await page.getByLabel('Email').fill('abhishek@ltim.com');

  // Dropdown — native <select>
  await page.getByLabel('Department').selectOption('Engineering');

  // Checkbox
  await page.getByLabel('I agree to terms').check();

  // Verify checkbox is checked before submitting
  await expect(page.getByLabel('I agree to terms')).toBeChecked();

  // Submit
  await page.getByRole('button', { name: 'Submit' }).click();

  // Assert success
  await expect(page.getByText('Form submitted successfully')).toBeVisible();
});`
      },
      {
        q: `SCENARIO 16 — Search, assert results, click result, verify detail page
Steps:
  1. Go to https://example-shop.com
  2. Find the search bar (placeholder: "Search products...")
  3. Type "Laptop"
  4. Press Enter or click Search button
  5. Assert at least one result card appears
  6. Click the first result
  7. Assert product detail page title contains "Laptop"
TASK: Write the test.`,
        a: `<b>Pattern:</b> Search flow — fill → trigger → assert results list → click first → assert detail page. Use .first() to get first element in a list.`,
        code: `const { test, expect } = require('@playwright/test');

test('Search for Laptop and view product detail', async ({ page }) => {
  await page.goto('https://example-shop.com');

  // Fill search and trigger
  await page.getByPlaceholder('Search products...').fill('Laptop');
  await page.getByRole('button', { name: 'Search' }).click();
  // OR press Enter: await page.getByPlaceholder('Search products...').press('Enter');

  // Assert results appeared
  const results = page.getByTestId('product-card');  // or locator('.product-card')
  await expect(results.first()).toBeVisible();

  // Click first result
  await results.first().click();

  // Assert detail page
  await expect(page).toHaveURL(/.*product.*/);
  await expect(page.getByRole('heading').first()).toContainText('Laptop');
});`
      },
      {
        q: `SCENARIO 17 — Assert a table has specific data
Steps:
  1. Navigate to https://example.com/customers
  2. A table loads with columns: ID, Name, City, Status
  3. Assert the table has at least 1 row (not counting header)
  4. Assert "Ramaraj" appears somewhere in the table
  5. Assert the row containing "Ramaraj" also shows "Chennai"
  6. Assert a row with status "ACTIVE" exists
TASK: Write the assertions.`,
        a: `<b>Pattern:</b> Table assertions — getByRole('row') • nth(1) skips header • filter() to find a row by text • Check cell within a row using chaining`,
        code: `const { test, expect } = require('@playwright/test');

test('Customers table shows Ramaraj from Chennai', async ({ page }) => {
  await page.goto('https://example.com/customers');

  // Wait for table to load
  await expect(page.getByRole('table')).toBeVisible();

  // Assert at least 1 data row (row 0 = header, row 1 = first data)
  const rows = page.getByRole('row');
  const count = await rows.count();
  expect(count).toBeGreaterThan(1);  // more than just the header

  // Assert "Ramaraj" appears in the table
  await expect(page.getByRole('cell', { name: 'Ramaraj' })).toBeVisible();

  // Assert the row with "Ramaraj" also contains "Chennai"
  const ramarajRow = page.getByRole('row').filter({ hasText: 'Ramaraj' });
  await expect(ramarajRow).toContainText('Chennai');

  // Assert at least one ACTIVE row exists
  await expect(page.getByRole('row').filter({ hasText: 'ACTIVE' }).first()).toBeVisible();
});`
      },
    ]
  },

  /* ─────────────────────────────────────────────────────────────────────
     CATEGORY 5 — ASSERTION-FOCUSED SCENARIOS
     "What assertion would you use?" style questions
  ───────────────────────────────────────────────────────────────────── */
  {
    category: '✅ Assertion Scenarios',
    qs: [
      {
        q: `SCENARIO 18 — Response body has a field that could be null
The API response for a new customer:
  { "CustomerID": 100, "CustomerName": "Ramaraj", "middleName": null, "email": "raj@test.com" }
TASK: Write assertions for all four fields. middleName can be null — how do you handle that?`,
        a: `<b>Pattern:</b> toBeNull() for null • toBeDefined() checks field exists even if null • toBeTruthy() would FAIL for null — don't use it when null is valid`,
        code: `const body = await response.json();

expect(body.CustomerID).toBe(100);
expect(body.CustomerName).toBe('Ramaraj');

// middleName can be null — assert it exists as a field but is null
expect(body.middleName).toBeNull();
// OR: just verify the key exists
expect(body).toHaveProperty('middleName');

// email is a non-null string
expect(body.email).toBe('raj@test.com');
expect(body.email).toContain('@');`
      },
      {
        q: `SCENARIO 19 — Assert a number is within a valid range
Response:
  { "score": 87, "grade": "B", "percentile": 92.5 }
TASK: Assert score is between 80 and 100, percentile is greater than 90, grade is exactly "B".`,
        a: `<b>Pattern:</b> toBeGreaterThanOrEqual() and toBeLessThanOrEqual() for ranges • toBeGreaterThan() for minimum • exact string with toBe()`,
        code: `const body = await response.json();

// Range assertion
expect(body.score).toBeGreaterThanOrEqual(80);
expect(body.score).toBeLessThanOrEqual(100);

// Minimum threshold
expect(body.percentile).toBeGreaterThan(90);

// Exact match
expect(body.grade).toBe('B');`
      },
      {
        q: `SCENARIO 20 — Assert a list contains specific items
Response:
  { "userId": "U-001", "permissions": ["READ", "WRITE", "EXPORT"],
    "tags": ["premium", "verified"] }
TASK: Assert permissions contains READ and WRITE, does NOT contain DELETE, tags has 2 items.`,
        a: `<b>Pattern:</b> toContain() for arrays (single item check) • not.toContain() for absence • toHaveLength() for count`,
        code: `const body = await response.json();

// Contains specific items
expect(body.permissions).toContain('READ');
expect(body.permissions).toContain('WRITE');

// Does NOT contain
expect(body.permissions).not.toContain('DELETE');

// Array length
expect(body.tags).toHaveLength(2);

// Contains a specific tag
expect(body.tags).toContain('premium');`
      },
      {
        q: `SCENARIO 21 — Assert the response body partially matches (more fields than expected)
The API returns a large customer object with 20 fields.
You only care about: CustomerID=100, State="TN", status="ACTIVE"
TASK: What assertion allows you to check just those 3 fields without listing all 20?`,
        a: `<b>Answer: toMatchObject() — checks that the specified keys match, ignores all other fields in the response.</b> This is what you should use when response has more fields than you want to assert.`,
        code: `const body = await response.json();

// toMatchObject — partial match, extra fields in body are ignored
expect(body).toMatchObject({
  CustomerID: 100,
  State: 'TN',
  status: 'ACTIVE'
});

// vs toEqual — would FAIL because body has other fields too
// expect(body).toEqual({ CustomerID: 100, State: 'TN', status: 'ACTIVE' }); // ❌ fails`
      },
      {
        q: `SCENARIO 22 — Assert a UI element has specific text content
After login, the navbar should show "Welcome, Abhishek"
The profile icon badge should show "A" (first letter of name)
The page title should contain "Dashboard"
TASK: Write all three assertions.`,
        a: `<b>Pattern:</b> toHaveText() for exact • toContainText() for partial • toHaveTitle() for page title`,
        code: `// Exact text — must match completely
await expect(page.getByTestId('welcome-message')).toHaveText('Welcome, Abhishek');

// Partial text — just checks it contains the substring
await expect(page.getByRole('navigation')).toContainText('Abhishek');

// Badge shows first letter
await expect(page.getByTestId('profile-badge')).toHaveText('A');

// Page title (in browser tab)
await expect(page).toHaveTitle(/Dashboard/);        // regex — partial
// OR
await expect(page).toHaveTitle('My App - Dashboard'); // exact`
      },
      {
        q: `SCENARIO 23 — Assert that an error message appears on bad login
Site: https://www.saucedemo.com
Steps:
  1. Enter username: wrong_user
  2. Enter password: wrong_pass
  3. Click login
  4. Assert: error message is visible
  5. Assert: error contains "Username and password do not match"
  6. Assert: you are still on /login (no redirect)
TASK: Write the negative test.`,
        a: `<b>Pattern:</b> Negative test — use wrong credentials, assert error not success. toHaveURL() ensures no redirect happened.`,
        code: `const { test, expect } = require('@playwright/test');

test('Invalid login shows error message', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  await page.getByPlaceholder('Username').fill('wrong_user');
  await page.getByPlaceholder('Password').fill('wrong_pass');
  await page.getByRole('button', { name: 'Login' }).click();

  // Error message is visible
  const error = page.locator('[data-test="error"]');
  await expect(error).toBeVisible();

  // Error text
  await expect(error).toContainText('Username and password do not match');

  // Still on login page — no redirect happened
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});`
      },
      {
        q: `SCENARIO 24 — Assert multiple fields simultaneously using soft assertions
After a form submit response, you need to check 5 fields.
If you use regular expect() and field 2 fails, fields 3-5 are never checked.
TASK: How do you run ALL 5 assertions and get all failures in one go?`,
        a: `<b>Answer: Soft assertions.</b> expect.soft() collects all failures and reports them all at end of test, instead of stopping at the first failure.`,
        code: `const { test, expect } = require('@playwright/test');

test('POST response — check all fields with soft assertions', async ({ request }) => {
  const response = await request.post('/api/customers', { data: { name: 'Test' } });
  const body = await response.json();

  // Soft assertions — ALL run even if one fails
  expect.soft(response.status()).toBe(201);
  expect.soft(body.CustomerID).toBeTruthy();
  expect.soft(body.CustomerName).toBe('Test');
  expect.soft(body.status).toBe('ACTIVE');
  expect.soft(body.UUID).toBeTruthy();

  // Report shows ALL failures, not just the first one
  // Test continues to end regardless of individual soft assertion results
});`
      },
    ]
  },

  /* ─────────────────────────────────────────────────────────────────────
     CATEGORY 6 — END-TO-END SCENARIOS (API + UI combined)
  ───────────────────────────────────────────────────────────────────── */
  {
    category: '🔗 End-to-End Scenarios',
    qs: [
      {
        q: `SCENARIO 25 — Create via API, verify in UI
Steps:
  1. POST /api/v1/customers — create a customer (Ramaraj, Chennai)
  2. Assert 201 and get the CustomerID from response
  3. Navigate to https://app.example.com/customers/{customerId}
  4. Assert the UI shows "Ramaraj" and "Chennai"
TASK: Write the complete test combining API and UI steps.`,
        a: `<b>Pattern:</b> API creates data faster than UI. Extract ID from POST response, construct URL with it, verify in UI. This is the most efficient test setup pattern.`,
        code: `const { test, expect } = require('@playwright/test');

test('Create customer via API and verify in UI', async ({ request, page }) => {
  // Step 1 & 2: Create via API
  const createResponse = await request.post('https://api.example.com/api/v1/customers', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer mytoken123'
    },
    data: {
      CustomerName: 'Ramaraj',
      City: 'Chennai',
      State: 'TN'
    }
  });

  expect(createResponse.status()).toBe(201);
  const created = await createResponse.json();
  const customerId = created.CustomerID;

  // Step 3: Navigate to the customer's UI page
  await page.goto(\`https://app.example.com/customers/\${customerId}\`);

  // Step 4: Assert UI shows the created data
  await expect(page.getByText('Ramaraj')).toBeVisible();
  await expect(page.getByText('Chennai')).toBeVisible();
});`
      },
      {
        q: `SCENARIO 26 — Login via API token, use it for protected UI page
Steps:
  1. POST /api/auth/login → get token
  2. Use token to SET auth state in browser (localStorage or cookie)
  3. Navigate to protected /dashboard page
  4. Assert dashboard loads without login redirect
TASK: Write the test that avoids filling the login form by using the API token.`,
        a: `<b>Pattern:</b> Skip UI login → use API to get token → inject into browser context. Faster and more reliable than UI login in every test.`,
        code: `const { test, expect } = require('@playwright/test');

test('Skip UI login — inject API token into browser', async ({ request, page }) => {
  // Step 1: Get token from API
  const loginRes = await request.post('https://api.example.com/api/auth/login', {
    data: { username: 'admin', password: 'Test@123' }
  });
  const { token } = await loginRes.json();

  // Step 2: Inject token into browser localStorage
  await page.goto('https://app.example.com');
  await page.evaluate((t) => {
    localStorage.setItem('authToken', t);
  }, token);

  // Step 3: Navigate to protected page
  await page.goto('https://app.example.com/dashboard');

  // Step 4: Assert dashboard loaded (not redirected to login)
  await expect(page).toHaveURL(/.*dashboard/);
  await expect(page.getByText('Welcome')).toBeVisible();
});`
      },
      {
        q: `SCENARIO 27 — Multi-step flow: Create → Search → Delete → Verify gone
Steps:
  1. POST to create a customer named "TestDelete User"
  2. GET the list and verify this customer appears
  3. DELETE the customer using their ID
  4. GET the list again — verify customer is no longer in the list
TASK: Full CRUD flow in a single test.`,
        a: `<b>Pattern:</b> Complete CRUD in one test — Create → Read → Delete → Verify. Use unique names per test run to avoid collisions.`,
        code: `const { test, expect } = require('@playwright/test');

test('Full CRUD — create, verify, delete, verify gone', async ({ request }) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer mytoken123'
  };
  const uniqueName = \`TestUser_\${Date.now()}\`;  // unique per test run

  // Step 1: CREATE
  const createRes = await request.post('https://api.example.com/api/v1/customers', {
    headers,
    data: { CustomerName: uniqueName, City: 'Chennai', State: 'TN' }
  });
  expect(createRes.status()).toBe(201);
  const { CustomerID } = await createRes.json();

  // Step 2: VERIFY in list
  const listRes = await request.get('https://api.example.com/api/v1/customers', { headers });
  expect(listRes.status()).toBe(200);
  const list = await listRes.json();
  const found = list.find(c => c.CustomerID === CustomerID);
  expect(found).toBeTruthy();
  expect(found.CustomerName).toBe(uniqueName);

  // Step 3: DELETE
  const deleteRes = await request.delete(
    \`https://api.example.com/api/v1/customers/\${CustomerID}\`,
    { headers }
  );
  expect(deleteRes.status()).toBe(204);

  // Step 4: VERIFY gone
  const afterDelete = await request.get(
    \`https://api.example.com/api/v1/customers/\${CustomerID}\`,
    { headers }
  );
  expect(afterDelete.status()).toBe(404);
});`
      },
    ]
  }
];


/* ══════════════════════════════════════
   RENDERER
══════════════════════════════════════ */
function mount() {
  const root = document.getElementById('company-root');
  if (!root) return;

  root.innerHTML = `
    <div class="tab-header co-header">
      <h1>🏢 Company Interview Tracker</h1>
      <p>Real interview questions by company and round. Learn from each experience. Track your R2 preparation.</p>
    </div>
    <div class="co-layout">
      <div class="co-sidebar" id="co-sidebar"></div>
      <div class="co-content" id="co-content"></div>
    </div>`;

  const sidebar = root.querySelector('#co-sidebar');
  const content = root.querySelector('#co-content');

  let activeCompany = 'ltim';
  let activeView = 'tracker'; // 'tracker' or 'prep'

  function statusBadge(s) {
    const map = { cleared:'✅ Cleared', upcoming:'⏳ Upcoming', pending:'🔶 Pending', failed:'❌ Not Selected' };
    return `<span class="co-status co-status-${s}">${map[s]||s}</span>`;
  }

  function renderSidebar() {
    sidebar.innerHTML = COMPANIES.map(c => `
      <div class="co-company-card ${c.id === activeCompany ? 'active' : ''}" data-cid="${c.id}">
        <span class="co-company-logo">${c.logo}</span>
        <div>
          <div class="co-company-name">${c.name}</div>
          <div class="co-company-rounds">${c.rounds.length} round(s)</div>
        </div>
      </div>`).join('') +
      `<div class="co-prep-card ${activeView==='prep'&&activeCompany==='ltim'?'active':''}" data-view="prep">
        <span class="co-company-logo">📚</span>
        <div>
          <div class="co-company-name">LTIM R2 Prep Bank</div>
          <div class="co-company-rounds">100+ Playwright JS Q&A</div>
        </div>
      </div>`;

    sidebar.querySelectorAll('[data-cid]').forEach(card => {
      card.addEventListener('click', () => {
        activeCompany = card.dataset.cid;
        activeView = 'tracker';
        renderSidebar();
        renderContent();
      });
    });
    sidebar.querySelector('[data-view="prep"]').addEventListener('click', () => {
      activeView = 'prep';
      activeCompany = 'ltim';
      renderSidebar();
      renderContent();
    });
  }

  function renderContent() {
    if (activeView === 'prep') {
      renderPrepBank();
      return;
    }
    const company = COMPANIES.find(c => c.id === activeCompany);
    if (!company) return;

    content.innerHTML = `<div class="co-company-header">
      <span class="co-company-logo-lg">${company.logo}</span>
      <div><h2>${company.name}</h2></div>
    </div>` + company.rounds.map((r, ri) => `
      <div class="co-round-card">
        <div class="co-round-header">
          <span class="co-round-title">${r.round}</span>
          ${statusBadge(r.status)}
        </div>
        <div class="co-round-meta">
          <span>📅 ${r.date}</span>
          ${r.duration ? `<span>⏱ ${r.duration}</span>` : ''}
          <span>📋 ${r.format}</span>
        </div>
        <div class="co-round-note">${r.note}</div>
        ${r.questions.length ? r.questions.map((q, qi) => `
          <div class="co-qa-block">
            <div class="co-qa-asked"><b>❓ Asked:</b> ${q.asked}</div>
            <div class="co-qa-my-answer">
              <b>Your R1 Answer:</b>
              <pre class="co-code">${escapeHtml(q.myAnswer)}</pre>
            </div>
            ${q.mistakes && q.mistakes.length ? `
              <div class="co-mistakes">
                <b>🔴 Mistakes:</b>
                <ul>${q.mistakes.map(m => `<li>${m}</li>`).join('')}</ul>
              </div>` : ''}
            <div class="co-correct">
              <b>✅ Correct Version:</b>
              <pre class="co-code">${escapeHtml(q.correctAnswer)}</pre>
            </div>
          </div>`).join('') : `<div class="co-empty">No questions recorded yet.</div>`}
      </div>`).join('');
  }

  function formatScenarioQuestion(qStr) {
    const lines = qStr.split('\n');
    let title = '';
    let url = '';
    let site = '';
    let auth = '';
    let headers = '';
    let requestBody = '';
    let response = '';
    let steps = [];
    let task = '';
    
    let currentSection = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      if (i === 0 && (trimmedLine.toUpperCase().startsWith('SCENARIO') || trimmedLine.toUpperCase().startsWith('Q'))) {
        title = trimmedLine;
        continue;
      }
      
      if (trimmedLine.toLowerCase().startsWith('url:')) {
        url = trimmedLine.substring(4).trim();
        currentSection = '';
        continue;
      }
      if (trimmedLine.toLowerCase().startsWith('site:')) {
        site = trimmedLine.substring(5).trim();
        currentSection = '';
        continue;
      }
      if (trimmedLine.toLowerCase().startsWith('auth:')) {
        auth = trimmedLine.substring(5).trim();
        currentSection = '';
        continue;
      }
      if (trimmedLine.toLowerCase().startsWith('headers:')) {
        headers = trimmedLine.substring(8).trim();
        currentSection = '';
        continue;
      }
      
      if (trimmedLine.toLowerCase().startsWith('request body:') || trimmedLine.toLowerCase().startsWith('request body')) {
        currentSection = 'requestBody';
        continue;
      }
      if (trimmedLine.toLowerCase().startsWith('response (') || 
          trimmedLine.toLowerCase().startsWith('expected response') || 
          trimmedLine.toLowerCase().startsWith('response:') ||
          trimmedLine.toLowerCase().startsWith('the api response')) {
        currentSection = 'response';
        continue;
      }
      if (trimmedLine.toLowerCase().startsWith('steps:')) {
        currentSection = 'steps';
        continue;
      }
      if (trimmedLine.toLowerCase().startsWith('task:')) {
        task = trimmedLine.substring(5).trim();
        currentSection = 'task';
        continue;
      }
      
      if (currentSection === 'requestBody') {
        requestBody += line + '\n';
      } else if (currentSection === 'response') {
        response += line + '\n';
      } else if (currentSection === 'steps') {
        if (trimmedLine) {
          const stepMatch = trimmedLine.match(/^\d+\.\s*(.*)$/);
          if (stepMatch) {
            steps.push(stepMatch[1]);
          } else {
            steps.push(trimmedLine);
          }
        }
      } else if (currentSection === 'task') {
        task += (task ? '\n' : '') + line;
      } else {
        if (trimmedLine) {
          if (!title) title = trimmedLine;
          else task += (task ? '\n' : '') + line;
        }
      }
    }
    
    if (!url && !site && !requestBody && !response && !steps.length && !task) {
      return `<div class="co-q-raw">${qStr}</div>`;
    }
    
    let html = '';
    
    if (title) {
      const titleMatch = title.match(/^(SCENARIO \d+)(?:\s*[\-—:]\s*(.*))?$/i);
      if (titleMatch) {
        const num = titleMatch[1];
        const desc = titleMatch[2] || '';
        html += `<div class="co-q-header">
          <span class="co-q-badge">${num}</span>
          <span class="co-q-title">${desc}</span>
        </div>`;
      } else {
        html += `<div class="co-q-header"><span class="co-q-title">${title}</span></div>`;
      }
    }
    
    if (url || site || auth || headers) {
      html += `<div class="co-q-meta-grid">`;
      
      if (url) {
        const parts = url.split(' ');
        const method = parts[0].toUpperCase();
        const path = parts.slice(1).join(' ');
        
        let methodClass = 'co-method-other';
        if (['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
          methodClass = `co-method-${method.toLowerCase()}`;
        }
        
        html += `<div class="co-meta-row co-endpoint-row">
          <span class="co-meta-label">Endpoint:</span>
          <div class="co-endpoint-val">
            <span class="co-method-badge ${methodClass}">${method}</span>
            <code class="co-path-code">${path}</code>
          </div>
        </div>`;
      } else if (site) {
        html += `<div class="co-meta-row">
          <span class="co-meta-label">Site:</span>
          <span class="co-meta-val"><code class="co-path-code">${site}</code></span>
        </div>`;
      }
      
      if (auth) {
        html += `<div class="co-meta-row">
          <span class="co-meta-label">Auth:</span>
          <span class="co-meta-val"><span class="co-auth-badge">${auth}</span></span>
        </div>`;
      }
      
      if (headers) {
        html += `<div class="co-meta-row">
          <span class="co-meta-label">Headers:</span>
          <span class="co-meta-val"><code class="co-header-code">${headers}</code></span>
        </div>`;
      }
      
      html += `</div>`;
    }
    
    if (requestBody.trim()) {
      html += `<div class="co-q-body-block">
        <div class="co-block-label">Request Body (JSON)</div>
        <pre class="co-q-json-code">${escapeHtml(requestBody.trim())}</pre>
      </div>`;
    }
    
    if (response.trim()) {
      html += `<div class="co-q-body-block">
        <div class="co-block-label">Expected Response (JSON)</div>
        <pre class="co-q-json-code">${escapeHtml(response.trim())}</pre>
      </div>`;
    }
    
    if (steps.length) {
      html += `<div class="co-q-steps-block">
        <div class="co-block-label">Interaction Steps</div>
        <ol class="co-q-steps">
          ${steps.map(step => `<li>${step}</li>`).join('')}
        </ol>
      </div>`;
    }
    
    if (task.trim()) {
      html += `<div class="co-q-task-box">
        <span class="co-task-icon">🎯</span>
        <div class="co-task-desc"><b>Task:</b> ${task.trim().replace(/\n/g, '<br>')}</div>
      </div>`;
    }
    
    return html;
  }

  function renderPrepBank() {
    let html = `<div class="co-prep-header">
      <h2>📚 LTIM R2 Prep Bank — Playwright JS</h2>
      <p>Same interviewer as R1. Expect more coding. Master these patterns.</p>
      <div class="co-prep-search-wrap">
        <input class="co-prep-search" id="co-prep-search" placeholder="🔍 Search questions...">
      </div>
    </div>
    <div id="co-prep-cats">`;

    LTIM_PREP.forEach((cat, ci) => {
      html += `<div class="co-prep-cat">
        <div class="co-prep-cat-header open" data-cat="${ci}">
          ${cat.category} <span class="co-cat-count">(${cat.qs.length} questions)</span> <span class="co-cat-arrow">▲</span>
        </div>
        <div class="co-prep-cat-body" id="co-pb-${ci}">`;
      cat.qs.forEach((qa, qi) => {
        html += `<div class="co-prep-card-qa" data-cat="${ci}" data-qi="${qi}">
          <div class="co-prep-q">
            <div class="co-prep-q-header">
              <span class="co-q-num">Q${qi+1}</span>
              <span class="co-prep-toggle">▼</span>
            </div>
            <div class="co-prep-q-content">${formatScenarioQuestion(qa.q)}</div>
          </div>
          <div class="co-prep-a">
            <div class="co-prep-answer-text">${qa.a}</div>
            ${qa.code ? `<pre class="co-code">${escapeHtml(qa.code)}</pre>` : ''}
          </div>
        </div>`;
      });
      html += `</div></div>`;
    });

    html += `</div>`;
    content.innerHTML = html;

    // Accordion for categories
    content.querySelectorAll('.co-prep-cat-header').forEach(hdr => {
      hdr.addEventListener('click', () => {
        const body = content.querySelector('#co-pb-' + hdr.dataset.cat);
        const isOpen = hdr.classList.toggle('open');
        body.style.display = isOpen ? '' : 'none';
        hdr.querySelector('.co-cat-arrow').textContent = isOpen ? '▲' : '▼';
      });
    });

    // Click to reveal answer (clicking header reveals answer)
    content.querySelectorAll('.co-prep-card-qa').forEach(card => {
      card.querySelector('.co-prep-q-header').addEventListener('click', () => {
        card.classList.toggle('revealed');
        card.querySelector('.co-prep-toggle').textContent = card.classList.contains('revealed') ? '▲' : '▼';
      });
    });

    // Search
    content.querySelector('#co-prep-search').addEventListener('input', e => {
      const term = e.target.value.toLowerCase();
      content.querySelectorAll('.co-prep-card-qa').forEach(card => {
        const text = card.querySelector('.co-prep-q').textContent.toLowerCase();
        card.style.display = !term || text.includes(term) ? '' : 'none';
      });
    });
  }

  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  renderSidebar();
  renderContent();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
else mount();

})();
