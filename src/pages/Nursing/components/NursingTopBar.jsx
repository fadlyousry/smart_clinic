import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../../supaBase/NursingBooking';
import useAuthStore from '../../../store/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarToggle } from './SidebarToggle';
import { PageTitle } from './PageTitle';
import { UserMenu } from './UserMenu';

// Main TopBarContainer component
export const NursingTopBar = ({ toggleSidebar }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { CUname, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle logout logic
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
        return;
      }
      logout();
      localStorage.removeItem('auth_token');
      navigate('/login');
    } catch (err) {
      console.error('Unexpected error during logout:', err);
    }
    setShowMenu(false);
  };

  // Handle profile navigation
  const handleProfile = () => {
    navigate('/nursing-dashboard/profile');
    setShowMenu(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-cyan-50 to-blue-50 shadow-md border-b border-gray-100 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between"
      dir="rtl"
    >
      {/* Left Section: Sidebar Toggle and Page Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <SidebarToggle toggleSidebar={toggleSidebar} />
        <PageTitle location={location} />
      </div>

      {/* Right Section: User Menu */}
      <UserMenu
        CUname={CUname}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        handleLogout={handleLogout}
        handleProfile={handleProfile}
      />
    </motion.div>
  );
};
