import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppointmentStore from '../../store/appointmentStore';

const CancelPage = () => {
  const navigate = useNavigate();
  const { fetchAppointments } = useAppointmentStore();

  useEffect(() => {
    fetchAppointments(); // Refresh appointments to reflect cancellation
    setTimeout(() => navigate('/appointments'), 3000); // Redirect after 3 seconds
  }, [fetchAppointments, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">تم إلغاء الدفع</h2>
        <p className="text-gray-700">لم يتم إكمال الدفع. سيتم إعادة توجيهك إلى صفحة المواعيد قريبًا.</p>
      </div>
    </div>
  );
};

export default CancelPage;