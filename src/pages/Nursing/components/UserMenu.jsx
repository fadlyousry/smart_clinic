import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AccountCircle, ExitToApp } from '@mui/icons-material';

export const UserMenu = ({ CUname, showMenu, setShowMenu, handleLogout, handleProfile }) => (
  <div className="flex items-center gap-2 sm:gap-3">
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 text-gray-700 hover:text-cyan-700 transition-colors duration-300"
      onClick={() => setShowMenu(!showMenu)}
      aria-label="قائمة المستخدم"
      aria-expanded={showMenu}
      aria-controls="user-menu"
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
        alt="صورة المستخدم"
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200"
      />
      <span className="font-semibold text-sm sm:text-base hidden sm:inline">{CUname || 'ممرض/ة غير معروف'}</span>
    </motion.button>
    <AnimatePresence>
      {showMenu && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          id="user-menu"
          className="absolute top-full left-4 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
        >
          <motion.button
            whileHover={{ backgroundColor: '#FEF2F2' }}
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-right text-gray-800 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
            aria-label="تسجيل الخروج"
          >
            <ExitToApp className="text-red-600" />
            <span className="text-sm font-medium">تسجيل الخروج</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
