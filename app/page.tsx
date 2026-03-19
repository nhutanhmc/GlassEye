import { Header } from '@/components/header';
import { BannerCarousel } from '@/components/banner-carousel';
import { FashionGallery } from '@/components/fashion-gallery';
import { Highlightedcollection } from '@/components/highlighted-collections'; // Component mới 1
import { AllcollectionGrid } from '@/components/all-collections-grid';     // Component mới 2
import { FeaturesSection } from '@/components/features-section';
import { TestimonialsSection } from '@/components/testimonials-section';
import { ContactForm } from '@/components/contact-form';
import { Footer } from '@/components/footer';
import { ContactButtons } from '@/components/contact-buttons';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="w-full pt-0">
        <BannerCarousel />
      </section>

      <Highlightedcollection /> {/* Hiển thị banner Collection chạy ngang */}
      
      <AllcollectionGrid /> {/* Hiển thị toàn bộ Collection */}

      <FashionGallery />
      <FeaturesSection />
      <TestimonialsSection />
      <ContactForm />
      
      <Footer />
      <ContactButtons />
    </main>
  );
}