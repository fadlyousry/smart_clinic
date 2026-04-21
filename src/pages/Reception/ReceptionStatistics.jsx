import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supaBase/ReceptionBooking';
import useAppointmentStore from '../../store/appointmentStore';
import { AppointmentCharts } from './components/AppointmentCharts';
import { AppointmentStats } from './components/AppointmentStats';
import { useMediaQuery } from 'react-responsive';

import { Activity } from 'lucide-react';

const ReceptionStatistics = () => {
  const { appointments, fetchAppointments } = useAppointmentStore();
  const [doctors, setDoctors] = useState([]);
  const lineChartRef = useRef(null);
  const visitTypeChartRef = useRef(null);
  const doctorChartRef = useRef(null);
  const paymentChartRef = useRef(null);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    fetchAppointments();
    const fetchDoctors = async () => {
      const { data, error } = await supabase.from('doctors').select('id, name, fees');
      if (!error) {
        setDoctors(data || []);
      }
    };
    fetchDoctors();
  }, [fetchAppointments]);

  const getChartData = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const dailyCounts = {};
    const completedCounts = {};
    const pendingCounts = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toLocaleDateString('ar-EG');
      dailyCounts[dateStr] = 0;
      completedCounts[dateStr] = 0;
      pendingCounts[dateStr] = 0;
    }

    let todayCount = 0;
    let weekCount = 0;
    let monthCount = 0;

    appointments.forEach(appt => {
      if (appt.date) {
        const apptDate = new Date(appt.date);
        const dateStr = apptDate.toLocaleDateString('ar-EG');

        if (dailyCounts[dateStr] !== undefined) {
          dailyCounts[dateStr]++;
          if (appt.status === 'تم') {
            completedCounts[dateStr]++;
          } else if (appt.status === 'محجوز') {
            pendingCounts[dateStr]++;
          }
        }

        if (apptDate.toDateString() === today.toDateString()) {
          todayCount++;
        }
        if (apptDate >= startOfWeek && apptDate <= endOfWeek) {
          weekCount++;
        }
        if (apptDate >= startOfMonth && apptDate <= endOfMonth) {
          monthCount++;
        }
      }
    });

    const visitTypeCounts = {
      فحص: { paid: 0, unpaid: 0 },
      متابعة: { paid: 0, unpaid: 0 },
      استشارة: { paid: 0, unpaid: 0 },
    };
    appointments.forEach(appt => {
      if (appt.visitType && visitTypeCounts[appt.visitType] !== undefined) {
        if (appt.payment) {
          visitTypeCounts[appt.visitType].paid++;
        } else {
          visitTypeCounts[appt.visitType].unpaid++;
        }
      }
    });

    const doctorCounts = {};
    doctors.forEach(doctor => {
      doctorCounts[doctor.name] = 0;
    });
    appointments.forEach(appt => {
      if (appt.doctorName) {
        doctorCounts[appt.doctorName] = (doctorCounts[appt.doctorName] || 0) + 1;
      }
    });

    const paymentCounts = {
      paid: 0,
      unpaid: 0,
    };
    appointments.forEach(appt => {
      if (appt.payment) {
        paymentCounts.paid++;
      } else {
        paymentCounts.unpaid++;
      }
    });

    return {
      dailyCounts,
      completedCounts,
      pendingCounts,
      visitTypeCounts,
      doctorCounts,
      paymentCounts,
      todayCount,
      weekCount,
      monthCount,
    };
  };

  return (
    <div className="p-6 bg-white min-h-screen" dir="rtl">
        <div className="flex flex-col font-bold my-3 mb-8">
          <span className="text-xl text-cyan-800">
            إحصائيات العيادة <Activity className="text-cyan-600 inline" />
          </span>
        </div>

      <div>
        <AppointmentStats getChartData={getChartData} />
        <AppointmentCharts
          lineChartRef={lineChartRef}
          visitTypeChartRef={visitTypeChartRef}
          doctorChartRef={doctorChartRef}
          paymentChartRef={paymentChartRef}
          getChartData={getChartData}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

export default ReceptionStatistics;
