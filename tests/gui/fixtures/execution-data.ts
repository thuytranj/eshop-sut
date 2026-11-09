import { type ChecklistItem, type ItemId } from '../contracts.ts';
import { type Product, type Category } from './products.ts';

export interface ExecutionData {
  productsByAlias: Record<'A' | 'B' | 'C' | 'D' | 'E', Product>;
  categoriesByName: Record<string, Category>;
  substitutions: {
    itemId: ItemId;
    sourceExample: string;
    executionValue: string;
    reason: string;
  }[];
}

export function resolveExecutionData(
  items: ChecklistItem[],
  products: Product[],
  categories: Category[]
): ExecutionData {
  const findProduct = (name: string): Product => {
    const found = products.find((p) => p.name === name);
    if (!found) {
      throw new Error(`Baseline product not found: ${name}`);
    }
    return found;
  };

  const productsByAlias: Record<'A' | 'B' | 'C' | 'D' | 'E', Product> = {
    A: findProduct('iPhone 15 Pro Max'),
    B: findProduct('Samsung Galaxy S24 Ultra'),
    C: findProduct('MacBook Pro M3'),
    D: findProduct('Tai nghe AirPods Pro 2'),
    E: findProduct('Bàn phím cơ Keychron Q1'),
  };

  const categoriesByName: Record<string, Category> = {};
  for (const cat of categories) {
    categoriesByName[cat.name] = cat;
  }

  const substitutions: {
    itemId: ItemId;
    sourceExample: string;
    executionValue: string;
    reason: string;
  }[] = [
    {
      itemId: 'GUI-016',
      sourceExample: 'Danh sách sản phẩm mẫu quần áo',
      executionValue: '5 sản phẩm điện tử (iPhone, Samsung, MacBook, AirPods, Keychron)',
      reason: 'Dữ liệu seed thực tế theo yêu cầu người dùng',
    },
    {
      itemId: 'GUI-018',
      sourceExample: 'Áo Thun Cotton Nam: 125.000 ₫',
      executionValue: 'iPhone 15 Pro Max: 30.000.000 ₫',
      reason: 'Dữ liệu thực thi baseline A',
    },
    {
      itemId: 'GUI-022',
      sourceExample: 'Tìm "Áo"',
      executionValue: 'Tìm "iPhone" (ra A), "Samsung" (ra B), "Bàn phím" (ra E)',
      reason: 'Từ khóa khớp với danh mục sản phẩm hiện tại',
    },
    {
      itemId: 'GUI-034',
      sourceExample: 'A×2 + B×1 = 500.000 ₫ (Áo 125k × 2 + Quần 250k × 1)',
      executionValue: 'A×2 + B×1 = 88.000.000 ₫ (iPhone 30tr × 2 + Galaxy 28tr × 1)',
      reason: 'Tính toán giỏ hàng theo baseline sản phẩm hiện tại',
    },
    {
      itemId: 'GUI-036',
      sourceExample: 'Tăng A từ 2 lên 3: tổng 625.000 ₫',
      executionValue: 'Tăng A từ 2 lên 3: tổng 118.000.000 ₫ (giảm về 2: 88.000.000 ₫)',
      reason: 'Tính toán tăng giảm số lượng theo baseline',
    },
    {
      itemId: 'GUI-054',
      sourceExample: 'Sửa Áo Thun Cotton Nam giá 125.000 ₫',
      executionValue: 'Sửa iPhone 15 Pro Max giá 30.000.000 ₫',
      reason: 'Admin edit baseline A',
    },
    {
      itemId: 'GUI-060',
      sourceExample: 'Đổi A thành Áo Thun Cao Cấp giá 150.000 ₫',
      executionValue: 'Đổi A thành iPhone 15 Pro Max QA giá 31.000.000 ₫',
      reason: 'Admin isolate update test',
    },
  ];

  return {
    productsByAlias,
    categoriesByName,
    substitutions,
  };
}
