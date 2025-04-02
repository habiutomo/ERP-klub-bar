import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

interface InventoryActivity {
  id: number;
  itemId: number;
  action: string;
  quantity?: number;
  notes?: string;
  performedBy: number;
  timestamp: string;
  staffName: string;
  itemName: string;
}

const InventoryActivity = () => {
  const { data: activities, isLoading } = useQuery<InventoryActivity[]>({ 
    queryKey: ['/api/inventory/activities'] 
  });
  
  // Helper function to get icon and color based on action type
  const getActionDisplay = (action: string) => {
    switch (action) {
      case 'restock':
        return { icon: 'ri-add-line', color: 'success' };
      case 'remove':
        return { icon: 'ri-subtract-line', color: 'error' };
      case 'update_price':
        return { icon: 'ri-edit-line', color: 'primary' };
      case 'low_stock_alert':
        return { icon: 'ri-alert-line', color: 'warning' };
      default:
        return { icon: 'ri-information-line', color: 'primary' };
    }
  };
  
  const formatActivityTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${format(date, 'h:mm a')}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };
  
  const formatActivityTitle = (activity: InventoryActivity) => {
    switch (activity.action) {
      case 'restock':
        return `Restocked ${activity.itemName}`;
      case 'remove':
        return `Removed ${activity.itemName}`;
      case 'update_price':
        return `Updated ${activity.itemName} Price`;
      case 'low_stock_alert':
        return 'Low Stock Alert';
      default:
        return `Modified ${activity.itemName}`;
    }
  };
  
  const formatActivityDetail = (activity: InventoryActivity) => {
    switch (activity.action) {
      case 'restock':
      case 'remove':
        return activity.quantity ? `${activity.action === 'restock' ? '+' : '-'}${activity.quantity} units` : '';
      default:
        return activity.notes || '';
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="flex justify-between items-center p-4 border-b border-light-200">
            <div className="h-6 bg-light-200 rounded w-40"></div>
            <div className="h-5 bg-light-200 rounded w-20"></div>
          </div>
          <div className="space-y-4 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="rounded-full bg-light-200 h-10 w-10 mr-3"></div>
                  <div>
                    <div className="h-5 bg-light-200 rounded w-40 mb-1"></div>
                    <div className="h-4 bg-light-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="h-4 bg-light-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex justify-between items-center p-4 border-b border-light-200">
        <h2 className="text-lg font-semibold text-dark-900">Recent Activity</h2>
        <button className="text-primary text-sm hover:underline">View All</button>
      </div>
      <ul className="divide-y divide-light-200">
        {activities?.map((activity) => {
          const { icon, color } = getActionDisplay(activity.action);
          
          return (
            <li key={activity.id} className="px-6 py-4 hover:bg-light-100 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`rounded-full bg-${color} bg-opacity-10 p-2 mr-3`}>
                    <i className={`${icon} text-${color}`}></i>
                  </div>
                  <div>
                    <p className="font-medium">{formatActivityTitle(activity)}</p>
                    <p className="text-xs text-light-400">{formatActivityDetail(activity)}</p>
                  </div>
                </div>
                <p className="text-xs text-light-400">{formatActivityTime(activity.timestamp)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default InventoryActivity;
