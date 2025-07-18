import { useState } from "react";
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
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { FiDownload, FiSun, FiMoon, FiChevronDown, FiCalendar } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("week");
  const [darkMode, setDarkMode] = useState(false);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
  const [endDate, setEndDate] = useState(new Date());

  // Sample data
  const salesData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Sales ($)",
        data: [650, 590, 800, 810, 560, 550, 400],
        backgroundColor: darkMode ? "rgba(124, 58, 237, 0.7)" : "rgba(124, 58, 237, 0.5)",
        borderColor: "rgba(124, 58, 237, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const foodPopularityData = {
    labels: ["Burger", "Pizza", "Sandwich", "Pasta", "Salad"],
    datasets: [
      {
        label: "Orders",
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          darkMode ? "rgba(239, 68, 68, 0.7)" : "rgba(239, 68, 68, 0.5)",
          darkMode ? "rgba(59, 130, 246, 0.7)" : "rgba(59, 130, 246, 0.5)",
          darkMode ? "rgba(234, 179, 8, 0.7)" : "rgba(234, 179, 8, 0.5)",
          darkMode ? "rgba(16, 185, 129, 0.7)" : "rgba(16, 185, 129, 0.5)",
          darkMode ? "rgba(139, 92, 246, 0.7)" : "rgba(139, 92, 246, 0.5)",
        ],
        borderColor: [
          "rgba(239, 68, 68, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(234, 179, 8, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(139, 92, 246, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const revenueTrendData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [4500, 5200, 4800, 6000],
        fill: false,
        backgroundColor: "rgba(245, 158, 11, 0.5)",
        borderColor: "rgba(245, 158, 11, 1)",
        tension: 0.3,
        pointBackgroundColor: "rgba(245, 158, 11, 1)",
        pointBorderColor: darkMode ? "#1e293b" : "#fff",
        pointHoverRadius: 6,
        pointRadius: 4,
        borderWidth: 2,
      },
    ],
  };

  const peakHoursData = {
    labels: [
      "8-9 AM",
      "9-10 AM",
      "10-11 AM",
      "11-12 PM",
      "12-1 PM",
      "1-2 PM",
      "2-3 PM",
      "3-4 PM",
    ],
    datasets: [
      {
        label: "Orders",
        data: [10, 25, 35, 45, 60, 40, 30, 20],
        backgroundColor: darkMode ? "rgba(16, 185, 129, 0.7)" : "rgba(16, 185, 129, 0.5)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Chart options with dark mode support
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#e2e8f0' : '#475569',
          font: {
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
        titleColor: darkMode ? '#e2e8f0' : '#1e293b',
        bodyColor: darkMode ? '#cbd5e1' : '#475569',
        borderColor: darkMode ? '#334155' : '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 5,
      }
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: darkMode ? '#94a3b8' : '#64748b',
        }
      },
      y: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: darkMode ? '#94a3b8' : '#64748b',
        }
      }
    }
  };

  const pieChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        position: 'right',
      }
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Restaurant Analytics
            </h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Insights and performance metrics
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-amber-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            
            {/* Date Range Picker */}
            <div className={`flex items-center gap-2 border ${darkMode ? 'border-gray-700' : 'border-gray-300'} rounded-lg p-2`}>
              <FiCalendar className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={endDate}
                className={`bg-transparent ${darkMode ? 'text-white' : 'text-gray-900'} w-28 focus:outline-none`}
              />
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>to</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={new Date()}
                className={`bg-transparent ${darkMode ? 'text-white' : 'text-gray-900'} w-28 focus:outline-none`}
              />
            </div>
            
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className={`appearance-none pl-3 pr-8 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-white hover:border-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'} focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors`}
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
              <FiChevronDown 
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} 
              />
            </div>
            
            <button className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white transition-colors`}>
              <FiDownload size={18} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow transition-all hover:shadow-md`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Revenue</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'}`}>+12%</span>
            </div>
            <p className={`mt-2 text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>$20,450</p>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              {formatDate(startDate)} - {formatDate(endDate)}
            </p>
            <div className={`mt-4 h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600" style={{ width: '72%' }}></div>
            </div>
          </div>
          
          <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow transition-all hover:shadow-md`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Orders</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'}`}>+8%</span>
            </div>
            <p className={`mt-2 text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>1,245</p>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              {formatDate(startDate)} - {formatDate(endDate)}
            </p>
            <div className={`mt-4 h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600" style={{ width: '65%' }}></div>
            </div>
          </div>
          
          <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow transition-all hover:shadow-md`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg. Order Value</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800'}`}>-2%</span>
            </div>
            <p className={`mt-2 text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>$16.42</p>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              vs. $16.75 last period
            </p>
            <div className={`mt-4 h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600" style={{ width: '58%' }}></div>
            </div>
          </div>
          
          <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow transition-all hover:shadow-md`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Customer Satisfaction</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'}`}>+5%</span>
            </div>
            <p className={`mt-2 text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>4.8/5</p>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              94% positive reviews
            </p>
            <div className={`mt-4 h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600" style={{ width: '94%' }}></div>
            </div>
          </div>
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Sales Overview */}
          <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow transition-all hover:shadow-md`}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sales Overview</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  {formatDate(startDate)} - {formatDate(endDate)}
                </p>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>Weekly</span>
            </div>
            <div className="h-80">
              <Bar data={salesData} options={chartOptions} />
            </div>
          </div>
          
          {/* Food Popularity */}
          <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow transition-all hover:shadow-md`}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Food Popularity</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  {formatDate(startDate)} - {formatDate(endDate)}
                </p>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>Top 5 Items</span>
            </div>
            <div className="h-80">
              <Pie data={foodPopularityData} options={pieChartOptions} />
            </div>
          </div>
        </div>

        {/* Secondary Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Revenue Trend */}
          <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow transition-all hover:shadow-md`}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Revenue Trend</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  {formatDate(startDate)} - {formatDate(endDate)}
                </p>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>4 Weeks</span>
            </div>
            <div className="h-80">
              <Line data={revenueTrendData} options={chartOptions} />
            </div>
          </div>
          
          {/* Peak Order Hours */}
          <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow transition-all hover:shadow-md`}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Peak Order Hours</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  {formatDate(startDate)} - {formatDate(endDate)}
                </p>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>Daily Average</span>
            </div>
            <div className="h-80">
              <Bar data={peakHoursData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;