import React from 'react';
import { Search, Scan } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onBarcodeClick: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onBarcodeClick,
}) => {
  return (
    <div className="flex gap-2 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search products by name or barcode..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <button
        onClick={onBarcodeClick}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <Scan className="w-5 h-5" />
        Scan
      </button>
    </div>
  );
};