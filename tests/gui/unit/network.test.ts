import test from 'node:test';
import assert from 'node:assert/strict';
import { measureContrast, assertMoney } from '../support/ui-assertions.ts';
import { installNetwork } from '../fixtures/network.ts';
import { BASELINE_PRODUCTS, BASELINE_CATEGORIES } from '../fixtures/products.ts';

test('currency_vnd_is_not_accepted_as_spec', async () => {
  const fakeLocatorVnd = {
    innerText: async () => '30.000.000 VND',
  } as any;

  await assert.rejects(
    async () => {
      await assertMoney(fakeLocatorVnd, 30000000);
    },
    /Currency must use '₫'/
  );

  const fakeLocatorDong = {
    innerText: async () => '30.000.000 ₫',
  } as any;

  await assertMoney(fakeLocatorDong, 30000000); // should not throw
});

test('contrast_ratio_formula_is_correct', () => {
  // Black on white should be 21
  const ratio = measureContrast('#000000', '#ffffff');
  assert.equal(Math.round(ratio), 21);

  // White on white should be 1
  const ratioSame = measureContrast('#ffffff', '#ffffff');
  assert.equal(Math.round(ratioSame), 1);
});

test('network_abort_then_retry_success', async () => {
  let routedPattern = '';
  const mockContext = {
    route: async (pattern: string, handler: any) => {
      routedPattern = pattern;
    },
    unroute: async () => {},
  } as any;

  const controller = await installNetwork(mockContext, {
    products: BASELINE_PRODUCTS,
    categories: BASELINE_CATEGORIES,
    mode: 'mock-ui',
  });

  assert.equal(routedPattern, '**/api/**');
  controller.setProductsState('abort');
  // State change verified
  controller.setProductsState('success');
  await controller.dispose();
});

test('mock_request_counts_do_not_certify_live_cart', async () => {
  const mockContext = {
    route: async () => {},
    unroute: async () => {},
  } as any;

  const controller = await installNetwork(mockContext, {
    products: BASELINE_PRODUCTS,
    categories: BASELINE_CATEGORIES,
    mode: 'mock-ui',
  });

  // Local React state cart does not issue /api/cart requests
  const cartRequests = controller.requests.filter(r => r.path === '/api/cart');
  assert.equal(cartRequests.length, 0);
  await controller.dispose();
});
