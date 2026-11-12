import type { BrowserContext, Page, Locator, TestInfo, PlaywrightWorkerArgs } from '@playwright/test';
import type { ItemId, ChecklistItem, Mode, Status, Attempt, CaseDefinition } from '../contracts.js';

export type PlatformId = 'p1-chrome-win11' | 'p2-firefox-win11' | 'p3-android-chrome';

export type Playwright = PlaywrightWorkerArgs['playwright'];

export type CompatibilityLock = {
  clientVersion: string;
  remoteVersions: Record<PlatformId, string>;
  verified: boolean;
};

export type PlatformSpec = {
  id: PlatformId;
  transport: 'desktop' | 'android';
  requested: Record<string, string>;
};

export type SutURLs = {
  web: string;
  admin: string;
  api: string;
};

export type LocalEnvironment = {
  runnerURLs: SutURLs;
  remoteURLs: SutURLs;
  sourceSha: string;
  contentSha256: string;
  stop(): Promise<void>;
};

export type LocalTunnel = {
  localIdentifier: string;
  isRunning(): boolean;
  stop(): Promise<void>;
};

export type CloudEnv = {
  username: string;
  accessKey: string;
  webURL: string;
  adminURL: string;
  apiURL: string;
  sutSourceSha: string;
  localIdentifier: string;
  clientVersion: string;
  remoteVersions: Record<PlatformId, string>;
};

export type VerifiedSession = {
  id: string;
  dashboardURL: string;
  platformId: PlatformId;
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device?: string;
  realMobile: boolean;
};

export type RemoteSession = {
  context: BrowserContext;
  identity: VerifiedSession;
  nativeScreenshot?: (path: string) => Promise<void>;
  close(): Promise<void>;
};

export type CaptureContext = {
  runId: string;
  identity: VerifiedSession;
  itemId: ItemId;
  caseId: string;
  attempt: number;
  mode: Mode;
  sutSourceSha: string;
  requirementIds: string[];
};

export type EvidenceRecord = {
  path: string;
  sha256: string;
  actualURL: string;
  capturedAt: string;
  context: CaptureContext;
};

export type PlatformCell = {
  itemId: ItemId;
  platformId: PlatformId;
  status: Status;
  reason: string;
  attempts: Attempt[];
  evidence: EvidenceRecord[];
};

export type SessionArtifact = {
  sessionId: string;
  kind: 'details' | 'log' | 'network' | 'console' | 'video';
  state: 'available' | 'unavailable' | 'pending';
  path?: string;
  reason?: string;
};

export type RunSummary = {
  runId: string;
  cells: PlatformCell[];
  infrastructureErrors: number;
  evidenceGaps: number;
};

export type CloudRunOptions = {
  runId: string;
  phase: 'preflight' | 'pilot' | 'qualification';
  resume: boolean;
  targetPlatform?: PlatformId;
  grepPattern?: string;
};

export type {
  BrowserContext,
  Page,
  Locator,
  TestInfo,
  ItemId,
  ChecklistItem,
  Mode,
  Status,
  Attempt,
  CaseDefinition,
};
