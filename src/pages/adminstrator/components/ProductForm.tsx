import { useState, useEffect, ChangeEvent } from 'react';
import { UploadCloud, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  thumbnail_url: string;
  image_urls: string[];
  created_at: string;
}

const productCategories = [
  'Maquillage',
  'Parfum',
  'Soin',
  'Cheveux',
  'Accessoires',
];

interface ProductFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  productToEdit?: Product | null;
  onSuccess: () => void;
}

const ProductForm = ({ isOpen, onOpenChange, productToEdit, onSuccess }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [thumbnailIndex, setThumbnailIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
        if (productToEdit) {
            setFormData({
                name: productToEdit.name,
                price: productToEdit.price.toString(),
                description: productToEdit.description || '',
                category: productToEdit.category || '',
            });
            const allImages = [productToEdit.thumbnail_url, ...(productToEdit.image_urls || [])].filter(Boolean);
            setImagePreviews(allImages);
            setThumbnailIndex(0);
            setImageFiles([]);
        } else {
            resetForm();
        }
    }
  }, [productToEdit, isOpen]);

  const resetForm = () => {
    setFormData({ name: '', price: '', description: '', category: '' });
    setImageFiles([]);
    setImagePreviews([]);
    setThumbnailIndex(0);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (imagePreviews.length + files.length > 5) {
        toast({ title: "Limite d'images atteinte", description: "Vous ne pouvez télécharger que 5 images au maximum.", variant: "destructive" });
        return;
      }
      setImageFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const isPreviewUrl = imagePreviews[index]?.startsWith('blob:');
    
    setImagePreviews(previews => previews.filter((_, i) => i !== index));

    if (isPreviewUrl) {
      const blobIndex = imagePreviews.slice(0, index).filter(p => p.startsWith('blob:')).length;
      setImageFiles(files => files.filter((_, i) => i !== blobIndex));
    }
    
    if (thumbnailIndex === index) {
      setThumbnailIndex(0);
    } else if (thumbnailIndex > index) {
      setThumbnailIndex(thumb => thumb - 1);
    }
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const { data, error } = await supabase.storage.from('product-images').upload(fileName, file);
      if (error) {
        toast({ title: "Erreur d'upload", description: error.message, variant: "destructive" });
        throw error;
      }
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
      return publicUrl;
    });
    return Promise.all(uploadPromises);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const newImageFiles = imageFiles;
      const existingImageUrls = imagePreviews.filter(p => !p.startsWith('blob:'));

      let uploadedUrls: string[] = [];
      if (newImageFiles.length > 0) {
        uploadedUrls = await uploadImages(newImageFiles);
      }

      const allImageUrls = [...existingImageUrls, ...uploadedUrls];

      if (allImageUrls.length === 0) {
        toast({ title: "Aucune image", description: "Veuillez télécharger au moins une image.", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      const thumbnailUrl = allImageUrls[thumbnailIndex];
      const otherImageUrls = allImageUrls.filter((_, i) => i !== thumbnailIndex);

      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        thumbnail_url: thumbnailUrl,
        image_urls: otherImageUrls,
      };

      const { error } = productToEdit
        ? await supabase.from('products').update(productData).eq('id', productToEdit.id)
        : await supabase.from('products').insert([productData]);

      if (error) throw error;

      toast({
        title: productToEdit ? "Produit modifié" : "Produit ajouté",
        description: `Le produit a été ${productToEdit ? 'modifié' : 'ajouté'} avec succès.`
      });
      onSuccess();
      onOpenChange(false);
      
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message || "Une erreur est survenue.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900/80 border-gray-800 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="signature-text text-2xl">{productToEdit ? 'Modifier le Produit' : 'Nouveau Produit'}</DialogTitle>
          <DialogDescription>
            {productToEdit ? 'Modifiez les détails de votre produit.' : 'Remplissez les informations pour ajouter une nouvelle merveille à votre collection.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="space-y-2">
                <Label htmlFor="name">Nom du produit</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="glass-input" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Prix (DA)</Label>
                    <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="glass-input" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        required
                        className="glass-input mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-gray-900/50"
                    >
                        <option value="" disabled>Sélectionner une catégorie</option>
                        {productCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="glass-input" />
            </div>
            <div className="space-y-2">
                <Label>Images (jusqu'à 5)</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group aspect-square">
                            <img src={preview} alt={`Aperçu ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setThumbnailIndex(index)}>
                                    <Star className={`h-4 w-4 ${thumbnailIndex === index ? 'text-yellow-400 fill-yellow-400' : 'text-white'}`} />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeImage(index)}>
                                    <X className="h-4 w-4 text-white" />
                                </Button>
                            </div>
                            {thumbnailIndex === index && (
                                <div className="absolute top-1 right-1 bg-yellow-400 text-black text-xs rounded-full px-1.5 py-0.5">
                                    <Star className="h-3 w-3" />
                                </div>
                            )}
                        </div>
                    ))}
                    {imagePreviews.length < 5 && (
                         <Label htmlFor="file-upload" className="aspect-square flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-600 cursor-pointer hover:border-gray-500 transition-colors">
                            <UploadCloud className="h-8 w-8 text-gray-500" />
                            <span className="mt-1 text-xs text-center text-gray-400">Ajouter</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" multiple />
                        </Label>
                    )}
                </div>
            </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>Annuler</Button>
          <Button onClick={handleSubmit} className="luxury-button" disabled={isLoading}>
            {isLoading ? "Chargement..." : (productToEdit ? "Enregistrer" : "Ajouter")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm; 