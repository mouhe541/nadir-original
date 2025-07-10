import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import Analytics from './pages/Analytics';
import Products from './pages/Products';
import OrdersPage from './pages/Orders';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MobileTabBar from './components/MobileTabBar';
import Sidebar from './components/Sidebar';

const Dashboard = () => {
  const isMobile = useIsMobile();
  const location = useLocation();

  const getTitle = () => {
    switch (true) {
      case location.pathname.startsWith('/admin/products'): return 'Gestion des Produits';
      case location.pathname.startsWith('/admin/analytics'): return 'Analyses';
      case location.pathname.startsWith('/admin/orders'): return 'Gestion des Commandes';
      case location.pathname.startsWith('/admin/settings'): return 'Paramètres';
      default: return 'Tableau de bord';
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {!isMobile && <Sidebar />}

      <main className={cn("flex-1", !isMobile && "md:ml-64")}>
        <header className="sticky top-0 z-10 flex h-[60px] items-center justify-between border-b border-gray-800 bg-black/50 px-6 backdrop-blur-md">
          <h1 className="text-xl font-semibold md:hidden">{getTitle()}</h1>
          <div className="hidden md:flex items-center">
            <h1 className="text-2xl font-serif signature-text">{getTitle()}</h1>
            <p className="text-muted-foreground ml-2">Guide et présentation de votre espace administrateur.</p>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="analytics" replace />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<OrdersPage />} />
            {/* Add route for settings later */}
          </Routes>
          </div>
      </main>

      {isMobile && <MobileTabBar />}
    </div>
  );
};

export default Dashboard;