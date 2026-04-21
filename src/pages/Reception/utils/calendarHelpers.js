import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isToday, isSameDay, isSameMonth,
  addMonths, subMonths, addWeeks, subWeeks, addDays, subDays,
  getDay, setHours, setMinutes, isWithinInterval, parseISO,
} from 'date-fns';
import { ar } from 'date-fns/locale';

// ─── Doctor Colors ───────────────────────────────────────────
const DOCTOR_COLORS = [
  { bg: '#0D9488', light: '#CCFBF1', name: 'teal' },
  { bg: '#6366F1', light: '#E0E7FF', name: 'indigo' },
  { bg: '#F43F5E', light: '#FFE4E6', name: 'rose' },
  { bg: '#F59E0B', light: '#FEF3C7', name: 'amber' },
  { bg: '#8B5CF6', light: '#EDE9FE', name: 'violet' },
  { bg: '#EC4899', light: '#FCE7F3', name: 'pink' },
  { bg: '#14B8A6', light: '#D1FAE5', name: 'emerald' },
  { bg: '#3B82F6', light: '#DBEAFE', name: 'blue' },
];

export const getDoctorColor = (doctorId) => {
  const index = (doctorId || 0) % DOCTOR_COLORS.length;
  return DOCTOR_COLORS[index];
};

// ─── Status Colors ───────────────────────────────────────────
const STATUS_MAP = {
  'محجوز': { bg: '#DBEAFE', text: '#1D4ED8', dot: '#3B82F6', label: 'محجوز' },
  'في قاعة الانتظار': { bg: '#FEF3C7', text: '#B45309', dot: '#F59E0B', label: 'في الانتظار' },
  'في الكشف': { bg: '#EDE9FE', text: '#6D28D9', dot: '#8B5CF6', label: 'في الكشف' },
  'تم': { bg: '#D1FAE5', text: '#065F46', dot: '#10B981', label: 'تم الكشف' },
  'ملغى': { bg: '#FFE4E6', text: '#BE123C', dot: '#EF4444', label: 'ملغى' },
  // Backward compatibility
  'في الإنتظار': { bg: '#FEF3C7', text: '#B45309', dot: '#F59E0B', label: 'في الانتظار' },
  'وصل العيادة': { bg: '#DBEAFE', text: '#1D4ED8', dot: '#3B82F6', label: 'وصل العيادة' },
};

export const getStatusColor = (status) => {
  return STATUS_MAP[status] || STATUS_MAP['محجوز'];
};

// قائمة الحالات الرسمية (بدون backward compat)
export const STATUSES = [
  { value: 'محجوز', label: 'محجوز', color: '#3B82F6' },
  { value: 'في قاعة الانتظار', label: 'في قاعة الانتظار', color: '#F59E0B' },
  { value: 'في الكشف', label: 'في الكشف', color: '#8B5CF6' },
  { value: 'تم', label: 'تم', color: '#10B981' },
  { value: 'ملغى', label: 'ملغى', color: '#EF4444' },
];

// ─── Working Hours (localStorage) ────────────────────────────
const SETTINGS_KEY = 'clinic_settings';

const DEFAULT_SETTINGS = {
  workingHours: {
    0: { enabled: true, start: '09:00', end: '21:00' },  // السبت
    1: { enabled: true, start: '09:00', end: '21:00' },  // الأحد
    2: { enabled: true, start: '09:00', end: '21:00' },  // الاثنين
    3: { enabled: true, start: '09:00', end: '21:00' },  // الثلاثاء
    4: { enabled: true, start: '09:00', end: '21:00' },  // الأربعاء
    5: { enabled: true, start: '09:00', end: '21:00' },  // الخميس
    6: { enabled: false, start: '09:00', end: '21:00' }, // الجمعة
  },
  defaultDuration: 30,  // بالدقيقة
  slotInterval: 30,     // بالدقيقة
};

export const DAY_NAMES_AR = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

export const getSettings = () => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error reading settings:', e);
  }
  return DEFAULT_SETTINGS;
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (e) {
    console.error('Error saving settings:', e);
    return false;
  }
};

// ─── Date Helpers ────────────────────────────────────────────

/** أيام الشهر مع padding لبداية ونهاية الأسبوع */
export const getMonthCalendarDays = (date) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 6 }); // السبت
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 6 });

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
};

/** أيام الأسبوع الحالي */
export const getWeekDays = (date) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 6 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 6 });
  return eachDayOfInterval({ start: weekStart, end: weekEnd });
};

/** الخانات الزمنية لليوم بناءً على الإعدادات */
export const getTimeSlots = (date) => {
  const settings = getSettings();
  const dayOfWeek = getDay(date);
  // تحويل من JS day (0=أحد) إلى نظامنا (0=سبت)
  const mappedDay = dayOfWeek === 6 ? 0 : dayOfWeek + 1;
  // Fix: map JS getDay() (0=Sunday) to our system (0=Saturday)
  // JS: 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat
  // Our: 0=Sat,1=Sun,2=Mon,3=Tue,4=Wed,5=Thu,6=Fri
  const dayMapping = { 6: 0, 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6 };
  const ourDay = dayMapping[dayOfWeek];

  const daySettings = settings.workingHours[ourDay];
  if (!daySettings || !daySettings.enabled) return [];

  const [startH, startM] = daySettings.start.split(':').map(Number);
  const [endH, endM] = daySettings.end.split(':').map(Number);
  const interval = settings.slotInterval;

  const slots = [];
  let currentH = startH;
  let currentM = startM;

  while (currentH < endH || (currentH === endH && currentM < endM)) {
    const time = `${String(currentH).padStart(2, '0')}:${String(currentM).padStart(2, '0')}`;
    slots.push(time);
    currentM += interval;
    if (currentM >= 60) {
      currentH += Math.floor(currentM / 60);
      currentM = currentM % 60;
    }
  }

  return slots;
};

// ─── Navigation ──────────────────────────────────────────────
export const navigateDate = (currentDate, direction, viewMode) => {
  const fn = direction === 'next'
    ? { month: addMonths, week: addWeeks, day: addDays }
    : { month: subMonths, week: subWeeks, day: subDays };

  const navFn = fn[viewMode] || fn.day;
  return navFn(currentDate, 1);
};

// ─── Formatting ──────────────────────────────────────────────
export const formatDateAr = (date, formatStr = 'dd MMMM yyyy') => {
  return format(date, formatStr, { locale: ar });
};

export const formatTime12 = (time24) => {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'م' : 'ص';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
};

// ─── Appointment Helpers ─────────────────────────────────────

/** تجميع المواعيد حسب التاريخ */
export const groupAppointmentsByDate = (appointments) => {
  const groups = {};
  appointments.forEach(appt => {
    if (!appt.date) return;
    const dateKey = format(new Date(appt.date), 'yyyy-MM-dd');
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(appt);
  });
  return groups;
};

/** عدد المواعيد في يوم معين */
export const getAppointmentsForDay = (appointments, day) => {
  return appointments.filter(appt => {
    if (!appt.date) return false;
    return isSameDay(new Date(appt.date), day);
  });
};

/** حساب الإحصائيات */
export const calculateStats = (appointments, targetDate = new Date()) => {
  const todayAppts = getAppointmentsForDay(appointments, targetDate);

  return {
    total: todayAppts.length,
    booked: todayAppts.filter(a => a.status === 'محجوز').length,
    waiting: todayAppts.filter(a => a.status === 'في قاعة الانتظار').length,
    inProgress: todayAppts.filter(a => a.status === 'في الكشف').length,
    done: todayAppts.filter(a => a.status === 'تم').length,
    cancelled: todayAppts.filter(a => a.status === 'ملغى').length,
    // backward compat
    arrived: todayAppts.filter(a => a.status === 'في قاعة الانتظار' || a.status === 'وصل العيادة').length,
    revenue: todayAppts.filter(a => a.payment).reduce((sum, a) => sum + (a.amount || 0), 0),
    unpaid: todayAppts.filter(a => !a.payment).length,
  };
};

// Re-exports
export { isToday, isSameDay, isSameMonth, format };
