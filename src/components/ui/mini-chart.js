import React from 'react';

export function MiniChart({ data, title, height = 120 }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
        <div className="flex items-center justify-center h-24 text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.applications));
  const chartHeight = height - 40; // Leave space for labels
  const barWidth = 25;
  const spacing = 8;
  const chartWidth = (barWidth + spacing) * data.length - spacing;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
      
      <div className="flex flex-col items-center">
        <svg 
          width={chartWidth} 
          height={height}
          className="overflow-visible"
        >
          {/* Bars */}
          {data.map((item, index) => {
            const barHeight = maxValue > 0 ? (item.applications / maxValue) * chartHeight : 0;
            const x = index * (barWidth + spacing);
            const y = chartHeight - barHeight;
            
            return (
              <g key={index}>
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={item.isToday ? '#3B82F6' : item.isYesterday ? '#60A5FA' : '#E5E7EB'}
                  className="transition-all duration-200 hover:opacity-80"
                  rx="2"
                />
                
                {/* Value label on top of bar */}
                {item.applications > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 4}
                    textAnchor="middle"
                    className="text-xs fill-gray-600 font-medium"
                  >
                    {item.applications}
                  </text>
                )}
                
                {/* Day label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 15}
                  textAnchor="middle"
                  className="text-xs fill-gray-500"
                >
                  {item.day}
                </text>
                
                {/* Date label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 28}
                  textAnchor="middle"
                  className="text-xs fill-gray-400"
                >
                  {item.date.split(' ')[1]}
                </text>
              </g>
            );
          })}
        </svg>
        
        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-300 rounded"></div>
            <span>Yesterday</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-300 rounded"></div>
            <span>Other days</span>
          </div>
        </div>
      </div>
    </div>
  );
} 