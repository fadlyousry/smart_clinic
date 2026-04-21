import React, { useMemo } from 'react';
import { getWeekDays, getAppointmentsForDay, getTimeSlots, formatTime12, getSettings, getDoctorColor, getStatusColor } from '../../utils/calendarHelpers';
import AppointmentCard from './AppointmentCard';
import { format, isToday, isSameDay } from 'date-fns';
import { ar } from 'date-fns/locale';

const WeeklyView = ({ selectedDate, setSelectedDate, setViewMode, appointments, onView, onEdit }) => {
  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);
  const settings = useMemo(() => getSettings(), []);

  // نستخدم خانات أول يوم عمل في الأسبوع
  const slots = useMemo(() => {
    // ناخد أطول يوم عمل في الأسبوع
    for (const day of weekDays) {
      const s = getTimeSlots(day);
      if (s.length > 0) return s;
    }
    return [];
  }, [weekDays]);

  // تجميع المواعيد لكل يوم وكل خانة
  const weekData = useMemo(() => {
    const data = {};
    weekDays.forEach(day => {
      const key = day.toDateString();
      const dayAppts = getAppointmentsForDay(appointments, day);
      const slotMap = {};

      slots.forEach(slot => { slotMap[slot] = []; });

      dayAppts.forEach(appt => {
        if (!appt.date) return;
        const d = new Date(appt.date);
        const h = d.getHours();
        const m = d.getMinutes();
        const interval = settings.slotInterval;
        const roundedM = Math.floor(m / interval) * interval;
        const slotKey = `${String(h).padStart(2, '0')}:${String(roundedM).padStart(2, '0')}`;

        if (slotMap[slotKey]) {
          slotMap[slotKey].push(appt);
        } else {
          // أقرب خانة
          const closest = slots.reduce((prev, curr) => {
            const [ph, pm] = prev.split(':').map(Number);
            const [ch, cm] = curr.split(':').map(Number);
            return Math.abs(ch * 60 + cm - (h * 60 + m)) < Math.abs(ph * 60 + pm - (h * 60 + m)) ? curr : prev;
          });
          if (slotMap[closest]) slotMap[closest].push(appt);
        }
      });

      data[key] = { appts: dayAppts, slotMap };
    });
    return data;
  }, [weekDays, appointments, slots, settings]);

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setViewMode('day');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col overflow-hidden">
      {/* رؤوس الأيام */}
      <div className="flex border-b border-gray-100 shrink-0">
        {/* خانة الوقت فارغة */}
        <div className="w-16 shrink-0 border-l border-gray-100"></div>

        {weekDays.map((day, i) => {
          const today = isToday(day);
          const dayAppts = weekData[day.toDateString()]?.appts || [];
          return (
            <div
              key={i}
              className={`flex-1 py-3 px-1 text-center border-l border-gray-50 cursor-pointer transition-colors ${
                today ? 'bg-[var(--color-primary-light)]/30' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleDayClick(day)}
            >
              <p className={`text-[10px] font-bold uppercase tracking-wider ${today ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>
                {format(day, 'EEEE', { locale: ar })}
              </p>
              <p className={`text-lg font-black mt-0.5 ${today ? 'text-[var(--color-primary)]' : 'text-gray-700'}`}>
                {format(day, 'd')}
              </p>
              {dayAppts.length > 0 && (
                <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                  today ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {dayAppts.length} موعد
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* شبكة الخانات الزمنية */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {slots.map((slot, si) => (
          <div key={slot} className="flex border-b border-gray-50 min-h-[60px]">
            {/* عمود الوقت */}
            <div className="w-16 shrink-0 py-2 px-2 text-left border-l border-gray-100">
              <span className="text-[10px] font-bold text-gray-400">{formatTime12(slot)}</span>
            </div>

            {/* أعمدة الأيام */}
            {weekDays.map((day, di) => {
              const dayData = weekData[day.toDateString()];
              const slotAppts = dayData?.slotMap?.[slot] || [];
              const today = isToday(day);

              return (
                <div
                  key={di}
                  className={`flex-1 border-l border-gray-50 py-1 px-1 transition-colors ${
                    today ? 'bg-blue-50/20' : ''
                  } ${slotAppts.length === 0 ? 'hover:bg-gray-50/50' : ''}`}
                >
                  {slotAppts.map(appt => {
                    const doctorColor = appt.customColor || getDoctorColor(appt.doctor_id);
                    const statusColor = getStatusColor(appt.status);
                    return (
                      <div
                        key={appt.id}
                        className="rounded-lg px-2 py-1.5 mb-1 text-[10px] cursor-pointer hover:brightness-95 transition-all border-r-2"
                        style={{
                          backgroundColor: doctorColor.light,
                          borderRightColor: doctorColor.bg,
                        }}
                        onClick={() => onView?.(appt)}
                        title={`${appt.patientName} - ${appt.doctorName}`}
                      >
                        <p className="font-bold text-gray-700 truncate">{appt.patientName}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor.dot }}></div>
                          <span className="text-gray-500 truncate">{appt.doctorName}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyView;
