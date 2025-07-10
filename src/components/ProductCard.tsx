import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart, onViewDetails }: ProductCardProps) => {
  return (
    <div className="product-card group">
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-[calc(var(--radius)-4px)] mb-4">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link to={`/product-detail/${product.id}`}>
            <Button className="luxury-button py-2 px-4 text-sm">
              Voir Détails
            </Button>
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground font-medium">
          {product.category}
        </div>
        <Link to={`/product-detail/${product.id}`} className="block">
          <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-foreground">
            {product.price} DA
          </span>
        </div>
      </div>

      {/* Add to Cart Button - Visible on all devices */}
      <button
        onClick={() => onAddToCart(product)}
        className="w-full mt-4 luxury-button py-3"
      >
        Ajouter au Panier
      </button>
    </div>
  );
};

export default ProductCard;