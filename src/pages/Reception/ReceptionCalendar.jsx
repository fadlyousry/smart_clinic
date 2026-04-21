import React, { useState, useEffect } from 'react';
import { supabase } from '../../supaBase/ReceptionBooking';
import useCalendarData from './hooks/useCalendarData';
import QuickStats from './components/calendar/QuickStats';
import CalendarToolbar from './components/calendar/CalendarToolbar';
import DateNavigator from './components/calendar/DateNavigator';
import MonthlyView from './components/calendar/MonthlyView';
import WeeklyView from './components/calendar/WeeklyView';
import DailyTimeline from './components/calendar/DailyTimeline';
import EnhancedListView from './components/calendar/EnhancedListView';
import { AppointmentModal } from './components/AppointmentModal';
import { AppointmentViewModal } from './components/AppointmentViewModal';

const ReceptionCalendar = () => {
  const calendar = useCalendarData();
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewAppt, setViewAppt] = useState(null);
  const [editData, setEditData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '', address: '', age: '', phoneNumber: '',
    visitType: '', notes: '', doctor_id: '', appointmentDateTime: '',
    status: 'محجوز', amount: null, payment: false,
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    calendar.fetchAppointments();
    const fetchDoctors = async () => {
      const { data, error } = await supabase.from('doctors').select('id, name, fees');
      if (!error) setDoctors(data || []);
    };
    fetchDoctors();

    const subscription = supabase
      .channel('calendar-appointments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        calendar.fetchAppointments();
      })
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  const handleOpenAdd = () => {
    setEditData(null);
    setFormData({
      fullName: '', address: '', age: '', phoneNumber: '',
      visitType: '', notes: '', doctor_id: '', appointmentDateTime: '',
      status: 'محجوز', amount: null, payment: false,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleView = (appt) => {
    setViewAppt(appt);
    setShowViewModal(true);
  };

  const handleEdit = (appt) => {
    setEditData(appt);
    setFormData({
      fullName: appt.patientName || '',
      address: appt.address || '',
      age: appt.age || '',
      phoneNumber: appt.phoneNumber || '',
      visitType: appt.visitType || '',
      notes: appt.reason || '',
      doctor_id: appt.doctor_id || '',
      appointmentDateTime: appt.date || '',
      status: appt.status || 'محجوز',
      amount: appt.amount || null,
      payment: appt.payment || false,
      patient_id: appt.patient_id || null,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const renderView = () => {
    const commonProps = {
      selectedDate: calendar.selectedDate,
      appointments: calendar.appointments,
      onView: handleView,
      onEdit: handleEdit,
    };

    switch (calendar.viewMode) {
      case 'month':
        return (
          <MonthlyView
            {...commonProps}
            setSelectedDate={calendar.setSelectedDate}
            setViewMode={calendar.setViewMode}
          />
        );
      case 'week':
        return (
          <WeeklyView
            {...commonProps}
            setSelectedDate={calendar.setSelectedDate}
            setViewMode={calendar.setViewMode}
          />
        );
      case 'day':
        return <DailyTimeline {...commonProps} />;
      case 'list':
        return <EnhancedListView {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4 h-[calc(100vh-80px)]" dir="rtl">
      {/* الملخص السريع */}
      <QuickStats stats={calendar.stats} />

      {/* شريط الأدوات */}
      <CalendarToolbar
        viewMode={calendar.viewMode}
        setViewMode={calendar.setViewMode}
        searchQuery={calendar.searchQuery}
        setSearchQuery={calendar.setSearchQuery}
        onAddAppointment={handleOpenAdd}
        filters={calendar.filters}
        setFilters={calendar.setFilters}
        doctors={calendar.doctors}
        filteredCount={calendar.appointments.length}
      />

      {/* التنقل بين التواريخ */}
      <DateNavigator
        selectedDate={calendar.selectedDate}
        setSelectedDate={calendar.setSelectedDate}
        viewMode={calendar.viewMode}
      />

      {/* منطقة العرض الرئيسية */}
      <div className="flex-1 min-h-0">
        {renderView()}
      </div>

      {/* Modal إضافة / تعديل موعد */}
      <AppointmentModal
        showModal={showModal}
        setShowModal={setShowModal}
        formData={formData}
        setFormData={setFormData}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
        doctors={doctors}
        editData={editData}
      />

      {/* Modal عرض تفاصيل الموعد */}
      <AppointmentViewModal
        show={showViewModal}
        onClose={() => setShowViewModal(false)}
        appt={viewAppt}
        updateAppointment={calendar.updateAppointment}
      />
    </div>
  );
};

export default ReceptionCalendar;
