import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/components/ui/use-toast';

// Interface matching ProductCard expectations
interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  originalPrice?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
}

interface ProductGridProps {
  title: string;
  showFilters?: boolean;
}

const ProductGrid = ({ title, showFilters = true }: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [isVisible, setIsVisible] = useState(false);
  const [animatedItems, setAnimatedItems] = useState<Set<number>>(new Set());
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);

  const categories = ['Tous', 'Maquillage', 'Parfum', 'Soin', 'Cheveux', 'Accessoires'];

  // Fetch products from Supabase on mount
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Error fetching products:', error.message);
        return;
      }

      if (data) {
        const mapped: Product[] = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          category: p.category || 'Autres',
          image_url: p.thumbnail_url || (p.image_urls && p.image_urls.length > 0 ? p.image_urls[0] : ''),
          // Placeholder for future flags
          isNew: false,
          isBestSeller: false,
        }));

        setProducts(mapped);
        setFilteredProducts(mapped);
      }
    };

    fetchProducts();
  }, []);

  // Animation on scroll
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    const handleScroll = () => {
      productRefs.current.forEach((ref, index) => {
        if (!ref) return;
        
        const rect = ref.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight - 100;
        
        if (isInView && !animatedItems.has(index)) {
          setAnimatedItems(prev => new Set(prev).add(index));
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [animatedItems]);

  // Filter products
  useEffect(() => {
    let filtered = selectedCategory === 'Tous' 
      ? products 
      : products.filter(p => p.category === selectedCategory);

    setFilteredProducts(filtered);
    // Reset animations when filters change
    setAnimatedItems(new Set());
  }, [selectedCategory, products]);

  const { addToCart } = useCartStore();
  const { toast } = useToast();

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      thumbnail_url: product.image_url
    });
    
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`
    });
  };

  const handleViewDetails = (product: any) => {
    // Navigation handled by Link component
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-serif mb-4 signature-text">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre sélection de produits d'exception, conçus pour révéler votre beauté naturelle
          </p>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className={`mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category, idx) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`${selectedCategory === category ? "luxury-button" : "border-primary/30 hover:bg-primary/10"} transition-all duration-500`}
                  style={{ 
                    transitionDelay: `${300 + idx * 100}ms`,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(10px)'
                  }}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              ref={el => productRefs.current[index] = el}
              className={`transition-all duration-700 ${animatedItems.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
              />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link to="/products">
            <Button className="luxury-button px-12 py-4 text-lg">
              Voir Plus de Produits
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;