import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import useAuthStore from '../../store/auth';
import ReceptionSidebar from './components/ReceptionSidebar';
import ReceptionTopBar from './components/ReceptionTopBar';
import './ReceptionLayout.css';

const ReceptionLayout = () => {
  const { CUrole } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (CUrole() !== 'reception' && CUrole() !== 'admin') {
    location.replace('/notFound');
    return null;
  }

  return (
    <div className="reception-dashboard">
      <ReceptionSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="content">
        <ReceptionTopBar toggleSidebar={toggleSidebar} />
        <Outlet />
      </div>
    </div>
  );
};

export default ReceptionLayout;
