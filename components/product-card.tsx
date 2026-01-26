'use client';

import Image from 'next/image';
import { Heart, Check } from 'lucide-react'; // Thêm icon Check cho đẹp
import { useState } from 'react';
import { useApp } from '@/components/providers/app-provider';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  imageUrl?: string | null;
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
    setTimeout(() => setJustAdded(false), 2000); // Tăng thời gian hiển thị thông báo
  };

  return (
    <div className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300 flex flex-col h-full relative">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Image
          src={imageUrl || '/placeholder.svg'}
          alt={name}
          fill
          unoptimized={true} // QUAN TRỌNG: Sửa lỗi không hiện ảnh trên Production
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge (New/Hot...) */}
        {badge && (
          <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded z-10">
            {badge}
          </div>
        )}

        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 text-[10px] font-bold rounded z-10">
            -{discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-black p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-md z-10"
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-medium text-sm text-foreground mb-1 line-clamp-2 min-h-[40px]">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-[10px] ${i < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">({reviews})</span>
        </div>

        {/* Price */}
        <div className="flex flex-col mb-4">
          <span className="text-sm font-bold text-foreground">
            {formatVND(finalPrice)}
          </span>
          {originalPrice && (
            <span className="text-[11px] text-muted-foreground line-through decoration-red-400/50">
              {formatVND(originalPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart Section - Cố định chiều cao để tránh nhảy Card */}
        <div className="mt-auto min-h-[40px]">
          {!expanded ? (
            <button
              onClick={handleAdd}
              disabled={justAdded}
              className={`w-full h-10 flex items-center justify-center gap-2 rounded-md font-semibold text-xs transition-all duration-300 ${
                justAdded 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-black text-white hover:bg-neutral-800 active:scale-95'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  Added
                </>
              ) : (
                'Add to Cart'
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2 h-10 animate-in zoom-in-95 duration-200">
              <input
                type="number"
                min={1}
                autoFocus
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                className="flex-1 h-full px-2 border border-border rounded-md bg-background text-foreground text-center font-bold text-xs focus:ring-1 focus:ring-black outline-none"
              />
              <button
                onClick={handleAdd}
                className="w-10 h-full bg-black text-white font-bold rounded-md hover:bg-neutral-800 flex items-center justify-center"
              >
                +
              </button>
              <button
                onClick={() => {
                  setExpanded(false);
                  setQty(1);
                }}
                className="w-10 h-full border border-border rounded-md hover:bg-secondary flex items-center justify-center text-muted-foreground"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}