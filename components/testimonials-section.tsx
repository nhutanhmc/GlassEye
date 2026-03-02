'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  comment: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Fashion Enthusiast',
    image: '/customer-1.jpg',
    comment:
      'The quality of these glasses is exceptional! I love how they combine style with comfort. The customer service was amazing and delivery was super fast. Highly recommend!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Business Professional',
    image: '/customer-2.jpg',
    comment:
      'Found the perfect pair for my work environment. The frames are durable and the lenses are crystal clear. Best purchase I\'ve made this year!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emma Davis',
    role: 'Creative Designer',
    image: '/customer-3.jpg',
    comment:
      'AndreaQuality has such a curated collection. Every pair I tried was stylish and well-made. The variety is incredible and prices are fair.',
    rating: 5,
  },
  {
    id: 4,
    name: 'James Rodriguez',
    role: 'Tech Entrepreneur',
    image: '/customer-4.jpg',
    comment:
      'Outstanding selection and impeccable service. I purchased multiple pairs and each one exceeded my expectations. Can\'t wait to explore their new collection!',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-28 bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-primary-foreground/75 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Real feedback from satisfied customers who found their perfect pair
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex gap-6 bg-card rounded-xl p-6 sm:p-8 border border-border/50 hover:shadow-lg transition-all duration-300"
            >
              {/* Customer Image */}
              <div className="flex-shrink-0">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-accent/30">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Comment Section */}
              <div className="flex-1">
                {/* Rating */}
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-accent text-accent"
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-foreground text-sm sm:text-base leading-relaxed mb-4">
                  "{testimonial.comment}"
                </p>

                {/* Name & Role */}
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
