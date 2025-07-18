import { BellIcon, CheckIcon } from "../components/Icons.jsx";
import { useState } from "react";

const Notification = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Order Received",
      message: "Order #1042 for 2 Cheese Burgers and Fries",
      time: "2 minutes ago",
      read: false,
      type: "order",
    },
    {
      id: 2,
      title: "Low Stock Alert",
      message: "Only 3 Chicken Sandwiches left in stock",
      time: "1 hour ago",
      read: false,
      type: "stock",
    },
    {
      id: 3,
      title: "Customer Feedback",
      message: "John Doe rated their order 4 stars",
      time: "3 hours ago",
      read: true,
      type: "feedback",
    },
    {
      id: 4,
      title: "New Order Received",
      message: "Order #1041 for Veg Pizza and Garlic Bread",
      time: "5 hours ago",
      read: true,
      type: "order",
    },
    {
      id: 5,
      title: "System Update Available",
      message: "New version v1.2.0 is ready to install",
      time: "1 day ago",
      read: true,
      type: "system",
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return (
          <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
            <BellIcon className="w-5 h-5" />
          </div>
        );
      case "stock":
        return (
          <div className="p-2 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
        );
      case "feedback":
        return (
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
        );
      case "system":
        return (
          <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            <BellIcon className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Notifications
        </h1>
        <button
          onClick={markAllAsRead}
          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${
                !notification.read ? "border-l-4 border-purple-600" : ""
              }`}
            >
              <div className="flex items-start">
                {getNotificationIcon(notification.type)}
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {notification.message}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    title="Mark as read"
                  >
                    <CheckIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              No notifications available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;