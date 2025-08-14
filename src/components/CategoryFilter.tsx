import React from 'react';
import { Category } from '../types/pos';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <button
        onClick={() => onCategoryChange('All')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedCategory === 'All'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All Categories
      </button>
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};