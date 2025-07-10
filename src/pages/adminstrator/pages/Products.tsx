import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import ProductForm from '../components/ProductForm';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  thumbnail_url: string;
  image_urls: string[];
  category: string;
  created_at: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = searchTerm
      ? products.filter(p =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : products;
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setIsLoading(false);
    
    if (error) {
      toast({ title: "Erreur", description: "Impossible de charger les produits.", variant: "destructive" });
    } else if (data) {
      setProducts(data as Product[]);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    setIsLoading(true);
    const { error } = await supabase.from('products').delete().eq('id', selectedProduct.id);
    setIsLoading(false);
    
    if (error) {
      toast({ title: "Erreur", description: "Impossible de supprimer le produit.", variant: "destructive" });
    } else {
      await fetchProducts();
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès."
      });
    }
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const openAddDialog = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestion des Produits</h1>
          <p className="text-gray-200">Ajoutez, modifiez et supprimez vos produits.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-300" />
            <Input
              placeholder="Rechercher un produit..."
              className="pl-8 bg-gray-900 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="luxury-button" onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un Produit
          </Button>
        </div>
      </div>

      <Card className="bg-gray-900/80 border-gray-800">
        <CardHeader><CardTitle className="text-white">Liste des Produits</CardTitle></CardHeader>
        <CardContent>
          {isLoading && products.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <p className="text-gray-300">Chargement des produits...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="overflow-x-auto hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-200">Produit</TableHead>
                      <TableHead className="text-gray-200">Catégorie</TableHead>
                      <TableHead className="text-gray-200">Prix</TableHead>
                      <TableHead className="text-gray-200">Date d'ajout</TableHead>
                      <TableHead className="text-right text-gray-200">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium text-white">
                          <div className="flex items-center gap-3">
                            <img 
                              src={product.thumbnail_url || 'https://via.placeholder.com/40'} 
                              alt={product.name} 
                              className="h-10 w-10 rounded-md object-cover" 
                            />
                            <div>{product.name}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-200">{product.category || '-'}</TableCell>
                        <TableCell className="text-gray-200">{product.price} DA</TableCell>
                        <TableCell className="text-gray-200">{new Date(product.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}>
                            <Edit className="h-4 w-4 text-gray-200" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(product)}>
                            <Trash2 className="h-4 w-4 text-gray-200" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex gap-4">
                    <img 
                      src={product.thumbnail_url || 'https://via.placeholder.com/64'} 
                      alt={product.name} 
                      className="h-20 w-20 rounded-md object-cover" 
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-white">{product.name}</h3>
                        <div className="flex">
                           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(product)}>
                              <Edit className="h-4 w-4 text-gray-200" />
                           </Button>
                           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDeleteDialog(product)}>
                              <Trash2 className="h-4 w-4 text-gray-200" />
                           </Button>
                        </div>
                      </div>
                      <p className="text-sm text-primary font-semibold">{product.price} DA</p>
                      <p className="text-xs text-gray-400">
                        <span className="font-medium">Catégorie:</span> {product.category || '-'}
                      </p>
                       <p className="text-xs text-gray-400">
                        <span className="font-medium">Ajouté le:</span> {new Date(product.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">Aucun produit trouvé.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <ProductForm 
        isOpen={isFormOpen} 
        onOpenChange={setIsFormOpen}
        productToEdit={selectedProduct}
        onSuccess={fetchProducts}
      />
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible et supprimera définitivement le produit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Products; 