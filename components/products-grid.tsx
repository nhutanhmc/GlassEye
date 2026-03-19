'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from './product-card';
import { ProductFilter, FilterOptions } from './product-filter';
import { ProductPagination } from './product-pagination';

interface ApiProduct {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  images?: string[];
  brand?: string | null;
  createdAt?: string;
}

interface ApiListResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: ApiProduct[];
}

const PAGE_SIZE = 20;

export function ProductsGrid() {
  const searchParams = useSearchParams();
  const urlCollectionId = searchParams.get('collectionId');

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    priceRange: [0, 50_000_000],
    sortBy: 'name-asc',
  });

  const [loading, setLoading] = useState(false);
  const [apiItems, setApiItems] = useState<ApiProduct[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('page', String(currentPage));
        params.set('limit', String(PAGE_SIZE));
        if (filters.searchQuery.trim()) params.set('q', filters.searchQuery.trim());
        if (urlCollectionId) {
          params.set('collectionId', urlCollectionId);
        }

        const res = await fetch(`/api/products?${params.toString()}`, { cache: 'no-store' });
        const data: ApiListResponse = await res.json();

        if (!data.success) throw new Error('Fetch failed');

        setApiItems(data.items || []);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.total || 0);
      } catch (e) {
        setApiItems([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, filters.searchQuery, urlCollectionId]);

  const viewItems = useMemo(() => {
    let result = apiItems.filter((p) => {
      const finalPrice = (p.salePrice ?? p.price) ?? 0;
      return finalPrice >= filters.priceRange[0] && finalPrice <= filters.priceRange[1];
    });

    switch (filters.sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        result.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
        break;
    }

    return result;
  }, [apiItems, filters.priceRange, filters.sortBy]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.querySelector('[data-products-section]')?.scrollIntoView({ behavior: 'smooth' });
  };

  const maxPrice = useMemo(() => {
    const prices = apiItems.map((p) => p.salePrice ?? p.price).filter(Boolean) as number[];
    return prices.length ? Math.max(...prices) : 50_000_000;
  }, [apiItems]);

  return (
    <section className="py-16 sm:py-20 bg-background" data-products-section>
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Our Collection
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Discover our carefully curated selection of premium products
          </p>
        </div>

        <ProductFilter onFilterChange={handleFilterChange} maxPrice={maxPrice} />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        ) : viewItems.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {viewItems.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  price={p.price}
                  salePrice={p.salePrice ?? undefined}
                  imageUrl={p.images && p.images.length > 0 ? p.images[0] : undefined}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <ProductPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={totalItems}
                pageSize={PAGE_SIZE}
              />
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block text-6xl mb-4">🔍</div>
            <p className="text-muted-foreground text-lg">
              No products found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}