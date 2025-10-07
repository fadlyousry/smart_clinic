import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppointmentStore from '../../store/appointmentStore';

const SuccessPage = () => {
  const navigate = useNavigate();
  const { fetchAppointments } = useAppointmentStore();

  useEffect(() => {
    fetchAppointments(); // Refresh appointments to reflect payment status
    setTimeout(() => navigate('/appointments'), 3000); // Redirect after 3 seconds
  }, [fetchAppointments, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">تم الدفع بنجاح!</h2>
        <p className="text-gray-700">شكرًا لدفعك. سيتم إعادة توجيهك إلى صفحة المواعيد قريبًا.</p>
      </div>
    </div>
  );
};

export default SuccessPage;
