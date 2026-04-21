import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setupRealtimePatients } from "../../../lib/supabaseRealtime";
import useDoctorDashboardStore from "../../../store/doctorDashboardStore";
import useAuthStore from "../../../store/auth";
import usePatientStore from "../../../store/patientStore";

import AppointmentTabs from "../components/appointments/AppointmentTabs.jsx";
import AppointmentFilters from "../components/appointments/AppointmentFilters.jsx";
import AppointmentTable from "../components/appointments/AppointmentTable.jsx";
import AppointmentMobileList from "../components/appointments/AppointmentMobileList.jsx";
import AppointmentStats from "../components/appointments/AppointmentStats.jsx";
import AppointmentModal from "../components/appointments/AppointmentModal.jsx";
import EmptyState from "../components/appointments/EmptyState.jsx";
import Swal from "sweetalert2";

const Appointments = () => {

    const [activeTab, setActiveTab] = useState("queue");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("الكل");
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const { CUdoctorId } = useAuthStore();
    const { setSelectedPatientName } = usePatientStore();
    const loading = useDoctorDashboardStore((state) => state.loading);
    const patients = useDoctorDashboardStore((state) => state.patients);
    const appointments = useDoctorDashboardStore((state) => state.appointments);
    const startVisit = useDoctorDashboardStore((state) => state.startVisit);
    const endVisit = useDoctorDashboardStore((state) => state.endVisit);

    const doctorId = CUdoctorId();

    useEffect(() => {
        const channel = setupRealtimePatients();
        return () => channel.unsubscribe();
    }, []);


    const today = new Date().toISOString().split("T")[0];

    const openAppointmentDetails = (appointment) => {
        setSelectedAppointment(appointment);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAppointment(null);
    };

    // استقبال المريض
    const handleReceivePatient = async (appointment) => {
        const result = await startVisit(appointment.id);
        if (result?.error) {
            Swal.fire({
                icon: 'warning',
                title: 'لا يمكن الاستقبال',
                text: result.error,
                confirmButtonText: 'حسناً',
                confirmButtonColor: '#0097A7',
            });
        }
    };

    // إنهاء الكشف
    const handleEndExam = async (appointment) => {
        await endVisit(appointment.id);
    };


    if (loading) {
        return <div className="p-4 text-blue-600">جاري التحميل...</div>;
    }

    if (!appointments.length || !patients.length) {
        return <div className="p-4 text-red-600">لا توجد بيانات متاحة</div>;
    }

    // فلتر بالدكتور المسجل دخوله
    const doctorAppointments = doctorId
        ? appointments.filter(app => app.doctor_id === doctorId)
        : appointments;

    const filteredAppointmentsByTab = doctorAppointments.filter((app) => {
        if (activeTab === "queue") {
            // المرضى اللي في قاعة الانتظار اليوم
            return app.date === today && app.status === "في قاعة الانتظار";
        }
        if (activeTab === "inExam") {
            // المريض اللي عند الدكتور دلوقتي
            return app.status === "في الكشف";
        }
        if (activeTab === "done") {
            return app.date === today && app.status === "تم";
        }
        if (activeTab === "upcoming") return app.date > today;
        if (activeTab === "past") return app.date < today;
        return false;
    });


    const filteredAppointments = filteredAppointmentsByTab
        .filter((app) => {
            if (statusFilter === "الكل") return true;
            return app.status === statusFilter;
        })
        .map((app) => {
            const patient = patients.find((p) => p.id === app.patient_id);
            return {
                id: app.id,
                patient_id: app.patient_id,
                patientName: patient?.fullName || "مريض غير معروف",
                phone: patient?.phoneNumber || "غير متوفر",
                date: app.date,
                time: app.time ? new Date(`1970-01-01T${app.time}`).toLocaleTimeString("ar-EG", {
                    hour: "2-digit",
                    minute: "2-digit",
                }) : "",
                reason: app.reason,
                visitType: app.visitType,
                status: app.status,
            };
        })
        .filter(
            (appointment) =>
                appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                appointment.phone.includes(searchQuery)
        );

    return (
        <div className="px-6 min-h-screen" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex flex-col font-bold mx-2 sm:mx-4 lg:mx-6 my-3">
                    <span className="text-base sm:text-lg lg:text-xl">جدول المواعيد</span>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="bg-gray-100 rounded-lg shadow-sm p-4 mb-6">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <AppointmentTabs 
                        activeTab={activeTab} 
                        setActiveTab={setActiveTab} 
                    />
                    
                    <AppointmentFilters
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                    />
                </div>

                {/* Appointments List */}
                <div className="rounded-lg overflow-hidden mt-4">
                    {filteredAppointments.length > 0 ? (
                        <>
                            {/* Desktop Table View */}
                            <AppointmentTable 
                                appointments={filteredAppointments}
                                onViewDetails={openAppointmentDetails}
                                onReceivePatient={activeTab === "queue" ? handleReceivePatient : null}
                                onEndExam={activeTab === "inExam" ? handleEndExam : null}
                            />

                            {/* Mobile List View */}
                            <AppointmentMobileList 
                                appointments={filteredAppointments}
                                onViewDetails={openAppointmentDetails}
                                onReceivePatient={activeTab === "queue" ? handleReceivePatient : null}
                                onEndExam={activeTab === "inExam" ? handleEndExam : null}
                            />
                        </>
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </div>

            {/* Statistics Summary */}
            <AppointmentStats 
                appointments={filteredAppointmentsByTab}
            />

            {/* Appointment Details Modal */}
            <AppointmentModal
                isOpen={isModalOpen}
                appointment={selectedAppointment}
                onClose={closeModal}
            />
        </div>
    );
};

export default Appointments;