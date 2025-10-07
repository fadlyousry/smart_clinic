import React from 'react';
import { Search } from '@mui/icons-material';
import { motion } from 'framer-motion';

export const AppointmentSearchBar = ({ searchQuery, setSearchQuery, filter, setFilter }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="mb-6 flex flex-col sm:flex-row gap-4 items-center"
  >
    <div className="relative w-full sm:w-1/2">
      <input
        type="text"
        className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
        placeholder="ابحث بالاسم أو رقم الهاتف أو اسم الطبيب..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
    <select
      className="w-full sm:w-1/4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
      value={filter}
      onChange={e => setFilter(e.target.value)}
    >
      <option value="all">جميع المواعيد</option>
      <option value="today">اليوم</option>
      <option value="tomorrow">غدًا</option>
      <option value="week">هذا الأسبوع</option>
    </select>
  </motion.div>
);
