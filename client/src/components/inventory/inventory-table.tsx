import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  minLevel: number;
  price: number;
  status: string;
  unitType: string;
}

const InventoryTable = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { data: inventoryItems, isLoading } = useQuery<InventoryItem[]>({ 
    queryKey: ['/api/inventory/items'] 
  });
  
  const deleteItemMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/inventory/items/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory/items'] });
      toast({
        title: 'Item deleted',
        description: 'The inventory item has been deleted successfully.'
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete the inventory item.',
        variant: 'destructive'
      });
    }
  });

  const handleUpdateStock = async (id: number, action: 'add' | 'edit') => {
    // This would open a modal to add stock or edit the item
    // For now just showing a toast
    toast({
      title: `${action === 'add' ? 'Restock' : 'Edit'} item`,
      description: `This would open a modal to ${action === 'add' ? 'restock' : 'edit'} the item.`
    });
  };
  
  const handleDeleteItem = (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteItemMutation.mutate(id);
    }
  };
  
  // Filter the inventory items based on search query and category
  const filteredItems = inventoryItems?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="animate-pulse p-4 border-b border-light-200">
          <div className="h-8 bg-light-200 rounded w-48 mb-4"></div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="h-10 bg-light-200 rounded w-full sm:w-64"></div>
            <div className="h-10 bg-light-200 rounded w-full sm:w-48"></div>
            <div className="h-10 bg-light-200 rounded w-full sm:w-48"></div>
          </div>
        </div>
        <div className="p-4">
          <div className="h-64 bg-light-200 rounded w-full"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-light-200">
        <h2 className="text-lg font-semibold text-dark-900 mb-4 md:mb-0">Inventory Items</h2>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..." 
              className="w-full pl-10 pr-4 py-2 border border-light-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <i className="ri-search-line absolute left-3 top-2.5 text-light-400"></i>
          </div>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-4 pr-8 py-2 border border-light-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary appearance-none bg-right bg-no-repeat"
            style={{backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,<svg width="12" height="7" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l5 5 5-5" stroke="%23333" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>')`, backgroundPosition: 'right 10px center'}}
          >
            <option value="all">All Categories</option>
            <option value="spirits">Spirits</option>
            <option value="beer">Beer</option>
            <option value="wine">Wine</option>
            <option value="supplies">Supplies</option>
          </select>
          <button className="flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md font-medium">
            <i className="ri-add-line mr-1"></i>
            <span>Add Item</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-light-100 text-left text-xs text-dark-700 uppercase tracking-wider">
              <th className="px-6 py-3">Item</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Unit Price</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-200">
            {filteredItems?.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-light-400">
                  No items match your search criteria
                </td>
              </tr>
            ) : (
              filteredItems?.map((item) => (
                <tr key={item.id} className="hover:bg-light-100 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-dark-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="capitalize">{item.category}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono">{item.stock}</div>
                    <div className="text-xs text-light-400">Min: {item.minLevel}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono">${item.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className={`px-2 py-1 text-xs rounded-full capitalize ${
                        item.status === 'normal' 
                          ? 'bg-success bg-opacity-10 text-success' 
                          : item.status === 'low' 
                            ? 'bg-warning bg-opacity-10 text-warning'
                            : 'bg-error bg-opacity-10 text-error'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleUpdateStock(item.id, 'edit')} 
                        className="p-1 text-primary hover:bg-light-100 rounded"
                        title="Edit item"
                      >
                        <i className="ri-pencil-line"></i>
                      </button>
                      <button 
                        onClick={() => handleUpdateStock(item.id, 'add')} 
                        className="p-1 text-primary hover:bg-light-100 rounded"
                        title="Add stock"
                      >
                        <i className="ri-add-circle-line"></i>
                      </button>
                      <button 
                        onClick={() => handleDeleteItem(item.id)} 
                        className="p-1 text-error hover:bg-light-100 rounded"
                        title="Delete item"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
