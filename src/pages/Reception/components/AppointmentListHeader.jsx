import React from 'react';
import { motion } from 'framer-motion';
import { Add } from '@mui/icons-material';

export const AppointmentListHeader = ({ setShowModal }) => (
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-xl font-bold text-cyan-800">إدارة المواعيد</h2>
        <p className="text-sm text-gray-500">عرض وتعديل المواعيد المسجلة</p>
      </motion.div>
    </div>
    <motion.button
      whileHover={{ scale: 1.05, y: -2, boxShadow: '0 10px 25px -5px rgba(0, 188, 212, 0.4)' }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setShowModal(true)}
      className="px-6 py-3.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white rounded-2xl font-black transition-all duration-300 shadow-xl shadow-[var(--color-primary-light)] flex items-center gap-3 border border-white/20 active:scale-95"
    >
      <div className="bg-white/20 p-1 rounded-lg">
        <Add fontSize="small" />
      </div>
      <span className="tracking-wide">حجز موعد جديد</span>
    </motion.button>
  </div>
);
