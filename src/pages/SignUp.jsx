import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import Lottie from "lottie-react";
import animationData from "../assets/Delivery.json"; // Adjust path as needed

const SignupPage = () => {
  const [formData, setFormData] = useState({
    adminName: "",
    adminEmail: "",
    collegeName: "",
    phoneNumber: "",
    adminPassword: "",
    confirmPassword: "",
    role: "admin"
  });
  const [colleges, setColleges] = useState([]);
  const { isAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Fetch colleges list with React Query
  const collegesQuery = useMutation({
    mutationFn: async () => {
      const response = await fetch("https://canteen-order-backend.onrender.com/api/v1/colleges/all-colleges");
      if (!response.ok) {
        throw new Error("Failed to fetch colleges");
      }
      return await response.json();
    },
    onSuccess: (data) => {
      const collegeList = Array.isArray(data) ? data : data.colleges || [];
      setColleges(collegeList);
    },
    onError: (error) => {
      console.error("Error fetching colleges:", error.message);
      toast.error("Failed to load colleges. Please try again later.");
    }
  });

  useEffect(() => {
    collegesQuery.mutate();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const signupMutation = useMutation({
    mutationFn: async (signupData) => {
      const response = await fetch('https://canteen-order-backend.onrender.com/api/v1/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(signupData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.adminInfo) {
        setUser(data.adminInfo);
      }
      toast.success("Account created successfully!");
      navigate('/login');
    },
    onError: (error) => {
      console.error("Signup error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.adminPassword !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (!formData.collegeName) {
      toast.error("Please select a college");
      return;
    }

    signupMutation.mutate(formData);
  };

  return (
    <div className="h-full bg-white flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full h-full md:w-1/2 overflow-hidden bg-black flex items-center justify-center p-8 rounded-tl-[45px] rounded-br-[45px]"
      >
        <div className="max-w-md w-full">
  {/* Lottie Animation Container */}
  <div className="w-full h-64 mb-8  bg-white rounded-tr-[45px] rounded-bl-[45px]"> {/* Adjust height as needed */}
    <Lottie 
      animationData={animationData} 
      loop={true} 
      className="w-full h-full  "
    />
  </div>
  
  {/* Text Content Below Animation */}
  <div className="text-center">
    <h2 className="text-2xl font-bold text-white mb-2">CanteenPro Admin</h2>
    <p className="text-gray-300">Streamline your canteen management</p>
    
    {/* Decorative Dots - Optional */}
    <div className="flex justify-center space-x-2 mt-4">
      <div className="w-2 h-2 bg-white bg-opacity-50 rounded-full"></div>
      <div className="w-2 h-2 bg-white rounded-full"></div>
      <div className="w-2 h-2 bg-white bg-opacity-50 rounded-full"></div>
    </div>
  </div>
</div>
      </motion.div>

      {/* Right side - Signup Form */}
      <motion.div
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Get Started</h1>
            <p className="text-gray-600 mt-2">Create your admin account in minutes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="adminName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="adminName"
                  name="adminName"
                  type="text"
                  required
                  value={formData.adminName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="adminEmail"
                  name="adminEmail"
                  type="email"
                  required
                  value={formData.adminEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="admin@example.com"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700 mb-1">
                College Name
              </label>
              <div className="relative">
                <select
                  id="collegeName"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all appearance-none"
                  disabled={collegesQuery.isPending}
                >
                  {collegesQuery.isPending ? (
                    <option value="">Loading colleges...</option>
                  ) : (
                    <>
                      <option value="" disabled>Select your college</option>
                      {colleges.map(college => (
                        <option key={college._id} value={college.collegeName}>
                          {college.collegeName}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="+91 9876543210"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="adminPassword"
                    name="adminPassword"
                    type="password"
                    required
                    minLength="8"
                    value={formData.adminPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    minLength="8"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              >
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                disabled={signupMutation.isPending}
                className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all ${signupMutation.isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {signupMutation.isPending ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-black hover:text-gray-700">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;