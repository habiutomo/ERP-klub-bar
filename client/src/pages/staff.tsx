import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/layout/page-header';
import StaffSchedule from '@/components/staff/staff-schedule';
import StaffList from '@/components/staff/staff-list';
import StaffPerformance from '@/components/staff/staff-performance';
import StaffDetailsModal from '@/components/staff/staff-details-modal';

interface StaffMember {
  id: number;
  name: string;
  role: string;
  status: string;
  hoursThisWeek: number;
  avgRating: number;
}

interface TopPerformer {
  id: number;
  name: string;
  role: string;
  salesAmount: number;
  customerRating: number;
  incidents: number;
}

const Staff = () => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'staff' | 'performance'>('schedule');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  
  const { data: topPerformers } = useQuery<TopPerformer[]>({ 
    queryKey: ['/api/staff/performance/top', { limit: 5 }] 
  });
  
  return (
    <div className="h-full">
      <div className="flex space-x-2 mb-6">
        <button 
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 rounded-md shadow font-medium transition-colors ${
            activeTab === 'schedule' ? 'bg-primary text-white' : 'bg-white text-dark-900'
          }`}
        >
          Schedule
        </button>
        <button 
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2 rounded-md shadow font-medium transition-colors ${
            activeTab === 'staff' ? 'bg-primary text-white' : 'bg-white text-dark-900'
          }`}
        >
          Staff List
        </button>
        <button 
          onClick={() => setActiveTab('performance')}
          className={`px-4 py-2 rounded-md shadow font-medium transition-colors ${
            activeTab === 'performance' ? 'bg-primary text-white' : 'bg-white text-dark-900'
          }`}
        >
          Performance
        </button>
      </div>

      {/* Schedule Tab */}
      {activeTab === 'schedule' && <StaffSchedule />}
      
      {/* Staff List Tab */}
      {activeTab === 'staff' && <StaffList onSelectStaff={setSelectedStaff} />}
      
      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StaffPerformance />
          
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-light-200">
              <h2 className="text-lg font-semibold text-dark-900">Top Performers</h2>
            </div>
            <ul className="divide-y divide-light-200">
              {topPerformers?.map((performer, index) => (
                <li key={performer.id} className="px-6 py-4 hover:bg-light-100 transition-colors">
                  <div className="flex items-center">
                    <div className="font-medium mr-4 text-center w-6">{index + 1}</div>
                    <div>
                      <p className="font-medium">{performer.name}</p>
                      <p className="text-sm text-light-400">{performer.role}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs font-semibold bg-warning bg-opacity-10 text-warning px-2 py-0.5 rounded-full">
                          {performer.customerRating.toFixed(1)} ★
                        </span>
                        <span className="text-xs text-light-400 ml-2">
                          Sales: ${performer.salesAmount.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Staff Details Modal */}
      {selectedStaff && (
        <StaffDetailsModal 
          staffMember={selectedStaff}
          onClose={() => setSelectedStaff(null)}
        />
      )}
    </div>
  );
};

export default Staff;
