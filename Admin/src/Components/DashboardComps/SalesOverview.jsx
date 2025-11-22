import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SalesOverview = ({ weeklyData, comparison }) => {
  const [activeTab, setActiveTab] = useState("WEEKLY");

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Sales Overview</h2>
        <button className="text-slate-400 hover:text-white">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 mb-6 border-b border-slate-700/50">
        <button
          onClick={() => setActiveTab("WEEKLY")}
          className={`pb-3 font-medium transition-colors ${
            activeTab === "WEEKLY"
              ? "text-purple-500 border-b-2 border-purple-500"
              : "text-slate-400 hover:text-white"
          }`}
        >
          WEEKLY
        </button>
        <button
          onClick={() => setActiveTab("MONTHLY")}
          className={`pb-3 font-medium transition-colors ${
            activeTab === "MONTHLY"
              ? "text-purple-500 border-b-2 border-purple-500"
              : "text-slate-400 hover:text-white"
          }`}
        >
          MONTHLY
        </button>
        <button
          onClick={() => setActiveTab("YEARLY")}
          className={`pb-3 font-medium transition-colors ${
            activeTab === "YEARLY"
              ? "text-purple-500 border-b-2 border-purple-500"
              : "text-slate-400 hover:text-white"
          }`}
        >
          YEARLY
        </button>
      </div>

      {/* Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#ec4899"
              strokeWidth={2}
              dot={{ fill: "#ec4899", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Comparison */}
      <div className="bg-slate-700/30 rounded-lg p-4">
        <p className="text-2xl font-bold text-white">{comparison.percentage}</p>
        <p className="text-slate-400 text-sm mt-1">{comparison.text}</p>
      </div>
    </div>
  );
};

export default SalesOverview;
