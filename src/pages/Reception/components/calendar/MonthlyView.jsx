import React, { useMemo, memo } from 'react';
import { isToday, isSameDay, isSameMonth, getMonthCalendarDays, getAppointmentsForDay, getStatusColor } from '../../utils/calendarHelpers';
import AppointmentCard from './AppointmentCard';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const WEEK_HEADERS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
const WEEK_HEADERS_SHORT = ['سب', 'أح', 'اث', 'ثل', 'أر', 'خم', 'جم'];

const MonthlyView = memo(({ selectedDate, setSelectedDate, setViewMode, appointments, onView, onEdit }) => {
  const calendarDays = useMemo(() => getMonthCalendarDays(selectedDate), [selectedDate]);

  // تجميع المواعيد لكل يوم
  const dayAppointmentsMap = useMemo(() => {
    const map = new Map();
    calendarDays.forEach(day => {
      map.set(day.toDateString(), getAppointmentsForDay(appointments, day));
    });
    return map;
  }, [calendarDays, appointments]);

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setViewMode('day');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
      {/* رؤوس الأسبوع */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {WEEK_HEADERS.map((day, i) => (
          <div
            key={i}
            className="py-2 sm:py-3 text-center text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider"
            style={i === 6 ? { color: '#EF4444' } : {}}
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{WEEK_HEADERS_SHORT[i]}</span>
          </div>
        ))}
      </div>

      {/* شبكة الأيام */}
      <div className="grid grid-cols-7 flex-1 auto-rows-fr">
        {calendarDays.map((day, index) => {
          const dayAppts = dayAppointmentsMap.get(day.toDateString()) || [];
          const isCurrentMonth = isSameMonth(day, selectedDate);
          const today = isToday(day);
          const isSelected = isSameDay(day, selectedDate);
          const dayNum = format(day, 'd');
          const maxVisible = 3;

          // حساب ملخص الحالات
          const statusCounts = {};
          dayAppts.forEach(a => {
            const color = getStatusColor(a.status);
            statusCounts[color.dot] = (statusCounts[color.dot] || 0) + 1;
          });

          return (
            <div
              key={index}
              onClick={() => handleDayClick(day)}
              className={`
                border-b border-l border-gray-50 p-1 sm:p-1.5 min-h-[55px] sm:min-h-[90px] cursor-pointer
                transition-all duration-150 group relative
                ${!isCurrentMonth ? 'bg-gray-50/50' : 'bg-white hover:bg-[var(--color-primary-light)]/20'}
                ${isSelected ? 'ring-2 ring-[var(--color-primary)] ring-inset' : ''}
              `}
            >
              {/* رقم اليوم */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`
                    inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold transition-all
                    ${today ? 'bg-[var(--color-primary)] text-white shadow-sm' : ''}
                    ${!today && isCurrentMonth ? 'text-gray-700 group-hover:bg-gray-100' : ''}
                    ${!isCurrentMonth ? 'text-gray-300' : ''}
                  `}
                >
                  {dayNum}
                </span>
                {dayAppts.length > 0 && (
                  <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">
                    {dayAppts.length}
                  </span>
                )}
              </div>

              {/* المواعيد - تظهر فقط على الشاشات المتوسطة والكبيرة */}
              {isCurrentMonth && (
                <div className="space-y-0.5 overflow-hidden hidden sm:block">
                  {dayAppts.slice(0, maxVisible).map((appt, i) => (
                    <AppointmentCard
                      key={appt.id}
                      appt={appt}
                      variant="compact"
                      onView={onView}
                    />
                  ))}
                  {dayAppts.length > maxVisible && (
                    <div className="text-[9px] font-bold text-[var(--color-primary)] text-center py-0.5 hover:underline">
                      +{dayAppts.length - maxVisible} آخرين
                    </div>
                  )}
                </div>
              )}

              {/* نقاط الحالات (على الموبايل بدل الكروت) */}
              {isCurrentMonth && dayAppts.length > 0 && (
                <div className="flex items-center gap-0.5 mt-0.5 sm:hidden justify-center flex-wrap">
                  {Object.entries(statusCounts).map(([color, count], i) => (
                    <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

MonthlyView.displayName = 'MonthlyView';

export default MonthlyView;
