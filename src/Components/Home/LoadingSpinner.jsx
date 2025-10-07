
import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center w-screen justify-center h-screen bg-[#E0F7FA]"
    >
      <div className="animate-spin  rounded-full h-20 w-20 border-t-4 border-b-4 border-[#0097A7] mb-4"></div>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-[#0097A7] text-lg font-medium"
      >
        جاري التحميل...
      </motion.p>
    </motion.div>
  );
}