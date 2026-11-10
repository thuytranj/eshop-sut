import type { LocalTunnel } from './types.js';

export interface LocalTunnelOptions {
  accessKey: string;
  localIdentifier: string;
  mock?: boolean;
  mockBehavior?: 'success' | 'fail-readiness' | 'fail-start';
  onFailureCleanup?: () => Promise<void>;
  binaryPath?: string;
}

export async function startLocalTunnel(options: LocalTunnelOptions): Promise<LocalTunnel> {
  const { accessKey, localIdentifier, mock = false, mockBehavior = 'success', onFailureCleanup } = options;

  if (mock) {
    if (mockBehavior === 'fail-start') {
      if (onFailureCleanup) await onFailureCleanup().catch(() => {});
      throw new Error('Failed to start BrowserStack Local tunnel: process exited unexpectedly');
    }

    if (mockBehavior === 'fail-readiness') {
      if (onFailureCleanup) await onFailureCleanup().catch(() => {});
      throw new Error('BrowserStack Local tunnel failed to reach ready state within timeout');
    }

    let running = true;
    return {
      localIdentifier,
      isRunning: () => running,
      stop: async () => {
        running = false;
      },
    };
  }

  // Real BrowserStack Local binary execution
  let bsLocal: any = null;
  try {
    // @ts-ignore
    const bsLocalModule = await import('browserstack-local');
    const LocalClass = bsLocalModule.default?.Local || (bsLocalModule as any).Local;
    bsLocal = new LocalClass();
  } catch (err) {
    throw new Error(
      `Package "browserstack-local" is not installed. Run "npm --prefix tests/gui i browserstack-local" first: ${err}`
    );
  }

  const tunnelArgs = {
    key: accessKey,
    localIdentifier,
    forceLocal: 'true',
    onlyAutomate: 'true',
  };

  try {
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('BrowserStack Local tunnel failed to reach ready state within 90s timeout'));
      }, 90000);

      bsLocal.start(tunnelArgs, (error: any) => {
        clearTimeout(timeout);
        if (error) {
          reject(new Error(`Failed to start BrowserStack Local tunnel: ${error.message || error}`));
        } else if (!bsLocal.isRunning()) {
          reject(new Error('BrowserStack Local tunnel failed to reach ready state: isRunning returned false'));
        } else {
          resolve();
        }
      });
    });

    return {
      localIdentifier,
      isRunning: () => bsLocal.isRunning(),
      stop: async () => {
        await new Promise<void>((resolve) => {
          bsLocal.stop(() => resolve());
        });
      },
    };
  } catch (err) {
    if (onFailureCleanup) {
      await onFailureCleanup().catch(() => {});
    }
    throw err;
  }
}
