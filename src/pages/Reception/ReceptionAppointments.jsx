import React, { useState, useEffect } from 'react';
import { supabase } from '../../supaBase/ReceptionBooking';
import useAppointmentStore from '../../store/appointmentStore';
import { AppointmentHelmet } from './components/AppointmentHelmet';
import { AppointmentSearchBar } from './components/AppointmentSearchBar';
import { AppointmentListHeader } from './components/AppointmentListHeader';
import { AppointmentTable } from './components/AppointmentTable';
import { AppointmentModal } from './components/AppointmentModal';
import { ErrorMessage } from './components/ErrorMessage';
import { EmptyState } from './components/EmptyState';
import { useMediaQuery } from 'react-responsive';


const ReceptionAppointments = () => {
  const { appointments, fetchAppointments, error, updateAppointment, deleteAppointment, togglePaymentStatus } = useAppointmentStore();
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    age: '',
    phoneNumber: '',
    visitType: '',
    notes: '',
    doctor_id: '',
    appointmentDateTime: '',
    status: 'محجوز',
    amount: null,
    payment: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState(appointments);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isTablet = useMediaQuery({ query: '(max-width: 1024px)' });

  useEffect(() => {
    fetchAppointments();
    const fetchDoctors = async () => {
      const { data, error } = await supabase.from('doctors').select('id, name, fees');
      if (error) {
        console.error('Error fetching doctors:', error);
      } else {
        setDoctors(data || []);
      }
    };
    fetchDoctors();

    const subscription = supabase
      .channel('appointments-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, payload => {
        fetchAppointments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchAppointments]);

  useEffect(() => {
    let filtered = appointments;

    if (searchQuery) {
      filtered = filtered.filter(
        appt =>
          (appt.patientName && appt.patientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (appt.phoneNumber && appt.phoneNumber.includes(searchQuery)) ||
          (appt.doctorName && appt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (filter !== 'all') {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      filtered = filtered.filter(appt => {
        if (!appt.date) return false;
        const apptDate = new Date(appt.date);
        if (filter === 'today') {
          return apptDate.toDateString() === today.toDateString();
        } else if (filter === 'tomorrow') {
          return apptDate.toDateString() === tomorrow.toDateString();
        } else if (filter === 'week') {
          return apptDate >= startOfWeek && apptDate <= endOfWeek;
        }
        return true;
      });
    }

    setFilteredAppointments(filtered);
  }, [appointments, filter, searchQuery]);

  const handleOpenAdd = () => {
    setEditData(null);
    setFormData({
      fullName: '',
      address: '',
      age: '',
      phoneNumber: '',
      visitType: '',
      notes: '',
      doctor_id: '',
      appointmentDateTime: '',
      status: 'محجوز',
      amount: null,
      payment: false,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleOpenEdit = (appt) => {
    setEditData(appt);
    setShowModal(true);
  };

  return (
    <div className="p-4 sm:p-6" dir="rtl">
      <AppointmentHelmet />
      <div
        className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-100 flex flex-col h-[calc(100vh-120px)]"
      >
        <AppointmentListHeader setShowModal={handleOpenAdd} />
        <AppointmentSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filter={filter}
          setFilter={setFilter}
        />
        <div className="flex-1 overflow-y-auto mt-4 custom-scrollbar">
          {error && <ErrorMessage error={error} />}
          {filteredAppointments.length === 0 && !error ? (
            <EmptyState searchQuery={searchQuery} />
          ) : (
            <AppointmentTable
              filteredAppointments={filteredAppointments}
              isMobile={isMobile}
              isTablet={isTablet}
              updateAppointment={updateAppointment}
              deleteAppointment={deleteAppointment}
              togglePaymentStatus={togglePaymentStatus}
              onEdit={handleOpenEdit}
            />
          )}
        </div>
      </div>
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
    </div>
  );
};

export default ReceptionAppointments;
