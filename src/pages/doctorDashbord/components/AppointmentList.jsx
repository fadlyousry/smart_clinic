import React from "react";
import useDoctorDashboardStore from "../../../store/doctorDashboardStore";
import { useNavigate } from "react-router-dom";
import usePatientStore from "../../../store/patientStore";

export function AppointmentList({ appointmentss }) {
    const { startVisit, endVisit, exetVisit } = useDoctorDashboardStore();

    const navigate = useNavigate();
    const setSelectedPatientName = usePatientStore((state) => state.setSelectedPatientName);

    return (
        <div className="space-y-4 max-h-[50vh] overflow-y-auto">
            {appointmentss
                .sort((a, b) => {
                    const order = {
                        "قيد الكشف": 1,
                        "في الإنتظار": 2,
                        "تم": 3,
                        "ملغي": 4
                    };

                    if (order[a.status] !== order[b.status]) {
                        return order[a.status] - order[b.status];
                    }

                    // لو نفس الحالة → رتب بالوقت
                    return a.time.localeCompare(b.time);
                })

                .map((appointment) => (
                    <div
                        key={appointment.id}
                        className="border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow bg-white "
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
                                className={`px-2 py-1 rounded-full text-xs font-medium ${appointment.status === "في الإنتظار"
                                        ? "bg-orange-100 text-yellow-800"
                                        : appointment.status === "ملغي"
                                            ? "bg-red-100 text-red-800"
                                            : appointment.status === "قيد الكشف"
                                                ? "bg-yellow-200 text-yellow-900"
                                                : appointment.status === "تم"
                                                    ? "bg-green-200 text-green-800"
                                                    : "bg-gray-100 text-yellow-800"
                                    }`}
                            >
                                {appointment.status}
                            </span>
                        </div>

                        <div className="flex space-x-2 space-x-reverse mt-4">
                            <button
                                className="text-sm text-blue-600 px-3 py-1 rounded-2xl bg-cyan-100 hover:bg-cyan-300 transition flex items-center gap-1 mx-1"
                                onClick={() => {
                                    setSelectedPatientName(appointment.patient);
                                    navigate("/DoctorDashboard/records");
                                }}
                            >
                                الملف الطبي
                            </button>

                            {appointment.status === "في الإنتظار" && (
                                <button
                                    className="text-sm text-green-800 px-3 py-1 rounded-2xl bg-green-100 hover:bg-green-300 transition flex items-center gap-1 mx-1"
                                    onClick={() => startVisit(appointment.id)}
                                >
                                    بدء الكشف
                                </button>
                            )}

                            {appointment.status === "قيد الكشف" && (
                                <button
                                    className="text-sm text-white px-3 py-1 rounded-2xl bg-red-500 hover:bg-red-600 transition flex items-center gap-1 mx-1"
                                    onClick={() => endVisit(appointment.id)}
                                >
                                    إنهاء الكشف
                                </button>
                            )}
                            {appointment.status === "في الإنتظار" && (
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