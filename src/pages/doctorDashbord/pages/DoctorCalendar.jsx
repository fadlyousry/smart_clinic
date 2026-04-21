import React, { useState, useEffect, useMemo } from 'react';
import useDoctorDashboardStore from '../../../store/doctorDashboardStore';
import useAuthStore from '../../../store/auth';
import { setupRealtimePatients } from '../../../lib/supabaseRealtime';
import QuickStats from '../../Reception/components/calendar/QuickStats';
import DateNavigator from '../../Reception/components/calendar/DateNavigator';
import MonthlyView from '../../Reception/components/calendar/MonthlyView';
import WeeklyView from '../../Reception/components/calendar/WeeklyView';
import DailyTimeline from '../../Reception/components/calendar/DailyTimeline';
import EnhancedListView from '../../Reception/components/calendar/EnhancedListView';
import { calculateStats, navigateDate } from '../../Reception/utils/calendarHelpers';
import { CalendarDays, List, Clock, LayoutGrid } from 'lucide-react';

const DoctorCalendar = () => {
  const { CUdoctorId } = useAuthStore();
  const doctorId = CUdoctorId();
  
  const loading = useDoctorDashboardStore((state) => state.loading);
  const patients = useDoctorDashboardStore((state) => state.patients);
  const appointments = useDoctorDashboardStore((state) => state.appointments);
  const fetchData = useDoctorDashboardStore((state) => state.fetchData);

  const [viewMode, setViewMode] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
    const channel = setupRealtimePatients();
    return () => channel?.unsubscribe();
  }, []);

  // فلتر المواعيد بالدكتور المسجل + تحويلها لنفس الشكل بتاع الريسيبشن
  const doctorAppointments = useMemo(() => {
    const filtered = doctorId
      ? appointments.filter(app => app.doctor_id === doctorId)
      : appointments;

    return filtered.map(app => {
      const patient = patients.find(p => p.id === app.patient_id);
      return {
        id: app.id,
        date: app.date,
        status: app.status,
        reason: app.reason || '',
        payment: app.payment,
        cancelled: app.cancelled,
        amount: app.amount,
        patient_id: app.patient_id,
        patientName: patient?.fullName || 'غير محدد',
        phoneNumber: patient?.phoneNumber || '',
        address: patient?.address || '',
        age: patient?.age || '',
        doctor_id: app.doctor_id,
        doctorName: 'أنا',
        visitType: app.visitType || 'غير محدد',
      };
    }).filter(app => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        app.patientName?.toLowerCase().includes(q) ||
        app.phoneNumber?.includes(q) ||
        app.visitType?.toLowerCase().includes(q)
      );
    });
  }, [appointments, patients, doctorId, searchQuery]);

  const stats = useMemo(() => calculateStats(doctorAppointments, selectedDate), [doctorAppointments, selectedDate]);

  const handleView = (appt) => {
    // يمكن إضافة modal لاحقاً
  };

  const handleEdit = (appt) => {
    // الدكتور مش بيعدل المواعيد
  };

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
      appointments: doctorAppointments,
      onView: handleView,
      onEdit: handleEdit,
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

  const viewModes = [
    { key: 'month', label: 'شهري', icon: CalendarDays },
    { key: 'week', label: 'أسبوعي', icon: LayoutGrid },
    { key: 'day', label: 'يومي', icon: Clock },
    { key: 'list', label: 'قائمة', icon: List },
  ];

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4" dir="rtl" style={{ height: 'calc(100vh - 80px)' }}>
      {/* العنوان */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl font-bold text-gray-800">📅 تقويم المواعيد</h2>
        
        <div className="flex items-center gap-2">
          {/* بحث */}
          <input
            type="text"
            placeholder="بحث عن مريض..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 w-48"
          />
          
          {/* أزرار العرض */}
          <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
            {viewModes.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setViewMode(key)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === key
                    ? 'bg-white text-cyan-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title={label}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* الإحصائيات */}
      <QuickStats stats={stats} />

      {/* التنقل بين التواريخ */}
      <DateNavigator
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        viewMode={viewMode}
      />

      {/* منطقة العرض */}
      <div className="flex-1 min-h-0">
        {renderView()}
      </div>
    </div>
  );
};

export default DoctorCalendar;
