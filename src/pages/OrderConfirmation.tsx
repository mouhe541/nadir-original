import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle } from "lucide-react";

const OrderConfirmation = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-white">
      <Header />
      <main className="flex-1 container mx-auto flex flex-col items-center justify-center px-4 pt-28">
        <div className="text-center glass-card p-12 max-w-2xl mx-auto rounded-lg mt-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
          <h1 className="text-4xl font-serif signature-text mb-4">Merci pour votre commande !</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Votre commande a été reçue et est en cours de traitement.
            Un agent vous contactera bientôt pour la confirmation.
          </p>
          <div className="bg-gray-900/50 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-xl mb-4">Prochaines étapes</h2>
            <p className="text-muted-foreground mb-2">
              Attendez un appel de notre part au numéro que vous avez fourni pour confirmer les détails de la commande.
            </p>
            <p className="font-bold text-primary text-lg">
              Le délai de livraison estimé est de 2 à 5 jours ouvrables.
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Pour toute question, n'hésitez pas à nous appeler :</p>
            <p className="text-2xl font-bold text-white tracking-wider">0673 33 13 88</p>
          </div>
          <div className="mt-12">
            <Link to="/products">
              <Button className="luxury-button" size="lg">
                Continuer mes achats
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation; 