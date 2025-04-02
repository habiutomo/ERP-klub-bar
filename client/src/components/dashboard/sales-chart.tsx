import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import React from "react";

interface SalesDataPoint {
  label: string;
  sales: number;
}

interface DataPoint {
  name: string;
  sales: number;
}

const chartTypes = ["area", "bar", "line"] as const;
type ChartType = typeof chartTypes[number];

// Define proper tooltip props
const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900/95 border border-zinc-700 shadow-xl p-3 rounded-lg">
        <p className="text-white font-medium">{label}</p>
        <p className="text-purple-300">
          Sales: <span className="font-medium text-white">${(payload[0].value as number).toFixed(2)}</span>
        </p>
      </div>
    );
  }

  return null;
};

const SalesChart = () => {
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'year'>('week');
  const [chartType, setChartType] = useState<ChartType>("area");
  
  const { data: salesData, isLoading } = useQuery<SalesDataPoint[]>({ 
    queryKey: ['/api/dashboard/sales-performance', timePeriod],
  });
  
  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 rounded-full bg-purple-600/50 flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 text-purple-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="mt-2 text-sm text-gray-400">Loading chart data...</p>
        </div>
      </div>
    );
  }
  
  const formattedData: DataPoint[] = salesData?.map(item => ({
    name: item.label,
    sales: item.sales
  })) || [];
  
  const renderChart = () => {
    switch (chartType) {
      case "area":
        return (
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333EA" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#9333EA" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#9CA3AF' }} 
              axisLine={{ stroke: '#333' }}
            />
            <YAxis 
              tick={{ fill: '#9CA3AF' }} 
              axisLine={{ stroke: '#333' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="sales" 
              stroke="#9333EA" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSales)" 
            />
          </AreaChart>
        );
      case "bar":
        return (
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#9CA3AF' }} 
              axisLine={{ stroke: '#333' }}
            />
            <YAxis 
              tick={{ fill: '#9CA3AF' }} 
              axisLine={{ stroke: '#333' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d946ef" />
                <stop offset="100%" stopColor="#9333EA" />
              </linearGradient>
            </defs>
            <Bar 
              dataKey="sales" 
              fill="url(#barGradient)" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#9CA3AF' }} 
              axisLine={{ stroke: '#333' }}
            />
            <YAxis 
              tick={{ fill: '#9CA3AF' }} 
              axisLine={{ stroke: '#333' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="#d946ef" 
              strokeWidth={3}
              dot={{ r: 6, fill: "#9333EA", strokeWidth: 3, stroke: "#d946ef" }}
              activeDot={{ r: 8, fill: "#d946ef", strokeWidth: 0 }}
            />
          </LineChart>
        );
      default:
        return (
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333EA" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#9333EA" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#9CA3AF' }} 
              axisLine={{ stroke: '#333' }}
            />
            <YAxis 
              tick={{ fill: '#9CA3AF' }} 
              axisLine={{ stroke: '#333' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="sales" 
              stroke="#9333EA" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSales)" 
            />
          </AreaChart>
        );
    }
  };
  
  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-3">
          {chartTypes.map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                chartType === type
                  ? 'bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-lg shadow-purple-700/20'
                  : 'text-gray-300 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              <i className={`ri-${type === 'area' ? 'line-chart-line' : type === 'bar' ? 'bar-chart-line' : 'line-chart-line'} mr-1.5`}></i>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setTimePeriod('week')} 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              timePeriod === 'week'
                ? 'bg-purple-900/40 text-purple-300 border border-purple-700/30'
                : 'text-gray-400 hover:bg-zinc-800/50 hover:text-white'
            }`}
          >
            Week
          </button>
          <button 
            onClick={() => setTimePeriod('month')} 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              timePeriod === 'month'
                ? 'bg-purple-900/40 text-purple-300 border border-purple-700/30'
                : 'text-gray-400 hover:bg-zinc-800/50 hover:text-white'
            }`}
          >
            Month
          </button>
          <button 
            onClick={() => setTimePeriod('year')} 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              timePeriod === 'year'
                ? 'bg-purple-900/40 text-purple-300 border border-purple-700/30'
                : 'text-gray-400 hover:bg-zinc-800/50 hover:text-white'
            }`}
          >
            Year
          </button>
        </div>
      </div>
      
      {salesData && salesData.length > 0 ? (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-80 flex flex-col items-center justify-center text-gray-400 bg-black/20 rounded-lg border border-zinc-800">
          <i className="ri-bar-chart-grouped-line text-5xl mb-2 text-gray-500"></i>
          <p>Tidak ada data penjualan untuk ditampilkan</p>
        </div>
      )}
    </>
  );
};

export default SalesChart;
