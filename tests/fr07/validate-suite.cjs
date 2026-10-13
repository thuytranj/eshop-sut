#!/usr/bin/env node
/**
 * validate-suite.cjs
 * Validator and reconciler for FR-07 Shopping Cart test suite.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function validateSuite(cases) {
  const errors = [];
  const canonicalIds = new Set();
  const sourceIdMap = new Map();
  const obligationSet = new Set();
  const techniqueSet = new Set();
  const rulesSet = new Set();

  let apiCount = 0;
  let webCount = 0;

  if (!Array.isArray(cases) || cases.length === 0) {
    errors.push('Suite must be a non-empty array of test cases');
    return { errors, stats: {} };
  }

  const requiredFields = [
    'id', 'sourceCaseIds', 'techniques', 'layer', 'rules',
    'obligations', 'oracleStatus', 'preconditions', 'fixture',
    'steps', 'expected', 'actual', 'status', 'evidence'
  ];

  for (let i = 0; i < cases.length; i++) {
    const tc = cases[i];
    const prefix = `Case #${i + 1} (${tc.id || 'NO_ID'})`;

    // Check required fields
    for (const f of requiredFields) {
      if (!(f in tc)) {
        errors.push(`${prefix}: Missing required field '${f}'`);
      }
    }

    // Check canonical ID format and uniqueness
    if (!tc.id || !/^FR07-TC-\d{3}$/.test(tc.id)) {
      errors.push(`${prefix}: Invalid ID format, expected FR07-TC-xxx`);
    } else if (canonicalIds.has(tc.id)) {
      errors.push(`${prefix}: Duplicate canonical ID '${tc.id}'`);
    } else {
      canonicalIds.add(tc.id);
    }

    // Check layer
    if (tc.layer === 'API') {
      apiCount++;
    } else if (tc.layer === 'WEB') {
      webCount++;
    } else {
      errors.push(`${prefix}: Invalid layer '${tc.layer}', expected API or WEB`);
    }

    // Check techniques
    if (!Array.isArray(tc.techniques) || tc.techniques.length === 0) {
      errors.push(`${prefix}: 'techniques' must be a non-empty array`);
    } else {
      for (const t of tc.techniques) {
        if (!['Domain Testing', 'BVA', 'Supplementary'].includes(t)) {
          errors.push(`${prefix}: Unknown technique '${t}'`);
        }
        techniqueSet.add(t);
      }
    }

    // Check sourceCaseIds
    if (!Array.isArray(tc.sourceCaseIds) || tc.sourceCaseIds.length === 0) {
      errors.push(`${prefix}: 'sourceCaseIds' must be a non-empty array`);
    } else {
      for (const src of tc.sourceCaseIds) {
        if (sourceIdMap.has(src)) {
          errors.push(`${prefix}: Duplicate source ID '${src}', already mapped in '${sourceIdMap.get(src)}'`);
        } else {
          sourceIdMap.set(src, tc.id);
        }
      }
    }

    // Check obligations
    if (!Array.isArray(tc.obligations) || tc.obligations.length === 0) {
      errors.push(`${prefix}: 'obligations' must be a non-empty array`);
    } else {
      for (const obl of tc.obligations) {
        obligationSet.add(obl);
      }
    }

    // Check rules
    if (!Array.isArray(tc.rules) || tc.rules.length === 0) {
      errors.push(`${prefix}: 'rules' must be a non-empty array`);
    } else {
      for (const r of tc.rules) {
        rulesSet.add(r);
      }
    }

    // Check oracleStatus
    if (!['confirmed', 'derived', 'unresolved'].includes(tc.oracleStatus)) {
      errors.push(`${prefix}: Invalid oracleStatus '${tc.oracleStatus}'`);
    }

    // Check initial status
    if (tc.status !== 'Not Run') {
      errors.push(`${prefix}: Frozen canonical status must be 'Not Run', got '${tc.status}'`);
    }
    if (tc.actual !== null) {
      errors.push(`${prefix}: Frozen canonical actual must be null`);
    }
    if (!Array.isArray(tc.evidence) || tc.evidence.length !== 0) {
      errors.push(`${prefix}: Frozen canonical evidence must be empty array`);
    }
  }

  const stats = {
    totalCanonicalCases: cases.length,
    apiCases: apiCount,
    webCases: webCount,
    totalSourceCasesMapped: sourceIdMap.size,
    totalUniqueObligations: obligationSet.size,
    uniqueRulesCovered: rulesSet.size,
    techniques: Array.from(techniqueSet)
  };

  return { errors, stats };
}

function reconcile(cases, observationList) {
  const errors = [];
  const caseMap = new Map(cases.map(c => [c.id, c]));
  const observedMap = new Map();

  let passed = 0;
  let failed = 0;
  let blocked = 0;
  let notRun = 0;

  for (const obs of observationList) {
    if (!obs.caseId) {
      errors.push('Observation missing caseId');
      continue;
    }
    if (!caseMap.has(obs.caseId)) {
      errors.push(`Observation references unknown caseId '${obs.caseId}'`);
      continue;
    }
    if (observedMap.has(obs.caseId)) {
      errors.push(`Duplicate observation for caseId '${obs.caseId}'`);
      continue;
    }
    observedMap.set(obs.caseId, obs);

    if (obs.status === 'Passed') passed++;
    else if (obs.status === 'Failed') failed++;
    else if (obs.status === 'Blocked') blocked++;
    else if (obs.status === 'Not Run') notRun++;
    else errors.push(`Unknown status '${obs.status}' in observation for '${obs.caseId}'`);

    // Verify evidence paths if present
    if (Array.isArray(obs.evidence)) {
      for (const ev of obs.evidence) {
        if (typeof ev === 'string' && ev.startsWith('/') && !fs.existsSync(ev)) {
          errors.push(`Evidence path does not exist for '${obs.caseId}': ${ev}`);
        }
      }
    }
  }

  // Check for missing cases
  const missingCases = [];
  for (const tc of cases) {
    if (!observedMap.has(tc.id)) {
      missingCases.push(tc.id);
    }
  }

  const reconciliationStats = {
    totalCases: cases.length,
    observedCases: observedMap.size,
    missingCases: missingCases.length,
    passed,
    failed,
    blocked,
    notRun,
    executed: passed + failed
  };

  return { errors, missingCases, stats: reconciliationStats };
}

function computeSuiteHash(cases) {
  const content = JSON.stringify(cases);
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  let suiteFile = null;
  const observationFiles = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--suite' && i + 1 < args.length) {
      suiteFile = args[++i];
    } else if (args[i] === '--observations') {
      while (i + 1 < args.length && !args[i + 1].startsWith('--')) {
        observationFiles.push(args[++i]);
      }
    } else if (args[i] === '--self-check') {
      runSelfCheck();
      process.exit(0);
    }
  }

  if (!suiteFile) {
    console.error('Usage: node validate-suite.cjs --suite <path/to/suite.json> [--observations <obs1.json> <obs2.json>]');
    process.exit(1);
  }

  if (!fs.existsSync(suiteFile)) {
    console.error(`Suite file not found: ${suiteFile}`);
    process.exit(1);
  }

  let suiteData;
  try {
    suiteData = JSON.parse(fs.readFileSync(suiteFile, 'utf8'));
  } catch (err) {
    console.error(`Failed to parse suite JSON: ${err.message}`);
    process.exit(1);
  }

  const { errors, stats } = validateSuite(suiteData);
  const suiteHash = computeSuiteHash(suiteData);

  console.log('--- Suite Validation Report ---');
  console.log(`Suite Hash (SHA-256): ${suiteHash}`);
  console.log(`Total Canonical Cases: ${stats.totalCanonicalCases}`);
  console.log(`API Cases: ${stats.apiCases}`);
  console.log(`WEB Cases: ${stats.webCases}`);
  console.log(`Source Cases Mapped: ${stats.totalSourceCasesMapped}`);
  console.log(`Unique Obligations: ${stats.totalUniqueObligations}`);
  console.log(`Unique Rules: ${stats.uniqueRulesCovered}`);

  if (errors.length > 0) {
    console.error('\nValidation Errors:');
    for (const e of errors) {
      console.error(`  - ${e}`);
    }
    process.exit(1);
  }
  console.log('\nSuite validation PASSED.');

  if (observationFiles.length > 0) {
    console.log('\n--- Reconciling Observations ---');
    const allObs = [];
    for (const obsFile of observationFiles) {
      if (!fs.existsSync(obsFile)) {
        console.error(`Observation file not found: ${obsFile}`);
        process.exit(1);
      }
      try {
        const obsData = JSON.parse(fs.readFileSync(obsFile, 'utf8'));
        if (Array.isArray(obsData)) {
          allObs.push(...obsData);
        } else if (obsData && Array.isArray(obsData.observations)) {
          allObs.push(...obsData.observations);
        } else {
          console.error(`Invalid format in observation file: ${obsFile}`);
          process.exit(1);
        }
      } catch (err) {
        console.error(`Failed to parse observations in ${obsFile}: ${err.message}`);
        process.exit(1);
      }
    }

    const { errors: recErrors, missingCases, stats: recStats } = reconcile(suiteData, allObs);
    console.log(`Observed Cases: ${recStats.observedCases}/${recStats.totalCases}`);
    console.log(`Passed: ${recStats.passed}, Failed: ${recStats.failed}, Blocked: ${recStats.blocked}, Not Run: ${recStats.notRun}`);
    console.log(`Executed: ${recStats.executed}`);

    if (missingCases.length > 0) {
      console.warn(`Missing cases without observations (${missingCases.length}): ${missingCases.join(', ')}`);
    }

    if (recErrors.length > 0) {
      console.error('\nReconciliation Errors:');
      for (const e of recErrors) {
        console.error(`  - ${e}`);
      }
      process.exit(1);
    }
    console.log('\nReconciliation PASSED.');
  }

  process.exit(0);
}

function runSelfCheck() {
  const assert = require('assert');
  console.log('Running validate-suite self-checks...');

  // Check duplicate ID rejection
  const badSuiteDupId = [
    { id: 'FR07-TC-001', sourceCaseIds: ['S1'], techniques: ['Domain Testing'], layer: 'WEB', rules: ['R1'], obligations: ['O1'], oracleStatus: 'confirmed', preconditions: 'p', fixture: 'f', steps: ['s'], expected: 'e', actual: null, status: 'Not Run', evidence: [] },
    { id: 'FR07-TC-001', sourceCaseIds: ['S2'], techniques: ['Domain Testing'], layer: 'WEB', rules: ['R1'], obligations: ['O2'], oracleStatus: 'confirmed', preconditions: 'p', fixture: 'f', steps: ['s'], expected: 'e', actual: null, status: 'Not Run', evidence: [] }
  ];
  const res1 = validateSuite(badSuiteDupId);
  assert(res1.errors.some(e => e.includes('Duplicate canonical ID')), 'Should reject duplicate canonical ID');

  // Check duplicate source ID rejection
  const badSuiteDupSource = [
    { id: 'FR07-TC-001', sourceCaseIds: ['S1'], techniques: ['Domain Testing'], layer: 'WEB', rules: ['R1'], obligations: ['O1'], oracleStatus: 'confirmed', preconditions: 'p', fixture: 'f', steps: ['s'], expected: 'e', actual: null, status: 'Not Run', evidence: [] },
    { id: 'FR07-TC-002', sourceCaseIds: ['S1'], techniques: ['Domain Testing'], layer: 'WEB', rules: ['R1'], obligations: ['O2'], oracleStatus: 'confirmed', preconditions: 'p', fixture: 'f', steps: ['s'], expected: 'e', actual: null, status: 'Not Run', evidence: [] }
  ];
  const res2 = validateSuite(badSuiteDupSource);
  assert(res2.errors.some(e => e.includes('Duplicate source ID')), 'Should reject duplicate source ID');

  // Check initial status requirement
  const badSuiteStatus = [
    { id: 'FR07-TC-001', sourceCaseIds: ['S1'], techniques: ['Domain Testing'], layer: 'WEB', rules: ['R1'], obligations: ['O1'], oracleStatus: 'confirmed', preconditions: 'p', fixture: 'f', steps: ['s'], expected: 'e', actual: 'something', status: 'Passed', evidence: [] }
  ];
  const res3 = validateSuite(badSuiteStatus);
  assert(res3.errors.some(e => e.includes('Frozen canonical status must be \'Not Run\'')), 'Should reject non-Not-Run initial status');

  console.log('All validator self-checks PASSED.');
}

module.exports = { validateSuite, reconcile, computeSuiteHash };
