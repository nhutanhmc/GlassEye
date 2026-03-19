'use client';

import Image from 'next/image';
import Link from 'next/link';

const formatVND = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

export function ProductCard({
  id,
  name,
  price,
  salePrice,
  imageUrl,
  badge,
}: {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  imageUrl?: string | null;
  badge?: string;
}) {
  const finalPrice = salePrice ?? price;
  const originalPrice = salePrice ? price : undefined;
  const discount =
    originalPrice && finalPrice < originalPrice
      ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
      : null;

  return (
    <Link
      href={`/products/${id}`}
      className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        <Image
          src={imageUrl || '/placeholder.svg'}
          alt={name}
          fill
          unoptimized={true}
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Badge */}
        {badge && (
          <div className="absolute top-3 left-3 bg-black/90 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full z-10 backdrop-blur-sm">
            {badge}
          </div>
        )}

        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded-full z-10 shadow-lg">
            -{discount}%
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 group-hover:to-black/5 transition-all duration-500" />
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-2 min-h-[40px] group-hover:text-accent transition-colors">
          {name}
        </h3>

        {/* Price */}
        <div className="flex flex-col mb-4">
          <span className="text-sm font-bold text-foreground">
            {formatVND(finalPrice)}
          </span>
          {originalPrice && (
            <span className="text-xs text-muted-foreground line-through decoration-red-400/50">
              {formatVND(originalPrice)}
            </span>
          )}
        </div>

        {/* Detail Button - Đã sửa thành div và xóa onClick */}
        <div
          className="mt-auto flex items-center justify-center w-full h-10 bg-gradient-to-r from-black to-neutral-800 text-white font-semibold text-sm rounded-lg hover:shadow-lg group-hover:from-neutral-800 group-hover:to-black transition-all duration-300 active:scale-95"
        >
          View Details
        </div>
      </div>
    </Link>
  );
}