'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ContactButtons } from '@/components/contact-buttons';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-primary text-primary-foreground py-20 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h1 className="font-sans text-5xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tighter">
              About AndreaQuality
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Crafting timeless eyewear that blends luxury, style, and quality into every frame
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-sans text-3xl sm:text-4xl font-black mb-6 text-foreground">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  AndreaQuality was born from a passion for exceptional eyewear design. Founded with the belief that your glasses should be a statement of personal style, we've dedicated ourselves to creating frames that inspire confidence and express individuality.
                </p>
                <p>
                  Every pair of glasses we create is meticulously crafted with attention to detail, combining premium materials with innovative design. We believe in quality over quantity, offering curated collections that stand the test of time.
                </p>
                <p>
                  Our journey began in the heart of fashion, and we've grown to become a trusted name for those who appreciate luxury eyewear. We're committed to bringing you the finest optical experiences with frames that are as unique as you are.
                </p>
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src="/fashion-1.jpg"
                alt="AndreaQuality Story"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 sm:py-28 bg-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-sans text-3xl sm:text-4xl font-black text-primary-foreground mb-12 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-primary-foreground/5 border border-primary-foreground/10 p-8 rounded-lg">
              <h3 className="font-sans text-xl font-bold text-primary-foreground mb-4 uppercase tracking-wider">
                Quality
              </h3>
              <p className="text-primary-foreground/75">
                We never compromise on quality. Each pair is crafted with premium materials and precision engineering to ensure durability and comfort.
              </p>
            </div>
            <div className="bg-primary-foreground/5 border border-primary-foreground/10 p-8 rounded-lg">
              <h3 className="font-sans text-xl font-bold text-primary-foreground mb-4 uppercase tracking-wider">
                Innovation
              </h3>
              <p className="text-primary-foreground/75">
                We continuously push boundaries in eyewear design, merging classic aesthetics with modern innovation to create timeless pieces.
              </p>
            </div>
            <div className="bg-primary-foreground/5 border border-primary-foreground/10 p-8 rounded-lg">
              <h3 className="font-sans text-xl font-bold text-primary-foreground mb-4 uppercase tracking-wider">
                Integrity
              </h3>
              <p className="text-primary-foreground/75">
                We believe in honest communication, fair pricing, and exceptional customer service. Your satisfaction is our commitment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-sans text-3xl sm:text-4xl font-black mb-12 text-foreground text-center">
            Our Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group">
              <div className="relative aspect-square overflow-hidden mb-6 rounded-lg">
                <Image
                  src="/fashion-2.jpg"
                  alt="Sunglasses Collection"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <h3 className="font-sans text-xl font-bold text-foreground mb-2 uppercase tracking-wider">
                Sunglasses
              </h3>
              <p className="text-muted-foreground">
                Premium sun protection with style. Our sunglasses collection features bold designs and superior UV protection.
              </p>
            </div>
            <div className="group">
              <div className="relative aspect-square overflow-hidden mb-6 rounded-lg">
                <Image
                  src="/fashion-3.jpg"
                  alt="Optical Collection"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <h3 className="font-sans text-xl font-bold text-foreground mb-2 uppercase tracking-wider">
                Optical
              </h3>
              <p className="text-muted-foreground">
                Crystal clear vision with elegant frames. Perfect for everyday wear with prescription lenses.
              </p>
            </div>
            <div className="group">
              <div className="relative aspect-square overflow-hidden mb-6 rounded-lg">
                <Image
                  src="/fashion-4.jpg"
                  alt="Frames Collection"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <h3 className="font-sans text-xl font-bold text-foreground mb-2 uppercase tracking-wider">
                Frames
              </h3>
              <p className="text-muted-foreground">
                Iconic frame designs for every face shape. From classic to contemporary, find your perfect match.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-primary text-primary-foreground text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-sans text-3xl sm:text-4xl font-black mb-6">
            Experience AndreaQuality
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Discover our latest collections and find the perfect pair of glasses to express your unique style.
          </p>
          <a
            href="/"
            className="inline-block px-8 py-4 bg-white text-black font-bold uppercase tracking-wider hover:bg-white/90 transition-all"
          >
            Shop Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Contact Buttons */}
      <ContactButtons />
    </main>
  );
}
