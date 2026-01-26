'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '@/components/providers/app-provider';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;        // VND
  salePrice?: number;   // VND
  imageUrl?: string | null;

  // optional mock fields
  rating?: number;
  reviews?: number;
  badge?: string;
}

const formatVND = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

export function ProductCard({
  id,
  name,
  price,
  salePrice,
  imageUrl,
  rating = 5,
  reviews = 0,
  badge,
}: ProductCardProps) {
  const { addToCart } = useApp();

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const finalPrice = salePrice ?? price;
  const originalPrice = salePrice ? price : undefined;

  const discount =
    originalPrice && finalPrice < originalPrice
      ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
      : null;

  const handleAdd = () => {
    if (!expanded) {
      setExpanded(true);
      return;
    }

    addToCart(
      { id, name, price, salePrice: salePrice ?? null, imageUrl: imageUrl ?? null },
      Math.max(1, qty)
    );

    setExpanded(false);
    setQty(1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Image
          src={imageUrl || '/placeholder.svg'}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge */}
        {badge && (
          <div className="absolute top-3 left-3 bg-black/90 text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide rounded">
            {badge}
          </div>
        )}

        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2.5 py-1 text-xs font-bold rounded-full">
            -{discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-black p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-md hover:shadow-lg"
          aria-label="Wishlist"
        >
          <Heart
            className={`w-5 h-5 ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col bg-card">
        {/* Product Name */}
        <h3 className="font-semibold text-sm text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-xs ${
                  i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-base font-bold text-foreground">
            {formatVND(finalPrice)}
          </span>
          {originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatVND(originalPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart Section */}
        <div className="mt-auto">
          {!expanded ? (
            <button
              onClick={handleAdd}
              className="w-full py-2.5 bg-black text-white font-semibold text-sm rounded-lg hover:bg-black/90 active:scale-95 transition-all duration-200"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* input nhỏ lại */}
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                className="w-20 h-10 px-3 border border-border rounded-lg bg-background text-foreground text-center font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
              />

              {/* nút + không bao giờ bị co/mất */}
              <button
                onClick={handleAdd}
                className="shrink-0 w-10 h-10 bg-black text-white font-bold rounded-lg hover:bg-black/90 active:scale-95 transition-all flex items-center justify-center"
                title="Add"
              >
                +
              </button>

              {/* Optional: nút hủy gọn (nếu bạn muốn) */}
              <button
                onClick={() => {
                  setExpanded(false);
                  setQty(1);
                }}
                className="shrink-0 w-10 h-10 border border-border rounded-lg hover:bg-secondary active:scale-95 transition-all flex items-center justify-center text-foreground"
                title="Cancel"
              >
                ✕
              </button>
            </div>
          )}

          {justAdded && (
            <div className="mt-2 text-xs text-green-600 font-medium text-center animate-in fade-in duration-200">
              ✓ Added to cart
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
