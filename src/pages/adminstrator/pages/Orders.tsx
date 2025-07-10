import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Eye, Package, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  thumbnail_url: string;
};

type Order = {
  id: number;
  created_at: string;
  full_name: string;
  phone_number: string;
  wilaya: string;
  shipping_type: string;
  shipping_cost: number;
  order_total: number;
  order_items: OrderItem[];
  status: 'en attente' | 'livrée' | 'annulée';
};

const statusConfig = {
  'en attente': { icon: Clock, color: 'bg-yellow-500', label: 'En attente' },
  'livrée': { icon: CheckCircle, color: 'bg-green-500', label: 'Livrée' },
  'annulée': { icon: XCircle, color: 'bg-red-500', label: 'Annulée' },
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({ title: "Erreur", description: "Impossible de charger les commandes.", variant: "destructive" });
      } else {
        setOrders(data);
      }
      setIsLoading(false);
    };
    fetchOrders();
  }, [toast]);

  const handleStatusChange = async (orderId: number, newStatus: Order['status']) => {
    const originalOrders = [...orders];
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      // Revert on error
      setOrders(originalOrders);
      toast({ title: "Erreur", description: "Impossible de mettre à jour le statut.", variant: "destructive" });
    } else {
      toast({ title: "Succès", description: "Statut de la commande mis à jour." });
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Chargement des commandes...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Gestion des Commandes</h1>
      
      {/* Desktop Table View */}
      <div className="glass-card rounded-lg overflow-hidden hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Wilaya</TableHead>
              <TableHead className="text-center">Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="font-medium">{order.full_name}</div>
                  <div className="text-sm text-muted-foreground">{order.phone_number}</div>
                </TableCell>
                <TableCell>{order.order_total} DA</TableCell>
                <TableCell>{order.wilaya}</TableCell>
                <TableCell className="text-center">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                    className={cn("text-white text-sm rounded-md px-2 py-1 border-0 focus:ring-2 focus:ring-primary", statusConfig[order.status]?.color)}
                  >
                      {Object.entries(statusConfig).map(([status, { label }]) => (
                      <option key={status} value={status} className="bg-gray-800 text-white">{label}</option>
                      ))}
                  </select>
                </TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <OrderDetailsDialog order={order} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {orders.map(order => (
          <div key={order.id} className="glass-card p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-white">{order.full_name}</p>
                <p className="text-sm text-gray-400">{order.phone_number}</p>
              </div>
              <OrderDetailsDialog order={order} />
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Wilaya</span>
              <span className="text-white">{order.wilaya}</span>
            </div>
             <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Total</span>
              <span className="font-bold text-primary">{order.order_total} DA</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Date</span>
              <span className="text-white">{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-700">
               <span className="text-sm text-gray-400">Statut</span>
               <select 
                  value={order.status} 
                  onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                  className={cn("text-white text-sm rounded-md px-2 py-1 border-0 focus:ring-2 focus:ring-primary", statusConfig[order.status]?.color)}
                >
                  {Object.entries(statusConfig).map(([status, { label }]) => (
                    <option key={status} value={status} className="bg-gray-800 text-white">{label}</option>
                  ))}
                </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderDetailsDialog = ({ order }: { order: Order }) => {
  const { icon: StatusIcon, color } = statusConfig[order.status];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl glass-card text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            Détails de la Commande #{order.id}
            <Badge className={cn("text-sm", color)}>
              <StatusIcon className="h-4 w-4 mr-2" />
              {order.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-6 py-4">
          <div>
            <h3 className="font-semibold mb-4 border-b pb-2">Informations Client</h3>
            <p><strong>Nom:</strong> {order.full_name}</p>
            <p><strong>Téléphone:</strong> {order.phone_number}</p>
            <p><strong>Wilaya:</strong> {order.wilaya}</p>
            <p><strong>Type de livraison:</strong> {order.shipping_type}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 border-b pb-2">Détails Financiers</h3>
            <p><strong>Coût de livraison:</strong> {order.shipping_cost} DA</p>
            <p><strong>Total de la commande:</strong> <span className="font-bold text-primary">{order.order_total} DA</span></p>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4 border-b pb-2">Articles Commandés</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {order.order_items.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-2 rounded-md bg-gray-900/50">
                  <img src={item.thumbnail_url} alt={item.name} className="w-16 h-16 object-cover rounded"/>
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.quantity} x {item.price} DA</p>
                  </div>
                  <p className="font-bold">{item.quantity * item.price} DA</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrdersPage; 