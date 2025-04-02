import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/layout/page-header';
import InventoryTable from '@/components/inventory/inventory-table';
import LowStockAlert from '@/components/inventory/low-stock-alert';
import InventoryActivity from '@/components/inventory/inventory-activity';

interface InventoryStats {
  totalItems: number;
  lowStockCount: number;
  inventoryValue: number;
}

const Inventory = () => {
  // For these stats, we could calculate from the inventory items data
  // But in a real app, we'd likely have an API endpoint for aggregate stats
  const { data: inventoryItems } = useQuery<any[]>({ 
    queryKey: ['/api/inventory/items'] 
  });
  
  // Calculate inventory stats
  const inventoryStats: InventoryStats = {
    totalItems: inventoryItems?.length || 0,
    lowStockCount: inventoryItems?.filter(item => item.status === 'low').length || 0,
    inventoryValue: inventoryItems?.reduce((sum, item) => sum + (item.price * item.stock), 0) || 0
  };
  
  return (
    <div className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-primary bg-opacity-10 p-3 mr-4">
            <i className="ri-store-2-line text-xl text-primary"></i>
          </div>
          <div>
            <p className="text-dark-900 font-medium text-sm">Total Items</p>
            <p className="text-dark-900 text-2xl font-mono font-semibold">{inventoryStats.totalItems}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-warning bg-opacity-10 p-3 mr-4">
            <i className="ri-alarm-warning-line text-xl text-warning"></i>
          </div>
          <div>
            <p className="text-dark-900 font-medium text-sm">Low Stock Items</p>
            <p className="text-dark-900 text-2xl font-mono font-semibold">{inventoryStats.lowStockCount}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center col-span-1 md:col-span-2">
          <div className="rounded-full bg-secondary bg-opacity-10 p-3 mr-4">
            <i className="ri-money-dollar-circle-line text-xl text-secondary"></i>
          </div>
          <div className="flex-1">
            <p className="text-dark-900 font-medium text-sm">Inventory Value</p>
            <p className="text-dark-900 text-2xl font-mono font-semibold">${inventoryStats.inventoryValue.toFixed(2)}</p>
          </div>
          <button className="text-primary text-sm hover:underline">Details</button>
        </div>
      </div>

      <InventoryTable />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LowStockAlert />
        <InventoryActivity />
      </div>
    </div>
  );
};

export default Inventory;
