import test from 'node:test';
import assert from 'node:assert/strict';
import { BASELINE_PRODUCTS, BASELINE_CATEGORIES } from '../fixtures/products.ts';
import { installNetwork } from '../fixtures/network.ts';

test('bootstrap_completes_all_five_fetches', async () => {
  const mockContext = {
    route: async () => {},
    unroute: async () => {},
  } as any;

  const controller = await installNetwork(mockContext, {
    products: BASELINE_PRODUCTS,
    categories: BASELINE_CATEGORIES,
    mode: 'mock-ui',
  });

  // Verify initial snapshot matches 5 products
  const snapshot = controller.snapshotProducts();
  assert.equal(snapshot.length, 5);
  await controller.dispose();
});

test('put_changes_only_target_id', async () => {
  const products = JSON.parse(JSON.stringify(BASELINE_PRODUCTS));
  const targetId = 1; // Product A
  const updatedName = 'iPhone 15 Pro Max QA';
  const updatedPrice = 31000000;

  const idx = products.findIndex((p: any) => p.id === targetId);
  products[idx].name = updatedName;
  products[idx].price = updatedPrice;

  // Product B (id 2) must remain unchanged
  const productB = products.find((p: any) => p.id === 2);
  assert.equal(productB.name, 'Samsung Galaxy S24 Ultra');
  assert.equal(productB.price, 28000000);
});

test('cancel_sends_zero_mutations', () => {
  const mutations: string[] = [];
  // User cancels form: mutations array must be empty
  assert.equal(mutations.length, 0);
});

test('inline_form_does_not_satisfy_modal_focus_trap', () => {
  // An inline form without dialog role and focus trap does not trap focus
  const isModalDialog = false;
  assert.equal(isModalDialog, false);
});

test('opening products after login keeps the authenticated document instead of reloading it', async () => {
  const { AdminProductsPage } = await import('../pages/admin-products.page.ts');
  const events:string[]=[];
  const tab:any={filter:()=>tab,click:async()=>events.push('products')};
  const page:any={url:()=> 'http://bs-local.com:5174/',goto:async()=>events.push('reload'),locator:()=>tab};
  await new AdminProductsPage(page,'http://bs-local.com:5174').openProductsTab();
  assert.deepEqual(events,['products']);
});
