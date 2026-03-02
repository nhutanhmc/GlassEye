'use client';

import Image from 'next/image';

interface GalleryImage {
  id: number;
  image: string;
  title?: string;
  span?: 'col-1' | 'col-2' | 'row-2';
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    image: '/fashion-1.jpg',
    title: 'Editorial',
    span: 'col-1',
  },
  {
    id: 2,
    image: '/fashion-2.jpg',
    title: 'GENTLE MONSTER',
    span: 'col-1',
  },
  {
    id: 3,
    image: '/fashion-3.jpg',
    span: 'col-1',
  },
  {
    id: 4,
    image: '/fashion-4.jpg',
    title: 'GIVENCHY',
    span: 'col-2',
  },
  {
    id: 5,
    image: '/fashion-5.jpg',
    span: 'col-1',
  },
  {
    id: 6,
    image: '/fashion-6.jpg',
    span: 'col-1',
  },
];

export function FashionGallery() {
  return (
    <section className="py-12 sm:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {galleryImages.map((item, index) => (
            <div
              key={item.id}
              className={`relative overflow-hidden group ${
                item.span === 'col-2' ? 'lg:col-span-2' : 'col-span-1'
              } ${item.span === 'row-2' ? 'lg:row-span-2' : ''}`}
            >
              {/* Image Container */}
              <div className="relative w-full aspect-square lg:aspect-auto">
                <Image
                  src={item.image || '/placeholder.svg'}
                  alt={item.title || `Gallery image ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  priority={index < 3}
                />

                {/* Dark Overlay on Hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

                {/* Title Overlay */}
                {item.title && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white font-black text-2xl sm:text-3xl text-center tracking-wider drop-shadow-lg">
                      {item.title}
                    </h3>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
