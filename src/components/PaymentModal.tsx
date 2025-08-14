import React, { useState } from 'react';
import { CreditCard, DollarSign, Smartphone, X, Printer, Check } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onPaymentComplete: (paymentMethod: 'cash' | 'card' | 'digital') => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  total,
  onPaymentComplete,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'card' | 'digital' | null>(null);
  const [cashReceived, setCashReceived] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (!selectedMethod) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    onPaymentComplete(selectedMethod);
  };

  const cashReceivedAmount = parseFloat(cashReceived) || 0;
  const change = cashReceivedAmount - total;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Process Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="text-center bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
            <p className="text-3xl font-bold text-blue-600">${total.toFixed(2)}</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => setSelectedMethod('cash')}
            className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
              selectedMethod === 'cash'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <DollarSign className="w-6 h-6 text-green-600" />
            <span className="font-medium">Cash Payment</span>
          </button>

          <button
            onClick={() => setSelectedMethod('card')}
            className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
              selectedMethod === 'card'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <CreditCard className="w-6 h-6 text-blue-600" />
            <span className="font-medium">Card Payment</span>
          </button>

          <button
            onClick={() => setSelectedMethod('digital')}
            className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
              selectedMethod === 'digital'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Smartphone className="w-6 h-6 text-purple-600" />
            <span className="font-medium">Digital Wallet</span>
          </button>
        </div>

        {selectedMethod === 'cash' && (
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cash Received
              </label>
              <input
                type="number"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                step="0.01"
                min={total}
              />
            </div>
            
            {cashReceivedAmount >= total && (
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-green-700 font-medium">Change Due:</span>
                  <span className="text-green-700 font-bold">
                    ${change.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={
            !selectedMethod || 
            (selectedMethod === 'cash' && cashReceivedAmount < total) ||
            isProcessing
          }
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Processing...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Complete Payment
            </>
          )}
        </button>
      </div>
    </div>
  );
};