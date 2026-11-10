import type {
  PlatformId,
  PlatformSpec,
  CompatibilityLock,
  CloudEnv,
} from './types.js';

export const PLATFORMS: readonly PlatformSpec[] = [
  {
    id: 'p1-chrome-win11',
    transport: 'desktop',
    requested: {
      browser: 'chrome',
      browser_version: 'latest',
      os: 'Windows',
      os_version: '11',
    },
  },
  {
    id: 'p2-firefox-win11',
    transport: 'desktop',
    requested: {
      browser: 'playwright-firefox',
      os: 'Windows',
      os_version: '11',
    },
  },
  {
    id: 'p3-android-chrome',
    transport: 'android',
    requested: {
      browser: 'chrome',
      deviceName: 'Samsung Galaxy S23',
      osVersion: '13.0',
      realMobile: 'true',
    },
  },
];

const ALLOWED_PORTS: Record<string, string> = {
  web: '5173',
  admin: '5174',
  api: '3000',
};

function validateSutUrl(
  urlStr: string,
  kind: 'web' | 'admin' | 'api',
  phase: 'preflight' | 'pilot' | 'qualification' = 'qualification',
  verifiedMapping = false
): string {
  let parsed: URL;
  try {
    parsed = new URL(urlStr);
  } catch {
    throw new Error(`Invalid URL for ${kind}: ${urlStr}`);
  }

  if (parsed.username || parsed.password) {
    throw new Error(`Embedded credentials in ${kind} URL are rejected: ${urlStr}`);
  }

  const hostname = parsed.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  const isAlias = hostname === 'bs-local.com';

  if (!isLocalhost && !isAlias) {
    throw new Error(
      `Public target or disallowed host "${hostname}" for ${kind} is rejected in ${phase}`
    );
  }

  if (isAlias && !verifiedMapping) {
    throw new Error(`Alias host "bs-local.com" requires verified host mapping`);
  }

  const port = parsed.port || (parsed.protocol === 'https:' ? '443' : '80');
  const expectedPort = ALLOWED_PORTS[kind];
  if (port !== expectedPort) {
    throw new Error(
      `Disallowed port "${port}" for ${kind}. Expected port "${expectedPort}".`
    );
  }

  return urlStr;
}

export function loadCloudEnv(
  env: NodeJS.ProcessEnv,
  compatibility: CompatibilityLock,
  runId: string,
  options?: {
    phase?: 'preflight' | 'pilot' | 'qualification';
    verifiedMapping?: boolean;
  }
): CloudEnv {
  const username = env.BROWSERSTACK_USERNAME?.trim();
  if (!username) {
    throw new Error('Missing required environment variable: BROWSERSTACK_USERNAME');
  }

  const accessKey = env.BROWSERSTACK_ACCESS_KEY?.trim();
  if (!accessKey) {
    throw new Error('Missing required environment variable: BROWSERSTACK_ACCESS_KEY');
  }

  const phase = options?.phase ?? 'qualification';
  const verifiedMapping = options?.verifiedMapping ?? false;

  const rawWeb = env.SUT_WEB_BASE_URL || 'http://localhost:5173';
  const rawAdmin = env.SUT_ADMIN_BASE_URL || 'http://localhost:5174';
  const rawApi = env.SUT_API_BASE_URL || 'http://localhost:3000/api';

  const webURL = validateSutUrl(rawWeb, 'web', phase, verifiedMapping);
  const adminURL = validateSutUrl(rawAdmin, 'admin', phase, verifiedMapping);
  const apiURL = validateSutUrl(rawApi, 'api', phase, verifiedMapping);

  const localIdentifier = `hw03-23120367-${runId}`;
  const sutSourceSha = env.SUT_SOURCE_SHA?.trim() || '';

  return {
    username,
    accessKey,
    webURL,
    adminURL,
    apiURL,
    sutSourceSha,
    localIdentifier,
    clientVersion: compatibility.clientVersion,
    remoteVersions: compatibility.remoteVersions,
  };
}

export function buildCapabilities(
  platform: PlatformSpec,
  env: CloudEnv,
  name: string,
  build: string
): Record<string, string> {
  const caps: Record<string, string> = {
    project: 'HW03-23120367',
    build,
    name,
    'browserstack.username': env.username,
    'browserstack.accessKey': env.accessKey,
    'browserstack.local': 'true',
    'browserstack.localIdentifier': env.localIdentifier,
    'browserstack.debug': 'true',
    'browserstack.console': 'info',
    'browserstack.networkLogs': 'true',
    'client.playwrightVersion': env.clientVersion,
  };

  // Merge platform-specific requested caps
  for (const [key, value] of Object.entries(platform.requested)) {
    caps[key] = value;
  }

  // Safety checks per platform contract
  if (platform.id === 'p2-firefox-win11') {
    delete caps.browser_version;
  } else if (platform.id === 'p3-android-chrome') {
    delete caps.browser_version;
    delete caps.os_version;
    caps.realMobile = 'true';
  }

  return caps;
}

export function redactSecrets(value: unknown, env: CloudEnv): unknown {
  const secretKey = env.accessKey;
  if (!secretKey) return value;

  const urlEncodedKey = encodeURIComponent(secretKey);
  const basicAuthCredentials = Buffer.from(`${env.username}:${secretKey}`).toString('base64');

  const sanitizeString = (str: string): string => {
    let result = str;
    if (basicAuthCredentials && result.includes(basicAuthCredentials)) {
      result = result.replaceAll(basicAuthCredentials, '[REDACTED]');
    }
    if (result.includes(secretKey)) {
      result = result.replaceAll(secretKey, '[REDACTED]');
    }
    if (urlEncodedKey && result.includes(urlEncodedKey)) {
      result = result.replaceAll(urlEncodedKey, '[REDACTED]');
    }
    return result;
  };

  if (typeof value === 'string') {
    return sanitizeString(value);
  }

  if (Array.isArray(value)) {
    return value.map(item => redactSecrets(item, env));
  }

  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = redactSecrets(v, env);
    }
    return result;
  }

  return value;
}
