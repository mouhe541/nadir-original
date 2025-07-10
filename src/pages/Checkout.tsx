import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from '@/store/cartStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";

const wilayas = [
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra",
    "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret",
    "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda",
    "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem",
    "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi", 
    "Bordj Bou Arreridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt",
    "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla",
    "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun", 
    "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès", "In Salah", 
    "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"
];

const shippingPrices = {
  bureau: { 1: 350, 2: 450, 3: 450, 4: 750 },
  domicile: { 1: 600, 2: 600, 3: 800, 4: 1200 },
};

const wilayaToGroup: { [key: string]: number } = {
  "Alger": 1, "Blida": 1, "Boumerdès": 1, "Tipaza": 1, "Médéa": 1, "Tizi Ouzou": 1, "Bouira": 1, "Béjaïa": 1,
  "Chlef": 2, "Oum El Bouaghi": 2, "Batna": 2, "Jijel": 2, "Sétif": 2, "Skikda": 2,
  "Sidi Bel Abbès": 2, "Annaba": 2, "Guelma": 2, "Constantine": 2, "Mostaganem": 2,
  "M'Sila": 2, "Mascara": 2, "Oran": 2, "Bordj Bou Arreridj": 2, "El Tarf": 2, "Tissemsilt": 2,
  "Khenchela": 2, "Souk Ahras": 2, "Mila": 2, "Aïn Defla": 2, "Aïn Témouchent": 2, "Relizane": 2, "Tiaret": 2,
  "Laghouat": 3, "Biskra": 3, "Béchar": 3, "Tébessa": 3, "Tlemcen": 3, "Djelfa": 3,
  "Saïda": 3, "El Bayadh": 3, "El Oued": 3, "Naâma": 3,
  "Adrar": 4, "Tamanrasset": 4, "Ouargla": 4, "Illizi": 4, "Tindouf": 4,
  "Ghardaïa": 4, "Timimoun": 4, "Bordj Badji Mokhtar": 4, "Ouled Djellal": 4,
  "Béni Abbès": 4, "In Salah": 4, "In Guezzam": 4, "Touggourt": 4, "Djanet": 4,
  "El M'Ghair": 4, "El Meniaa": 4,
};

const Checkout = () => {
  const { items, getCartTotal, clearCart } = useCartStore();
  const [formData, setFormData] = useState({ fullName: '', phone: '' });
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [livraisonType, setLivraisonType] = useState<"domicile" | "bureau">("domicile");
  const [shippingCost, setShippingCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (selectedWilaya) {
      const group = wilayaToGroup[selectedWilaya];
      
      if (group) {
        const cost = shippingPrices[livraisonType][group as keyof typeof shippingPrices[typeof livraisonType]];
        setShippingCost(cost || 0);
      } else {
        // Try to find a close match in the wilayaToGroup keys
        const keys = Object.keys(wilayaToGroup);
        const closestMatch = keys.find(key => key.toLowerCase() === selectedWilaya.toLowerCase());
        if (closestMatch) {
          const group = wilayaToGroup[closestMatch];
          const cost = shippingPrices[livraisonType][group as keyof typeof shippingPrices[typeof livraisonType]];
          setShippingCost(cost || 0);
        } else {
          setShippingCost(0); // Default if wilaya not in groups
        }
      }
    } else {
      setShippingCost(0);
    }
  }, [selectedWilaya, livraisonType, items]);

  const subtotal = getCartTotal();
  const total = subtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWilaya) {
      toast({ title: "Erreur", description: "Veuillez sélectionner une wilaya.", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);

    const orderData = {
      full_name: formData.fullName,
      phone_number: formData.phone,
      wilaya: selectedWilaya,
      shipping_type: livraisonType,
      shipping_cost: shippingCost,
      order_total: total,
      order_items: items.map(item => ({ 
        id: item.id, 
        name: item.name, 
        price: item.price, 
        quantity: item.quantity,
        thumbnail_url: item.thumbnail_url 
      })),
      status: 'en attente',
    };

    const { error } = await supabase.from('orders').insert([orderData]);

    setIsLoading(false);

    if (error) {
      toast({ title: "Erreur de commande", description: "Une erreur est survenue. Veuillez réessayer.", variant: "destructive" });
    } else {
      clearCart();
      navigate('/order-confirmation');
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-white">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl font-serif mb-4">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-8">Vous ne pouvez pas procéder au paiement avec un panier vide.</p>
          <Link to="/products">
            <Button className="luxury-button">Continuer vos achats</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background text-white">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-28">
          <h1 className="text-4xl font-serif signature-text text-center mb-12">Finaliser ma commande</h1>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Order Summary */}
            <div className="glass-card p-8 rounded-lg">
              <h2 className="text-2xl font-semibold mb-6">Résumé de la commande</h2>
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <img src={item.thumbnail_url} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">x {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">{item.price * item.quantity} DA</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-glass-border pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{subtotal} DA</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>{shippingCost > 0 ? `${shippingCost} DA` : '...'}</span>
                </div>
                <div className="flex justify-between font-bold text-xl pt-2 border-t border-dashed border-gray-600">
                  <span>Total</span>
                  <span>{total} DA</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="glass-card p-8 rounded-lg">
              <h2 className="text-2xl font-semibold mb-6">Informations de livraison</h2>
              <form onSubmit={handleOrderSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="fullName">Nom complet</Label>
                  <Input id="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Entrez votre nom complet" required className="glass-input mt-2" />
                </div>
                <div>
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <Input id="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="06 XX XX XX XX" required className="glass-input mt-2" />
                </div>
                <div>
                  <Label htmlFor="wilaya">Wilaya</Label>
                  <select
                    id="wilaya"
                    value={selectedWilaya}
                    onChange={(e) => setSelectedWilaya(e.target.value)}
                    required
                    className="glass-input mt-2 w-full h-10 bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="" disabled>
                      Sélectionnez votre wilaya
                    </option>
                      {wilayas.map((wilaya, index) => (
                      <option key={`wilaya-${index}`} value={wilaya}>
                          {index + 1} - {wilaya}
                      </option>
                      ))}
                  </select>
                </div>
                <div>
                  <Label>Type de livraison</Label>
                  <RadioGroup 
                    defaultValue="domicile" 
                    className="mt-2 flex gap-4"
                    onValueChange={(value: "domicile" | "bureau") => setLivraisonType(value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="domicile" id="domicile" />
                      <Label htmlFor="domicile">À domicile</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bureau" id="bureau" />
                      <Label htmlFor="bureau">Bureau</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button type="submit" className="w-full luxury-button" size="lg" disabled={isLoading}>
                  {isLoading ? 'Traitement...' : 'Passer la commande'}
                </Button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-serif signature-text">Félicitations !</AlertDialogTitle>
            <AlertDialogDescription>
              Votre commande a bien été enregistrée. Pour la confirmer, veuillez nous appeler au numéro suivant :
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="text-center text-2xl font-bold text-primary my-4">
            0673 33 13 88
          </div>
          <AlertDialogFooter>
            <Link to="/products" className="w-full">
              <AlertDialogAction className="w-full luxury-button">
                Continuer mes achats
              </AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Checkout; 