import React from 'react';
import { ChevronRight, ChevronLeft, Today } from '@mui/icons-material';
import { formatDateAr, navigateDate } from '../../utils/calendarHelpers';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const VIEW_FORMAT = {
  month: 'MMMM yyyy',
  week: 'dd MMMM yyyy',
  day: 'EEEE dd MMMM yyyy',
  list: 'MMMM yyyy',
};

const DateNavigator = ({ selectedDate, setSelectedDate, viewMode }) => {
  const handlePrev = () => setSelectedDate(navigateDate(selectedDate, 'prev', viewMode));
  const handleNext = () => setSelectedDate(navigateDate(selectedDate, 'next', viewMode));
  const handleToday = () => setSelectedDate(new Date());

  const label = format(selectedDate, VIEW_FORMAT[viewMode] || 'dd MMMM yyyy', { locale: ar });

  return (
    <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-2.5 shadow-sm">
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrev}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          title="السابق"
        >
          <ChevronRight fontSize="small" />
        </button>
        <button
          onClick={handleNext}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          title="التالي"
        >
          <ChevronLeft fontSize="small" />
        </button>
      </div>

      <h2 className="text-lg font-black text-gray-800 select-none">{label}</h2>

      <button
        onClick={handleToday}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-gray-200 text-gray-600 hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary-dark)] hover:border-[var(--color-primary-light)]"
      >
        <Today style={{ fontSize: 14 }} />
        اليوم
      </button>
    </div>
  );
};

export default DateNavigator;
