import React from "react";
import { TrendingUp, Users, Package, DollarSign } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-3">
    <div
      className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}
    >
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const MonthlyOverview = ({ growth, stats }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Monthly Overview</h2>
        <button className="text-slate-400 hover:text-white">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
      </div>

      <p className="text-slate-300 mb-6">
        Total <span className="font-bold">{growth}% growth</span> 😊 this month
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={TrendingUp}
          label="Sales"
          value={stats.sales}
          color="bg-purple-600"
        />
        <StatCard
          icon={Users}
          label="Customers"
          value={stats.customers}
          color="bg-green-600"
        />
        <StatCard
          icon={Package}
          label="Products"
          value={stats.products}
          color="bg-yellow-600"
        />
        <StatCard
          icon={DollarSign}
          label="Revenue"
          value={`$${stats.revenue}`}
          color="bg-cyan-600"
        />
      </div>
    </div>
  );
};

export default MonthlyOverview;
