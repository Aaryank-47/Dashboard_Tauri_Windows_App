import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Check localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('admin');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (userData) => {
    try {
      const response = await fetch('https://canteen-order-backend.onrender.com/api/v1/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },  
        credentials: 'include', // This handles cookies
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      setUser(data.adminInfo);
      localStorage.setItem('admin', JSON.stringify(data.adminInfo));
      toast.success('Logged in successfully');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('https://canteen-order-backend.onrender.com/api/v1/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('admin');
      queryClient.clear();
      navigate('/login');
      toast.success('Logged out successfully');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);