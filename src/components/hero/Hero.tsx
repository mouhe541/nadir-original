import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, ShoppingBag, Heart, Leaf, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroCosmetic from '@/assets/hero-cosmetic-luxury.jpg';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger entrance animations after a short delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const scrollToNextSection = () => {
    // Scroll to the boutique section which is the first section after hero
    const boutiqueSection = document.getElementById('boutique');
    if (boutiqueSection) {
      boutiqueSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback: try to find any section after the hero
      const sections = document.querySelectorAll('section');
      if (sections && sections.length > 1) {
        // The first section is the hero, so scroll to the second section
        sections[1].scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 md:pt-0">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroCosmetic}
          alt="Nadir Original Luxury Cosmetics"
          className={`w-full h-full object-cover transition-all duration-2000 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          }`}
        />
        <div className={`absolute inset-0 bg-background/60 transition-opacity duration-2000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`} />
      </div>

      {/* Soft White Glow Edges */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/10 to-transparent transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`} />
        <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/10 to-transparent transition-opacity duration-1000 delay-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`} />
        <div className={`absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-white/10 to-transparent transition-opacity duration-1000 delay-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`} />
        <div className={`absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-white/10 to-transparent transition-opacity duration-1000 delay-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`} />
      </div>

      {/* Logo with Glow Effect */}
      <div className={`absolute top-1/3 md:top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[120%] md:-translate-y-[220%] z-10 transition-all duration-1000 ${
        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
      }`}>
        <div className="relative w-24 h-24 md:w-40 md:h-40">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse-slow"></div>
          <div className="absolute inset-0 rounded-full bg-primary/30 blur-lg animate-pulse-gold"></div>
          <img 
            src="/nadir_original_logo.png" 
            alt="Nadir Original Logo" 
            className="relative w-full h-full object-contain animate-float"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 mt-12 md:mt-0">
        {/* Main Typography */}
        <div className="mb-8">
          <p className={`text-xl md:text-3xl text-muted-foreground mb-4 italic opacity-90 transition-all duration-1000 delay-500 ${
            isLoaded ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Nadir Original n'est pas une marque de beauté…
          </p>
          <h1 className={`text-4xl md:text-7xl font-serif font-bold text-foreground mb-6 transition-all duration-1000 delay-800 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            C'est une révélation.
          </h1>
          <p className={`text-lg md:text-2xl text-primary font-serif italic transition-all duration-1000 delay-1100 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            L'essence du luxe, goutte après goutte.
          </p>
        </div>

        {/* Action Buttons */}
        <div className={`flex flex-col sm:flex-row gap-6 justify-center mb-12 transition-all duration-1000 delay-1400 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <Button 
            onClick={scrollToNextSection}
            className="luxury-button luxury-button-animated text-base md:text-lg px-6 md:px-10 py-3 md:py-4 flex items-center gap-3 w-full sm:w-auto"
          >
            <ArrowDown className="w-5 h-5" />
            Explorer Plus
          </Button>
          <Link to="/products" className="w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="button-outline-shimmer text-base md:text-lg px-6 md:px-10 py-3 md:py-4 flex items-center gap-3 w-full"
            >
            <div className="shimmer-effect" />
              <ShoppingBag className="w-5 h-5 mr-2" />
              Visiter Notre Boutique
          </Button>
          </Link>
        </div>

        {/* Tags */}
        <div className={`flex flex-wrap justify-center gap-4 transition-all duration-1000 delay-1700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {[
            { label: 'Soins du visage', icon: Heart },
            { label: 'Édition limitée', icon: Sparkles },
            { label: '100% Naturel', icon: Leaf },
            { label: 'Glow infini', icon: Sparkles }
          ].map((tag, index) => {
            const IconComponent = tag.icon;
            return (
              <button
                key={tag.label}
                className={`glass-card px-4 md:px-6 py-2 md:py-3 flex items-center gap-2 hover:gold-glow transition-all duration-300 hover:scale-105 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${1700 + index * 100}ms` }}
              >
                <IconComponent className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">{tag.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-2000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero; 