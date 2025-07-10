import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/components/ui/use-toast';
import FloatingCartButton from '@/components/FloatingCartButton';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  description: string;
  full_description?: string;
  ingredients?: string;
  how_to_use?: string;
  benefits?: string[];
  category: string;
  subcategory?: string;
  is_new?: boolean;
  in_stock?: boolean;
  stock_count?: number;
  thumbnail_url: string;
  image_urls?: string[];
}

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart, toggleCart } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      
      if (!id) {
        navigate('/products');
        return;
      }
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le produit. Veuillez réessayer.",
          variant: "destructive"
        });
        navigate('/products');
        return;
      }
      
      if (data) {
        let parsedBenefits = [];
        if (data.benefits) {
          try {
            if (typeof data.benefits === 'string') {
              parsedBenefits = JSON.parse(data.benefits);
            } else if (Array.isArray(data.benefits)) {
              parsedBenefits = data.benefits;
            }
          } catch (e) {
            console.error('Error parsing benefits:', e);
            parsedBenefits = [];
          }
        }
        
        setProduct({
          ...data,
          benefits: parsedBenefits,
          image_urls: data.image_urls || [data.thumbnail_url]
        });
      }
      
      setLoading(false);
    };
    
    fetchProduct();
  }, [id, navigate, toast]);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      thumbnail_url: product.thumbnail_url
    });
    
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement du produit...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="text-3xl font-serif mb-4">Produit non trouvé</h1>
            <p className="text-muted-foreground mb-8">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
            <Link to="/products">
              <Button className="luxury-button">Voir tous les produits</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary transition-colors">Produits</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <Link to="/products">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux produits
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-4">
            <div className="glass-card p-4">
              <img
                src={product.image_urls?.[selectedImage] || product.thumbnail_url}
                alt={product.name}
                className="w-full h-[500px] object-cover rounded-[--radius]"
              />
            </div>
            
            {product.image_urls && product.image_urls.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
                {product.image_urls.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-[--radius] overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-glass-border'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">{product.subcategory || product.category}</Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-serif signature-text mb-4">
                {product.name}
              </h1>
              
              {product.is_new && <Badge className="bg-primary text-primary-foreground mb-4">NOUVEAU</Badge>}

              <p className="text-lg text-muted-foreground mb-6">
                {product.description}
              </p>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-foreground">{product.price} DA</span>
              {product.original_price && product.original_price > product.price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {product.original_price} DA
                  </span>
                  <Badge variant="destructive">
                    -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                  </Badge>
                </>
              )}
            </div>

            <div className="mb-6">
              {product.in_stock !== false ? (
                <div className="text-green-600 font-medium">
                  ✓ En stock {product.stock_count ? `(${product.stock_count} articles restants)` : ''}
                </div>
              ) : (
                <div className="text-red-600 font-medium">
                  ✗ Rupture de stock
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-input rounded-[--radius]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="rounded-r-none"
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(q => q + 1)}
                  className="rounded-l-none"
                >
                  +
                </Button>
              </div>
              <Button 
                className="luxury-button flex-1" 
                onClick={handleAddToCart}
                disabled={product.in_stock === false}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Ajouter au Panier
              </Button>
            </div>
            
            {product.benefits && product.benefits.length > 0 && (
              <div className="mt-8">
                  <h3 className="text-lg font-serif signature-text mb-4">Pourquoi vous allez l'adorer</h3>
                  <ul className="space-y-2">
                      {product.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                              <Star className="h-4 w-4 text-primary mr-3 mt-1 flex-shrink-0" />
                              <span className="text-muted-foreground">{benefit}</span>
                          </li>
                      ))}
                  </ul>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center pt-6 mt-6 border-t border-glass-border">
              <div className="flex flex-col items-center">
                {/* Location icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mb-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 10c-4.418 0-8-5.373-8-10a8 8 0 1116 0c0 4.627-3.582 10-8 10z" /></svg>
                <span className="text-sm font-medium">Disponible en Algérie</span>
                <span className="text-xs text-muted-foreground">Ce produit est disponible exclusivement et pour la première fois en Algérie.</span>
              </div>
              <div className="flex flex-col items-center">
                {/* Guarantee/Cart icon */}
                <ShoppingCart className="h-7 w-7 mb-2 text-primary" />
                <span className="text-sm font-medium">30 jours de garantie</span>
                <span className="text-xs text-muted-foreground">À la réception du produit, vous pouvez le retourner sous 30 jours.</span>
              </div>
              <div className="flex flex-col items-center">
                {/* Headset icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mb-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3C7.03 3 3 7.03 3 12v5a3 3 0 003 3h1a1 1 0 001-1v-4a1 1 0 00-1-1H6v-2c0-3.86 3.14-7 7-7s7 3.14 7 7v2h-1a1 1 0 00-1 1v4a1 1 0 001 1h1a3 3 0 003-3v-5c0-4.97-4.03-9-9-9z" /></svg>
                <span className="text-sm font-medium">Service client</span>
                <span className="text-xs text-muted-foreground">Nous sommes disponibles du samedi au jeudi pour répondre à vos questions.</span>
              </div>
              <div className="flex flex-col items-center">
                {/* Money icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mb-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-4.418 0-8-5.373-8-10a8 8 0 1116 0c0 4.627-3.582 10-8 10z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-4m0 0V8m0 4h4m-4 0H8" /></svg>
                <span className="text-sm font-medium">Paiement à la livraison</span>
                <span className="text-xs text-muted-foreground">Payez à la réception de votre commande.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </main>
      <FloatingCartButton onClick={toggleCart} />
      <Footer />
    </div>
  );
};

export default ProductDetail;