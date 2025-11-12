import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const SalesOverTimeChart = ({ data, performance }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Sales Over Time</h2>
        <button className="text-slate-400 hover:text-white">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
      </div>

      {/* Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8" }}
            />
            <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
            <Bar dataKey="sales" fill="#a855f7" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Text */}
      <div className="mb-4">
        <div className="text-4xl font-bold text-white mb-2">
          {performance.percentage}%
        </div>
        <p className="text-slate-300">
          Your sales performance is{" "}
          <span className="font-bold">{performance.percentage}%</span> 😊 better
          compared to last month
        </p>
      </div>

      {/* Details Button */}
      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors">
        DETAILS
      </button>
    </div>
  );
};

export default SalesOverTimeChart;
