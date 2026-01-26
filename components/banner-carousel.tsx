'use client';

import React from "react"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const banners = [
  {
    id: 1,
    image: '/fashion-1.jpg',
    title: 'EDITORIAL',
    subtitle: 'Black Series Collection',
  },
  {
    id: 2,
    image: '/fashion-2.jpg',
    title: 'MONOCHROME',
    subtitle: 'Premium Vision',
  },
  {
    id: 3,
    image: '/fashion-3.jpg',
    title: 'LUXURY',
    subtitle: 'Artist Collaboration',
  },
];

export function BannerCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const prev = () => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
    setIsAutoPlay(false);
  };

  const next = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
    setIsAutoPlay(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      /* THAY ĐỔI Ở ĐÂY: w-screen h-screen để chiếm toàn bộ màn hình */
      className="relative w-screen h-screen overflow-hidden group bg-black"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
      onMouseMove={handleMouseMove}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <Image
              src={banner.image || "/placeholder.svg"}
              alt={banner.title}
              fill
              className="object-cover" /* Đảm bảo ảnh luôn lấp đầy khung hình */
              priority={index === 0}
              quality={100} /* Tăng chất lượng ảnh vì ảnh giờ rất to */
            />

            {/* Overlay - Làm tối nhẹ để chữ dễ đọc hơn trên ảnh lớn */}
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
            
            {/* Animated Light Effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.4) 0%, transparent 50%)`,
              }}
            />

            {/* Content - Căn giữa toàn màn hình */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <div className="transform transition-all duration-1000 delay-300" style={{
                opacity: index === current ? 1 : 0,
                transform: index === current ? 'translateY(0)' : 'translateY(30px)',
              }}>
                <h2 className="text-6xl sm:text-8xl md:text-9xl font-black text-white mb-6 drop-shadow-2xl tracking-tighter uppercase leading-[0.9]">
                  {banner.title}
                </h2>
                <p className="text-white/80 text-base sm:text-lg md:text-xl tracking-[0.3em] font-light uppercase drop-shadow-md">
                  {banner.subtitle}
                </p>
                
                {/* Optional: Thêm một nút kêu gọi hành động cho cân đối */}
                <button className="mt-10 px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300 uppercase text-sm tracking-widest">
                  Discover More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons - To hơn một chút để dễ bấm trên màn hình lớn */}
      <button
        onClick={prev}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-20 bg-white/5 hover:bg-white/20 text-white p-4 rounded-full transition-all backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={next}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 bg-white/5 hover:bg-white/20 text-white p-4 rounded-full transition-all backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrent(index);
              setIsAutoPlay(false);
            }}
            className={`transition-all duration-500 ${
              index === current
                ? 'bg-white w-12 h-[2px]'
                : 'bg-white/30 w-6 h-[2px] hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}