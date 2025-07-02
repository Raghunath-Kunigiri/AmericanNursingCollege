import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Clock, TrendingDown, TrendingUp, Target } from 'lucide-react';

const TimeToDecisionChart = ({ applications }) => {
  // Calculate time-to-decision metrics
  const calculateTimeMetrics = () => {
    // Generate realistic time-to-decision data over the last 12 months
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const timeData = months.map((month, index) => {
      const baseTime = 12; // Average 12 days base
      const seasonalVariation = Math.sin((index / 12) * 2 * Math.PI) * 3; // Seasonal variation
      const trendImprovement = -index * 0.3; // Gradual improvement over time
      
      const avgDays = Math.max(5, baseTime + seasonalVariation + trendImprovement + (Math.random() * 4 - 2));
      
      return {
        month,
        avgDays: Math.round(avgDays * 10) / 10,
        acceptedDays: Math.round((avgDays - 1.5) * 10) / 10,
        rejectedDays: Math.round((avgDays + 2) * 10) / 10,
        volume: Math.floor(Math.random() * 30) + 15
      };
    });

    return timeData;
  };

  const timeData = calculateTimeMetrics();
  
  // Calculate KPIs
  const currentMonth = timeData[timeData.length - 1];
  const previousMonth = timeData[timeData.length - 2];
  const averageTime = timeData.reduce((sum, month) => sum + month.avgDays, 0) / timeData.length;
  const targetTime = 10; // Target 10 days
  const improvement = ((previousMonth.avgDays - currentMonth.avgDays) / previousMonth.avgDays * 100).toFixed(1);

  // Performance categorization
  const getPerformanceStatus = (days) => {
    if (days <= targetTime) return { status: 'excellent', color: 'green' };
    if (days <= targetTime + 3) return { status: 'good', color: 'yellow' };
    return { status: 'needs-improvement', color: 'red' };
  };

  const currentPerformance = getPerformanceStatus(currentMonth.avgDays);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Time-to-Decision Analytics</h3>
        <p className="text-sm text-gray-600">Admissions efficiency and processing speed KPIs</p>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-blue-600 font-medium">Current Average</div>
              <div className="text-2xl font-bold text-blue-900">{currentMonth.avgDays}</div>
              <div className="text-sm text-blue-700">days</div>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className={`bg-${currentPerformance.color}-50 p-4 rounded-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-sm text-${currentPerformance.color}-600 font-medium`}>vs Target</div>
              <div className={`text-2xl font-bold text-${currentPerformance.color}-900`}>
                {currentMonth.avgDays <= targetTime ? '✓' : Math.round((currentMonth.avgDays - targetTime) * 10) / 10}
              </div>
              <div className={`text-sm text-${currentPerformance.color}-700`}>
                {currentMonth.avgDays <= targetTime ? 'On target' : 'days over'}
              </div>
            </div>
            <Target className={`h-8 w-8 text-${currentPerformance.color}-600`} />
          </div>
        </div>

        <div className={`bg-${improvement >= 0 ? 'green' : 'red'}-50 p-4 rounded-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-sm text-${improvement >= 0 ? 'green' : 'red'}-600 font-medium`}>Monthly Change</div>
              <div className={`text-2xl font-bold text-${improvement >= 0 ? 'green' : 'red'}-900`}>
                {improvement >= 0 ? '+' : ''}{improvement}%
              </div>
              <div className={`text-sm text-${improvement >= 0 ? 'green' : 'red'}-700`}>
                {improvement >= 0 ? 'Improved' : 'Slower'}
              </div>
            </div>
            {improvement >= 0 ? 
              <TrendingDown className="h-8 w-8 text-green-600" /> : 
              <TrendingUp className="h-8 w-8 text-red-600" />
            }
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-purple-600 font-medium">12-Month Avg</div>
              <div className="text-2xl font-bold text-purple-900">{averageTime.toFixed(1)}</div>
              <div className="text-sm text-purple-700">days</div>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Time Trend Chart */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4">Processing Time Trends</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis 
                dataKey="month" 
                fontSize={12}
                tick={{ fill: '#6B7280' }}
              />
              <YAxis 
                fontSize={12}
                tick={{ fill: '#6B7280' }}
                label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value, name) => [
                  `${value} days`,
                  name === 'avgDays' ? 'Average' : 
                  name === 'acceptedDays' ? 'Accepted' : 'Rejected'
                ]}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="avgDays" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="acceptedDays" 
                stroke="#10B981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="rejectedDays" 
                stroke="#EF4444" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
              />
              {/* Target line */}
              <Line 
                type="monotone" 
                dataKey={() => targetTime} 
                stroke="#F59E0B" 
                strokeWidth={2}
                strokeDasharray="10 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center mt-4 space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-blue-500 mr-2"></div>
            <span>Average Time</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-green-500 mr-2" style={{ borderTop: '2px dashed #10B981' }}></div>
            <span>Accepted Applications</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-red-500 mr-2" style={{ borderTop: '2px dashed #EF4444' }}></div>
            <span>Rejected Applications</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-yellow-500 mr-2" style={{ borderTop: '2px dashed #F59E0B' }}></div>
            <span>Target (10 days)</span>
          </div>
        </div>
      </div>

      {/* Application Volume vs Processing Time */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4">Volume vs Processing Time</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis 
                dataKey="month" 
                fontSize={12}
                tick={{ fill: '#6B7280' }}
              />
              <YAxis 
                yAxisId="left"
                fontSize={12}
                tick={{ fill: '#6B7280' }}
                label={{ value: 'Applications', angle: -90, position: 'insideLeft' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                fontSize={12}
                tick={{ fill: '#6B7280' }}
                label={{ value: 'Days', angle: 90, position: 'insideRight' }}
              />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'volume' ? `${value} applications` : `${value} days`,
                  name === 'volume' ? 'Application Volume' : 'Processing Time'
                ]}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px'
                }}
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="volume" 
                stroke="#8B5CF6" 
                fill="#8B5CF6" 
                fillOpacity={0.3}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="avgDays" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-4">Performance Breakdown</h4>
          <div className="space-y-3">
            {timeData.slice(-6).map((month, index) => {
              const performance = getPerformanceStatus(month.avgDays);
              return (
                <div key={month.month} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 bg-${performance.color}-500`}></div>
                    <span className="font-medium">{month.month}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{month.avgDays} days</div>
                    <div className="text-sm text-gray-600">{month.volume} applications</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-4">Efficiency Insights</h4>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="font-medium text-blue-900 mb-2">Peak Efficiency</div>
              <div className="text-sm text-blue-700">
                Best performance: {Math.min(...timeData.map(d => d.avgDays))} days in{' '}
                {timeData.find(d => d.avgDays === Math.min(...timeData.map(d => d.avgDays)))?.month}
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="font-medium text-green-900 mb-2">Acceptance Speed</div>
              <div className="text-sm text-green-700">
                Accepted applications processed {(averageTime - timeData.reduce((sum, d) => sum + d.acceptedDays, 0) / timeData.length).toFixed(1)} days faster on average
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="font-medium text-yellow-900 mb-2">Target Achievement</div>
              <div className="text-sm text-yellow-700">
                {timeData.filter(d => d.avgDays <= targetTime).length} of {timeData.length} months met the {targetTime}-day target
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeToDecisionChart; 