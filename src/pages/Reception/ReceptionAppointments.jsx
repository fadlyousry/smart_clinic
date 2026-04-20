import React, { useState, useEffect } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { supabase } from '../../supaBase/ReceptionBooking';
import useAppointmentStore from '../../store/appointmentStore';
import { AppointmentHelmet } from './components/AppointmentHelmet';
import { AppointmentSearchBar } from './components/AppointmentSearchBar';
import { AppointmentListHeader } from './components/AppointmentListHeader';
import { AppointmentTable } from './components/AppointmentTable';
import { AppointmentModal } from './components/AppointmentModal';
import { ErrorMessage } from './components/ErrorMessage';
import { EmptyState } from './components/EmptyState';
import Swal from 'sweetalert2';
import { useMediaQuery } from 'react-responsive';
import { motion } from 'framer-motion';

const ReceptionAppointments = () => {
  const { appointments, fetchAppointments, error, reorderAppointments, updateAppointment, deleteAppointment } = useAppointmentStore();
  const [showModal, setShowModal] = useState(false);
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
    status: 'في الإنتظار',
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 sm:p-6" dir="rtl">
        <AppointmentHelmet />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-100"
        >
          <AppointmentListHeader setShowModal={setShowModal} />
          <AppointmentSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filter={filter}
            setFilter={setFilter}
          />
          {error && <ErrorMessage error={error} />}
          {filteredAppointments.length === 0 && !error ? (
            <EmptyState searchQuery={searchQuery} />
          ) : (
            <AppointmentTable
              filteredAppointments={filteredAppointments}
              isMobile={isMobile}
              isTablet={isTablet}
              reorderAppointments={reorderAppointments}
              updateAppointment={updateAppointment}
              deleteAppointment={deleteAppointment}
            />
          )}
        </motion.div>
        <AppointmentModal
          showModal={showModal}
          setShowModal={setShowModal}
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          doctors={doctors}
        />
      </div>
    </DndProvider>
  );
};

export default ReceptionAppointments;
