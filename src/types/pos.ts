export interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  stock: number;
  image?: string;
  barcode?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'digital';
  timestamp: Date;
  customer?: Customer;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}