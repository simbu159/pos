export interface ElectronAPI {
  printReceipt: (receiptData: any) => Promise<{ success: boolean }>;
  saveTransaction: (transaction: any) => Promise<{ success: boolean; id: number }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}