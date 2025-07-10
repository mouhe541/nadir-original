import { Instagram, Facebook, Phone, Clock, Mail, Lock, CreditCard, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-glass-border bg-glass-bg/50 backdrop-blur-md">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="signature-text text-2xl mb-4">
              Nadir Original
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              L'art de révéler votre beauté naturelle avec l'élégance française. 
              Des produits d'exception pour une expérience beauté inoubliable.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/nadir_original_23?igsh=MW4zMXlzM3RsM3Jkeg=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-glass-bg border border-glass-border rounded-full flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all duration-300 gold-glow"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/share/1CrLzanoE4/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-glass-bg border border-glass-border rounded-full flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all duration-300 gold-glow"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/0540811067"
                target="_blank"
                rel="noopener noreferrer"
                  className="w-10 h-10 bg-glass-bg border border-glass-border rounded-full flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all duration-300 gold-glow"
                aria-label="WhatsApp"
                >
                <Phone className="h-5 w-5" />
                </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <a href="/#boutique" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  Boutique
                </a>
              </li>
              <li>
                <a href="/#about" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  Notre Histoire
                </a>
              </li>
              <li>
                <a href="/#avis" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  Avis
                </a>
              </li>
              <li>
                <a href="/products" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  Store
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section Removed */}
        </div>

        {/* Newsletter Section - Removed */}

        {/* Bottom Section */}
        <div className="border-t border-glass-border pt-8">
          <div className="md:flex md:items-center md:justify-between">
            {/* Copyright */}
            <div className="text-muted-foreground text-sm mb-4 md:mb-0">
              © 2025 Nadir Original. Tous droits réservés. 
              <span className="ml-2">Fait avec ❤️ à Alger</span>
            </div>

            {/* Legal Links Removed */}
          </div>
        </div>

        {/* Signature */}
        <div className="text-center mt-8 pt-6 border-t border-glass-border">
          <p className="signature-text text-sm">
            "Votre beauté, notre passion"
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;