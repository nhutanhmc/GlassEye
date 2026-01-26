'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-background border-y border-border/50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Exclusive Updates
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg mb-10 leading-relaxed">
          Subscribe to receive early access to new collections, special promotions, and eyewear tips
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-5 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
          />
          <Button type="submit" className="bg-primary hover:bg-primary/90 px-8 font-medium transition-all duration-300">
            {isSubscribed ? 'Subscribed! ✓' : 'Subscribe'}
          </Button>
        </form>

        <p className="text-muted-foreground text-xs mt-5">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
