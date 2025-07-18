import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Simulate checking auth status (remove this if you don't need it)
    const timer = setTimeout(() => setIsCheckingAuth(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;