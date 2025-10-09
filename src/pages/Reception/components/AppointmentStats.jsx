import React from 'react';
import { motion } from 'framer-motion';

export const AppointmentStats = ({ getChartData }) => {
  const { todayCount, weekCount, monthCount } = getChartData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
    >
      <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 p-4 rounded-lg shadow-md flex items-center gap-3">
        <div className="w-12 h-12 bg-cyan-300 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm text-gray-600">مواعيد اليوم</p>
          <p className="text-xl font-bold text-cyan-800">{todayCount}</p>
        </div>
      </div>
      <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-lg shadow-md flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm text-gray-600">مواعيد الأسبوع</p>
          <p className="text-xl font-bold text-blue-800">{weekCount}</p>
        </div>
      </div>
      <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-lg shadow-md flex items-center gap-3">
        <div className="w-12 h-12 bg-green-300 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm text-gray-600">مواعيد الشهر</p>
          <p className="text-xl font-bold text-green-800">{monthCount}</p>
        </div>
      </div>
    </motion.div>
  );
};
