import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../../supaBase/booking';
import QuickStats from '../../Reception/components/calendar/QuickStats';
import DateNavigator from '../../Reception/components/calendar/DateNavigator';
import MonthlyView from '../../Reception/components/calendar/MonthlyView';
import WeeklyView from '../../Reception/components/calendar/WeeklyView';
import DailyTimeline from '../../Reception/components/calendar/DailyTimeline';
import EnhancedListView from '../../Reception/components/calendar/EnhancedListView';
import CalendarToolbar from '../../Reception/components/calendar/CalendarToolbar';
import { calculateStats } from '../../Reception/utils/calendarHelpers';
import LabResultModal from '../components/LabResultModal';
import ScienceIcon from '@mui/icons-material/Science';
import Swal from 'sweetalert2';

const LabCalendar = () => {
  const [viewMode, setViewMode] = useState('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [testRequests, setTestRequests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchLabData();

    // إعداد البث المباشر (Realtime) لطلبات التحاليل والمواعيد
    const channel = supabase
      .channel('lab-calendar-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'test_requests' },
        (payload) => {
          console.log('🔁 Realtime update in LabCalendar (test_requests):', payload);
          fetchLabData();
          if (payload.eventType === 'INSERT') playNotificationSound();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        (payload) => {
          console.log('🔁 Realtime update in LabCalendar (appointments):', payload);
          fetchLabData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const playNotificationSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(e => console.log('Audio play failed:', e));
    } catch (err) {
      console.error('Error playing sound:', err);
    }
  };

  const fetchLabData = async () => {
    setLoading(true);
    try {
      // 1. جلب طلبات التحاليل (test_requests)
      const { data: testsData, error: testsError } = await supabase
        .from('test_requests')
        .select(`
          *,
          patients (fullName, phoneNumber),
          tests (name, urgent, test_cat(name)),
          doctors (name)
        `)
        .order('created_at', { ascending: false });

      if (testsError) throw testsError;

      // 2. جلب المواعيد المجدولة (appointments) اللي تخص المعمل
      // بنفترض إن المواعيد اللي فيها كلمة 'معمل' أو 'تحليل' تخصهم
      const { data: apptsData, error: apptsError } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:patient_id (fullName, phoneNumber)
        `)
        .or('visitType.ilike.%معمل%,visitType.ilike.%تحليل%,reason.ilike.%معمل%,reason.ilike.%تحليل%');

      if (apptsError) throw apptsError;

      setTestRequests(testsData || []);
      setAppointments(apptsData || []);
    } catch (error) {
      console.error('Error fetching lab calendar data:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'فشل في تحميل بيانات التقويم',
      });
    } finally {
      setLoading(false);
    }
  };

  // دمج البيانات في شكل واحد يفهمه التقويم
  // دمج البيانات في شكل واحد يفهمه التقويم مع تجميع التحاليل المتعددة
  const combinedEvents = useMemo(() => {
    const events = [];

    // 1. تجميع طلبات التحاليل حسب المريض والدقيقة
    const testGroups = {};
    testRequests.forEach(req => {
      const minute = new Date(req.created_at).toISOString().substring(0, 16);
      const key = `${req.patient_id}_${minute}`;
      if (!testGroups[key]) testGroups[key] = [];
      testGroups[key].push(req);
    });

    // تحويل المجموعات لأحداث
    Object.values(testGroups).forEach(group => {
      const first = group[0];
      const isBatch = group.length > 1;

      events.push({
        ...first, // حفظ بيانات الأول كمرجع
        requests: group, // حفظ كل الطلبات للمودال
        isBatch,
        originalId: first.id,
        id: `req-${first.id}`,
        date: first.created_at,
        status: group.every(r => r.status === 'مكتمل') ? 'تم' : 'قيد التنفيذ',
        patientName: first.patients?.fullName || 'مريض مجهول',
        phoneNumber: first.patients?.phoneNumber || '',
        visitType: isBatch ? `مجموعة تحاليل (${group.length})` : `تحليل: ${first.tests?.name || 'تحليل خارجي'}`,
        doctorName: first.doctors?.name || 'طلب داخلي',
        type: 'test_request',
        customColor: { bg: '#00bcd4', light: '#e0f7fa', name: 'cyan' }
      });
    });

    // 2. تحويل المواعيد المجدولة لأحداث (لون تيل - Teal)
    appointments.forEach(appt => {
      events.push({
        ...appt,
        originalId: appt.id,
        id: `appt-${appt.id}`,
        date: appt.date,
        status: appt.status,
        patientName: appt.patient?.fullName || 'مريض مجهول',
        phoneNumber: appt.patient?.phoneNumber || '',
        visitType: appt.visitType || 'موعد معمل مجدول',
        doctorName: 'حجز خارجي',
        type: 'appointment',
        customColor: { bg: '#0D9488', light: '#CCFBF1', name: 'teal' }
      });
    });

    return events.filter(ev => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        ev.patientName.toLowerCase().includes(q) ||
        ev.phoneNumber.includes(q)
      );
    });
  }, [testRequests, appointments, searchQuery]);

  const stats = useMemo(() => calculateStats(combinedEvents, selectedDate), [combinedEvents, selectedDate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  const renderView = () => {
    const commonProps = {
      selectedDate,
      appointments: combinedEvents,
      onView: (event) => {
        if (event.type === 'test_request') {
          setSelectedEvent(event);
          setShowModal(true);
        } else {
          // يمكن عرض تفاصيل الموعد هنا لاحقاً
          Swal.fire({
            title: 'تفاصيل الموعد المجدول',
            html: `<b>المريض:</b> ${event.patientName}<br><b>النوع:</b> ${event.visitType}<br><b>الوقت:</b> ${new Date(event.date).toLocaleTimeString()}`,
            icon: 'info'
          });
        }
      }
    };

    switch (viewMode) {
      case 'month':
        return <MonthlyView {...commonProps} setSelectedDate={setSelectedDate} setViewMode={setViewMode} />;
      case 'week':
        return <WeeklyView {...commonProps} setSelectedDate={setSelectedDate} setViewMode={setViewMode} />;
      case 'day':
        return <DailyTimeline {...commonProps} />;
      case 'list':
        return <EnhancedListView {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4" dir="rtl" style={{ height: 'calc(100vh - 120px)' }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <ScienceIcon className="text-cyan-600" />
          تقويم المعمل المتكامل
        </h2>

        <CalendarToolbar
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchPlaceholder="بحث عن مريض..."
        />
      </div>

      {/* التوجيه اللوني */}
      <div className="flex gap-4 text-xs font-bold px-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-cyan-500"></div>
          <span>طلبات الأطباء (داخلية)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-teal-600"></div>
          <span>مواعيد المعمل (خارجية)</span>
        </div>
      </div>

      {/* التنقل بين التواريخ */}
      <DateNavigator
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        viewMode={viewMode}
      />

      {/* منطقة العرض */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {renderView()}
      </div>

      {showModal && selectedEvent && (
        <LabResultModal 
          request={selectedEvent}
          onClose={() => {
            setShowModal(false);
            setSelectedEvent(null);
          }}
          onSuccess={fetchLabData}
        />
      )}
    </div>
  );
};

export default LabCalendar;
