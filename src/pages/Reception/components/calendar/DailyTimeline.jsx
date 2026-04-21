import React, { useMemo, useEffect, useRef, useState } from 'react';
import { getTimeSlots, getAppointmentsForDay, formatTime12, getSettings, getDoctorColor, getStatusColor, calculateStats } from '../../utils/calendarHelpers';
import AppointmentCard from './AppointmentCard';
import { format, isToday } from 'date-fns';
import { ar } from 'date-fns/locale';
import { CalendarToday, CheckCircle, HourglassEmpty, Cancel } from '@mui/icons-material';

const DailyTimeline = ({ selectedDate, appointments, onView, onEdit }) => {
  const timelineRef = useRef(null);
  const currentTimeRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const slots = useMemo(() => getTimeSlots(selectedDate), [selectedDate]);
  const dayAppts = useMemo(() => getAppointmentsForDay(appointments, selectedDate), [appointments, selectedDate]);
  const dayStats = useMemo(() => calculateStats(appointments, selectedDate), [appointments, selectedDate]);

  // تحديث الوقت الحالي كل دقيقة
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Scroll لموقع الوقت الحالي
  useEffect(() => {
    if (isToday(selectedDate) && currentTimeRef.current) {
      setTimeout(() => {
        currentTimeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [selectedDate]);

  // توزيع المواعيد على الخانات الزمنية
  const slotAppointments = useMemo(() => {
    const map = {};
    slots.forEach(slot => { map[slot] = []; });

    dayAppts.forEach(appt => {
      if (!appt.date) return;
      const apptDate = new Date(appt.date);
      const h = apptDate.getHours();
      const m = apptDate.getMinutes();
      const settings = getSettings();
      const interval = settings.slotInterval;

      // تقريب لأقرب خانة
      const roundedM = Math.floor(m / interval) * interval;
      const slotKey = `${String(h).padStart(2, '0')}:${String(roundedM).padStart(2, '0')}`;

      if (map[slotKey]) {
        map[slotKey].push(appt);
      } else {
        // لو الخانة مش موجودة، حطه في أقرب خانة
        const closest = slots.reduce((prev, curr) => {
          const [ph, pm] = prev.split(':').map(Number);
          const [ch, cm] = curr.split(':').map(Number);
          const prevDiff = Math.abs(ph * 60 + pm - (h * 60 + m));
          const currDiff = Math.abs(ch * 60 + cm - (h * 60 + m));
          return currDiff < prevDiff ? curr : prev;
        });
        if (map[closest]) map[closest].push(appt);
      }
    });

    return map;
  }, [slots, dayAppts]);

  // حساب موقع خط الوقت الحالي
  const getCurrentTimePosition = () => {
    if (!isToday(selectedDate) || slots.length === 0) return null;
    const now = currentTime;
    const h = now.getHours();
    const m = now.getMinutes();
    const [startH, startM] = slots[0].split(':').map(Number);
    const [endH, endM] = slots[slots.length - 1].split(':').map(Number);
    const settings = getSettings();

    const totalMinutes = (endH * 60 + endM + settings.slotInterval) - (startH * 60 + startM);
    const currentMinutes = (h * 60 + m) - (startH * 60 + startM);

    if (currentMinutes < 0 || currentMinutes > totalMinutes) return null;
    return (currentMinutes / totalMinutes) * 100;
  };

  const timePosition = getCurrentTimePosition();

  if (slots.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex items-center justify-center p-8">
        <div className="text-center">
          <Cancel className="text-gray-300 mb-3" style={{ fontSize: 48 }} />
          <p className="text-gray-400 font-bold text-lg">هذا اليوم إجازة</p>
          <p className="text-gray-300 text-sm mt-1">يمكنك تعديل أيام العمل من صفحة الإعدادات</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col overflow-hidden">
      {/* ملخص اليوم */}
      <div className="px-5 py-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <CalendarToday style={{ fontSize: 18 }} className="text-[var(--color-primary)]" />
            {format(selectedDate, 'EEEE dd MMMM yyyy', { locale: ar })}
          </h3>
          <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-lg">
            {dayAppts.length} موعد
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-blue-600">
            <CheckCircle style={{ fontSize: 12 }} /> وصلوا: {dayStats.arrived}
          </span>
          <span className="flex items-center gap-1.5 text-amber-600">
            <HourglassEmpty style={{ fontSize: 12 }} /> منتظرين: {dayStats.waiting}
          </span>
          <span className="flex items-center gap-1.5 text-emerald-600">
            <CheckCircle style={{ fontSize: 12 }} /> تم: {dayStats.done}
          </span>
          <span className="flex items-center gap-1.5 text-rose-600">
            <Cancel style={{ fontSize: 12 }} /> ملغى: {dayStats.cancelled}
          </span>
        </div>
      </div>

      {/* الخط الزمني */}
      <div className="flex-1 overflow-y-auto custom-scrollbar" ref={timelineRef}>
        <div className="relative">
          {/* خط الوقت الحالي */}
          {timePosition !== null && (
            <div
              ref={currentTimeRef}
              className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
              style={{ top: `${timePosition}%` }}
            >
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shrink-0 -mr-1.5"></div>
              <div className="flex-1 h-[2px] bg-red-500 shadow-sm"></div>
              <span className="text-[9px] font-black text-red-500 bg-red-50 px-1.5 py-0.5 rounded mr-1 shrink-0">
                {format(currentTime, 'hh:mm a', { locale: ar })}
              </span>
            </div>
          )}

          {/* الخانات الزمنية */}
          {slots.map((slot, i) => {
            const appts = slotAppointments[slot] || [];
            const isCurrentSlot = (() => {
              if (!isToday(selectedDate)) return false;
              const [sh, sm] = slot.split(':').map(Number);
              const settings = getSettings();
              const h = currentTime.getHours();
              const m = currentTime.getMinutes();
              return h === sh && m >= sm && m < sm + settings.slotInterval;
            })();

            return (
              <div
                key={slot}
                className={`flex border-b border-gray-50 min-h-[70px] transition-colors ${
                  isCurrentSlot ? 'bg-red-50/30' : ''
                }`}
              >
                {/* الوقت */}
                <div className="w-20 shrink-0 py-3 px-3 text-left border-l border-gray-100">
                  <span className={`text-xs font-bold ${isCurrentSlot ? 'text-red-500' : 'text-gray-400'}`}>
                    {formatTime12(slot)}
                  </span>
                </div>

                {/* المواعيد */}
                <div className="flex-1 py-2 px-3">
                  {appts.length > 0 ? (
                    <div className="space-y-2">
                      {appts.map(appt => (
                        <AppointmentCard
                          key={appt.id}
                          appt={appt}
                          variant="normal"
                          onView={onView}
                          onEdit={onEdit}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DailyTimeline;
