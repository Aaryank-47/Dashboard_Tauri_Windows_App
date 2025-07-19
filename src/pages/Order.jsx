import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FiMoon, FiSun, FiCalendar, FiDollarSign, FiShoppingBag } from "react-icons/fi";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import ReactPaginate from 'react-paginate';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const Order = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("today");
  const [isLoading, setIsLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const adminId = localStorage.getItem("adminId");
  
  const [orders, setOrders] = useState({
    today: [],
    month: [],
    year: []
  });

  const [dateFilter, setDateFilter] = useState({
    today: { start: new Date(), end: new Date() },
    month: { 
      start: new Date(new Date().setDate(1)), 
      end: new Date() 
    },
    year: { 
      start: new Date(new Date().getFullYear(), 0, 1), 
      end: new Date() 
    }
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const adminToken = localStorage.getItem("adminToken");
        
        const response = await fetch(
          `https://canteen-order-backend.onrender.com/api/v1/orders/get-all-orders/${adminId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${adminToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        
        if (data.success && data.orders) {
          const today = new Date();
          const todayStart = new Date(today.setHours(0, 0, 0, 0));
          
          const categorized = {
            today: data.orders.filter(order => 
              new Date(order.createdAt) >= todayStart
            ),
            month: data.orders.filter(order => 
              new Date(order.createdAt) >= new Date(new Date().setDate(1))
            ),
            year: data.orders
          };
          
          setOrders(categorized);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [adminId]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      
      const response = await fetch(
        `https://canteen-order-backend.onrender.com/api/v1/orders/admin-order-update/${orderId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      
      if (data.success) {
        setOrders(prev => {
          const updateOrderArray = (arr) => arr.map(order => 
            order._id === orderId ? { ...order, status: newStatus } : order
          );
          
          return {
            today: updateOrderArray(prev.today),
            month: updateOrderArray(prev.month),
            year: updateOrderArray(prev.year)
          };
        });

        toast.success(`Order status updated to ${newStatus}`);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const metrics = {
    totalOrders: orders.today.length,
    totalRevenue: orders.today.reduce((sum, order) => sum + parseFloat(order.totalPrice), 0).toFixed(2),
    avgOrderValue: orders.today.length > 0 
      ? (orders.today.reduce((sum, order) => sum + parseFloat(order.totalPrice), 0) / orders.today.length).toFixed(2)
      : "0.00"
  };

  const dailyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Orders',
      data: [12, 19, 8, 15, 22, 18, 14],
      backgroundColor: darkMode ? 'rgba(124, 58, 237, 0.7)' : 'rgba(124, 58, 237, 0.5)',
      borderColor: 'rgba(124, 58, 237, 1)',
      borderWidth: 1,
      borderRadius: 4
    }]
  };

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Revenue',
      data: [1200, 1900, 800, 1500, 2200, 1800, 1400, 2100, 1700, 1900, 2300, 2800],
      borderColor: darkMode ? 'rgba(16, 185, 129, 1)' : 'rgba(16, 185, 129, 0.7)',
      backgroundColor: 'transparent',
      tension: 0.3,
      borderWidth: 2
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#e2e8f0' : '#475569'
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: darkMode ? '#94a3b8' : '#64748b'
        }
      },
      y: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: darkMode ? '#94a3b8' : '#64748b'
        }
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return darkMode ? "bg-gray-700 text-yellow-400" : "bg-gray-200 text-yellow-800";
      case "preparing": return darkMode ? "bg-gray-700 text-blue-400" : "bg-gray-200 text-blue-800";
      case "ready": return darkMode ? "bg-gray-700 text-green-400" : "bg-gray-200 text-green-800";
      case "delivered": return darkMode ? "bg-gray-700 text-purple-400" : "bg-gray-200 text-purple-800";
      default: return darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filterOrdersByDate = (orders, startDate, endDate) => {
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    });
  };

  const currentOrders = filterOrdersByDate(
    orders[activeTab], 
    dateFilter[activeTab].start, 
    dateFilter[activeTab].end
  );
  const pageCount = Math.ceil(currentOrders.length / itemsPerPage);
  const currentItems = currentOrders.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 ${darkMode ? 'border-purple-500' : 'border-purple-600'}`}></div>
      </div>
    );
  }

  return (
     <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Orders Dashboard
            </h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage and analyze your orders
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-amber-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors`}
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
          </div>
        </div>

        

   {/* Metrics */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  {/* Total Orders Card */}
  <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300 hover:shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
    <div className="flex items-center justify-between">
      <div>
        <h3 className={`text-sm font-medium uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Orders</h3>
        <p className={`mt-2 text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{metrics.totalOrders}</p>
      </div>
      <div className={`p-3 rounded-full ${darkMode ? 'bg-purple-900/50' : 'bg-purple-100'} text-purple-500`}>
        <FiShoppingBag className="text-2xl" />
      </div>
    </div>
    <div className="mt-4 h-20">
      <Line 
        data={{
          labels: Array.from({ length: 7 }, (_, i) => i + 1),
          datasets: [{
            data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 10) + 1),
            borderColor: darkMode ? 'rgba(167, 139, 250, 1)' : 'rgba(124, 58, 237, 1)',
            backgroundColor: 'transparent',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0
          }]
        }} 
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { display: false },
            y: { display: false }
          }
        }} 
      />
    </div>
    <p className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      <span className={orders.today.length > 0 ? 'text-green-500' : 'text-gray-500'}>
        {orders.today.length > 0 ? '↑' : ''} {orders.today.length > 0 ? Math.floor(Math.random() * 20) + 5 : 0}% from yesterday
      </span>
    </p>
  </div>

  {/* Total Revenue Card */}
  <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300 hover:shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
    <div className="flex items-center justify-between">
      <div>
        <h3 className={`text-sm font-medium uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Revenue</h3>
        <p className={`mt-2 text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{metrics.totalRevenue}</p>
      </div>
      <div className={`p-3 rounded-full ${darkMode ? 'bg-blue-900/50' : 'bg-blue-100'} text-blue-500`}>
        <FiDollarSign className="text-2xl" />
      </div>
    </div>
    <div className="mt-4 h-20">
      <Line 
        data={{
          labels: Array.from({ length: 7 }, (_, i) => i + 1),
          datasets: [{
            data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 1000) + 500),
            borderColor: darkMode ? 'rgba(96, 165, 250, 1)' : 'rgba(59, 130, 246, 1)',
            backgroundColor: 'transparent',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0
          }]
        }} 
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { display: false },
            y: { display: false }
          }
        }} 
      />
    </div>
    <p className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      <span className={parseFloat(metrics.totalRevenue) > 0 ? 'text-green-500' : 'text-gray-500'}>
        {parseFloat(metrics.totalRevenue) > 0 ? '↑' : ''} {parseFloat(metrics.totalRevenue) > 0 ? Math.floor(Math.random() * 15) + 5 : 0}% from yesterday
      </span>
    </p>
  </div>

  {/* Average Order Value Card */}
  <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300 hover:shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
    <div className="flex items-center justify-between">
      <div>
        <h3 className={`text-sm font-medium uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg. Order Value</h3>
        <p className={`mt-2 text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{metrics.avgOrderValue}</p>
      </div>
      <div className={`p-3 rounded-full ${darkMode ? 'bg-green-900/50' : 'bg-green-100'} text-green-500`}>
        <FiDollarSign className="text-2xl" />
      </div>
    </div>
    <div className="mt-4 h-20">
      <Line 
        data={{
          labels: Array.from({ length: 7 }, (_, i) => i + 1),
          datasets: [{
            data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 200) + 100),
            borderColor: darkMode ? 'rgba(74, 222, 128, 1)' : 'rgba(16, 185, 129, 1)',
            backgroundColor: 'transparent',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0
          }]
        }} 
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { display: false },
            y: { display: false }
          }
        }} 
      />
    </div>
    <p className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      <span className={parseFloat(metrics.avgOrderValue) > 0 ? 'text-green-500' : 'text-gray-500'}>
        {parseFloat(metrics.avgOrderValue) > 0 ? '↑' : ''} {parseFloat(metrics.avgOrderValue) > 0 ? Math.floor(Math.random() * 10) + 2 : 0}% from yesterday
      </span>
    </p>
  </div>
</div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Daily Orders</h3>
            <div className="h-64">
              <Bar data={dailyData} options={chartOptions} />
            </div>
          </div>
          <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Monthly Revenue</h3>
            <div className="h-64">
              <Line data={monthlyData} options={chartOptions} />
            </div>
          </div>
        </div>

{/* Minimalist Tabs */}
<div className={`flex mb-6 border-b gap-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
  <button
    onClick={() => { setActiveTab("today"); setCurrentPage(0); }}
    className={`px-4 py-2 text-sm font-medium ${
      activeTab === "today" 
        ? darkMode 
          ? 'text-white border-b-2 border-white' 
          : 'text-gray-900 border-b-2 border-gray-900 bg-white'
        : darkMode 
          ? 'text-gray-400 hover:text-white' 
          : 'text-gray-500 hover:text-gray-900 bg-white'
    }`}
  >
    Today's Orders
  </button>
  
  <button
    onClick={() => { setActiveTab("month"); setCurrentPage(0); }}
    className={`px-4 py-2 text-sm font-medium ${
      activeTab === "month" 
        ? darkMode 
          ? 'text-white border-b-2 border-white' 
          : 'text-gray-900 border-b-2 border-gray-900 bg-white'
        : darkMode 
          ? 'text-gray-400 hover:text-white' 
          : 'text-gray-500 hover:text-gray-900 bg-white'
    }`}
  >
    Monthly Orders
  </button>
  
  <button
    onClick={() => { setActiveTab("year"); setCurrentPage(0); }}
    className={`px-4 py-2 text-sm font-medium ${
      activeTab === "year" 
        ? darkMode 
          ? 'text-white border-b-2 border-white' 
          : 'text-gray-900 border-b-2 border-gray-900 bg-white'
        : darkMode 
          ? 'text-gray-400 hover:text-white' 
          : 'text-gray-500 hover:text-gray-900 bg-white'
    }`}
  >
    Yearly Orders
  </button>
</div>

        {/* Date Filter */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <FiCalendar className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>From:</span>
            <input
              type="date"
              value={dateFilter[activeTab].start.toISOString().split('T')[0]}
              onChange={(e) => setDateFilter({
                ...dateFilter,
                [activeTab]: {
                  ...dateFilter[activeTab],
                  start: new Date(e.target.value)
                }
              })}
              className={`px-3 py-1 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-700'} w-full sm:w-auto`}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <FiCalendar className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>To:</span>
            <input
              type="date"
              value={dateFilter[activeTab].end.toISOString().split('T')[0]}
              onChange={(e) => setDateFilter({
                ...dateFilter,
                [activeTab]: {
                  ...dateFilter[activeTab],
                  end: new Date(e.target.value)
                }
              })}
              className={`px-3 py-1 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-700'} w-full sm:w-auto`}
            />
          </div>
        </div>


{/* Orders Table */}
<div className={`rounded-lg shadow overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <tr>
          <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Order ID
          </th>
          <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Customer
          </th>
          <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Items
          </th>
          <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Total
          </th>
          <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Date
          </th>
          <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Status
          </th>
          <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Actions
          </th>
        </tr>
      </thead>
      <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {currentItems.length > 0 ? (
          currentItems.map((order) => (
            <tr key={order._id} className={`${darkMode ? 'hover:bg-gray-700/80' : 'hover:bg-gray-50'} transition-colors`}>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-sm font-medium ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                  #{order.orderNumber}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {order.userInfo?.name || 'N/A'}
                  </span>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {order.userInfo?.email || ''}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1 max-w-xs">
                  {order.items.map((item, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} flex items-center gap-1`}
                    >
                      <span className="truncate max-w-[100px]">{item.foodName}</span>
                      <span className={`font-bold ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>×{item.quantity}</span>
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-sm font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  ₹{order.totalPrice}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {formatDate(order.createdAt)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </td>
                 {/* Table rows... */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <select
                            value={order.status.toLowerCase()}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className={`text-xs border rounded-md px-3 py-1.5 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-700'} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                          >
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <div className={`flex flex-col items-center justify-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <FiShoppingBag className="w-12 h-12 mb-4 opacity-50" />
                        <p className="text-lg font-medium">No orders found</p>
                        <p className="text-sm">Try adjusting your date filters</p>
                      </div>
                    </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

{pageCount > 1 && (
          <div className="flex justify-center mt-6">
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              breakLabel={'...'}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName="flex items-center gap-1"
              pageLinkClassName="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              activeLinkClassName="bg-purple-600 text-white border-purple-600"
              previousLinkClassName="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              nextLinkClassName="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              disabledLinkClassName="opacity-50 cursor-not-allowed"
              forcePage={currentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;