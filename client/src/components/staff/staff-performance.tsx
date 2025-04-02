import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface TopPerformer {
  id: number;
  name: string;
  role: string;
  salesAmount: number;
  customerRating: number;
  incidents: number;
}

const StaffPerformance = () => {
  const [metricType, setMetricType] = useState<'weekly' | 'monthly' | 'sales' | 'tips' | 'ratings'>('weekly');
  
  const { data: topPerformers, isLoading: isLoadingTopPerformers } = useQuery<TopPerformer[]>({ 
    queryKey: ['/api/staff/performance/top'] 
  });
  
  // In a real implementation, different metrics would be fetched based on the selected type
  // For now, we're using the same data for all metrics
  const renderPerformanceChart = () => {
    // Determine max value for scaling bars
    const performanceData = topPerformers || [];
    let maxValue = 0;
    
    // Determine what metric to display
    switch (metricType) {
      case 'sales':
      case 'weekly':
      case 'monthly':
        maxValue = Math.max(...performanceData.map(p => p.salesAmount), 1);
        break;
      case 'ratings':
        maxValue = 5; // Ratings are out of 5
        break;
      case 'tips':
        maxValue = Math.max(...performanceData.map(p => p.salesAmount * 0.15), 1); // Using sales * 15% as a proxy for tips
        break;
    }
    
    return (
      <div className="h-64 flex items-end space-x-3 border-b border-l border-light-300 pb-6">
        {performanceData.map((performer) => {
          let value = 0;
          switch (metricType) {
            case 'sales':
            case 'weekly':
            case 'monthly':
              value = performer.salesAmount;
              break;
            case 'ratings':
              value = performer.customerRating;
              break;
            case 'tips':
              value = performer.salesAmount * 0.15; // Using sales * 15% as a proxy for tips
              break;
          }
          
          // Calculate height percentage based on max value
          const heightPercentage = (value / maxValue) * 100;
          
          return (
            <div key={performer.id} className="flex-1 flex flex-col justify-end items-center">
              <div 
                className="w-full bg-primary rounded-t" 
                style={{ height: `${heightPercentage}%` }}
              ></div>
              <span className="text-xs mt-1 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                {performer.name.split(' ')[0]} {performer.name.split(' ')[1]?.[0]}.
              </span>
            </div>
          );
        })}
      </div>
    );
  };
  
  if (isLoadingTopPerformers) {
    return (
      <div className="bg-white rounded-lg shadow lg:col-span-2 animate-pulse">
        <div className="p-4 border-b border-light-200">
          <div className="h-7 bg-light-200 rounded w-48"></div>
        </div>
        <div className="p-6">
          <div className="h-64 bg-light-200 rounded mb-4"></div>
          <div className="flex justify-end space-x-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-light-200 rounded w-20"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow lg:col-span-2">
      <div className="p-4 border-b border-light-200">
        <h2 className="text-lg font-semibold text-dark-900">Staff Performance</h2>
      </div>
      <div className="p-6">
        {renderPerformanceChart()}
        
        <div className="mt-4">
          <div className="flex space-x-2 justify-end">
            <button 
              onClick={() => setMetricType('weekly')}
              className={`px-3 py-1 text-sm ${metricType === 'weekly' ? 'bg-primary text-white' : 'text-dark-900 hover:bg-light-200'} rounded`}
            >
              Weekly
            </button>
            <button 
              onClick={() => setMetricType('monthly')}
              className={`px-3 py-1 text-sm ${metricType === 'monthly' ? 'bg-primary text-white' : 'text-dark-900 hover:bg-light-200'} rounded`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setMetricType('sales')}
              className={`px-3 py-1 text-sm ${metricType === 'sales' ? 'bg-primary text-white' : 'text-dark-900 hover:bg-light-200'} rounded`}
            >
              Sales
            </button>
            <button 
              onClick={() => setMetricType('tips')}
              className={`px-3 py-1 text-sm ${metricType === 'tips' ? 'bg-primary text-white' : 'text-dark-900 hover:bg-light-200'} rounded`}
            >
              Tips
            </button>
            <button 
              onClick={() => setMetricType('ratings')}
              className={`px-3 py-1 text-sm ${metricType === 'ratings' ? 'bg-primary text-white' : 'text-dark-900 hover:bg-light-200'} rounded`}
            >
              Ratings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPerformance;
