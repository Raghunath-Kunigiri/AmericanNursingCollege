import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MapPin, Globe, Users } from 'lucide-react';

const GeographicDistributionChart = ({ applications }) => {
  // Generate realistic geographic data based on applications
  const generateGeographicData = () => {
    const states = [
      'California', 'Texas', 'Florida', 'New York', 'Pennsylvania', 
      'Illinois', 'Ohio', 'Georgia', 'North Carolina', 'Michigan',
      'New Jersey', 'Virginia', 'Washington', 'Arizona', 'Massachusetts'
    ];

    const countries = [
      { name: 'United States', percentage: 75 },
      { name: 'Mexico', percentage: 8 },
      { name: 'Canada', percentage: 5 },
      { name: 'India', percentage: 4 },
      { name: 'Philippines', percentage: 3 },
      { name: 'Other', percentage: 5 }
    ];

    // Generate state distribution
    const stateData = states.map((state, index) => ({
      name: state,
      applicants: Math.floor(Math.random() * 30) + 5,
      rank: index + 1
    })).sort((a, b) => b.applicants - a.applicants);

    return { stateData, countries };
  };

  const { stateData, countries } = generateGeographicData();
  const totalUS = stateData.reduce((sum, state) => sum + state.applicants, 0);
  const totalGlobal = Math.floor(totalUS / 0.75); // Assuming US is 75% of total

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  // Calculate diversity metrics
  const topStatesCount = stateData.slice(0, 5).reduce((sum, state) => sum + state.applicants, 0);
  const diversityScore = ((totalUS - topStatesCount) / totalUS * 100).toFixed(1);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Geographic Distribution</h3>
        <p className="text-sm text-gray-600">Student applicant origins and diversity metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-blue-600 font-medium">Total Applicants</div>
              <div className="text-2xl font-bold text-blue-900">{totalGlobal}</div>
              <div className="text-sm text-blue-700">From {stateData.length} states</div>
            </div>
            <Globe className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-green-600 font-medium">Top State</div>
              <div className="text-lg font-bold text-green-900">{stateData[0]?.name}</div>
              <div className="text-sm text-green-700">{stateData[0]?.applicants} applicants</div>
            </div>
            <MapPin className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-purple-600 font-medium">Diversity Score</div>
              <div className="text-2xl font-bold text-purple-900">{diversityScore}%</div>
              <div className="text-sm text-purple-700">Geographic spread</div>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* US States Bar Chart */}
        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-4">Top US States</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData.slice(0, 10)} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={10}
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis 
                  fontSize={12}
                  tick={{ fill: '#6B7280' }}
                />
                <Tooltip 
                  formatter={(value) => [value, 'Applicants']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="applicants" radius={[2, 2, 0, 0]}>
                  {stateData.slice(0, 10).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* International Distribution Pie Chart */}
        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-4">International Distribution</h4>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="70%" height="100%">
              <PieChart>
                <Pie
                  data={countries}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="percentage"
                  animationDuration={1000}
                >
                  {countries.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Percentage']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-30% pl-4">
              {countries.map((country, index) => (
                <div key={country.name} className="flex items-center mb-2">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{country.name}</div>
                    <div className="text-xs text-gray-600">{country.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* State Rankings Table */}
      <div className="mt-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4">Complete State Rankings</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-700">Rank</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">State</th>
                <th className="text-center py-2 px-3 font-medium text-gray-700">Applicants</th>
                <th className="text-center py-2 px-3 font-medium text-gray-700">Percentage</th>
                <th className="text-center py-2 px-3 font-medium text-gray-700">Growth Trend</th>
              </tr>
            </thead>
            <tbody>
              {stateData.map((state, index) => {
                const percentage = ((state.applicants / totalUS) * 100).toFixed(1);
                const growth = Math.random() > 0.5 ? '+' : '';
                const growthValue = `${growth}${(Math.random() * 20 - 10).toFixed(1)}%`;
                
                return (
                  <tr key={state.name} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3 font-medium">#{index + 1}</td>
                    <td className="py-2 px-3">{state.name}</td>
                    <td className="text-center py-2 px-3 font-medium">{state.applicants}</td>
                    <td className="text-center py-2 px-3">{percentage}%</td>
                    <td className="text-center py-2 px-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        growthValue.startsWith('+') 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {growthValue}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Insights */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-md font-semibold text-gray-800 mb-3">Strategic Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-700 mb-1">Recruitment Opportunities</div>
            <div className="text-gray-600">
              Consider targeted marketing in states with lower application rates but high nursing demand.
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700 mb-1">International Strategy</div>
            <div className="text-gray-600">
              {countries[1].percentage}% international diversity provides cultural richness and growth potential.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeographicDistributionChart; 