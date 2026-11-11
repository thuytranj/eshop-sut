import fs from 'node:fs';
import path from 'node:path';
import { type Reporter, type TestCase, type TestResult, type FullResult } from '@playwright/test/reporter';
import { type Attempt, type ItemId, type Mode, type Outcome, type FailureKind } from '../contracts.ts';
import { classifyFailure } from './aggregate.ts';

export class AttemptReporter implements Reporter {
  private attempts: Attempt[] = [];
  private runId: string;
  private outputDir: string;

  constructor(options: { runId?: string; outputDir?: string } = {}) {
    this.runId = options.runId || process.env.RUN_ID || `run-${Date.now()}`;
    this.outputDir = options.outputDir || process.env.RUN_DIR || path.resolve('artifacts/gui', this.runId);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    // Extract ItemId, CaseId, and session metadata from annotations or title
    let itemId: ItemId | null = null;
    let caseId: string | null = null;
    let mode: Mode = 'mock-ui';
    let sessionIdentity: any = null;

    for (const ann of test.annotations) {
      if (ann.type === 'itemId') itemId = ann.description as ItemId;
      if (ann.type === 'caseId') caseId = ann.description || '';
      if (ann.type === 'mode') mode = ann.description as Mode;
      if (ann.type === 'sessionIdentity' && ann.description) {
        try {
          sessionIdentity = JSON.parse(ann.description);
        } catch {}
      }
    }

    if (!itemId) {
      const match = test.title.match(/\[(GUI-\d{3})\]/);
      if (match) itemId = match[1] as ItemId;
    }

    if (!itemId) {
      return;
    }

    let outcome: Outcome = 'passed';
    let failureKind: FailureKind | undefined;
    let errorMsg: string | undefined;

    if (result.status === 'timedOut') {
      outcome = 'timed-out';
      failureKind = classifyFailure('timed out', 'assertion');
      errorMsg = 'Test execution timed out';
    } else if (result.status === 'failed' || result.status === 'interrupted') {
      outcome = 'assertion-failed';
      errorMsg = result.errors.map((e) => e.message || '').join('\n');
      failureKind = classifyFailure(errorMsg, 'assertion');
    } else if (result.status === 'skipped') {
      outcome = 'skipped';
    }

    // Extract evidence paths from attachments
    const evidence: string[] = [];
    for (const att of result.attachments) {
      if (att.path) {
        evidence.push(att.path);
      }
    }

    const projectName = test.parent?.project()?.name || 'chrome-local';
    const targetId = sessionIdentity?.platformId || projectName;

    const environment: Record<string, string> = sessionIdentity
      ? {
          browser: sessionIdentity.browser,
          browserVersion: sessionIdentity.browserVersion,
          os: sessionIdentity.os,
          osVersion: sessionIdentity.osVersion,
          ...(sessionIdentity.device ? { device: sessionIdentity.device } : {}),
          platformId: sessionIdentity.platformId,
          sessionId: sessionIdentity.id,
        }
      : {
          browser: 'chrome',
          platform: process.platform,
        };

    const attempt: Attempt = {
      runId: this.runId,
      itemId,
      caseId: caseId || test.title,
      targetId,
      mode,
      retry: result.retry,
      outcome,
      failureKind,
      actual: errorMsg ? errorMsg.slice(0, 300) : 'Passed verification',
      error: errorMsg,
      evidence,
      startedAt: result.startTime.toISOString(),
      endedAt: new Date(result.startTime.getTime() + result.duration).toISOString(),
      environment,
    };

    this.attempts.push(attempt);
  }

  async onEnd(result: FullResult): Promise<void> {
    fs.mkdirSync(this.outputDir, { recursive: true });
    const attemptsPath = path.join(this.outputDir, 'attempts.json');
    let existingAttempts: Attempt[] = [];
    if (fs.existsSync(attemptsPath)) {
      try {
        existingAttempts = JSON.parse(fs.readFileSync(attemptsPath, 'utf-8'));
      } catch {}
    }
    const combined = [...existingAttempts, ...this.attempts];
    fs.writeFileSync(attemptsPath, JSON.stringify(combined, null, 2), 'utf-8');
  }

  getAttempts(): Attempt[] {
    return this.attempts;
  }
}

export default AttemptReporter;
