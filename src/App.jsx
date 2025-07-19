import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import {useAuth} from "./context/AuthContext.jsx"

import Dashboard from "./pages/Dashboard.jsx"; 
import Food from "./pages/Food.jsx";
import Order from "./pages/Order.jsx";
import Analytics from "./pages/Analytics.jsx";
import Feedback from "./pages/Feedback.jsx";
import Notification from "./pages/Notification.jsx";
import AdminProfile from "./pages/AdminProfile.jsx";
import LoginPage from "./pages/Login.jsx"
import SignUp from "./pages/SignUp.jsx"

const AppContent = () => {
  const { user } = useAuth();

 return (
    <div className="w-screen flex h-screen bg-gray-50 dark:bg-white-900">
      {user && <Sidebar />}
      
      <div className="w-full flex flex-col flex-1 overflow-hidden">
        {user && <Navbar />}
        
        <main className="w-full flex-1 overflow-y-auto p-4 md:p-6">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
            <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUp />} />
            
            <Route path="/" element={
              user ? <Dashboard /> : <Navigate to="/login" />
            } />
            
            <Route path="/food" element={
              <PrivateRoute>
                <Food />
              </PrivateRoute>
            } />
            
            <Route path="/order" element={
              <PrivateRoute>
                <Order />
              </PrivateRoute>
            } />
            
            <Route path="/analytics" element={
              <PrivateRoute>
                <Analytics />
              </PrivateRoute>
            } />
            
            <Route path="/feedback" element={
              <PrivateRoute>
                <Feedback />
              </PrivateRoute>
            } />
            
           
            
            <Route path="/notifications" element={
              <PrivateRoute>
                <Notification />
              </PrivateRoute>
            } />
            
            <Route path="/profile" element={
              <PrivateRoute>
                <AdminProfile />
              </PrivateRoute>
            } />
            
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <>
      <AppContent />
      <Toaster position="top-right" />
    </>
  );
};

export default App;








// const App = () => {
//   return (
    
//       <>
//         <div className="w-screen flex h-screen v-screen bg-gray-50 dark:bg-gray-900">
//           {/* Sidebar - Only visible when authenticated */}
//           <PrivateRoute>
//             <Sidebar />
//           </PrivateRoute>

//           {/* Main Area */}
//           <div className="w-full flex flex-col flex-1 overflow-hidden overflow-x-auto">
//             {/* Navbar - Only visible when authenticated */}
//             <PrivateRoute>
//               <Navbar />
//             </PrivateRoute>

//             {/* Page Content */}
//             <main className="w-full flex-1 overflow-y-auto p-4 md:p-6">
//               <Routes>
//                 <Route path="/login" element={<Login />} />
//                 <Route
//                   path="/"
//                   element={
//                     <PrivateRoute>
//                       <Dashboard />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="/food"
//                   element={
//                     <PrivateRoute>
//                       <Food />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="/order"
//                   element={
//                     <PrivateRoute>
//                       <Order />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="/analytics"
//                   element={
//                     <PrivateRoute>
//                       <Analytics />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="/feedback"
//                   element={
//                     <PrivateRoute>
//                       <Feedback />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="/settings"
//                   element={
//                     <PrivateRoute>
//                       <Settings />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="/notifications"
//                   element={
//                     <PrivateRoute>
//                       <Notification />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="/profile"
//                   element={
//                     <PrivateRoute>
//                       <AdminProfile />
//                     </PrivateRoute>
//                   }
//                 />
//               </Routes>
//             </main>
//           </div>
//           <Toaster position="top-right" />
//         </div>
//       </>
    
//   );
// };

// export default App;