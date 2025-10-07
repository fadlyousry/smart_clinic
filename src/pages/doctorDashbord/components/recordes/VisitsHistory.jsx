

import VisibilityIcon from '@mui/icons-material/Visibility';

export default function VisitsHistory({ patient, onViewPrescription }) {
    if (!patient || !patient.visits?.length) {
        return null;
    }

    const handleViewClick = (visit) => {
        const lastPrescription = visit.prescriptions?.[visit.prescriptions.length - 1];


        const diagnosis = visit.medical_records?.[0]?.diagnosis ||
            lastPrescription?.notes ||
            visit.notes ||
            "لا يوجد تشخيص";

        const prescriptionData = {
            date: visit.date,
            diagnosis: diagnosis,
            notes: lastPrescription?.notes || visit.notes || "لا توجد ملاحظات",
            medications: lastPrescription?.prescription_medications?.map((med, idx) => ({
                id: idx,
                name: med.medication?.name || 'غير متوفر',
                dosage: med.dosage || "غير محدد",
                duration: med.duration || "غير محدد"
            })) || []
        };

        onViewPrescription(prescriptionData);
    };

    return (
        <div className="bg-gray-100 rounded-2xl my-3 p-3 sm:p-5 flex flex-col gap-3 sm:gap-5 mt-10 max-h-[50vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-semibold m-0">الزيارات السابقة</h3>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-auto bg-white rounded-2xl shadow-md">
                <table className="w-full text-right border-collapse">
                    <thead>
                        <tr className="bg-white text-sm text-gray-700 text-center">
                            <th className="p-3 text-gray-700 font-medium border-b border-gray-200">رقم الزيارة</th>
                            <th className="p-3 text-gray-700 font-medium border-b border-gray-200">تاريخ الزيارة</th>
                            <th className="p-3 text-gray-700 font-medium border-b border-gray-200">التشخيص</th>
                            <th className="p-3 text-gray-700 font-medium border-b border-gray-200">عدد الأدوية</th>
                            <th className="p-3 text-gray-700 font-medium border-b border-gray-200">عرض</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...patient.visits]
                            .sort((a, b) => new Date(b.time) - new Date(a.time))
                            .map((visit, index) => {
                                const lastPrescription = visit.prescriptions?.[visit.prescriptions.length - 1];
                                const diagnosis =
                                    visit.medical_records?.[0]?.diagnosis ||
                                    lastPrescription?.notes ||
                                    visit.notes ||
                                    'لا يوجد';

                                return (
                                    <tr key={visit.id} className="hover:bg-gray-50 bg-white text-center">
                                        <td className="p-3 border-b border-gray-100 text-gray-600">{index + 1}</td>
                                        <td className="p-3 border-b border-gray-100 text-gray-600">
                                            {new Date(visit.date).toLocaleDateString('ar-EG')}
                                        </td>
                                        <td className="p-3 border-b border-gray-100 text-gray-600">
                                            {diagnosis}
                                        </td>
                                        <td className="p-3 border-b border-gray-200">
                                            {lastPrescription?.prescription_medications?.length || 0}
                                        </td>
                                        <td className="p-3 border-b border-gray-100">
                                            <button
                                                className="text-cyan-500 hover:text-cyan-700 transition-colors"
                                                onClick={() => handleViewClick(visit, index)}
                                            >
                                                <VisibilityIcon fontSize="small" className="hover:scale-110 transition-transform" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}

                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3 max-h-[50vh] overflow-y-auto">
                {patient.visits.map((visit, index) => {
                    const lastPrescription = visit.prescriptions?.[visit.prescriptions.length - 1];
                    const diagnosis = visit.medical_records?.[0]?.diagnosis ||
                        lastPrescription?.notes ||
                        visit.notes ||
                        'لا يوجد';

                    return (
                        <div key={visit.id} className="bg-white rounded-2xl p-3 shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold">الزيارة #{index + 1}</p>
                                    <p className="text-sm">
                                        {new Date(visit.date).toLocaleDateString('ar-EG')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                        {lastPrescription?.prescription_medications?.length || 0} أدوية
                                    </span>
                                    <button
                                        className="bg-cyan-500 text-white p-1 rounded hover:bg-cyan-600 transition"
                                        onClick={() => handleViewClick(visit, index)}
                                    >
                                        <VisibilityIcon fontSize="small" />
                                    </button>
                                </div>
                            </div>
                            {diagnosis && (
                                <div className="mt-2 text-sm text-gray-600">
                                    <strong>التشخيص:</strong> {diagnosis}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}