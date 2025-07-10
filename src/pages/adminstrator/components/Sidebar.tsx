import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BarChart, ShoppingCart, Package, Home } from 'lucide-react';

const sidebarNavItems = [
  {
    title: 'Analyses',
    href: '/admin/analytics',
    icon: BarChart,
  },
  {
    title: 'Commandes',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Produits',
    href: '/admin/products',
    icon: Package,
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 bg-gray-900 border-r border-gray-800">
      <div className="flex flex-col h-full">
        <div>
          <div className="px-6 py-6" onClick={() => navigate('/admin')} style={{ cursor: 'pointer' }}>
            <h2 className="text-2xl font-serif signature-text">Nadir Original</h2>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {sidebarNavItems.map((item) => (
              <Button
                key={item.href}
                variant={location.pathname.startsWith(item.href) ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  location.pathname.startsWith(item.href) ? "bg-gray-800" : ""
                )}
                onClick={() => navigate(item.href)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.title}
              </Button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate('/')}
          >
            <Home className="h-5 w-5 mr-3" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 