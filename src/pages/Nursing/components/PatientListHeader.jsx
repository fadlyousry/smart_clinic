import React from 'react';
import { motion } from 'framer-motion';

export const PatientListHeader = () => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
    <div className="flex items-center gap-3">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center shadow-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-cyan-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-xl font-bold text-cyan-800">إدارة المرضى</h2>
        <p className="text-sm text-gray-500">عرض وتعديل بيانات المرضى المسجلين</p>
      </motion.div>
    </div>
  </div>
);