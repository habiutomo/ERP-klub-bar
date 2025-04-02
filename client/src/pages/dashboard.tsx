import { useQuery } from '@tanstack/react-query';
import StatsCard from '@/components/dashboard/stats-card';
import SalesChart from '@/components/dashboard/sales-chart';
import PopularItems from '@/components/dashboard/popular-items';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import UpcomingEvents from '@/components/dashboard/upcoming-events';

interface DashboardStats {
  dailySales: number;
  customersToday: number;
  lowStockCount: number;
}

const Dashboard = () => {
  const { data: dashboardStats, isLoading: isLoadingStats } = useQuery<DashboardStats>({ 
    queryKey: ['/api/dashboard/stats'] 
  });
  
  return (
    <div className="h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to NightlifePro management system</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/40 via-purple-900/20 to-black rounded-xl border border-purple-900/30 shadow-lg shadow-purple-900/10 p-6 group transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/20 hover:border-purple-800/40">
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-gradient-to-br from-purple-600/10 to-purple-900/5 rounded-full blur-2xl transform group-hover:scale-110 transition-all duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-400 text-sm font-medium">Today's Sales</div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/30 to-purple-900/30 backdrop-blur-md flex items-center justify-center shadow-lg shadow-purple-900/10 border border-purple-700/20">
                <i className="ri-money-dollar-circle-line text-2xl text-purple-300"></i>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-white mb-1 flex items-baseline">
                {isLoadingStats || dashboardStats?.dailySales === null ? '—' : `$${dashboardStats?.dailySales?.toFixed(2) || '0.00'}`}
              </div>
              <div className="flex items-center text-sm font-medium text-green-400">
                <i className="ri-arrow-up-line mr-1"></i> 
                <span>12.5% from yesterday</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative overflow-hidden bg-gradient-to-br from-pink-900/40 via-pink-900/20 to-black rounded-xl border border-pink-900/30 shadow-lg shadow-pink-900/10 p-6 group transition-all duration-300 hover:shadow-xl hover:shadow-pink-900/20 hover:border-pink-800/40">
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-gradient-to-br from-pink-600/10 to-pink-900/5 rounded-full blur-2xl transform group-hover:scale-110 transition-all duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-400 text-sm font-medium">Customers Today</div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-600/30 to-pink-900/30 backdrop-blur-md flex items-center justify-center shadow-lg shadow-pink-900/10 border border-pink-700/20">
                <i className="ri-group-line text-2xl text-pink-300"></i>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-white mb-1 flex items-baseline">
                {isLoadingStats || dashboardStats?.customersToday === null ? '—' : dashboardStats?.customersToday?.toString() || '0'}
              </div>
              <div className="flex items-center text-sm font-medium text-red-400">
                <i className="ri-arrow-down-line mr-1"></i> 
                <span>5.3% from yesterday</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900/40 via-indigo-900/20 to-black rounded-xl border border-indigo-900/30 shadow-lg shadow-indigo-900/10 p-6 group transition-all duration-300 hover:shadow-xl hover:shadow-indigo-900/20 hover:border-indigo-800/40">
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-gradient-to-br from-indigo-600/10 to-indigo-900/5 rounded-full blur-2xl transform group-hover:scale-110 transition-all duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-400 text-sm font-medium">Low Stock Items</div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600/30 to-indigo-900/30 backdrop-blur-md flex items-center justify-center shadow-lg shadow-indigo-900/10 border border-indigo-700/20">
                <i className="ri-alarm-warning-line text-2xl text-indigo-300"></i>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-white mb-1 flex items-baseline">
                {isLoadingStats || dashboardStats?.lowStockCount === null ? '—' : dashboardStats?.lowStockCount?.toString() || '0'}
                <span className="text-xs text-gray-500 ml-2 font-normal">items</span>
              </div>
              <div className="flex items-center text-sm font-medium text-indigo-400">
                <i className="ri-alert-line mr-1"></i> 
                <span>Need attention</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-black/80 rounded-xl border border-zinc-800 shadow-lg shadow-purple-900/5 p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center">
            <i className="ri-line-chart-line mr-2 text-purple-400"></i>
            Sales Performance
          </h2>
          <SalesChart />
        </div>
        <div className="bg-black/80 rounded-xl border border-zinc-800 shadow-lg shadow-purple-900/5 p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center">
            <i className="ri-fire-line mr-2 text-pink-400"></i>
            Popular Items
          </h2>
          <PopularItems />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-black/80 rounded-xl border border-zinc-800 shadow-lg shadow-purple-900/5 p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center">
            <i className="ri-exchange-funds-line mr-2 text-indigo-400"></i>
            Recent Transactions
          </h2>
          <RecentTransactions />
        </div>
        <div className="bg-black/80 rounded-xl border border-zinc-800 shadow-lg shadow-purple-900/5 p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center">
            <i className="ri-calendar-event-line mr-2 text-cyan-400"></i>
            Upcoming Events
          </h2>
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
