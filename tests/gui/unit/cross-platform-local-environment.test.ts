import test from 'node:test';
import assert from 'node:assert/strict';
import net from 'node:net';
import {
  startLocalEnvironment,
  probeRemoteSut,
  validateHostMapping,
} from '../cross-platform/local-environment.js';

test('local_urls_and_alias_mapping_are_consistent', () => {
  // Alias mapping requires matching web, admin, and api URLs on bs-local.com
  const mapping = validateHostMapping('bs-local.com');
  assert.equal(mapping.web, 'http://bs-local.com:5173');
  assert.equal(mapping.admin, 'http://bs-local.com:5174');
  assert.equal(mapping.api, 'http://bs-local.com:3000/api');

  // Mismatched mapping rejected
  assert.throws(
    () =>
      validateHostMapping('bs-local.com', {
        web: 'http://bs-local.com:5173',
        admin: 'http://localhost:5174', // Mismatched!
        api: 'http://bs-local.com:3000/api',
      }),
    /Host mapping inconsistent/
  );
});

test('api_probe_runs_in_remote_browser', async () => {
  let evaluatedInPage = false;
  const fakePage = {
    goto: async () => {},
    evaluate: async (fn: any, args: any) => {
      evaluatedInPage = true;
      return { ok: true, status: 200, productsCount: 5 };
    },
  };

  await probeRemoteSut(fakePage as any, {
    web: 'http://localhost:5173',
    admin: 'http://localhost:5174',
    api: 'http://localhost:3000/api',
  });

  assert.equal(evaluatedInPage, true, 'probeRemoteSut must run fetch via page.evaluate');
});

test('port_conflict_preserves_existing_process', async () => {
  // Occupy a test port
  const server = net.createServer();
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', () => resolve()));
  const port = (server.address() as net.AddressInfo).port;

  try {
    await assert.rejects(
      async () => {
        await startLocalEnvironment({
          repoRoot: process.cwd(),
          runDir: '/tmp/test-env-port-conflict',
          remoteHost: 'localhost',
          portOverrides: { backend: port },
        });
      },
      /Port conflict: port \d+ is already in use/
    );
  } finally {
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});
