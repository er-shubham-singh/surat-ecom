import React from "react";
import WelcomeCard from "../Components/DashboardComps/WelcomeCard";
import MonthlyOverview from "../Components/DashboardComps/MonthlyOverview";
import SalesOverview from "../Components/DashboardComps/SalesOverview";
import TotalEarnings from "../Components/DashboardComps/TotalEarnings";
import KeyMetrics from "../Components/DashboardComps/KeyMetrics";
import NewCustomers from "../Components/DashboardComps/NewCustomers";
import RecentOrders from "../Components/DashboardComps/RecentOrders";
import RecentlyAddedProducts from "../Components/DashboardComps/RecentlyAddedProducts";
import SalesOverTimeChart from "../Components/DashboardComps/SalesOverTimeChart";

const Dashboard = () => {
  // Sample data
  const weeklyData = [
    { day: "Sun", sales: 0 },
    { day: "Mon", sales: 1 },
    { day: "Tue", sales: 1 },
    { day: "Wed", sales: 1 },
    { day: "Thu", sales: 1 },
    { day: "Fri", sales: 1 },
    { day: "Sat", sales: 1 },
  ];

  const salesComparison = {
    percentage: "NaN%",
    text: "Sales have increased by +NaN% compared to the previous period.",
  };

  const monthlyStats = {
    sales: 4,
    customers: 10,
    products: 28,
    revenue: 19340,
  };

  const keyMetrics = {
    totalProfit: 14340,
    profitChange: 42,
    refunds: 0,
    refundsChange: -15,
    newOrders: 0,
    ordersChange: 12,
    salesQueries: 0,
  };

  const newCustomers = [
    { email: "afreenidreesi13@gmail.com" },
    { email: "Leyapersonal123@gmail.com" },
    { email: "gouravs7ingh.081@gmail.com" },
    { email: "balakrishnan82y@gmail.com" },
    { email: "vishalyadav020202@gmail.com" },
  ];

  const recentOrders = [
    { title: "", price: 898, orderId: "ORD-1", status: "PENDING" },
    { title: "", price: 0, orderId: "ORD-2", status: "PENDING" },
    { title: "", price: 1498, orderId: "ORD-3", status: "PENDING" },
    { title: "", price: 6938, orderId: "ORD-4", status: "PENDING" },
    { title: "", price: 1498, orderId: "ORD-5", status: "PENDING" },
    { title: "", price: 249, orderId: "ORD-6", status: "PENDING" },
    { title: "", price: 249, orderId: "ORD-7", status: "PENDING" },
    { title: "", price: 249, orderId: "ORD-8", status: "PENDING" },
    { title: "", price: 9170, orderId: "ORD-9", status: "DELIVERED" },
  ];

  const recentProducts = [
    {
      title: "Women Asymmetric Pink Dress",
      brand: "MADAME",
      category: "dress",
      price: 1299,
      quantity: 100,
      image: null,
    },
    {
      title: "Women Maxi Blue Dress",
      brand: "Daevish",
      category: "dress",
      price: 341,
      quantity: 100,
      image: null,
    },
    {
      title: "Women A-line Purple Dress",
      brand: "ZWERLON",
      category: "dress",
      price: 499,
      quantity: 100,
      image: null,
    },
    {
      title: "Women Fit and Flare Black Dress",
      brand: "Purshottam Wala",
      category: "dress",
      price: 359,
      quantity: 100,
      image: null,
    },
    {
      title: "Women Fit and Flare Blue Dress",
      brand: "Purshottam Wala",
      category: "dress",
      price: 359,
      quantity: 100,
      image: null,
    },
  ];

  const salesOverTimeData = [
    { month: "Jan", sales: 35000 },
    { month: "Feb", sales: 55000 },
    { month: "Mar", sales: 45000 },
    { month: "Apr", sales: 75000 },
    { month: "May", sales: 60000 },
    { month: "Jun", sales: 40000 },
    { month: "Jul", sales: 65000 },
  ];

  const salesPerformance = {
    percentage: 45,
  };

  return (
    <div className="min-h-screen bg-[#0f1120] p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <WelcomeCard
            storeName="Fluteon"
            earnings="19,340"
            growthPercentage={48.5}
          />
          <MonthlyOverview growth={48.5} stats={monthlyStats} />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <SalesOverview
              weeklyData={weeklyData}
              comparison={salesComparison}
            />
          </div>
          <div className="lg:col-span-1">
            <TotalEarnings
              amount={19340}
              growthPercentage={12}
              comparedToLastYear="Compared to last year"
            />
          </div>
          <div className="lg:col-span-1">
            <KeyMetrics metrics={keyMetrics} />
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <NewCustomers customers={newCustomers} />
          <RecentOrders orders={recentOrders} />
        </div>

        {/* Fourth Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentlyAddedProducts products={recentProducts} />
          </div>
          <div className="lg:col-span-1">
            <SalesOverTimeChart
              data={salesOverTimeData}
              performance={salesPerformance}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
