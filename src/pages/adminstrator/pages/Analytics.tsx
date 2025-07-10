import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Layers, User, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const COLORS = ['#FFC107', '#FF9800', '#FF5722', '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5'];

const fallbackCategoryData = [
  { name: 'Maquillage', value: 0 },
  { name: 'Parfum', value: 0 },
  { name: 'Soin', value: 0 },
  { name: 'Cheveux', value: 0 },
  { name: 'Non catégorisé', value: 0 }
];

type OrderItem = { name: string; };
type Order = {
  created_at: string;
  full_name: string;
  order_items: OrderItem[];
};

const Analytics = () => {
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [monthlyOrderData, setMonthlyOrderData] = useState<{ name: string, orders: number }[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>(fallbackCategoryData);
  const [recentActivities, setRecentActivities] = useState<{ userName: string, productName: string, date: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [todayDate, setTodayDate] = useState<string>("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        // Fetch today's date from Supabase
        const { data: dateData, error: dateError } = await supabase.from('Date').select('today').limit(1).single();
        if (!dateError && dateData && dateData.today) {
          setTodayDate(dateData.today);
        }
        
        // Fetch products and categories
        const { data: products, error: productsError } = await supabase.from('products').select('name, category');
        if (productsError) throw productsError;
        setTotalProducts(products.length);
        
        const categoryCounts: Record<string, number> = {};
        fallbackCategoryData.forEach(item => { categoryCounts[item.name] = 0; });
        products.forEach(p => {
          const category = p.category || 'Non catégorisé';
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
        const categoryChartData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
        setCategoryData(categoryChartData);
        setTotalCategories(new Set(products.map(p => p.category).filter(Boolean)).size);

        // Fetch orders for total, monthly chart, and recent activity
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('created_at, full_name, order_items')
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;
        setTotalOrders(orders.length);

        // Process monthly order data
        const monthlyCounts: Record<string, number> = {};
        orders.forEach(order => {
          const month = new Date(order.created_at).toLocaleString('default', { month: 'short' });
          monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
        });
        const orderChartData = Object.entries(monthlyCounts).map(([name, orders]) => ({ name, orders })).reverse();
        setMonthlyOrderData(orderChartData);
        
        // Process recent activities
        const recent = orders.slice(0, 5).map(order => ({
          userName: order.full_name,
          productName: order.order_items[0]?.name || 'un produit',
          date: order.created_at
        }));
        setRecentActivities(recent);

      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {todayDate && (
        <div className="flex justify-end">
          <span className="text-sm text-gray-400">Date: {todayDate}</span>
        </div>
      )}
      <div>
        <h1 className="text-3xl font-bold text-white">Market Analytics</h1>
        <p className="text-gray-200">Vue d'ensemble des performances de votre marché.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         {/* Total Products */}
        <Card className="bg-gray-900/80 border-gray-800 bg-sky-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total des Produits</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalProducts}</div>
            <p className="text-xs text-gray-300">Produits en inventaire</p>
          </CardContent>
        </Card>
        
         {/* Total Categories */}
        <Card className="bg-gray-900/80 border-gray-800 bg-emerald-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total des Catégories</CardTitle>
            <Layers className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalCategories}</div>
            <p className="text-xs text-gray-300">Catégories de produits</p>
          </CardContent>
        </Card>
        
         {/* Total Orders */}
        <Card className="bg-gray-900/80 border-gray-800 bg-rose-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total des Commandes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalOrders}</div>
            <p className="text-xs text-gray-300">Commandes finalisées</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Orders Chart */}
        <Card className="lg:col-span-2 bg-gray-900/80 border-gray-800 p-4">
          <CardTitle className="text-lg font-semibold mb-4 text-white">Commandes Mensuelles</CardTitle>
          <CardContent className="h-[350px] p-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyOrderData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="name" stroke="#fff" fontSize={12} />
                <YAxis stroke="#fff" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 30, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.2)' }} />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#FFC107" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-1 bg-gray-900/80 border-gray-800 p-4">
          <CardTitle className="text-lg font-semibold mb-4 text-white">Activité Récente</CardTitle>
          <CardContent className="pr-2 h-[350px] overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
                {recentActivities.length > 0 ? (
                    recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                            {activity.userName.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">{activity.userName}</p>
                            <p className="text-xs text-gray-400">a commandé <span className="font-semibold text-primary">{activity.productName}</span></p>
                        </div>
                    </div>
                    ))
                ) : (
                    <div className="text-center py-8 h-full flex flex-col justify-center items-center">
                        <Zap className="mx-auto h-8 w-8 text-gray-600" />
                        <p className="mt-2 text-sm text-gray-400">Aucune activité récente.</p>
                    </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Category Distribution Chart */}
      <Card className="bg-gray-900/80 border-gray-800 p-4">
        <CardTitle className="text-lg font-semibold mb-4 text-white">Distribution par Catégorie</CardTitle>
        <CardContent className="h-[400px] p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-full"><p className="text-gray-300">Chargement...</p></div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" labelLine={true} outerRadius={150} fill="#8884d8" dataKey="value" nameKey="name" label={(entry) => entry.name}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} produits`, name]} contentStyle={{ backgroundColor: 'rgba(30, 30, 30, 0.8)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics; 