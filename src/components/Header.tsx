import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Button } from './ui/button';
import { ShoppingCart, Menu, ChevronDown } from 'lucide-react';
import { Badge } from './ui/badge';
import { CartSidebar } from './CartSidebar';
import { useCartStore } from '@/store/cartStore';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"


const Header = () => {
  const { toggleCart, getCartItemCount } = useCartStore();
  const itemCount = getCartItemCount();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check scroll position on initial load
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainNav = [
    { name: "Boutique", href: "/#boutique" },
    { name: "Notre Histoire", href: "/#about" },
    { name: "Avis", href: "/#avis" },
    { name: "Store", href: "/products" },
  ];
  
  const categories = ['Maquillage', 'Parfum', 'Soin', 'Cheveux'];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          isScrolled || !isHomePage 
            ? 'glass-card border-b border-glass-border' 
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="text-2xl md:text-3xl font-serif signature-text">
                Nadir Original
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 justify-center items-center">
              <NavigationMenu>
                <NavigationMenuList className="space-x-8">
                  {mainNav.map((item) => (
                    <NavigationMenuItem key={item.name}>
                      <a href={item.href} className="text-foreground hover:text-primary transition-colors duration-300 font-medium text-lg">
                        {item.name}
                      </a>
                    </NavigationMenuItem>
                  ))}

                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-foreground hover:text-primary data-[state=open]:text-primary transition-colors duration-300 font-medium text-lg bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                      Catégories
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-background border-glass-border">
                        {categories.map((category) => (
                          <li key={category}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={`/products?category=${category}`}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none text-foreground">{category}</div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              <Button onClick={toggleCart} variant="ghost" size="icon" className="relative hidden md:flex">
                <ShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 justify-center rounded-full p-0">
                    {itemCount}
                  </Badge>
                )}
              </Button>
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(true)}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Side Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-background/90 border-l border-glass-border p-6 animate-slide-left">
            <div className="flex items-center justify-between mb-8">
              <div className="text-xl font-serif signature-text">Menu</div>
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(false)}>✕</Button>
            </div>
            <nav className="space-y-2">
              {mainNav.map((item) => (
                <a key={item.name} href={item.href} className="block text-lg text-foreground hover:text-primary transition-colors duration-300 py-2 border-b border-glass-border" onClick={() => setIsMenuOpen(false)}>
                  {item.name}
                </a>
              ))}
              <Collapsible className="pt-2 border-b border-glass-border">
                <CollapsibleTrigger className="flex justify-between items-center w-full text-lg text-foreground hover:text-primary transition-colors duration-300 py-2">
                  <span>Catégories</span>
                  <ChevronDown className="h-5 w-5 transition-transform duration-200" />
                </CollapsibleTrigger>
                <CollapsibleContent className="py-2 pl-4">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/products?category=${category}`}
                      className="block text-base text-muted-foreground hover:text-primary transition-colors duration-300 py-2 border-b border-glass-border last:border-b-0"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category}
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </nav>
          </div>
        </div>
      )}

      <CartSidebar />
    </>
  );
};

export default Header;