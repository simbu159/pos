import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import { Transaction } from '../types/pos';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  if (!isOpen || !transaction) return null;

  const handlePrint = async () => {
    if (window.electronAPI) {
      await window.electronAPI.printReceipt(transaction);
    } else {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-90vw max-h-90vh overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Receipt</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="receipt-content border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold">POS System</h3>
            <p className="text-sm text-gray-600">Transaction Receipt</p>
            <p className="text-xs text-gray-500 mt-2">
              {transaction.timestamp.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">
              Transaction ID: {transaction.id}
            </p>
          </div>

          <div className="border-t border-b border-gray-300 py-4 my-4">
            {transaction.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.product.name}</p>
                  <p className="text-xs text-gray-600">
                    {item.quantity} × ${item.product.price.toFixed(2)}
                  </p>
                </div>
                <p className="font-medium text-sm">
                  ${item.subtotal.toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${transaction.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${transaction.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>${transaction.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-3 pt-2 border-t">
              <span>Payment Method:</span>
              <span className="capitalize">{transaction.paymentMethod}</span>
            </div>
          </div>

          <div className="text-center mt-4 pt-4 border-t border-gray-300">
            <p className="text-xs text-gray-500">
              Thank you for your business!
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};