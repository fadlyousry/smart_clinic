import { motion } from 'framer-motion';
import { Menu } from '@mui/icons-material';
export const SidebarToggle = ({ toggleSidebar }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="p-2 rounded-full text-cyan-700 hover:bg-cyan-100 transition-colors duration-200 lg:hidden"
    onClick={toggleSidebar}
    aria-label="تفعيل القائمة الجانبية"
  >
    <Menu fontSize="medium" />
  </motion.button>
);