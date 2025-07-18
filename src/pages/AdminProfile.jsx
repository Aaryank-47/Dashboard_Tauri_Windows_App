import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserCircleIcon, 
  PencilIcon, 
  CheckIcon, 
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  CalendarIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "Super Admin",
    phone: "",
    joinDate: "",
    collegeName: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...profile });
  const [isLoading, setIsLoading] = useState(true);
  const adminId = localStorage.getItem('adminId');

  useEffect(() => {
    getAdminProfile(adminId);
  }, []);

  const getAdminProfile = async (adminId) => {
    try {
      setIsLoading(true);
      if (!adminId) {
        console.log('Admin ID not found');
        return;
      }

      const response = await fetch(`https://canteen-order-backend.onrender.com/api/v1/admin/profile/${adminId}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.adminProfile) {
        throw new Error('Profile data not found');
      }

      setProfile({
        name: data.adminProfile.adminName,
        email: data.adminProfile.adminEmail,
        phone: data.adminProfile.phoneNumber,
        collegeName: data.adminProfile.collegeName,
        role: "Super Admin",
        joinDate: new Date(data.adminProfile.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      });
      setEditData({
        name: data.adminProfile.adminName,
        email: data.adminProfile.adminEmail,
        phone: data.adminProfile.phoneNumber,
        collegeName: data.adminProfile.collegeName
      });

    } catch (error) {
      console.error('Error fetching admin profile:', error.message);
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const updateAdminProfile = async () => {
    try {
      const response = await fetch(`https://canteen-order-backend.onrender.com/api/v1/admin/update-profile/${adminId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          adminName: editData.name,
          adminEmail: editData.email,
          phoneNumber: editData.phone,
          collegeName: editData.collegeName
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.updatedUserData) {
        throw new Error('Profile update failed');
      }

      setProfile(prev => ({
        ...prev,
        name: data.updatedUserData.adminName,
        email: data.updatedUserData.adminEmail,
        phone: data.updatedUserData.phoneNumber,
        collegeName: data.updatedUserData.collegeName
      }));
      
      toast.success("Profile updated successfully");
      setIsEditing(false);

    } catch (error) {
      console.error("Error updating admin profile:", error.message);
      toast.error("Failed to update profile");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const saveProfile = () => {
    updateAdminProfile();
  };

  const cancelEdit = () => {
    setEditData({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      collegeName: profile.collegeName
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-8xl mx-auto bg-white min-h-screen"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold text-gray-900"
        >
          Admin Profile
        </motion.h1>
        
        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.button
              key="edit-button"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all border border-black"
            >
              <PencilIcon className="w-5 h-5 mr-2" />
              Edit Profile
            </motion.button>
          ) : (
            <motion.div 
              key="action-buttons"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex gap-3"
            >
              <button
                onClick={cancelEdit}
                className="flex items-center px-4 py-2 bg-transparent text-black rounded-lg hover:bg-gray-100 transition-all border border-black"
              >
                <XMarkIcon className="w-5 h-5 mr-2" />
                Cancel
              </button>
              <button
                onClick={saveProfile}
                className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all border border-black"
              >
                <CheckIcon className="w-5 h-5 mr-2" />
                Save Changes
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6 text-center">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative mx-auto w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-4 overflow-hidden"
              >
                <UserCircleIcon className="w-full h-full text-gray-400" />
                {isEditing && (
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-all border border-gray-300"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </motion.button>
                )}
              </motion.div>
              
              <motion.h2 
                whileHover={{ scale: 1.01 }}
                className="text-2xl font-semibold text-gray-900 mb-1"
              >
                {profile.name}
              </motion.h2>
              <span className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full mb-4 border border-gray-300">
                <ShieldCheckIcon className="w-4 h-4 inline mr-1" />
                {profile.role}
              </span>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center text-gray-600">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  <span>Member since {profile.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                Profile Information
              </h2>
              
              <div className="space-y-6">
                {/* Name Field */}
                <div className="flex flex-col md:flex-row gap-4">
                  <label className="w-full md:w-1/3 text-sm font-medium text-gray-700 flex items-center">
                    <UserCircleIcon className="w-5 h-5 mr-2 text-gray-900" />
                    Full Name
                  </label>
                  <div className="w-full md:w-2/3">
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-white text-gray-900 transition-all"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profile.name}</p>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div className="flex flex-col md:flex-row gap-4">
                  <label className="w-full md:w-1/3 text-sm font-medium text-gray-700 flex items-center">
                    <EnvelopeIcon className="w-5 h-5 mr-2 text-gray-900" />
                    Email Address
                  </label>
                  <div className="w-full md:w-2/3">
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-white text-gray-900 transition-all"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profile.email}</p>
                    )}
                  </div>
                </div>

                {/* Role Field */}
                <div className="flex flex-col md:flex-row gap-4">
                  <label className="w-full md:w-1/3 text-sm font-medium text-gray-700 flex items-center">
                    <ShieldCheckIcon className="w-5 h-5 mr-2 text-gray-900" />
                    Role
                  </label>
                  <div className="w-full md:w-2/3">
                    <p className="text-gray-900 py-2">{profile.role}</p>
                  </div>
                </div>

                {/* Phone Field */}
                <div className="flex flex-col md:flex-row gap-4">
                  <label className="w-full md:w-1/3 text-sm font-medium text-gray-700 flex items-center">
                    <PhoneIcon className="w-5 h-5 mr-2 text-gray-900" />
                    Phone Number
                  </label>
                  <div className="w-full md:w-2/3">
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editData.phone}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-white text-gray-900 transition-all"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profile.phone}</p>
                    )}
                  </div>
                </div>

                {/* College Field */}
                <div className="flex flex-col md:flex-row gap-4">
                  <label className="w-full md:w-1/3 text-sm font-medium text-gray-700 flex items-center">
                    <AcademicCapIcon className="w-5 h-5 mr-2 text-gray-900" />
                    College Name
                  </label>
                  <div className="w-full md:w-2/3">
                    {isEditing ? (
                      <input
                        type="text"
                        name="collegeName"
                        value={editData.collegeName}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-white text-gray-900 transition-all"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profile.collegeName}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminProfile;