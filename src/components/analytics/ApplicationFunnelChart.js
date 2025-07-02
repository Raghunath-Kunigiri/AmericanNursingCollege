import React from 'react';
import { FunnelChart, Funnel, Cell, ResponsiveContainer, Tooltip, LabelList } from 'recharts';

const ApplicationFunnelChart = ({ data }) => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
  
  const funnelData = [
    {
      name: 'Applications Submitted',
      value: data.submitted || 245,
      fill: colors[0]
    },
    {
      name: 'Under Review',
      value: data.reviewing || 180,
      fill: colors[1]
    },
    {
      name: 'Accepted',
      value: data.accepted || 120,
      fill: colors[2]
    },
    {
      name: 'Enrolled',
      value: data.enrolled || 95,
      fill: colors[3]
    }
  ];

  const calculateConversionRate = (current, previous) => {
    return previous > 0 ? ((current / previous) * 100).toFixed(1) : 0;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Admissions Funnel</h3>
        <p className="text-sm text-gray-600">Track conversion rates through the admissions process</p>
      </div>
      
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip 
              formatter={(value, name) => [value.toLocaleString(), name]}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #E5E7EB',
                borderRadius: '6px'
              }}
            />
            <Funnel
              dataKey="value"
              data={funnelData}
              isAnimationActive={true}
              animationDuration={1000}
            >
              {funnelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <LabelList 
                dataKey="name" 
                position="center"
                fill="white"
                fontSize={12}
                fontWeight="600"
              />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion Rates */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 p-3 rounded">
          <div className="text-lg font-bold text-blue-600">
            {calculateConversionRate(funnelData[1].value, funnelData[0].value)}%
          </div>
          <div className="text-xs text-blue-600">Review Rate</div>
        </div>
        <div className="bg-green-50 p-3 rounded">
          <div className="text-lg font-bold text-green-600">
            {calculateConversionRate(funnelData[2].value, funnelData[1].value)}%
          </div>
          <div className="text-xs text-green-600">Acceptance Rate</div>
        </div>
        <div className="bg-yellow-50 p-3 rounded">
          <div className="text-lg font-bold text-yellow-600">
            {calculateConversionRate(funnelData[3].value, funnelData[2].value)}%
          </div>
          <div className="text-xs text-yellow-600">Enrollment Rate</div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFunnelChart; 