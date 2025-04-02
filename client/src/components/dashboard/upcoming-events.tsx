import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

interface Event {
  id: number;
  name: string;
  date: string;
  startTime: string;
  rsvpCount: number;
  eventType: string;
}

const UpcomingEvents = () => {
  const { data: events, isLoading } = useQuery<Event[]>({ 
    queryKey: ['/api/dashboard/upcoming-events'] 
  });
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 bg-light-200 rounded w-48"></div>
            <div className="h-5 bg-light-200 rounded w-32"></div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-l-4 border-light-200 pl-3">
                <div className="h-5 bg-light-200 rounded w-40 mb-2"></div>
                <div className="h-4 bg-light-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-light-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  const getEventColor = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case 'dj set':
        return 'accent';
      case 'live music':
        return 'secondary';
      case 'workshop':
        return 'primary';
      default:
        return 'primary';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return format(date, 'EEEE');
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-dark-900">Upcoming Events</h2>
        <button className="text-primary text-sm hover:underline">View Calendar</button>
      </div>
      <ul className="space-y-4">
        {events && events.map((event) => (
          <li key={event.id} className={`border-l-4 border-${getEventColor(event.eventType)} pl-3`}>
            <p className="font-semibold">{event.name}</p>
            <p className="text-sm text-light-400">{formatDate(event.date)}, {event.startTime}</p>
            <div className="flex items-center mt-1 text-xs text-dark-700">
              <i className="ri-user-line mr-1"></i>
              <span>{event.rsvpCount} RSVPs</span>
            </div>
          </li>
        ))}
        <li className="pt-2">
          <button className="flex items-center text-primary text-sm hover:underline">
            <i className="ri-add-line mr-1"></i>
            <span>Add New Event</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UpcomingEvents;
