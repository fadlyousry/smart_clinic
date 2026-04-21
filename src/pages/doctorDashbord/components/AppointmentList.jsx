import React from "react";
import useDoctorDashboardStore from "../../../store/doctorDashboardStore";
import { useNavigate } from "react-router-dom";
import usePatientStore from "../../../store/patientStore";
import Swal from "sweetalert2";

export function AppointmentList({ appointmentss }) {
    const { startVisit, endVisit, exetVisit } = useDoctorDashboardStore();

    const navigate = useNavigate();
    const setSelectedPatientName = usePatientStore((state) => state.setSelectedPatientName);

    const handleStartVisit = async (appointment) => {
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

    const handleEndVisit = async (appointment) => {
        await endVisit(appointment.id);
    };

    return (
        <div className="space-y-4 max-h-[50vh] overflow-y-auto">
            {appointmentss
                .sort((a, b) => {
                    const order = {
                        "في الكشف": 1,
                        "في قاعة الانتظار": 2,
                        "محجوز": 3,
                        "تم": 4,
                        "ملغى": 5
                    };

                    if ((order[a.status] || 99) !== (order[b.status] || 99)) {
                        return (order[a.status] || 99) - (order[b.status] || 99);
                    }

                    return (a.time || "").localeCompare(b.time || "");
                })

                .map((appointment) => (
                    <div
                        key={appointment.id}
                        className={`border rounded-2xl p-4 hover:shadow-md transition-shadow bg-white ${
                            appointment.status === 'في الكشف' ? 'border-purple-300 ring-2 ring-purple-100' : 'border-gray-100'
                        }`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-3 space-x-reverse">
                                <div>
                                    <h4 className="font-bold text-gray-800">{appointment.patient}</h4>
                                    <p className="text-gray-500 text-sm mt-1">{appointment.type}</p>
                                    <div className="flex items-center mt-2 text-sm text-gray-500">
                                        <span>الموعد: {appointment.time}</span>
                                    </div>
                                </div>
                            </div>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    appointment.status === "في قاعة الانتظار"
                                        ? "bg-amber-100 text-amber-800"
                                        : appointment.status === "في الكشف"
                                            ? "bg-purple-100 text-purple-800"
                                            : appointment.status === "تم"
                                                ? "bg-green-100 text-green-800"
                                                : appointment.status === "ملغى"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-blue-100 text-blue-800"
                                }`}
                            >
                                {appointment.status}
                            </span>
                        </div>

                        <div className="flex space-x-2 space-x-reverse mt-4">
                            <button
                                className="text-sm text-blue-600 px-3 py-1 rounded-2xl bg-cyan-100 hover:bg-cyan-300 transition flex items-center gap-1 mx-1"
                                onClick={() => {
                                    if (appointment.patient_id) {
                                        setSelectedPatientName({ id: appointment.patient_id });
                                    } else {
                                        setSelectedPatientName(appointment.patient);
                                    }
                                    navigate("/DoctorDashboard/records");
                                }}
                            >
                                الملف الطبي
                            </button>

                            {/* بدء الكشف — يظهر لما المريض في قاعة الانتظار */}
                            {appointment.status === "في قاعة الانتظار" && (
                                <button
                                    className="text-sm text-white px-3 py-1 rounded-2xl bg-emerald-500 hover:bg-emerald-600 transition flex items-center gap-1 mx-1"
                                    onClick={() => handleStartVisit(appointment)}
                                >
                                    🩺 بدء الكشف
                                </button>
                            )}

                            {/* إنهاء الكشف — يظهر لما المريض في الكشف */}
                            {appointment.status === "في الكشف" && (
                                <button
                                    className="text-sm text-white px-3 py-1 rounded-2xl bg-red-500 hover:bg-red-600 transition flex items-center gap-1 mx-1"
                                    onClick={() => handleEndVisit(appointment)}
                                >
                                    ✅ إنهاء الكشف
                                </button>
                            )}

                            {/* إلغاء — يظهر لما المريض في قاعة الانتظار */}
                            {appointment.status === "في قاعة الانتظار" && (
                                <button
                                    className="text-sm text-red-800 px-3 py-1 rounded-2xl bg-red-100 hover:bg-red-300 transition flex items-center gap-1 mx-1"
                                    onClick={() => exetVisit(appointment.id)}
                                >
                                    إلغاء
                                </button>
                            )}
                        </div>
                    </div>
                ))}
        </div>
    );
}