import React from 'react';
import { Search } from '@mui/icons-material';
import { motion } from 'framer-motion';

export const PatientSearchBar = ({ searchTerm, setSearchTerm }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="mb-6"
  >
    <div className="relative">
      <input
        type="text"
        className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
        placeholder="ابحث بالاسم أو رقم الهاتف أو البريد الإلكتروني..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  </motion.div>
);