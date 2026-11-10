import test from 'node:test';
import assert from 'node:assert/strict';
import { startLocalTunnel } from '../cross-platform/local-tunnel.js';

test('no_session_before_tunnel_ready', async () => {
  // If tunnel fails to start or isRunning is false, it rejects
  await assert.rejects(
    async () => {
      await startLocalTunnel({
        accessKey: 'invalid-key',
        localIdentifier: 'hw03-test-1',
        mock: true,
        mockBehavior: 'fail-readiness',
      });
    },
    /BrowserStack Local tunnel failed to reach ready state/
  );
});

test('tunnel_start_failure_cleans_owned_servers', async () => {
  let cleanedUp = false;

  await assert.rejects(
    async () => {
      await startLocalTunnel({
        accessKey: 'invalid-key',
        localIdentifier: 'hw03-test-2',
        mock: true,
        mockBehavior: 'fail-start',
        onFailureCleanup: async () => {
          cleanedUp = true;
        },
      });
    },
    /Failed to start BrowserStack Local tunnel/
  );

  assert.equal(cleanedUp, true, 'Cleaned up owned servers when tunnel failed to start');
});

test('starts_and_stops_mock_tunnel_cleanly', async () => {
  const tunnel = await startLocalTunnel({
    accessKey: 'test-key',
    localIdentifier: 'hw03-test-success',
    mock: true,
    mockBehavior: 'success',
  });

  assert.equal(tunnel.isRunning(), true);
  assert.equal(tunnel.localIdentifier, 'hw03-test-success');

  await tunnel.stop();
  assert.equal(tunnel.isRunning(), false);
});
