import { useState } from "react";
import { FiStar, FiClock, FiCalendar, FiFilter, FiMessageSquare, FiMoon, FiSun } from "react-icons/fi";
import { IoMdTime } from "react-icons/io";

const Feedback = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [filterRating, setFilterRating] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const feedbackList = [
    {
      id: 1,
      customer: "John Doe",
      orderId: 1001,
      rating: 4,
      comment: "The burger was delicious but the fries were a bit cold. Delivery was faster than expected though!",
      date: "2023-05-14",
      time: "18:30",
    },
    {
      id: 2,
      customer: "Jane Smith",
      orderId: 1002,
      rating: 5,
      comment: "Excellent pizza! Will definitely order again. The crust was perfectly crispy and toppings were fresh.",
      date: "2023-05-14",
      time: "12:45",
    },
    {
      id: 3,
      customer: "Mike Johnson",
      orderId: 1003,
      rating: 3,
      comment: "Sandwich was okay, but the bread was a bit dry. The portion size was generous though.",
      date: "2023-05-13",
      time: "19:15",
    },
    {
      id: 4,
      customer: "Sarah Williams",
      orderId: 1004,
      rating: 2,
      comment: "Pasta was overcooked and salad was not fresh. Disappointed with this order.",
      date: "2023-05-12",
      time: "13:20",
    },
    {
      id: 5,
      customer: "David Brown",
      orderId: 1005,
      rating: 5,
      comment: "Best Caesar salad I've had in a long time! The dressing was perfect and the chicken was tender.",
      date: "2023-05-12",
      time: "11:30",
    },
  ];

  // Calculate metrics
  const totalFeedback = feedbackList.length;
  const todayFeedback = feedbackList.filter(fb => fb.date === "2023-05-14").length;
  const averageRating = (feedbackList.reduce((sum, fb) => sum + fb.rating, 0) / totalFeedback).toFixed(1);
  
  // Filter feedback by rating and tab
  const filteredFeedback = feedbackList.filter(fb => {
    const ratingMatch = filterRating === "all" || fb.rating === parseInt(filterRating);
    const tabMatch = activeTab === "all" || 
                    (activeTab === "today" && fb.date === "2023-05-14") ||
                    (activeTab === "critical" && fb.rating <= 2);
    return ratingMatch && tabMatch;
  });

  // Format date for display
  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Customer Feedback
            </h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Insights from your customers
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-amber-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors`}
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            
            <div className="relative flex items-center">
              <FiFilter className={`absolute left-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className={`pl-10 pr-8 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-700'} focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none`}
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow transition-all hover:shadow-md`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Feedback</h3>
              <FiMessageSquare className={`${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
            </div>
            <p className={`mt-2 text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{totalFeedback}</p>
            <div className={`mt-4 h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow transition-all hover:shadow-md`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Today's Feedback</h3>
              <FiCalendar className={`${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            </div>
            <p className={`mt-2 text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{todayFeedback}</p>
            <div className={`mt-4 h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600" style={{ width: `${(todayFeedback/totalFeedback)*100}%` }}></div>
            </div>
          </div>
          
          <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow transition-all hover:shadow-md`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg. Rating</h3>
              <div className="flex items-center">
                <FiStar className={`${darkMode ? 'text-amber-300' : 'text-amber-500'}`} />
                <span className={`ml-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{averageRating}</span>
              </div>
            </div>
            <p className={`mt-2 text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{averageRating}/5</p>
            <div className={`mt-4 h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600" style={{ width: `${(averageRating/5)*100}%` }}></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex mb-6 rounded-lg p-1  gap-16 ${darkMode ? 'bg-gray-800' : 'bg-gray-0'}`}>
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === "all" ? (darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 shadow') : (darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-900 hover:text-gray-900 bg-white')}`}
          >
            All Feedback
          </button>
          <button
            onClick={() => setActiveTab("today")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === "today" ? (darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 shadow') : (darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-900 hover:text-gray-900 bg-white')}`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab("critical")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === "critical" ? (darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 shadow') : (darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-900 hover:text-gray-900 bg-white')}`}
          >
            Critical
          </button>
        </div>

        {/* Feedback List */}
        <div className="space-y-4">
          {filteredFeedback.length > 0 ? (
            filteredFeedback.map((feedback) => (
              <div
                key={feedback.id}
                className={`p-5 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow transition-all hover:shadow-md`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {feedback.customer}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                      Order #{feedback.orderId} • {formatDate(feedback.date)} • {feedback.time}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-5 h-5 ${i < feedback.rating ? (darkMode ? 'text-amber-400' : 'text-amber-500') : (darkMode ? 'text-gray-600' : 'text-gray-300')}`}
                        fill={i < feedback.rating ? (darkMode ? '#fbbf24' : '#f59e0b') : 'none'}
                      />
                    ))}
                  </div>
                </div>
                <p className={`mt-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feedback.comment}
                </p>
                <div className="mt-3 flex items-center text-sm">
                  <IoMdTime className={`mr-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    Submitted at {feedback.time}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className={`p-8 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow text-center`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
                <FiMessageSquare className={`w-8 h-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <h3 className={`text-lg font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                No feedback found
              </h3>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                Try adjusting your filters to see more results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;