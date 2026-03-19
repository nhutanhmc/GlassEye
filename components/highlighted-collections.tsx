'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Collection {
  id: string;
  name: string;
  thumbnail: string | null;
  highlight: boolean;
}

export function Highlightedcollection() {
  const [collection, setcollection] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/collection')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setcollection(data.items.filter((c: Collection) => c.highlight));
        }
      })
      .catch(err => console.error("Lỗi tải collection:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || collection.length === 0) return null;

  // LOGIC MỚI: Chỉ bật hiệu ứng cuộn nếu có từ 4 item trở lên
  const shouldScroll = collection.length >= 4;

  // Nếu cuộn: nhân đôi danh sách để làm vòng lặp. Nếu không cuộn: giữ nguyên danh sách gốc.
  const displayItems = shouldScroll ? [...collection, ...collection] : collection;

  const scrollStyles = `
    @keyframes scroll-right-to-left {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    
    .scroll-container {
      overflow: hidden;
      width: 100%;
      padding: 2rem 0;
    }
    
    .scroll-content {
      display: flex;
      width: max-content;
      gap: 2rem;
      padding: 0 1rem;
    }

    /* Class này chỉ được thêm vào khi có từ 4 item trở lên */
    .is-animating {
      animation: scroll-right-to-left 40s linear infinite;
    }
    
    .is-animating:hover {
      animation-play-state: paused;
    }

    /* Nếu ít item, ta cho nó đứng yên và căn giữa cho đẹp */
    .is-static {
      width: 100%;
      justify-content: center;
      flex-wrap: wrap; /* Cho phép rớt dòng nếu màn hình điện thoại nhỏ */
    }
  `;

  return (
    <>
      <style>{scrollStyles}</style>
      <section className="py-12 bg-secondary/30 overflow-x-hidden">
        
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center font-bold text-2xl uppercase mb-8 tracking-wider">
            Bộ sưu tập nổi bật
          </h2>
        </div>
        
        <div className="scroll-container">
          <div className={`scroll-content ${shouldScroll ? 'is-animating' : 'is-static'}`}>
            {displayItems.map((col, index) => (
              <Link 
                href={`/products?collectionId=${col.id}`} 
                key={`${col.id}-${index}`}
                // Nếu không cuộn, có thể điều chỉnh width linh hoạt hơn một chút
                className={`${shouldScroll ? 'min-w-[350px] md:min-w-[500px] lg:min-w-[600px] flex-shrink-0' : 'w-full md:w-[45%] lg:w-[40%]'} group block bg-white rounded-xl overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.7)] hover:shadow-[0_0_25px_rgba(255,255,255,1)] transition-all duration-500`}
              >
                <div className="relative aspect-video w-full bg-gray-100">
                  <Image 
                    src={col.thumbnail || '/placeholder.svg'} 
                    alt={col.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
        
      </section>
    </>
  );
}