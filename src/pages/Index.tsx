import { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/hero/Hero';
import ProductGrid from '@/components/ProductGrid';
import BrandStory from '@/components/BrandStory';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ScrollReveal from '@/components/ScrollReveal';
import FloatingCartButton from '@/components/FloatingCartButton';
import { useCartStore } from '@/store/cartStore';

const Index = () => {
  const { toggleCart } = useCartStore();
  
  // Initialize scroll animations when component mounts
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      
      reveals.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('active');
        }
      });
    };

    // Initial check
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-background text-foreground animate-fade-in">
      <Header />
        <main>
      <Hero />
          {/* 'Nos Nouveautés' section removed as per request */}

          <ScrollReveal delay={300}>
      <section id="boutique" className="border-t border-glass-border">
        <ProductGrid title="Toute la Collection" showFilters={true} />
      </section>
          </ScrollReveal>

          <ScrollReveal delay={400}>
      <section id="about" className="border-t border-glass-border">
        <BrandStory />
      </section>
          </ScrollReveal>

          <ScrollReveal delay={500}>
      <section id="avis" className="border-t border-glass-border">
        <Testimonials />
      </section>
          </ScrollReveal>
        </main>
      <Footer />
      <FloatingCartButton onClick={toggleCart} />
      </div>
    </PageTransition>
  );
};

export default Index;