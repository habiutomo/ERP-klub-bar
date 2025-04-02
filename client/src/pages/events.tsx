import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import PageHeader from '@/components/layout/page-header';

interface Event {
  id: number;
  name: string;
  description?: string;
  date: string;
  startTime: string;
  endTime?: string;
  performer?: string;
  eventType?: string;
  rsvpCount: number;
  status: string;
}

const Events = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: events, isLoading } = useQuery<Event[]>({ 
    queryKey: ['/api/events'] 
  });
  
  const filteredEvents = events?.filter(event => 
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.performer && event.performer.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const getEventTypeColor = (type?: string) => {
    if (!type) return 'primary';
    
    switch (type.toLowerCase()) {
      case 'dj set':
        return 'accent';
      case 'live music':
        return 'secondary';
      case 'workshop':
        return 'primary';
      case 'promotion':
        return 'success';
      case 'special':
        return 'warning';
      default:
        return 'primary';
    }
  };
  
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'EEEE, MMMM d, yyyy');
  };
  
  return (
    <div className="h-full">
      <PageHeader title="Event Management">
        <div className="relative">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-light-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-64"
          />
          <i className="ri-search-line absolute left-3 top-2.5 text-light-400"></i>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-dark-900'
            }`}
          >
            <i className="ri-list-check mr-1"></i>
            List View
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              viewMode === 'calendar' ? 'bg-primary text-white' : 'bg-white text-dark-900'
            }`}
          >
            <i className="ri-calendar-line mr-1"></i>
            Calendar
          </button>
        </div>
        <button className="flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md">
          <i className="ri-add-line mr-1"></i>
          <span>Add Event</span>
        </button>
      </PageHeader>
      
      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-light-200">
            <h2 className="text-lg font-semibold text-dark-900">Upcoming Events</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-light-100 text-left text-xs text-dark-700 uppercase tracking-wider">
                  <th className="px-6 py-3">Event</th>
                  <th className="px-6 py-3">Date & Time</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">RSVPs</th>
                  <th className="px-6 py-3">Status</th>
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
                ) : filteredEvents?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-light-400">
                      No events found
                    </td>
                  </tr>
                ) : (
                  filteredEvents?.map(event => (
                    <tr key={event.id} className="hover:bg-light-100 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-dark-900">{event.name}</div>
                        <div className="text-sm text-light-400">
                          {event.performer ? `Performer: ${event.performer}` : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>{formatEventDate(event.date)}</div>
                        <div className="text-sm text-light-400">
                          {event.startTime} {event.endTime ? `- ${event.endTime}` : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full capitalize bg-${getEventTypeColor(event.eventType)} bg-opacity-10 text-${getEventTypeColor(event.eventType)}`}>
                          {event.eventType || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono">{event.rsvpCount}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                          event.status === 'upcoming' 
                            ? 'bg-success bg-opacity-10 text-success' 
                            : event.status === 'cancelled'
                              ? 'bg-error bg-opacity-10 text-error'
                              : 'bg-light-200 text-light-400'
                        }`}>
                          {event.status}
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
                          <button className="p-1 text-error hover:bg-light-100 rounded">
                            <i className="ri-delete-bin-line"></i>
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
      
      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <button className="p-2 hover:bg-light-100 rounded-full">
                <i className="ri-arrow-left-s-line"></i>
              </button>
              <h2 className="text-lg font-semibold mx-4">June 2023</h2>
              <button className="p-2 hover:bg-light-100 rounded-full">
                <i className="ri-arrow-right-s-line"></i>
              </button>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-light-100 hover:bg-light-200 rounded">
                Today
              </button>
              <button className="px-3 py-1 text-sm bg-light-100 hover:bg-light-200 rounded">
                Month
              </button>
              <button className="px-3 py-1 text-sm bg-light-100 hover:bg-light-200 rounded">
                Week
              </button>
            </div>
          </div>
          
          {/* Simple calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Days of week */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center py-2 font-medium text-dark-700">
                {day}
              </div>
            ))}
            
            {/* Calendar days (simplified) */}
            {Array.from({ length: 35 }).map((_, index) => {
              const day = index - 3; // Offset to start the month on the right day
              return (
                <div 
                  key={index}
                  className={`min-h-24 border border-light-200 p-1 ${
                    day < 1 || day > 30 ? 'bg-light-100 text-light-400' : ''
                  } ${day === 15 ? 'bg-light-100' : ''}`}
                >
                  <div className="text-right text-sm p-1">
                    {day > 0 && day <= 30 ? day : ''}
                  </div>
                  {day === 5 && (
                    <div className="bg-primary bg-opacity-10 text-primary text-xs rounded p-1 mb-1">
                      DJ Night - 9:00 PM
                    </div>
                  )}
                  {day === 12 && (
                    <div className="bg-secondary bg-opacity-10 text-secondary text-xs rounded p-1 mb-1">
                      Live Band - 10:00 PM
                    </div>
                  )}
                  {day === 18 && (
                    <div className="bg-accent bg-opacity-10 text-accent text-xs rounded p-1">
                      Cocktail Class - 6:00 PM
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 text-center text-light-400 text-sm">
            This is a simplified calendar view. In a real implementation, it would show actual events.
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
