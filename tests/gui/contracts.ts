/**
 * Hợp đồng dữ liệu chung cho kiểm thử GUI EShop (HW03)
 */

export type ItemId = `GUI-${string}`; // runtime validate /^GUI-\d{3}$/ và tập 001..070
export type Screen = 'FR-05' | 'FR-07' | 'FR-03' | 'FR-15';
export type IA = 'IA-01' | 'IA-02' | 'IA-03' | 'IA-04';
export type Status = 'Not Run' | 'Passed' | 'Failed';
export type Mode = 'mock-ui' | 'live' | 'manual';
export type Outcome =
  | 'passed'
  | 'assertion-failed'
  | 'blocked'
  | 'skipped'
  | 'timed-out'
  | 'interrupted';
export type FailureKind = 'product' | 'harness' | 'infra' | 'unknown';

export interface ChecklistItem {
  id: ItemId;
  ia: IA;
  screen: Screen;
  requirement_ids: string;
  check: string;
  expected: string;
  preconditions: string;
  test_data: string;
  steps: string;
  measurement: string;
  evidence_needed: string;
  priority: string;
  status: Status;
  actual_result: string;
  notes: string;
  evidence_path: string;
  origin: string;
  addition_reason: string;
}

export interface CaseDefinition {
  itemId: ItemId;
  caseId: string;
  screen: Screen;
  ia: IA;
  mode: Mode;
  required: boolean;
  targetIds: string[];
  requirementIds: string[];
}

export interface Attempt {
  runId: string;
  itemId: ItemId;
  caseId: string;
  targetId: string;
  mode: Mode;
  retry: number;
  outcome: Outcome;
  failureKind?: FailureKind;
  actual: string;
  error?: string;
  evidence: string[];
  startedAt: string;
  endedAt: string;
  environment: Record<string, string>;
  expected_raw?: string;
  expected_resolved?: string; // case có thay tham số dữ liệu
}

export interface ItemResult {
  id: ItemId;
  status: Status;
  actual_result: string;
  notes: string;
  evidence_path: string; // PNG lỗi chính, repo-relative; manifest đầy đủ ghi trong notes
}

export interface RunManifest {
  runId: string;
  sourceSha256: string;
  buildCommit: string;
  dirty: boolean;
  scope: ItemId[];
  targetIds: string[];
  kind: 'diagnostic' | 'qualification';
  startedAt: string;
  executionDataPath: string; // snapshot 5 sản phẩm và substitutions của run
}

export interface RunMatrix {
  manifest: RunManifest;
  cases: CaseDefinition[];
  attempts: Attempt[];
  items: ItemResult[];
}

export interface ManualResult extends Attempt {
  mode: 'manual';
  reviewer: string;
  device: string;
  tool: string;
}

export interface CommitReceipt {
  backupPath: string;
  outputSha256: string;
  changedIds: ItemId[];
}

export interface BugCandidate {
  key: string;
  itemIds: ItemId[];
  requirementIds: string[];
  targetIds: string[];
  title: string;
  severity: 'S1' | 'S2' | 'S3' | 'S4';
  priority: 'P1' | 'P2' | 'P3';
  expected: string[];
  actual: string[];
  steps: string[];
  evidence: string[];
  expected_raw: string[];
  expected_resolved: string[];
  environment: Record<string, string>[];
  basis: 'README' | 'checklist-extension';
}
