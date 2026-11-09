export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category_id: number;
}

export interface Category {
  id: number;
  name: string;
}

export const BASELINE_CATEGORIES: Category[] = [
  { id: 1, name: 'Điện thoại' },
  { id: 2, name: 'Laptop' },
  { id: 3, name: 'Phụ kiện' },
];

export const BASELINE_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    price: 30000000,
    description: 'Điện thoại cao cấp của Apple',
    imageUrl: 'https://placehold.co/300x300/png?text=iPhone+15',
    category_id: 1,
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra',
    price: 28000000,
    description: 'Màn hình hiển thị xuất sắc, camera siêu zoom',
    imageUrl: 'https://placehold.co/300x300/png?text=Samsung+S24',
    category_id: 1,
  },
  {
    id: 3,
    name: 'MacBook Pro M3',
    price: 45000000,
    description: 'Laptop chuyên nghiệp mạnh mẽ',
    imageUrl: 'https://placehold.co/300x300/png?text=Macbook+Pro',
    category_id: 2,
  },
  {
    id: 4,
    name: 'Tai nghe AirPods Pro 2',
    price: 6000000,
    description: 'Âm thanh sống động, chống ồn chủ động',
    imageUrl: 'https://placehold.co/300x300/png?text=AirPods+Pro',
    category_id: 3,
  },
  {
    id: 5,
    name: 'Bàn phím cơ Keychron Q1',
    price: 4000000,
    description: 'Bàn phím cơ cao cấp vỏ nhôm',
    imageUrl: 'https://placehold.co/300x300/png?text=Keychron+Q1',
    category_id: 3,
  },
];
