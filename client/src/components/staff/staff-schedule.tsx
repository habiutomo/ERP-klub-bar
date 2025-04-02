import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface StaffMember {
  id: number;
  name: string;
  role: string;
  status: string;
}

interface StaffShift {
  id: number;
  staffId: number;
  day: string;
  shift: string;
  weekOf?: string;
}

const StaffSchedule = () => {
  const { toast } = useToast();
  const [currentWeek, setCurrentWeek] = useState<'current' | 'next'>('current');
  
  const { data: staffMembers, isLoading: isLoadingStaff } = useQuery<StaffMember[]>({ 
    queryKey: ['/api/staff'] 
  });
  
  const { data: shifts, isLoading: isLoadingShifts } = useQuery<StaffShift[]>({ 
    queryKey: ['/api/staff/shifts'] 
  });
  
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const handleAddShift = () => {
    // This would open a modal to add a new shift
    // For now just showing a toast
    toast({
      title: 'Add Shift',
      description: 'This would open a form to add a new shift.'
    });
  };
  
  // Function to check if a staff member has a shift on a specific day
  const getShiftForDay = (staffId: number, day: string) => {
    return shifts?.find(s => s.staffId === staffId && s.day === day);
  };
  
  if (isLoadingStaff || isLoadingShifts) {
    return (
      <div className="bg-white rounded-lg shadow animate-pulse">
        <div className="p-4 border-b border-light-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="h-7 bg-light-200 rounded w-40 mb-4 sm:mb-0"></div>
          <div className="flex space-x-3">
            <div className="h-9 bg-light-200 rounded w-32"></div>
            <div className="h-9 bg-light-200 rounded w-32"></div>
            <div className="h-9 bg-light-200 rounded w-32"></div>
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
        <h2 className="text-lg font-semibold text-dark-900 mb-4 sm:mb-0">Staff Schedule</h2>
        <div className="flex space-x-3">
          <button 
            onClick={() => setCurrentWeek('current')}
            className={`px-3 py-1.5 ${currentWeek === 'current' ? 'bg-primary text-white' : 'bg-light-100 hover:bg-light-200 text-dark-900'} rounded font-medium text-sm`}
          >
            <i className="ri-arrow-left-s-line mr-1"></i>
            <span>This Week</span>
          </button>
          <button 
            onClick={() => setCurrentWeek('next')}
            className={`px-3 py-1.5 ${currentWeek === 'next' ? 'bg-primary text-white' : 'bg-light-100 hover:bg-light-200 text-dark-900'} rounded font-medium text-sm`}
          >
            <span>Next Week</span>
            <i className="ri-arrow-right-s-line ml-1"></i>
          </button>
          <button 
            onClick={handleAddShift}
            className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded font-medium text-sm"
          >
            <i className="ri-add-line mr-1"></i>
            <span>Add Shift</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-light-100 text-left text-xs text-dark-700 uppercase tracking-wider">
              <th className="px-6 py-3 text-center">Staff Member</th>
              {daysOfWeek.map(day => (
                <th key={day} className="px-6 py-3 text-center">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-light-200">
            {staffMembers?.map(member => (
              <tr key={member.id} className="hover:bg-light-100 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-dark-900">{member.name}</div>
                  <div className="text-xs text-light-400">{member.role}</div>
                </td>
                {daysOfWeek.map(day => {
                  const shift = getShiftForDay(member.id, day);
                  return (
                    <td key={`${member.id}-${day}`} className="px-6 py-4 text-center">
                      {shift ? (
                        <div className="inline-block px-3 py-1 bg-primary bg-opacity-10 text-primary text-xs rounded-full">
                          {shift.shift}
                        </div>
                      ) : (
                        <div className="inline-block px-3 py-1 text-light-400 text-xs">Off</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffSchedule;
