const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const { testConnection, initializeDatabase } = require('./db/database');
const { seedDatabase } = require('./db/seedData');
const { CategoryService } = require('./db/categoryService');
const { ProductService } = require('./db/productService');
const { CustomerService } = require('./db/customerService');
const { TransactionService } = require('./db/transactionService');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'default',
    show: false,
  });

  const startUrl = isDev 
    ? 'http://localhost:5173' 
    : `file://${path.join(__dirname, '../dist/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create application menu
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for POS functionality
ipcMain.handle('print-receipt', async (event, receiptData) => {
  // In a real app, this would interface with a receipt printer
  console.log('Printing receipt:', receiptData);
  return { success: true };
});

ipcMain.handle('save-transaction', async (event, transaction) => {
  // In a real app, this would save to a database
  console.log('Saving transaction:', transaction);
  return { success: true, id: Date.now() };
});

// Database IPC handlers
ipcMain.handle('db:testConnection', async () => {
  return await testConnection();
});

ipcMain.handle('db:initializeDatabase', async () => {
  return await initializeDatabase();
});

ipcMain.handle('db:seedDatabase', async () => {
  return await seedDatabase();
});

// Category IPC handlers
ipcMain.handle('category:getAll', async () => {
  return await CategoryService.getAll();
});

ipcMain.handle('category:getById', async (event, id) => {
  return await CategoryService.getById(id);
});

ipcMain.handle('category:create', async (event, categoryData) => {
  return await CategoryService.create(categoryData);
});

ipcMain.handle('category:update', async (event, id, categoryData) => {
  return await CategoryService.update(id, categoryData);
});

ipcMain.handle('category:delete', async (event, id) => {
  return await CategoryService.delete(id);
});

// Product IPC handlers
ipcMain.handle('product:getAll', async () => {
  return await ProductService.getAll();
});

ipcMain.handle('product:getById', async (event, id) => {
  return await ProductService.getById(id);
});

ipcMain.handle('product:getByCategory', async (event, categoryId) => {
  return await ProductService.getByCategory(categoryId);
});

ipcMain.handle('product:create', async (event, productData) => {
  return await ProductService.create(productData);
});

ipcMain.handle('product:update', async (event, id, productData) => {
  return await ProductService.update(id, productData);
});

ipcMain.handle('product:updateStock', async (event, id, stock) => {
  return await ProductService.updateStock(id, stock);
});

ipcMain.handle('product:delete', async (event, id) => {
  return await ProductService.delete(id);
});

ipcMain.handle('product:search', async (event, searchTerm) => {
  return await ProductService.search(searchTerm);
});

// Customer IPC handlers
ipcMain.handle('customer:getAll', async () => {
  return await CustomerService.getAll();
});

ipcMain.handle('customer:getById', async (event, id) => {
  return await CustomerService.getById(id);
});

ipcMain.handle('customer:create', async (event, customerData) => {
  return await CustomerService.create(customerData);
});

ipcMain.handle('customer:update', async (event, id, customerData) => {
  return await CustomerService.update(id, customerData);
});

ipcMain.handle('customer:delete', async (event, id) => {
  return await CustomerService.delete(id);
});

ipcMain.handle('customer:search', async (event, searchTerm) => {
  return await CustomerService.search(searchTerm);
});

// Transaction IPC handlers
ipcMain.handle('transaction:create', async (event, transaction) => {
  return await TransactionService.create(transaction);
});

ipcMain.handle('transaction:getById', async (event, id) => {
  return await TransactionService.getById(id);
});

ipcMain.handle('transaction:getAll', async (event, limit) => {
  return await TransactionService.getAll(limit);
});

ipcMain.handle('transaction:getByDateRange', async (event, startDate, endDate) => {
  return await TransactionService.getByDateRange(startDate, endDate);
});