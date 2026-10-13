#!/usr/bin/env node
/**
 * run-cart-api.cjs
 * API Test Runner for FR-07 Shopping Cart.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    backendDir: null,
    baseUrl: 'http://localhost:3000',
    outDir: null,
    runId: 'fr07-run01'
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--backend-dir' && args[i + 1]) {
      parsed.backendDir = path.resolve(args[++i]);
    } else if (args[i] === '--base-url' && args[i + 1]) {
      parsed.baseUrl = args[++i];
    } else if (args[i] === '--out' && args[i + 1]) {
      parsed.outDir = path.resolve(args[++i]);
    } else if (args[i] === '--run-id' && args[i + 1]) {
      parsed.runId = args[++i];
    }
  }

  if (!parsed.backendDir) {
    console.error('Error: --backend-dir <path> is required');
    process.exit(1);
  }
  if (!parsed.outDir) {
    console.error('Error: --out <path> is required');
    process.exit(1);
  }

  return parsed;
}

// HTTP request helper
function request(baseUrl, options, bodyData = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(options.path || '/', baseUrl);
    const reqOptions = {
      method: options.method || 'GET',
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: options.headers || {}
    };

    if (bodyData && !reqOptions.headers['Content-Type']) {
      reqOptions.headers['Content-Type'] = 'application/json';
    }

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: json,
          rawBody: data
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (bodyData) {
      req.write(typeof bodyData === 'string' ? bodyData : JSON.stringify(bodyData));
    }
    req.end();
  });
}

// Redact auth tokens
function redactHeaders(headers) {
  const cloned = { ...headers };
  if (cloned.Authorization || cloned.authorization) {
    cloned.Authorization = 'Bearer [REDACTED]';
    delete cloned.authorization;
  }
  return cloned;
}

async function createFreshUser(baseUrl, prefix) {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 10000);
  const email = `${prefix}_${timestamp}_${randomSuffix}@test.com`;
  const password = 'Password123!';
  const name = `Test ${prefix}`;

  const regRes = await request(baseUrl, {
    method: 'POST',
    path: '/api/register'
  }, { name, email, password });

  if (regRes.statusCode !== 200 && regRes.statusCode !== 201) {
    throw new Error(`Failed to register user: ${JSON.stringify(regRes.body)}`);
  }

  const loginRes = await request(baseUrl, {
    method: 'POST',
    path: '/api/login'
  }, { email, password });

  if (loginRes.statusCode !== 200 || !loginRes.body.token) {
    throw new Error(`Failed to login user: ${JSON.stringify(loginRes.body)}`);
  }

  return {
    email,
    password,
    token: loginRes.body.token,
    user: loginRes.body.user
  };
}

async function main() {
  const { backendDir, baseUrl, outDir, runId } = parseArgs();

  // Safety check
  const repoRoot = path.resolve(__dirname, '../..');
  const workingBackendDir = path.resolve(repoRoot, 'backend');
  if (backendDir === workingBackendDir) {
    console.error('CRITICAL SAFETY ERROR: Refusing to run tests against working backend directory!');
    process.exit(1);
  }

  fs.mkdirSync(outDir, { recursive: true });

  const suitePath = path.resolve(__dirname, 'suite.json');
  const suiteData = JSON.parse(fs.readFileSync(suitePath, 'utf8'));
  const apiCases = suiteData.filter((c) => c.layer === 'API');

  console.log(`=== FR-07 API Test Runner (Total ${apiCases.length} API Cases) ===`);
  console.log(`Backend Base URL: ${baseUrl}`);
  console.log(`Output Directory: ${outDir}`);

  const observations = [];
  let passedCount = 0;
  let failedCount = 0;
  let blockedCount = 0;

  for (const tc of apiCases) {
    const startedAt = new Date().toISOString();
    console.log(`\nExecuting ${tc.id}: ${tc.sourceCaseIds.join(', ')}...`);

    const obs = {
      caseId: tc.id,
      runId,
      attempted: true,
      startedAt,
      endedAt: null,
      inputSent: null,
      stateBefore: null,
      stateAfter: null,
      assertions: [],
      actual: null,
      status: 'Not Run',
      blocker: null,
      evidence: []
    };

    try {
      if (tc.id === 'FR07-TC-009') {
        // Precondition: user with A (q=1) in cart. Action: POST A (q=1). Expected: 1 row A, quantity=2.
        const user = await createFreshUser(baseUrl, 'tc009');
        const authHeader = { Authorization: `Bearer ${user.token}` };

        // Setup prestate
        await request(baseUrl, { method: 'POST', path: '/api/cart', headers: authHeader }, { id: 1, name: 'Sản phẩm A', price: 100000, quantity: 1 });
        const beforeRes = await request(baseUrl, { method: 'GET', path: '/api/cart', headers: authHeader });
        obs.stateBefore = beforeRes.body;

        // Action
        const input = { id: 1, name: 'Sản phẩm A', price: 100000, quantity: 1 };
        obs.inputSent = { method: 'POST', path: '/api/cart', body: input, headers: redactHeaders(authHeader) };
        const actRes = await request(baseUrl, { method: 'POST', path: '/api/cart', headers: authHeader }, input);

        // State after
        const afterRes = await request(baseUrl, { method: 'GET', path: '/api/cart', headers: authHeader });
        obs.stateAfter = afterRes.body;

        // Assertions
        const singleRow = Array.isArray(afterRes.body) && afterRes.body.length === 1;
        obs.assertions.push({
          name: 'Cart maintains single row for same ID',
          expected: 'rows === 1',
          actual: `rows === ${Array.isArray(afterRes.body) ? afterRes.body.length : 'not_array'}`,
          passed: singleRow
        });

        const mergedQty = singleRow && afterRes.body[0].quantity === 2;
        obs.assertions.push({
          name: 'Quantity merged to 2 (1 + 1)',
          expected: 'quantity === 2',
          actual: `quantity === ${singleRow ? afterRes.body[0].quantity : 'N/A'}`,
          passed: mergedQty
        });

        if (singleRow && mergedQty) {
          obs.status = 'Passed';
          obs.actual = 'Cart contains exactly 1 row with quantity=2';
        } else {
          obs.status = 'Failed';
          obs.actual = `Cart contains ${afterRes.body.length} rows; items: ${JSON.stringify(afterRes.body)}`;
        }
      } else if (tc.id === 'FR07-TC-010') {
        // Precondition: user with A (q=2) in cart. Action: POST A (q=3). Expected: 1 row A, quantity=5.
        const user = await createFreshUser(baseUrl, 'tc010');
        const authHeader = { Authorization: `Bearer ${user.token}` };

        // Setup prestate
        await request(baseUrl, { method: 'POST', path: '/api/cart', headers: authHeader }, { id: 1, name: 'Sản phẩm A', price: 100000, quantity: 2 });
        const beforeRes = await request(baseUrl, { method: 'GET', path: '/api/cart', headers: authHeader });
        obs.stateBefore = beforeRes.body;

        // Action
        const input = { id: 1, name: 'Sản phẩm A', price: 100000, quantity: 3 };
        obs.inputSent = { method: 'POST', path: '/api/cart', body: input, headers: redactHeaders(authHeader) };
        await request(baseUrl, { method: 'POST', path: '/api/cart', headers: authHeader }, input);

        const afterRes = await request(baseUrl, { method: 'GET', path: '/api/cart', headers: authHeader });
        obs.stateAfter = afterRes.body;

        const singleRow = Array.isArray(afterRes.body) && afterRes.body.length === 1;
        obs.assertions.push({
          name: 'Cart maintains single row for same ID',
          expected: 'rows === 1',
          actual: `rows === ${Array.isArray(afterRes.body) ? afterRes.body.length : 'not_array'}`,
          passed: singleRow
        });

        const mergedQty = singleRow && afterRes.body[0].quantity === 5;
        obs.assertions.push({
          name: 'Quantity merged to 5 (2 + 3)',
          expected: 'quantity === 5',
          actual: `quantity === ${singleRow ? afterRes.body[0].quantity : 'N/A'}`,
          passed: mergedQty
        });

        if (singleRow && mergedQty) {
          obs.status = 'Passed';
          obs.actual = 'Cart contains exactly 1 row with quantity=5';
        } else {
          obs.status = 'Failed';
          obs.actual = `Cart contains ${afterRes.body.length} rows; items: ${JSON.stringify(afterRes.body)}`;
        }
      } else if (tc.id === 'FR07-TC-011') {
        // Precondition: empty cart (r=0). Action: POST A (q=1). Expected: 1 row A, quantity=1.
        const user = await createFreshUser(baseUrl, 'tc011');
        const authHeader = { Authorization: `Bearer ${user.token}` };

        const beforeRes = await request(baseUrl, { method: 'GET', path: '/api/cart', headers: authHeader });
        obs.stateBefore = beforeRes.body;

        const input = { id: 1, name: 'Sản phẩm A', price: 100000, quantity: 1 };
        obs.inputSent = { method: 'POST', path: '/api/cart', body: input, headers: redactHeaders(authHeader) };
        await request(baseUrl, { method: 'POST', path: '/api/cart', headers: authHeader }, input);

        const afterRes = await request(baseUrl, { method: 'GET', path: '/api/cart', headers: authHeader });
        obs.stateAfter = afterRes.body;

        const singleRow = Array.isArray(afterRes.body) && afterRes.body.length === 1;
        const validQty = singleRow && afterRes.body[0].quantity === 1;
        obs.assertions.push({
          name: 'Cart contains 1 row with quantity=1',
          expected: 'rows === 1 and quantity === 1',
          actual: `rows: ${afterRes.body.length}, quantity: ${singleRow ? afterRes.body[0].quantity : 'N/A'}`,
          passed: singleRow && validQty
        });

        if (singleRow && validQty) {
          obs.status = 'Passed';
          obs.actual = 'Cart contains 1 row with quantity=1';
        } else {
          obs.status = 'Failed';
          obs.actual = `Cart state: ${JSON.stringify(afterRes.body)}`;
        }
      } else if (tc.id === 'FR07-TC-012') {
        // Precondition: user with A (q=2, r=2). Action: POST A (q=1). Expected: 1 row A, quantity=3.
        const user = await createFreshUser(baseUrl, 'tc012');
        const authHeader = { Authorization: `Bearer ${user.token}` };

        // Add twice to simulate r=2
        await request(baseUrl, { method: 'POST', path: '/api/cart', headers: authHeader }, { id: 1, name: 'Sản phẩm A', price: 100000, quantity: 1 });
        await request(baseUrl, { method: 'POST', path: '/api/cart', headers: authHeader }, { id: 1, name: 'Sản phẩm A', price: 100000, quantity: 1 });
        const beforeRes = await request(baseUrl, { method: 'GET', path: '/api/cart', headers: authHeader });
        obs.stateBefore = beforeRes.body;

        const input = { id: 1, name: 'Sản phẩm A', price: 100000, quantity: 1 };
        obs.inputSent = { method: 'POST', path: '/api/cart', body: input, headers: redactHeaders(authHeader) };
        await request(baseUrl, { method: 'POST', path: '/api/cart', headers: authHeader }, input);

        const afterRes = await request(baseUrl, { method: 'GET', path: '/api/cart', headers: authHeader });
        obs.stateAfter = afterRes.body;

        const singleRow = Array.isArray(afterRes.body) && afterRes.body.length === 1;
        obs.assertions.push({
          name: 'Cart maintains single row for same ID after 3rd add',
          expected: 'rows === 1',
          actual: `rows === ${Array.isArray(afterRes.body) ? afterRes.body.length : 'not_array'}`,
          passed: singleRow
        });

        const mergedQty = singleRow && afterRes.body[0].quantity === 3;
        obs.assertions.push({
          name: 'Quantity merged to 3',
          expected: 'quantity === 3',
          actual: `quantity === ${singleRow ? afterRes.body[0].quantity : 'N/A'}`,
          passed: mergedQty
        });

        if (singleRow && mergedQty) {
          obs.status = 'Passed';
          obs.actual = 'Cart contains 1 row with quantity=3';
        } else {
          obs.status = 'Failed';
          obs.actual = `Cart contains ${afterRes.body.length} rows; items: ${JSON.stringify(afterRes.body)}`;
        }
      } else if (tc.id === 'FR07-TC-013') {
        // Precondition: empty cart. Action: POST A (q=1), POST B (q=1). Expected: 2 rows with id 1 and 2.
        const user = await createFreshUser(baseUrl, 'tc013');
        const authHeader = { Authorization: `Bearer ${user.token}` };

        const beforeRes = await request(baseUrl, { method: 'GET', path: '/api/cart', headers: authHeader });
        obs.stateBefore = beforeRes.body;

        obs.inputSent = [
          { method: 'POST', path: '/api/cart', body: { id: 1, name: 'Sản phẩm A', price: 100000, quantity: 1 } },
          { method: 'POST', path: '/api/cart', body: { id: 2, name: 'Sản phẩm B', price: 250000, quantity: 1 } }
        ];

        await request(baseUrl, { method: 'POST', path: '/api/cart', headers: authHeader }, { id: 1, name: 'Sản phẩm A', price: 100000, quantity: 1 });
        await request(baseUrl, { method: 'POST', path: '/api/cart', headers: authHeader }, { id: 2, name: 'Sản phẩm B', price: 250000, quantity: 1 });

        const afterRes = await request(baseUrl, { method: 'GET', path: '/api/cart', headers: authHeader });
        obs.stateAfter = afterRes.body;

        const twoRows = Array.isArray(afterRes.body) && afterRes.body.length === 2;
        const ids = twoRows ? afterRes.body.map(i => i.id) : [];
        const hasBoth = ids.includes(1) && ids.includes(2);

        obs.assertions.push({
          name: 'Cart contains 2 rows with distinct IDs (1 and 2)',
          expected: 'rows === 2 and contains IDs [1, 2]',
          actual: `rows: ${afterRes.body.length}, IDs: [${ids.join(', ')}]`,
          passed: twoRows && hasBoth
        });

        if (twoRows && hasBoth) {
          obs.status = 'Passed';
          obs.actual = 'Cart contains 2 distinct items (IDs 1 and 2)';
        } else {
          obs.status = 'Failed';
          obs.actual = `Cart state: ${JSON.stringify(afterRes.body)}`;
        }
      } else if (tc.id === 'FR07-TC-030') {
        // Precondition: valid token. Action: GET /api/cart. Expected: 200 OK, array.
        const user = await createFreshUser(baseUrl, 'tc030');
        const authHeader = { Authorization: `Bearer ${user.token}` };

        obs.inputSent = { method: 'GET', path: '/api/cart', headers: redactHeaders(authHeader) };
        const res = await request(baseUrl, { method: 'GET', path: '/api/cart', headers: authHeader });
        obs.stateAfter = res.body;

        const statusOk = res.statusCode === 200;
        const isArray = Array.isArray(res.body);

        obs.assertions.push({
          name: 'Status is 200 OK',
          expected: 'statusCode === 200',
          actual: `statusCode === ${res.statusCode}`,
          passed: statusOk
        });
        obs.assertions.push({
          name: 'Body is an array',
          expected: 'Array.isArray(body) === true',
          actual: `isArray === ${isArray}`,
          passed: isArray
        });

        if (statusOk && isArray) {
          obs.status = 'Passed';
          obs.actual = `200 OK, returned array with length ${res.body.length}`;
        } else {
          obs.status = 'Failed';
          obs.actual = `Status: ${res.statusCode}, body: ${JSON.stringify(res.body)}`;
        }
      } else if (tc.id === 'FR07-TC-031') {
        // Precondition: no token. Action: GET /api/cart. Expected: 401 or 403.
        obs.inputSent = { method: 'GET', path: '/api/cart', headers: {} };
        const res = await request(baseUrl, { method: 'GET', path: '/api/cart', headers: {} });
        obs.stateAfter = res.body;

        const rejected = res.statusCode === 401 || res.statusCode === 403;
        obs.assertions.push({
          name: 'Request rejected without authorization header',
          expected: 'statusCode in [401, 403]',
          actual: `statusCode === ${res.statusCode}`,
          passed: rejected
        });

        if (rejected) {
          obs.status = 'Passed';
          obs.actual = `Rejected with HTTP ${res.statusCode}`;
        } else {
          obs.status = 'Failed';
          obs.actual = `Unexpected HTTP ${res.statusCode}: ${JSON.stringify(res.body)}`;
        }
      } else if (tc.id === 'FR07-TC-032') {
        // Precondition: invalid token. Action: POST /api/cart. Expected: 401 or 403, no change to any cart.
        const fakeHeader = { Authorization: 'Bearer invalid_secret_token_123' };
        const input = { id: 1, name: 'Sản phẩm A', price: 100000, quantity: 1 };
        obs.inputSent = { method: 'POST', path: '/api/cart', body: input, headers: redactHeaders(fakeHeader) };

        const res = await request(baseUrl, { method: 'POST', path: '/api/cart', headers: fakeHeader }, input);
        obs.stateAfter = res.body;

        const rejected = res.statusCode === 401 || res.statusCode === 403;
        obs.assertions.push({
          name: 'Request rejected with invalid bearer token',
          expected: 'statusCode in [401, 403]',
          actual: `statusCode === ${res.statusCode}`,
          passed: rejected
        });

        if (rejected) {
          obs.status = 'Passed';
          obs.actual = `Rejected with HTTP ${res.statusCode}`;
        } else {
          obs.status = 'Failed';
          obs.actual = `Unexpected HTTP ${res.statusCode}: ${JSON.stringify(res.body)}`;
        }
      }

      obs.endedAt = new Date().toISOString();
      console.log(`  -> Result: ${obs.status} (${obs.actual})`);
      if (obs.status === 'Passed') passedCount++;
      else if (obs.status === 'Failed') failedCount++;
      else if (obs.status === 'Blocked') blockedCount++;
    } catch (err) {
      obs.endedAt = new Date().toISOString();
      obs.status = 'Blocked';
      obs.blocker = err.message;
      obs.actual = `Execution error: ${err.message}`;
      console.error(`  -> ERROR: ${err.message}`);
      blockedCount++;
    }

    observations.push(obs);
  }

  const outFilePath = path.join(outDir, 'observations.json');
  fs.writeFileSync(outFilePath, JSON.stringify(observations, null, 2), 'utf8');
  console.log(`\nAPI Observations written to: ${outFilePath}`);
  console.log(`Summary: Total ${apiCases.length} | Passed: ${passedCount} | Failed: ${failedCount} | Blocked: ${blockedCount}`);

  if (blockedCount > 0 || failedCount > 0) {
    process.exit(2);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal API runner error:', err);
  process.exit(1);
});
