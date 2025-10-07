import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserNurse } from '@fortawesome/free-solid-svg-icons';

export const SidebarHeader = ({ isMobile, isCollapsed, toggleSidebar }) => (
  <div className="flex justify-between items-center mb-4 px-2">
    <h2
      className={`flex items-center text-white text-lg font-medium ${
        isMobile || !isCollapsed ? 'block' : 'hidden md:block'
      }`}
    >
      <FontAwesomeIcon icon={faUserNurse} className="ml-2" />
      <span className={`${isMobile || !isCollapsed ? 'block' : 'hidden md:block'}`}>لوحة التمريض</span>
    </h2>
    {isMobile && (
      <button
        onClick={toggleSidebar}
        className="text-white p-1 rounded hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        aria-label="إغلاق القائمة الجانبية"
      >
        <i className="bi bi-x-lg"></i>
      </button>
    )}
  </div>
);