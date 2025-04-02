import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

interface Transaction {
  id: number;
  transactionId: string;
  time: string;
  amount: number;
  status: string;
  bartender: string;
}

const RecentTransactions = () => {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({ 
    queryKey: ['/api/dashboard/recent-transactions'] 
  });
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 bg-light-200 rounded w-48"></div>
            <div className="h-5 bg-light-200 rounded w-20"></div>
          </div>
          <div className="overflow-x-auto">
            <div className="h-64 bg-light-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }
  
  const formatTime = (time: string) => {
    const date = new Date(time);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'long' }) === new Date().toLocaleDateString('en-US', { weekday: 'long' }) ? 'Today' : format(date, 'EEE'),
      time: format(date, 'h:mm a')
    };
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-dark-900">Recent Transactions</h2>
        <button className="text-primary text-sm hover:underline">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-xs text-light-400 uppercase tracking-wider">
              <th className="pb-2">Transaction ID</th>
              <th className="pb-2">Time</th>
              <th className="pb-2">Amount</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Bartender</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-200">
            {transactions && transactions.map((transaction) => {
              const formattedTime = formatTime(transaction.time);
              return (
                <tr key={transaction.id}>
                  <td className="py-3 text-sm">{transaction.transactionId}</td>
                  <td className="py-3 text-sm">{formattedTime.day}, {formattedTime.time}</td>
                  <td className="py-3 text-sm font-mono">${transaction.amount.toFixed(2)}</td>
                  <td className="py-3 text-sm">
                    <span className={`px-2 py-1 bg-${transaction.status === 'completed' ? 'success' : 'warning'} bg-opacity-10 text-${transaction.status === 'completed' ? 'success' : 'warning'} text-xs rounded-full`}>
                      {transaction.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 text-sm">{transaction.bartender}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
