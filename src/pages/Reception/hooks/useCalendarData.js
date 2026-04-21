import { useState, useMemo, useCallback } from 'react';
import useAppointmentStore from '../../../store/appointmentStore';
import {
  getAppointmentsForDay,
  getMonthCalendarDays,
  getWeekDays,
  calculateStats,
  groupAppointmentsByDate,
} from '../utils/calendarHelpers';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameDay, isWithinInterval } from 'date-fns';

const useCalendarData = () => {
  const { appointments, fetchAppointments, error, updateAppointment, deleteAppointment, togglePaymentStatus } = useAppointmentStore();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month | week | day | list
  const [filters, setFilters] = useState({
    doctor: 'all',
    status: 'all',
    payment: 'all',
    visitType: 'all',
  });
  const [searchQuery, setSearchQuery] = useState('');

  // ─── فلترة المواعيد ────────────────────────────────────────
  const filteredAppointments = useMemo(() => {
    let result = [...appointments];

    // بحث
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        a =>
          (a.patientName || '').toLowerCase().includes(q) ||
          (a.phoneNumber || '').includes(q) ||
          (a.doctorName || '').toLowerCase().includes(q)
      );
    }

    // فلتر الطبيب
    if (filters.doctor !== 'all') {
      result = result.filter(a => String(a.doctor_id) === String(filters.doctor));
    }

    // فلتر الحالة
    if (filters.status !== 'all') {
      result = result.filter(a => a.status === filters.status);
    }

    // فلتر الدفع
    if (filters.payment !== 'all') {
      result = result.filter(a =>
        filters.payment === 'paid' ? a.payment : !a.payment
      );
    }

    // فلتر نوع الزيارة
    if (filters.visitType !== 'all') {
      result = result.filter(a => a.visitType === filters.visitType);
    }

    return result;
  }, [appointments, searchQuery, filters]);

  // ─── بيانات حسب العرض ──────────────────────────────────────
  const viewData = useMemo(() => {
    switch (viewMode) {
      case 'month': {
        const calendarDays = getMonthCalendarDays(selectedDate);
        return { calendarDays };
      }
      case 'week': {
        const weekDays = getWeekDays(selectedDate);
        return { weekDays };
      }
      case 'day': {
        const dayAppointments = getAppointmentsForDay(filteredAppointments, selectedDate);
        return { dayAppointments };
      }
      case 'list': {
        const grouped = groupAppointmentsByDate(filteredAppointments);
        return { grouped };
      }
      default:
        return {};
    }
  }, [viewMode, selectedDate, filteredAppointments]);

  // ─── إحصائيات ──────────────────────────────────────────────
  const stats = useMemo(() => {
    return calculateStats(appointments, selectedDate);
  }, [appointments, selectedDate]);

  // ─── قائمة الأطباء الفريدة ─────────────────────────────────
  const doctors = useMemo(() => {
    const map = new Map();
    appointments.forEach(a => {
      if (a.doctor_id && !map.has(a.doctor_id)) {
        map.set(a.doctor_id, { id: a.doctor_id, name: a.doctorName });
      }
    });
    return Array.from(map.values());
  }, [appointments]);

  return {
    // State
    selectedDate,
    setSelectedDate,
    viewMode,
    setViewMode,
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,

    // Data
    appointments: filteredAppointments,
    allAppointments: appointments,
    viewData,
    stats,
    doctors,
    error,

    // Actions
    fetchAppointments,
    updateAppointment,
    deleteAppointment,
    togglePaymentStatus,

    // Helpers
    getAppointmentsForDay: (day) => getAppointmentsForDay(filteredAppointments, day),
  };
};

export default useCalendarData;
