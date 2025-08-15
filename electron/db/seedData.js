const { CategoryService } = require('./categoryService');
const { ProductService } = require('./productService');
const { CustomerService } = require('./customerService');

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Check if data already exists
    const existingCategories = await CategoryService.getAll();
    if (existingCategories.length > 0) {
      console.log('Database already seeded, skipping...');
      return true;
    }

    console.log('Seeding database with sample data...');

    // Seed categories
    const categories = [
      { name: 'Beverages', description: 'Hot and cold drinks' },
      { name: 'Snacks', description: 'Light snacks and treats' },
      { name: 'Bakery', description: 'Fresh baked goods' },
      { name: 'Food', description: 'Main meals and dishes' },
      { name: 'Dairy', description: 'Dairy products' },
    ];

    const createdCategories = [];
    for (const categoryData of categories) {
      console.log('Creating category:', categoryData.name);
      const category = await CategoryService.create(categoryData);
      if (category) {
        createdCategories.push(category);
        console.log('Category created:', category.name);
      }
    }

    // Wait a bit to ensure categories are created
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Seed products
    const products = [
      {
        name: 'Premium Coffee Beans',
        price: 24.99,
        categoryId: createdCategories[0]?.id || '',
        stock: 50,
        barcode: '1234567890123',
        description: 'High-quality arabica coffee beans',
      },
      {
        name: 'Organic Green Tea',
        price: 18.50,
        categoryId: createdCategories[0]?.id || '',
        stock: 30,
        barcode: '1234567890124',
        description: 'Organic green tea leaves',
      },
      {
        name: 'Artisan Chocolate Bar',
        price: 12.99,
        categoryId: createdCategories[1]?.id || '',
        stock: 25,
        barcode: '1234567890125',
        description: 'Handcrafted dark chocolate',
      },
      {
        name: 'Fresh Croissant',
        price: 4.50,
        categoryId: createdCategories[2]?.id || '',
        stock: 20,
        barcode: '1234567890126',
        description: 'Buttery, flaky croissant',
      },
      {
        name: 'Gourmet Sandwich',
        price: 14.99,
        categoryId: createdCategories[3]?.id || '',
        stock: 15,
        barcode: '1234567890127',
        description: 'Fresh ingredients sandwich',
      },
      {
        name: 'Fresh Orange Juice',
        price: 6.99,
        categoryId: createdCategories[0]?.id || '',
        stock: 40,
        barcode: '1234567890128',
        description: 'Freshly squeezed orange juice',
      },
      {
        name: 'Blueberry Muffin',
        price: 3.99,
        categoryId: createdCategories[2]?.id || '',
        stock: 35,
        barcode: '1234567890129',
        description: 'Fresh blueberry muffin',
      },
      {
        name: 'Energy Drink',
        price: 3.49,
        categoryId: createdCategories[0]?.id || '',
        stock: 60,
        barcode: '1234567890130',
        description: 'High-energy sports drink',
      },
      {
        name: 'Greek Yogurt',
        price: 5.99,
        categoryId: createdCategories[4]?.id || '',
        stock: 25,
        barcode: '1234567890131',
        description: 'Creamy Greek yogurt',
      },
      {
        name: 'Protein Bar',
        price: 4.99,
        categoryId: createdCategories[1]?.id || '',
        stock: 45,
        barcode: '1234567890132',
        description: 'High-protein energy bar',
      },
    ];

    for (const productData of products) {
      console.log('Creating product:', productData.name);
      const product = await ProductService.create(productData);
      if (product) {
        console.log('Product created:', product.name);
      }
    }

    // Seed customers
    const customers = [
      {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0123',
        address: '123 Main St, City, State 12345',
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1-555-0456',
        address: '456 Oak Ave, City, State 12345',
      },
      {
        name: 'Mike Davis',
        email: 'mike.davis@email.com',
        phone: '+1-555-0789',
      },
    ];

    for (const customerData of customers) {
      console.log('Creating customer:', customerData.name);
      const customer = await CustomerService.create(customerData);
      if (customer) {
        console.log('Customer created:', customer.name);
      }
    }

    console.log('Database seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
};

module.exports = { seedDatabase };