import React from "react";
import { TrendingUp } from "lucide-react";

const TotalEarnings = ({ amount, growthPercentage, comparedToLastYear }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Total Earnings</h2>
        <button className="text-slate-400 hover:text-white">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
      </div>

      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-4xl font-bold text-white">
          ₹{amount.toLocaleString()}
        </span>
        <div className="flex items-center gap-1 text-green-500">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+{growthPercentage}%</span>
        </div>
      </div>

      <p className="text-slate-400 text-sm mb-8">{comparedToLastYear}</p>

      <p className="text-slate-400 text-sm">No top category data available.</p>
    </div>
  );
};

export default TotalEarnings;
