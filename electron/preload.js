const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  printReceipt: (receiptData) => ipcRenderer.invoke('print-receipt', receiptData),
  saveTransaction: (transaction) => ipcRenderer.invoke('save-transaction', transaction),
  
  // Database operations
  db: {
    testConnection: () => ipcRenderer.invoke('db:testConnection'),
    initializeDatabase: () => ipcRenderer.invoke('db:initializeDatabase'),
    seedDatabase: () => ipcRenderer.invoke('db:seedDatabase'),
  },
  
  // Category operations
  category: {
    getAll: () => ipcRenderer.invoke('category:getAll'),
    getById: (id) => ipcRenderer.invoke('category:getById', id),
    create: (categoryData) => ipcRenderer.invoke('category:create', categoryData),
    update: (id, categoryData) => ipcRenderer.invoke('category:update', id, categoryData),
    delete: (id) => ipcRenderer.invoke('category:delete', id),
  },
  
  // Product operations
  product: {
    getAll: () => ipcRenderer.invoke('product:getAll'),
    getById: (id) => ipcRenderer.invoke('product:getById', id),
    getByCategory: (categoryId) => ipcRenderer.invoke('product:getByCategory', categoryId),
    create: (productData) => ipcRenderer.invoke('product:create', productData),
    update: (id, productData) => ipcRenderer.invoke('product:update', id, productData),
    updateStock: (id, stock) => ipcRenderer.invoke('product:updateStock', id, stock),
    delete: (id) => ipcRenderer.invoke('product:delete', id),
    search: (searchTerm) => ipcRenderer.invoke('product:search', searchTerm),
  },
  
  // Customer operations
  customer: {
    getAll: () => ipcRenderer.invoke('customer:getAll'),
    getById: (id) => ipcRenderer.invoke('customer:getById', id),
    create: (customerData) => ipcRenderer.invoke('customer:create', customerData),
    update: (id, customerData) => ipcRenderer.invoke('customer:update', id, customerData),
    delete: (id) => ipcRenderer.invoke('customer:delete', id),
    search: (searchTerm) => ipcRenderer.invoke('customer:search', searchTerm),
  },
  
  // Transaction operations
  transaction: {
    create: (transaction) => ipcRenderer.invoke('transaction:create', transaction),
    getById: (id) => ipcRenderer.invoke('transaction:getById', id),
    getAll: (limit) => ipcRenderer.invoke('transaction:getAll', limit),
    getByDateRange: (startDate, endDate) => ipcRenderer.invoke('transaction:getByDateRange', startDate, endDate),
  },
});