import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const ProgramPopularityChart = ({ applications }) => {
  // Calculate program statistics
  const programStats = applications.reduce((acc, app) => {
    const program = app.program || 'Unknown';
    if (!acc[program]) {
      acc[program] = { 
        name: program, 
        applications: 0, 
        accepted: 0, 
        rejected: 0,
        reviewing: 0
      };
    }
    acc[program].applications++;
    if (app.status === 'accepted') acc[program].accepted++;
    else if (app.status === 'rejected') acc[program].rejected++;
    else if (app.status === 'reviewing') acc[program].reviewing++;
    return acc;
  }, {});

  const chartData = Object.values(programStats).map(program => ({
    ...program,
    acceptanceRate: program.applications > 0 ? 
      ((program.accepted / program.applications) * 100).toFixed(1) : 0
  })).sort((a, b) => b.applications - a.applications);

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const mostPopular = chartData[0];
  const totalApplications = chartData.reduce((sum, program) => sum + program.applications, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Program Popularity</h3>
        <p className="text-sm text-gray-600">Application volume and acceptance rates by program</p>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-blue-600 font-medium">Most Popular</div>
              <div className="text-lg font-bold text-blue-900">{mostPopular?.name}</div>
              <div className="text-sm text-blue-700">
                {mostPopular?.applications} applications
              </div>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-green-600 font-medium">Highest Acceptance</div>
              <div className="text-lg font-bold text-green-900">
                {chartData.reduce((max, program) => 
                  parseFloat(program.acceptanceRate) > parseFloat(max.acceptanceRate) ? program : max
                ).name}
              </div>
              <div className="text-sm text-green-700">
                {Math.max(...chartData.map(p => parseFloat(p.acceptanceRate)))}% acceptance
              </div>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-yellow-600 font-medium">Total Programs</div>
              <div className="text-lg font-bold text-yellow-900">{chartData.length}</div>
              <div className="text-sm text-yellow-700">
                {totalApplications} total applications
              </div>
            </div>
            <TrendingDown className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
              tick={{ fill: '#6B7280' }}
            />
            <YAxis 
              fontSize={12}
              tick={{ fill: '#6B7280' }}
            />
            <Tooltip 
              formatter={(value, name) => [
                name === 'applications' ? value.toLocaleString() : `${value}%`,
                name === 'applications' ? 'Applications' : 'Acceptance Rate'
              ]}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #E5E7EB',
                borderRadius: '6px'
              }}
            />
            <Bar dataKey="applications" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Program Details Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-3 font-medium text-gray-700">Program</th>
              <th className="text-center py-2 px-3 font-medium text-gray-700">Applications</th>
              <th className="text-center py-2 px-3 font-medium text-gray-700">Accepted</th>
              <th className="text-center py-2 px-3 font-medium text-gray-700">Acceptance Rate</th>
              <th className="text-center py-2 px-3 font-medium text-gray-700">Market Share</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((program, index) => (
              <tr key={program.name} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 px-3">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded mr-2" 
                      style={{ backgroundColor: colors[index % colors.length] }}
                    ></div>
                    {program.name}
                  </div>
                </td>
                <td className="text-center py-2 px-3 font-medium">{program.applications}</td>
                <td className="text-center py-2 px-3 text-green-600">{program.accepted}</td>
                <td className="text-center py-2 px-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    parseFloat(program.acceptanceRate) >= 70 
                      ? 'bg-green-100 text-green-800'
                      : parseFloat(program.acceptanceRate) >= 50
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {program.acceptanceRate}%
                  </span>
                </td>
                <td className="text-center py-2 px-3">
                  {((program.applications / totalApplications) * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgramPopularityChart; 