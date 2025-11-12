import React from "react";
import { BarChart3, DollarSign, ShoppingBag, HelpCircle } from "lucide-react";

const MetricCard = ({
  icon: Icon,
  title,
  value,
  change,
  changeType,
  subtitle,
  iconBg,
}) => (
  <div className="bg-slate-700/30 rounded-lg p-4">
    <div className="flex items-center justify-between mb-3">
      <div
        className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <button className="text-slate-400 hover:text-white">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>
    </div>

    <h3 className="text-white font-medium mb-2">{title}</h3>

    <div className="flex items-baseline gap-2 mb-1">
      <span className="text-2xl font-bold text-white">{value}</span>
      <span
        className={`text-sm font-medium ${
          changeType === "positive" ? "text-green-500" : "text-red-500"
        }`}
      >
        {change}
      </span>
    </div>

    <p className="text-slate-400 text-xs">{subtitle}</p>
  </div>
);

const KeyMetrics = ({ metrics }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Key Metrics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricCard
          icon={BarChart3}
          title="Total Profit"
          value={`$${metrics.totalProfit.toLocaleString()}`}
          change={`+${metrics.profitChange}%`}
          changeType="positive"
          subtitle="Weekly Profit"
          iconBg="bg-green-600"
        />

        <MetricCard
          icon={DollarSign}
          title="Refunds"
          value={`$${metrics.refunds}`}
          change={`${metrics.refundsChange}%`}
          changeType="negative"
          subtitle="Past Month"
          iconBg="bg-pink-600"
        />

        <MetricCard
          icon={ShoppingBag}
          title="New Orders"
          value={metrics.newOrders}
          change={`+${metrics.ordersChange}%`}
          changeType="positive"
          subtitle="Weekly Orders"
          iconBg="bg-purple-600"
        />

        <MetricCard
          icon={HelpCircle}
          title="Sales Queries"
          value={metrics.salesQueries}
          change="--"
          changeType="neutral"
          subtitle="Last Week"
          iconBg="bg-yellow-600"
        />
      </div>
    </div>
  );
};

export default KeyMetrics;
