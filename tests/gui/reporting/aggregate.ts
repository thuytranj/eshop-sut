import {
  type FailureKind,
  type RunManifest,
  type CaseDefinition,
  type Attempt,
  type RunMatrix,
  type ItemResult,
  type ItemId,
  type Status,
} from '../contracts.ts';

export function classifyFailure(
  error: string,
  phase: 'setup' | 'assertion' | 'teardown',
  observed: Record<string, string> = {}
): FailureKind {
  if (phase === 'setup' || phase === 'teardown') {
    return 'harness';
  }

  const lower = error.toLowerCase();
  if (
    lower.includes('econnrefused') ||
    lower.includes('etimedout') ||
    lower.includes('net::err_connection_refused') ||
    lower.includes('browser has been closed')
  ) {
    return 'infra';
  }

  if (
    lower.includes('assertionerror') ||
    lower.includes('expect(') ||
    lower.includes('expected') ||
    lower.includes('to be visible') ||
    lower.includes('strictly equal')
  ) {
    return 'product';
  }

  return 'unknown';
}

export function aggregateResults(
  manifest: RunManifest,
  cases: CaseDefinition[],
  attempts: Attempt[]
): RunMatrix {
  // Group cases and attempts by ItemId
  const casesByItem = new Map<ItemId, CaseDefinition[]>();
  for (const c of cases) {
    const list = casesByItem.get(c.itemId) || [];
    list.push(c);
    casesByItem.set(c.itemId, list);
  }

  const attemptsByItem = new Map<ItemId, Attempt[]>();
  for (const a of attempts) {
    const list = attemptsByItem.get(a.itemId) || [];
    list.push(a);
    attemptsByItem.set(a.itemId, list);
  }

  const items: ItemResult[] = [];

  // All 70 items from manifest.scope or cases
  const allItemIds: ItemId[] = manifest.scope && manifest.scope.length
    ? manifest.scope
    : Array.from(casesByItem.keys());

  for (const itemId of allItemIds) {
    const itemCases = casesByItem.get(itemId) || [];
    const itemAttempts = attemptsByItem.get(itemId) || [];

    // Check for confirmed product failure
    const productFailures = itemAttempts.filter(
      (a) => a.outcome === 'assertion-failed' || a.failureKind === 'product'
    );

    if (productFailures.length > 0) {
      const mainFail = productFailures[0];
      const primaryEvidence = mainFail.evidence.length > 0 ? mainFail.evidence[0] : '';
      items.push({
        id: itemId,
        status: 'Failed',
        actual_result: mainFail.actual || mainFail.error || 'Assertion failure observed',
        notes: `run=${manifest.runId}; target=${mainFail.targetId}; mode=${mainFail.mode}; failureKind=product; attempts=${itemAttempts.length}`,
        evidence_path: primaryEvidence,
      });
      continue;
    }

    // Check infra timeout or blocked
    const infraFailures = itemAttempts.filter(
      (a) => a.failureKind === 'infra' || a.failureKind === 'harness' || a.outcome === 'blocked'
    );
    if (infraFailures.length > 0 && itemAttempts.length === infraFailures.length) {
      const fail = infraFailures[0];
      items.push({
        id: itemId,
        status: 'Not Run',
        actual_result: `Blocked before assertion: ${fail.error || 'Infrastructure failure'}`,
        notes: `run=${manifest.runId}; failureKind=${fail.failureKind}`,
        evidence_path: '',
      });
      continue;
    }

    // Check if all required cases are executed and passed
    const requiredCases = itemCases.filter((c) => c.required);
    let allRequiredPassed = requiredCases.length > 0;

    for (const reqCase of requiredCases) {
      const matchAttempts = itemAttempts.filter(
        (a) => a.caseId === reqCase.caseId && reqCase.targetIds.includes(a.targetId)
      );

      if (!matchAttempts.length) {
        allRequiredPassed = false;
        break;
      }

      // Check if latest attempt passed and not flaky
      const hasFailure = matchAttempts.some((a) => a.outcome !== 'passed');
      if (hasFailure) {
        allRequiredPassed = false;
        break;
      }
    }

    if (allRequiredPassed) {
      const last = itemAttempts[itemAttempts.length - 1];
      items.push({
        id: itemId,
        status: 'Passed',
        actual_result: last.actual || 'Tất cả tiêu chí kiểm tra đã được xác nhận đạt yêu cầu',
        notes: `run=${manifest.runId}; cases=${itemCases.length}; attempts=${itemAttempts.length}`,
        evidence_path: '',
      });
    } else {
      items.push({
        id: itemId,
        status: 'Not Run',
        actual_result: itemAttempts.length ? 'Chưa hoàn thành đầy đủ các case bắt buộc hoặc thiếu kiểm tra thủ công' : 'Chưa thực thi',
        notes: `run=${manifest.runId}; pendingCases=${requiredCases.length}`,
        evidence_path: '',
      });
    }
  }

  return {
    manifest,
    cases,
    attempts,
    items,
  };
}
