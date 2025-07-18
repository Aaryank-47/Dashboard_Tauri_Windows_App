import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  RadialLinearScale,
} from "chart.js";
import { Bar, Pie, Line, Radar, Doughnut } from "react-chartjs-2";
import { Player } from "@lottiefiles/react-lottie-player";
import noDataAnimation from "../assets/no_animationData.json"; // Make sure you have this file

// Register all necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  RadialLinearScale
);

// A reusable mini chart for the metric cards
const MiniChart = ({ data, strokeColor, fillColor }) => {
  const chartData = {
    labels: data.map((_, i) => i),
    datasets: [
      {
        data: data,
        borderColor: strokeColor,
        backgroundColor: fillColor,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return <Line data={chartData} options={options} />;
};

const Dashboard = () => {
  // Enhanced state with trend data for metric cards
  const [stats, setStats] = useState({
    todayOrders: 152,
    revenueToday: 85300,
    newCustomers: 12,
    topSellingFood: "Gourmet Burger",
    trends: {
      orders: [110, 120, 145, 130, 140, 152],
      revenue: [65000, 70000, 75000, 82000, 80000, 85300],
      customers: [5, 7, 6, 9, 11, 12],
      topFood: [30, 40, 35, 50, 45, 60],
    },
  });

  const [liveData, setLiveData] = useState([45, 60, 55, 70, 65, 80, 75, 90, 85, 70]);

  // Simulate live data updates
  useEffect(() => {
    const liveStatsInterval = setInterval(() => {
        setStats(prevStats => {
            const getNextValue = (currentVal, variance, integer = true) => {
                const change = (Math.random() - 0.45) * variance;
                const newValue = currentVal + change;
                return integer ? Math.max(0, Math.round(newValue)) : Math.max(0, newValue);
            };

            const newOrdersTrend = [...prevStats.trends.orders.slice(1), getNextValue(prevStats.trends.orders.at(-1), 10)];
            const newRevenueTrend = [...prevStats.trends.revenue.slice(1), getNextValue(prevStats.trends.revenue.at(-1), 5000)];
            const newCustomerVal = Math.random() > 0.95 ? prevStats.trends.customers.at(-1) + 1 : prevStats.trends.customers.at(-1);
            const newCustomersTrend = [...prevStats.trends.customers.slice(1), newCustomerVal];
            const newTopFoodTrend = [...prevStats.trends.topFood.slice(1), getNextValue(prevStats.trends.topFood.at(-1), 5)];

            return {
                ...prevStats,
                todayOrders: newOrdersTrend.at(-1),
                revenueToday: newRevenueTrend.at(-1),
                newCustomers: newCustomersTrend.at(-1),
                trends: {
                    orders: newOrdersTrend,
                    revenue: newRevenueTrend,
                    customers: newCustomersTrend,
                    topFood: newTopFoodTrend,
                }
            };
        });
    }, 2500);

    return () => clearInterval(liveStatsInterval);
  }, []);


  // --- CHART DATA AND OPTIONS ---

  const chartColors = {
    primary: '#8b5cf6',
    primary_light: 'rgba(139, 92, 246, 0.1)',
    primary_gradient_start: 'rgba(139, 92, 246, 0.4)',
    primary_gradient_end: 'rgba(139, 92, 246, 0)',
    green: '#10b981',
    green_light: 'rgba(16, 185, 129, 0.1)',
    blue: '#3b82f6',
    blue_light: 'rgba(59, 130, 246, 0.1)',
    pink: '#ec4899',
    pink_light: 'rgba(236, 72, 153, 0.1)',
    doughnut: ['#8b5cf6', '#34d399', '#60a5fa', '#f472b6', '#f59e0b'],
    text: '#6b7280',
    grid: 'rgba(229, 231, 235, 0.5)'
  };
  
  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: chartColors.text,
          font: { size: 12 },
        },
      },
    },
    scales: {
      y: {
        grid: { color: chartColors.grid },
        ticks: { color: chartColors.text },
      },
      x: {
        grid: { color: chartColors.grid },
        ticks: { color: chartColors.text },
      },
    },
  };

  const liveChartData = {
    labels: liveData.map((_, i) => `${i + 1}s`),
    datasets: [{
      label: "Live Orders",
      data: liveData,
      borderColor: chartColors.primary,
      backgroundColor: chartColors.primary_gradient_start,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: chartColors.primary,
      pointBorderColor: "#fff",
      pointRadius: 0,
      pointHoverRadius: 6,
      borderWidth: 2,
    }],
  };
  
  const doughnutData = {
    labels: ['Pizza', 'Burger', 'Pasta', 'Salad', 'Drinks'],
    datasets: [{
      data: [35, 25, 20, 15, 5],
      backgroundColor: chartColors.doughnut,
      borderColor: '#fff',
      borderWidth: 4,
      hoverBorderWidth: 6
    }],
  };
  
  const horizontalBarData = {
    labels: ['6-9 AM', '9-12 PM', '12-3 PM', '3-6 PM', '6-9 PM', '9-12 AM'],
    datasets: [{
      label: 'Orders',
      data: [20, 45, 60, 50, 75, 30],
      backgroundColor: chartColors.doughnut,
      borderRadius: 6
    }],
  };
  
  const areaChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Orders',
      data: [650, 590, 800, 810, 560, 550],
      fill: true,
      backgroundColor: chartColors.primary_gradient_start,
      borderColor: chartColors.primary,
      tension: 0.4,
    }],
  };

  const radarData = {
    labels: ['Breakfast', 'Lunch', 'Snacks', 'Dinner', 'Late Night'],
    datasets: [{
      label: 'Order Intensity',
      data: [65, 90, 70, 85, 40],
      backgroundColor: 'rgba(236, 72, 153, 0.2)',
      borderColor: chartColors.pink,
      pointBackgroundColor: chartColors.pink,
      pointBorderColor: '#fff',
      pointHoverRadius: 7,
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: chartColors.pink,
    }],
  };


  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

       
        {/* METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-lg hover:shadow-purple-200/60 transition-all duration-300 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Today's Orders</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.todayOrders}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-200/70">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
            </div>
            <div className="mt-4 h-16">
              <MiniChart data={stats.trends.orders} strokeColor={chartColors.primary} fillColor={chartColors.primary_light} />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-lg hover:shadow-green-200/60 transition-all duration-300 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Revenue Today</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">₹{stats.revenueToday.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-full bg-green-200/70">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
            <div className="mt-4 h-16">
              <MiniChart data={stats.trends.revenue} strokeColor={chartColors.green} fillColor={chartColors.green_light} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg hover:shadow-blue-200/60 transition-all duration-300 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">New Customers</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.newCustomers}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-200/70">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
            </div>
            <div className="mt-4 h-16">
              <MiniChart data={stats.trends.customers} strokeColor={chartColors.blue} fillColor={chartColors.blue_light} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-white rounded-2xl shadow-lg hover:shadow-pink-200/60 transition-all duration-300 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Top Selling</p>
                <p className="text-xl font-semibold text-gray-800 mt-2 truncate">{stats.topSellingFood}</p>
              </div>
              <div className="p-3 rounded-full bg-pink-200/70">
                 <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
            </div>
            <div className="mt-4 h-16">
               <MiniChart data={stats.trends.topFood} strokeColor={chartColors.pink} fillColor={chartColors.pink_light} />
            </div>
          </div>
        </div>

        {/* Live Orders Graph */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Live Orders Tracking</h2>
            <span className="flex items-center px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
              <span className="w-2 h-2 mr-2 bg-purple-500 rounded-full animate-pulse"></span>
              Live
            </span>
          </div>
          <div className="h-64">
            <Line data={liveChartData} options={{...commonChartOptions, plugins: { legend: { display: false }}}} />
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Food Popularity Doughnut */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Food Popularity</h2>
            <div className="h-80">
              <Doughnut data={doughnutData} options={{...commonChartOptions, cutout: '70%', plugins: {legend: {position: 'right'}}}} />
            </div>
          </div>

          {/* Peak Hours Horizontal Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Peak Order Hours</h2>
            <div className="h-80">
              <Bar data={horizontalBarData} options={{...commonChartOptions, indexAxis: 'y', plugins: {legend: {display: false}}}} />
            </div>
          </div>

          {/* Order Trends Area Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Order Trends</h2>
            <div className="h-80">
              <Line data={areaChartData} options={{...commonChartOptions, plugins: {legend: {display: false}}}} />
            </div>
          </div>
          
          {/* Order Intensity Radar Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Intensity by Meal Time</h2>
            <div className="h-80">
              <Radar data={radarData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  r: {
                    angleLines: { color: chartColors.grid },
                    grid: { color: chartColors.grid },
                    pointLabels: { color: chartColors.text, font: {size: 14}},
                    ticks: { display: false }
                  }
                }
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;