import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { Clock, User, Stethoscope, Search, Frown } from "lucide-react";


const AppointmentFilters = ({ searchQuery, setSearchQuery, statusFilter, setStatusFilter }) => {
  return (
    <div className="flex gap-2 min-w-full md:min-w-0 lg:min-w-105">
      <div className="relative min-w-[120px] max-w-[200px]">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-300 rounded-full px-5 py-2 text-gray-700 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        >
          <option value="الكل">الكل</option>
          <option value="تم">تم</option>
          <option value="في الإنتظار">في الإنتظار</option>
          <option value="ملغي">ملغي</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center pr-2">
          <FilterListIcon />
        </div>
      </div>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="ابحث باسم المريض أو رقم الهاتف"
          className="bg-white w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};
export default AppointmentFilters;