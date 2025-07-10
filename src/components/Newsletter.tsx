import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      // Here you would implement the newsletter subscription logic
    }
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Floating Cosmetic Icons */}
      <div className="absolute top-10 left-10 w-8 h-8 text-primary/30 animate-float" style={{ animationDelay: '0s' }}>
        💄
      </div>
      <div className="absolute top-32 right-20 w-6 h-6 text-primary/30 animate-float" style={{ animationDelay: '1s' }}>
        ✨
      </div>
      <div className="absolute bottom-20 left-1/4 w-7 h-7 text-primary/30 animate-float" style={{ animationDelay: '2s' }}>
        💍
      </div>

      <div className="container mx-auto max-w-4xl">
        <div className="glass-card p-12 text-center relative">
          {/* Radial Gradient Effect */}
          <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent rounded-[--radius]" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-serif mb-6 signature-text">
              Restez Connectée à l'Élégance
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Recevez en exclusivité nos nouveautés, conseils beauté et offres privilégiées. 
              Rejoignez notre communauté de passionnées de beauté.
            </p>

            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="email"
                    placeholder="Votre adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-glass-bg border-glass-border text-foreground placeholder:text-muted-foreground"
                    required
                  />
                  <Button type="submit" className="luxury-button whitespace-nowrap">
                    S'abonner
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  En vous inscrivant, vous acceptez de recevoir nos communications marketing. 
                  Vous pouvez vous désabonner à tout moment.
                </p>
              </form>
            ) : (
              <div className="animate-cascade">
                <div className="text-6xl mb-4">💌</div>
                <h3 className="text-2xl font-serif text-primary mb-2">Merci !</h3>
                <p className="text-muted-foreground">
                  Votre inscription a été confirmée. Vous recevrez bientôt nos dernières actualités beauté.
                </p>
              </div>
            )}

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-glass-border">
              <div className="text-center">
                <div className="text-2xl mb-2">🎁</div>
                <h4 className="font-medium text-foreground mb-1">Offres Exclusives</h4>
                <p className="text-sm text-muted-foreground">Accès privilégié aux promotions</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">✨</div>
                <h4 className="font-medium text-foreground mb-1">Nouveautés en Avant-Première</h4>
                <p className="text-sm text-muted-foreground">Découvrez nos produits en exclusivité</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">💡</div>
                <h4 className="font-medium text-foreground mb-1">Conseils Beauté</h4>
                <p className="text-sm text-muted-foreground">Astuces d'experts personnalisées</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;