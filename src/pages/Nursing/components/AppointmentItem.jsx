import React, { useState, useEffect, memo } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useMediaQuery } from 'react-responsive';
import { supabase } from '../../../supaBase/NursingBooking';
import useAppointmentStore from '../../../store/appointmentStore';
import { AppointmentRow } from './AppointmentRow';
import { ExpandedView } from './ExpandedView';

const AppointmentItem = memo(({ appt, index, moveAppointment }) => {
  const { deleteAppointment, updateAppointment } = useAppointmentStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    appointmentDateTime: appt.date || '',
    status: appt.status || 'في الإنتظار',
    visitType: appt.visitType || '',
    payment: appt.payment || false,
    amount: appt.amount || null,
    doctor_id: appt.doctor_id || '',
  });
  const [doctors, setDoctors] = useState([]);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase.from('doctors').select('id, name, fees');
      if (!error) setDoctors(data || []);
    };
    fetchDoctors();
  }, []);

  const [{ isDragging }, drag] = useDrag({
    type: 'APPOINTMENT',
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'APPOINTMENT',
    hover: item => {
      if (item.index !== index) {
        moveAppointment(item.index, index);
        item.index = index;
      }
    },
  });

  const handleEditChange = e => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'doctor_id' && {
        amount: doctors.find(d => String(d.id) === value)?.fees || null,
      }),
    }));
  };

  return (
    <>
      <AppointmentRow
        appt={appt}
        index={index}
        isDragging={isDragging}
        drag={drag}
        drop={drop}
        isMobile={isMobile}
        setIsExpanded={setIsExpanded}
        deleteAppointment={deleteAppointment}
      />
      <ExpandedView
        appt={appt}
        isExpanded={isExpanded}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editFormData={editFormData}
        handleEditChange={handleEditChange}
        updateAppointment={updateAppointment}
        doctors={doctors}
        isMobile={isMobile}
      />
    </>
  );
});

export default AppointmentItem;
