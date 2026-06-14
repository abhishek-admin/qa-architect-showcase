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
