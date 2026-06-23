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
  {
    category: "📮 POST API Scenarios",
    qs: [
      {
        q: "SCENARIO 1 (same as R1 — master this first)\nURL: POST /v1/createNewRecord\nAuth: Basic \"123455\"\nHeaders: Content-Type: application/json\nRequest body:\n  { \"CustomerMasterList\": [{ \"CustomerID\": 100, \"CustomerName\": \"Ramaraj\",\n    \"ProofID\": \"X-0001\", \"Address\": \"First Street\", \"City\": \"Chennai\",\n    \"State\": \"TN\", \"BranchCode\": \"TN001\", \"AccountNumber\": 600001 }] }\nResponse (201):\n  { \"CustomerID\": 100, \"UUID\": \"1234-123-123123\",\n    \"CustomerName\": \"Ramaraj\", \"Address\": \"First Street\",\n    \"City\": \"Chennai\", \"State\": \"TN\" }\nTASK: Write the complete Playwright JS test.",
        a: "<b>Key points:</b> JSON.stringify() not Json.stringify() • CustomerMasterList capital L • expect(body) not expect(body.toEqual • UUID is dynamic → use toBeTruthy() or expect.any(String)",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('POST /v1/createNewRecord — 201 and body validation', async ({ request }) => {\n  const response = await request.post('https://api.example.com/v1/createNewRecord', {\n    headers: {\n      'Content-Type': 'application/json',\n      'Authorization': 'Basic 123455'\n    },\n    data: {\n      CustomerMasterList: [{\n        CustomerID: 100,\n        CustomerName: 'Ramaraj',\n        ProofID: 'X-0001',\n        Address: 'First Street',\n        City: 'Chennai',\n        State: 'TN',\n        BranchCode: 'TN001',\n        AccountNumber: 600001\n      }]\n    }\n  });\n\n  expect(response.status()).toBe(201);\n  const body = await response.json();\n\n  expect(body).toMatchObject({\n    CustomerID: 100,\n    CustomerName: 'Ramaraj',\n    Address: 'First Street',\n    City: 'Chennai',\n    State: 'TN'\n  });\n\n  expect(body.UUID).toBeTruthy();\n  expect(typeof body.UUID).toBe('string');\n});"
      },
      {
        q: "SCENARIO 2 — Create an Employee record\nURL: POST /api/v2/employees\nAuth: Bearer token \"eyJhbGciOi...\"\nHeaders: Content-Type: application/json, Accept: application/json\nRequest body:\n  { \"empId\": \"EMP001\", \"name\": \"Priya Sharma\",\n    \"department\": \"Engineering\", \"salary\": 85000, \"joinDate\": \"2026-06-14\" }\nResponse (201):\n  { \"empId\": \"EMP001\", \"name\": \"Priya Sharma\", \"department\": \"Engineering\",\n    \"recordId\": \"auto-generated-uuid\", \"status\": \"ACTIVE\" }\nTASK: Write the complete test. Assert 201, assert name and department, assert recordId is not null.",
        a: "<b>Pattern:</b> Bearer token goes in header as \"Bearer <token>\" • Assert status first, then body • recordId is server-generated → toBeTruthy() • status field should equal \"ACTIVE\"",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('POST /api/v2/employees — create employee and validate response', async ({ request }) => {\n  const response = await request.post('https://api.example.com/api/v2/employees', {\n    headers: {\n      'Content-Type': 'application/json',\n      'Accept': 'application/json',\n      'Authorization': 'Bearer eyJhbGciOi...'\n    },\n    data: {\n      empId: 'EMP001',\n      name: 'Priya Sharma',\n      department: 'Engineering',\n      salary: 85000,\n      joinDate: '2026-06-14'\n    }\n  });\n\n  expect(response.status()).toBe(201);\n  const body = await response.json();\n\n  expect(body.empId).toBe('EMP001');\n  expect(body.name).toBe('Priya Sharma');\n  expect(body.department).toBe('Engineering');\n  expect(body.status).toBe('ACTIVE');\n\n  expect(body.recordId).toBeTruthy();\n  expect(body.recordId).not.toBeNull();\n});"
      },
      {
        q: "SCENARIO 3 — Create Order with nested items array\nURL: POST /api/orders\nAuth: Basic \"admin:password\" (base64 encode it)\nHeaders: Content-Type: application/json\nRequest body:\n  { \"orderId\": \"ORD-500\", \"customerId\": \"CUST-100\",\n    \"items\": [\n      { \"productId\": \"P001\", \"name\": \"Laptop\", \"qty\": 1, \"price\": 75000 },\n      { \"productId\": \"P002\", \"name\": \"Mouse\",  \"qty\": 2, \"price\": 1500  }\n    ],\n    \"totalAmount\": 78000 }\nResponse (201):\n  { \"orderId\": \"ORD-500\", \"status\": \"CONFIRMED\",\n    \"items\": [...], \"invoiceNo\": \"INV-2026-001\", \"totalAmount\": 78000 }\nTASK: Assert 201, orderId, status CONFIRMED, invoiceNo exists, items has 2 elements.",
        a: "<b>Pattern:</b> Nested array in body — check array length with toHaveLength() or check .length • Buffer.from('admin:password').toString('base64') for Basic auth encoding",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('POST /api/orders — create order with multiple items', async ({ request }) => {\n  const credentials = Buffer.from('admin:password').toString('base64');\n\n  const response = await request.post('https://api.example.com/api/orders', {\n    headers: {\n      'Content-Type': 'application/json',\n      'Authorization': `Basic ${credentials}`\n    },\n    data: {\n      orderId: 'ORD-500',\n      customerId: 'CUST-100',\n      items: [\n        { productId: 'P001', name: 'Laptop', qty: 1, price: 75000 },\n        { productId: 'P002', name: 'Mouse',  qty: 2, price: 1500  }\n      ],\n      totalAmount: 78000\n    }\n  });\n\n  expect(response.status()).toBe(201);\n  const body = await response.json();\n\n  expect(body.orderId).toBe('ORD-500');\n  expect(body.status).toBe('CONFIRMED');\n  expect(body.totalAmount).toBe(78000);\n  expect(body.invoiceNo).toBeTruthy();\n  expect(body.items).toHaveLength(2);\n  expect(body.items[0].productId).toBe('P001');\n  expect(body.items[1].name).toBe('Mouse');\n});"
      },
      {
        q: "SCENARIO 4 — Submit a form (Login API)\nURL: POST /api/auth/login\nNo auth header (this IS the auth endpoint)\nHeaders: Content-Type: application/json\nRequest body:\n  { \"username\": \"testuser@ltim.com\", \"password\": \"Test@123\" }\nResponse (200):\n  { \"token\": \"eyJhbGci...\", \"expiresIn\": 3600, \"userId\": \"U-001\", \"role\": \"TESTER\" }\nTASK: Assert 200, token exists and is a string, expiresIn is a number, role equals \"TESTER\".",
        a: "<b>Pattern:</b> Login → 200 not 201 • token is dynamic → check type is string • typeof check for number • This token is then used in all subsequent requests",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('POST /api/auth/login — successful login returns token', async ({ request }) => {\n  const response = await request.post('https://api.example.com/api/auth/login', {\n    headers: { 'Content-Type': 'application/json' },\n    data: {\n      username: 'testuser@ltim.com',\n      password: 'Test@123'\n    }\n  });\n\n  expect(response.status()).toBe(200);\n  const body = await response.json();\n\n  expect(body.token).toBeTruthy();\n  expect(typeof body.token).toBe('string');\n  expect(typeof body.expiresIn).toBe('number');\n  expect(body.expiresIn).toBeGreaterThan(0);\n  expect(body.userId).toBe('U-001');\n  expect(body.role).toBe('TESTER');\n});"
      },
      {
        q: "SCENARIO 5 — POST with query params AND body\nURL: POST /api/v1/products?category=electronics&warehouse=TN001\nAuth: Bearer token\nHeaders: Content-Type: application/json\nRequest body:\n  { \"productId\": \"P-999\", \"name\": \"Keyboard\", \"price\": 2500, \"stock\": 50 }\nResponse (201):\n  { \"productId\": \"P-999\", \"name\": \"Keyboard\", \"price\": 2500,\n    \"category\": \"electronics\", \"warehouse\": \"TN001\", \"createdAt\": \"2026-06-14T10:00:00Z\" }\nTASK: Assert 201, category and warehouse in response match query params, createdAt is truthy.",
        a: "<b>Pattern:</b> Query params go in the URL string directly, OR use params option in request. Assert response reflects the query param values.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('POST /api/v1/products — create product with query params', async ({ request }) => {\n  const response = await request.post(\n    'https://api.example.com/api/v1/products?category=electronics&warehouse=TN001',\n    {\n      headers: {\n        'Content-Type': 'application/json',\n        'Authorization': 'Bearer eyJhbGciOi...'\n      },\n      data: {\n        productId: 'P-999',\n        name: 'Keyboard',\n        price: 2500,\n        stock: 50\n      }\n    }\n  );\n\n  expect(response.status()).toBe(201);\n  const body = await response.json();\n\n  expect(body.productId).toBe('P-999');\n  expect(body.name).toBe('Keyboard');\n  expect(body.price).toBe(2500);\n  expect(body.category).toBe('electronics');\n  expect(body.warehouse).toBe('TN001');\n  expect(body.createdAt).toBeTruthy();\n});"
      },
      {
        q: "SCENARIO 28 — File upload via POST API\nURL: POST /api/v1/users/upload\nAuth: Bearer token\nHeaders: Content-Type: multipart/form-data\nRequest body:\n  file: [Binary image file data]\n  description: \"User Profile Pic\"\nResponse (201):\n  { \"fileId\": \"F-888\", \"fileName\": \"profile.jpg\", \"description\": \"User Profile Pic\", \"uploadedAt\": \"2026-06-14T12:00:00Z\" }\nTASK: Write Playwright test to upload a file from local filesystem 'tests/assets/profile.jpg' using APIRequestContext.",
        a: "<b>Key Point:</b> Use path module to get absolute file path. Use fs.createReadStream or construct multipart object directly inside 'multipart' field in request.post.",
        code: "const { test, expect } = require('@playwright/test');\nconst fs = require('fs');\nconst path = require('path');\n\ntest('POST /api/v1/users/upload — upload profile image', async ({ request }) => {\n  const filePath = path.resolve(__dirname, 'assets/profile.jpg');\n  \n  const response = await request.post('https://api.example.com/api/v1/users/upload', {\n    headers: {\n      'Authorization': 'Bearer eyJhbGciOi...'\n    },\n    multipart: {\n      file: {\n        name: 'profile.jpg',\n        mimeType: 'image/jpeg',\n        buffer: fs.readFileSync(filePath)\n      },\n      description: 'User Profile Pic'\n    }\n  });\n\n  expect(response.status()).toBe(201);\n  const body = await response.json();\n  expect(body.fileId).toBe('F-888');\n  expect(body.fileName).toBe('profile.jpg');\n  expect(body.description).toBe('User Profile Pic');\n  expect(body.uploadedAt).toBeTruthy();\n});"
      },
      {
        q: "SCENARIO 29 — GraphQL Mutation query via POST\nURL: POST /api/graphql\nHeaders: Content-Type: application/json\nRequest body:\n  { \"query\": \"mutation { createProduct(name: \\\"Tablet\\\", price: 15000) { id name price } }\" }\nResponse (200):\n  { \"data\": { \"createProduct\": { \"id\": \"101\", \"name\": \"Tablet\", \"price\": 15000 } } }\nTASK: Write Playwright API test targeting the GraphQL endpoint.",
        a: "<b>Pattern:</b> GraphQL requests are always POST. Send request payload as a standard JSON object containing a 'query' string parameter. Response is 200 OK containing a 'data' block.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('POST /api/graphql — create product via GraphQL mutation', async ({ request }) => {\n  const response = await request.post('https://api.example.com/api/graphql', {\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    data: {\n      query: `\n        mutation CreateNewProduct {\n          createProduct(name: \"Tablet\", price: 15000) {\n            id\n            name\n            price\n          }\n        }\n      `\n    }\n  });\n\n  expect(response.status()).toBe(200);\n  const body = await response.json();\n  expect(body.data.createProduct).toMatchObject({\n    name: 'Tablet',\n    price: 15000\n  });\n  expect(body.data.createProduct.id).toBeTruthy();\n});"
      },
      {
        q: "SCENARIO 30 — Bulk POST request with large array\nURL: POST /api/v1/records/bulk\nAuth: Bearer token\nHeaders: Content-Type: application/json\nRequest body:\n  { \"records\": [ { \"id\": 1, \"val\": \"A\" }, { \"id\": 2, \"val\": \"B\" }, ... ] } // array of 100 items\nResponse (202):\n  { \"jobId\": \"JOB-999\", \"status\": \"QUEUED\", \"processedCount\": 100 }\nTASK: Generate an array of 100 objects programmatically in Javascript and validate 202 status and job status.",
        a: "<b>Pattern:</b> Generate records programmatically using Array.from(). Validate status code 202 (Accepted) and assert jobId details.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('POST /api/v1/records/bulk — submit 100 records in bulk', async ({ request }) => {\n  // Generate 100 records\n  const records = Array.from({ length: 100 }, (_, i) => ({\n    id: i + 1,\n    val: `Value_${i + 1}`\n  }));\n\n  const response = await request.post('https://api.example.com/api/v1/records/bulk', {\n    headers: {\n      'Content-Type': 'application/json',\n      'Authorization': 'Bearer token123'\n    },\n    data: { records }\n  });\n\n  expect(response.status()).toBe(202);\n  const body = await response.json();\n  expect(body.jobId).toBe('JOB-999');\n  expect(body.status).toBe('QUEUED');\n  expect(body.processedCount).toBe(100);\n});"
      },
      {
        q: "SCENARIO 31 — XML payload via POST request\nURL: POST /api/xml-endpoint\nHeaders: Content-Type: application/xml, Accept: application/xml\nRequest body:\n  <User><Name>Abhishek</Name><Role>Admin</Role></User>\nResponse (201):\n  <Response><Status>Success</Status><Id>999</Id></Response>\nTASK: Send an XML request payload and verify the returned XML string contains <Status>Success</Status>.",
        a: "<b>Pattern:</b> Pass XML string directly in 'data' parameter. Read response body using response.text() since response.json() will fail for XML content.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('POST /api/xml-endpoint — XML request/response', async ({ request }) => {\n  const xmlPayload = '<User><Name>Abhishek</Name><Role>Admin</Role></User>';\n\n  const response = await request.post('https://api.example.com/api/xml-endpoint', {\n    headers: {\n      'Content-Type': 'application/xml',\n      'Accept': 'application/xml'\n    },\n    data: xmlPayload\n  });\n\n  expect(response.status()).toBe(201);\n  const responseText = await response.text();\n  expect(responseText).toContain('<Status>Success</Status>');\n  expect(responseText).toContain('<Id>999</Id>');\n});"
      },
      {
        q: "SCENARIO 32 — Idempotency Key header check on POST\nURL: POST /api/v1/payments\nAuth: Bearer token\nHeaders: Content-Type: application/json, Idempotency-Key: \"idemp-key-777\"\nRequest body:\n  { \"amount\": 5000, \"currency\": \"usd\", \"source\": \"tok_visa\" }\nResponse (200):\n  { \"chargeId\": \"CH-12345\", \"amount\": 5000, \"status\": \"succeeded\", \"reused\": false }\nResponse for second request with SAME key (200):\n  { \"chargeId\": \"CH-12345\", \"amount\": 5000, \"status\": \"succeeded\", \"reused\": true }\nTASK: Write a test executing two consecutive identical payments, asserting that the second payment returns reused: true.",
        a: "<b>Pattern:</b> Reuse the same Idempotency-Key header value across both requests. Assert that the second response confirms the key was matched/reused.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('POST /api/v1/payments — verify idempotency key', async ({ request }) => {\n  const idempotencyKey = `idemp-key-${Date.now()}`;\n  const paymentDetails = { amount: 5000, currency: 'usd', source: 'tok_visa' };\n  const headers = {\n    'Content-Type': 'application/json',\n    'Authorization': 'Bearer mytoken',\n    'Idempotency-Key': idempotencyKey\n  };\n\n  // First Request\n  const res1 = await request.post('https://api.example.com/api/v1/payments', { headers, data: paymentDetails });\n  expect(res1.status()).toBe(200);\n  const body1 = await res1.json();\n  expect(body1.reused).toBe(false);\n  const chargeId = body1.chargeId;\n\n  // Second Request (Identical)\n  const res2 = await request.post('https://api.example.com/api/v1/payments', { headers, data: paymentDetails });\n  expect(res2.status()).toBe(200);\n  const body2 = await res2.json();\n  expect(body2.chargeId).toBe(chargeId);\n  expect(body2.reused).toBe(true);\n});"
      },
      {
        q: "SCENARIO 33 — Boundary schema validation (Negative POST)\nURL: POST /api/v1/users\nHeaders: Content-Type: application/json\nRequest body (Invalid empty fields):\n  { \"email\": \"\", \"age\": -5, \"role\": \"INVALID\" }\nResponse (400):\n  { \"error\": \"Bad Request\", \"details\": [ \"email cannot be empty\", \"age must be positive\", \"invalid role type\" ] }\nTASK: Assert 400 status code and verify all three errors in the details array.",
        a: "<b>Pattern:</b> Negative test case — verify schema validator handles invalid values. Assert status 400 and look for specific validation error substrings.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('POST /api/v1/users — boundary validation fails with 400', async ({ request }) => {\n  const response = await request.post('https://api.example.com/api/v1/users', {\n    headers: { 'Content-Type': 'application/json' },\n    data: {\n      email: '',\n      age: -5,\n      role: 'INVALID'\n    }\n  });\n\n  expect(response.status()).toBe(400);\n  const body = await response.json();\n  expect(body.error).toBe('Bad Request');\n  expect(body.details).toContain('email cannot be empty');\n  expect(body.details).toContain('age must be positive');\n  expect(body.details).toContain('invalid role type');\n});"
      },
      {
        q: "SCENARIO 34 — POST subscription with trial period\nURL: POST /api/v1/subscriptions\nAuth: Bearer token\nHeaders: Content-Type: application/json\nRequest body:\n  { \"plan\": \"premium\", \"trialDays\": 14 }\nResponse (201):\n  { \"subId\": \"SUB-101\", \"plan\": \"premium\", \"trialStart\": \"2026-06-14T00:00:00Z\", \"trialEnd\": \"2026-06-28T00:00:00Z\" }\nTASK: Validate that trialEnd is exactly 14 days after trialStart using JS Date parsing.",
        a: "<b>Pattern:</b> Extract date strings from response, parse them using Date.parse(), and assert that the difference in timestamps equals exactly 14 days in milliseconds.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('POST /api/v1/subscriptions — validate trial period duration', async ({ request }) => {\n  const response = await request.post('https://api.example.com/api/v1/subscriptions', {\n    headers: {\n      'Content-Type': 'application/json',\n      'Authorization': 'Bearer sub-token'\n    },\n    data: { plan: 'premium', trialDays: 14 }\n  });\n\n  expect(response.status()).toBe(201);\n  const body = await response.json();\n\n  const startMs = Date.parse(body.trialStart);\n  const endMs = Date.parse(body.trialEnd);\n  const diffDays = (endMs - startMs) / (1000 * 60 * 60 * 24);\n\n  expect(diffDays).toBe(14);\n});"
      },
      {
        q: "SCENARIO 35 — Webhook Signature verification mock\nURL: POST /api/v1/webhooks\nHeaders: Content-Type: application/json, X-Webhook-Signature: \"sha256=abcdefg...\"\nRequest body:\n  { \"event\": \"order.completed\", \"data\": { \"orderId\": \"ORD-123\" } }\nResponse (200):\n  { \"processed\": true }\nTASK: Simulate sending a webhook payload with the proper signature header and verifying the status code is 200.",
        a: "<b>Pattern:</b> Send webhook request with custom signature header. Assert response status is 200 OK and check for success fields.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('POST /api/v1/webhooks — verify signature verification endpoint', async ({ request }) => {\n  const response = await request.post('https://api.example.com/api/v1/webhooks', {\n    headers: {\n      'Content-Type': 'application/json',\n      'X-Webhook-Signature': 'sha256=abcdefg1234567890'\n    },\n    data: {\n      event: 'order.completed',\n      data: { orderId: 'ORD-123' }\n    }\n  });\n\n  expect(response.status()).toBe(200);\n  const body = await response.json();\n  expect(body.processed).toBe(true);\n});"
      },
      {
        q: "SCENARIO 36 — Form URLEncoded post request\nURL: POST /api/v1/registrations\nHeaders: Content-Type: application/x-www-form-urlencoded\nRequest body (form variables):\n  username=tester1&tier=gold&approved=true\nResponse (201):\n  { \"registrationId\": \"R-100\", \"username\": \"tester1\", \"tier\": \"gold\", \"approved\": true }\nTASK: Submit form payload using form option inside request.post and assert status 201.",
        a: "<b>Pattern:</b> Use the 'form' property instead of 'data' inside request.post, which automatically sets the Content-Type header to application/x-www-form-urlencoded.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('POST /api/v1/registrations — submit URL encoded form data', async ({ request }) => {\n  const response = await request.post('https://api.example.com/api/v1/registrations', {\n    form: {\n      username: 'tester1',\n      tier: 'gold',\n      approved: 'true'\n    }\n  });\n\n  expect(response.status()).toBe(201);\n  const body = await response.json();\n  expect(body.registrationId).toBe('R-100');\n  expect(body.username).toBe('tester1');\n  expect(body.tier).toBe('gold');\n  expect(body.approved).toBe(true);\n});"
      },
      {
        q: "SCENARIO 37 — Async job dispatch (202 Accepted)\nURL: POST /api/v1/jobs\nAuth: Bearer token\nRequest body:\n  { \"type\": \"data_export\", \"userId\": \"U-111\" }\nResponse (202):\n  { \"jobId\": \"export-777\", \"status\": \"IN_PROGRESS\", \"statusUrl\": \"/api/v1/jobs/export-777\" }\nTASK: Dispatch job, assert 202 status and extract statusUrl to keep track of execution status.",
        a: "<b>Pattern:</b> Assert 202 Accepted status. Extract 'statusUrl' for polling verification tasks.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('POST /api/v1/jobs — dispatch async export job', async ({ request }) => {\n  const response = await request.post('https://api.example.com/api/v1/jobs', {\n    headers: {\n      'Content-Type': 'application/json',\n      'Authorization': 'Bearer tok123'\n    },\n    data: {\n      type: 'data_export',\n      userId: 'U-111'\n    }\n  });\n\n  expect(response.status()).toBe(202);\n  const body = await response.json();\n  expect(body.jobId).toBe('export-777');\n  expect(body.status).toBe('IN_PROGRESS');\n  expect(body.statusUrl).toBe('/api/v1/jobs/export-777');\n});"
      }
    ]
  },
  {
    category: "📥 GET API Scenarios",
    qs: [
      {
        q: "SCENARIO 6 — GET single record by ID\nURL: GET /api/v1/customers/100\nAuth: Bearer token\nExpected Response (200):\n  { \"CustomerID\": 100, \"CustomerName\": \"Ramaraj\",\n    \"City\": \"Chennai\", \"State\": \"TN\", \"status\": \"ACTIVE\" }\nTASK: Assert 200, CustomerID is 100, status is ACTIVE.",
        a: "<b>Pattern:</b> GET by ID — no request body • Assert exact values on known fields • status field is a string comparison",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('GET /api/v1/customers/100 — fetch customer by ID', async ({ request }) => {\n  const response = await request.get('https://api.example.com/api/v1/customers/100', {\n    headers: {\n      'Authorization': 'Bearer eyJhbGciOi...'\n    }\n  });\n\n  expect(response.status()).toBe(200);\n  const body = await response.json();\n\n  expect(body.CustomerID).toBe(100);\n  expect(body.CustomerName).toBe('Ramaraj');\n  expect(body.City).toBe('Chennai');\n  expect(body.State).toBe('TN');\n  expect(body.status).toBe('ACTIVE');\n});"
      },
      {
        q: "SCENARIO 7 — GET list and validate array\nURL: GET /api/v1/customers?state=TN&status=ACTIVE\nAuth: Bearer token\nExpected Response (200):\n  [ { \"CustomerID\": 100, \"CustomerName\": \"Ramaraj\", \"City\": \"Chennai\", \"State\": \"TN\" },\n    { \"CustomerID\": 101, \"CustomerName\": \"Suresh\",  \"City\": \"Madurai\", \"State\": \"TN\" } ]\nTASK: Assert 200, response is an array, length is 2, first customer ID is 100.",
        a: "<b>Pattern:</b> Array response — check Array.isArray() first • check .length • access elements by index • Every item should have the required fields",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('GET /api/v1/customers — list customers filtered by state', async ({ request }) => {\n  const response = await request.get(\n    'https://api.example.com/api/v1/customers?state=TN&status=ACTIVE',\n    {\n      headers: { 'Authorization': 'Bearer eyJhbGciOi...' }\n    }\n  );\n\n  expect(response.status()).toBe(200);\n  const body = await response.json();\n\n  expect(Array.isArray(body)).toBe(true);\n  expect(body).toHaveLength(2);\n  expect(body[0].CustomerID).toBe(100);\n  expect(body[0].CustomerName).toBe('Ramaraj');\n  expect(body[0].State).toBe('TN');\n\n  body.forEach(customer => {\n    expect(customer.CustomerID).toBeTruthy();\n    expect(customer.State).toBe('TN');\n  });\n});"
      },
      {
        q: "SCENARIO 8 — GET and assert 404 for non-existent record\nURL: GET /api/v1/customers/9999\nAuth: Bearer token\nExpected Response (404):\n  { \"error\": \"Customer not found\", \"code\": \"CUSTOMER_NOT_FOUND\" }\nTASK: Assert 404, error message contains \"not found\", error code is \"CUSTOMER_NOT_FOUND\".",
        a: "<b>Pattern:</b> Negative test — expect 404 not 200 • Assert error body fields • toContain() for partial string match",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('GET /api/v1/customers/9999 — non-existent customer returns 404', async ({ request }) => {\n  const response = await request.get('https://api.example.com/api/v1/customers/9999', {\n    headers: { 'Authorization': 'Bearer eyJhbGciOi...' }\n  });\n\n  expect(response.status()).toBe(404);\n  const body = await response.json();\n\n  expect(body.error).toContain('not found');\n  expect(body.code).toBe('CUSTOMER_NOT_FOUND');\n});"
      },
      {
        q: "SCENARIO 9 — GET with path parameter and multiple query params\nURL: GET /api/v2/reports/monthly?year=2026&month=06&format=json\nAuth: Basic auth\nExpected Response (200):\n  { \"reportId\": \"RPT-2026-06\", \"totalTransactions\": 1540,\n    \"totalRevenue\": 4500000, \"currency\": \"INR\",\n    \"generatedAt\": \"2026-06-14T00:00:00Z\" }\nTASK: Assert 200, totalTransactions is greater than 0, currency is INR, reportId matches pattern RPT-YYYY-MM.",
        a: "<b>Pattern:</b> Query params in URL string • toBeGreaterThan() for numeric assertions • toMatch() with regex for pattern match",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('GET /api/v2/reports/monthly — monthly report generation', async ({ request }) => {\n  const credentials = Buffer.from('admin:password').toString('base64');\n\n  const response = await request.get(\n    'https://api.example.com/api/v2/reports/monthly?year=2026&month=06&format=json',\n    {\n      headers: { 'Authorization': `Basic ${credentials}` }\n    }\n  );\n\n  expect(response.status()).toBe(200);\n  const body = await response.json();\n\n  expect(body.totalTransactions).toBeGreaterThan(0);\n  expect(body.totalRevenue).toBeGreaterThan(0);\n  expect(body.currency).toBe('INR');\n  expect(body.reportId).toMatch(/^RPT-\\d{4}-\\d{2}$/);\n  expect(body.generatedAt).toBeTruthy();\n});"
      },
      {
        q: "SCENARIO 38 — Paginated GET search results\nURL: GET /api/v1/search?q=playwright&page=2&limit=10\nAuth: Bearer token\nExpected Response (200):\n  { \"total\": 45, \"limit\": 10, \"offset\": 10, \"items\": [ {...}, {...} ], \"links\": { \"next\": \"/api/v1/search?q=playwright&page=3&limit=10\", \"prev\": \"/api/v1/search?q=playwright&page=1&limit=10\" } }\nTASK: Write Playwright API test to validate pagination fields and assert items list matches limit length.",
        a: "<b>Key Point:</b> Assert pagination controls and verify page boundaries. Check length of items array is less than or equal to the limit field value.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('GET /api/v1/search — paginated search verification', async ({ request }) => {\n  const response = await request.get('https://api.example.com/api/v1/search?q=playwright&page=2&limit=10', {\n    headers: { 'Authorization': 'Bearer token123' }\n  });\n\n  expect(response.status()).toBe(200);\n  const body = await response.json();\n  \n  expect(body.total).toBe(45);\n  expect(body.limit).toBe(10);\n  expect(body.offset).toBe(10);\n  expect(Array.isArray(body.items)).toBe(true);\n  expect(body.items.length).toBeLessThanOrEqual(10);\n  expect(body.links.next).toContain('page=3');\n  expect(body.links.prev).toContain('page=1');\n});"
      },
      {
        q: "SCENARIO 39 — Conditional GET using ETag headers\nURL: GET /api/v1/configs/global\nHeaders: If-None-Match: \"v2.0.4\"\nExpected Response (304):\n  [No Response Body]\nTASK: Write Playwright test validating 304 Not Modified status when server configuration hasn't changed.",
        a: "<b>Key Point:</b> Verify server returns 304 status when matching ETag is provided in request headers. 304 means client must use cached version.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('GET /api/v1/configs/global — conditional fetch (304)', async ({ request }) => {\n  const response = await request.get('https://api.example.com/api/v1/configs/global', {\n    headers: {\n      'If-None-Match': '\"v2.0.4\"'\n    }\n  });\n\n  expect(response.status()).toBe(304);\n  const bodyText = await response.text();\n  expect(bodyText).toBe('');\n});"
      },
      {
        q: "SCENARIO 40 — GET protected page without Auth header\nURL: GET /api/v1/users/profile\nExpected Response (401):\n  { \"error\": \"Unauthorized\", \"message\": \"Missing credentials\" }\nTASK: Perform negative test case expecting 401 response.",
        a: "<b>Key Point:</b> Send GET request without headers. Assert status code 401 and parse authorization error details.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('GET /api/v1/users/profile — missing credentials returns 401', async ({ request }) => {\n  const response = await request.get('https://api.example.com/api/v1/users/profile');\n\n  expect(response.status()).toBe(401);\n  const body = await response.json();\n  expect(body.error).toBe('Unauthorized');\n  expect(body.message).toBe('Missing credentials');\n});"
      },
      {
        q: "SCENARIO 41 — Download PDF report via GET\nURL: GET /api/v1/reports/pdf/RPT-123\nAuth: Bearer token\nHeaders: Accept: application/pdf\nResponse (200):\n  [Binary PDF document data]\nTASK: Request PDF report, read response as buffer, write to disk 'tests/assets/temp_rpt.pdf', verify file starts with '%PDF-'.",
        a: "<b>Key Point:</b> Read raw response data using response.body() to fetch the binary buffer. Assert PDF file magic bytes.",
        code: "const { test, expect } = require('@playwright/test');\nconst fs = require('fs');\nconst path = require('path');\n\ntest('GET /api/v1/reports/pdf/RPT-123 — download and verify pdf', async ({ request }) => {\n  const response = await request.get('https://api.example.com/api/v1/reports/pdf/RPT-123', {\n    headers: {\n      'Accept': 'application/pdf',\n      'Authorization': 'Bearer token123'\n    }\n  });\n\n  expect(response.status()).toBe(200);\n  const buffer = await response.body();\n  const filePath = path.resolve(__dirname, 'assets/temp_rpt.pdf');\n  fs.writeFileSync(filePath, buffer);\n\n  // Read first 5 chars\n  const fd = fs.openSync(filePath, 'r');\n  const fileHeader = Buffer.alloc(5);\n  fs.readSync(fd, fileHeader, 0, 5, 0);\n  fs.closeSync(fd);\n\n  expect(fileHeader.toString()).toBe('%PDF-');\n});"
      },
      {
        q: "SCENARIO 42 — API Rate Limiting headers check\nURL: GET /api/v1/status\nResponse (429):\n  { \"error\": \"Too Many Requests\" }\nHeaders: Retry-After: \"60\", X-RateLimit-Limit: \"100\"\nTASK: Assert 429 status code and verify Rate Limit headers returned from the server.",
        a: "<b>Key Point:</b> Extract rate limit headers from response using response.headers() and verify Retry-After matches configuration values.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('GET /api/v1/status — verify rate limiting headers', async ({ request }) => {\n  const response = await request.get('https://api.example.com/api/v1/status');\n\n  expect(response.status()).toBe(429);\n  const headers = response.headers();\n  \n  expect(headers['retry-after']).toBe('60');\n  expect(headers['x-ratelimit-limit']).toBe('100');\n  const body = await response.json();\n  expect(body.error).toBe('Too Many Requests');\n});"
      },
      {
        q: "SCENARIO 43 — GET response with deeply nested object arrays\nURL: GET /api/v1/org/departments\nResponse (200):\n  { \"org\": \"LTIM\", \"divisions\": [ { \"name\": \"IT\", \"managers\": [ { \"id\": \"M-1\", \"name\": \"Abhishek\" } ] } ] }\nTASK: Traverse the nested payload to assert manager ID is M-1.",
        a: "<b>Pattern:</b> Parse response JSON and navigate path properties programmatically. Assert specific elements inside the array fields.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('GET /api/v1/org/departments — validate deeply nested manager', async ({ request }) => {\n  const response = await request.get('https://api.example.com/api/v1/org/departments');\n  expect(response.status()).toBe(200);\n  \n  const body = await response.json();\n  const divisions = body.divisions;\n  expect(divisions).toHaveLength(1);\n  \n  const manager = divisions[0].managers[0];\n  expect(manager.id).toBe('M-1');\n  expect(manager.name).toBe('Abhishek');\n});"
      },
      {
        q: "SCENARIO 44 — Assert all array items match status criteria\nURL: GET /api/v1/users/active\nResponse (200):\n  [ { \"id\": 1, \"status\": \"ACTIVE\" }, { \"id\": 2, \"status\": \"ACTIVE\" }, { \"id\": 3, \"status\": \"ACTIVE\" } ]\nTASK: Fetch list and assert every single element contains status ACTIVE.",
        a: "<b>Key Point:</b> Loop through array elements using standard array methods. Execute validation assertions inside the iteration loop.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('GET /api/v1/users/active — verify active user criteria', async ({ request }) => {\n  const response = await request.get('https://api.example.com/api/v1/users/active');\n  expect(response.status()).toBe(200);\n\n  const body = await response.json();\n  expect(body.length).toBeGreaterThan(0);\n\n  body.forEach(user => {\n    expect(user.status).toBe('ACTIVE');\n  });\n});"
      },
      {
        q: "SCENARIO 45 — GET products with price filters\nURL: GET /api/v1/products?minPrice=500&maxPrice=1000\nResponse (200):\n  [ { \"id\": \"P1\", \"price\": 600 }, { \"id\": \"P2\", \"price\": 850 } ]\nTASK: Verify that price value of every item in the filtered response is between 500 and 1000.",
        a: "<b>Key Point:</b> Assert numeric boundaries for each item. Check that price is greater than or equal to 500 and less than or equal to 1000.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('GET /api/v1/products — verify price range filter', async ({ request }) => {\n  const response = await request.get('https://api.example.com/api/v1/products?minPrice=500&maxPrice=1000');\n  expect(response.status()).toBe(200);\n\n  const products = await response.json();\n  expect(products.length).toBeGreaterThan(0);\n\n  products.forEach(p => {\n    expect(p.price).toBeGreaterThanOrEqual(500);\n    expect(p.price).toBeLessThanOrEqual(1000);\n  });\n});"
      }
    ]
  },
  {
    category: "🔄 PUT / PATCH / DELETE Scenarios",
    qs: [
      {
        q: "SCENARIO 10 — PUT to update a record\nURL: PUT /api/v1/customers/100\nAuth: Bearer token\nHeaders: Content-Type: application/json\nRequest body:\n  { \"CustomerName\": \"Ramaraj Updated\", \"City\": \"Coimbatore\", \"State\": \"TN\" }\nResponse (200):\n  { \"CustomerID\": 100, \"CustomerName\": \"Ramaraj Updated\",\n    \"City\": \"Coimbatore\", \"State\": \"TN\", \"updatedAt\": \"2026-06-14T10:00:00Z\" }\nTASK: Assert 200, CustomerName is updated, City is Coimbatore, updatedAt is truthy.",
        a: "<b>Pattern:</b> PUT = full replace • Assert the updated values in response • updatedAt is server-generated timestamp → toBeTruthy()",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('PUT /api/v1/customers/100 — update customer details', async ({ request }) => {\n  const response = await request.put('https://api.example.com/api/v1/customers/100', {\n    headers: {\n      'Content-Type': 'application/json',\n      'Authorization': 'Bearer eyJhbGciOi...'\n    },\n    data: {\n      CustomerName: 'Ramaraj Updated',\n      City: 'Coimbatore',\n      State: 'TN'\n    }\n  });\n\n  expect(response.status()).toBe(200);\n  const body = await response.json();\n\n  expect(body.CustomerID).toBe(100);\n  expect(body.CustomerName).toBe('Ramaraj Updated');\n  expect(body.City).toBe('Coimbatore');\n  expect(body.State).toBe('TN');\n  expect(body.updatedAt).toBeTruthy();\n});"
      },
      {
        q: "SCENARIO 11 — PATCH to partially update a record\nURL: PATCH /api/v1/employees/EMP001\nAuth: Bearer token\nHeaders: Content-Type: application/json\nRequest body (only fields being changed):\n  { \"department\": \"QA Automation\", \"salary\": 92000 }\nResponse (200):\n  { \"empId\": \"EMP001\", \"name\": \"Priya Sharma\",\n    \"department\": \"QA Automation\", \"salary\": 92000, \"status\": \"ACTIVE\" }\nTASK: Assert 200, department changed to QA Automation, salary is 92000, name unchanged.",
        a: "<b>Pattern:</b> PATCH = partial update (only send changed fields) • Assert changed fields AND verify unchanged fields remain intact",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('PATCH /api/v1/employees/EMP001 — partial update department and salary', async ({ request }) => {\n  const response = await request.patch('https://api.example.com/api/v1/employees/EMP001', {\n    headers: {\n      'Content-Type': 'application/json',\n      'Authorization': 'Bearer eyJhbGciOi...'\n    },\n    data: {\n      department: 'QA Automation',\n      salary: 92000\n    }\n  });\n\n  expect(response.status()).toBe(200);\n  const body = await response.json();\n\n  expect(body.department).toBe('QA Automation');\n  expect(body.salary).toBe(92000);\n  expect(body.empId).toBe('EMP001');\n  expect(body.name).toBe('Priya Sharma');\n  expect(body.status).toBe('ACTIVE');\n});"
      },
      {
        q: "SCENARIO 12 — DELETE and verify record is gone\nURL: DELETE /api/v1/customers/100\nAuth: Bearer token\nExpected Response: 204 No Content (empty body)\nThen: GET /api/v1/customers/100 should return 404\nTASK: Assert DELETE returns 204, then GET returns 404.",
        a: "<b>Pattern:</b> DELETE → 204 means no body returned • Follow-up GET proves deletion • This two-step pattern proves end-to-end correctness",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('DELETE /api/v1/customers/100 — delete and verify gone', async ({ request }) => {\n  const headers = { 'Authorization': 'Bearer eyJhbGciOi...' };\n\n  const deleteResponse = await request.delete(\n    'https://api.example.com/api/v1/customers/100',\n    { headers }\n  );\n\n  expect(deleteResponse.status()).toBe(204);\n\n  const getResponse = await request.get(\n    'https://api.example.com/api/v1/customers/100',\n    { headers }\n  );\n\n  expect(getResponse.status()).toBe(404);\n});"
      },
      {
        q: "SCENARIO 46 — Conditional PUT with If-Match headers\nURL: PUT /api/v1/configs/global\nHeaders: If-Match: \"v2.0.4\"\nRequest body:\n  { \"theme\": \"dark\" }\nExpected Response (412):\n  { \"error\": \"Precondition Failed\", \"message\": \"Resource version mismatched\" }\nTASK: Verify that conditional PUT fails with 412 Precondition Failed when version mismatches.",
        a: "<b>Key Point:</b> Use 'If-Match' request header. Assert that 412 status is returned when modifying a stale version of resource.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('PUT /api/v1/configs/global — conditional write failure (412)', async ({ request }) => {\n  const response = await request.put('https://api.example.com/api/v1/configs/global', {\n    headers: {\n      'Content-Type': 'application/json',\n      'If-Match': '\"v2.0.3\"' // stale version\n    },\n    data: { theme: 'dark' }\n  });\n\n  expect(response.status()).toBe(412);\n  const body = await response.json();\n  expect(body.error).toBe('Precondition Failed');\n  expect(body.message).toBe('Resource version mismatched');\n});"
      },
      {
        q: "SCENARIO 47 — PATCH using application/merge-patch+json\nURL: PATCH /api/v1/profile\nHeaders: Content-Type: application/merge-patch+json\nRequest body:\n  { \"details\": null } // null value will remove the field from record\nResponse (200):\n  { \"userId\": \"U-1\", \"name\": \"Abhishek\" } // details field is deleted\nTASK: Execute PATCH request to delete user details using JSON merge patch standard.",
        a: "<b>Key Point:</b> Set the Content-Type explicitly to application/merge-patch+json. Verify that fields passed as null are removed from response.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('PATCH /api/v1/profile — remove field via JSON Merge Patch', async ({ request }) => {\n  const response = await request.patch('https://api.example.com/api/v1/profile', {\n    headers: {\n      'Content-Type': 'application/merge-patch+json',\n      'Authorization': 'Bearer user-token'\n    },\n    data: {\n      details: null // deletes the key on the server\n    }\n  });\n\n  expect(response.status()).toBe(200);\n  const body = await response.json();\n  expect(body).not.toHaveProperty('details');\n  expect(body.userId).toBe('U-1');\n});"
      },
      {
        q: "SCENARIO 48 — Bulk DELETE cascade verification\nURL: DELETE /api/v1/records/bulk\nRequest body:\n  { \"ids\": [ 100, 200 ] }\nResponse (200):\n  { \"deletedCount\": 2, \"cascadeCount\": 8 }\nTASK: Delete parent records, assert 200 status, and verify count of related child records deleted.",
        a: "<b>Pattern:</b> Send array payload to bulk delete endpoint. Verify return statistics and verify count values.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('DELETE /api/v1/records/bulk — delete parent records and verify cascade', async ({ request }) => {\n  const response = await request.delete('https://api.example.com/api/v1/records/bulk', {\n    headers: { 'Content-Type': 'application/json' },\n    data: { ids: [100, 200] }\n  });\n\n  expect(response.status()).toBe(200);\n  const body = await response.json();\n  expect(body.deletedCount).toBe(2);\n  expect(body.cascadeCount).toBe(8);\n});"
      },
      {
        q: "SCENARIO 49 — PUT to restore a soft-deleted resource\nURL: PUT /api/v1/archive/users/100/restore\nResponse (200):\n  { \"userId\": 100, \"isArchived\": false, \"restoredAt\": \"2026-06-14T15:00:00Z\" }\nTASK: Send restore PUT request, assert status 200, and verify isArchived state is false.",
        a: "<b>Pattern:</b> Execute empty PUT request to trigger restoration endpoint. Assert updated boolean properties in response body.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('PUT /api/v1/archive/users/100/restore — restore soft-deleted user', async ({ request }) => {\n  const response = await request.put('https://api.example.com/api/v1/archive/users/100/restore');\n  expect(response.status()).toBe(200);\n  \n  const body = await response.json();\n  expect(body.userId).toBe(100);\n  expect(body.isArchived).toBe(false);\n  expect(body.restoredAt).toBeTruthy();\n});"
      },
      {
        q: "SCENARIO 50 — DELETE restricted resource without admin role\nURL: DELETE /api/v1/system/configs\nAuth: Bearer token (Standard User Role)\nResponse (403):\n  { \"error\": \"Forbidden\", \"message\": \"Admin privileges required\" }\nTASK: Verify that standard user DELETE request fails with 403 Forbidden status code.",
        a: "<b>Key Point:</b> Access restricted API using standard credentials. Assert 403 status code and verify role privilege errors.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('DELETE /api/v1/system/configs — standard user returns 403', async ({ request }) => {\n  const response = await request.delete('https://api.example.com/api/v1/system/configs', {\n    headers: {\n      'Authorization': 'Bearer user-token'\n    }\n  });\n\n  expect(response.status()).toBe(403);\n  const body = await response.json();\n  expect(body.error).toBe('Forbidden');\n  expect(body.message).toBe('Admin privileges required');\n});"
      },
      {
        q: "SCENARIO 51 — PATCH user status toggle\nURL: PATCH /api/v1/users/100/toggle-status\nResponse (200):\n  { \"userId\": 100, \"status\": \"INACTIVE\" }\nResponse on second call (200):\n  { \"userId\": 100, \"status\": \"ACTIVE\" }\nTASK: Execute PATCH request twice in sequence, verifying that the status toggles appropriately.",
        a: "<b>Key Point:</b> Run consecutive PATCH requests to verify the toggling logic works correctly. Assert the status changes between runs.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('PATCH /api/v1/users/100/toggle-status — status toggling', async ({ request }) => {\n  const url = 'https://api.example.com/api/v1/users/100/toggle-status';\n  \n  // Call 1\n  const res1 = await request.patch(url);\n  expect(res1.status()).toBe(200);\n  const body1 = await res1.json();\n  const initialStatus = body1.status;\n\n  // Call 2\n  const res2 = await request.patch(url);\n  expect(res2.status()).toBe(200);\n  const body2 = await res2.json();\n  \n  expect(body2.status).not.toBe(initialStatus);\n});"
      },
      {
        q: "SCENARIO 52 — PUT complex config replacement\nURL: PUT /api/v1/configs/system\nHeaders: Content-Type: application/json\nRequest body:\n  { \"features\": { \"billing\": true, \"chats\": false }, \"retries\": 3 }\nResponse (200):\n  { \"features\": { \"billing\": true, \"chats\": false }, \"retries\": 3, \"lastModified\": \"2026-06-14T12:00:00Z\" }\nTASK: Overwrite system config, validating the entire object replacement in response.",
        a: "<b>Pattern:</b> Execute full config replacement via PUT. Validate nested feature flags and properties in returned object.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('PUT /api/v1/configs/system — replace configuration object', async ({ request }) => {\n  const response = await request.put('https://api.example.com/api/v1/configs/system', {\n    headers: { 'Content-Type': 'application/json' },\n    data: {\n      features: { billing: true, chats: false },\n      retries: 3\n    }\n  });\n\n  expect(response.status()).toBe(200);\n  const body = await response.json();\n  expect(body.features.billing).toBe(true);\n  expect(body.features.chats).toBe(false);\n  expect(body.retries).toBe(3);\n  expect(body.lastModified).toBeTruthy();\n});"
      }
    ]
  },
  {
    category: "🖥️ UI Test Scenarios",
    qs: [
      {
        q: "SCENARIO 13 (same pattern as R1 Q2 — Facebook login)\nURL: https://www.saucedemo.com\nSteps:\n  1. Navigate to the site\n  2. Fill username: standard_user\n  3. Fill password: secret_sauce\n  4. Click the Login button\n  5. Assert URL contains /inventory\n  6. Assert page heading \"Products\" is visible\nTASK: Write the complete Playwright UI test.",
        a: "<b>Key points:</b> Use getByLabel() for inputs or getByPlaceholder() • getByRole('button') for login button • Use expect(page).toHaveURL() for URL • Use expect(locator).toBeVisible() for element",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('Login to SauceDemo and verify Products page', async ({ page }) => {\n  await page.goto('https://www.saucedemo.com');\n\n  await page.getByPlaceholder('Username').fill('standard_user');\n  await page.getByPlaceholder('Password').fill('secret_sauce');\n  await page.getByRole('button', { name: 'Login' }).click();\n\n  await expect(page).toHaveURL(/.*inventory/);\n  await expect(page.getByText('Products')).toBeVisible();\n});"
      },
      {
        q: "SCENARIO 14 — Login, navigate to a page, assert a text\nSite: https://the-internet.herokuapp.com/login\nSteps:\n  1. Navigate to /login\n  2. Fill username: tomsmith\n  3. Fill password: SuperSecretPassword!\n  4. Click Login button\n  5. Assert URL ends in /secure\n  6. Assert text \"You logged into a secure area!\" is visible\n  7. Click Logout\n  8. Assert URL is back to /login\nTASK: Write complete test including logout.",
        a: "<b>Pattern:</b> Full round-trip test — login → assert secure → logout → assert back to login. Use toContain() for URL partial match.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('Login, verify secure area, logout', async ({ page }) => {\n  await page.goto('https://the-internet.herokuapp.com/login');\n\n  await page.getByLabel('Username').fill('tomsmith');\n  await page.getByLabel('Password').fill('SuperSecretPassword!');\n  await page.getByRole('button', { name: 'Login' }).click();\n\n  await expect(page).toHaveURL(/.*\\/secure/);\n  await expect(page.getByText('You logged into a secure area!')).toBeVisible();\n\n  await page.getByRole('link', { name: 'Logout' }).click();\n\n  await expect(page).toHaveURL(/.*\\/login/);\n  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();\n});"
      },
      {
        q: "SCENARIO 15 — Fill a form with multiple field types\nSite: any form page\nFields:\n  - Text input: Full Name → \"Abhishek Srivastava\"\n  - Email input: Email → \"abhishek@ltim.com\"\n  - Dropdown <select>: Department → \"Engineering\"\n  - Checkbox: \"I agree to terms\" → check it\n  - Submit button: click\nExpected: Success message \"Form submitted successfully\" appears\nTASK: Write the complete Playwright test.",
        a: "<b>Pattern:</b> Multiple input types in one test • selectOption() for dropdowns • check() for checkboxes • Assert success message after submit",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('Submit multi-field form', async ({ page }) => {\n  await page.goto('https://example.com/register');\n\n  await page.getByLabel('Full Name').fill('Abhishek Srivastava');\n  await page.getByLabel('Email').fill('abhishek@ltim.com');\n  await page.getByLabel('Department').selectOption('Engineering');\n  await page.getByLabel('I agree to terms').check();\n\n  await expect(page.getByLabel('I agree to terms')).toBeChecked();\n\n  await page.getByRole('button', { name: 'Submit' }).click();\n  await expect(page.getByText('Form submitted successfully')).toBeVisible();\n});"
      },
      {
        q: "SCENARIO 16 — Search, assert results, click result, verify detail page\nSteps:\n  1. Go to https://example-shop.com\n  2. Find the search bar (placeholder: \"Search products...\")\n  3. Type \"Laptop\"\n  4. Press Enter or click Search button\n  5. Assert at least one result card appears\n  6. Click the first result\n  7. Assert product detail page title contains \"Laptop\"\nTASK: Write the test.",
        a: "<b>Pattern:</b> Search flow — fill → trigger → assert results list → click first → assert detail page. Use .first() to get first element in a list.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('Search for Laptop and view product detail', async ({ page }) => {\n  await page.goto('https://example-shop.com');\n\n  await page.getByPlaceholder('Search products...').fill('Laptop');\n  await page.getByRole('button', { name: 'Search' }).click();\n\n  const results = page.getByTestId('product-card');\n  await expect(results.first()).toBeVisible();\n\n  await results.first().click();\n\n  await expect(page).toHaveURL(/.*product.*/);\n  await expect(page.getByRole('heading').first()).toContainText('Laptop');\n});"
      },
      {
        q: "SCENARIO 17 — Assert a table has specific data\nSteps:\n  1. Navigate to https://example.com/customers\n  2. A table loads with columns: ID, Name, City, Status\n  3. Assert the table has at least 1 row (not counting header)\n  4. Assert \"Ramaraj\" appears somewhere in the table\n  5. Assert the row containing \"Ramaraj\" also shows \"Chennai\"\n  6. Assert a row with status \"ACTIVE\" exists\nTASK: Write the assertions.",
        a: "<b>Pattern:</b> Table assertions — getByRole('row') • nth(1) skips header • filter() to find a row by text • Check cell within a row using chaining",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('Customers table shows Ramaraj from Chennai', async ({ page }) => {\n  await page.goto('https://example.com/customers');\n\n  await expect(page.getByRole('table')).toBeVisible();\n\n  const rows = page.getByRole('row');\n  const count = await rows.count();\n  expect(count).toBeGreaterThan(1);\n\n  await expect(page.getByRole('cell', { name: 'Ramaraj' })).toBeVisible();\n\n  const ramarajRow = page.getByRole('row').filter({ hasText: 'Ramaraj' });\n  await expect(ramarajRow).toContainText('Chennai');\n\n  await expect(page.getByRole('row').filter({ hasText: 'ACTIVE' }).first()).toBeVisible();\n});"
      },
      {
        q: "SCENARIO 53 — Autocomplete dropdown search selection\nSite: https://example.com/search-places\nSteps:\n  1. Click inside input field (placeholder: \"Where are you going?\")\n  2. Type \"Chen\"\n  3. Wait for autocomplete suggestions dropdown list to appear\n  4. Select and click option \"Chennai, Tamil Nadu\"\n  5. Verify that input field contains selected text\nTASK: Handle dynamic autocomplete lists.",
        a: "<b>Pattern:</b> Dynamic loading lists — type search term, locate list overlay container, filter and click target option by text value.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('Autocomplete dropdown — select Chennai', async ({ page }) => {\n  await page.goto('https://example.com/search-places');\n\n  const searchInput = page.getByPlaceholder('Where are you going?');\n  await searchInput.fill('Chen');\n\n  const suggestions = page.locator('.autocomplete-suggestions');\n  await expect(suggestions).toBeVisible();\n\n  await suggestions.getByText('Chennai, Tamil Nadu').click();\n  await expect(searchInput).toHaveValue('Chennai, Tamil Nadu');\n});"
      },
      {
        q: "SCENARIO 54 — Handling dialog popups (Alert, Confirm, Prompt)\nSite: https://example.com/alerts\nSteps:\n  1. Trigger dynamic JavaScript confirm dialog by clicking button \"Show Confirm\"\n  2. Accept/Confirm the dialog popup dynamically\n  3. Verify message is displayed: \"You clicked OK\"\nTASK: Write Playwright test registering dialog handler before clicking button.",
        a: "<b>Key Point:</b> Register context dialog listener using page.on('dialog') before triggering dialog button, then execute dialog.accept() or dialog.dismiss().",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('UI Alerts — accept javascript confirm dialog', async ({ page }) => {\n  await page.goto('https://example.com/alerts');\n\n  // Register dialog handler\n  page.on('dialog', async dialog => {\n    expect(dialog.type()).toBe('confirm');\n    expect(dialog.message()).toBe('Are you sure you want to proceed?');\n    await dialog.accept();\n  });\n\n  await page.getByRole('button', { name: 'Show Confirm' }).click();\n  await expect(page.locator('#result')).toHaveText('You clicked OK');\n});"
      },
      {
        q: "SCENARIO 55 — Interacting with iFrames\nSite: https://example.com/frames\nSteps:\n  1. Locate the frame element with name \"frame-input\"\n  2. Fill text input inside the frame: name \"username\" → \"Abhishek\"\n  3. Click button inside frame: \"Verify\"\nTASK: Access elements inside iFrame and fill form fields.",
        a: "<b>Key Point:</b> Use page.frameLocator() with matching selector to scope interactions inside target iFrame context.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('UI Frames — fill input inside iframe', async ({ page }) => {\n  await page.goto('https://example.com/frames');\n\n  // Scope locator inside frame\n  const myFrame = page.frameLocator('iframe[name=\"frame-input\"]');\n  await myFrame.locator('#username').fill('Abhishek');\n  await myFrame.getByRole('button', { name: 'Verify' }).click();\n\n  await expect(myFrame.locator('#status')).toHaveText('Verified');\n});"
      },
      {
        q: "SCENARIO 56 — Handling multiple tabs / child windows\nSite: https://example.com/tab-navigation\nSteps:\n  1. Click external link containing target=\"_blank\"\n  2. Wait for child tab window to open\n  3. Switch to child context and verify page URL contains \"/terms\"\n  4. Assert page heading \"Terms of Service\" is visible in new window\nTASK: Capture and interact with secondary browser pages.",
        a: "<b>Key Point:</b> Use context.waitForEvent('page') while triggering the navigation button, to capture child page reference.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('UI Tab — navigate to Terms page on new tab', async ({ page, context }) => {\n  await page.goto('https://example.com/tab-navigation');\n\n  // Trigger link click and wait for new tab context\n  const [newTab] = await Promise.all([\n    context.waitForEvent('page'),\n    page.getByRole('link', { name: 'Read Terms' }).click()\n  ]);\n\n  await newTab.waitForLoadState();\n  await expect(newTab).toHaveURL(/.*\\/terms/);\n  await expect(newTab.getByRole('heading', { name: 'Terms of Service' })).toBeVisible();\n});"
      },
      {
        q: "SCENARIO 57 — Drag and Drop elements in UI\nSite: https://example.com/dragdrop\nSteps:\n  1. Identify source draggable box (id: \"draggable-box\")\n  2. Identify target dropzone element (id: \"drop-target\")\n  3. Perform drag action to drop the box inside target dropzone\n  4. Assert target dropzone text contains \"Dropped!\"\nTASK: Simulate drag and drop events in Playwright.",
        a: "<b>Key Point:</b> Use locator.dragTo() helper function to drag source element directly to matching target element destination.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('UI DragDrop — drag element into dropzone', async ({ page }) => {\n  await page.goto('https://example.com/dragdrop');\n\n  const source = page.locator('#draggable-box');\n  const target = page.locator('#drop-target');\n\n  // Perform drag and drop\n  await source.dragTo(target);\n\n  await expect(target).toHaveText('Dropped!');\n});"
      },
      {
        q: "SCENARIO 58 — Wait for dynamic hidden elements\nSite: https://example.com/loading-spinner\nSteps:\n  1. Click button \"Load Data\"\n  2. Page displays loading spinner spinner-overlay\n  3. Wait for spinner-overlay to disappear/hide from DOM\n  4. Assert results section displays heading \"Data Loaded\"\nTASK: Wait for elements to disappear using auto-waiting capabilities.",
        a: "<b>Key Point:</b> Use expect(locator).toBeHidden() which automatically polls until the loading spinner element is detached or hidden.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('UI Wait — wait for loading spinner to hide', async ({ page }) => {\n  await page.goto('https://example.com/loading-spinner');\n\n  await page.getByRole('button', { name: 'Load Data' }).click();\n\n  // Wait for loading spinner to hide\n  const spinner = page.locator('#spinner-overlay');\n  await expect(spinner).toBeHidden({ timeout: 10000 });\n\n  await expect(page.locator('#results-heading')).toHaveText('Data Loaded');\n});"
      },
      {
        q: "SCENARIO 59 — Mouse Hover hover menus interactions\nSite: https://example.com/nav-menu\nSteps:\n  1. Locate parent dropdown link \"Resources\"\n  2. Hover mouse cursor over \"Resources\" dropdown to trigger menu display\n  3. Submenu panel displays secondary links list\n  4. Click link \"API Documentation\"\n  5. Assert page redirected to page URL \"/docs/api\"\nTASK: Hover over UI elements to trigger menu displays.",
        a: "<b>Key Point:</b> Use locator.hover() to position mouse pointer over parent dropdown before executing click triggers on submenus.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('UI Hover — click link inside hover menu', async ({ page }) => {\n  await page.goto('https://example.com/nav-menu');\n\n  // Hover to reveal dropdown menu\n  await page.getByRole('button', { name: 'Resources' }).hover();\n\n  // Click sub-element\n  await page.getByRole('link', { name: 'API Documentation' }).click();\n\n  await expect(page).toHaveURL(/.*\\/docs\\/api/);\n});"
      },
      {
        q: "SCENARIO 60 — File upload UI verification\nSite: https://example.com/upload\nSteps:\n  1. Find file input field (id: \"file-chooser\")\n  2. Upload local dummy PDF document file 'tests/assets/dummy.pdf'\n  3. Assert file upload name displayed: \"dummy.pdf\"\nTASK: Verify file upload interaction in Playwright UI tests.",
        a: "<b>Key Point:</b> Use locator.setInputFiles() to attach file assets directly to input elements inside testing suite.",
        code: "const { test, expect } = require('@playwright/test');\nconst path = require('path');\n\ntest('UI Upload — upload document file', async ({ page }) => {\n  await page.goto('https://example.com/upload');\n\n  const fileInput = page.locator('#file-chooser');\n  const targetFilePath = path.resolve(__dirname, 'assets/dummy.pdf');\n\n  // Set uploaded files\n  await fileInput.setInputFiles(targetFilePath);\n\n  await expect(page.locator('#file-name')).toHaveText('dummy.pdf');\n});"
      },
      {
        q: "SCENARIO 61 — Check multiple checkbox states\nSite: https://example.com/checkboxes\nSteps:\n  1. Identify group of three newsletter checkboxes\n  2. Check all checkboxes that are currently unchecked\n  3. Assert that all three checkboxes are checked\nTASK: Handle multiple checkbox elements programmatically.",
        a: "<b>Pattern:</b> Locate checkboxes using locators, loop through them, evaluate if they are checked using toBeChecked(), and call check() on missing states.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('UI Checkbox — check all checkboxes', async ({ page }) => {\n  await page.goto('https://example.com/checkboxes');\n\n  const checkboxes = page.locator('input[type=\"checkbox\"]');\n  const count = await checkboxes.count();\n\n  for (let i = 0; i < count; i++) {\n    const box = checkboxes.nth(i);\n    if (!(await box.isChecked())) {\n      await box.check();\n    }\n  }\n\n  // Verify all checked\n  for (let i = 0; i < count; i++) {\n    await expect(checkboxes.nth(i)).toBeChecked();\n  }\n});"
      },
      {
        q: "SCENARIO 62 — Radio button selection\nSite: https://example.com/radio-buttons\nSteps:\n  1. Locate group of shipping tier options\n  2. Select option label containing \"Express Delivery\"\n  3. Assert radio choice status is selected\nTASK: Select radio option and assert checked status.",
        a: "<b>Pattern:</b> Use getByLabel() to identify option input label text and trigger check() action to update selection.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('UI Radio — select express shipping tier option', async ({ page }) => {\n  await page.goto('https://example.com/radio-buttons');\n\n  const expressOption = page.getByLabel('Express Delivery');\n  await expressOption.check();\n\n  await expect(expressOption).toBeChecked();\n});"
      },
      {
        q: "SCENARIO 63 — Date Picker interaction\nSite: https://example.com/calendar\nSteps:\n  1. Click date picker input field (id: \"checkout-date\")\n  2. Date panel overlay opens\n  3. Navigate to next month and select day \"25\"\n  4. Verify input field displays selected date value\nTASK: Select date cell from dynamic calendars.",
        a: "<b>Pattern:</b> Instead of clicking dates on complex widget grids, evaluate if the input allows typing. If not, hover, click header controls, and filter cells by exact cell content text.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('UI DatePicker — select date from calendar', async ({ page }) => {\n  await page.goto('https://example.com/calendar');\n\n  await page.locator('#checkout-date').click();\n  \n  // Click Next Month control\n  await page.getByRole('button', { name: 'Next Month' }).click();\n\n  // Click date 25 grid cell\n  await page.getByRole('gridcell', { name: '25' }).click();\n\n  await expect(page.locator('#checkout-date')).not.toHaveValue('');\n});"
      },
      {
        q: "SCENARIO 64 — Accessing Shadow DOM elements\nSite: https://example.com/shadow-roots\nSteps:\n  1. Find target settings button placed deep inside dynamic custom components\n  2. Component is inside nested shadow root boundary: <settings-widget> -> shadow-root -> <button id=\"save-settings\">\n  3. Click \"Save Settings\" button\nTASK: Retrieve and interact with buttons inside shadow DOM structures.",
        a: "<b>Key Point:</b> Playwright traverses shadow DOM boundaries automatically with default locators. Standard locator rules apply without custom pierce queries.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('UI ShadowDOM — access button inside shadow root', async ({ page }) => {\n  await page.goto('https://example.com/shadow-roots');\n\n  // Playwright automatically pierces shadow root boundaries\n  const saveBtn = page.locator('settings-widget button#save-settings');\n  await saveBtn.click();\n\n  await expect(page.locator('#status-msg')).toHaveText('Settings Saved');\n});"
      },
      {
        q: "SCENARIO 65 — Infinite scroll simulator\nSite: https://example.com/news-feed\nSteps:\n  1. Navigate to page containing lists\n  2. Scroll page container bottom threshold dynamically\n  3. Wait for new elements lists to append (more news items load)\n  4. Repeat scroll 3 times, verify list count grows from 10 to 40\nTASK: Simulate infinite scrolling behavior in UI testing.",
        a: "<b>Pattern:</b> Execute window.scrollTo() code inside page.evaluate() inside a loop. Assert list size count grows after each scroll step.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('UI Scroll — verify infinite scroll list expansion', async ({ page }) => {\n  await page.goto('https://example.com/news-feed');\n\n  const listItems = page.locator('.news-item');\n  await expect(listItems).toHaveCount(10);\n\n  for (let i = 0; i < 3; i++) {\n    // Scroll to bottom\n    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));\n    \n    // Wait for mock API response / load timer\n    await page.waitForTimeout(1000);\n  }\n\n  await expect(listItems).toHaveCount(40);\n});"
      },
      {
        q: "SCENARIO 66 — Verify Hover Tooltip display\nSite: https://example.com/info-badge\nSteps:\n  1. Identify help information badge (class: \"info-icon\")\n  2. Hover mouse cursor on top of info icon\n  3. Tooltip text box element (class: \"tooltip-box\") displays description\n  4. Assert tooltip text: \"Security credentials required\"\nTASK: Assert visibility of hover tooltip boxes.",
        a: "<b>Key Point:</b> Trigger tooltip visibility using locator.hover(), then assert tooltip display is visible and verify text details.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('UI Tooltip — verify tooltip matches instructions', async ({ page }) => {\n  await page.goto('https://example.com/info-badge');\n\n  const badge = page.locator('.info-icon');\n  await badge.hover();\n\n  const tooltip = page.locator('.tooltip-box');\n  await expect(tooltip).toBeVisible();\n  await expect(tooltip).toHaveText('Security credentials required');\n});"
      },
      {
        q: "SCENARIO 67 — Validate toggle element states\nSite: https://example.com/toggles\nSteps:\n  1. Toggle button \"Advanced Config\"\n  2. Target options panel \"advanced-options\" shows\n  3. Click button again to hide panel\n  4. Assert options panel becomes detached / hidden from UI\nTASK: Check element presence and visibility changes.",
        a: "<b>Key Point:</b> Use expect(locator).toBeVisible() and expect(locator).toBeHidden() to verify container rendering transitions.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('UI Toggle — show and hide advanced panel', async ({ page }) => {\n  await page.goto('https://example.com/toggles');\n\n  const toggleBtn = page.getByRole('button', { name: 'Advanced Config' });\n  const optionsPanel = page.locator('#advanced-options');\n\n  // Show\n  await toggleBtn.click();\n  await expect(optionsPanel).toBeVisible();\n\n  // Hide\n  await toggleBtn.click();\n  await expect(optionsPanel).toBeHidden();\n});"
      }
    ]
  },
  {
    category: "✅ Assertion Scenarios",
    qs: [
      {
        q: "SCENARIO 18 — Response body has a field that could be null\nThe API response for a new customer:\n  { \"CustomerID\": 100, \"CustomerName\": \"Ramaraj\", \"middleName\": null, \"email\": \"raj@test.com\" }\nTASK: Write assertions for all four fields. middleName can be null — how do you handle that?",
        a: "<b>Pattern:</b> toBeNull() for null • toBeDefined() checks field exists even if null • toBeTruthy() would FAIL for null — don't use it when null is valid",
        code: "const body = await response.json();\n\nexpect(body.CustomerID).toBe(100);\nexpect(body.CustomerName).toBe('Ramaraj');\n\n// middleName can be null — assert it exists as a field but is null\nexpect(body.middleName).toBeNull();\n// OR: just verify the key exists\nexpect(body).toHaveProperty('middleName');\n\nexpect(body.email).toBe('raj@test.com');\nexpect(body.email).toContain('@');"
      },
      {
        q: "SCENARIO 19 — Assert a number is within a valid range\nResponse:\n  { \"score\": 87, \"grade\": \"B\", \"percentile\": 92.5 }\nTASK: Assert score is between 80 and 100, percentile is greater than 90, grade is exactly \"B\".",
        a: "<b>Pattern:</b> toBeGreaterThanOrEqual() and toBeLessThanOrEqual() for ranges • toBeGreaterThan() for minimum • exact string with toBe()",
        code: "const body = await response.json();\n\nexpect(body.score).toBeGreaterThanOrEqual(80);\nexpect(body.score).toBeLessThanOrEqual(100);\n\nexpect(body.percentile).toBeGreaterThan(90);\n\nexpect(body.grade).toBe('B');"
      },
      {
        q: "SCENARIO 20 — Assert a list contains specific items\nResponse:\n  { \"userId\": \"U-001\", \"permissions\": [\"READ\", \"WRITE\", \"EXPORT\"],\n    \"tags\": [\"premium\", \"verified\"] }\nTASK: Assert permissions contains READ and WRITE, does NOT contain DELETE, tags has 2 items.",
        a: "<b>Pattern:</b> toContain() for arrays (single item check) • not.toContain() for absence • toHaveLength() for count",
        code: "const body = await response.json();\n\nexpect(body.permissions).toContain('READ');\nexpect(body.permissions).toContain('WRITE');\nexpect(body.permissions).not.toContain('DELETE');\n\nexpect(body.tags).toHaveLength(2);\nexpect(body.tags).toContain('premium');"
      },
      {
        q: "SCENARIO 21 — Assert the response body partially matches (more fields than expected)\nThe API returns a large customer object with 20 fields.\nYou only care about: CustomerID=100, State=\"TN\", status=\"ACTIVE\"\nTASK: What assertion allows you to check just those 3 fields without listing all 20?",
        a: "<b>Answer: toMatchObject() — checks that the specified keys match, ignores all other fields in the response.</b> This is what you should use when response has more fields than you want to assert.",
        code: "const body = await response.json();\n\nexpect(body).toMatchObject({\n  CustomerID: 100,\n  State: 'TN',\n  status: 'ACTIVE'\n});"
      },
      {
        q: "SCENARIO 22 — Assert a UI element has specific text content\nAfter login, the navbar should show \"Welcome, Abhishek\"\nThe profile icon badge should show \"A\" (first letter of name)\nThe page title should contain \"Dashboard\"\nTASK: Write all three assertions.",
        a: "<b>Pattern:</b> toHaveText() for exact • toContainText() for partial • toHaveTitle() for page title",
        code: "await expect(page.getByTestId('welcome-message')).toHaveText('Welcome, Abhishek');\nawait expect(page.getByRole('navigation')).toContainText('Abhishek');\nawait expect(page.getByTestId('profile-badge')).toHaveText('A');\n\nawait expect(page).toHaveTitle(/Dashboard/);\n// OR\nawait expect(page).toHaveTitle('My App - Dashboard');"
      },
      {
        q: "SCENARIO 23 — Assert that an error message appears on bad login\nSite: https://www.saucedemo.com\nSteps:\n  1. Enter username: wrong_user\n  2. Enter password: wrong_pass\n  3. Click login\n  4. Assert: error message is visible\n  5. Assert: error contains \"Username and password do not match\"\n  6. Assert: you are still on /login (no redirect)\nTASK: Write the negative test.",
        a: "<b>Pattern:</b> Negative test — use wrong credentials, assert error not success. toHaveURL() ensures no redirect happened.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('Invalid login shows error message', async ({ page }) => {\n  await page.goto('https://www.saucedemo.com');\n\n  await page.getByPlaceholder('Username').fill('wrong_user');\n  await page.getByPlaceholder('Password').fill('wrong_pass');\n  await page.getByRole('button', { name: 'Login' }).click();\n\n  const error = page.locator('[data-test=\"error\"]');\n  await expect(error).toBeVisible();\n  await expect(error).toContainText('Username and password do not match');\n\n  await expect(page).toHaveURL('https://www.saucedemo.com/');\n});"
      },
      {
        q: "SCENARIO 24 — Assert multiple fields simultaneously using soft assertions\nAfter a form submit response, you need to check 5 fields.\nIf you use regular expect() and field 2 fails, fields 3-5 are never checked.\nTASK: How do you run ALL 5 assertions and get all failures in one go?",
        a: "<b>Answer: Soft assertions.</b> expect.soft() collects all failures and reports them all at end of test, instead of stopping at the first failure.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('POST response — check all fields with soft assertions', async ({ request }) => {\n  const response = await request.post('/api/customers', { data: { name: 'Test' } });\n  const body = await response.json();\n\n  expect.soft(response.status()).toBe(201);\n  expect.soft(body.CustomerID).toBeTruthy();\n  expect.soft(body.CustomerName).toBe('Test');\n  expect.soft(body.status).toBe('ACTIVE');\n  expect.soft(body.UUID).toBeTruthy();\n});"
      },
      {
        q: "SCENARIO 68 — Polling assertions for slow background tasks\nThe database process takes up to 8 seconds to synchronize.\nYou need to poll the API state until status becomes \"COMPLETED\" or timeout is reached.\nTASK: Write a polling assertion using expect.poll() to avoid raw loop polling blocks.",
        a: "<b>Key Point:</b> Use expect.poll() which automatically retries a custom evaluation function until it returns a matching result.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('Polling — wait for background job completion', async ({ request }) => {\n  const jobId = 'JOB-777';\n\n  // Poll until response status is COMPLETED\n  await expect.poll(async () => {\n    const response = await request.get(`https://api.example.com/api/v1/jobs/${jobId}`);\n    const body = await response.json();\n    return body.status;\n  }, {\n    message: 'Job status did not become COMPLETED in time',\n    intervals: [1000, 2000], // custom backoff intervals\n    timeout: 10000          // total wait timeout\n  }).toBe('COMPLETED');\n});"
      },
      {
        q: "SCENARIO 69 — Assert UI element state (Disabled vs Readonly)\nSite: https://example.com/checkout\nSteps:\n  1. Locate voucher code input box (id: \"coupon-input\")\n  2. Locate payment submission button (id: \"pay-btn\")\n  3. Validate input field has 'readonly' attribute\n  4. Validate payment button is disabled\nTASK: Write assertions verifying element states.",
        a: "<b>Key Point:</b> Use toBeDisabled() to check element disabled state. Use toHaveAttribute() to check general HTML attributes.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('UI Assert — verify input readonly and button disabled', async ({ page }) => {\n  await page.goto('https://example.com/checkout');\n\n  const couponInput = page.locator('#coupon-input');\n  const payBtn = page.locator('#pay-btn');\n\n  // Assert readonly attribute\n  await expect(couponInput).toHaveAttribute('readonly', '');\n\n  // Assert button is disabled\n  await expect(payBtn).toBeDisabled();\n});"
      },
      {
        q: "SCENARIO 70 — Verify element styling and CSS classes\nSite: https://example.com/dashboard\nSteps:\n  1. Identify sidebar container (id: \"sidebar\")\n  2. Assert element has CSS class \"collapsed\"\n  3. Assert element CSS property \"width\" equals \"80px\"\nTASK: Write assertions evaluating CSS classes and properties.",
        a: "<b>Key Point:</b> Use toHaveClass() for class verification. Use toHaveCSS() for testing specific styling property values.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('UI Assert — verify sidebar styles', async ({ page }) => {\n  await page.goto('https://example.com/dashboard');\n\n  const sidebar = page.locator('#sidebar');\n\n  // Check CSS class\n  await expect(sidebar).toHaveClass(/.*collapsed.*/);\n\n  // Check inline or computed CSS property\n  await expect(sidebar).toHaveCSS('width', '80px');\n});"
      },
      {
        q: "SCENARIO 71 — Checkbox checked state assertion\nSite: https://example.com/settings\nSteps:\n  1. Locate dark mode switch checkbox (id: \"dark-mode-toggle\")\n  2. Verify if the checkbox is checked by default\nTASK: Write assertion verifying input checkbox element checked state.",
        a: "<b>Key Point:</b> Use toBeChecked() which automatically resolves if checkbox or radio input element is active/checked.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('UI Assert — verify dark mode checked state', async ({ page }) => {\n  await page.goto('https://example.com/settings');\n\n  const toggle = page.locator('#dark-mode-toggle');\n  \n  // Assert checkbox is checked\n  await expect(toggle).toBeChecked();\n});"
      },
      {
        q: "SCENARIO 72 — Retrying assertions with custom timeouts\nSite: https://example.com/slow-modal\nSteps:\n  1. Click button \"Load Settings\"\n  2. Dialog overlay dialog-box pops up after 8 seconds\n  3. Validate dialog is visible\nTASK: Verify dialog visible setting custom timeout for long-loading components.",
        a: "<b>Key Point:</b> Pass options containing timeout parameters (e.g. { timeout: 10000 }) directly inside locator assertions.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('UI Assert — verify modal load with custom timeout', async ({ page }) => {\n  await page.goto('https://example.com/slow-modal');\n\n  await page.getByRole('button', { name: 'Load Settings' }).click();\n\n  const modal = page.locator('#dialog-box');\n  // Override default 5s timeout to 10s\n  await expect(modal).toBeVisible({ timeout: 10000 });\n});"
      },
      {
        q: "SCENARIO 73 — Assert page list elements count\nSite: https://example.com/inventory\nSteps:\n  1. Locate items on the page matching list items: class \"inventory-item\"\n  2. Assert page displays exactly 6 products\nTASK: Assert the count of matching items on the screen.",
        a: "<b>Key Point:</b> Use toHaveCount() to verify the exact number of matching elements retrieved by locator.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('UI Assert — verify items count', async ({ page }) => {\n  await page.goto('https://example.com/inventory');\n\n  const items = page.locator('.inventory-item');\n  \n  // Assert exactly 6 elements exist\n  await expect(items).toHaveCount(6);\n});"
      },
      {
        q: "SCENARIO 74 — Visual Regression screenshot matching\nSite: https://example.com/login\nTASK: Capture screenshot of login card container and check if it matches baseline visual layout snapshots.",
        a: "<b>Key Point:</b> Use toHaveScreenshot() helper to perform pixel comparisons of pages or elements against generated image baselines.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('UI Assert — login panel visual snapshot comparison', async ({ page }) => {\n  await page.goto('https://example.com/login');\n\n  const loginCard = page.locator('#login-card');\n  \n  // Compare element screenshot against baseline\n  await expect(loginCard).toHaveScreenshot('login-card-baseline.png');\n});"
      },
      {
        q: "SCENARIO 75 — Assert API response headers details\nURL: GET /api/v1/data\nExpected Response headers:\n  Content-Type: application/json; charset=utf-8\n  Cache-Control: no-cache\nTASK: Assert returned headers match required types.",
        a: "<b>Pattern:</b> Retrieve response headers mapping list, and verify headers contains target substrings.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('GET /api/v1/data — assert returned headers content type', async ({ request }) => {\n  const response = await request.get('https://api.example.com/api/v1/data');\n  expect(response.status()).toBe(200);\n\n  const headers = response.headers();\n  expect(headers['content-type']).toContain('application/json');\n  expect(headers['cache-control']).toBe('no-cache');\n});"
      }
    ]
  },
  {
    category: "🔗 End-to-End Scenarios",
    qs: [
      {
        q: "SCENARIO 25 — Create via API, verify in UI\nSteps:\n  1. POST /api/v1/customers — create a customer (Ramaraj, Chennai)\n  2. Assert 201 and get the CustomerID from response\n  3. Navigate to https://app.example.com/customers/{customerId}\n  4. Assert the UI shows \"Ramaraj\" and \"Chennai\"\nTASK: Write the complete test combining API and UI steps.",
        a: "<b>Pattern:</b> API creates data faster than UI. Extract ID from POST response, construct URL with it, verify in UI. This is the most efficient test setup pattern.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('Create customer via API and verify in UI', async ({ request, page }) => {\n  const createResponse = await request.post('https://api.example.com/api/v1/customers', {\n    headers: {\n      'Content-Type': 'application/json',\n      'Authorization': 'Bearer mytoken123'\n    },\n    data: {\n      CustomerName: 'Ramaraj',\n      City: 'Chennai',\n      State: 'TN'\n    }\n  });\n\n  expect(createResponse.status()).toBe(201);\n  const created = await createResponse.json();\n  const customerId = created.CustomerID;\n\n  await page.goto(`https://app.example.com/customers/${customerId}`);\n\n  await expect(page.getByText('Ramaraj')).toBeVisible();\n  await expect(page.getByText('Chennai')).toBeVisible();\n});"
      },
      {
        q: "SCENARIO 26 — Login via API token, use it for protected UI page\nSteps:\n  1. POST /api/auth/login → get token\n  2. Use token to SET auth state in browser (localStorage or cookie)\n  3. Navigate to protected /dashboard page\n  4. Assert dashboard loads without login redirect\nTASK: Write the test that avoids filling the login form by using the API token.",
        a: "<b>Pattern:</b> Skip UI login → use API to get token → inject into browser context. Faster and more reliable than UI login in every test.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('Skip UI login — inject API token into browser', async ({ request, page }) => {\n  const loginRes = await request.post('https://api.example.com/api/auth/login', {\n    data: { username: 'admin', password: 'Test@123' }\n  });\n  const { token } = await loginRes.json();\n\n  await page.goto('https://app.example.com');\n  await page.evaluate((t) => {\n    localStorage.setItem('authToken', t);\n  }, token);\n\n  await page.goto('https://app.example.com/dashboard');\n\n  await expect(page).toHaveURL(/.*dashboard/);\n  await expect(page.getByText('Welcome')).toBeVisible();\n});"
      },
      {
        q: "SCENARIO 27 — Multi-step flow: Create → Search → Delete → Verify gone\nSteps:\n  1. POST to create a customer named \"TestDelete User\"\n  2. GET the list and verify this customer appears\n  3. DELETE the customer using their ID\n  4. GET the list again — verify customer is no longer in the list\nTASK: Full CRUD flow in a single test.",
        a: "<b>Pattern:</b> Complete CRUD in one test — Create → Read → Delete → Verify. Use unique names per test run to avoid collisions.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('Full CRUD — create, verify, delete, verify gone', async ({ request }) => {\n  const headers = {\n    'Content-Type': 'application/json',\n    'Authorization': 'Bearer mytoken123'\n  };\n  const uniqueName = `TestUser_${Date.now()}`;\n\n  // Step 1: CREATE\n  const createRes = await request.post('https://api.example.com/api/v1/customers', {\n    headers,\n    data: { CustomerName: uniqueName, City: 'Chennai', State: 'TN' }\n  });\n  expect(createRes.status()).toBe(201);\n  const { CustomerID } = await createRes.json();\n\n  // Step 2: VERIFY in list\n  const listRes = await request.get('https://api.example.com/api/v1/customers', { headers });\n  expect(listRes.status()).toBe(200);\n  const list = await listRes.json();\n  const found = list.find(c => c.CustomerID === CustomerID);\n  expect(found).toBeTruthy();\n  expect(found.CustomerName).toBe(uniqueName);\n\n  // Step 3: DELETE\n  const deleteRes = await request.delete(\n    `https://api.example.com/api/v1/customers/${CustomerID}`,\n    { headers }\n  );\n  expect(deleteRes.status()).toBe(204);\n\n  // Step 4: VERIFY gone\n  const afterDelete = await request.get(\n    `https://api.example.com/api/v1/customers/${CustomerID}`,\n    { headers }\n  );\n  expect(afterDelete.status()).toBe(404);\n});"
      },
      {
        q: "SCENARIO 76 — E2E login via cookie injection\nSteps:\n  1. Call auth API to fetch login cookie details\n  2. Inject cookies directly into browser context to skip UI login flow\n  3. Navigate to protected page and verify page loads\nTASK: Setup active auth state using browserContext.addCookies().",
        a: "<b>Key Point:</b> Add auth cookies directly to BrowserContext. This skips the login UI completely for E2E tests, saving time.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('E2E — inject session cookies to bypass login', async ({ page, context }) => {\n  // 1. Inject cookies into context\n  await context.addCookies([\n    {\n      name: 'session_id',\n      value: 'session-val-999',\n      domain: 'app.example.com',\n      path: '/'\n    }\n  ]);\n\n  // 2. Navigate to dashboard directly\n  await page.goto('https://app.example.com/dashboard');\n  await expect(page.locator('#dashboard-header')).toContainText('Dashboard');\n});"
      },
      {
        q: "SCENARIO 77 — API setup and cleanup fixtures\nSteps:\n  1. In beforeEach hook: Create user record via POST API\n  2. In test body: Verify user details page in UI\n  3. In afterEach hook: Delete user record via DELETE API to clean DB\nTASK: Manage test setup/teardown using hooks.",
        a: "<b>Pattern:</b> Keep DB clean by resetting dependencies. Perform setup tasks in hooks and utilize shared variables across contexts.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest.describe('Customer UI details — setup/teardown', () => {\n  let customerId;\n  const headers = { 'Authorization': 'Bearer test-token' };\n\n  test.beforeEach(async ({ request }) => {\n    // Setup data\n    const res = await request.post('https://api.example.com/api/v1/customers', {\n      headers,\n      data: { CustomerName: 'CleanupUser', City: 'Chennai' }\n    });\n    const data = await res.json();\n    customerId = data.CustomerID;\n  });\n\n  test.afterEach(async ({ request }) => {\n    // Teardown data\n    if (customerId) {\n      await request.delete(`https://api.example.com/api/v1/customers/${customerId}`, { headers });\n    }\n  });\n\n  test('View customer in UI', async ({ page }) => {\n    await page.goto(`https://app.example.com/customers/${customerId}`);\n    await expect(page.locator('#customer-name')).toHaveText('CleanupUser');\n  });\n});"
      },
      {
        q: "SCENARIO 78 — Edit Profile UI to API validation\nSteps:\n  1. Log in to dashboard UI\n  2. Click user profile, change name to \"Abhishek New Name\"\n  3. Save changes in UI\n  4. Perform GET request to user API endpoint\n  5. Assert that API returned value has updated name\nTASK: Validate UI updates map correctly to database entities via API.",
        a: "<b>Pattern:</b> Perform UI update. Trigger GET request via APIRequestContext on identical ID. Verify DB representation update.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('E2E — UI profile edit updates backend db', async ({ page, request }) => {\n  await page.goto('https://app.example.com/profile');\n\n  // Update details in UI\n  await page.locator('#name-input').fill('Abhishek New Name');\n  await page.getByRole('button', { name: 'Save' }).click();\n  await expect(page.locator('#success-msg')).toBeVisible();\n\n  // Validate changes on the backend\n  const response = await request.get('https://api.example.com/api/v1/profile/details', {\n    headers: { 'Authorization': 'Bearer session-token' }\n  });\n  expect(response.status()).toBe(200);\n  const data = await response.json();\n  expect(data.name).toBe('Abhishek New Name');\n});"
      },
      {
        q: "SCENARIO 79 — Multi-role access validation\nSteps:\n  1. Log in as Guest, verify \"Delete Config\" button is hidden\n  2. Log out\n  3. Log in as Admin, verify \"Delete Config\" button is visible\nTASK: Verify application access rules based on user roles.",
        a: "<b>Key Point:</b> Perform full role toggle. Log in, check permissions, logout, and verify admin access in sequence.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('E2E — role-based access checks', async ({ page }) => {\n  // 1. Guest flow\n  await page.goto('https://app.example.com/login');\n  await page.getByPlaceholder('Username').fill('guest');\n  await page.getByPlaceholder('Password').fill('guestPass');\n  await page.getByRole('button', { name: 'Login' }).click();\n  \n  await expect(page.locator('#delete-config-btn')).toBeHidden();\n  await page.getByRole('button', { name: 'Logout' }).click();\n\n  // 2. Admin flow\n  await page.getByPlaceholder('Username').fill('admin');\n  await page.getByPlaceholder('Password').fill('adminPass');\n  await page.getByRole('button', { name: 'Login' }).click();\n  \n  await expect(page.locator('#delete-config-btn')).toBeVisible();\n});"
      },
      {
        q: "SCENARIO 80 — Shopping Cart Session persistence\nSteps:\n  1. Go to store catalogue UI, click \"Add to Cart\" on first product\n  2. Cart badge updates to \"1\"\n  3. Refresh/Reload the browser page\n  4. Assert that cart badge value remains \"1\"\nTASK: Verify sessionStorage/localStorage persistence across page loads.",
        a: "<b>Key Point:</b> Add product, check cart count. Call page.reload() and verify storage state persists items list correctly.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('E2E — shopping cart items persist page reload', async ({ page }) => {\n  await page.goto('https://example-shop.com');\n\n  await page.getByRole('button', { name: 'Add to Cart' }).first().click();\n  const badge = page.locator('#cart-badge');\n  await expect(badge).toHaveText('1');\n\n  // Reload page\n  await page.reload();\n\n  // Assert item is still there\n  await expect(badge).toHaveText('1');\n});"
      },
      {
        q: "SCENARIO 81 — Intercept analytics webhook validation\nSteps:\n  1. Click checkout button \"Complete Purchase\" in UI\n  2. Verify application sends analytics webhook to POST /api/v1/analytics\n  3. Assert payload contains event=\"purchase_completed\" and order details\nTASK: Intercept and inspect outgoing API payloads triggered by UI clicks.",
        a: "<b>Key Point:</b> Use page.waitForRequest() to intercept outgoing AJAX/API traffic when clicking buttons in the UI.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('E2E — intercept and inspect outgoing analytics request', async ({ page }) => {\n  await page.goto('https://example.com/checkout');\n\n  // Intercept promise\n  const requestPromise = page.waitForRequest(request => \n    request.url().includes('/api/v1/analytics') && request.method() === 'POST'\n  );\n\n  await page.getByRole('button', { name: 'Complete Purchase' }).click();\n\n  // Wait for request and inspect\n  const analyticsReq = await requestPromise;\n  const postData = JSON.parse(analyticsReq.postData() || '{}');\n  \n  expect(postData.event).toBe('purchase_completed');\n  expect(postData.orderId).toBeTruthy();\n});"
      },
      {
        q: "SCENARIO 82 — Payment gateway state synchronization\nSteps:\n  1. Click \"Pay\" in UI\n  2. UI calls gateway API to process payment\n  3. Mock gateway API response returning status=\"SUCCESS\"\n  4. Assert UI updates to show payment confirmation dialog\nTASK: Mock payment backend states to verify UI transition flows.",
        a: "<b>Key Point:</b> Use page.route() to mock payment API responses. Clicking pay will then trigger our mock payload, letting us test the UI.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('E2E — mock payment status response and verify UI success', async ({ page }) => {\n  // Mock API Route\n  await page.route('**/api/v1/payments/process', async route => {\n    await route.fulfill({\n      status: 200,\n      contentType: 'application/json',\n      body: JSON.stringify({ status: 'SUCCESS', transactionId: 'TX-777' })\n    });\n  });\n\n  await page.goto('https://example.com/checkout');\n  await page.getByRole('button', { name: 'Pay Now' }).click();\n\n  // Verify UI displays success modal\n  await expect(page.locator('#success-modal')).toBeVisible();\n  await expect(page.locator('#txn-id')).toHaveText('TX-777');\n});"
      },
      {
        q: "SCENARIO 83 — DB synchronization E2E check\nSteps:\n  1. Add new entry in UI form: name \"SyncUser\"\n  2. Click Submit\n  3. Poll backend DB API until syncStatus field becomes \"COMPLETED\"\nTASK: Write E2E test combining UI trigger and API polling check.",
        a: "<b>Pattern:</b> Fill and submit form in UI. Extract record ID, then use expect.poll() to query details API until DB synchronization completes.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('E2E — UI submit and poll DB API status', async ({ page, request }) => {\n  await page.goto('https://app.example.com/add-user');\n\n  await page.locator('#username-input').fill('SyncUser');\n  await page.getByRole('button', { name: 'Submit' }).click();\n  await expect(page.locator('#sync-indicator')).toHaveText('Syncing...');\n\n  const userId = await page.locator('#user-id-badge').innerText();\n\n  // Poll DB API status\n  await expect.poll(async () => {\n    const res = await request.get(`https://api.example.com/api/v1/db-status/${userId}`);\n    const data = await res.json();\n    return data.syncStatus;\n  }, {\n    timeout: 10000,\n    intervals: [1000]\n  }).toBe('COMPLETED');\n});"
      },
      {
        q: "SCENARIO 84 — CSV download and parsing E2E\nSteps:\n  1. Click button \"Export Customers\"\n  2. Capture file download event trigger\n  3. Read CSV data from download stream\n  4. Parse CSV text and verify header row starts with \"ID,Name,Email\"\nTASK: Download files in UI and assert file structure contents.",
        a: "<b>Key Point:</b> Trigger download using page.waitForEvent('download'), retrieve download path, read contents using fs.readFileSync(), and verify contents.",
        code: "const { test, expect } = require('@playwright/test');\nconst fs = require('fs');\n\ntest('E2E — download and verify customers CSV export', async ({ page }) => {\n  await page.goto('https://app.example.com/exports');\n\n  // Trigger download event\n  const [download] = await Promise.all([\n    page.waitForEvent('download'),\n    page.getByRole('button', { name: 'Export Customers' }).click()\n  ]);\n\n  const filePath = await download.path();\n  const csvContent = fs.readFileSync(filePath, 'utf-8');\n\n  // Check headers row\n  const firstLine = csvContent.split('\n')[0].trim();\n  expect(firstLine).toBe('ID,Name,Email');\n});"
      },
      {
        q: "SCENARIO 85 — Session timeout authorization check\nSteps:\n  1. Inject expired session cookie into browser context\n  2. Navigate to dashboard page\n  3. Assert browser is automatically redirected back to login page\n  4. Assert error alert displays \"Session expired\"\nTASK: Verify redirect behavior for expired credentials.",
        a: "<b>Pattern:</b> Setup invalid/expired cookie values, attempt page navigation, and verify that routing redirections fire correctly.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('E2E — expired session redirects to login', async ({ page, context }) => {\n  // Inject expired cookie\n  await context.addCookies([\n    {\n      name: 'auth_session',\n      value: 'EXPIRED_KEY_123',\n      domain: 'app.example.com',\n      path: '/'\n    }\n  ]);\n\n  await page.goto('https://app.example.com/dashboard');\n\n  // Assert redirect back to login\n  await expect(page).toHaveURL(/.*\\/login/);\n  await expect(page.locator('#error-alert')).toHaveText('Session expired');\n});"
      }
    ]
  },
  {
    category: "⚙️ Advanced Playwright Features",
    qs: [
      {
        q: "SCENARIO 86 — Mocking API calls using page.route()\nSite: https://example.com/dashboard\nTASK: Intercept outgoing requests to '/api/v1/profile' and return a stubbed JSON response: { \"name\": \"Abhishek Mocked\", \"role\": \"ADMIN\" }.",
        a: "<b>Key Point:</b> Use page.route() to intercept calls matching pattern and fulfill them with custom status, content types, and stringified JSON bodies.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('Advanced — stub profile API response', async ({ page }) => {\n  // Register intercept route\n  await page.route('**/api/v1/profile', async route => {\n    await route.fulfill({\n      status: 200,\n      contentType: 'application/json',\n      body: JSON.stringify({ name: 'Abhishek Mocked', role: 'ADMIN' })\n    });\n  });\n\n  await page.goto('https://example.com/dashboard');\n  await expect(page.locator('#user-name')).toHaveText('Abhishek Mocked');\n  await expect(page.locator('#user-role')).toHaveText('ADMIN');\n});"
      },
      {
        q: "SCENARIO 87 — Abort image and stylesheet requests for speed\nTASK: Speeds up tests by blocking stylesheet, font, and image files from downloading during page navigation.",
        a: "<b>Key Point:</b> Intercept asset paths matching extensions or resource types using page.route(), and call route.abort() on them.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('Advanced — speed up tests by blocking resources', async ({ page }) => {\n  // Intercept and block image/stylesheet requests\n  await page.route('**/*.{png,jpg,jpeg,css}', route => route.abort());\n\n  await page.goto('https://example.com');\n  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();\n});"
      },
      {
        q: "SCENARIO 88 — Intercept request payloads for verification\nSite: https://example.com/form\nTASK: Click submit, wait for outgoing API POST request to '/api/save-form', and verify request headers and payload keys.",
        a: "<b>Key Point:</b> Wait for outgoing request using page.waitForRequest() and check headers, HTTP method, and JSON post data details.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('Advanced — verify submitted payload details', async ({ page }) => {\n  await page.goto('https://example.com/form');\n\n  await page.locator('#title-field').fill('Lead QA Engineer');\n\n  // Trigger click and wait for specific request\n  const [request] = await Promise.all([\n    page.waitForRequest('**/api/save-form'),\n    page.getByRole('button', { name: 'Submit' }).click()\n  ]);\n\n  expect(request.method()).toBe('POST');\n  const payload = JSON.parse(request.postData() || '{}');\n  expect(payload.title).toBe('Lead QA Engineer');\n});"
      },
      {
        q: "SCENARIO 89 — Writing custom test fixtures\nTASK: Define a custom 'adminPage' fixture that automatically logs in and sets context before executing a test.",
        a: "<b>Key Point:</b> Extend standard test using test.extend() and define fixtures that inject initialized page contexts with setup logic.",
        code: "const base = require('@playwright/test');\n\n// Extend test to create custom fixture\nconst test = base.test.extend({\n  adminPage: async ({ page }, use) => {\n    // Perform auto-login setup\n    await page.goto('https://app.example.com/login');\n    await page.getByPlaceholder('Username').fill('admin');\n    await page.getByPlaceholder('Password').fill('admin123');\n    await page.getByRole('button', { name: 'Login' }).click();\n    await page.waitForURL('**/dashboard');\n\n    // Pass initialized page\n    await use(page);\n\n    // Teardown steps (runs after test ends)\n    await page.goto('https://app.example.com/logout');\n  }\n});\n\ntest('Use custom adminPage fixture', async ({ adminPage }) => {\n  // Page is already logged in as Admin!\n  await expect(adminPage.locator('#admin-settings-tab')).toBeVisible();\n});"
      },
      {
        q: "SCENARIO 90 — Multi-context chat application testing\nTASK: Open two separate browser contexts concurrently inside a single test to simulate messages sending between User A and User B.",
        a: "<b>Key Point:</b> Use browser.newContext() to spawn separate, isolated session contexts. Open pages in each to run side-by-side verification.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('Advanced — verify live chat between user contexts', async ({ browser }) => {\n  // Context A (User A)\n  const contextA = await browser.newContext();\n  const pageA = await contextA.newPage();\n  await pageA.goto('https://app.example.com/chat?user=A');\n\n  // Context B (User B)\n  const contextB = await browser.newContext();\n  const pageB = await contextB.newPage();\n  await pageB.goto('https://app.example.com/chat?user=B');\n\n  // Send message from A\n  await pageA.locator('#chat-input').fill('Hello User B!');\n  await pageA.getByRole('button', { name: 'Send' }).click();\n\n  // Verify received on B\n  const messageBoxB = pageB.locator('.messages-list');\n  await expect(messageBoxB).toContainText('Hello User B!');\n\n  await contextA.close();\n  await contextB.close();\n});"
      },
      {
        q: "SCENARIO 91 — Geolocation and permissions mocking\nTASK: Configure browser context to override geolocation coordinates to Chennai (Latitude 13.0827, Longitude 80.2707) and grant location permissions.",
        a: "<b>Key Point:</b> Set permissions and geolocation config parameters in browser.newContext() setup configuration options.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('Advanced — geolocation override', async ({ browser }) => {\n  // Create context with location configurations\n  const context = await browser.newContext({\n    permissions: ['geolocation'],\n    geolocation: { latitude: 13.0827, longitude: 80.2707 }\n  });\n\n  const page = await context.newPage();\n  await page.goto('https://example.com/maps');\n\n  await expect(page.locator('#coords-val')).toHaveText('Lat: 13.08, Lon: 80.27');\n  await context.close();\n});"
      },
      {
        q: "SCENARIO 92 — Video recording and tracing configuration\nTASK: Set up Playwright configuration options to record video and capture trace files on test failure for troubleshooting.",
        a: "<b>Key Point:</b> Configure trace and video parameters inside playwight.config.js using 'retain-on-failure' or 'on-first-retry' modes.",
        code: "// playwright.config.js config snippet\nmodule.exports = {\n  use: {\n    // Capture traces on test failure\n    trace: 'retain-on-failure',\n\n    // Record videos on failure\n    video: 'retain-on-failure'\n  }\n};\n\n// Access details inside test.js\nconst { test } = require('@playwright/test');\ntest('Sample trace record flow', async ({ page }) => {\n  await page.goto('https://example.com');\n});"
      },
      {
        q: "SCENARIO 93 — Dark Mode preference emulation\nTASK: Emulate browser 'prefers-color-scheme: dark' media features context-wide and verify CSS styling updates correctly.",
        a: "<b>Key Point:</b> Pass colorScheme configuration inside new context parameters or call page.emulateMedia() during test cycles.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('Advanced — emulate dark color preference', async ({ page }) => {\n  // Emulate dark mode media query preference\n  await page.emulateMedia({ colorScheme: 'dark' });\n\n  await page.goto('https://example.com');\n\n  // Verify background colors updated\n  const body = page.locator('body');\n  await expect(body).toHaveCSS('background-color', 'rgb(15, 23, 42)'); // dark bg\n});"
      },
      {
        q: "SCENARIO 94 — Capture Page Performance timings\nTASK: Extract page load performance metrics (navigationStart, loadEventEnd, domInteractive) directly from window.performance object.",
        a: "<b>Key Point:</b> Query browser timing statistics using page.evaluate() to run window.performance timing scripts.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('Advanced — capture performance timing statistics', async ({ page }) => {\n  await page.goto('https://example.com');\n\n  // Extract navigation metrics\n  const timing = await page.evaluate(() => {\n    const perf = window.performance.timing;\n    return {\n      loadTime: perf.loadEventEnd - perf.navigationStart,\n      domInteractive: perf.domInteractive - perf.navigationStart\n    };\n  });\n\n  expect(timing.loadTime).toBeGreaterThan(0);\n  expect(timing.domInteractive).toBeGreaterThan(0);\n});"
      },
      {
        q: "SCENARIO 95 — Simulating network offline status\nTASK: Emulate network disconnect (offline mode) on browser context, navigate page, and verify page displays offline error overlay.",
        a: "<b>Key Point:</b> Use context.setOffline(true) to switch network states to offline. Re-enable using context.setOffline(false).",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('Advanced — verify offline error handling page', async ({ page, context }) => {\n  await page.goto('https://example.com');\n\n  // Go offline\n  await context.setOffline(true);\n\n  // Trigger navigation\n  await page.getByRole('link', { name: 'My Profile' }).click();\n\n  await expect(page.locator('#network-error')).toHaveText('No Connection');\n\n  // Restore network\n  await context.setOffline(false);\n});"
      },
      {
        q: "SCENARIO 96 — Setting basic auth dialog credentials\nTASK: Configure browser context setup options to automatically respond to network basic authentication login prompt dialogs.",
        a: "<b>Key Point:</b> Define authentication credentials options in browser.newContext() config setup parameters, bypassing dialog prompts.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('Advanced — bypass credentials login popup dialogs', async ({ browser }) => {\n  // Pre-configure credentials\n  const context = await browser.newContext({\n    httpCredentials: {\n      username: 'admin',\n      password: 'password123'\n    }\n  });\n\n  const page = await context.newPage();\n  await page.goto('https://example.com/protected-endpoint');\n\n  await expect(page.locator('#dashboard-area')).toBeVisible();\n  await context.close();\n});"
      },
      {
        q: "SCENARIO 97 — Catch browser console errors\nTASK: Listen to browser console events, store log messages, and assert no console.error() statements occurred during page loading.",
        a: "<b>Key Point:</b> Register listeners targeting page.on('console') events and filter logs lists by type for validation check.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('Advanced — assert no console errors occur', async ({ page }) => {\n  const consoleErrors = [];\n\n  // Register logger\n  page.on('console', msg => {\n    if (msg.type() === 'error') {\n      consoleErrors.push(msg.text());\n    }\n  });\n\n  await page.goto('https://example.com');\n\n  // Assert no errors occurred\n  expect(consoleErrors).toHaveLength(0);\n});"
      },
      {
        q: "SCENARIO 98 — Dynamic custom locator definitions\nTASK: Define a custom element helper locator matching standard data-testid patterns to keep locator paths clean.",
        a: "<b>Key Point:</b> Construct custom locator helper methods wrapping page.locator() query strings to prevent repeating selectors.",
        code: "const { test, expect } = require('@playwright/test');\n\n// Custom locator creator\nfunction getTestId(page, id) {\n  return page.locator(`[data-testid=\"${id}\"]`);\n}\n\ntest('Advanced — use custom testid helper', async ({ page }) => {\n  await page.goto('https://example.com');\n\n  // Clear usage patterns\n  await getTestId(page, 'submit-button').click();\n  await expect(getTestId(page, 'feedback-msg')).toHaveText('Success');\n});"
      },
      {
        q: "SCENARIO 99 — Dynamic download file interceptor\nTASK: Intercept and capture download events inside UI action flows and verify file paths and file size values.",
        a: "<b>Key Point:</b> Execute actions triggered downloads while waiting for page.waitForEvent('download') promise resolves.",
        code: "const { test, expect } = require('@playwright/test');\n\ntest('Advanced — capture file download events', async ({ page }) => {\n  await page.goto('https://example.com/downloads');\n\n  // Trigger download action\n  const [download] = await Promise.all([\n    page.waitForEvent('download'),\n    page.getByRole('button', { name: 'Download Catalog' }).click()\n  ]);\n\n  expect(download.suggestedFilename()).toBe('catalog.zip');\n  \n  const path = await download.path();\n  expect(path).toBeTruthy();\n});"
      },
      {
        q: "SCENARIO 100 — Test configuration runner options\nTASK: Configure test runner settings (workers, maxFailures, retries) programmatically inside playwright.config.js configurations.",
        a: "<b>Key Point:</b> Modify export configs settings parameters including retries, workers count, and report formatting choices.",
        code: "// playwright.config.js configuration snippet\nmodule.exports = {\n  // Retry count on failure\n  retries: 2,\n\n  // Maximum workers running concurrently\n  workers: 4,\n\n  // Fail fast options\n  maxFailures: 5,\n\n  reporter: [['html'], ['json', { outputFile: 'results.json' }]]\n};\n\n// Access trace in tests\nconst { test } = require('@playwright/test');\ntest('Sample config validation', async ({ page }) => {\n  await page.goto('https://example.com');\n});"
      }
    ]
  }
];


/* ══════════════════════════════════════
   RENDERER
══════════════════════════════════════ */

const R1_PREP = JSON.parse('[\n  {\n    "category": "☕ Topic 1: Java 11+ & OOPs Core (20 Qs)",\n    "qs": [\n      {\n        "q": "Q1: Local Variable Type Inference\\nTASK: Explain \'var\' keyword in Java 11 and write a loop utilizing it. Mention where it cannot be used.",\n        "a": "<b>Java 11 Local Variable Type Inference (var):</b><br>• <b>Mechanism:</b> Introduced in Java 10 and enhanced in Java 11 (adding support in lambda parameters). It allows the compiler to infer the data type of local variables based on the initialization value at compile time. It is NOT dynamic typing; bytecode remains strictly typed (compiled classes are identical to those declared with explicit types).<br>• <b>Where it CANNOT be used:</b><br>  1. <i>Instance & Static Fields:</i> Cannot be declared for class member variables (must be local variables).<br>  2. <i>Method Signatures:</i> Cannot be used as method parameter types or return types.<br>  3. <i>Without Initialization:</i> `var x;` is a compilation error; compiler needs a value to infer the type.<br>  4. <i>Null Initializers:</i> `var x = null;` is invalid because `null` doesn\'t resolve to a specific class type.<br>  5. <i>Compound Declarations:</i> Cannot declare multiple variables, e.g., `var a = 1, b = 2;`.<br>  6. <i>Array Initializers:</i> `var arr = {1, 2, 3};` is invalid (must use `new int[]{1, 2, 3}`).<br>• <b>Automation Application:</b> Eliminates verbose declarations like `WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10))` to `var wait = new WebDriverWait(driver, Duration.ofSeconds(10))`, improving code readability.",\n        "code": "import java.util.List;\\npublic class VarExample {\\n    public static void main(String[] args) {\\n        // Compiler infers List<String>\\n        var list = List.of(\\"Selenium\\", \\"Playwright\\", \\"RestAssured\\", \\"Karate\\");\\n        \\n        // Compiler infers String for loop variable\\n        for (var tool : list) {\\n            System.out.println(\\"Target Automation Tool: \\" + tool.toUpperCase());\\n        }\\n    }\\n}"\n      },\n      {\n        "q": "Q2: Immutable Collections\\nTASK: Create immutable List and Set in Java 11 and try modifying them to show exception behavior.",\n        "a": "<b>Java 11 Immutable Collections (List.of, Set.of, Map.of):</b><br>• <b>Concept:</b> Java 9 introduced, and Java 10/11 enhanced static factory methods for unmodifiable collections. These return memory-optimized, immutable implementations of List, Set, or Map.<br>• <b>Key Rules & Differences:</b><br>  1. <i>Modification Guard:</i> Attempts to add, remove, or modify items trigger `java.lang.UnsupportedOperationException` at runtime.<br>  2. <i>No Null Elements:</i> Adding `null` elements throws a `java.lang.NullPointerException` during creation (unlike traditional collections like `ArrayList` which accept `null`).<br>  3. <i>Duplicate Protection:</i> `Set.of(\\"A\\", \\"A\\")` will throw an `IllegalArgumentException` at runtime due to duplicate elements.<br>  4. <i>Efficiency:</i> They do not wrap mutable lists; they are custom internal JVM instances that use less memory and are completely thread-safe.<br>• <b>Automation Application:</b> Ideal for storing static configurations, environment tags, user roles, or expected test status lists.",\n        "code": "import java.util.List;\\nimport java.util.Set;\\npublic class ImmutableDemo {\\n    public static void main(String[] args) {\\n        List<String> envs = List.of(\\"DEV\\", \\"QA\\", \\"PROD\\");\\n        System.out.println(\\"Envs configured: \\" + envs);\\n        \\n        try {\\n            envs.add(\\"STAGING\\"); // Will fail!\\n        } catch (UnsupportedOperationException e) {\\n            System.out.println(\\"Caught expected: UnsupportedOperationException when modifying immutable List\\");\\n        }\\n        \\n        try {\\n            Set<String> uniqueCodes = Set.of(\\"QA-001\\", \\"QA-002\\", null); // Will throw NullPointerException!\\n        } catch (NullPointerException e) {\\n            System.out.println(\\"Caught expected: NullPointerException on null value in Set.of\\");\\n        }\\n    }\\n}"\n      },\n      {\n        "q": "Q3: Java 11 String APIs\\nTASK: Demonstrate the use of isBlank(), strip(), lines(), and repeat() in Java 11.",\n        "a": "<b>Java 11 String API Enhancements:</b><br>• <b>isBlank():</b> Returns `true` if the string is empty or contains only Unicode white space characters. This is highly superior to `.isEmpty()` (which only checks if length is 0), eliminating manual `.trim().isEmpty()` calls.<br>• <b>strip() / stripLeading() / stripTrailing():</b> Unicode-aware replacement for legacy `.trim()`. While `.trim()` only removes characters <= ASCII space (\\\\u0020), `.strip()` detects and removes all Unicode whitespace characters (like non-breaking space `\\\\u2000`).<br>• <b>lines():</b> Returns a lazy `Stream<String>` split by line terminators (`\\\\n`, `\\\\r`, or `\\\\r\\\\n`). Memory efficient compared to `.split(\\"\\\\\\\\n\\")` because it processes line-by-line without pre-allocating an array of strings.<br>• <b>repeat(int count):</b> Returns a string whose value is the concatenation of this string repeated `count` times. Throws `IllegalArgumentException` if count is negative.",\n        "code": "import java.util.stream.Collectors;\\npublic class StringDemo {\\n    public static void main(String[] args) {\\n        // 1. isBlank()\\n        String whiteSpaces = \\"   \\\\u2000  \\";\\n        System.out.println(\\"Is blank: \\" + whiteSpaces.isBlank()); // true\\n        System.out.println(\\"Is empty: \\" + whiteSpaces.isEmpty()); // false\\n        \\n        // 2. strip() vs trim()\\n        String unicodeStr = \\"\\\\u2000 Clean Me \\\\u2000\\";\\n        System.out.println(\\"trim(): \'\\" + unicodeStr.trim() + \\"\'\\");  // Doesn\'t strip Unicode space\\n        System.out.println(\\"strip(): \'\\" + unicodeStr.strip() + \\"\'\\"); // Strips Unicode space successfully\\n        \\n        // 3. lines()\\n        String multiline = \\"Browser: Chrome\\\\nEnv: QA\\\\nStatus: Failed\\";\\n        long linesCount = multiline.lines().count();\\n        System.out.println(\\"Lines count: \\" + linesCount); // 3\\n        \\n        // 4. repeat()\\n        String star = \\"*\\";\\n        System.out.println(\\"Separator: \\" + star.repeat(10)); // \\"**********\\"\\n    }\\n}"\n      },\n      {\n        "q": "Q4: Diamond Problem in Interfaces\\nTASK: Write a class implementing two interfaces with default methods having identical signatures and resolve the conflict.",\n        "a": "<b>Interface default methods & Diamond Problem:</b><br>• <b>Concept:</b> Java 8 introduced `default` methods in interfaces to allow adding new methods without breaking existing implementations. This introduced the Diamond Problem where a class implements two interfaces sharing the exact same method signature.<br>• <b>Resolution Mechanism:</b> The compiler forces a compile-time error indicating \\"Duplicate default methods\\". To resolve it, the implementing class MUST override the conflicting method. Inside the overridden method, you select which parent implementation to use using the syntax `InterfaceName.super.methodName();` or write custom local logic.",\n        "code": "interface WebTest {\\n    default void setup() {\\n        System.out.println(\\"WebTest: Launching Chrome Browser\\");\\n    }\\n}\\n\\ninterface APITest {\\n    default void setup() {\\n        System.out.println(\\"APITest: Initializing RestAssured client\\");\\n    }\\n}\\n\\npublic class SuiteSetup implements WebTest, APITest {\\n    // Resolve the conflict by overriding setup()\\n    @Override\\n    public void setup() {\\n        // Explicitly decide which interface\'s setup to run\\n        WebTest.super.setup();\\n        APITest.super.setup();\\n        System.out.println(\\"SuiteSetup: Setup completed successfully.\\");\\n    }\\n    \\n    public static void main(String[] args) {\\n        new SuiteSetup().setup();\\n    }\\n}"\n      },\n      {\n        "q": "Q5: HashMap Collisions in Java 8+\\nTASK: Explain what happens when multiple keys hash to the same bucket in a HashMap.",\n        "a": "<b>HashMap Collision Handling & Java 8 Optimization:</b><br>• <b>Hashing & Collisions:</b> HashMap stores entries in an array of nodes (buckets). A collision occurs when two keys calculate the same bucket index using `(n - 1) & hash(key)`.<br>• <b>Chaining:</b> Collisions are resolved using chaining. Up to Java 7, colliding elements were stored in a Singly LinkedList at the bucket, causing $O(N)$ lookup in the worst case.<br>• <b>Java 8 Treeification:</b> To prevent performance degradation (and HashDoS vulnerability), when the size of a linked list in a bucket exceeds the threshold of 8 (`TREEIFY_THRESHOLD`) AND the overall hashmap capacity is >= 64, the linked list is converted into a <b>Red-Black Tree</b>. This reduces lookup/insertion time from $O(N)$ to $O(\\\\log N)$. If the bucket size falls below 6 (`UNTREEIFY_THRESHOLD`) during removal, it converts back to a simple list.",\n        "code": "// Internally HashMap nodes represent:\\n// LinkedList node: class Node<K,V> { hash, key, value, next }\\n// Red-Black Tree node: class TreeNode<K,V> { parent, left, right, prev, red }\\n\\n// Performance comparison during collision:\\n// LinkedList lookup: O(N) comparisons\\n// Red-Black Tree lookup: O(log N) comparisons"\n      },\n      {\n        "q": "Q6: Stream API Filter & Map\\nTASK: Write a Stream pipeline to filter a list of strings starting with \'Test\', convert them to uppercase, and collect them.",\n        "a": "<b>Stream API Mechanics:</b><br>• <b>Pipeline:</b> A Java Stream consists of: (1) Source (e.g., collection), (2) Zero or more Intermediate operations, (3) Terminal operation.<br>• <b>Lazy Evaluation:</b> Intermediate operations (like `.filter()`, `.map()`) are not executed immediately. They build a pipeline description. The actual traversal and computations occur ONLY when the terminal operation (like `.collect()`, `.findFirst()`) is invoked. This avoids redundant passes over the data.<br>• <b>Operators:</b> `filter()` takes a `Predicate<T>` (returns boolean). `map()` takes a `Function<T, R>` (transforms elements).",\n        "code": "import java.util.List;\\nimport java.util.stream.Collectors;\\npublic class StreamDemo {\\n    public static void main(String[] args) {\\n        List<String> raw = List.of(\\"TestLogin\\", \\"SmokeSearch\\", \\"TestCheckout\\", \\"ManualExecution\\");\\n        \\n        List<String> processed = raw.stream()\\n            .filter(name -> name.startsWith(\\"Test\\")) // Intermediate (Lazy)\\n            .map(String::toUpperCase)                // Intermediate (Lazy)\\n            .collect(Collectors.toList());            // Terminal (Triggers execution)\\n            \\n        System.out.println(processed); // Output: [TESTLOGIN, TESTCHECKOUT]\\n    }\\n}"\n      },\n      {\n        "q": "Q7: Custom Exception in Framework\\nTASK: Design a custom exception FrameworkException that accepts a custom message and wraps the root cause.",\n        "a": "<b>Custom Exceptions in Automation Frameworks:</b><br>• <b>Design Rule:</b> Always extend `RuntimeException` (unchecked exception) rather than `Exception` (checked exception) in test automation frameworks. Unchecked exceptions do not force you to declare `throws Exception` on every page object method signature, leading to cleaner code.<br>• <b>Root Cause Wrapping:</b> Expose constructors that accept a string message AND a `Throwable cause` argument. This ensures that when the custom exception is thrown, the original low-level exception stack trace (e.g., `NoSuchElementException` or `TimeoutException`) is preserved.",\n        "code": "public class FrameworkException extends RuntimeException {\\n    // Default constructor\\n    public FrameworkException(String message) {\\n        super(message);\\n    }\\n    \\n    // Constructor to wrap root cause\\n    public FrameworkException(String message, Throwable cause) {\\n        super(message, cause);\\n    }\\n}"\n      },\n      {\n        "q": "Q8: ThreadLocal for Browser Driver\\nTASK: Write a DriverManager utility that exposes ThreadLocal WebDriver to prevent driver collisions during parallel execution.",\n        "a": "<b>ThreadLocal for Parallel Execution:</b><br>• <b>Mechanism:</b> `ThreadLocal` allocates a separate variable instance per thread. In parallel runs (e.g. TestNG parallel=\\"methods\\"), each thread executing a test method has its own isolated WebDriver instance, avoiding cross-talk or driver collision.<br>• <b>Memory Leak Warning:</b> In continuous integration pipelines utilizing thread pools, threads are reused. If you fail to call `threadLocal.remove()`, the driver object reference remains bound to the thread structure, preventing garbage collection and leading to major Metaspace/Heap leaks. Always invoke `.remove()` in your teardown methods.",\n        "code": "import org.openqa.selenium.WebDriver;\\npublic class DriverManager {\\n    private static final ThreadLocal<WebDriver> driverThreadLocal = new ThreadLocal<>();\\n    \\n    private DriverManager() {} // Prevent instantiation\\n    \\n    public static WebDriver getDriver() {\\n        return driverThreadLocal.get();\\n    }\\n    \\n    public static void setDriver(WebDriver driver) {\\n        driverThreadLocal.set(driver);\\n    }\\n    \\n    public static void unload() {\\n        if (driverThreadLocal.get() != null) {\\n            driverThreadLocal.get().quit();\\n            driverThreadLocal.remove(); // CRITICAL to prevent memory leaks!\\n        }\\n    }\\n}"\n      },\n      {\n        "q": "Q9: Abstract Class vs Interface in Framework Design\\nTASK: Explain where you use an Abstract Class vs an Interface when building a test automation architecture.",\n        "a": "<b>Architectural Choices: Abstract Class vs Interface:</b><br>• <b>Interface:</b> Use to define a strict functional contract of behaviors. For example, a `PageActions` interface defining `click()`, `sendKeys()`, `getText()`. Since Java classes can implement multiple interfaces, it is ideal for peripheral capabilities (e.g. implementing `ScreenshotCapable`, `DatabaseReader`). Cannot define instance fields (only public static final).<br>• <b>Abstract Class:</b> Use to share state and code implementation across closely related hierarchy. For example, `BasePage` which holds the shared `WebDriver` reference, `WebDriverWait` instance, and base elements. Child Page Objects (like `LoginPage`, `DashboardPage`) inherit this base state via single inheritance.",\n        "code": "import org.openqa.selenium.WebDriver;\\nimport org.openqa.selenium.support.ui.WebDriverWait;\\nimport java.time.Duration;\\n\\n// Contract of behaviors\\ninterface PageBehavior {\\n    void openUrl(String url);\\n}\\n\\n// Shared state and utilities\\nabstract class BasePage implements PageBehavior {\\n    protected WebDriver driver;\\n    protected WebDriverWait wait;\\n    \\n    public BasePage(WebDriver driver) {\\n        this.driver = driver;\\n        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));\\n    }\\n}"\n      },\n      {\n        "q": "Q10: Protect Singleton from Reflection API\\nTASK: Modify the private constructor of a Singleton class so that it throws an exception if instantiated twice via reflection.",\n        "a": "<b>Securing Singletons Against Reflection:</b><br>• <b>Reflection Vulnerability:</b> Java Reflection API allows changing constructor accessibility (`constructor.setAccessible(true)`), which allows clients to instantiate a private constructor and violate the singleton contract.<br>• <b>Guard:</b> Check the static singleton instance reference inside the constructor. If the instance is already initialized, throw an exception (e.g. `IllegalStateException` or `RuntimeException`) to block duplicate initialization.",\n        "code": "public class ReflectionProofSingleton {\\n    private static ReflectionProofSingleton instance = null;\\n    \\n    private ReflectionProofSingleton() {\\n        // Prevent Reflection instance creation\\n        if (instance != null) {\\n            throw new IllegalStateException(\\"Singleton instance already exists! Access denied.\\");\\n        }\\n    }\\n    \\n    public static synchronized ReflectionProofSingleton getInstance() {\\n        if (instance == null) {\\n            instance = new ReflectionProofSingleton();\\n        }\\n        return instance;\\n    }\\n}"\n      },\n      {\n        "q": "Q11: Protect Singleton from Serialization\\nTASK: Implement readResolve() method in a Serializable Singleton to prevent duplicate instance creation during deserialization.",\n        "a": "<b>Securing Singletons Against Serialization:</b><br>• <b>Deserialization Threat:</b> When a singleton class implements `Serializable`, the deserialization process (`ObjectInputStream.readObject()`) bypasses constructors and creates a new object instance in memory, breaking the singleton rule.<br>• <b>Fix:</b> Define a protected or private `readResolve()` method in the class. During deserialization, the JVM calls this method, allowing you to return the active static instance reference instead of the newly deserialized copy.",\n        "code": "import java.io.Serializable;\\npublic class SerialSingleton implements Serializable {\\n    private static final long serialVersionUID = 1L;\\n    private static final SerialSingleton INSTANCE = new SerialSingleton();\\n    \\n    private SerialSingleton() {}\\n    \\n    public static SerialSingleton getInstance() { return INSTANCE; }\\n    \\n    // Resolves deserialization duplicate instance creation\\n    protected Object readResolve() {\\n        return INSTANCE; // Return the exact same static singleton reference\\n    }\\n}"\n      },\n      {\n        "q": "Q12: Deep Copy vs Shallow Copy in Test Data Builder\\nTASK: Explain how shallow copy can corrupt parallel test executions when sharing a common payload prototype.",\n        "a": "<b>Shallow vs Deep Copy in Parallel Testing:</b><br>• <b>Shallow Copy:</b> Copies the top-level fields only. Nested object fields are copied as references. If Thread A alters a nested field (e.g. changing dynamic email in test data object), Thread B\'s dynamic test data changes too because both references point to the same nested memory object.<br>• <b>Deep Copy:</b> Clones both the top-level objects AND recursively instantiates new copies of all nested objects. In parallel testing, deep copying templates ensures complete data state isolation.",\n        "code": "class User {\\n    String name;\\n    User(String n) { this.name = n; }\\n}\\n\\npublic class Payload implements Cloneable {\\n    public User user;\\n    public String env;\\n    \\n    public Payload(User u, String e) {\\n        this.user = u;\\n        this.env = e;\\n    }\\n    \\n    @Override\\n    public Object clone() throws CloneNotSupportedException {\\n        // Shallow copy: super.clone() copies user reference!\\n        Payload cloned = (Payload) super.clone();\\n        // Deep copy: explicitly create a new User instance\\n        cloned.user = new User(this.user.name);\\n        return cloned;\\n    }\\n}"\n      },\n      {\n        "q": "Q13: Try-With-Resources in Test Frameworks\\nTASK: Write a connection query utilizing try-with-resources to query test data, ensuring resources close automatically.",\n        "a": "<b>Try-With-Resources Mechanism:</b><br>• <b>Concept:</b> Introduced in Java 7, any class implementing the `java.lang.AutoCloseable` interface (such as `Connection`, `Statement`, `InputStream`) can be declared within the `try` parameter block.<br>• <b>Lifecycle:</b> The resources are automatically closed in the reverse order of their declaration, regardless of whether the try block finishes successfully or throws an exception. This eliminates the risk of connection leaks and cleans up nesting `finally` blocks.",\n        "code": "import java.sql.Connection;\\nimport java.sql.DriverManager;\\nimport java.sql.ResultSet;\\nimport java.sql.Statement;\\npublic class DBUtils {\\n    public static void executeQuery(String query) {\\n        String dbUrl = \\"jdbc:mysql://localhost:3306/test_db\\";\\n        \\n        // Resources closed automatically in reverse order of initialization\\n        try (Connection conn = DriverManager.getConnection(dbUrl, \\"user\\", \\"pass\\");\\n             Statement stmt = conn.createStatement();\\n             ResultSet rs = stmt.executeQuery(query)) {\\n            \\n            while (rs.next()) {\\n                System.out.println(\\"Test Record: \\" + rs.getString(\\"test_id\\"));\\n            }\\n        } catch (Exception e) {\\n            e.printStackTrace();\\n        }\\n    }\\n}"\n      },\n      {\n        "q": "Q14: Optional Class Usage in Java 11\\nTASK: Use Optional.ofNullable() to fetch a configuration property, providing a fallback if the property is missing.",\n        "a": "<b>Java 11 Optional Class:</b><br>• <b>Concept:</b> Avoids dirty `null` checks and prevents `NullPointerException` (NPE). Exposes methods like `orElse()`, `orElseGet()`, `orElseThrow()`, and `ifPresent()`.<br>• <b>Rules:</b> Use `Optional.ofNullable()` when the value can be null. Avoid utilizing `.get()` directly without checking `.isPresent()`, otherwise it throws a `NoSuchElementException` on empty optionals. Use `.orElse()` to define fallback states.",\n        "code": "import java.util.Optional;\\npublic class ConfigDemo {\\n    public static String getBrowserConfig() {\\n        // Fetch system env variable that might be null\\n        String rawBrowser = System.getenv(\\"BROWSER_TYPE\\");\\n        \\n        return Optional.ofNullable(rawBrowser)\\n            .map(String::trim)\\n            .filter(b -> !b.isBlank())\\n            .map(String::toLowerCase)\\n            .orElse(\\"chrome\\"); // Fallback to chrome\\n    }\\n    \\n    public static void main(String[] args) {\\n        System.out.println(\\"Target Browser: \\" + getBrowserConfig());\\n    }\\n}"\n      },\n      {\n        "q": "Q15: Functional Interfaces in Explicit Waits\\nTASK: Write a custom wait utility that takes a Predicate<WebDriver> and executes polling assertions until true.",\n        "a": "<b>Functional Interfaces & Custom Waits:</b><br>• <b>Concept:</b> A functional interface contains exactly one abstract method (SAM). `java.util.function.Predicate` defines `boolean test(T t)`. By accepting a `Predicate<WebDriver>`, we can pass arbitrary logic (as lambda expressions) directly into explicit polling wait loops, making our custom assertions highly modular.",\n        "code": "import java.util.function.Predicate;\\nimport org.openqa.selenium.WebDriver;\\npublic class CustomWait {\\n    public static void waitForCondition(WebDriver driver, Predicate<WebDriver> condition, int timeoutSeconds) {\\n        long end = System.currentTimeMillis() + (timeoutSeconds * 1000L);\\n        while (System.currentTimeMillis() < end) {\\n            try {\\n                if (condition.test(driver)) {\\n                    return; // Condition met\\n                }\\n            } catch (Exception ignored) {\\n                // Ignore exceptions during polling\\n            }\\n            try {\\n                Thread.sleep(500); // Poll every 500ms\\n            } catch (InterruptedException e) {\\n                Thread.currentThread().interrupt();\\n                throw new RuntimeException(e);\\n            }\\n        }\\n        throw new RuntimeException(\\"Timeout waiting for condition to resolve!\\");\\n    }\\n}"\n      },\n      {\n        "q": "Q16: Covariant Return Types in Overriding\\nTASK: Override a method in a child page object class, returning the child class type instead of base page class type.",\n        "a": "<b>Covariant Return Types:</b><br>• <b>Mechanism:</b> When overriding a method, Java allows changing the return type in the subclass to a subtype of the original return type. This prevents the need for manual casting when utilizing page method chaining.",\n        "code": "class BasePage {\\n    public BasePage load() {\\n        System.out.println(\\"BasePage: Loading layout\\");\\n        return this;\\n    }\\n}\\n\\nclass LoginPage extends BasePage {\\n    // Covariant return type: LoginPage is a subtype of BasePage\\n    @Override\\n    public LoginPage load() {\\n        System.out.println(\\"LoginPage: Navigating to authentication page\\");\\n        return this;\\n    }\\n    \\n    public void enterCredentials() {\\n        System.out.println(\\"LoginPage: Entering credentials\\");\\n    }\\n    \\n    public static void main(String[] args) {\\n        // Method chaining works without downcasting!\\n        new LoginPage().load().enterCredentials();\\n    }\\n}"\n      },\n      {\n        "q": "Q17: String Pool Memory Leak\\nTASK: Explain how loading high volumes of unique, dynamic strings using String.intern() can cause memory issues.",\n        "a": "<b>String Pool Memory Risks (`String.intern()`):</b><br>• <b>Mechanism:</b> `intern()` adds a string value to the JVM String Constant Pool. If the pool already contains an equal string, it returns the reference from the pool.<br>• <b>Memory Leak Path:</b> The String Pool is located inside Heap memory. If tests dynamically create and intern millions of unique strings (like random UUIDs, dynamic payloads, database dumps), the JVM will retain these strings in the constant pool. This increases GC pressure and can exhaust Metaspace/Heap memory, causing memory degradation.",\n        "code": "public class InternLeak {\\n    public static void main(String[] args) {\\n        // BAD PRACTICE in dynamic test loops:\\n        // for (int i = 0; i < 1000000; i++) {\\n        //     String dynamicToken = (java.util.UUID.randomUUID().toString() + i).intern();\\n        //     // Memory gets leaked into the String Pool, causing slow GC passes.\\n        // }\\n    }\\n}"\n      },\n      {\n        "q": "Q18: == vs equals() in Assertions\\nTASK: Write a quick comparison demonstrating why == fails and .equals() succeeds on two test log model instances.",\n        "a": "<b>Reference Equality vs Logical Value Equality:</b><br>• <b>== Operator:</b> Compares memory reference addresses. Checks if both variable references point to the exact same memory location on the Heap.<br>• <b>equals() Method:</b> Compares logical state/content. By default, `Object.equals()` performs reference comparison (`==`). You must override `.equals(Object)` and `.hashCode()` inside your model/payload classes to compare values correctly during test assertions.",\n        "code": "import java.util.Objects;\\nclass LogModel {\\n    String level;\\n    String message;\\n    \\n    LogModel(String lvl, String msg) {\\n        this.level = lvl;\\n        this.message = msg;\\n    }\\n    \\n    @Override\\n    public boolean equals(Object o) {\\n        if (this == o) return true;\\n        if (!(o instanceof LogModel)) return false;\\n        LogModel other = (LogModel) o;\\n        return Objects.equals(this.level, other.level) &&\\n               Objects.equals(this.message, other.message);\\n    }\\n    \\n    @Override\\n    public int hashCode() {\\n        return Objects.hash(level, message);\\n    }\\n}\\n\\npublic class EqualityDemo {\\n    public static void main(String[] args) {\\n        LogModel log1 = new LogModel(\\"INFO\\", \\"Initialized driver\\");\\n        LogModel log2 = new LogModel(\\"INFO\\", \\"Initialized driver\\");\\n        \\n        System.out.println(\\"Using == : \\" + (log1 == log2));       // false\\n        System.out.println(\\"Using equals() : \\" + log1.equals(log2)); // true\\n    }\\n}"\n      },\n      {\n        "q": "Q19: Lambda Local Variable Inference\\nTASK: Demonstrate local variable type inference (var) inside parameter declarations of a lambda expression (Java 11).",\n        "a": "<b>Java 11 Lambda Parameter Type Inference:</b><br>• <b>Concept:</b> Java 11 added support for utilizing `var` within lambda parameters. This makes the language syntax consistent with local variable declarations.<br>• <b>Why Use It:</b> You cannot apply type annotations (e.g. `@Nonnull`, `@Nullable`) to parameters in standard implicit lambdas `(x, y) -> x + y`. By declaring `(var x, var y)`, you can annotate variables without explicitly specifying long class type names.",\n        "code": "import java.util.function.BiFunction;\\npublic class LambdaVar {\\n    public static void main(String[] args) {\\n        // Java 11 syntax: utilizing var inside lambda parameters\\n        BiFunction<Integer, Integer, Integer> sum = (var a, var b) -> a + b;\\n        System.out.println(\\"Computed: \\" + sum.apply(50, 100));\\n    }\\n}"\n      },\n      {\n        "q": "Q20: Stack vs Heap Memory in Test Thread\\nTASK: Describe what is allocated on Stack vs Heap during a thread-local test execution.",\n        "a": "<b>JVM Memory Allocation: Stack vs Heap:</b><br>• <b>Stack Memory:</b> Stores method execution frames, local primitives variables, and object references. Each execution thread has its own private Stack. Memory allocation is fast, strictly local, and cleaned up automatically when methods exit.<br>• <b>Heap Memory:</b> Stores all object instances and arrays. Heap is shared globally across all threads. While Thread-1 has its own local stack reference pointing to a `ChromeDriver` object, the actual browser instance resides on the shared Heap. If multiple threads reference the same heap object without synchronization, thread collisions occur.",\n        "code": "public class MemoryMap {\\n    public void executeTest() {\\n        int localId = 101; // Stack: stored inside thread\'s method frame\\n        Object payload = new java.util.HashMap<>(); \\n        // Stack: contains reference address of \'payload\'\\n        // Heap: stores the actual HashMap object instance\\n    }\\n}"\n      }\n    ]\n  },\n  {\n    "category": "🌐 Topic 2: Web Automation (Playwright & Selenium - 20 Qs)",\n    "qs": [\n      {\n        "q": "Q1: Playwright Session Isolation\\nTASK: Describe the technical difference between Selenium Session creation and Playwright BrowserContext creation.",\n        "a": "<b>Browser Session Isolation: Playwright vs Selenium:</b><br>• <b>Selenium Process Overhead:</b> Selenium instantiates a separate browser process (e.g. Chrome, Firefox) for each WebDriver session. Launching a browser process is slow (takes 2-5 seconds), consumes high CPU/memory, and requires managing OS-level drivers (chromedriver).<br>• <b>Playwright Virtual Sandboxing:</b> Playwright launches a single browser process once. To execute tests in isolation, it creates isolated `BrowserContext` instances. A `BrowserContext` is a lightweight virtual sandbox (similar to an Incognito tab) running within the browser process. It initializes in milliseconds, uses negligible memory, and guarantees isolation of cookies, localStorage, and cache. This allows running hundreds of concurrent parallel tests safely.",\n        "code": "const { chromium } = require(\'playwright\');\\nasync function run() {\\n  // Launch one heavy browser process\\n  const browser = await chromium.launch({ headless: true });\\n  \\n  // Instantly create isolated sandbox profiles\\n  const context1 = await browser.newContext(); // Thread/Test 1 cookies\\n  const context2 = await browser.newContext(); // Thread/Test 2 cookies\\n  \\n  const page1 = await context1.newPage();\\n  const page2 = await context2.newPage();\\n  \\n  await page1.goto(\'https://api-1.example.com\');\\n  await page2.goto(\'https://api-2.example.com\');\\n  \\n  await browser.close();\\n}"\n      },\n      {\n        "q": "Q2: Selenium 4 Relative Locators\\nTASK: Write a locator query to find a Username field situated above Login button and to the right of Label.",\n        "a": "<b>Selenium 4 Relative Locators:</b><br>• <b>Mechanism:</b> Selenium 4 uses Chrome DevTools APIs to calculate the layout bounding boxes of web elements on the viewport, allowing you to locate elements based on spatial positions: `above()`, `below()`, `toLeftOf()`, `toRightOf()`, and `near()`.<br>• <b>Gotchas:</b> Relative locators query the DOM geometry dynamically. If elements overlap or shift, tests might fail. Ensure to anchor them using a stable nearby element.",\n        "code": "import org.openqa.selenium.By;\\nimport org.openqa.selenium.WebDriver;\\nimport org.openqa.selenium.WebElement;\\nimport org.openqa.selenium.support.locators.RelativeLocator;\\n\\npublic class RelativeLocatorDemo {\\n    public void locateElements(WebDriver driver) {\\n        By label = By.id(\\"lbl-username\\");\\n        By loginButton = By.xpath(\\"//button[text()=\'Login\']\\");\\n        \\n        // Locate input field relative to both layout anchors\\n        WebElement usernameInput = driver.findElement(\\n            RelativeLocator.with(By.tagName(\\"input\\"))\\n                .above(loginButton)\\n                .toRightOf(label)\\n        );\\n        usernameInput.sendKeys(\\"sdet_noida\\");\\n    }\\n}"\n      },\n      {\n        "q": "Q3: Shadow DOM elements handling\\nTASK: Write locator examples querying elements hidden inside a Shadow DOM, in both Selenium 4 and Playwright.",\n        "a": "<b>Shadow DOM Traversal:</b><br>• <b>Concept:</b> Shadow DOM encapsulates elements inside custom web components, keeping them hidden from standard DOM queries (like `document.getElementById`).<br>• <b>Playwright:</b> Traverses open Shadow roots natively by default. Locators like `page.locator(\'#input-id\')` will automatically inspect shadow hosts without special code.<br>• <b>Selenium 4:</b> Requires finding the Shadow Host element first, calling `.getShadowRoot()` to return a `SearchContext` root, and querying child elements from that context.",\n        "code": "// --- Playwright: Native traversal ---\\n// Playwright automatically pierces open shadow roots\\nawait page.locator(\'#shadow-host #target-input\').fill(\'Playwright Shadow DOM Text\');\\n\\n// --- Selenium 4: Explicit retrieval ---\\n// WebElement host = driver.findElement(By.id(\\"shadow-host\\"));\\n// SearchContext rootContext = host.getShadowRoot();\\n// WebElement targetElement = rootContext.findElement(By.id(\\"target-input\\"));\\n// targetElement.sendKeys(\\"Selenium 4 Shadow DOM Text\\");"\n      },\n      {\n        "q": "Q4: API Intercepting and Mocking\\nTASK: Mock an API endpoint response in Playwright JS. Redirect GET /api/v1/user to return a mock JSON object.",\n        "a": "<b>Network Interception in Playwright:</b><br>• <b>Mechanism:</b> Playwright enables direct interaction with the browser\'s network layer. Using `page.route()`, you can intercept API requests matching a URL pattern.<br>• <b>Action:</b> Fulfill the route by passing a mock payload, status code, and headers. This allows testing frontend error handling, edge cases, and loading states without hitting the actual backend databases.",\n        "code": "const { test, expect } = require(\'@playwright/test\');\\n\\ntest(\'Mock API GET /api/v1/user response\', async ({ page }) => {\\n  // Intercept the endpoint and replace response\\n  await page.route(\'**/api/v1/user\', async route => {\\n    await route.fulfill({\\n      status: 200,\\n      contentType: \'application/json\',\\n      body: JSON.stringify({\\n        userId: \'SDET-Noida-99\',\\n        role: \'Administrator\',\\n        permissions: [\'READ\', \'WRITE\']\\n      })\\n    });\\n  });\\n\\n  // Navigate to dashboard where the API is invoked\\n  await page.goto(\'https://example.com/dashboard\');\\n});"\n      },\n      {\n        "q": "Q5: StaleElementReferenceException\\nTASK: Explain why this exception occurs and show how you mitigate it in a Selenium framework.",\n        "a": "<b>StaleElementReferenceException Mitigation:</b><br>• <b>Cause:</b> Thrown when a previously referenced WebElement is no longer attached to the page\'s DOM. This happens if the page refreshes, a JS framework redraws the element, or an AJAX update swaps the element in the tree.<br>• <b>Mitigation:</b> Re-locate elements using `driver.findElement` immediately before interaction, or wrap element interactions inside a loop that catches `StaleElementReferenceException` and retries lookup.",\n        "code": "import org.openqa.selenium.By;\\nimport org.openqa.selenium.WebDriver;\\nimport org.openqa.selenium.StaleElementReferenceException;\\n\\npublic class UIWrapper {\\n    public static void clickWithRetry(WebDriver driver, By locator) {\\n        int maxAttempts = 3;\\n        for (int attempt = 0; attempt < maxAttempts; attempt++) {\\n            try {\\n                driver.findElement(locator).click();\\n                return; // Success!\\n            } catch (StaleElementReferenceException e) {\\n                System.out.println(\\"Element stale on attempt \\" + (attempt + 1) + \\". Retrying...\\");\\n            }\\n        }\\n        throw new RuntimeException(\\"Failed to click element due to stale references: \\" + locator);\\n    }\\n}"\n      },\n      {\n        "q": "Q6: File Upload in headless mode\\nTASK: Write file upload interactions targeting a hidden file input element in Playwright and Selenium.",\n        "a": "<b>Hidden File Uploads:</b><br>• <b>Concept:</b> UI designs frequently hide raw `<input type=\\"file\\">` elements using CSS (`display:none` or `opacity:0`), triggering upload using standard button clicks.<br>• <b>Playwright Approach:</b> Use `setInputFiles` directly on the input locator.<br>• <b>Selenium Approach:</b> Locate the hidden file input tag and call `.sendKeys()` passing the absolute path to the local file.",\n        "code": "// --- Playwright: Target element directly ---\\nawait page.locator(\'input[type=\\"file\\"]\').setInputFiles(\'tests/assets/profile.jpg\');\\n\\n// --- Selenium (Java): Target hidden input ---\\n// WebDriver driver = new ChromeDriver();\\n// WebElement hiddenInput = driver.findElement(By.cssSelector(\\"input[type=\'file\']\\"));\\n// hiddenInput.sendKeys(\\"C:\\\\\\\\tests\\\\\\\\assets\\\\\\\\profile.jpg\\");"\n      },\n      {\n        "q": "Q7: CDP (Chrome DevTools Protocol) in Selenium 4\\nTASK: Write a Selenium 4 snippet utilizing CDP to throttle network speed or simulate geolocation override.",\n        "a": "<b>CDP in Selenium 4:</b><br>• <b>Concept:</b> Selenium 4 provides access to the Chrome DevTools Protocol (CDP) for Chromium-based browsers (Chrome/Edge). This allows executing advanced browser modifications that were previously limited to browser extensions.",\n        "code": "import org.openqa.selenium.chrome.ChromeDriver;\\nimport org.openqa.selenium.devtools.DevTools;\\nimport org.openqa.selenium.devtools.v115.emulation.Emulation;\\nimport java.util.Optional;\\n\\npublic class CDPDemo {\\n    public void simulateGeo(ChromeDriver driver) {\\n        DevTools devTools = driver.getDevTools();\\n        devTools.createSession();\\n        \\n        // Mock latitude, longitude and accuracy level\\n        devTools.send(Emulation.setGeolocationOverride(\\n            Optional.of(28.5355),  // Noida Latitude\\n            Optional.of(77.3910),  // Noida Longitude\\n            Optional.of(1)\\n        ));\\n        driver.get(\\"https://www.google.com/maps\\");\\n    }\\n}"\n      },\n      {\n        "q": "Q8: SVG and Canvas Element Automation\\nTASK: Interact with a dynamic SVG tag or fetch coordinates to click inside a HTML5 Canvas component.",\n        "a": "<b>SVG & Canvas Interactions:</b><br>• <b>SVG (Scalable Vector Graphics):</b> Normal XPath syntax (e.g. `//svg[@id=\'chart\']`) fails because SVG elements belong to a different XML namespace. You must locate them using `local-name()` or `name()` functions, e.g., `//*[local-name()=\'svg\']`.<br>• <b>HTML5 Canvas:</b> Canvas represents a flat 2D/3D visual grid. There are no DOM elements inside it to locate. You must retrieve the bounding box coordinates of the canvas element and trigger offset clicks using user actions classes.",\n        "code": "// --- SVG XPath Selector ---\\n// By svgElement = By.xpath(\\"//*[local-name()=\'svg\' and @id=\'chart\']//*[local-name()=\'circle\']\\");\\n\\n// --- Canvas coordinate action in Selenium ---\\n// WebElement canvas = driver.findElement(By.id(\\"webgl-canvas\\"));\\n// int width = canvas.getSize().getWidth();\\n// int height = canvas.getSize().getHeight();\\n// new Actions(driver).moveToElement(canvas).moveByOffset(width / 4, height / 4).click().perform();"\n      },\n      {\n        "q": "Q9: XPath Axes for Dynamic Tables\\nTASK: Write an XPath locating a delete button in a dynamic table situated next to a column displaying the dynamic user email \'user@noida.com\'.",\n        "a": "<b>XPath Axes & Dynamic DOM navigation:</b><br>• <b>Concept:</b> In reports, tables, or dynamic lists, elements lack unique identifiers. You locate the static text cell first, then navigate relative to it using axes like `following-sibling`, `preceding-sibling`, or `parent`.",\n        "code": "import org.openqa.selenium.By;\\npublic class TableLocators {\\n    public static By getDeleteButtonByEmail(String email) {\\n        // Locate the td cell with the target email, go up to parent row, search for delete button\\n        return By.xpath(\\"//td[text()=\'\\" + email + \\"\']/parent::tr//button[@class=\'btn-delete\']\\");\\n    }\\n}"\n      },\n      {\n        "q": "Q10: Switching Windows and Tabs\\nTASK: Write window handlers code to switch focus to a newly opened tab, capture page title, close it, and focus back in Selenium.",\n        "a": "<b>Tab Management & Window Handles:</b><br>• <b>Mechanism:</b> Browsers assign a unique string token (handle) to each open window/tab. WebDriver tracks these handles. You must capture the primary window handle first, trigger the action that launches the tab, iterate through all handles, switch focus, perform validations, close, and switch back to the main window.",\n        "code": "import org.openqa.selenium.WebDriver;\\nimport java.util.Set;\\npublic class TabSwitcher {\\n    public void handleTabs(WebDriver driver) {\\n        String parentHandle = driver.getWindowHandle();\\n        driver.findElement(org.openqa.selenium.By.id(\\"open-terms-btn\\")).click();\\n        \\n        Set<String> allHandles = driver.getWindowHandles();\\n        for (String handle : allHandles) {\\n            if (!handle.equals(parentHandle)) {\\n                driver.switchTo().window(handle); // Switch\\n                System.out.println(\\"New Tab Title: \\" + driver.getTitle());\\n                driver.close(); // Close tab\\n            }\\n        }\\n        driver.switchTo().window(parentHandle); // Return\\n    }\\n}"\n      },\n      {\n        "q": "Q11: Playwright Auto-Waiting Criteria\\nTASK: List the exact state validation checks Playwright triggers internally before clicking an element.",\n        "a": "<b>Playwright Actionability Checks:</b><br>• <b>Actionability:</b> Playwright runs automatic checks on targets before performing actions like click, double click, hover, or type. If the element doesn\'t meet these requirements within the timeout, the test fails with a TimeoutError.<br>• <b>Checks Triggered:</b><br>  1. <i>Attached:</i> Element is attached to the page\'s active DOM.<br>  2. <i>Visible:</i> Element has non-empty bounding box and is not styled as hidden.<br>  3. <i>Stable:</i> Bounding box layout is stable (no CSS transitions or animations moving it).<br>  4. <i>Enabled:</i> Element is not disabled by DOM properties.<br>  5. <i>Editable:</i> Element is an input and is editable (for typing actions).<br>  6. <i>Receives Events:</i> Element is not obscured or covered by overlays (like modal overlays, toast grids, loading spinners).",\n        "code": "// Code usage runs auto-waiting implicitly:\\n// await page.locator(\'#btn-submit\').click();\\n// Under the hood, Playwright polls all 6 actionability rules before clicking."\n      },\n      {\n        "q": "Q12: Inject cookies / session state\\nTASK: Save user session cookies after login and inject them into a new BrowserContext to bypass UI login flow in Playwright.",\n        "a": "<b>Session State Injection:</b><br>• <b>Mechanism:</b> Authenticating via UI takes time. To save execution time, login once via UI, capture browser state (cookies, local storage, indexedDB contents), write it to a local JSON file, and inject it into new browser contexts, immediately bypassing login steps.",\n        "code": "const { test } = require(\'@playwright/test\');\\n\\ntest(\'Bypass login using Storage State\', async ({ browser }) => {\\n  const tempContext = await browser.newContext();\\n  const page = await tempContext.newPage();\\n  await page.goto(\'https://example.com/login\');\\n  await page.fill(\'#user\', \'admin\');\\n  await page.fill(\'#pass\', \'secure123\');\\n  await page.click(\'#login-btn\');\\n  \\n  await tempContext.storageState({ path: \'state/auth.json\' });\\n  await tempContext.close();\\n\\n  // Launch new contexts pre-authenticated\\n  const authenticatedContext = await browser.newContext({\\n    storageState: \'state/auth.json\'\\n  });\\n  const page2 = await authenticatedContext.newPage();\\n  await page2.goto(\'https://example.com/dashboard\'); // Page loads logged in!\\n  await authenticatedContext.close();\\n});"\n      },\n      {\n        "q": "Q13: Trace Viewer in CI Pipelines\\nTASK: Enable network/screencast trace generation on first retry of failed tests programmatically in playwright.config.js.",\n        "a": "<b>Playwright Trace Viewer Config:</b><br>• <b>Concept:</b> Recording zip files (screencasts, snapshots, logs) consumes CPU and disk resources. We configure the runner to record traces ONLY when a test fails and is retried, keeping reports clean and resource usage low.",\n        "code": "const { defineConfig } = require(\'@playwright/test\');\\nmodule.exports = defineConfig({\\n  retries: 2, // Enable retries in CI\\n  use: {\\n    trace: \'on-first-retry\', // Record traces on retry\\n    screenshot: \'only-on-failure\',\\n    video: \'retain-on-failure\'\\n  }\\n});"\n      },\n      {\n        "q": "Q14: Partial element screenshots\\nTASK: Capture a screenshot of a specific chart element locator rather than the entire browser viewport.",\n        "a": "<b>Target Element Screenshots:</b><br>• <b>Concept:</b> Taking full-screen captures creates large files. Extracting a screenshot of a specific element is highly helpful for visual assertion checks, pixel-by-pixel comparisons, or bug logging.",\n        "code": "// --- Playwright (JS) Element Screenshot ---\\nawait page.locator(\'#user-growth-chart\').screenshot({ path: \'screenshots/growth_chart.png\' });\\n\\n// --- Selenium (Java) element screenshot ---\\n// File srcFile = driver.findElement(By.id(\\"user-growth-chart\\")).getScreenshotAs(OutputType.FILE);"\n      },\n      {\n        "q": "Q15: Custom UI Retry Logic\\nTASK: Implement a custom loop waiting for page content to update, retrying up to 5 times if a target element is not clickable.",\n        "a": "<b>Robust Action Wrapper Retry Loops:</b><br>• <b>Mechanism:</b> While explicit waits are standard, custom wrapper methods are useful to resolve minor environment issues, page loading hiccups, or transient overlays that delay clicks.",\n        "code": "import org.openqa.selenium.By;\\nimport org.openqa.selenium.WebDriver;\\npublic class ActionWrappers {\\n    public static void clickRetry(WebDriver driver, By locator) {\\n        int maxRetries = 5;\\n        for (int i = 0; i < maxRetries; i++) {\\n            try {\\n                driver.findElement(locator).click();\\n                return; // Successful execution, return\\n            } catch (Exception e) {\\n                System.out.println(\\"Attempt \\" + (i + 1) + \\" failed. Retrying in 1 second...\\");\\n                try { Thread.sleep(1000); } catch (InterruptedException ignored) {}\\n            }\\n        }\\n        throw new RuntimeException(\\"Failed to click element after 5 attempts: \\" + locator);\\n    }\\n}"\n      },\n      {\n        "q": "Q16: Concurrently Running Multi-Locale Browsers\\nTASK: Create browser context settings setting location, timezone, and language to \'fr-FR\' dynamically in Playwright.",\n        "a": "<b>Localization & Geolocation in Playwright:</b><br>• <b>Mechanism:</b> Testing localized applications requires modifying headers and system values. Playwright allows defining locales, timezones, geolocations, and permissions per `BrowserContext`, enabling concurrent testing of different locales.",\n        "code": "const { chromium } = require(\'playwright\');\\nasync function localizationTest() {\\n  const browser = await chromium.launch();\\n  const frenchContext = await browser.newContext({\\n    locale: \'fr-FR\',\\n    timezoneId: \'Europe/Paris\',\\n    geolocation: { latitude: 48.8584, longitude: 2.2945 },\\n    permissions: [\'geolocation\']\\n  });\\n  const page = await frenchContext.newPage();\\n  await page.goto(\'https://www.google.com\'); // Loads in French\\n  await browser.close();\\n}"\n      },\n      {\n        "q": "Q17: Lazy Initialization in Page Object Model (POM)\\nTASK: Implement lazy initialization of web elements in page objects using PageFactory in Selenium.",\n        "a": "<b>Lazy Initialization in Selenium (PageFactory):</b><br>• <b>Mechanism:</b> The PageFactory class initializes elements when `PageFactory.initElements()` is called. It creates proxy objects for elements annotated with `@FindBy`. The DOM lookup is deferred until you call a method (like `.click()`) on the proxy object.",\n        "code": "import org.openqa.selenium.WebDriver;\\nimport org.openqa.selenium.WebElement;\\nimport org.openqa.selenium.support.FindBy;\\nimport org.openqa.selenium.support.PageFactory;\\n\\npublic class DashboardPage {\\n    @FindBy(id = \\"dashboard-grid\\") \\n    private WebElement dashboardGrid;\\n    \\n    public DashboardPage(WebDriver driver) {\\n        PageFactory.initElements(driver, this);\\n    }\\n    \\n    public boolean isDashboardLoaded() {\\n        return dashboardGrid.isDisplayed(); // DOM lookup happens here!\\n    }\\n}"\n      },\n      {\n        "q": "Q18: Auto-dismissing Alerts and Prompts\\nTASK: Write configurations to auto-accept confirm alert dialogs dynamically.",\n        "a": "<b>Dialog & Alert Handling:</b><br>• <b>Playwright:</b> Automatically dismisses dialogs by default. To custom handle dialogs, register a dialog event listener `page.on(\'dialog\')` before triggering the dialog. You can then accept or dismiss them.<br>• <b>Selenium:</b> Requires switching focus to the active alert using `driver.switchTo().alert()` and calling `.accept()` or `.dismiss()`.",\n        "code": "// --- Playwright Dialog interceptor ---\\npage.on(\'dialog\', async dialog => {\\n    console.log(\'Dialog prompt: \' + dialog.message());\\n    await dialog.accept(\'Custom text input\'); // Accepts confirm alert\\n});\\nawait page.click(\'#trigger-alert-btn\');\\n\\n// --- Selenium Java dialog accept ---\\n// driver.switchTo().alert().accept();"\n      },\n      {\n        "q": "Q19: Text-based CSS Selectors\\nTASK: Locate a button containing text \'Submit Payment\' that sits inside card layout class \'.payment-box\' in Playwright.",\n        "a": "<b>Text-Based Selectors & Semantic Queries:</b><br>• <b>Concept:</b> Avoid using fragile, long XPath selectors (e.g. `/html/body/div[2]/div/button`). Playwright supports robust text-based selectors and page structure queries, improving test stability.",\n        "code": "const { test } = require(\'@playwright/test\');\\nasync function performClick(page) {\\n  // Using CSS selector combining text-based matching\\n  await page.locator(\'.payment-box button:has-text(\\"Submit Payment\\")\').click();\\n}"\n      },\n      {\n        "q": "Q20: Page Load Strategies in WebDrivers\\nTASK: Configure page load strategies programmatically inside WebDriver capabilities.",\n        "a": "<b>Page Load Strategies:</b><br>• <b>1. Normal:</b> Waits for the entire document to load, including secondary resources (images, scripts, subframes). This is the default strategy.<br>• <b>2. Eager:</b> WebDriver returns control immediately after `DOMContentLoaded` is finished (DOM is parsed, but images and stylesheets might still be loading).<br>• <b>3. None:</b> WebDriver returns control immediately after the initial page redirect is initiated. Use this when writing custom wait conditions.",\n        "code": "import org.openqa.selenium.PageLoadStrategy;\\nimport org.openqa.selenium.chrome.ChromeOptions;\\nimport org.openqa.selenium.WebDriver;\\nimport org.openqa.selenium.chrome.ChromeDriver;\\n\\npublic class CapDemo {\\n    public void setup() {\\n        ChromeOptions options = new ChromeOptions();\\n        options.setPageLoadStrategy(PageLoadStrategy.EAGER);\\n        WebDriver driver = new ChromeDriver(options);\\n    }\\n}"\n      }\n    ]\n  },\n  {\n    "category": "📮 Topic 3: API Automation (RestAssured & Karate - 20 Qs)",\n    "qs": [\n      {\n        "q": "Q1: SpecBuilder in RestAssured\\nTASK: Build reusable RequestSpecification and ResponseSpecification instances containing base URL, auth token, and status code verification.",\n        "a": "<b>REST Assured Spec Builders:</b><br>• <b>RequestSpecBuilder:</b> Allows consolidating common request attributes (such as baseURI, common authentication tokens, content-type, logging parameters, and custom headers) into a reusable template.<br>• <b>ResponseSpecBuilder:</b> Allows consolidating common response assertions (such as expected status code, content-type verification, and dynamic body schema rules) into a reusable template. This prevents redundant code across test suites.",\n        "code": "import io.restassured.builder.RequestSpecBuilder;\\nimport io.restassured.builder.ResponseSpecBuilder;\\nimport io.restassured.http.ContentType;\\nimport io.restassured.specification.RequestSpecification;\\nimport io.restassured.specification.ResponseSpecification;\\n\\npublic class SpecFactory {\\n    public static RequestSpecification buildRequestSpec() {\\n        return new RequestSpecBuilder()\\n            .setBaseUri(\\"https://api.example.com\\")\\n            .setContentType(ContentType.JSON)\\n            .addHeader(\\"Authorization\\", \\"Bearer token_token_123\\")\\n            .build();\\n    }\\n    \\n    public static ResponseSpecification buildResponseSpec() {\\n        return new ResponseSpecBuilder()\\n            .expectStatusCode(200)\\n            .expectContentType(ContentType.JSON)\\n            .build();\\n    }\\n}"\n      },\n      {\n        "q": "Q2: Karate vs RestAssured POJO\\nTASK: Explain dynamic payload structure generation difference between Karate file variables and RestAssured POJO serialization.",\n        "a": "<b>Payload Serialization: Karate vs REST Assured:</b><br>• <b>REST Assured:</b> Operates in Java. To build dynamic JSON payloads, you define Plain Old Java Objects (POJOs) matching your schema structure. An object mapper library (like Jackson or Gson) is required to serialize these POJOs into JSON strings at runtime. This requires writing model classes, which can be verbose but provides compile-time type safety.<br>• <b>Karate:</b> Written in Gherkin-like features. It parses and handles JSON natively. You can write JSON structures directly inside scripts (`* def user = { name: \'Abhishek\' }`) or load JSON files and modify key values dynamically, without needing serialization wrapper classes.",\n        "code": "// --- RestAssured (Java): POJO Serialization ---\\n// given().body(new Payload(\\"Abhishek\\")).post(\\"/user\\"); // Serialized via Jackson\\n\\n// --- Karate: Native JSON ---\\n// * def payload = read(\'classpath:templates/user.json\')\\n// * set payload.name = \'Abhishek\'\\n// Given request payload"\n      },\n      {\n        "q": "Q3: JsonPath Array Traversing\\nTASK: Write JsonPath queries using RestAssured to extract all ids from response body having status \'ACTIVE\'.",\n        "a": "<b>GPath in REST Assured JsonPath:</b><br>• <b>Mechanism:</b> REST Assured\'s `JsonPath` uses Groovy-based GPath syntax. This allows running queries (like `findAll`, `collect`, `min`, `max`) on the response body JSON structures inline, without needing loops.",\n        "code": "import io.restassured.response.Response;\\nimport java.util.List;\\npublic class JsonPathTraverser {\\n    public List<Integer> getActiveUserIds(Response response) {\\n        // \'it\' represents the current array element\\n        return response.jsonPath().getList(\\"findAll { it.status == \'ACTIVE\' }.id\\");\\n    }\\n}"\n      },\n      {\n        "q": "Q4: API Chaining — Bearer Token extraction\\nTASK: Write RestAssured code to POST to login, extract JWT token from response, and inject it as header in next GET call.",\n        "a": "<b>API Chaining & Token Injection:</b><br>• <b>Mechanism:</b> Chaining requires extracting values from a response payload or headers, and passing them to subsequent requests. In REST Assured, use `.extract().path(\\"key\\")` to retrieve the token value, and pass it dynamically inside downstream request headers.",\n        "code": "import static io.restassured.RestAssured.given;\\npublic class APIChaining {\\n    public void runChainedTest() {\\n        String loginBody = \\"{ \\\\\\"username\\\\\\": \\\\\\"admin\\\\\\", \\\\\\"password\\\\\\": \\\\\\"pass\\\\\\" }\\";\\n        \\n        // Step 1: Login and extract token\\n        String token = given()\\n            .contentType(\\"application/json\\")\\n            .body(loginBody)\\n        .when()\\n            .post(\\"https://api.example.com/v1/login\\")\\n        .then()\\n            .statusCode(200)\\n            .extract().path(\\"auth_token\\");\\n            \\n        // Step 2: Inject token into downstream GET request\\n        given()\\n            .header(\\"Authorization\\", \\"Bearer \\" + token)\\n        .when()\\n            .get(\\"https://api.example.com/v1/profile\\")\\n        .then()\\n            .statusCode(200);\\n    }\\n}"\n      },\n      {\n        "q": "Q5: Multipart Form-Data File Upload\\nTASK: Write RestAssured request uploading local file \'data.csv\' along with text parameter \'metadata\'.",\n        "a": "<b>Multipart Form File Uploads:</b><br>• <b>Mechanism:</b> File uploads utilize `multipart/form-data` encoding. In REST Assured, use the `.multiPart()` method. It automatically sets the Content-Type header and boundary markers.",\n        "code": "import static io.restassured.RestAssured.given;\\nimport java.io.File;\\npublic class FileUploader {\\n    public void uploadFile() {\\n        File csvFile = new File(\\"src/test/resources/data.csv\\");\\n        given()\\n            .multiPart(\\"file\\", csvFile)\\n            .multiPart(\\"metadata\\", \\"{\'env\':\'staging\'}\\")\\n        .when()\\n            .post(\\"https://api.example.com/v1/import\\")\\n        .then()\\n            .statusCode(201);\\n    }\\n}"\n      },\n      {\n        "q": "Q6: JSON Schema Validation\\nTASK: Assert response structure matches classpath schema definition \'schemas/user_schema.json\' in RestAssured.",\n        "a": "<b>JSON Schema Validation:</b><br>• <b>Concept:</b> Validating field values does not guarantee the overall response structure is correct. JSON Schema validation matches the complete API response schema against a pre-defined schema contract, catching type mismatches or missing fields.",\n        "code": "import static io.restassured.RestAssured.given;\\nimport static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;\\npublic class SchemaValidator {\\n    public void testUserSchema() {\\n        given()\\n            .get(\\"https://api.example.com/users/100\\")\\n        .then()\\n            .statusCode(200)\\n            .body(matchesJsonSchemaInClasspath(\\"schemas/user_schema.json\\"));\\n    }\\n}"\n      },\n      {\n        "q": "Q7: Bypassing SSL validation\\nTASK: Configure RestAssured client execution configurations to trust self-signed or invalid SSL certificates.",\n        "a": "<b>Bypassing SSL Verification:</b><br>• <b>Concept:</b> Test environments frequently use self-signed or invalid SSL certificates, which can cause connection errors during request execution. Use relaxed HTTPS validation to bypass these SSL verification checks.",\n        "code": "import io.restassured.RestAssured;\\npublic class SSLHandler {\\n    public static void bypassSSL() {\\n        // Globally ignore SSL verification issues\\n        RestAssured.useRelaxedHTTPSValidation();\\n    }\\n}"\n      },\n      {\n        "q": "Q8: Path vs Query vs Form Parameters\\nTASK: Write a request using RestAssured illustrating parameters differentiation.",\n        "a": "<b>Request Parameters Types:</b><br>• <b>1. Path Parameters:</b> Replaces placeholders in the URL path template (e.g. `/users/{id}`).<br>• <b>2. Query Parameters:</b> Appends parameters after the URL `?` symbol (e.g. `/search?q=query`).<br>• <b>3. Form Parameters:</b> Sends parameters in the request body using `application/x-www-form-urlencoded` encoding (commonly used for web forms).",\n        "code": "import static io.restassured.RestAssured.given;\\npublic class ParametersDemo {\\n    public void sendParams() {\\n        given()\\n            .pathParam(\\"userId\\", \\"101\\")               // Replaces {userId}\\n            .queryParam(\\"locale\\", \\"en-US\\")             // Appends ?locale=en-US\\n            .formParam(\\"device_type\\", \\"mobile\\")        // Sent in body\\n        .when()\\n            .post(\\"https://api.example.com/v1/users/{userId}/config\\")\\n        .then()\\n            .statusCode(200);\\n    }\\n}"\n      },\n      {\n        "q": "Q9: Handling HTTP 429 Rate Limiting\\nTASK: Write a polling loop intercepting rate limit Retry-After header, sleeping the thread before retrying the call.",\n        "a": "<b>Rate Limiting (HTTP 429) & Retry-After Handling:</b><br>• <b>Mechanism:</b> When API calls exceed limits, servers return a `429 Too Many Requests` status code along with a `Retry-After` header specifying the delay (in seconds) before new calls are accepted. Catch this response, parse the header value, put the thread to sleep, and retry the request.",\n        "code": "import io.restassured.response.Response;\\nimport static io.restassured.RestAssured.get;\\npublic class RateLimiter {\\n    public Response executeWithRetry(String endpoint) {\\n        Response response = get(endpoint);\\n        if (response.getStatusCode() == 429) {\\n            String retryHeader = response.getHeader(\\"Retry-After\\");\\n            int waitSeconds = (retryHeader != null) ? Integer.parseInt(retryHeader) : 5;\\n            try {\\n                Thread.sleep(waitSeconds * 1000L);\\n            } catch (InterruptedException ignored) {}\\n            return get(endpoint); // Retry\\n        }\\n        return response;\\n    }\\n}"\n      },\n      {\n        "q": "Q10: Karate CSV Data Driven Tests\\nTASK: Write a Karate feature file outline executing tests dynamically from a local CSV data file.",\n        "a": "<b>Data-Driven Testing in Karate:</b><br>• <b>Concept:</b> Karate supports reading external CSV or JSON files inside a `Scenario Outline`. It automatically executes the scenario loop once for each row in the file.",\n        "code": "Feature: Dynamic User Validation\\n\\n  Scenario Outline: Validate active users via CSV data\\n    Given url \'https://api.example.com/v1/users\'\\n    And path \'<userId>\'\\n    When method get\\n    Then status 200\\n    And match response.email == \'<email>\'\\n    Examples:\\n      | read(\'classpath:data/user_data.csv\') |"\n      },\n      {\n        "q": "Q11: Log Configuration for Debugging\\nTASK: Configure RestAssured request logging to write details only if validation assertions fail.",\n        "a": "<b>Conditional Logging:</b><br>• <b>Concept:</b> Logging all requests and responses in CI pipelines increases log sizes. Configure conditional logging to output request details only when assertions fail, keeping pipeline logs clean.",\n        "code": "import static io.restassured.RestAssured.given;\\npublic class TestLogger {\\n    public void getLogDetails() {\\n        given()\\n            .log().ifValidationFails()\\n            .get(\\"https://api.example.com/v1/status\\")\\n        .then()\\n            .log().ifValidationFails()\\n            .statusCode(200);\\n    }\\n}"\n      },\n      {\n        "q": "Q12: Karate Javascript Functions\\nTASK: Run inline Javascript code in Karate feature file to dynamically format a timestamp.",\n        "a": "<b>Karate JS Functions:</b><br>• <b>Concept:</b> Karate features can execute JavaScript functions directly. Use this to dynamically format timestamps, generate IDs, or encrypt parameters.",\n        "code": "Feature: Dynamic Utility Helper\\n  Scenario: Generate dynamic parameters using Javascript\\n    * def getTimestamp = function() { return java.lang.System.currentTimeMillis(); }\\n    * def ts = getTimestamp()\\n    Given url \'https://api.example.com/v1/logs\'\\n    And request { eventId: \'EVT-\' + ts }"\n      },\n      {\n        "q": "Q13: Mocking API using WireMock\\nTASK: Initialize a mock server using WireMock, configuring a mock mapping returning status 200 and custom headers.",\n        "a": "<b>WireMock Mocking:</b><br>• <b>Concept:</b> WireMock spins up a local mock HTTP server that simulates actual APIs. Stub mappings define how the mock server responds to matching request methods and headers.",\n        "code": "import com.github.tomakehurst.wiremock.WireMockServer;\\nimport static com.github.tomakehurst.wiremock.client.WireMock.*;\\npublic class WireMockConfig {\\n    public static void setupMockServer() {\\n        WireMockServer server = new WireMockServer(8089);\\n        server.start();\\n        configureFor(\\"localhost\\", 8089);\\n        stubFor(get(urlEqualTo(\\"/v1/health\\"))\\n            .willReturn(aResponse()\\n                .withStatus(200)\\n                .withHeader(\\"Content-Type\\", \\"application/json\\")\\n                .withBody(\\"{ \\\\\\"status\\\\\\": \\\\\\"UP\\\\\\" }\\")));\\n    }\\n}"\n      },\n      {\n        "q": "Q14: OAuth 2.0 Auth Code Flow\\nTASK: Write API requests using RestAssured fetching token using grant_type client_credentials.",\n        "a": "<b>OAuth 2.0 Client Credentials Grant:</b><br>• <b>Concept:</b> Commonly used for machine-to-machine authorization. Send credentials to the token server using form parameters, extract the access token, and pass it inside the Authorization header for subsequent API calls.",\n        "code": "import static io.restassured.RestAssured.given;\\npublic class OAuthController {\\n    public String getOAuth2Token() {\\n        return given()\\n            .formParam(\\"grant_type\\", \\"client_credentials\\")\\n            .formParam(\\"client_id\\", \\"client_id_noida\\")\\n            .formParam(\\"client_secret\\", \\"sec_secret_gurugram\\")\\n        .when()\\n            .post(\\"https://auth.example.com/oauth/token\\")\\n        .then()\\n            .statusCode(200)\\n            .extract().path(\\"access_token\\");\\n    }\\n}"\n      },\n      {\n        "q": "Q15: Decompress GZip API Response\\nTASK: Configure RestAssured decoder config to support fetching and parsing gzip compressed API data.",\n        "a": "<b>GZip Decompression in REST Assured:</b><br>• <b>Concept:</b> Servers use GZip compression (`Content-Encoding: gzip`) to reduce bandwidth and speed up responses. REST Assured is configured to handle decompression automatically by default, but you can explicitly define decoders inside `DecoderConfig` to resolve issues with custom headers.",\n        "code": "import io.restassured.RestAssured;\\nimport io.restassured.config.DecoderConfig;\\nimport io.restassured.config.RestAssuredConfig;\\n\\npublic class Decompressor {\\n    public static void configureDecompress() {\\n        RestAssured.config = RestAssuredConfig.newConfig()\\n            .decoderConfig(DecoderConfig.decoderConfig()\\n                .defaultContentDecoder(DecoderConfig.ContentDecoder.GZIP));\\n    }\\n}"\n      },\n      {\n        "q": "Q16: Schema Check for Empty Array\\nTASK: Write JSON Schema matcher verifying dynamic array exists but holds 0 elements.",\n        "a": "<b>JSON Schema Array Rules:</b><br>• <b>Concept:</b> Ensure elements arrays exist but do not contain items. Define `minItems: 0` and `maxItems: 0` constraints inside JSON Schema files, then run schema validation matching assertions on the target body path.",\n        "code": "// --- Schema Definition (classpath:schemas/empty_user_schema.json) ---\\n// {\\n//   \\"type\\": \\"object\\",\\n//   \\"properties\\": {\\n//     \\"users\\": { \\"type\\": \\"array\\", \\"minItems\\": 0, \\"maxItems\\": 0 }\\n//   },\\n//   \\"required\\": [\\"users\\"]\\n// }\\n// --- Java Assertion ---\\n// given().get(\\"/users/empty\\").then().body(matchesJsonSchemaInClasspath(\\"schemas/empty_user_schema.json\\"));"\n      },\n      {\n        "q": "Q17: Serialization using Jackson ObjectMapper\\nTASK: Write Jackson ObjectMapper snippet mapping Java Map payload directly into dynamic raw JSON String.",\n        "a": "<b>Jackson Serialization:</b><br>• <b>Concept:</b> In REST Assured, you can pass a java Map directly as request body. Under the hood, Jackson uses its `ObjectMapper` to serialize the Map structure into a raw JSON string.",\n        "code": "import com.fasterxml.jackson.databind.ObjectMapper;\\nimport java.util.HashMap;\\nimport java.util.Map;\\npublic class Serializer {\\n    public static String getJsonString() throws Exception {\\n        Map<String, Object> payload = new HashMap<>();\\n        payload.put(\\"name\\", \\"Abhishek\\");\\n        payload.put(\\"experience_years\\", 7);\\n        \\n        ObjectMapper mapper = new ObjectMapper();\\n        return mapper.writeValueAsString(payload);\\n    }\\n}"\n      },\n      {\n        "q": "Q18: Asserting Headers in RestAssured\\nTASK: Fetch API response and assert Server header matches \'nginx\' exactly.",\n        "a": "<b>Header Assertions:</b><br>• <b>Concept:</b> API security policies require validating response headers (such as `Server`, `X-Content-Type-Options`). Assert these header values directly using `.header()` assertions.",\n        "code": "import static io.restassured.RestAssured.given;\\nimport static org.hamcrest.Matchers.equalTo;\\npublic class HeaderValidator {\\n    public void validateResponseHeaders() {\\n        given()\\n            .get(\\"https://api.example.com/health\\")\\n        .then()\\n            .header(\\"Server\\", equalTo(\\"nginx\\"));\\n    }\\n}"\n      },\n      {\n        "q": "Q19: API Performance assertions\\nTASK: Write response validation checks checking if server response time is below 800 milliseconds.",\n        "a": "<b>API Response Time Assertions:</b><br>• <b>Concept:</b> Slow APIs degrade user experience. Validate response times using REST Assured\'s `.time(matcher)` assertion.",\n        "code": "import static io.restassured.RestAssured.given;\\nimport static org.hamcrest.Matchers.lessThan;\\npublic class PerformanceCheck {\\n    public void testResponseLatency() {\\n        given()\\n            .get(\\"https://api.example.com/v1/endpoints\\")\\n        .then()\\n            .time(lessThan(800L)); // milliseconds\\n    }\\n}"\n      },\n      {\n        "q": "Q20: PATCH vs PUT HTTP Request Methods\\nTASK: Describe differences between PATCH and PUT, and write requests demonstrating their use.",\n        "a": "<b>PATCH vs PUT HTTP Methods:</b><br>• <b>PUT:</b> Replaces the target resource representation entirely. You must send the complete resource payload. If a field is omitted, it is nullified or reset by the server.<br>• <b>PATCH:</b> Applies partial modifications to a resource. Send only the fields being modified. Unspecified fields remain unchanged.",\n        "code": "import static io.restassured.RestAssured.given;\\npublic class MethodComparison {\\n    public void testHttpMethods() {\\n        // PUT (Replace)\\n        given().body(\\"{\\\\\\"name\\\\\\":\\\\\\"Abhishek\\\\\\",\\\\\\"role\\\\\\":\\\\\\"Admin\\\\\\"}\\").put(\\"/users/101\\");\\n        // PATCH (Partial)\\n        given().body(\\"{\\\\\\"role\\\\\\":\\\\\\"Manager\\\\\\"}\\").patch(\\"/users/101\\");\\n    }\\n}"\n      }\n    ]\n  },\n  {\n    "category": "⛓ Topic 4: CI/CD, Git & Test Infrastructure (20 Qs)",\n    "qs": [\n      {\n        "q": "Q1: Git Merge vs Rebase\\nTASK: Describe the difference between Git Merge and Git Rebase. When would you use which in a QA team?",\n        "a": "<b>Git Merge vs Rebase:</b><br>• <b>Git Merge:</b> Joins histories. It creates a new merge commit pointing to both the master and feature branches, retaining the original branch commit logs. This preserves historical context but can lead to a messy commit graph if there are frequent merges.<br>• <b>Git Rebase:</b> Rewrites history. It moves all commits from the feature branch and applies them sequentially on top of the target branch (e.g. master), producing a clean, linear commit history. However, it rewrites commit SHAs, which can cause issues on shared remote branches.<br>• <b>QA Application:</b> Use rebase on local feature branches before opening Pull Requests to keep master history linear. Use merge for integrating branches back into mainline branches (like master or main) to preserve historical merge context.",\n        "code": "# 1. Clean rebase of local feature branch on master:\\ngit checkout feature/ui-tests\\ngit fetch origin\\ngit rebase origin/master\\ngit push origin feature/ui-tests --force-with-lease"\n      },\n      {\n        "q": "Q2: Git Stash\\nTASK: Write Git commands to save local work-in-progress modifications, switch to another branch to fix a bug, and restore modifications.",\n        "a": "<b>Git Stash Flow:</b><br>• <b>Concept:</b> Git stash saves modified tracked files and untracked files (using `--include-untracked`) to a temporary stack, reverting your working directory to match the HEAD commit. This allows switching branches without losing uncommitted work.",\n        "code": "# Save local modifications\\ngit stash save \\"WIP: Playwright relative locator tests\\" --include-untracked\\n\\n# Switch branch and apply hotfix\\ngit checkout hotfix/api-headers\\n# ... commit changes ...\\n\\n# Return and restore stashed work\\ngit checkout feature/ui-tests\\ngit stash pop"\n      },\n      {\n        "q": "Q3: Jenkins Declarative Pipeline Structure\\nTASK: Write a simple Declarative Jenkinsfile containing stages for Setup, Execute Tests, and Archive Reports.",\n        "a": "<b>Declarative Jenkins Pipeline:</b><br>• <b>Concept:</b> Declarative pipelines provide a structured Gherkin-like syntax to define CI processes. The `pipeline` block contains directive stages, steps, and post-build actions. Use the `post` block to clean up resources or archive reports, ensuring reports are saved even if tests fail.",\n        "code": "pipeline {\\n    agent any\\n    stages {\\n        stage(\'Setup\') {\\n            steps { sh \'npm ci\' }\\n        }\\n        stage(\'Test\') {\\n            steps { sh \'npm run test:ci\' }\\n        }\\n    }\\n    post {\\n        always {\\n            archiveArtifacts artifacts: \'playwright-report/**/*\', allowEmptyArchive: false\\n        }\\n    }\\n}"\n      },\n      {\n        "q": "Q4: Parallel Execution in Jenkinsfile\\nTASK: Write a Jenkinsfile snippet configured to run UI and API test execution stages in parallel.",\n        "a": "<b>Parallel Execution in Jenkins:</b><br>• <b>Concept:</b> Running independent test stages in parallel reduces total execution time. Use the `parallel` block inside a stage to run nested stages concurrently across available worker agents.",\n        "code": "stage(\'Concurrent Test Runs\') {\\n    parallel {\\n        stage(\'UI Test Suite\') {\\n            steps { sh \'npx playwright test\' }\\n        }\\n        stage(\'API Test Suite\') {\\n            steps { sh \'mvn clean test -Dsuite=api\' }\\n        }\\n    }\\n}"\n      },\n      {\n        "q": "Q5: Dockerized Test Runners\\nTASK: Build a Dockerfile setting up Node and Playwright dependencies to execute headless tests inside a container.",\n        "a": "<b>Dockerized Playwright Runners:</b><br>• <b>Concept:</b> Running tests inside Docker containers guarantees a consistent execution environment across local machines and CI agents. Playwright provides pre-configured base images containing required browsers and OS dependencies, preventing browser launching errors in headless execution.",\n        "code": "# Use official Playwright base image containing system browsers\\nFROM mcr.microsoft.com/playwright:v1.44.0-jammy\\nWORKDIR /usr/src/app\\nCOPY package*.json ./\\nRUN npm ci\\nCOPY . .\\nCMD [\\"npx\\", \\"playwright\\", \\"test\\"]"\n      },\n      {\n        "q": "Q6: Dynamic Maven Parameters in Jenkins\\nTASK: Write shell script parameters passing dynamic env and tags from Jenkins build parameters variables into Maven run command.",\n        "a": "<b>Parameterizing CI Pipelines:</b><br>• <b>Concept:</b> Map Jenkins build parameters to environment variables inside the pipeline block, then pass them to build tools (like Maven) using command-line flags. This allows triggering builds with custom configurations (like specific environments or test groups).",\n        "code": "pipeline {\\n    agent any\\n    parameters {\\n        choice(name: \'TEST_ENV\', choices: [\'QA\', \'STAGING\'], description: \'Target Env\')\\n        string(name: \'TEST_GROUPS\', defaultValue: \'Smoke\', description: \'Target Groups\')\\n    }\\n    stages {\\n        stage(\'Execute Suite\') {\\n            steps {\\n                sh \\"mvn clean test -Denv=${params.TEST_ENV} -Dgroups=${params.TEST_GROUPS}\\"\\n            }\\n        }\\n    }\\n}"\n      },\n      {\n        "q": "Q7: GitLab CI Pipeline Configuration\\nTASK: Create a basic .gitlab-ci.yml definition exposing stages, cached directories, and runner tags.",\n        "a": "<b>GitLab CI Configurations:</b><br>• <b>Concept:</b> GitLab CI uses a `.gitlab-ci.yml` file in the repository root to define pipeline steps. The `cache` directive preserves dependencies (such as node_modules) between jobs. Use `artifacts` to save test reports, making them downloadable from the GitLab web UI.",\n        "code": "stages:\\n  - install\\n  - execution\\n\\ncache:\\n  paths:\\n    - node_modules/\\n\\ninstall_deps:\\n  stage: install\\n  script: [\\"npm ci\\"]\\n  tags: [\\"sdet-docker-runner\\"]\\n\\nrun_playwright:\\n  stage: execution\\n  script: [\\"npx playwright test\\"]\\n  artifacts:\\n    when: always\\n    paths: [\\"playwright-report/\\"]\\n  tags: [\\"sdet-docker-runner\\"]"\n      },\n      {\n        "q": "Q8: Triggering Pipelines via Webhooks\\nTASK: Describe how you configure a GitHub webhook to trigger a Jenkins pipeline only on Pull Request merges to the \'master\' branch.",\n        "a": "<b>Triggering Pipelines via Webhooks:</b><br>• <b>Mechanism:</b> Webhooks notify external servers (like Jenkins) when events occur in your repository. To trigger a pipeline on PR merges, register a webhook in GitHub repository settings. Set the webhook payload URL to point to your Jenkins trigger endpoint. Select only the `pull_request` event. In Jenkins, use filters to process payloads and trigger builds only when `action` equals `closed` and `merged` is `true`.",\n        "code": "// Configure Generic Webhook Trigger parameters in Jenkins:\\n// Variable PR_ACTION = $.action\\n// Variable PR_MERGED = $.pull_request.merged\\n// Variable TARGET_BRANCH = $.pull_request.base.ref\\n// Trigger Filter: PR_ACTION == \\"closed\\" && PR_MERGED == \\"true\\" && TARGET_BRANCH == \\"master\\""\n      },\n      {\n        "q": "Q9: Secret Management in Pipelines\\nTASK: Write code accessing environment secrets stored inside GitLab CI variables or Jenkins credential manager.",\n        "a": "<b>Pipeline Secret Management:</b><br>• <b>Safety:</b> Never hardcode credentials (passwords, tokens, API keys) in your repository files. Inject them as environment variables inside your CI/CD configuration (GitLab CI/CD variables or Jenkins Credential Store) and read them dynamically inside your test code.",\n        "code": "// --- Java ---\\nString apiKey = System.getenv(\\"API_SECRET_KEY\\");\\n\\n// --- JavaScript ---\\n// const apiKey = process.env.API_SECRET_KEY;"\n      },\n      {\n        "q": "Q10: Playwright Test Sharding\\nTASK: Configure Playwright command arguments to shard test executions across 3 separate parallel execution instances in CI.",\n        "a": "<b>Playwright Test Sharding:</b><br>• <b>Concept:</b> Test sharding splits a test suite into smaller subsets executed concurrently across separate machines. This scales execution linearly and reduces overall runtime.",\n        "code": "# Shard 1 of 3:\\nnpx playwright test --shard=1/3\\n# Shard 2 of 3:\\nnpx playwright test --shard=2/3\\n# Shard 3 of 3:\\nnpx playwright test --shard=3/3"\n      },\n      {\n        "q": "Q11: Git Fetch vs Git Pull\\nTASK: What is the differences between git fetch and git pull? Why is fetch preferred in CI scripts?",\n        "a": "<b>Git Fetch vs Git Pull:</b><br>• <b>Git Fetch:</b> Downloads all new commits, branches, and tags from the remote repository without merging them into your local branch. This is safe because it doesn\'t modify your local working directory files.<br>• <b>Git Pull:</b> Runs `git fetch` and then immediately merges the changes into your current local branch. This can trigger merge conflicts that fail automated execution.<br>• <b>CI Preference:</b> CI environments use `git fetch` combined with `git checkout FETCH_HEAD` to check out specific commits or references without running merge logic.",\n        "code": "git fetch origin master\\ngit checkout -qf FETCH_HEAD\\ngit reset --hard FETCH_HEAD"\n      },\n      {\n        "q": "Q12: Mitigating Flaky Builds via Pipeline Retries\\nTASK: Configure Jenkins pipeline stage options to retry failed test runs automatically up to 2 times before marking build failed.",\n        "a": "<b>Mitigating Flakiness via Retries:</b><br>• <b>Concept:</b> Network hiccups or dynamic loading delays can cause transient test failures (flakiness). Configure the pipeline to retry failed steps/stages before marking the build as failed, preventing false pipeline failures.",\n        "code": "pipeline {\\n    agent any\\n    stages {\\n        stage(\'Execution Run\') {\\n            steps {\\n                retry(2) {\\n                    sh \'npx playwright test\'\\n                }\\n            }\\n        }\\n    }\\n}"\n      },\n      {\n        "q": "Q13: Archiving Extent and Allure Reports\\nTASK: Write Jenkinsfile post actions displaying test results dynamically using HTML Publisher plugin.",\n        "a": "<b>Publishing Reports in Jenkins:</b><br>• <b>Concept:</b> Test reports need to be easily accessible from the build page. Use the HTML Publisher plugin to publish reports on the Jenkins dashboard.",\n        "code": "post {\\n    always {\\n        publishHTML([\\n            allowMissing: false,\\n            alwaysLinkToLastBuild: true,\\n            keepAll: true,\\n            reportDir: \'target/allure-report\',\\n            reportFiles: \'index.html\',\\n            reportName: \'Allure Execution Report\',\\n            reportTitles: \'Overview\'\\n        ])\\n    }\\n}"\n      },\n      {\n        "q": "Q14: Docker Compose for Test Infrastructures\\nTASK: Write a docker-compose.yml setting up selenium hub, chrome browser nodes, and test container.",\n        "a": "<b>Selenium Grid with Docker Compose:</b><br>• <b>Concept:</b> Spanning a Selenium Grid manually is complex. Docker Compose allows launching a Selenium Hub and browser nodes in separate containers using a single configuration file.",\n        "code": "version: \'3.8\'\\nservices:\\n  selenium-hub:\\n    image: selenium/hub:4.10.0\\n    ports:\\n      - \\"4444:4444\\"\\n  chrome-node:\\n    image: selenium/node-chrome:4.10.0\\n    depends_on: [\\"selenium-hub\\"]\\n    environment:\\n      - SE_EVENT_BUS_HOST=selenium-hub\\n      - SE_EVENT_BUS_PUBLISH_PORT=4442\\n      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443"\n      },\n      {\n        "q": "Q15: Git Cherry-Pick\\nTASK: Explain a scenario where you would use git cherry-pick in test automation repository workflow.",\n        "a": "<b>Git Cherry-Pick:</b><br>• <b>Concept:</b> Applies the changes introduced by an existing commit from another branch and registers them as a new commit on your current branch. This allows applying specific bug fixes or changes without merging the entire source branch.",\n        "code": "# Checkout release branch\\ngit checkout release/v2.1\\n# Cherry-pick a specific fix commit from feature branch\\ngit cherry-pick b9f8a7e3"\n      },\n      {\n        "q": "Q16: Resetting Repository Workspace in CI\\nTASK: Write Git cleanup commands to wipe untracked files and revert modifications between runner executions.",\n        "a": "<b>Wiping Build Workspace:</b><br>• <b>Concept:</b> Leftover files from previous builds can cause tests to fail. Before checking out code, run git commands to clean up and reset the workspace to a clean state.",\n        "code": "# Revert modifications to tracked files\\ngit reset --hard HEAD\\n# Wipes untracked files and directories\\ngit clean -fd"\n      },\n      {\n        "q": "Q17: GitLab Artifacts vs Cache\\nTASK: Explain difference between artifacts: and cache: inside .gitlab-ci.yml.",\n        "a": "<b>GitLab CI Artifacts vs Cache:</b><br>• <b>Cache:</b> Used to preserve project dependencies (such as node_modules, .m2 dependencies) between jobs. It is optimized to speed up build setup and is not meant to save test results.<br>• <b>Artifacts:</b> Used to save test output (such as HTML reports, logs, screenshots) that are created during job execution. Artifacts are uploaded to GitLab and can be downloaded from the pipeline page.",\n        "code": "# cache: preserves build files to speed up pipeline runs\\n# artifacts: archives test results for download"\n      },\n      {\n        "q": "Q18: Slack Notifications Integration\\nTASK: Write a pipeline failure step sending notifications to a Slack channel webhook.",\n        "a": "<b>Slack Notifications:</b><br>• <b>Concept:</b> Set up notifications in the `post.failure` block to alert team members immediately when a pipeline fails.",\n        "code": "post {\\n    failure {\\n        slackSend (\\n            channel: \'#automation-builds\',\\n            color: \'#FF0000\',\\n            message: \\"❌ BUILD FAILED: Job \'${env.JOB_NAME}\' [Build #${env.BUILD_NUMBER}]\\"\\n        )\\n    }\\n}"\n      },\n      {\n        "q": "Q19: Jenkins Shared Libraries\\nTASK: Describe structure and integration of a shared pipeline library to execute standard git checkout commands.",\n        "a": "<b>Jenkins Shared Libraries:</b><br>• <b>Concept:</b> Shared Libraries allow reusing pipeline code across different projects. The library is stored in a separate Git repository and imported into pipelines using the `@Library` annotation. Reusable steps are defined inside the `vars/` directory.",\n        "code": "// vars/checkoutGit.groovy\\n// def call(String repoUrl, String branchName) {\\n//     git url: repoUrl, branch: branchName, credentialsId: \'git-credentials\'\\n// }"\n      },\n      {\n        "q": "Q20: Headless execution Display Server (Xvfb)\\nTASK: Configure virtual display server before running Selenium browser test scripts inside headless Linux nodes.",\n        "a": "<b>Virtual Display Server (Xvfb):</b><br>• <b>Concept:</b> Linux servers running in headless mode lack a GUI display. Browsers that require a display server to launch will throw errors. Start a virtual display server (Xvfb) to simulate a display buffer for browser executions.",\n        "code": "# Start Xvfb (Virtual Framebuffer) on display port :99 in background\\nXvfb :99 -screen 0 1280x1024x24 &\\nexport DISPLAY=:99\\nmvn clean test"\n      }\n    ]\n  },\n  {\n    "category": "⚡ Topic 5: FURIOUS 50 Mixed Rapid-Fire (50 Qs)",\n    "qs": [\n      {\n        "q": "Q1: Default timeout of Playwright click event?\\nA: 30 seconds (30000ms).",\n        "a": "Playwright\'s default action timeout is 30 seconds. You can override it globally using `page.setDefaultTimeout()` or inside action options: `await page.click(\'#btn\', { timeout: 5000 });`."\n      },\n      {\n        "q": "Q2: Default timeout of page.goto() in Playwright?\\nA: 30 seconds. Can override via page.setDefaultNavigationTimeout().",\n        "a": "Default navigation timeout in Playwright is 30 seconds. You can override it globally using `page.setDefaultNavigationTimeout(15000)` or per navigation: `await page.goto(url, { timeout: 10000 });`."\n      },\n      {\n        "q": "Q3: Selenium default implicit wait value?\\nA: 0 seconds.",\n        "a": "Selenium\'s default implicit wait is 0 seconds. It is generally recommended to keep it at 0 and use explicit waits, as mixing implicit and explicit waits can cause unpredictable delays."\n      },\n      {\n        "q": "Q4: Exception thrown in Selenium if element is in DOM but has width/height 0?\\nA: ElementNotInteractableException.",\n        "a": "If an element exists in the DOM but cannot be interacted with (e.g. height/width is 0 or hidden), Selenium throws an `ElementNotInteractableException` (previously `ElementNotVisibleException`)."\n      },\n      {\n        "q": "Q5: How to run tests headfully in Playwright CLI?\\nA: npx playwright test --headed.",\n        "a": "Run Playwright tests headfully by appending the `--headed` flag: `npx playwright test --headed`. Alternatively, set `headless: false` inside `playwright.config.js`."\n      },\n      {\n        "q": "Q6: Command to record test interactions using Playwright code generator?\\nA: npx playwright codegen.",\n        "a": "Launch the code generator utility using `npx playwright codegen`. This opens a browser window and records user actions, generating code in your preferred programming language (JS, Java, Python, C#)."\n      },\n      {\n        "q": "Q7: RestAssured default authentication header scheme?\\nA: Basic.",\n        "a": "REST Assured supports multiple authentication schemes. The default is Basic auth: `given().auth().basic(\\"user\\", \\"password\\")`. You can also configure OAuth1, OAuth2, or custom Bearer tokens."\n      },\n      {\n        "q": "Q8: Default HTTP port WireMock runs on?\\nA: 8080.",\n        "a": "WireMock runs on port 8080 by default. You can configure it to run on a different port using the `--port` flag: `new WireMockServer(options().port(8089))`."\n      },\n      {\n        "q": "Q9: Gherkin keyword used to supply parameters list to Scenario Outline?\\nA: Examples.",\n        "a": "The `Examples` keyword is used in a `Scenario Outline` block to define parameter tables: `Examples: | param1 | param2 |`."\n      },\n      {\n        "q": "Q10: Git command to apply one specific commit from branch B onto branch A?\\nA: git cherry-pick <commit-sha>.",\n        "a": "Use `git cherry-pick <commit-sha>` to apply the changes from a specific commit to your current branch."\n      },\n      {\n        "q": "Q11: HTTP status code representing rate-limiting?\\nA: 429 Too Many Requests.",\n        "a": "HTTP 429 represents `Too Many Requests`. It is returned by servers to prevent rate-limiting abuse, often accompanied by a `Retry-After` header."\n      },\n      {\n        "q": "Q12: Class used to manage browser window handles in Selenium?\\nA: WebDriver (getWindowHandles method returns Set<String>).",\n        "a": "Use `driver.getWindowHandles()` to manage window handles. This returns a `Set<String>` of all open handles, which you can switch focus to using `driver.switchTo().window(handle)`."\n      },\n      {\n        "q": "Q13: RestAssured method to parse response directly into POJO?\\nA: response.as(ClassType.class).",\n        "a": "Deserialize response payloads directly using `response.as(MyPojoClass.class)`. This requires an object mapper (like Jackson or Gson) on the classpath."\n      },\n      {\n        "q": "Q14: Gpath query to filter items in list where price > 500?\\nA: findAll { it.price > 500 }.",\n        "a": "In REST Assured, use GPath expressions to query response bodies: `response.jsonPath().getList(\\"findAll { it.price > 500 }\\")`."\n      },\n      {\n        "q": "Q15: Default output folder of standard Playwright reports?\\nA: playwright-report/.",\n        "a": "Playwright saves HTML reports in the `playwright-report/` directory. You can customize the output folder using the `outputDir` parameter in `playwright.config.js`."\n      },\n      {\n        "q": "Q16: Which Selenium interface must be casted to take element screenshots?\\nA: TakesScreenshot.",\n        "a": "Cast the driver or element to `TakesScreenshot`: `File scr = ((TakesScreenshot)driver).getScreenshotAs(OutputType.FILE);`."\n      },\n      {\n        "q": "Q17: Playwright trace file format extension?\\nA: .zip.",\n        "a": "Playwright trace recordings are saved as `.zip` archive files. You can inspect trace recordings using the online trace viewer: `npx playwright show-trace path/to/trace.zip`."\n      },\n      {\n        "q": "Q18: Maven flag to skip running tests during packaging?\\nA: -DskipTests.",\n        "a": "Skip test execution during build packaging by appending `-DskipTests` (skips test run) or `-Dmaven.test.skip=true` (skips compilation and execution) flags."\n      },\n      {\n        "q": "Q19: Jenkins pipeline step to trigger execution of another job?\\nA: build job: \'job_name\'.",\n        "a": "Trigger downstream jobs using the `build` step: `build job: \'downstream-test-suite\', parameters: [string(name: \'ENV\', value: \'QA\')]`."\n      },\n      {\n        "q": "Q20: RestAssured method to configure base URL?\\nA: RestAssured.baseURI = \\"https://...\\".",\n        "a": "Set the base URL globally using `RestAssured.baseURI = \\"https://api.example.com\\"` or individually using RequestSpecification builders."\n      },\n      {\n        "q": "Q21: Playwright selector type to locate elements by matching visible label?\\nA: page.getByLabel().",\n        "a": "Locate form controls using the `.getByLabel(\'label-text\')` locator, which queries matching `<label>` elements."\n      },\n      {\n        "q": "Q22: Selenium command to clear input field text?\\nA: webElement.clear().",\n        "a": "Clear inputs using the `element.clear()` method. If the element is customized and doesn\'t support `.clear()`, send backspace keystrokes to clear it."\n      },\n      {\n        "q": "Q23: Playwright API to mock network status 500 error?\\nA: route.abort(\'failed\').",\n        "a": "Abort request routing by calling `route.abort(\'failed\')` or returning a custom error status using `route.fulfill({ status: 500 })`."\n      },\n      {\n        "q": "Q24: Default reporting format of Karate framework?\\nA: HTML report in target/karate-reports/.",\n        "a": "Karate outputs comprehensive execution reports in `target/karate-reports/karate-summary.html` after runs."\n      },\n      {\n        "q": "Q25: Git command to discard local uncommitted changes permanently?\\nA: git reset --hard HEAD.",\n        "a": "Discard all local modifications to tracked files permanently using `git reset --hard HEAD`."\n      },\n      {\n        "q": "Q26: Jenkins pipeline block to define environment variables?\\nA: environment { ... }.",\n        "a": "Define global or stage-scoped environment variables using the `environment { ENV_VAR = \'value\' }` block."\n      },\n      {\n        "q": "Q27: Docker command to build an image from a Dockerfile?\\nA: docker build -t image_name:tag .",\n        "a": "Build custom images using `docker build -t sdet-runner:v1 .`, where `.` specifies the directory containing the target Dockerfile."\n      },\n      {\n        "q": "Q28: XPath axes to locate parent element?\\nA: parent::.",\n        "a": "Navigate to the immediate parent of the current node using the `parent::` axis, e.g., `//td/parent::tr`."\n      },\n      {\n        "q": "Q29: How to run a single test file in Playwright?\\nA: npx playwright test tests/login.spec.js",\n        "a": "Run specific test files by passing the file path to the test command: `npx playwright test tests/login.spec.js`."\n      },\n      {\n        "q": "Q30: Class used to execute JavaScript code in Selenium WebDriver?\\nA: JavascriptExecutor.",\n        "a": "Cast the driver to `JavascriptExecutor` to run JS: `((JavascriptExecutor)driver).executeScript(\\"arguments[0].click();\\", element);`."\n      },\n      {\n        "q": "Q31: RestAssured method to print response body to console logs?\\nA: response.then().log().all() or response.prettyPrint().",\n        "a": "Output the response payload in a readable format using `response.prettyPrint()` or `.log().all()` builders."\n      },\n      {\n        "q": "Q32: Karate keyword to assert response values match patterns?\\nA: match.",\n        "a": "Assert response values in Karate using the `match` keyword: `match response.id == 101`. Use fuzzy matchers like `#string` or `#number` for dynamic schema validations."\n      },\n      {\n        "q": "Q33: Default wait time in Selenium Explicit Wait if none configured?\\nA: Must configure wait timeout explicitly.",\n        "a": "Selenium explicit waits require defining a timeout value: `new WebDriverWait(driver, Duration.ofSeconds(10))`."\n      },\n      {\n        "q": "Q34: Playwright API to check if element is checked?\\nA: locator.isChecked().",\n        "a": "Check box status in Playwright using `await locator.isChecked()`. This returns a boolean value."\n      },\n      {\n        "q": "Q35: GitLab CI directive keyword to download reports from CI jobs?\\nA: artifacts.",\n        "a": "Retrieve build reports using the `artifacts` parameter: `artifacts: { paths: [ \'reports/\' ] }`."\n      },\n      {\n        "q": "Q36: Docker Compose command to stop and remove containers?\\nA: docker-compose down.",\n        "a": "Stop and clean up containers, networks, and volumes defined in your configurations using the `docker-compose down` command."\n      },\n      {\n        "q": "Q37: RestAssured header assertion matcher type?\\nA: org.hamcrest.Matcher.",\n        "a": "Assert response headers in REST Assured using Hamcrest matchers: `.then().header(\\"Content-Type\\", containsString(\\"json\\"))`."\n      },\n      {\n        "q": "Q38: Playwright method to slow down test steps automatically?\\nA: launch option launch({ slowMo: 100 }).",\n        "a": "Slow down Playwright actions by specifying a delay (in milliseconds) using the `slowMo` launch parameter: `chromium.launch({ slowMo: 250 })`."\n      },\n      {\n        "q": "Q39: Maven command to clean compile and run tests?\\nA: mvn clean test.",\n        "a": "Compile code, run tests, and output reports in a single command using `mvn clean test`."\n      },\n      {\n        "q": "Q40: Git command to download updates and merge them instantly?\\nA: git pull.",\n        "a": "Fetch updates from the remote branch and merge them into your current local branch using the `git pull` command."\n      },\n      {\n        "q": "Q41: Playwright selector locator matching tag input placeholder?\\nA: page.getByPlaceholder().",\n        "a": "Locate text input fields by matching placeholder attributes using the `page.getByPlaceholder(\'Enter Username\')` locator."\n      },\n      {\n        "q": "Q42: Selenium action class used to drag and drop elements?\\nA: Actions.",\n        "a": "Drag and drop elements using Selenium Actions: `new Actions(driver).dragAndDrop(source, target).perform();`."\n      },\n      {\n        "q": "Q43: RestAssured authentication helper for bearer JWT tokens?\\nA: given().auth().oauth2(token).",\n        "a": "Add JWT tokens to request headers using REST Assured\'s OAuth2 helper: `given().auth().oauth2(\\"jwt_token_value\\")`."\n      },\n      {\n        "q": "Q44: Gherkin keyword used to declare pre-requisites stages?\\nA: Background.",\n        "a": "Use the `Background` keyword to define steps (such as database connections or logins) that run before each scenario in a feature file."\n      },\n      {\n        "q": "Q45: GitLab CI variable keyword to target specific runners?\\nA: tags.",\n        "a": "Route CI jobs to matching runners using the `tags` parameter: `tags: [ \'docker-runner-noida\' ]`."\n      },\n      {\n        "q": "Q46: Jenkins pipeline block executed always after pipeline completes?\\nA: post { always { ... } }.",\n        "a": "Run cleanup steps or archive reports always using the `post { always { ... } }` block."\n      },\n      {\n        "q": "Q47: Docker command to display running containers logs?\\nA: docker logs <container-id>",\n        "a": "View logs generated by containers using the `docker logs <container-id>` command."\n      },\n      {\n        "q": "Q48: XPath axes representing child elements of current node?\\nA: child::.",\n        "a": "Locate direct child elements of a node using the `child::` axis, e.g., `//div/child::span`."\n      },\n      {\n        "q": "Q49: How to run tests in parallel across files in Playwright?\\nA: Enabled by default.",\n        "a": "Playwright runs test files in parallel by default. You can configure parallel execution settings inside `playwright.config.js`."\n      },\n      {\n        "q": "Q50: Selenium method to close current window tab?\\nA: driver.close().",\n        "a": "Close the current window/tab using `driver.close()`. To terminate the entire WebDriver session and close all windows, use `driver.quit()`."\n      }\n    ]\n  }\n]');

/* ══════════════════════════════════════
   PLAYWRIGHT PATTERN PREP — R2 SPRINT
══════════════════════════════════════ */

const PLAYWRIGHT_PATTERNS = [
  {
    id: 'locate',
    icon: '🎯',
    title: 'LOCATE Pattern — page.getBy* / page.locator',
    tip: 'Priority order: getByRole → getByLabel → getByPlaceholder → getByText → getByTestId → locator (CSS/XPath). Always starts with page.',
    practice: "// WRITE THIS 2x:\nconst emailInput  = page.getByLabel('Email')\nconst submitBtn   = page.getByRole('button', { name: 'Submit' })\nconst headingEl   = page.getByRole('heading', { name: 'Dashboard' })\nconst errorMsg    = page.locator('.error-banner')\nconst searchBox   = page.getByPlaceholder('Search...')\nconst profileLink = page.getByRole('link', { name: 'Profile' })",
    snippets: [
      { label: "getByRole — button",   code: "page.getByRole('button', { name: 'Submit' })" },
      { label: "getByRole — textbox",  code: "page.getByRole('textbox', { name: 'Email' })" },
      { label: "getByRole — heading",  code: "page.getByRole('heading', { name: 'Dashboard' })" },
      { label: "getByRole — link",     code: "page.getByRole('link', { name: 'Home' })" },
      { label: "getByRole — checkbox", code: "page.getByRole('checkbox', { name: 'Remember me' })" },
      { label: "getByLabel",           code: "page.getByLabel('Email')" },
      { label: "getByPlaceholder",     code: "page.getByPlaceholder('Enter your email')" },
      { label: "getByText",            code: "page.getByText('Click here')" },
      { label: "getByTestId",          code: "page.getByTestId('submit-btn')" },
      { label: "locator — CSS id",     code: "page.locator('#submit-btn')" },
      { label: "locator — CSS class",  code: "page.locator('.error-message')" },
      { label: "locator — attribute",  code: "page.locator('[data-testid=\"login-form\"]')" },
      { label: "locator — XPath",      code: "page.locator('//button[text()=\"Submit\"]')" },
      { label: "nth()",                code: "page.locator('tbody tr').nth(2)" },
      { label: "first() / last()",     code: "page.locator('.item').first()" }
    ]
  },
  {
    id: 'act',
    icon: '⚡',
    title: 'ACT Pattern — await locator.action()',
    tip: 'All actions need await. fill() clears then types. check/uncheck for checkboxes. selectOption() for dropdowns.',
    practice: "// WRITE THIS 2x:\nawait page.getByLabel('Email').fill('user@test.com')\nawait page.getByLabel('Password').fill('Pass@123')\nawait page.getByRole('button', { name: 'Login' }).click()\nawait page.getByRole('checkbox', { name: 'Remember me' }).check()\nawait page.getByRole('combobox', { name: 'Country' }).selectOption('India')\nawait page.getByLabel('Search').press('Enter')",
    snippets: [
      { label: "fill()",          code: "await page.getByLabel('Email').fill('user@test.com')" },
      { label: "click()",         code: "await page.getByRole('button', { name: 'Submit' }).click()" },
      { label: "check()",         code: "await page.getByRole('checkbox').check()" },
      { label: "uncheck()",       code: "await page.getByRole('checkbox').uncheck()" },
      { label: "selectOption()",  code: "await page.getByRole('combobox').selectOption('India')" },
      { label: "press()",         code: "await page.getByLabel('Search').press('Enter')" },
      { label: "hover()",         code: "await page.getByRole('button').hover()" },
      { label: "clear()",         code: "await page.getByLabel('Email').clear()" },
      { label: "keyboard.press()",code: "await page.keyboard.press('Tab')" },
      { label: "keyboard.type()", code: "await page.keyboard.type('Hello World')" },
      { label: "dblclick()",      code: "await page.getByRole('button').dblclick()" },
      { label: "setInputFiles()", code: "await page.getByLabel('Upload').setInputFiles('./file.png')" }
    ]
  },
  {
    id: 'assert',
    icon: '✅',
    title: 'ASSERT Pattern — await expect(target).assertion()',
    tip: 'UI assertions always need await. expect(page) for URL/title. expect(locator) for element state. API: no await on .status() (synchronous).',
    practice: "// WRITE THIS 2x:\nawait expect(page).toHaveURL('/dashboard')\nawait expect(page).toHaveTitle('My App')\nawait expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible()\nawait expect(page.locator('.error')).toHaveText('Invalid email')\nawait expect(page.locator('tbody tr')).toHaveCount(5)\n// API:\nexpect(response.status()).toBe(201)\nexpect(body).toMatchObject({ name: 'Test' })\nexpect(body.id).toBeTruthy()",
    snippets: [
      { label: "toHaveURL (string)",   code: "await expect(page).toHaveURL('/dashboard')" },
      { label: "toHaveURL (regex)",    code: "await expect(page).toHaveURL(/dashboard/)" },
      { label: "toHaveTitle",          code: "await expect(page).toHaveTitle('App Title')" },
      { label: "toBeVisible",          code: "await expect(page.locator('.banner')).toBeVisible()" },
      { label: "not.toBeVisible",      code: "await expect(page.locator('.modal')).not.toBeVisible()" },
      { label: "toHaveText",           code: "await expect(page.locator('.msg')).toHaveText('Success')" },
      { label: "toContainText",        code: "await expect(page.locator('.msg')).toContainText('Success')" },
      { label: "toHaveValue",          code: "await expect(page.getByLabel('Email')).toHaveValue('test@test.com')" },
      { label: "toBeEnabled",          code: "await expect(page.getByRole('button')).toBeEnabled()" },
      { label: "toBeDisabled",         code: "await expect(page.getByRole('button')).toBeDisabled()" },
      { label: "toBeChecked",          code: "await expect(page.getByRole('checkbox')).toBeChecked()" },
      { label: "toHaveCount",          code: "await expect(page.locator('tbody tr')).toHaveCount(5)" },
      { label: "toHaveAttribute",      code: "await expect(page.locator('a')).toHaveAttribute('href', '/home')" },
      { label: "toBe (API status)",    code: "expect(response.status()).toBe(200)" },
      { label: "toMatchObject (API)",  code: "expect(body).toMatchObject({ name: 'Test', id: 1 })" },
      { label: "toBeTruthy (API)",     code: "expect(body.uuid).toBeTruthy()" }
    ]
  },
  {
    id: 'navigate',
    icon: '🧭',
    title: 'NAVIGATE Pattern — await page.goto / waitFor*',
    tip: 'goto() navigates. waitForURL() confirms navigation after click. waitForLoadState("networkidle") waits for all requests to settle.',
    practice: "// WRITE THIS 2x:\nawait page.goto('https://example.com')\nawait page.goto('/login')           // relative — uses baseURL from config\nawait page.waitForURL('**/dashboard') // after login click\nawait page.waitForLoadState('networkidle')\nawait page.reload()",
    snippets: [
      { label: "goto (absolute)",      code: "await page.goto('https://example.com')" },
      { label: "goto (relative)",      code: "await page.goto('/login')" },
      { label: "waitForURL (glob)",    code: "await page.waitForURL('**/dashboard')" },
      { label: "waitForURL (regex)",   code: "await page.waitForURL(/dashboard/)" },
      { label: "waitForLoadState",     code: "await page.waitForLoadState('networkidle')" },
      { label: "reload",               code: "await page.reload()" },
      { label: "goBack",               code: "await page.goBack()" },
      { label: "goForward",            code: "await page.goForward()" }
    ]
  },
  {
    id: 'api',
    icon: '📮',
    title: 'API Pattern — request.get / post / put / delete',
    tip: 'Use the request fixture. .status() is synchronous (no await). .json() needs await. data: {} auto-serializes to JSON.',
    practice: "// WRITE THIS 2x:\ntest('POST creates user', async ({ request }) => {\n  const res = await request.post('/api/users', {\n    headers: { 'Content-Type': 'application/json',\n               'Authorization': 'Bearer token123' },\n    data: { name: 'Test', email: 'test@test.com' }\n  })\n  expect(res.status()).toBe(201)        // no await — synchronous\n  const body = await res.json()         // await — async\n  expect(body.name).toBe('Test')\n  expect(body.id).toBeTruthy()\n})",
    snippets: [
      { label: "GET",                  code: "const res = await request.get('/api/users')\nexpect(res.status()).toBe(200)\nconst body = await res.json()" },
      { label: "POST with data",       code: "const res = await request.post('/api/users', {\n  headers: { 'Content-Type': 'application/json' },\n  data: { name: 'Test', email: 'test@test.com' }\n})\nexpect(res.status()).toBe(201)" },
      { label: "PUT",                  code: "const res = await request.put('/api/users/1', {\n  data: { name: 'Updated' }\n})\nexpect(res.status()).toBe(200)" },
      { label: "DELETE",               code: "const res = await request.delete('/api/users/1')\nexpect(res.status()).toBe(204)" },
      { label: "Bearer Auth",          code: "const res = await request.get('/api/secure', {\n  headers: { 'Authorization': 'Bearer eyJhbGc...' }\n})" },
      { label: "Basic Auth",           code: "const cred = Buffer.from('user:pass').toString('base64')\nconst res = await request.get('/api/secure', {\n  headers: { 'Authorization': `Basic ${cred}` }\n})" },
      { label: "Assert body",          code: "const body = await res.json()\nexpect(body).toMatchObject({ name: 'Test' })\nexpect(body.id).toBeTruthy()\nexpect(body.status).toBe('ACTIVE')" }
    ]
  },
  {
    id: 'intercept',
    icon: '🕸',
    title: 'INTERCEPT Pattern — page.route / waitForRequest / waitForResponse',
    tip: 'route.fulfill() = mock response. route.abort() = block request. Promise.all([waitForResponse, trigger]) = capture live responses.',
    practice: "// WRITE THIS 2x:\n// 1. Mock response:\nawait page.route('**/api/users', route =>\n  route.fulfill({ status: 200,\n    contentType: 'application/json',\n    body: JSON.stringify([{ id: 1, name: 'Mock User' }]) })\n)\n\n// 2. Capture live response:\nconst [resp] = await Promise.all([\n  page.waitForResponse(r =>\n    r.url().includes('/api/data') && r.status() === 200),\n  page.goto('/data-page')\n])\nconst data = await resp.json()",
    snippets: [
      { label: "Mock response",        code: "await page.route('**/api/users', route =>\n  route.fulfill({\n    status: 200,\n    contentType: 'application/json',\n    body: JSON.stringify([{ id: 1, name: 'Mock' }])\n  })\n)" },
      { label: "Abort request",        code: "await page.route('**analytics**', route => route.abort())" },
      { label: "Modify response",      code: "await page.route('**/api/user', async route => {\n  const resp = await route.fetch()\n  const json = await resp.json()\n  json.role = 'ADMIN'\n  await route.fulfill({ response: resp, json })\n})" },
      { label: "Wait for response",    code: "const [resp] = await Promise.all([\n  page.waitForResponse(r =>\n    r.url().includes('/api') && r.status() === 200),\n  page.goto('/page')\n])\nconst data = await resp.json()" },
      { label: "Wait for request",     code: "const [req] = await Promise.all([\n  page.waitForRequest(r =>\n    r.url().includes('/api') && r.method() === 'POST'),\n  page.click('#submit-btn')\n])\nconsole.log(req.postData())" }
    ]
  },
  {
    id: 'pom',
    icon: '🏗',
    title: 'POM Pattern — class + constructor(page) + methods',
    tip: 'Constructor takes page, declares locators as this.xxx properties, methods are async actions. Export + import in tests.',
    practice: "// WRITE THIS 2x:\nclass LoginPage {\n  constructor(page) {\n    this.page          = page\n    this.emailInput    = page.getByLabel('Email')\n    this.passwordInput = page.getByLabel('Password')\n    this.loginBtn      = page.getByRole('button', { name: 'Login' })\n    this.errorMsg      = page.locator('.error-banner')\n  }\n  async navigate()         { await this.page.goto('/login') }\n  async login(email, pass) {\n    await this.emailInput.fill(email)\n    await this.passwordInput.fill(pass)\n    await this.loginBtn.click()\n  }\n}\nmodule.exports = { LoginPage }",
    snippets: [
      { label: "Page class",           code: "class LoginPage {\n  constructor(page) {\n    this.page     = page\n    this.emailInput = page.getByLabel('Email')\n    this.loginBtn = page.getByRole('button', { name: 'Login' })\n  }\n  async navigate() { await this.page.goto('/login') }\n  async login(email, pass) {\n    await this.emailInput.fill(email)\n    await this.loginBtn.click()\n  }\n}\nmodule.exports = { LoginPage }" },
      { label: "Use POM in test",      code: "const { test, expect } = require('@playwright/test')\nconst { LoginPage } = require('../pages/LoginPage')\n\ntest('valid login', async ({ page }) => {\n  const lp = new LoginPage(page)\n  await lp.navigate()\n  await lp.login('user@test.com', 'Pass@123')\n  await expect(page).toHaveURL(/dashboard/)\n})" }
    ]
  },
  {
    id: 'config',
    icon: '⚙',
    title: 'CONFIG Pattern — playwright.config.js + global-setup.js',
    tip: 'baseURL removes full URLs from tests. storageState skips login. screenshot/video/trace for CI debugging. retries for flake recovery.',
    practice: "// WRITE THIS 2x:\nconst { defineConfig } = require('@playwright/test')\nmodule.exports = defineConfig({\n  testDir: './tests',\n  timeout: 30000,\n  retries: 1,\n  workers: 4,\n  reporter: 'html',\n  use: {\n    baseURL: 'https://example.com',\n    headless: true,\n    screenshot: 'only-on-failure',\n    video:      'retain-on-failure',\n    trace:      'on-first-retry',\n    storageState: 'auth.json'\n  }\n})",
    snippets: [
      { label: "Full config",          code: "const { defineConfig } = require('@playwright/test')\nmodule.exports = defineConfig({\n  testDir: './tests',\n  timeout: 30000,\n  retries: 1,\n  workers: 4,\n  reporter: 'html',\n  use: {\n    baseURL: 'https://example.com',\n    headless: true,\n    screenshot: 'only-on-failure',\n    video: 'retain-on-failure',\n    trace: 'on-first-retry',\n  }\n})" },
      { label: "Auth reuse setup",     code: "// global-setup.js\nmodule.exports = async () => {\n  const browser = await chromium.launch()\n  const page = await browser.newPage()\n  await page.goto('/login')\n  await page.getByLabel('Email').fill(process.env.TEST_USER)\n  await page.getByLabel('Password').fill(process.env.TEST_PASS)\n  await page.getByRole('button', { name: 'Login' }).click()\n  await page.waitForURL('**/dashboard')\n  await page.context().storageState({ path: 'auth.json' })\n  await browser.close()\n}\n// playwright.config.js:\n// globalSetup: './global-setup.js'\n// use: { storageState: 'auth.json' }" },
      { label: "Multi-browser projects", code: "projects: [\n  { name: 'chromium', use: { browserName: 'chromium' } },\n  { name: 'firefox',  use: { browserName: 'firefox'  } },\n  { name: 'smoke',    grep: /@smoke/ },\n  { name: 'regression', grep: /@regression/ }\n]" }
    ]
  },
  {
    id: 'fulltest',
    icon: '📝',
    title: 'FULL TEST Pattern — test.describe + beforeEach + test (Arrange-Act-Assert)',
    tip: 'describe groups tests. beforeEach runs shared setup. @smoke/@regression tags for selective runs. AAA = Arrange, Act, Assert.',
    practice: "// WRITE THIS 2x:\nconst { test, expect } = require('@playwright/test')\n\ntest.describe('Login Feature', () => {\n  test.beforeEach(async ({ page }) => {\n    await page.goto('/login')\n  })\n\n  test('@smoke valid login redirects', async ({ page }) => {\n    // Act\n    await page.getByLabel('Email').fill('user@test.com')\n    await page.getByLabel('Password').fill('Pass@123')\n    await page.getByRole('button', { name: 'Login' }).click()\n    // Assert\n    await expect(page).toHaveURL(/dashboard/)\n    await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible()\n  })\n\n  test('invalid login shows error', async ({ page }) => {\n    await page.getByRole('button', { name: 'Login' }).click()\n    await expect(page.locator('.error-banner')).toBeVisible()\n    await expect(page.locator('.error-banner')).toContainText('required')\n  })\n})",
    snippets: [
      { label: "Full describe block",  code: "const { test, expect } = require('@playwright/test')\n\ntest.describe('Feature', () => {\n  test.beforeEach(async ({ page }) => {\n    await page.goto('/page')\n  })\n\n  test('@smoke happy path', async ({ page }) => {\n    await page.getByLabel('Email').fill('user@test.com')\n    await page.getByRole('button', { name: 'Submit' }).click()\n    await expect(page).toHaveURL('/success')\n    await expect(page.getByRole('heading', { name: 'Done' })).toBeVisible()\n  })\n\n  test('negative — error shown', async ({ page }) => {\n    await page.getByRole('button', { name: 'Submit' }).click()\n    await expect(page.locator('.error')).toBeVisible()\n    await expect(page.locator('.error')).toContainText('required')\n  })\n})" },
      { label: "Tags + CLI commands",  code: "// Tag tests:\ntest('@smoke login works', async ({ page }) => { ... })\ntest('@regression premium flow', async ({ page }) => { ... })\n\n// Run by tag:\n// npx playwright test --grep \"@smoke\"\n// npx playwright test --grep \"@regression\"\n// npx playwright test --grep-invert \"@skip\"" }
    ]
  },
  {
    id: 'combined',
    icon: '🔗',
    title: 'COMBINED Pattern — UI + API in one test',
    tip: 'Use request fixture for API setup/teardown + page fixture for UI. Verify UI reflects API state.',
    practice: "// WRITE THIS 2x:\ntest('UI shows new employee from API', async ({ page, request }) => {\n  // 1. Create via API\n  const res = await request.post('/api/employees', {\n    headers: { 'Content-Type': 'application/json' },\n    data: { name: 'Priya Sharma', dept: 'QA' }\n  })\n  expect(res.status()).toBe(201)\n  const { empId } = await res.json()\n\n  // 2. Verify in UI\n  await page.goto('/employees')\n  await expect(page.locator(`[data-id=\"${empId}\"]`)).toBeVisible()\n  await expect(page.locator(`[data-id=\"${empId}\"]`)).toContainText('Priya Sharma')\n})",
    snippets: [
      { label: "UI + API combined",    code: "test('UI shows new record', async ({ page, request }) => {\n  // API: create\n  const res = await request.post('/api/records', {\n    headers: { 'Content-Type': 'application/json' },\n    data: { name: 'Test Record' }\n  })\n  expect(res.status()).toBe(201)\n  const { id } = await res.json()\n\n  // UI: verify\n  await page.goto('/records')\n  await expect(page.locator(`[data-id=\"${id}\"]`)).toBeVisible()\n  await expect(page.locator(`[data-id=\"${id}\"]`)).toContainText('Test Record')\n})" }
    ]
  }
]

const RAPID_FIRE = [
  { q: "1. What is Playwright?", a: "Microsoft's Node.js browser automation library for Chromium, Firefox & WebKit. Async-first, built-in auto-wait, no WebDriver needed." },
  { q: "2. Playwright vs Selenium — 3 key differences?", a: "1) Auto-wait on every action vs explicit waits in Selenium. 2) Native network interception (no proxy). 3) Multi-browser in one install. Playwright is faster and more reliable." },
  { q: "3. What languages does Playwright support?", a: "JavaScript/TypeScript, Python, Java, C#" },
  { q: "4. What is auto-waiting in Playwright?", a: "Before every action (click/fill/check), Playwright automatically waits for element to be: attached, visible, stable (not animating), enabled, editable. No sleep() needed." },
  { q: "5. What is a Locator?", a: "A lazy reference to a DOM element that re-queries the DOM on EVERY use. Safe from stale element errors. Created with page.getBy*() or page.locator()." },
  { q: "6. Locator vs ElementHandle — difference?", a: "Locator: lazy, re-queries on every action, auto-retries. ElementHandle: DOM snapshot, can go stale if page changes. Always prefer Locator." },
  { q: "7. Best locator priority order?", a: "1.getByRole (ARIA/accessible) 2.getByLabel 3.getByPlaceholder 4.getByText 5.getByTestId 6.locator (CSS) 7.locator (XPath) — most stable to least stable." },
  { q: "8. What does page.getByRole() do?", a: "Finds elements by ARIA role + accessible name. E.g., page.getByRole('button', { name: 'Submit' }). Most resilient to UI changes." },
  { q: "9. What does page.getByLabel() find?", a: "Finds form inputs associated with a <label> text. E.g., page.getByLabel('Email') finds the input labeled 'Email'." },
  { q: "10. How to locate by placeholder?", a: "page.getByPlaceholder('Enter your email') — matches the placeholder attribute." },
  { q: "11. How to use CSS selector?", a: "page.locator('#id') for id, page.locator('.class') for class, page.locator('[data-testid=x]') for attribute." },
  { q: "12. How to use XPath?", a: "page.locator('//button[text()=\"Submit\"]') — XPath is detected automatically by the // prefix." },
  { q: "13. How to get nth element?", a: "page.locator('.row').nth(2) — 0-indexed. Also .first() and .last() shortcuts." },
  { q: "14. How to fill an input field?", a: "await page.getByLabel('Email').fill('user@test.com') — fill() clears existing content then types." },
  { q: "15. How to click a button?", a: "await page.getByRole('button', { name: 'Submit' }).click()" },
  { q: "16. How to check a checkbox?", a: "await page.getByRole('checkbox', { name: 'Accept' }).check()" },
  { q: "17. How to select a dropdown option?", a: "await page.getByRole('combobox').selectOption('India') — accepts value, label text, or index." },
  { q: "18. How to press a keyboard key?", a: "await page.keyboard.press('Enter') — or — await locator.press('Tab') for element-scoped." },
  { q: "19. How to upload a file?", a: "await page.getByLabel('Upload').setInputFiles('./path/to/file.jpg')" },
  { q: "20. How to handle a browser dialog (alert)?", a: "page.on('dialog', dialog => dialog.accept()) — register listener BEFORE the action that triggers it." },
  { q: "21. How to assert the current URL?", a: "await expect(page).toHaveURL('/dashboard') or await expect(page).toHaveURL(/dashboard/) for regex." },
  { q: "22. How to assert page title?", a: "await expect(page).toHaveTitle('My App')" },
  { q: "23. How to assert element is visible?", a: "await expect(page.locator('.success-msg')).toBeVisible()" },
  { q: "24. toHaveText vs toContainText — difference?", a: "toHaveText('exact') matches the full text exactly. toContainText('partial') checks if text contains the substring." },
  { q: "25. How to assert element count?", a: "await expect(page.locator('tbody tr')).toHaveCount(5)" },
  { q: "26. How to assert input value?", a: "await expect(page.getByLabel('Email')).toHaveValue('test@test.com')" },
  { q: "27. How to assert element attribute?", a: "await expect(page.locator('a')).toHaveAttribute('href', '/home')" },
  { q: "28. What is a web-first assertion?", a: "Playwright assertions like toBeVisible() automatically retry the check until it passes OR timeout is reached. No need for manual polling." },
  { q: "29. How to set custom timeout on an assertion?", a: "await expect(locator).toBeVisible({ timeout: 5000 }) — overrides default for that assertion only." },
  { q: "30. How to wait for navigation after click?", a: "await page.waitForURL('**/dashboard') after click, OR await page.waitForLoadState('networkidle')." },
  { q: "31. What is waitForLoadState('networkidle')?", a: "Waits until there are no more network requests for 500ms. Useful after navigations with lots of async data loading." },
  { q: "32. How to do API testing in Playwright?", a: "Use the request fixture: const res = await request.post('/api/users', { headers:{...}, data:{...} })" },
  { q: "33. Is response.status() synchronous or async?", a: "SYNCHRONOUS — no await needed. expect(res.status()).toBe(201). But response.json() is ASYNC — needs await." },
  { q: "34. How to read API response body?", a: "const body = await res.json() — async, needs await. Use res.text() for non-JSON responses." },
  { q: "35. What is toMatchObject?", a: "Partial matching — expects the object to CONTAIN the specified keys/values. Extra keys in response body are allowed." },
  { q: "36. What is toBeTruthy?", a: "Asserts the value is truthy (not null, undefined, 0, false, or empty string). Used for dynamic IDs/UUIDs." },
  { q: "37. toBe vs toEqual — difference?", a: "toBe: strict equality (===), works for primitives. toEqual: deep equality for objects/arrays. For API use toMatchObject for partial matching." },
  { q: "38. When do you get status 201 vs 200?", a: "200 OK = successful GET/PUT/PATCH. 201 Created = successful POST (new resource created). 204 No Content = DELETE succeeded." },
  { q: "39. How to add Bearer token to API request?", a: "headers: { 'Authorization': 'Bearer eyJhbGc...' }" },
  { q: "40. How to add Basic auth to API request?", a: "const cred = Buffer.from('user:pass').toString('base64'); headers: { 'Authorization': `Basic ${cred}` }" },
  { q: "41. How to mock an API response?", a: "await page.route('**/api/users', route => route.fulfill({ status:200, contentType:'application/json', body: JSON.stringify([...]) }))" },
  { q: "42. How to block a network request?", a: "await page.route('**analytics**', route => route.abort())" },
  { q: "43. How to modify a response in flight?", a: "await page.route('**/api', async route => { const resp = await route.fetch(); const json = await resp.json(); json.role='ADMIN'; await route.fulfill({ response: resp, json }); })" },
  { q: "44. How to capture a live API response?", a: "const [resp] = await Promise.all([page.waitForResponse(r => r.url().includes('/api') && r.status()===200), page.goto('/page')]); const data = await resp.json()" },
  { q: "45. Why use Promise.all with waitForResponse?", a: "To avoid race condition — set up the waiter BEFORE the trigger. Promise.all starts both simultaneously." },
  { q: "46. What is POM (Page Object Model)?", a: "Design pattern: class with constructor(page), locators as this.xxx properties, actions as async methods. Tests call methods instead of raw locators." },
  { q: "47. Why use POM?", a: "1) Reusability — one class, many tests. 2) Maintainability — change selector in one place. 3) Readability — test reads like English." },
  { q: "48. What is storageState in Playwright?", a: "Serialized cookies + localStorage of a browser context, saved as auth.json. Loaded via use: { storageState: 'auth.json' } to skip login." },
  { q: "49. How to reuse auth across all tests?", a: "global-setup.js logs in and calls context.storageState({ path: 'auth.json' }). Config sets globalSetup + use: { storageState: 'auth.json' }." },
  { q: "50. What is a Playwright fixture?", a: "Pre-configured objects injected into tests by the test runner. Built-in: page, browser, context, request. Custom fixtures extend these." },
  { q: "51. How to run only @smoke tagged tests?", a: "npx playwright test --grep '@smoke'" },
  { q: "52. How to configure multiple browsers?", a: "projects array in playwright.config.js: [{ name:'chromium', use:{browserName:'chromium'} }, { name:'firefox', ... }]" },
  { q: "53. Screenshot on failure — how?", a: "use: { screenshot: 'only-on-failure' } in playwright.config.js" },
  { q: "54. Video on failure — how?", a: "use: { video: 'retain-on-failure' } in playwright.config.js" },
  { q: "55. How to enable trace?", a: "use: { trace: 'on-first-retry' } then view with: npx playwright show-trace test-results/trace.zip" },
  { q: "56. How to set retries for flaky tests?", a: "retries: 2 in playwright.config.js globally, or --retries 2 CLI flag for one run." },
  { q: "57. How to run tests in parallel?", a: "workers: 4 in config. Files run parallel by default. test.describe.configure({ mode: 'parallel' }) for parallel within a file." },
  { q: "58. Default Playwright test timeout?", a: "30,000ms (30s) for test timeout. 5,000ms for assertions. Set globally: timeout: 30000 in config." },
  { q: "59. How to take a full-page screenshot?", a: "await page.screenshot({ path: 'screenshot.png', fullPage: true })" },
  { q: "60. What is an isolated browser context?", a: "A fresh browser session with its own cookies/localStorage. Each test gets its own context — no state leaks between tests. Like a new incognito window." }
]

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
      <div class="co-company-card ${c.id === activeCompany && activeView !== 'prep' && activeView !== 'r1_prep' && activeView !== 'pattern_prep' ? 'active' : ''}" data-cid="${c.id}">
        <span class="co-company-logo">${c.logo}</span>
        <div>
          <div class="co-company-name">${c.name}</div>
          <div class="co-company-rounds">${c.rounds.length} round(s)</div>
        </div>
      </div>`).join('') +
      `<div class="co-prep-card ${activeView==='prep'?'active':''}" data-view="prep">
        <span class="co-company-logo">📚</span>
        <div>
          <div class="co-company-name">LTIM R2 Prep Bank</div>
          <div class="co-company-rounds">100+ Playwright JS Q&A</div>
        </div>
      </div>` +
      `<div class="co-prep-card ${activeView==='r1_prep'?'active':''}" data-view="r1_prep">
        <span class="co-company-logo">⚡</span>
        <div>
          <div class="co-company-name">Automation R1 Prep Bank</div>
          <div class="co-company-rounds">130+ Q&A (6-8 Yrs Exp)</div>
        </div>
      </div>` +
      `<div class="co-prep-card ${activeView==='pattern_prep'?'active':''}" data-view="pattern_prep">
        <span class="co-company-logo">✏️</span>
        <div>
          <div class="co-company-name">Pattern Prep — R2 Sprint</div>
          <div class="co-company-rounds">10 patterns + 60 Rapid Fire</div>
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
    sidebar.querySelector('[data-view="r1_prep"]').addEventListener('click', () => {
      activeView = 'r1_prep';
      activeCompany = null;
      renderSidebar();
      renderContent();
    });
    sidebar.querySelector('[data-view="pattern_prep"]').addEventListener('click', () => {
      activeView = 'pattern_prep';
      activeCompany = null;
      renderSidebar();
      renderContent();
    });
  }

  function renderContent() {
    if (activeView === 'prep') {
      renderPrepBank();
      return;
    }
    if (activeView === 'r1_prep') {
      renderR1PrepBank();
      return;
    }
    if (activeView === 'pattern_prep') {
      renderPatternPrep();
      return;
    }
    const company = COMPANIES.find(c => c.id === activeCompany);
    if (!company) return;

    content.innerHTML = `<div class="co-company-header">
      <span class="co-company-logo-lg">${company.logo}</span>
      <div><h2>${company.name}</h2></div>
    </div>` + company.rounds.map((r) => `
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
        ${r.questions.length ? r.questions.map((q) => `
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

    // Click to reveal answer (clicking question reveals answer)
    content.querySelectorAll('.co-prep-card-qa').forEach(card => {
      card.querySelector('.co-prep-q').addEventListener('click', () => {
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

  function renderPatternPrep() {
    // ── Pill nav ──
    let pillsHtml = `<div class="co-pat-nav" id="co-pat-nav">`;
    PLAYWRIGHT_PATTERNS.forEach((pat, pi) => {
      pillsHtml += `<button class="co-pat-pill${pi === 0 ? ' active' : ''}" data-target="${pi}">${pat.icon} ${pat.id.toUpperCase()}</button>`;
    });
    pillsHtml += `<button class="co-pat-pill co-rf-pill" data-target="rf">🔥 RAPID FIRE</button></div>`;

    // ── Pattern panels (only first shown) ──
    let patternsHtml = '';
    PLAYWRIGHT_PATTERNS.forEach((pat, pi) => {
      patternsHtml += `<div class="co-pattern-panel" id="co-panel-${pi}" style="${pi !== 0 ? 'display:none' : ''}">
        <div class="co-pat-panel-title">${pat.icon} ${pat.title}</div>
        <div class="co-pat-tip">💡 <b>Key Insight:</b> ${pat.tip}</div>
        <div class="co-pat-practice-label">✏️ WRITE THIS 2× — core practice snippet:</div>
        <pre class="co-code co-practice-code">${escapeHtml(pat.practice)}</pre>
        <div class="co-pat-snippets-label">📌 Quick Reference:</div>
        <div class="co-pat-snippets">`;
      pat.snippets.forEach(sn => {
        patternsHtml += `<div class="co-snippet-row">
          <span class="co-snip-label">${sn.label}</span>
          <pre class="co-snip-code">${escapeHtml(sn.code)}</pre>
        </div>`;
      });
      patternsHtml += `</div></div>`;
    });

    // ── Rapid fire panel (hidden by default) ──
    let rfHtml = `<div class="co-pattern-panel" id="co-panel-rf" style="display:none">
      <div class="co-pat-panel-title">🔥 Rapid Fire — ${RAPID_FIRE.length} Q&amp;A</div>
      <p class="co-rf-hint">Click any card to reveal the answer. Work through all 60.</p>
      <div class="co-rf-grid">`;
    RAPID_FIRE.forEach((item, i) => {
      rfHtml += `<div class="co-rf-card" id="co-rfc-${i}">
        <div class="co-rf-q">${escapeHtml(item.q)}</div>
        <div class="co-rf-a">${escapeHtml(item.a)}</div>
      </div>`;
    });
    rfHtml += `</div></div>`;

    content.innerHTML = `
      <div class="co-prep-header co-prep-header-compact">
        <h2>✏️ LTIM R2 — Pattern Prep Sprint</h2>
        <div class="co-pat-meta">⏱ ~20 min patterns (write 2×) · ~30 min rapid fire · Use pills to jump instantly</div>
      </div>
      ${pillsHtml}
      <div id="co-pat-panels">${patternsHtml}${rfHtml}</div>`;

    // ── Pill click: switch panel ──
    function showPanel(target) {
      content.querySelectorAll('.co-pattern-panel').forEach(p => p.style.display = 'none');
      content.querySelectorAll('.co-pat-pill').forEach(p => p.classList.remove('active'));
      const panel = content.querySelector(target === 'rf' ? '#co-panel-rf' : `#co-panel-${target}`);
      if (panel) panel.style.display = '';
      const pill = content.querySelector(`[data-target="${target}"]`);
      if (pill) pill.classList.add('active');
      content.scrollTop = 0;
    }

    content.querySelectorAll('.co-pat-pill').forEach(pill => {
      pill.addEventListener('click', () => showPanel(pill.dataset.target));
    });

    content.querySelectorAll('.co-rf-card').forEach(card => {
      card.addEventListener('click', () => card.classList.toggle('revealed'));
    });
  }

  function renderR1PrepBank() {
    let html = `<div class="co-prep-header">
      <h2>⚡ Automation R1 Prep Bank (6-8 Yrs Exp)</h2>
      <p>Noida/Gurugram targeted study bank. Master these key scenario-based and coding challenges.</p>
      <div class="co-prep-search-wrap">
        <input class="co-prep-search" id="co-r1-prep-search" placeholder="🔍 Search questions...">
      </div>
    </div>
    <div id="co-prep-cats">`;

    R1_PREP.forEach((cat, ci) => {
      html += `<div class="co-prep-cat">
        <div class="co-prep-cat-header open" data-r1cat="${ci}">
          ${cat.category} <span class="co-cat-count">(${cat.qs.length} questions)</span> <span class="co-cat-arrow">▲</span>
        </div>
        <div class="co-prep-cat-body" id="co-r1pb-${ci}">`;
      cat.qs.forEach((qa, qi) => {
        html += `<div class="co-prep-card-qa" data-r1cat="${ci}" data-qi="${qi}">
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
        const body = content.querySelector('#co-r1pb-' + hdr.dataset.r1cat);
        const isOpen = hdr.classList.toggle('open');
        body.style.display = isOpen ? '' : 'none';
        hdr.querySelector('.co-cat-arrow').textContent = isOpen ? '▲' : '▼';
      });
    });

    // Click to reveal answer (clicking question reveals answer)
    content.querySelectorAll('.co-prep-card-qa').forEach(card => {
      card.querySelector('.co-prep-q').addEventListener('click', () => {
        card.classList.toggle('revealed');
        card.querySelector('.co-prep-toggle').textContent = card.classList.contains('revealed') ? '▲' : '▼';
      });
    });

    // Search
    content.querySelector('#co-r1-prep-search').addEventListener('input', e => {
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
