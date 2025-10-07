



import React from "react";
import MedicationIcon from '@mui/icons-material/Medication';
import ScienceIcon from '@mui/icons-material/Science';
import NotesIcon from '@mui/icons-material/Notes';
import EventIcon from '@mui/icons-material/Event';

function PatientMedicalRecord({ patient = {}, records = {} }) {
    const [activeTab, setActiveTab] = React.useState("prescriptions");

    React.useEffect(() => {
        console.log("Patient data:", patient);
        console.log("Records data:", records);
    }, [patient, records]);

    const prescriptions = records.prescriptions || [];
    const tests = records.test_requests || records.tests || [];
    const appointments = records.appointments || [];

    const allPrescriptions = prescriptions.length > 0
        ? prescriptions
        : (records.visits?.flatMap(visit => visit.prescriptions || []) || []);

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">

            {/* Header */}
            <header className="mb-6 sm:mb-8 bg-white rounded-xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cyan-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-extrabold shadow-lg">
                    {(patient.fullName?.[0] || patient.full_name?.[0] || patient.name?.[0]) || "م"}
                </div>
                <div className="text-center sm:text-start">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                        {patient.fullName || patient.full_name || patient.name || "مريض غير معروف"}
                    </h2>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 text-gray-600 text-sm sm:text-base">
                        <span className="bg-cyan-100 px-2 py-1 rounded-full font-medium">
                            الهاتف: {patient.phoneNumber || patient.phone || "غير مسجل"}
                        </span>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <nav className="bg-white rounded-xl shadow-md mb-4 sm:mb-6 overflow-hidden">
                <div className="flex flex-wrap">
                    {[
                        { key: "prescriptions", label: "الروشتات", icon: <MedicationIcon fontSize="small" className="sm:text-xl" /> },
                        { key: "tests", label: "التحاليل", icon: <ScienceIcon fontSize="small" className="sm:text-xl" /> },
                        { key: "appointments", label: "المواعيد", icon: <EventIcon fontSize="small" className="sm:text-xl" /> },
                        { key: "notes", label: "الملاحظات", icon: <NotesIcon fontSize="small" className="sm:text-xl" /> },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 py-3 sm:py-4 px-2 sm:px-6 text-center transition-all duration-300 text-sm sm:text-base font-semibold ${activeTab === tab.key
                                ? "bg-cyan-600 text-white shadow-lg"
                                : "text-gray-600 hover:bg-gray-100 hover:text-cyan-600"
                                }`}
                        >
                            <div className="flex flex-col items-center gap-1">
                                {tab.icon}
                                <span>{tab.label}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Content */}
            <section className="bg-white rounded-xl shadow-lg p-4 sm:p-6 min-h-[20rem]">

                {/* Prescriptions */}
                {activeTab === "prescriptions" && (
                    <>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <MedicationIcon fontSize="small" className="sm:text-xl" /> سجل الروشتات
                        </h3>
                        {allPrescriptions?.length ? (
                            <div className="space-y-4 sm:space-y-6">
                                {allPrescriptions.map((presc, idx) => (
                                    <div key={presc.id || idx} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm text-xs sm:text-sm">
                                        <div className="bg-cyan-600 text-white p-3 sm:p-4">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-bold text-sm sm:text-lg">روشتة #{idx + 1}</h4>
                                                <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                                                    {presc.date ? new Date(presc.date).toLocaleDateString("ar-EG") : "غير محدد"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-3 sm:p-4">
                                            {presc.prescription_medications?.length ? (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full border-collapse">
                                                        <thead>
                                                            <tr className="bg-gray-50 text-xs sm:text-sm">
                                                                <th className="border border-gray-300 p-2 sm:p-3 text-center font-semibold">#</th>
                                                                <th className="border border-gray-300 p-2 sm:p-3 text-center font-semibold">اسم الدواء</th>
                                                                <th className="border border-gray-300 p-2 sm:p-3 text-center font-semibold">الجرعة</th>
                                                                <th className="border border-gray-300 p-2 sm:p-3 text-center font-semibold">المدة</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {presc.prescription_medications.map((med, i) => (
                                                                <tr key={med.id || i} className="hover:bg-gray-50">
                                                                    <td className="border border-gray-300 p-2 sm:p-3 text-center">{i + 1}</td>
                                                                    <td className="border border-gray-300 p-2 sm:p-3 text-center font-medium">
                                                                        {med.medication?.name || med.name || "دواء غير محدد"}
                                                                    </td>
                                                                    <td className="border border-gray-300 p-2 sm:p-3 text-center">{med.dosage || "غير محدد"}</td>
                                                                    <td className="border border-gray-300 p-2 sm:p-3 text-center">{med.duration || "غير محدد"}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-center py-3">لا توجد أدوية</p>
                                            )}

                                            {presc.notes && (
                                                <div className="mt-3 p-2 sm:p-3 bg-cyan-50 border border-cyan-200 rounded-lg text-xs sm:text-sm">
                                                    <strong>ملاحظات:</strong> {presc.notes}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-lg">لا توجد روشتات <MedicationIcon fontSize="small" /></div>
                        )}
                    </>
                )}

                {/* Tests */}
                {activeTab === "tests" && (
                    <>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <ScienceIcon fontSize="small" className="sm:text-xl" /> سجل التحاليل
                        </h3>
                        {tests?.length ? (
                            <div className="grid gap-4">
                                {tests.map((test, idx) => (
                                    <div key={test.id || idx} className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gradient-to-r from-teal-50 to-cyan-50 text-xs sm:text-sm">
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-xs sm:text-sm font-medium text-gray-500">التاريخ</label>
                                                <p className="font-semibold text-gray-800">
                                                    {test.date || test.created_at ?
                                                        new Date(test.date || test.created_at).toLocaleDateString('ar-EG') :
                                                        "غير محدد"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs sm:text-sm font-medium text-gray-500">نوع التحليل</label>
                                                <p className="font-semibold text-gray-800">
                                                    {test.test?.name || test.type || "غير محدد"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs sm:text-sm font-medium text-gray-500">النتيجة</label>
                                                <p className="text-gray-700">{test.result || "في الانتظار"}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-lg">لا توجد تحاليل <ScienceIcon fontSize="small" /></div>
                        )}
                    </>
                )}

                {/* Appointments */}
                {activeTab === "appointments" && (
                    <>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <EventIcon fontSize="small" className="sm:text-xl" /> مواعيد الحجز
                        </h3>
                        {appointments?.length ? (
                            <div className="space-y-3 sm:space-y-4">
                                {appointments.map((appt, idx) => (
                                    <div key={appt.id || idx} className="border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm bg-gradient-to-r from-cyan-50 to-teal-50 text-xs sm:text-sm">
                                        <div className="grid md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="text-xs sm:text-sm font-medium text-gray-500">التاريخ</label>
                                                <p className="font-semibold text-gray-800">
                                                    {appt.date ? new Date(appt.date).toLocaleDateString('ar-EG') : "غير محدد"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs sm:text-sm font-medium text-gray-500">الوقت</label>
                                                <p className="font-semibold text-gray-800">{appt.time || "غير محدد"}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs sm:text-sm font-medium text-gray-500">الحالة</label>
                                                <p className={`font-semibold ${appt.status === 'تم' ? 'text-green-600' :
                                                    appt.status === 'ملغي' ? 'text-red-600' :
                                                        appt.status === 'في الإنتظار' ? 'text-yellow-600 ' :
                                                            'text-gray-800'}`}>
                                                    {appt.status === 'confirmed' ? 'مؤكد' :
                                                        appt.status === 'cancelled' ? 'ملغي' :
                                                            appt.status === 'pending' ? 'في الانتظار' :
                                                                appt.status || "غير محدد"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs sm:text-sm font-medium text-gray-500">ملاحظات</label>
                                                <p className="text-gray-700">{appt.reason || "لا يوجد ملاحظات"}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-lg">
                                لا توجد مواعيد حجز <EventIcon fontSize="small" />
                            </div>
                        )}
                    </>
                )}

                {/* Notes */}
                {activeTab === "notes" && (
                    <>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <NotesIcon fontSize="small" className="sm:text-xl" /> الملاحظات العامة
                        </h3>
                        {records.notes ? (
                            <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-4 sm:p-6 rounded-lg border border-cyan-200 text-xs sm:text-sm">
                                <p className="text-gray-700 leading-relaxed">{records.notes}</p>
                            </div>
                        ) : (
                            <div className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-lg">لا توجد ملاحظات <NotesIcon fontSize="small" /></div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}

export default PatientMedicalRecord;
