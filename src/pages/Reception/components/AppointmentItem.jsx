import React, { useState, useEffect, memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { supabase } from '../../../supaBase/ReceptionBooking';
import useAppointmentStore from '../../../store/appointmentStore';
import { AppointmentRow } from './AppointmentRow';
import { AppointmentViewModal } from './AppointmentViewModal';

const AppointmentItem = memo(({ appt, index, updateAppointment, deleteAppointment, togglePaymentStatus, onEdit }) => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase.from('doctors').select('id, name, fees');
      if (!error) setDoctors(data || []);
    };
    fetchDoctors();
  }, []);

  return (
    <>
      <AppointmentRow
        appt={appt}
        index={index}
        isMobile={isMobile}
        onView={() => setShowViewModal(true)}
        onEdit={onEdit}
        deleteAppointment={deleteAppointment}
        updateAppointment={updateAppointment}
        togglePaymentStatus={togglePaymentStatus}
      />
      
      <AppointmentViewModal 
        show={showViewModal}
        onClose={() => setShowViewModal(false)}
        appt={{ ...appt, index }} 
        updateAppointment={updateAppointment}
      />
    </>
  );
});

export default AppointmentItem;
