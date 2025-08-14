import React, { useState, useEffect } from 'react';
import { Product, Category, Customer, CartItem, Transaction } from './types/pos';
import { CategoryService } from './services/categoryService';
import { ProductService } from './services/productService';
import { CustomerService } from './services/customerService';
import { TransactionService } from './services/transactionService';
import { initializeDatabase, testConnection } from './config/database';
import { seedDatabase } from './data/seedData';
import { ProductGrid } from './components/ProductGrid';
import { Cart } from './components/Cart';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import { PaymentModal } from './components/PaymentModal';
import { ReceiptModal } from './components/ReceiptModal';
import { CategoryManagement } from './components/management/CategoryManagement';
import { ProductManagement } from './components/management/ProductManagement';
import { CustomerManagement } from './components/management/CustomerManagement';
import { Store, Clock, Settings, ShoppingCart, Package, Users, Tag } from 'lucide-react';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeView, setActiveView] = useState<'pos' | 'categories' | 'products' | 'customers'>('pos');
  const [isLoading, setIsLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize database and load data
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      
      // Test database connection
      const connected = await testConnection();
      setDbConnected(connected);
      
      if (connected) {
        // Initialize database tables
        await initializeDatabase();
        
        // Seed database with sample data
        await seedDatabase();
        
        // Load initial data
        await loadData();
      }
      
      setIsLoading(false);
    };
    
    initializeApp();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesData, productsData, customersData] = await Promise.all([
        CategoryService.getAll(),
        ProductService.getAll(),
        CustomerService.getAll(),
      ]);
      
      setCategories(categoriesData);
      setProducts(productsData);
      setCustomers(customersData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Category CRUD operations
  const handleAddCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCategory = await CategoryService.create(categoryData);
    if (newCategory) {
      setCategories(prev => [...prev, newCategory]);
    }
  };

  const handleUpdateCategory = async (id: string, categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    const updatedCategory = await CategoryService.update(id, categoryData);
    if (updatedCategory) {
      setCategories(prev => prev.map(cat => 
        cat.id === id ? updatedCategory : cat
      ));
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      const success = await CategoryService.delete(id);
      if (success) {
        setCategories(prev => prev.filter(cat => cat.id !== id));
        // Reload products to reflect category changes
        const updatedProducts = await ProductService.getAll();
        setProducts(updatedProducts);
      }
    }
  };

  // Product CRUD operations
  const handleAddProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct = await ProductService.create(productData);
    if (newProduct) {
      setProducts(prev => [...prev, newProduct]);
    }
  };

  const handleUpdateProduct = async (id: string, productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const updatedProduct = await ProductService.update(id, productData);
    if (updatedProduct) {
      setProducts(prev => prev.map(product => 
        product.id === id ? updatedProduct : product
      ));
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const success = await ProductService.delete(id);
      if (success) {
        setProducts(prev => prev.filter(product => product.id !== id));
        // Remove from cart if present
        setCartItems(prev => prev.filter(item => item.product.id !== id));
      }
    }
  };

  // Customer CRUD operations
  const handleAddCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCustomer = await CustomerService.create(customerData);
    if (newCustomer) {
      setCustomers(prev => [...prev, newCustomer]);
    }
  };

  const handleUpdateCustomer = async (id: string, customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const updatedCustomer = await CustomerService.update(id, customerData);
    if (updatedCustomer) {
      setCustomers(prev => prev.map(customer => 
        customer.id === id ? updatedCustomer : customer
      ));
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      const success = await CustomerService.delete(id);
      if (success) {
        setCustomers(prev => prev.filter(customer => customer.id !== id));
      }
    }
  };

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      const newItem: CartItem = {
        product,
        quantity: 1,
        subtotal: product.price,
      };
      setCartItems(prev => [...prev, newItem]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity, subtotal: item.product.price * quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.085; // 8.5% tax
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = async (paymentMethod: 'cash' | 'card' | 'digital') => {
    const transaction: Transaction = {
      id: `TXN-${Date.now()}`,
      items: cartItems,
      subtotal,
      tax,
      total,
      paymentMethod,
      timestamp: new Date(),
    };

    // Save transaction to database
    const savedTransaction = await TransactionService.create(transaction);
    if (savedTransaction) {
      setCurrentTransaction(savedTransaction);
      // Reload products to update stock levels
      const updatedProducts = await ProductService.getAll();
      setProducts(updatedProducts);
    } else {
      setCurrentTransaction(transaction);
    }

    setCartItems([]);
    setShowPaymentModal(false);
    setShowReceiptModal(true);
  };

  const handleBarcodeClick = () => {
    // In a real app, this would open barcode scanner
    alert('Barcode scanner would open here');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing POS System...</p>
          {!dbConnected && (
            <p className="text-red-600 text-sm mt-2">Database connection failed. Using offline mode.</p>
          )}
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case 'categories':
        return (
          <CategoryManagement
            categories={categories}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        );
      case 'products':
        return (
          <ProductManagement
            products={products}
            categories={categories}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case 'customers':
        return (
          <CustomerManagement
            customers={customers}
            onAddCustomer={handleAddCustomer}
            onUpdateCustomer={handleUpdateCustomer}
            onDeleteCustomer={handleDeleteCustomer}
          />
        );
      default:
        return (
          <div className="flex h-full">
            {/* Left Panel - Products */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 space-y-4 bg-gray-50">
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onBarcodeClick={handleBarcodeClick}
                />
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>
              
              <div className="flex-1 overflow-y-auto bg-gray-50">
                <ProductGrid
                  products={products}
                  categories={categories}
                  onProductSelect={addToCart}
                  searchTerm={searchTerm}
                  selectedCategory={selectedCategory}
                />
              </div>
            </div>

            {/* Right Panel - Cart */}
            <div className="w-96 border-l border-gray-200">
              <Cart
                items={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
                onCheckout={handleCheckout}
                subtotal={subtotal}
                tax={tax}
                total={total}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Store className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">POS System</h1>
              <p className="text-sm text-gray-600">Point of Sale Terminal</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <button
              onClick={() => setActiveView('pos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'pos'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              POS
            </button>
            <button
              onClick={() => setActiveView('categories')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'categories'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Tag className="w-5 h-5" />
              Categories
            </button>
            <button
              onClick={() => setActiveView('products')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'products'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Package className="w-5 h-5" />
              Products
            </button>
            <button
              onClick={() => setActiveView('customers')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'customers'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              Customers
            </button>
          </nav>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span className="font-mono">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {currentTime.toLocaleDateString()}
            </div>
            {!dbConnected && (
              <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                Offline Mode
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="h-[calc(100vh-80px)] overflow-hidden">
        {activeView === 'pos' ? (
          renderContent()
        ) : (
          <div className="h-full overflow-y-auto p-6">
            {renderContent()}
          </div>
        )}
      </div>

      {/* Modals */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        total={total}
        onPaymentComplete={handlePaymentComplete}
      />

      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        transaction={currentTransaction}
      />
    </div>
  );
}

export default App;