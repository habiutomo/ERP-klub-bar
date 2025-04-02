import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import PageHeader from '@/components/layout/page-header';

interface FinancialTransaction {
  id: number;
  transactionType: string;
  amount: number;
  description?: string;
  date: string;
  category?: string;
  paymentMethod?: string;
  relatedOrderId?: number;
}

interface ExpenseByCategory {
  category: string;
  amount: number;
}

const Finances = () => {
  const [timePeriod, setTimePeriod] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [transactionType, setTransactionType] = useState<'all' | 'income' | 'expense'>('all');
  
  const { data: transactions, isLoading } = useQuery<FinancialTransaction[]>({ 
    queryKey: ['/api/finances/transactions'] 
  });
  
  const { data: salesData } = useQuery({ 
    queryKey: ['/api/dashboard/sales-performance', timePeriod],
  });
  
  const { data: expensesByCategory } = useQuery<ExpenseByCategory[]>({ 
    queryKey: ['/api/finances/expenses-by-category'],
  });
  
  const filteredTransactions = transactions?.filter(tx => {
    if (transactionType === 'all') return true;
    return tx.transactionType === transactionType;
  });
  
  // Calculate total income, expenses, and profit
  const totals = transactions?.reduce((acc, tx) => {
    if (tx.transactionType === 'income') {
      acc.income += tx.amount;
    } else if (tx.transactionType === 'expense') {
      acc.expenses += tx.amount;
    }
    acc.profit = acc.income - acc.expenses;
    return acc;
  }, { income: 0, expenses: 0, profit: 0 }) || { income: 0, expenses: 0, profit: 0 };
  
  return (
    <div className="h-full">
      <PageHeader title="Financial Reports">
        <div className="flex space-x-2">
          <button 
            onClick={() => setTimePeriod('day')}
            className={`px-3 py-1 text-sm ${timePeriod === 'day' ? 'bg-primary text-white' : 'bg-white text-dark-900'} rounded`}
          >
            Day
          </button>
          <button 
            onClick={() => setTimePeriod('week')}
            className={`px-3 py-1 text-sm ${timePeriod === 'week' ? 'bg-primary text-white' : 'bg-white text-dark-900'} rounded`}
          >
            Week
          </button>
          <button 
            onClick={() => setTimePeriod('month')}
            className={`px-3 py-1 text-sm ${timePeriod === 'month' ? 'bg-primary text-white' : 'bg-white text-dark-900'} rounded`}
          >
            Month
          </button>
          <button 
            onClick={() => setTimePeriod('year')}
            className={`px-3 py-1 text-sm ${timePeriod === 'year' ? 'bg-primary text-white' : 'bg-white text-dark-900'} rounded`}
          >
            Year
          </button>
        </div>
        <button className="flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md">
          <i className="ri-add-line mr-1"></i>
          <span>New Transaction</span>
        </button>
      </PageHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-success bg-opacity-10 p-3 mr-4">
            <i className="ri-arrow-up-circle-line text-xl text-success"></i>
          </div>
          <div>
            <p className="text-dark-900 font-medium text-sm">Income</p>
            <p className="text-dark-900 text-2xl font-mono font-semibold">${totals.income.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-error bg-opacity-10 p-3 mr-4">
            <i className="ri-arrow-down-circle-line text-xl text-error"></i>
          </div>
          <div>
            <p className="text-dark-900 font-medium text-sm">Expenses</p>
            <p className="text-dark-900 text-2xl font-mono font-semibold">${totals.expenses.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-primary bg-opacity-10 p-3 mr-4">
            <i className="ri-coins-line text-xl text-primary"></i>
          </div>
          <div>
            <p className="text-dark-900 font-medium text-sm">Profit</p>
            <p className="text-dark-900 text-2xl font-mono font-semibold">${totals.profit.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Performance Chart */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-dark-900 mb-4">Sales Performance</h2>
          <div className="h-64 flex items-end space-x-2 border-b border-l border-light-300">
            {salesData ? (
              salesData.map((dataPoint: any, index: number) => (
                <div key={index} className="flex-1 flex flex-col justify-end items-center">
                  <div 
                    className="w-full bg-primary rounded-t" 
                    style={{ height: `${dataPoint.sales > 0 ? (dataPoint.sales / Math.max(...salesData.map((d: any) => d.sales)) * 100) : 0}%` }}
                  ></div>
                  <span className="text-xs mt-1 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                    {dataPoint.label}
                  </span>
                </div>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-light-400">No sales data available</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Expenses by Category */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-dark-900 mb-4">Expenses by Category</h2>
          <ul className="space-y-4">
            {expensesByCategory ? (
              expensesByCategory.map((expense, index) => (
                <li key={index} className="flex justify-between items-center pb-2 border-b border-light-200">
                  <div>
                    <p className="font-medium capitalize">{expense.category}</p>
                  </div>
                  <span className="text-dark-900 font-mono">${expense.amount.toFixed(2)}</span>
                </li>
              ))
            ) : (
              <li className="text-center py-8 text-light-400">
                <p>No expense data available</p>
              </li>
            )}
          </ul>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-light-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-dark-900">Transaction History</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setTransactionType('all')}
              className={`px-3 py-1 text-sm ${transactionType === 'all' ? 'bg-primary text-white' : 'bg-light-100 text-dark-900'} rounded`}
            >
              All
            </button>
            <button 
              onClick={() => setTransactionType('income')}
              className={`px-3 py-1 text-sm ${transactionType === 'income' ? 'bg-primary text-white' : 'bg-light-100 text-dark-900'} rounded`}
            >
              Income
            </button>
            <button 
              onClick={() => setTransactionType('expense')}
              className={`px-3 py-1 text-sm ${transactionType === 'expense' ? 'bg-primary text-white' : 'bg-light-100 text-dark-900'} rounded`}
            >
              Expenses
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-light-100 text-left text-xs text-dark-700 uppercase tracking-wider">
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="animate-pulse flex justify-center">
                      <div className="h-6 bg-light-200 rounded w-24"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredTransactions?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-light-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions?.map(transaction => (
                  <tr key={transaction.id} className="hover:bg-light-100 transition-colors">
                    <td className="px-6 py-4">
                      {format(new Date(transaction.date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-dark-900">{transaction.description || 'N/A'}</div>
                      {transaction.relatedOrderId && (
                        <div className="text-xs text-light-400">Order #{transaction.relatedOrderId}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize">{transaction.category || 'Uncategorized'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-mono font-medium ${
                        transaction.transactionType === 'income' ? 'text-success' : 'text-error'
                      }`}>
                        {transaction.transactionType === 'income' ? '+' : '-'}
                        ${transaction.amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                        transaction.transactionType === 'income' 
                          ? 'bg-success bg-opacity-10 text-success' 
                          : 'bg-error bg-opacity-10 text-error'
                      }`}>
                        {transaction.transactionType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="p-1 text-primary hover:bg-light-100 rounded">
                          <i className="ri-eye-line"></i>
                        </button>
                        <button className="p-1 text-primary hover:bg-light-100 rounded">
                          <i className="ri-pencil-line"></i>
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
    </div>
  );
};

export default Finances;
