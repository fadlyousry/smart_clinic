import React, { useState, useEffect, useRef } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { supabase } from '../../supaBase/NursingBooking';
import useAppointmentStore from '../../store/appointmentStore';
import NursingSidebar from './components/NursingSidebar';
import { NursingTopBar } from './components/NursingTopBar';
import { AppointmentHelmet } from './components/AppointmentHelmet';
import { AppointmentSearchBar } from './components/AppointmentSearchBar';
import { AppointmentListHeader } from './components/AppointmentListHeader';
import { AppointmentTable } from './components/AppointmentTable';
import { AppointmentModal } from './components/AppointmentModal';
import { ErrorMessage } from './components/ErrorMessage';
import { EmptyState } from './components/EmptyState';
import { AppointmentCharts } from './components/AppointmentCharts';
import { AppointmentStats } from './components/AppointmentStats';
import Swal from 'sweetalert2';
import { useMediaQuery } from 'react-responsive';
import { motion } from 'framer-motion';

const NursingAppointments = () => {
  const { appointments, fetchAppointments, error, reorderAppointments } = useAppointmentStore();
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
  const lineChartRef = useRef(null);
  const visitTypeChartRef = useRef(null);
  const doctorChartRef = useRef(null);
  const paymentChartRef = useRef(null);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isTablet = useMediaQuery({ query: '(max-width: 1024px)' });

  useEffect(() => {
    fetchAppointments();
    const fetchDoctors = async () => {
      const { data, error } = await supabase.from('doctors').select('id, name, fees');
      if (error) {
        console.error('Error fetching doctors:', error);
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'فشل في جلب قائمة الأطباء. حاول مرة أخرى.',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#d33',
        });
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
          } else if (appt.status === 'في الإنتظار') {
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
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen w-full pt-16 bg-gradient-to-br from-cyan-50 to-blue-50" dir="rtl">
        <AppointmentHelmet />
        <div className="flex flex-col lg:flex-row">
          <NursingTopBar />
          <div className="w-full lg:w-64 lg:min-h-screen">
            <NursingSidebar />
          </div>
          <main className="flex-1 p-4 sm:p-6 w-full">
            <nav className="bg-white p-3 mb-4 rounded-lg shadow-sm lg:hidden">
              <button
                className="text-gray-700"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#sidebarMenu"
                aria-controls="sidebarMenu"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="inline-block w-6 h-6 bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 30 30%27%3E%3Cpath stroke=%27rgba(0, 0, 0, 0.5)%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-miterlimit=%2710%27 d=%27M4 7h22M4 15h22M4 23h22%27/%3E%3C/svg%3E')] bg-no-repeat bg-center" />
              </button>
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-100"
            >
              <AppointmentStats getChartData={getChartData} />
              <AppointmentCharts
                lineChartRef={lineChartRef}
                visitTypeChartRef={visitTypeChartRef}
                doctorChartRef={doctorChartRef}
                paymentChartRef={paymentChartRef}
                getChartData={getChartData}
                isMobile={isMobile}
              />
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
          </main>
        </div>
      </div>
    </DndProvider>
  );
};

export default NursingAppointments;
