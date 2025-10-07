import { motion } from 'framer-motion';

export const PageTitle = ({ location }) => {
  const getPageTitle = () => {
    if (location.pathname.includes('patients')) {
      return 'إدارة المرضى';
    } else if (location.pathname.includes('appointments')) {
      return 'جدولة المواعيد';
    } else {
      return 'لوحة التحكم التمريض';
    }
  };

  return (
    <motion.h1
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="text-base sm:text-lg md:text-xl font-bold text-cyan-800 truncate max-w-[150px] sm:max-w-[200px] md:max-w-none"
    >
      {getPageTitle()}
    </motion.h1>
  );
};