'use client';

import React from "react"

import { useEffect, useState } from 'react';

import { Search, ChevronDown } from 'lucide-react';

interface FilterOptions {
  searchQuery: string;
  priceRange: [number, number];
  sortBy: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';
}

interface ProductFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  maxPrice: number;
}

export function ProductFilter({ onFilterChange, maxPrice }: ProductFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'>('name-asc');
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);
  const handleFilterChange = () => {
    onFilterChange({
      searchQuery,
      priceRange,
      sortBy,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    const newRange: [number, number] = [...priceRange];
    if (type === 'min') {
      newRange[0] = Math.min(value, newRange[1]);
    } else {
      newRange[1] = Math.max(value, newRange[0]);
    }
    setPriceRange(newRange);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as any);
  };

  // Apply filters whenever they change
  const applyFilters = () => {
    handleFilterChange();
  };

  return (
    <div className="mb-10 pb-6 border-b border-border/50">
      {/* Search and Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search Input */}
        <div className="w-full sm:w-80 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            onBlur={applyFilters}
            className="w-full pl-11 pr-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
          />
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => {
            handleSortChange(e);
            setTimeout(applyFilters, 0);
          }}
          className="px-4 py-3 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all font-medium"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>

        {/* Price Filter Toggle */}
        <button
          onClick={() => setShowPriceFilter(!showPriceFilter)}
          className="flex items-center gap-2 px-5 py-3 border border-border rounded-lg bg-card text-foreground hover:bg-secondary transition-all font-medium"
        >
          Price
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showPriceFilter ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Price Filter Expanded */}
      {showPriceFilter && (
        <div className="mt-6 p-6 border border-border rounded-lg bg-card">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Min: <span className="text-accent">${priceRange[0].toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[0]}
                onChange={(e) => {
                  handlePriceChange('min', Number(e.target.value));
                }}
                onMouseUp={applyFilters}
                onTouchEnd={applyFilters}
                className="w-full cursor-pointer accent-accent h-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Max: <span className="text-accent">${priceRange[1].toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => {
                  handlePriceChange('max', Number(e.target.value));
                }}
                onMouseUp={applyFilters}
                onTouchEnd={applyFilters}
                className="w-full cursor-pointer accent-accent h-2"
              />
            </div>
          </div>

          <button
            onClick={() => {
              setPriceRange([0, maxPrice]);
              setTimeout(applyFilters, 0);
            }}
            className="mt-6 w-full px-4 py-2.5 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-all duration-300"
          >
            Reset Price
          </button>
        </div>
      )}
    </div>
  );
}
