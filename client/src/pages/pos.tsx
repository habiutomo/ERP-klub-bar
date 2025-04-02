import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MenuItem from '@/components/pos/menu-item';
import OrderPanel from '@/components/pos/order-panel';

interface MenuItemType {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
  isActive: boolean;
}

interface OrderItem {
  id: number;
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
}

const POS = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  
  const { data: menuItems, isLoading } = useQuery<MenuItemType[]>({ 
    queryKey: ['/api/menu/items'] 
  });
  
  const filterMenuItems = (items: MenuItemType[] | undefined) => {
    if (!items) return [];
    
    return items.filter(item => {
      const matchesCategory = activeTab === 'all' || item.category.toLowerCase() === activeTab.toLowerCase();
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch && item.isActive;
    });
  };
  
  const handleAddToOrder = (menuItemId: number, name: string, price: number) => {
    const existingItem = orderItems.find(item => item.menuItemId === menuItemId);
    
    if (existingItem) {
      handleUpdateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      // Generate a unique ID for the order item
      const orderItemId = Math.max(0, ...orderItems.map(i => i.id)) + 1;
      
      setOrderItems(prev => [...prev, {
        id: orderItemId,
        menuItemId,
        name,
        price,
        quantity: 1
      }]);
    }
  };
  
  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
    } else {
      setOrderItems(prev => 
        prev.map(item => item.id === id ? { ...item, quantity } : item)
      );
    }
  };
  
  const handleRemoveItem = (id: number) => {
    setOrderItems(prev => prev.filter(item => item.id !== id));
  };
  
  const handleClearOrder = () => {
    setOrderItems([]);
  };
  
  const filteredItems = filterMenuItems(menuItems);
  
  return (
    <div className="h-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Menu Section */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow h-full flex flex-col">
          <div className="border-b border-light-200 p-4">
            <div className="flex space-x-2 mb-4 overflow-x-auto">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-md text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'all' ? 'bg-primary text-white' : 'bg-light-100 text-dark-900'
                }`}
              >
                All Items
              </button>
              <button 
                onClick={() => setActiveTab('cocktails')}
                className={`px-4 py-2 rounded-md text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'cocktails' ? 'bg-primary text-white' : 'bg-light-100 text-dark-900'
                }`}
              >
                Cocktails
              </button>
              <button 
                onClick={() => setActiveTab('beer')}
                className={`px-4 py-2 rounded-md text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'beer' ? 'bg-primary text-white' : 'bg-light-100 text-dark-900'
                }`}
              >
                Beer
              </button>
              <button 
                onClick={() => setActiveTab('wine')}
                className={`px-4 py-2 rounded-md text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'wine' ? 'bg-primary text-white' : 'bg-light-100 text-dark-900'
                }`}
              >
                Wine
              </button>
              <button 
                onClick={() => setActiveTab('spirits')}
                className={`px-4 py-2 rounded-md text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'spirits' ? 'bg-primary text-white' : 'bg-light-100 text-dark-900'
                }`}
              >
                Spirits
              </button>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search menu items..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-light-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <i className="ri-search-line absolute left-3 top-2.5 text-light-400"></i>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-light-100 rounded-lg p-4 h-32 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-light-200 rounded-full mb-2"></div>
                    <div className="h-4 bg-light-200 rounded w-20 mb-1"></div>
                    <div className="h-4 bg-light-200 rounded w-10"></div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-8 text-light-400">
                <i className="ri-search-line text-2xl mb-2"></i>
                <p>No menu items found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredItems.map(item => (
                  <MenuItem 
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    category={item.category}
                    onAddToOrder={handleAddToOrder}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Order Panel */}
        <OrderPanel 
          items={orderItems}
          onAddItem={(item) => setOrderItems(prev => [...prev, item])}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearOrder={handleClearOrder}
        />
      </div>
    </div>
  );
};

export default POS;
