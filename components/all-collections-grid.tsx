'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Collection {
  id: string;
  name: string;
  description: string | null;
  thumbnail: string | null;
}

export function AllcollectionGrid() {
  const [collection, setcollection] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/collection')
      .then(res => res.json())
      .then(data => {
        if (data.success) setcollection(data.items);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
            <p className="text-muted-foreground">Loading collection...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-foreground text-center text-balance">
            Tất Cả Bộ Sưu Tập
          </h2>
          <p className="text-center text-muted-foreground mt-3 max-w-2xl mx-auto">
            Khám phá những bộ sưu tập độc đáo và phong cách của chúng tôi
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {collection.map(col => (
            <Link 
              href={`/products?collectionId=${col.id}`} 
              key={col.id} 
              className="group cursor-pointer h-full"
            >
              <div className="flex flex-col h-full">
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-5 bg-secondary shadow-md group-hover:shadow-xl transition-all duration-500">
                  <Image
                    src={col.thumbnail || '/placeholder.svg'}
                    alt={col.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 group-hover:to-black/20 transition-all duration-500" />
                  
                  {/* Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-accent/90 rounded-full text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Xem Chi Tiết
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-300 line-clamp-2">
                    {col.name}
                  </h3>
                  {col.description && (
                    <p className="text-sm md:text-base text-muted-foreground line-clamp-2 flex-1 leading-relaxed">
                      {col.description}
                    </p>
                  )}
                  
                  {/* Arrow Indicator */}
                  <div className="mt-4 flex items-center text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-semibold">Xem ngay</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
