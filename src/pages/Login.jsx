import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import Lottie from "lottie-react";
import animationData from "../assets/Food App Interaction.json";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion"; // ✅ Import framer-motion

const LoginPage = () => {
  const [formData, setFormData] = useState({
    adminEmail: "",
    adminPassword: "",
  });
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loginMutation = useMutation({
    mutationFn: async (loginData) => {
      const response = await fetch('https://canteen-order-backend.onrender.com/api/v1/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Login failed");
      }

      return await response.json();
    },
    onSuccess: (data) => {
      if (!data) {
        console.log("There is problem in fetching the data");
        return;
      }

      setUser(data.adminInfo);
      localStorage.setItem("admin", JSON.stringify(data.adminInfo));
      localStorage.setItem("adminId", data.adminId);
      localStorage.setItem("adminToken", data.adminToken);

      toast.success("Logged in successfully");
      navigate('/');
    },
    onError: (error) => {
      console.error("Login error:", error.message);
      toast.error(error.message);
    }
  });

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = await loginMutation.mutateAsync(formData);
    navigate('/');
  } catch (error) {
  }
};

  return (
    <div className=" h-full bg-white flex flex-col md:flex-row">
      
      {/* 👈 Left side with Lottie animation + Animation from left */}
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full h-full md:w-1/2 overflow-hidden bg-black flex items-center justify-center p-8 rounded-tl-[45px] rounded-br-[45px]"
      >
        <div className="max-w-md w-full">
          <Lottie 
            animationData={animationData} 
            loop={true} 
            className="w-full h-auto"
          />
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-bold text-white">Admin Portal</h2>
            <p className="text-gray-300 mt-2">Manage your canteen operations efficiently</p>
          </div>
        </div>
      </motion.div>

      {/* 👉 Right side with login form + Animation from right */}
      <motion.div
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2 flex items-center justify-center p-8"
      >   
      
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
  <div className="flex justify-center mb-4">
    <img
      src="https://t3.ftcdn.net/jpg/02/41/30/72/360_F_241307210_MjjaJC3SJy2zJZ6B7bKGMRsKQbdwRSze.jpg"
      alt="Admin Logo"
      className="h-h-24 w-24 rounded-full object-cover border-2 border-gray-300 shadow-lg"
    />
  </div>
  <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
  <p className="text-gray-600 mt-2">Sign in to your admin account</p>
</div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="adminEmail"
                name="adminEmail"
                type="email"
                required
                value={formData.adminEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="adminPassword"
                name="adminPassword"
                type="password"
                required
                value={formData.adminPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-black hover:text-gray-700">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all ${loginMutation.isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loginMutation.isPending ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-black hover:text-gray-700">
              Request access
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
