import React from 'react';

export const SidebarOverlay = ({ closeSidebar }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 z-30"
    onClick={closeSidebar}
    aria-hidden="true"
  ></div>
);