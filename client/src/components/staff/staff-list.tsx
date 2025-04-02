import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface StaffMember {
  id: number;
  name: string;
  role: string;
  status: string;
  hoursThisWeek: number;
  avgRating: number;
}

interface StaffListProps {
  onSelectStaff: (member: StaffMember) => void;
}

const StaffList = ({ onSelectStaff }: StaffListProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: staffMembers, isLoading } = useQuery<StaffMember[]>({ 
    queryKey: ['/api/staff'] 
  });
  
  const handleAddStaff = () => {
    // This would open a form to add a new staff member
    // For now just showing a toast
    toast({
      title: 'Add Staff',
      description: 'This would open a form to add a new staff member.'
    });
  };
  
  const filteredStaff = staffMembers?.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow animate-pulse">
        <div className="p-4 border-b border-light-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="h-7 bg-light-200 rounded w-40 mb-4 sm:mb-0"></div>
          <div className="flex space-x-3">
            <div className="h-10 bg-light-200 rounded w-64"></div>
            <div className="h-10 bg-light-200 rounded w-32"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="h-64 bg-light-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-light-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-dark-900 mb-4 sm:mb-0">Staff Members</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search staff..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-light-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <i className="ri-search-line absolute left-3 top-2.5 text-light-400"></i>
          </div>
          <button 
            onClick={handleAddStaff}
            className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded font-medium text-sm"
          >
            <i className="ri-add-line mr-1"></i>
            <span>Add Staff</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-light-100 text-left text-xs text-dark-700 uppercase tracking-wider">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Hours This Week</th>
              <th className="px-6 py-3">Average Rating</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-200">
            {filteredStaff && filteredStaff.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-light-400">
                  No staff members match your search criteria
                </td>
              </tr>
            ) : (
              filteredStaff?.map(member => (
                <tr key={member.id} className="hover:bg-light-100 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-dark-900">{member.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{member.role}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className={`px-2 py-1 text-xs rounded-full capitalize ${
                        member.status === 'active' 
                          ? 'bg-success bg-opacity-10 text-success' 
                          : 'bg-light-200 text-light-400'
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono">{member.hoursThisWeek} hours</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="font-mono mr-1">{member.avgRating.toFixed(1)}</span>
                      <i className="ri-star-fill text-warning text-sm"></i>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => onSelectStaff(member)} 
                        className="p-1 text-primary hover:bg-light-100 rounded"
                        title="View details"
                      >
                        <i className="ri-eye-line"></i>
                      </button>
                      <button 
                        className="p-1 text-primary hover:bg-light-100 rounded"
                        title="Edit staff member"
                      >
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
  );
};

export default StaffList;
