import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/layout/page-header';

interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  vipStatus: string;
  loyaltyPoints: number;
  lastVisit?: string;
}

interface Reservation {
  id: number;
  customerId?: number;
  date: string;
  time: string;
  partySize: number;
  tableNumber?: string;
  status: string;
  notes?: string;
  customer?: {
    name: string;
  };
}

const Customers = () => {
  const [activeTab, setActiveTab] = useState<'customers' | 'vip' | 'reservations'>('customers');
  const [searchQuery, setSearchQuery] = useState('');
  
  // In a real app, these would be API calls to endpoints
  const { data: customers, isLoading: isLoadingCustomers } = useQuery<Customer[]>({ 
    queryKey: ['/api/customers'] 
  });
  
  const { data: vipCustomers, isLoading: isLoadingVip } = useQuery<Customer[]>({ 
    queryKey: ['/api/customers/vip'] 
  });
  
  const { data: reservations, isLoading: isLoadingReservations } = useQuery<Reservation[]>({ 
    queryKey: ['/api/reservations/upcoming'] 
  });
  
  const filteredCustomers = customers?.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (customer.phone && customer.phone.includes(searchQuery))
  );
  
  const filteredVip = vipCustomers?.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (customer.phone && customer.phone.includes(searchQuery))
  );
  
  return (
    <div className="h-full">
      <PageHeader title="Customer Management">
        <div className="relative">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-light-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-64"
          />
          <i className="ri-search-line absolute left-3 top-2.5 text-light-400"></i>
        </div>
        <button className="flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md">
          <i className="ri-add-line mr-1"></i>
          <span>Add Customer</span>
        </button>
      </PageHeader>
      
      <div className="flex space-x-2 mb-6">
        <button 
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 rounded-md shadow font-medium transition-colors ${
            activeTab === 'customers' ? 'bg-primary text-white' : 'bg-white text-dark-900'
          }`}
        >
          All Customers
        </button>
        <button 
          onClick={() => setActiveTab('vip')}
          className={`px-4 py-2 rounded-md shadow font-medium transition-colors ${
            activeTab === 'vip' ? 'bg-primary text-white' : 'bg-white text-dark-900'
          }`}
        >
          VIP Customers
        </button>
        <button 
          onClick={() => setActiveTab('reservations')}
          className={`px-4 py-2 rounded-md shadow font-medium transition-colors ${
            activeTab === 'reservations' ? 'bg-primary text-white' : 'bg-white text-dark-900'
          }`}
        >
          Reservations
        </button>
      </div>
      
      {/* All Customers Tab */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-light-200">
            <h2 className="text-lg font-semibold text-dark-900">All Customers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-light-100 text-left text-xs text-dark-700 uppercase tracking-wider">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Contact</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Loyalty Points</th>
                  <th className="px-6 py-3">Last Visit</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-200">
                {isLoadingCustomers ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="animate-pulse flex justify-center">
                        <div className="h-6 bg-light-200 rounded w-24"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredCustomers?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-light-400">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  filteredCustomers?.map(customer => (
                    <tr key={customer.id} className="hover:bg-light-100 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-dark-900">{customer.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>{customer.email || 'N/A'}</div>
                        <div className="text-sm text-light-400">{customer.phone || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                          customer.vipStatus === 'vip' 
                            ? 'bg-primary bg-opacity-10 text-primary' 
                            : 'bg-light-200 text-light-400'
                        }`}>
                          {customer.vipStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono">{customer.loyaltyPoints}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>{customer.lastVisit ? new Date(customer.lastVisit).toLocaleDateString() : 'Never'}</div>
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
      )}
      
      {/* VIP Customers Tab */}
      {activeTab === 'vip' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-light-200">
            <h2 className="text-lg font-semibold text-dark-900">VIP Customers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-light-100 text-left text-xs text-dark-700 uppercase tracking-wider">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Contact</th>
                  <th className="px-6 py-3">Loyalty Points</th>
                  <th className="px-6 py-3">Last Visit</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-200">
                {isLoadingVip ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center">
                      <div className="animate-pulse flex justify-center">
                        <div className="h-6 bg-light-200 rounded w-24"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredVip?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-light-400">
                      No VIP customers found
                    </td>
                  </tr>
                ) : (
                  filteredVip?.map(customer => (
                    <tr key={customer.id} className="hover:bg-light-100 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-dark-900">{customer.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>{customer.email || 'N/A'}</div>
                        <div className="text-sm text-light-400">{customer.phone || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono">{customer.loyaltyPoints}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>{customer.lastVisit ? new Date(customer.lastVisit).toLocaleDateString() : 'Never'}</div>
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
      )}
      
      {/* Reservations Tab */}
      {activeTab === 'reservations' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-light-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-dark-900">Upcoming Reservations</h2>
            <button className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded font-medium text-sm">
              <i className="ri-add-line mr-1"></i>
              <span>New Reservation</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-light-100 text-left text-xs text-dark-700 uppercase tracking-wider">
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Date & Time</th>
                  <th className="px-6 py-3">Party Size</th>
                  <th className="px-6 py-3">Table</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-200">
                {isLoadingReservations ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="animate-pulse flex justify-center">
                        <div className="h-6 bg-light-200 rounded w-24"></div>
                      </div>
                    </td>
                  </tr>
                ) : reservations?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-light-400">
                      No upcoming reservations
                    </td>
                  </tr>
                ) : (
                  reservations?.map(reservation => (
                    <tr key={reservation.id} className="hover:bg-light-100 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-dark-900">
                          {reservation.customer?.name || 'Walk-in'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>{new Date(reservation.date).toLocaleDateString()}</div>
                        <div className="text-sm text-light-400">{reservation.time}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono">{reservation.partySize} people</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>{reservation.tableNumber || 'Not assigned'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                          reservation.status === 'confirmed' 
                            ? 'bg-success bg-opacity-10 text-success' 
                            : reservation.status === 'pending'
                              ? 'bg-warning bg-opacity-10 text-warning'
                              : 'bg-error bg-opacity-10 text-error'
                        }`}>
                          {reservation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="p-1 text-primary hover:bg-light-100 rounded">
                            <i className="ri-pencil-line"></i>
                          </button>
                          <button className="p-1 text-error hover:bg-light-100 rounded">
                            <i className="ri-close-circle-line"></i>
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
      )}
    </div>
  );
};

export default Customers;
