import React from 'react';
import { Product, Category } from '../types/pos';
import { ShoppingCart, Package } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  onProductSelect: (product: Product) => void;
  searchTerm: string;
  selectedCategory: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  categories,
  onProductSelect,
  searchTerm,
  selectedCategory,
}) => {
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode?.includes(searchTerm);
    const matchesCategory = selectedCategory === 'All' || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {filteredProducts.map(product => (
        <div
          key={product.id}
          onClick={() => onProductSelect(product)}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 hover:border-blue-300 transform hover:scale-105"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-blue-600" />
              <span className={`text-xs px-2 py-1 rounded-full ${
                product.stock <= 10 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {product.stock} left
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-2">
              {product.name}
            </h3>
            <p className="text-xs text-gray-600 mb-2">{getCategoryName(product.categoryId)}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </span>
              <div className="bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition-colors">
                <ShoppingCart className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};