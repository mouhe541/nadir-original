import { ShoppingCart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { useCartStore } from '@/store/cartStore';

import { Link } from 'react-router-dom';

export function CartSidebar() {
  const { 
    items, 
    isOpen, 
    toggleCart, 
    removeFromCart, 
    updateQuantity,
    getCartTotal,
  } = useCartStore();

  const total = getCartTotal();

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="flex flex-col bg-gray-900/95 text-white border-l border-gray-800 backdrop-blur-sm">
        <SheetHeader>
          <SheetTitle className="text-2xl font-serif signature-text">Votre Panier</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto -mx-6 px-6 divide-y divide-gray-800">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="h-16 w-16 text-gray-600 mb-4" />
                <p className="text-lg font-medium text-gray-300">Votre panier est vide</p>
                <p className="text-sm text-gray-500">Les articles que vous ajoutez apparaîtront ici.</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="py-6 flex items-start space-x-4">
                <img src={item.thumbnail_url} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-primary">{item.price} DA</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-700 rounded-md">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                      <span className="px-3 text-sm">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeFromCart(item.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <SheetFooter className="border-t border-gray-800 pt-6 -mx-6 px-6 bg-gray-900/95">
            <div className="w-full space-y-4">
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{total} DA</span>
                </div>
                <Link to="/checkout" className="w-full">
                  <Button className="w-full luxury-button" size="lg" onClick={toggleCart}>
                      Procéder au Paiement
                  </Button>
                </Link>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
} 