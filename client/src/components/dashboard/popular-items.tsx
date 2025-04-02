import { useQuery } from "@tanstack/react-query";

interface PopularItem {
  id: number;
  name: string;
  soldToday: number;
  price: number;
}

const PopularItems = () => {
  const { data: popularItems, isLoading } = useQuery<PopularItem[]>({ 
    queryKey: ['/api/dashboard/popular-items'] 
  });
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-light-200 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between items-center pb-2 border-b border-light-200">
                <div>
                  <div className="h-5 bg-light-200 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-light-200 rounded w-24"></div>
                </div>
                <div className="h-5 bg-light-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-dark-900 mb-4">Popular Items</h2>
      <ul className="space-y-4">
        {popularItems && popularItems.map((item) => (
          <li key={item.id} className="flex justify-between items-center pb-2 border-b border-light-200">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-light-400">{item.soldToday} sold today</p>
            </div>
            <span className="text-dark-900 font-mono">${item.price}</span>
          </li>
        ))}
      </ul>
      <button className="w-full mt-4 text-primary text-sm hover:underline">View All Items</button>
    </div>
  );
};

export default PopularItems;
