import React from 'react';
import {
  CalendarMonth,
  ViewWeek,
  ViewDay,
  ViewList,
  Add,
  Search,
} from '@mui/icons-material';
import CalendarFilters from './CalendarFilters';

const VIEW_MODES = [
  { key: 'month', icon: <CalendarMonth fontSize="small" />, label: 'شهري' },
  { key: 'week', icon: <ViewWeek fontSize="small" />, label: 'أسبوعي' },
  { key: 'day', icon: <ViewDay fontSize="small" />, label: 'يومي' },
  { key: 'list', icon: <ViewList fontSize="small" />, label: 'قائمة' },
];

const CalendarToolbar = ({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  onAddAppointment,
  filters,
  setFilters,
  doctors,
  filteredCount,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* زر إضافة موعد */}
      <button
        onClick={onAddAppointment}
        className="px-5 py-2.5 text-white font-bold rounded-xl shadow-lg transition-all hover:brightness-110 active:scale-95 flex items-center justify-center gap-2 text-sm shrink-0"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        <Add fontSize="small" />
        موعد جديد
      </button>

      {/* بحث */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
          <Search fontSize="small" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="بحث بالاسم أو الموبايل أو الدكتور..."
          className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] transition-all"
        />
      </div>

      {/* فلاتر */}
      {filters && setFilters && (
        <CalendarFilters
          filters={filters}
          setFilters={setFilters}
          doctors={doctors || []}
          appointments={{ length: filteredCount || 0 }}
        />
      )}

      {/* أوضاع العرض */}
      <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1 shrink-0">
        {VIEW_MODES.map(mode => (
          <button
            key={mode.key}
            onClick={() => setViewMode(mode.key)}
            title={mode.label}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === mode.key
                ? 'bg-white text-[var(--color-primary-dark)] shadow-sm border border-gray-100'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {mode.icon}
            <span className="hidden md:inline">{mode.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarToolbar;
