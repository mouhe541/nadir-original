import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Grid, List, Search, Star, ShoppingCart, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/ProductCard'; // Import the shared ProductCard component
import FloatingCartButton from '@/components/FloatingCartButton';
import { supabase } from '@/lib/supabaseClient';
import { useCartStore } from '@/store/cartStore';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
}

const ProductCatalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true); // Always show filters
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const categories = ['Tous', 'Maquillage', 'Parfum', 'Soin', 'Cheveux'];

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Error fetching products', error.message);
        return;
      }
      if (data) {
        const mapped = data.map((p: any) => ({
          ...p,
          image_url: p.thumbnail_url || (p.image_urls && p.image_urls.length > 0 ? p.image_urls[0] : ''),
        }));
        setProducts(mapped);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;

    // Filter by search query
    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Filter by category
    if (selectedCategory !== 'Tous') {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchQuery, selectedCategory, products]);
  
  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handler functions for ProductCard
  const { addToCart, toggleCart } = useCartStore();
  
  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      thumbnail_url: product.image_url
    });
  };

  const handleViewDetails = (product: any) => {
    // Navigation handled by Link component
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="pt-20">
      {/* Hero Banner */}
      <section className="relative h-80 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
        <div className="glass-card p-12 text-center mx-4">
          <h1 className="text-4xl md:text-6xl font-serif signature-text mb-4">
            Toute la Collection
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Découvrez notre sélection de produits d'exception, conçus pour révéler votre beauté naturelle
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Badge className="bg-primary text-primary-foreground px-4 py-2">
              Livraison 24h Offerte
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              Retours Gratuits
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              Échantillons Offerts
            </Badge>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-glass-bg border-glass-border"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="border-primary/30 md:hidden" // Only show on mobile
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
            
            <div className="flex border border-glass-border rounded-[--radius] overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

          {/* Content Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Panel */}
            <aside className={`lg:w-1/4 glass-card p-6 ${showFilters ? 'block' : 'hidden'} lg:block`}>
              <div className="mb-6">
                  <h3 className="font-medium text-foreground mb-3">Catégories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                      <button
                      key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                        }}
                        className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                          selectedCategory === category
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-primary/10'
                        }`}
                    >
                      {category}
                      </button>
                  ))}
                </div>
              </div>
            </aside>

          {/* Products Grid */}
            <div className="lg:w-3/4 w-full">
              {filteredProducts.length === 0 ? (
                <div className="glass-card p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    Aucun produit ne correspond à votre recherche.
                  </p>
                  <Button
                    onClick={() => {
                      setSelectedCategory('Tous');
                      setSearchQuery('');
                    }}
                  >
                    Réinitialiser les filtres
                  </Button>
            </div>
              ) : (
                <div className={
              viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-6'
                }>
              {currentProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={() => handleAddToCart(product)}
                      onViewDetails={() => handleViewDetails(product)}
                    />
              ))}
                </div>
              )}
            </div>
            </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => paginate(page)}
                    className={page === currentPage ? '' : 'border-primary/30'}
                  >
                    {page}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />

      {/* Floating Cart Button for Mobile */}
      <FloatingCartButton onClick={toggleCart} />
    </div>
  );
};

export default ProductCatalog;