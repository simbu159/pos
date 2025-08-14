import React from 'react';
import { CartItem } from '../types/pos';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  subtotal: number;
  tax: number;
  total: number;
}

export const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  subtotal,
  tax,
  total,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Current Order</h2>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {items.length} items
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No items in cart</p>
            <p className="text-sm">Select products to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div
                key={item.product.id}
                className="bg-gray-50 rounded-lg p-3 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm flex-1">
                    {item.product.name}
                  </h4>
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-gray-600">
                      ${item.product.price.toFixed(2)} each
                    </p>
                    <p className="font-semibold text-blue-600">
                      ${item.subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="p-4 border-t border-gray-200 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (8.5%):</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span className="text-blue-600">${total.toFixed(2)}</span>
            </div>
          </div>
          
          <button
            onClick={onCheckout}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Process Payment
          </button>
        </div>
      )}
    </div>
  );
};