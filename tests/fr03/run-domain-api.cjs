const fs = require('fs');
const path = require('path');

// Parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    backendDir: null,
    baseUrl: 'http://localhost:3000',
    outDir: path.resolve(__dirname, '../../docs/testing/fr03/evidence/api')
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--backend-dir' && args[i + 1]) {
      parsed.backendDir = path.resolve(args[++i]);
    } else if (args[i] === '--base-url' && args[i + 1]) {
      parsed.baseUrl = args[++i];
    } else if (args[i] === '--out' && args[i + 1]) {
      parsed.outDir = path.resolve(args[++i]);
    }
  }

  if (!parsed.backendDir) {
    console.error('Error: --backend-dir <path> is required');
    process.exit(1);
  }

  return parsed;
}

const { backendDir, baseUrl, outDir } = parseArgs();

// Guard against working backend
const workingBackendDir = path.resolve(__dirname, '../../backend');
if (backendDir === workingBackendDir) {
  console.error('CRITICAL SAFETY ERROR: Refusing to run tests against working backend directory!');
  console.error('You must specify an isolated backend directory (e.g. /tmp/eshop-fr03.XXXXXX/backend)');
  process.exit(1);
}

const dbPath = path.join(backendDir, 'database.sqlite');
if (!fs.existsSync(dbPath)) {
  console.error(`Error: Isolated database does not exist at ${dbPath}`);
  process.exit(1);
}

// Require sqlite3 from the isolated backend
let sqlite3;
try {
  sqlite3 = require(path.join(backendDir, 'node_modules/sqlite3')).verbose();
} catch (e) {
  try {
    sqlite3 = require('sqlite3').verbose();
  } catch (err) {
    console.error('Error loading sqlite3:', err);
    process.exit(1);
  }
}

const db = new sqlite3.Database(dbPath);

function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function resetFixtures() {
  // Ensure A
  const userA = await dbGet('SELECT * FROM users WHERE email = ?', ['fr03-a@example.com']);
  if (!userA) {
    await dbRun(
      'INSERT INTO users (name, email, password, role, reset_token, login_attempts, locked_until) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['User A', 'fr03-a@example.com', 'OldPass1!', 'customer', '123456', 0, null]
    );
  } else {
    await dbRun(
      'UPDATE users SET password = ?, reset_token = ?, login_attempts = 0, locked_until = NULL WHERE email = ?',
      ['OldPass1!', '123456', 'fr03-a@example.com']
    );
  }

  // Ensure B
  const userB = await dbGet('SELECT * FROM users WHERE email = ?', ['fr03-b@example.com']);
  if (!userB) {
    await dbRun(
      'INSERT INTO users (name, email, password, role, reset_token, login_attempts, locked_until) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['User B', 'fr03-b@example.com', 'OldPass1!', 'customer', '654321', 0, null]
    );
  } else {
    await dbRun(
      'UPDATE users SET password = ?, reset_token = ?, login_attempts = 0, locked_until = NULL WHERE email = ?',
      ['OldPass1!', '654321', 'fr03-b@example.com']
    );
  }

  // Ensure C absent
  await dbRun('DELETE FROM users WHERE email = ?', ['fr03-missing@example.com']);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  const suitePath = path.resolve(__dirname, 'suite.json');
  const suite = JSON.parse(fs.readFileSync(suitePath, 'utf8'));
  const apiCases = suite.filter(c => c.layer === 'API');

  console.log(`Starting API execution of ${apiCases.length} cases against ${baseUrl}`);
  console.log(`Isolated backend DB: ${dbPath}`);

  const observations = [];
  let conformanceFailures = 0;

  for (const tc of apiCases) {
    const timestamp = new Date().toISOString();
    await resetFixtures();

    const stateBefore = {
      userA: await dbGet('SELECT email, password, reset_token FROM users WHERE email = ?', ['fr03-a@example.com']),
      userB: await dbGet('SELECT email, password, reset_token FROM users WHERE email = ?', ['fr03-b@example.com'])
    };

    let responseStatus = null;
    let responseBody = null;
    let requestError = null;

    try {
      if (tc.id === 'FR03-TC-001' || tc.id === 'FR03-TC-002') {
        const res = await fetch(`${baseUrl}/api/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tc.fixture)
        });
        responseStatus = res.status;
        responseBody = await res.json().catch(() => null);
      } else {
        const res = await fetch(`${baseUrl}/api/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tc.fixture)
        });
        responseStatus = res.status;
        responseBody = await res.json().catch(() => null);
      }
    } catch (err) {
      requestError = err.message;
    }

    const stateAfter = {
      userA: await dbGet('SELECT email, password, reset_token FROM users WHERE email = ?', ['fr03-a@example.com']),
      userB: await dbGet('SELECT email, password, reset_token FROM users WHERE email = ?', ['fr03-b@example.com'])
    };

    // Evaluate conformance
    let verdict = 'Passed';
    let verdictReason = 'Observed outcome matched expected specification.';

    if (requestError) {
      verdict = 'Failed';
      verdictReason = `Network/HTTP error: ${requestError}`;
    } else if (tc.id === 'FR03-TC-001') {
      const token = responseBody && responseBody.resetToken;
      const isSixDigit = typeof token === 'string' && /^[0-9]{6}$/.test(token);
      if (responseStatus !== 200) {
        verdict = 'Failed';
        verdictReason = `Expected status 200, got ${responseStatus}`;
      } else if (!isSixDigit) {
        verdict = 'Failed';
        verdictReason = `Issued OTP '${token}' does not match 6-digit specification ^[0-9]{6}$ (actual length: ${token ? token.length : 0})`;
      } else if (stateAfter.userA.reset_token !== token) {
        verdict = 'Failed';
        verdictReason = `Database reset_token '${stateAfter.userA.reset_token}' does not match response token '${token}'`;
      } else if (stateAfter.userA.password !== 'OldPass1!') {
        verdict = 'Failed';
        verdictReason = 'Password was mutated during issuance';
      }
    } else if (tc.id === 'FR03-TC-002') {
      if (responseStatus >= 200 && responseStatus < 300) {
        verdict = 'Failed';
        verdictReason = `Expected 4xx rejection for missing email, got ${responseStatus}`;
      }
    } else {
      // Reset cases
      const isExpectedSuccess = tc.expected.startsWith('Status 200');
      const targetEmail = tc.fixture.email;
      const targetUser = targetEmail === 'fr03-b@example.com' ? stateAfter.userB : stateAfter.userA;
      const otherUser = targetEmail === 'fr03-b@example.com' ? stateAfter.userA : stateAfter.userB;

      if (isExpectedSuccess) {
        if (responseStatus !== 200) {
          verdict = 'Failed';
          verdictReason = `Expected HTTP 200, got ${responseStatus}: ${JSON.stringify(responseBody)}`;
        } else if (targetUser.password !== tc.fixture.newPassword) {
          verdict = 'Failed';
          verdictReason = `Expected password to be '${tc.fixture.newPassword}', but got '${targetUser.password}'`;
        } else if (targetUser.reset_token !== null) {
          verdict = 'Failed';
          verdictReason = `Expected reset_token to be cleared to NULL, but got '${targetUser.reset_token}'`;
        }
      } else {
        // Negative case: Must be rejected and password must NOT change!
        if (responseStatus === 200) {
          verdict = 'Failed';
          verdictReason = `Expected rejection for invalid input, but server returned HTTP 200 and accepted the reset! Password was changed to '${targetUser.password}'.`;
        } else if (stateAfter.userA.password !== 'OldPass1!' || stateAfter.userB.password !== 'OldPass1!') {
          verdict = 'Failed';
          verdictReason = `Password was mutated during rejected request: A='${stateAfter.userA.password}', B='${stateAfter.userB.password}'`;
        }
      }
    }

    if (verdict === 'Failed') {
      conformanceFailures++;
    }

    const observation = {
      caseId: tc.id,
      timestamp,
      layer: 'API',
      request: {
        endpoint: tc.id === 'FR03-TC-001' || tc.id === 'FR03-TC-002' ? '/api/forgot-password' : '/api/reset-password',
        body: tc.fixture
      },
      response: {
        status: responseStatus,
        body: responseBody,
        error: requestError
      },
      stateBefore,
      stateAfter,
      expected: tc.expected,
      verdict,
      verdictReason
    };

    observations.push(observation);
    console.log(`[${verdict.padEnd(6)}] ${tc.id} - ${verdictReason.slice(0, 80)}`);
  }

  const outFilePath = path.join(outDir, 'observations.json');
  fs.writeFileSync(outFilePath, JSON.stringify(observations, null, 2), 'utf8');
  console.log(`\nAPI Execution Complete.`);
  console.log(`Total Cases: ${apiCases.length}`);
  console.log(`Passed: ${apiCases.length - conformanceFailures}`);
  console.log(`Failed (Conformance discrepancies): ${conformanceFailures}`);
  console.log(`Evidence saved to ${outFilePath}`);

  db.close();

  // Exit 0 if all passed, exit 2 if conformance failures observed (as specified in plan)
  if (conformanceFailures > 0) {
    process.exit(2);
  } else {
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Harness fatal error:', err);
  process.exit(1);
});
