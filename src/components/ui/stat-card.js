import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatCard({ title, value, icon: Icon, trend, trendLabel, color = "blue" }) {
  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600", 
    red: "text-red-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
    yellow: "text-yellow-600",
    gray: "text-gray-600"
  };

  const bgColorClasses = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    red: "bg-red-50", 
    purple: "bg-purple-50",
    orange: "bg-orange-50",
    yellow: "bg-yellow-50",
    gray: "bg-gray-50"
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${bgColorClasses[color]}`}>
          <Icon className={`w-6 h-6 ${colorClasses[color]}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${
            trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
          }`}>
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : trend < 0 ? (
              <TrendingDown className="w-4 h-4" />
            ) : null}
            <span className="font-medium">
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {trendLabel && (
          <p className="text-xs text-gray-500">{trendLabel}</p>
        )}
      </div>
    </div>
  );
} 