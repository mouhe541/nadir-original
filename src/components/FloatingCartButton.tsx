import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface FloatingCartButtonProps {
  onClick: () => void;
}

const FloatingCartButton = ({ onClick }: FloatingCartButtonProps) => {
  const { getCartItemCount } = useCartStore();
  const itemCount = getCartItemCount();

  return (
    <div className="fixed bottom-6 right-6 md:hidden z-40">
      <button 
        onClick={onClick}
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-[0_0_30px_hsl(var(--primary)/0.4)] animate-pulse-gold flex items-center justify-center"
      >
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-foreground text-background text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default FloatingCartButton; 