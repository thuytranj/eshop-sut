import { type BrowserContext, type Route, type Request } from '@playwright/test';
import { type Product, type Category } from './products.ts';

export type ProductNetworkState = 'success' | 'abort' | 'http500' | 'pending';

export interface RecordedRequest {
  method: string;
  path: string;
  body: unknown;
  url: string;
}

export interface NetworkOptions {
  products: Product[];
  categories: Category[];
  mode: 'mock-ui' | 'live';
  resetTokens?: Record<string, string>;
}

export interface NetworkController {
  setProductsState(state: ProductNetworkState): void;
  releaseProducts(): void;
  requests: RecordedRequest[];
  snapshotProducts(): Product[];
  dispose(): Promise<void>;
}

export async function installNetwork(
  context: BrowserContext,
  options: NetworkOptions
): Promise<NetworkController> {
  if (options.mode === 'live') {
    throw new Error('installNetwork is only for mock-ui mode');
  }

  // Stateful copy of products
  let currentProducts: Product[] = JSON.parse(JSON.stringify(options.products));
  const currentCategories: Category[] = JSON.parse(JSON.stringify(options.categories));
  let productsState: ProductNetworkState = 'success';
  let pendingDeferred: { resolve: () => void; promise: Promise<void> } | null = null;
  const requests: RecordedRequest[] = [];

  const recordRequest = (req: Request) => {
    let parsedBody: unknown = null;
    try {
      parsedBody = req.postDataJSON();
    } catch {
      parsedBody = req.postData();
    }
    requests.push({
      method: req.method(),
      path: new URL(req.url()).pathname,
      body: parsedBody,
      url: req.url(),
    });
  };

  const routeHandler = async (route: Route) => {
    const fulfill = async (resp: Parameters<Route['fulfill']>[0]) => {
      await route.fulfill({
        ...resp,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
          'access-control-allow-headers': '*',
          ...(resp?.headers || {}),
        },
      });
    };

    const req = route.request();
    recordRequest(req);
    const url = new URL(req.url());
    const pathname = url.pathname;
    const method = req.method().toUpperCase();

    if (method === 'OPTIONS') {
      await fulfill({ status: 204 });
      return;
    }

    // 1. /api/products
    if (pathname === '/api/products' || pathname === '/api/products/') {
      if (method === 'GET') {
        if (productsState === 'abort') {
          await route.abort('failed');
          return;
        }
        if (productsState === 'http500') {
          await fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Lỗi máy chủ nội bộ' }),
          });
          return;
        }
        if (productsState === 'pending') {
          if (!pendingDeferred) {
            let res: () => void = () => {};
            const p = new Promise<void>((resolve) => {
              res = resolve;
            });
            pendingDeferred = { resolve: res, promise: p };
          }
          await pendingDeferred.promise;
        }

        const searchQuery = url.searchParams.get('search');
        let matched = currentProducts;
        if (searchQuery) {
          const q = searchQuery.toLowerCase().trim();
          matched = currentProducts.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              (p.description && p.description.toLowerCase().includes(q))
          );
        }
        await fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(matched),
        });
        return;
      }

      if (method === 'POST') {
        // Admin Add product
        const postData = req.postDataJSON() || {};
        const newId = currentProducts.length ? Math.max(...currentProducts.map((p) => p.id)) + 1 : 1;
        const newProd: Product = {
          id: newId,
          name: postData.name || '',
          price: Number(postData.price) || 0,
          description: postData.description || '',
          imageUrl: postData.imageUrl || 'https://placehold.co/300',
          category_id: Number(postData.category_id) || 1,
        };
        currentProducts.push(newProd);
        await fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(newProd),
        });
        return;
      }
    }

    // 2. /api/products/:id
    const prodDetailMatch = pathname.match(/^\/api\/products\/(\d+)$/);
    if (prodDetailMatch) {
      const id = Number(prodDetailMatch[1]);
      if (method === 'GET') {
        const found = currentProducts.find((p) => p.id === id);
        if (found) {
          await fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(found),
          });
        } else {
          await fulfill({
            status: 404,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Không tìm thấy sản phẩm' }),
          });
        }
        return;
      }

      if (method === 'PUT') {
        const putData = req.postDataJSON() || {};
        const idx = currentProducts.findIndex((p) => p.id === id);
        if (idx !== -1) {
          currentProducts[idx] = {
            ...currentProducts[idx],
            name: putData.name !== undefined ? putData.name : currentProducts[idx].name,
            price: putData.price !== undefined ? Number(putData.price) : currentProducts[idx].price,
            description:
              putData.description !== undefined
                ? putData.description
                : currentProducts[idx].description,
            imageUrl:
              putData.imageUrl !== undefined ? putData.imageUrl : currentProducts[idx].imageUrl,
            category_id:
              putData.category_id !== undefined
                ? Number(putData.category_id)
                : currentProducts[idx].category_id,
          };
          await fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(currentProducts[idx]),
          });
        } else {
          await fulfill({ status: 404, body: JSON.stringify({ error: 'Not found' }) });
        }
        return;
      }

      if (method === 'DELETE') {
        currentProducts = currentProducts.filter((p) => p.id !== id);
        await fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Đã xóa thành công' }),
        });
        return;
      }
    }

    // 3. /api/categories
    if (pathname === '/api/categories') {
      await fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(currentCategories),
      });
      return;
    }

    // 4. Admin bootstrap endpoints
    if (pathname === '/api/admin/users') {
      await fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Admin User', email: 'admin@eshop.com', role: 'admin' },
          { id: 2, name: 'Test User', email: 'test@eshop.com', role: 'user' },
        ]),
      });
      return;
    }
    if (pathname === '/api/admin/orders') {
      await fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
      return;
    }
    if (pathname === '/api/coupons') {
      await fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
      return;
    }

    // 5. Auth / Login
    if (pathname === '/api/login') {
      const data = req.postDataJSON() || {};
      const role = data.email?.includes('admin') ? 'admin' : 'user';
      await fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'mock-jwt-token-123456',
          user: { id: 1, name: 'Mock User', email: data.email, role },
        }),
      });
      return;
    }

    // 6. Reset password endpoints
    if (pathname === '/api/forgot-password') {
      const data = req.postDataJSON() || {};
      const token = (options.resetTokens && options.resetTokens[data.email]) || '123456';
      await fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'OTP đã được gửi',
          resetToken: token,
        }),
      });
      return;
    }

    if (pathname === '/api/reset-password') {
      const data = req.postDataJSON() || {};
      const expectedToken = (options.resetTokens && options.resetTokens[data.email]) || '123456';
      if (data.resetToken !== expectedToken) {
        await fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Mã OTP không đúng' }),
        });
        return;
      }
      await fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Đổi mật khẩu thành công!' }),
      });
      return;
    }

    // Default: continue unhandled routes
    await route.continue();
  };

  await context.route('**/api/**', routeHandler);

  return {
    setProductsState(state: ProductNetworkState) {
      productsState = state;
    },
    releaseProducts() {
      if (pendingDeferred) {
        pendingDeferred.resolve();
        pendingDeferred = null;
      }
    },
    requests,
    snapshotProducts() {
      return JSON.parse(JSON.stringify(currentProducts));
    },
    async dispose() {
      if (pendingDeferred) {
        pendingDeferred.resolve();
        pendingDeferred = null;
      }
      try {
        await Promise.race([
          context.unroute('**/api/**', routeHandler),
          new Promise((r) => setTimeout(r, 1000)),
        ]);
      } catch {}
    },
  };
}
