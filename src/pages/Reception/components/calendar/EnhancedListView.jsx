import React, { useMemo } from 'react';
import { groupAppointmentsByDate, getDoctorColor, getStatusColor } from '../../utils/calendarHelpers';
import AppointmentCard from './AppointmentCard';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import { CalendarToday, Inbox } from '@mui/icons-material';

const EnhancedListView = ({ selectedDate, appointments, onView, onEdit }) => {
  // تجميع المواعيد حسب التاريخ
  const grouped = useMemo(() => {
    const groups = groupAppointmentsByDate(appointments);
    // ترتيب تنازلي
    const sorted = Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
    return sorted;
  }, [appointments]);

  if (grouped.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex items-center justify-center">
        <div className="text-center p-8">
          <Inbox className="text-gray-200 mb-3" style={{ fontSize: 56 }} />
          <p className="text-gray-400 font-bold text-lg">لا توجد مواعيد</p>
          <p className="text-gray-300 text-sm mt-1">جرّب تغيير الفلاتر أو البحث</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full overflow-y-auto custom-scrollbar">
      <div className="divide-y divide-gray-50">
        {grouped.map(([dateKey, appts]) => {
          const date = new Date(dateKey);
          const isToday = new Date().toDateString() === date.toDateString();

          // إحصائيات اليوم
          const dayStats = {
            total: appts.length,
            arrived: appts.filter(a => a.status === 'وصل العيادة').length,
            waiting: appts.filter(a => a.status === 'في الإنتظار').length,
            done: appts.filter(a => a.status === 'تم').length,
            cancelled: appts.filter(a => a.status === 'ملغى').length,
            paid: appts.filter(a => a.payment).length,
          };

          // ترتيب المواعيد بالوقت
          const sortedAppts = [...appts].sort((a, b) => {
            if (!a.date || !b.date) return 0;
            return new Date(a.date) - new Date(b.date);
          });

          return (
            <div key={dateKey}>
              {/* هيدر التاريخ */}
              <div className={`sticky top-0 z-10 px-5 py-3 flex items-center justify-between ${
                isToday ? 'bg-[var(--color-primary-light)]/40' : 'bg-gray-50/80'
              } backdrop-blur-sm border-b border-gray-100`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isToday ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'bg-white text-gray-400 border border-gray-200'
                  }`}>
                    <CalendarToday style={{ fontSize: 16 }} />
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${isToday ? 'text-[var(--color-primary-dark)]' : 'text-gray-700'}`}>
                      {isToday ? 'اليوم — ' : ''}{format(date, 'EEEE dd MMMM yyyy', { locale: ar })}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-0.5">
                      <span>{dayStats.total} موعد</span>
                      {dayStats.arrived > 0 && <span className="text-blue-500">✓ وصل: {dayStats.arrived}</span>}
                      {dayStats.waiting > 0 && <span className="text-amber-500">⏳ انتظار: {dayStats.waiting}</span>}
                      {dayStats.done > 0 && <span className="text-emerald-500">✅ تم: {dayStats.done}</span>}
                      {dayStats.cancelled > 0 && <span className="text-rose-500">✕ ملغى: {dayStats.cancelled}</span>}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 bg-white px-2.5 py-1 rounded-lg border border-gray-100 shadow-sm">
                  {dayStats.paid}/{dayStats.total} مدفوع
                </span>
              </div>

              {/* المواعيد */}
              <div className="p-4 space-y-3">
                {sortedAppts.map((appt, idx) => (
                  <div key={appt.id} className="flex items-start gap-3">
                    {/* رقم الترتيب */}
                    <div className="flex flex-col items-center shrink-0 pt-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-sm"
                        style={{ backgroundColor: getDoctorColor(appt.doctor_id).bg }}
                      >
                        {idx + 1}
                      </div>
                      {idx < sortedAppts.length - 1 && (
                        <div className="w-0.5 h-full mt-1 bg-gray-100 min-h-[20px]"></div>
                      )}
                    </div>

                    {/* الكارت */}
                    <div className="flex-1">
                      <AppointmentCard
                        appt={appt}
                        variant="full"
                        onView={onView}
                        onEdit={onEdit}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EnhancedListView;
