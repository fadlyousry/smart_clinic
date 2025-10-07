import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export const SidebarMenu = ({ isMobile, isCollapsed, closeSidebar, handleLogout }) => (
  <ul className="flex flex-col gap-2 px-2 flex-grow">
    <li>
      <NavLink
        to="/nursing-dashboard"
        onClick={closeSidebar}
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            isActive ? 'bg-white text-cyan-700' : 'text-white hover:bg-cyan-600 bg-transparent'
          } ${isMobile || !isCollapsed ? 'justify-start' : 'justify-center md:justify-start'}`
        }
      >
        <i className="bi bi-speedometer2 ml-2"></i>
        <span className={`${isMobile || !isCollapsed ? 'block' : 'hidden md:block'}`}>لوحة التحكم</span>
      </NavLink>
    </li>
    <li>
      <NavLink
        to="/nursing-dashboard/patients"
        onClick={closeSidebar}
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            isActive ? 'bg-white text-cyan-700' : 'text-white hover:bg-cyan-600 bg-transparent'
          } ${isMobile || !isCollapsed ? 'justify-start' : 'justify-center md:justify-start'}`
        }
      >
        <FontAwesomeIcon icon={faUsers} className="ml-2" />
        <span className={`${isMobile || !isCollapsed ? 'block' : 'hidden md:block'}`}>قائمة المرضى</span>
      </NavLink>
    </li>
    <li className="mt-auto">
      <button
        onClick={() => {
          handleLogout();
          closeSidebar();
        }}
        className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 text-white hover:bg-cyan-600 bg-transparent ${
          isMobile || !isCollapsed ? 'justify-start' : 'justify-center md:justify-start'
        }`}
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="ml-2" />
        <span className={`${isMobile || !isCollapsed ? 'block' : 'hidden md:block'}`}>تسجيل الخروج</span>
      </button>
    </li>
  </ul>
);
