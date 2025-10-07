import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { supabase } from '../../../supaBase/NursingBooking';
import { SidebarToggleButton } from './SidebarToggleButton';
import { SidebarHeader } from './SidebarHeader';
import { SidebarMenu } from './SidebarMenu';
import { SidebarOverlay } from './SidebarOverlay';

const NursingSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
        return;
      }
      localStorage.removeItem('auth_token');
      navigate('/');
    } catch (err) {
      console.error('Unexpected error during logout:', err);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  return (
    <>
      {isMobile && <SidebarToggleButton toggleSidebar={toggleSidebar} />}
      <nav
        id="sidebarMenu"
        className={`
          ${isMobile ? (isCollapsed ? 'w-0' : 'w-64') : 'w-64 md:w-20 lg:w-64'}
          bg-cyan-700 text-white
          h-screen
          fixed top-0 right-0
          z-40
          pt-20
          p-4
          transition-all duration-300 ease-in-out
          overflow-hidden
          ${isMobile && isCollapsed ? 'translate-x-full' : 'translate-x-0'}
          dir-rtl
        `}
      >
        <div className="h-full flex flex-col">
          <SidebarHeader isMobile={isMobile} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
          <hr className="border-white opacity-30 mx-2 mb-4" />
          <SidebarMenu
            isMobile={isMobile}
            isCollapsed={isCollapsed}
            closeSidebar={closeSidebar}
            handleLogout={handleLogout}
          />
        </div>
      </nav>
      {isMobile && !isCollapsed && <SidebarOverlay closeSidebar={closeSidebar} />}
    </>
  );
};

export default NursingSidebar;
