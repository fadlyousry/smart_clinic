import React from 'react';
import { Outlet } from 'react-router-dom';
import useAuthStore from '../../store/auth';

const ReceptionLayout = () => {
  const { CUrole } = useAuthStore();
  if (CUrole() !== 'reception' && CUrole() !== 'admin') location.replace('/notFound');
  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <Outlet />
    </div>
  );
};

export default ReceptionLayout;
