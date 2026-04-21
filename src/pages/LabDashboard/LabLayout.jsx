import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import useAuthStore from '../../store/auth';
import LabSidebar from './components/LabSidebar';
import LabTopbar from './components/LabTopbar';
import './LabLayout.css';

export default function LabLayout() {
  const { CUrole } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (CUrole() !== 'lab') {
    location.replace('/notFound');
    return null;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="lab-dashboard">
      <LabSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="content">
        <LabTopbar toggleSidebar={toggleSidebar} />
        <div style={{ padding: '0 20px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
