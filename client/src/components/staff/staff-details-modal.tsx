import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

interface StaffMember {
  id: number;
  name: string;
  role: string;
  status: string;
  email?: string;
  phone?: string;
  emergencyContact?: string;
  startDate?: string;
  employeeId?: string;
}

interface StaffPerformance {
  salesAmount: number;
  customerRating: number;
  incidents: number;
}

interface StaffShift {
  day: string;
  shift: string;
}

interface StaffDetailsResponse extends StaffMember {
  performance: StaffPerformance | null;
  shifts: StaffShift[];
}

interface StaffDetailsModalProps {
  staffMember: { id: number; name: string; role: string; } | null;
  onClose: () => void;
}

const StaffDetailsModal = ({ staffMember, onClose }: StaffDetailsModalProps) => {
  const { data: staffDetails, isLoading } = useQuery<StaffDetailsResponse>({ 
    queryKey: [`/api/staff/${staffMember?.id}`],
    enabled: !!staffMember,
  });
  
  if (!staffMember) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-dark-900 bg-opacity-50">
      <div 
        className="bg-white rounded-lg shadow-lg max-w-xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-light-200 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-dark-900">{staffMember.name}</h2>
            <p className="text-light-400">{staffMember.role}</p>
          </div>
          <button onClick={onClose} className="text-dark-900 hover:bg-light-100 rounded-full p-1">
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>
        
        {isLoading ? (
          <div className="p-6 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="h-5 bg-light-200 rounded w-40 mb-2"></div>
                <div className="h-4 bg-light-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-light-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-light-200 rounded w-full"></div>
              </div>
              <div>
                <div className="h-5 bg-light-200 rounded w-40 mb-2"></div>
                <div className="h-4 bg-light-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-light-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-light-200 rounded w-full"></div>
              </div>
            </div>
            
            <div className="h-5 bg-light-200 rounded w-40 mb-2"></div>
            <div className="bg-light-200 rounded-lg p-4 mb-6 h-32"></div>
            
            <div className="h-5 bg-light-200 rounded w-40 mb-2"></div>
            <div className="h-20 bg-light-200 rounded w-full mb-6"></div>
            
            <div className="flex justify-between">
              <div className="h-10 bg-light-200 rounded w-32"></div>
              <div className="h-10 bg-light-200 rounded w-32"></div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium mb-2">Contact Information</h3>
                <p className="text-sm mb-1">
                  <span className="text-light-400">Email:</span> {staffDetails?.email || 'N/A'}
                </p>
                <p className="text-sm mb-1">
                  <span className="text-light-400">Phone:</span> {staffDetails?.phone || 'N/A'}
                </p>
                <p className="text-sm">
                  <span className="text-light-400">Emergency Contact:</span> {staffDetails?.emergencyContact || 'N/A'}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Employment Details</h3>
                <p className="text-sm mb-1">
                  <span className="text-light-400">Start Date:</span> {staffDetails?.startDate ? format(new Date(staffDetails.startDate), 'MMM d, yyyy') : 'N/A'}
                </p>
                <p className="text-sm mb-1">
                  <span className="text-light-400">Employee ID:</span> {staffDetails?.employeeId || 'N/A'}
                </p>
                <p className="text-sm">
                  <span className="text-light-400">Status:</span>{' '}
                  <span className={staffDetails?.status === 'active' ? 'text-success' : 'text-light-400'}>
                    {staffDetails?.status === 'active' ? 'Active' : 'Off'}
                  </span>
                </p>
              </div>
            </div>
            
            <h3 className="font-medium mb-2">Current Schedule</h3>
            <div className="bg-light-100 rounded-lg p-4 mb-6">
              {staffDetails?.shifts && staffDetails.shifts.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {staffDetails.shifts.map((shift, index) => (
                    <div key={index}>
                      <p className="text-xs text-light-400">{shift.day}</p>
                      <p className="text-sm">{shift.shift}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-light-400">No shifts scheduled</p>
              )}
            </div>
            
            <h3 className="font-medium mb-2">Performance Metrics</h3>
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Customer Rating</span>
                <span className="text-sm font-mono">
                  {staffDetails?.performance?.customerRating.toFixed(1) || 'N/A'}/5.0
                </span>
              </div>
              <div className="w-full bg-light-200 rounded-full h-2">
                <div 
                  className="bg-success h-2 rounded-full" 
                  style={{ width: `${((staffDetails?.performance?.customerRating || 0) / 5) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between mb-1 mt-3">
                <span className="text-sm">Sales Performance</span>
                <span className="text-sm font-mono">
                  {staffDetails?.performance?.salesAmount ? `$${staffDetails.performance.salesAmount.toFixed(2)}` : 'N/A'}
                </span>
              </div>
              <div className="w-full bg-light-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: '92%' }}
                ></div>
              </div>
              
              <div className="flex justify-between mb-1 mt-3">
                <span className="text-sm">Incidents</span>
                <span className="text-sm font-mono">
                  {staffDetails?.performance?.incidents || 0}
                </span>
              </div>
              <div className="w-full bg-light-200 rounded-full h-2">
                <div 
                  className="bg-secondary h-2 rounded-full" 
                  style={{ width: `${100 - ((staffDetails?.performance?.incidents || 0) * 10)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button className="px-4 py-2 bg-light-100 hover:bg-light-200 text-dark-900 rounded font-medium">
                <i className="ri-calendar-line mr-1"></i>
                <span>Edit Schedule</span>
              </button>
              <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded font-medium">
                <i className="ri-edit-line mr-1"></i>
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDetailsModal;
