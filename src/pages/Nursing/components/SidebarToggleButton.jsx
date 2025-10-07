import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export const SidebarToggleButton = ({ toggleSidebar }) => (
  <button
    onClick={toggleSidebar}
    className="fixed top-4 right-4 z-50 p-2 rounded-md bg-cyan-700 text-white hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
    aria-label="تفعيل القائمة الجانبية"
  >
    <FontAwesomeIcon icon={faBars} />
  </button>
);
