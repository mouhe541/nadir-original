import { NavLink } from 'react-router-dom';
import { BarChart2, ShoppingBag, ShoppingCart, Home } from 'lucide-react';

const navItems = [
  { to: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/admin/products', icon: ShoppingBag, label: 'Products' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/', icon: Home, label: 'Accueil' },
];

const MobileTabBar = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-black border-t border-gray-800 px-2 py-1 z-50">
      <nav className="flex justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-3 rounded-md ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default MobileTabBar; 