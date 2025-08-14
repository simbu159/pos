export interface ElectronAPI {
  printReceipt: (receiptData: any) => Promise<{ success: boolean }>;
  saveTransaction: (transaction: any) => Promise<{ success: boolean; id: number }>;
  
  db: {
    testConnection: () => Promise<boolean>;
    initializeDatabase: () => Promise<boolean>;
    seedDatabase: () => Promise<void>;
  };
  
  category: {
    getAll: () => Promise<any[]>;
    getById: (id: string) => Promise<any | null>;
    create: (categoryData: any) => Promise<any | null>;
    update: (id: string, categoryData: any) => Promise<any | null>;
    delete: (id: string) => Promise<boolean>;
  };
  
  product: {
    getAll: () => Promise<any[]>;
    getById: (id: string) => Promise<any | null>;
    getByCategory: (categoryId: string) => Promise<any[]>;
    create: (productData: any) => Promise<any | null>;
    update: (id: string, productData: any) => Promise<any | null>;
    updateStock: (id: string, stock: number) => Promise<boolean>;
    delete: (id: string) => Promise<boolean>;
    search: (searchTerm: string) => Promise<any[]>;
  };
  
  customer: {
    getAll: () => Promise<any[]>;
    getById: (id: string) => Promise<any | null>;
    create: (customerData: any) => Promise<any | null>;
    update: (id: string, customerData: any) => Promise<any | null>;
    delete: (id: string) => Promise<boolean>;
    search: (searchTerm: string) => Promise<any[]>;
  };
  
  transaction: {
    create: (transaction: any) => Promise<any | null>;
    getById: (id: string) => Promise<any | null>;
    getAll: (limit?: number) => Promise<any[]>;
    getByDateRange: (startDate: Date, endDate: Date) => Promise<any[]>;
  };
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}