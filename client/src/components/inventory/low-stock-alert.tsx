import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  minLevel: number;
  status: string;
}

const LowStockAlert = () => {
  const { toast } = useToast();
  
  const { data: lowStockItems, isLoading } = useQuery<InventoryItem[]>({ 
    queryKey: ['/api/inventory/low-stock'] 
  });
  
  const handleRestock = (id: number, name: string) => {
    // This would open a restock modal or form
    // For now just showing a toast
    toast({
      title: 'Restock Item',
      description: `This would open a form to restock ${name}.`
    });
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="flex justify-between items-center p-4 border-b border-light-200">
            <div className="h-6 bg-light-200 rounded w-40"></div>
            <div className="h-5 bg-light-200 rounded w-32"></div>
          </div>
          <div className="space-y-4 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <div className="h-5 bg-light-200 rounded w-32 mb-1"></div>
                  <div className="h-4 bg-light-200 rounded w-24"></div>
                </div>
                <div className="text-right">
                  <div className="h-5 bg-light-200 rounded w-16 mb-1"></div>
                  <div className="h-4 bg-light-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // If there are no low stock items
  if (!lowStockItems || lowStockItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-4 border-b border-light-200">
          <h2 className="text-lg font-semibold text-dark-900">Low Stock Alert</h2>
          <button className="text-primary text-sm hover:underline">Order Supplies</button>
        </div>
        <div className="p-8 text-center text-light-400">
          <i className="ri-check-line text-success text-2xl mb-2 block"></i>
          <p>All inventory items have sufficient stock.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex justify-between items-center p-4 border-b border-light-200">
        <h2 className="text-lg font-semibold text-dark-900">Low Stock Alert</h2>
        <button className="text-primary text-sm hover:underline">Order Supplies</button>
      </div>
      <ul className="divide-y divide-light-200">
        {lowStockItems.map((item) => (
          <li key={item.id} className="flex items-center justify-between px-6 py-4 hover:bg-light-100 transition-colors">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-light-400">{item.category}</p>
            </div>
            <div className="text-right">
              <p className={`font-mono font-medium ${
                item.stock <= item.minLevel / 2 ? 'text-error' : 'text-warning'
              }`}>
                {item.stock} / {item.minLevel}
              </p>
              <button 
                onClick={() => handleRestock(item.id, item.name)} 
                className="mt-1 text-xs text-primary hover:underline"
              >
                Restock
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LowStockAlert;
