import { Product, Category, Customer } from '../types/pos';

export const sampleCategories: Category[] = [
  {
    id: '1',
    name: 'Beverages',
    description: 'Hot and cold drinks',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Snacks',
    description: 'Light snacks and treats',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'Bakery',
    description: 'Fresh baked goods',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '4',
    name: 'Food',
    description: 'Main meals and dishes',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '5',
    name: 'Dairy',
    description: 'Dairy products',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Coffee Beans',
    price: 24.99,
    categoryId: '1',
    stock: 50,
    barcode: '1234567890123',
    description: 'High-quality arabica coffee beans',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Organic Green Tea',
    price: 18.50,
    categoryId: '1',
    stock: 30,
    barcode: '1234567890124',
    description: 'Organic green tea leaves',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'Artisan Chocolate Bar',
    price: 12.99,
    categoryId: '2',
    stock: 25,
    barcode: '1234567890125',
    description: 'Handcrafted dark chocolate',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '4',
    name: 'Fresh Croissant',
    price: 4.50,
    categoryId: '3',
    stock: 20,
    barcode: '1234567890126',
    description: 'Buttery, flaky croissant',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '5',
    name: 'Gourmet Sandwich',
    price: 14.99,
    categoryId: '4',
    stock: 15,
    barcode: '1234567890127',
    description: 'Fresh ingredients sandwich',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '6',
    name: 'Fresh Orange Juice',
    price: 6.99,
    categoryId: '1',
    stock: 40,
    barcode: '1234567890128',
    description: 'Freshly squeezed orange juice',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '7',
    name: 'Blueberry Muffin',
    price: 3.99,
    categoryId: '3',
    stock: 35,
    barcode: '1234567890129',
    description: 'Fresh blueberry muffin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '8',
    name: 'Energy Drink',
    price: 3.49,
    categoryId: '1',
    stock: 60,
    barcode: '1234567890130',
    description: 'High-energy sports drink',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '9',
    name: 'Greek Yogurt',
    price: 5.99,
    categoryId: '5',
    stock: 25,
    barcode: '1234567890131',
    description: 'Creamy Greek yogurt',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '10',
    name: 'Protein Bar',
    price: 4.99,
    categoryId: '2',
    stock: 45,
    barcode: '1234567890132',
    description: 'High-protein energy bar',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export const sampleCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0123',
    address: '123 Main St, City, State 12345',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1-555-0456',
    address: '456 Oak Ave, City, State 12345',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike.davis@email.com',
    phone: '+1-555-0789',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  }
];