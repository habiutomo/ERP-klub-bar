interface StatsCardProps {
  icon: string;
  iconColor: string;
  title: string;
  value: string | number;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
}

const StatsCard = ({ icon, iconColor, title, value, trend }: StatsCardProps) => {
  const getIconClass = () => `${icon} text-xl text-${iconColor}`;
  
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center">
      <div className={`rounded-full bg-${iconColor} bg-opacity-10 p-3 mr-4`}>
        <i className={getIconClass()}></i>
      </div>
      <div>
        <p className="text-dark-900 font-medium text-sm">{title}</p>
        <p className="text-dark-900 text-2xl font-mono font-semibold">{value}</p>
        {trend && (
          <p className={`text-${trend.direction === 'up' ? 'success' : trend.direction === 'down' ? 'error' : 'dark-900'} text-xs flex items-center`}>
            <i className={`ri-arrow-${trend.direction}-s-line mr-1`}></i>
            {trend.value}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
