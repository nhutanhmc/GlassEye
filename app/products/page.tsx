import { Header } from '@/components/header';
import { BannerCarousel } from '@/components/banner-carousel';
import { FashionGallery } from '@/components/fashion-gallery';
import { ProductsGrid } from '@/components/products-grid';
import { FeaturesSection } from '@/components/features-section';
import { TestimonialsSection } from '@/components/testimonials-section';
import { ContactForm } from '@/components/contact-form';
import { Footer } from '@/components/footer';
import { ContactButtons } from '@/components/contact-buttons';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Banner Section - Full Width */}
      <section className="w-full pt-0">
        <BannerCarousel />
      </section>

      {/* Main Content */}
      <FashionGallery />
      <ProductsGrid />
      <FeaturesSection />
      <TestimonialsSection />
      <ContactForm />
      
      {/* Footer */}
      <Footer />

      {/* Contact Buttons */}
      <ContactButtons />
    </main>
  );
}
