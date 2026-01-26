'use client';

import { Truck, Shield, RotateCcw, HeadsetIcon } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $50',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% safe transactions',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '30-day return policy',
  },
  {
    icon: HeadsetIcon,
    title: '24/7 Support',
    description: 'Expert customer service',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 sm:py-24 bg-primary">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-5 group-hover:bg-accent/15 transition-colors duration-300">
                  <Icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
