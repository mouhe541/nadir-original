import { useState, useEffect } from 'react';

const BrandStory = () => {
  const [visibleLines, setVisibleLines] = useState(0);

  const storyLines = [
    "Nadir Original naît de la passion française pour l'excellence cosmétique.",
    "Chaque produit est conçu comme une œuvre d'art, alliant tradition et innovation.",
    "Nos formules exclusives révètent la beauté naturelle de chaque femme.",
    "L'élégance parisienne rencontre le savoir-faire artisanal.",
    "Parce que votre beauté mérite le luxe authentique."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLines(prev => {
        if (prev < storyLines.length) {
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-gradient-radial from-primary/5 to-transparent rounded-full animate-float" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Story Content */}
          <div>
            <h2 className="text-4xl md:text-6xl font-serif mb-8 signature-text">
              Pourquoi Nadir Original ?
            </h2>
            
            <div className="space-y-6">
              {storyLines.map((line, index) => (
                <div
                  key={index}
                  className={`transition-all duration-1000 ${
                    index < visibleLines 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 translate-x-8'
                  }`}
                >
                  <p className="text-lg md:text-xl text-foreground leading-relaxed">
                    {line}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 space-y-8">
              {/* Brand Values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: "🇫🇷", title: "Made in France", desc: "Savoir-faire français authentique" },
                  { icon: "🌿", title: "Ingrédients Naturels", desc: "Formules respectueuses et efficaces" },
                  { icon: "✨", title: "Luxe Accessible", desc: "L'excellence à prix juste" },
                  { icon: "🔬", title: "Innovation", desc: "Recherche et développement constant" }
                ].map((value, index) => (
                  <div
                    key={index}
                    className={`glass-card p-4 transition-all duration-500 hover:scale-105 ${
                      visibleLines > 3 ? 'animate-cascade' : 'opacity-0'
                    }`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="text-2xl mb-2">{value.icon}</div>
                    <h3 className="font-medium text-foreground mb-1">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Elements */}
          <div className="relative">
            <div className="glass-card p-8 text-center">
              {/* Signature */}
              <div className="signature-text text-4xl mb-6">
                Nadir Original
              </div>
              
              {/* Quote */}
              <blockquote className="text-xl italic text-muted-foreground mb-8">
                "L'art de révéler votre beauté naturelle avec l'élégance française."
              </blockquote>

              {/* Founder Signature */}
              <div className="border-t border-glass-border pt-6">
                <div className="text-primary font-serif text-lg mb-2">
                  Fondé en 2024
                </div>
                <div className="text-sm text-muted-foreground">
                  Par une équipe passionnée de beauté et d'excellence
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full animate-float" />
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary/30 rounded-full animate-float" style={{ animationDelay: '1s' }} />
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-xs text-muted-foreground">Français</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-xs text-muted-foreground">Compromis</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className={`${visibleLines >= storyLines.length ? 'animate-cascade' : 'opacity-0'}`}>
            <p className="text-xl text-muted-foreground mb-6">
              Découvrez l'univers Nadir Original
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;