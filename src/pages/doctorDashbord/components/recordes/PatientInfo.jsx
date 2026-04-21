import AccountCircleIcon from '@mui/icons-material/AccountCircle';


export default function PatientInfo({ patient, testRequests, onOpenTestsModal }) {
    if (!patient) {
        return (
            <div className="bg-gray-100 rounded-2xl p-4 text-center text-gray-500">
                يرجى اختيار مريض لعرض سجله الطبي
            </div>
        );
    }

    // استخدام التحاليل من الـ props (التي تدعم الـ Realtime) أو من المريض كخيار احتياطي
    const currentTests = testRequests || patient?.test_requests || [];

    return (
        <div className="flex flex-col lg:flex-row gap-5">
            {/* ... (باقي كود بيانات المريض بدون تغيير) ... */}
            <div className="flex-1 min-w-0 bg-gray-100 rounded-2xl p-3 lg:w-3/5">
                <h2 className="text-md font-bold mb-2 text-gray-800 mx-3">بيانات المريض</h2>
                <div className="bg-white rounded-3xl p-5 flex md:flex-row gap-5 justify-between items-center md:items-start">
                    <table className="table-auto border-collapse w-full md:w-auto border-gray-300">
                        <tbody>
                            <tr>
                                <td>الاسم</td>
                                <td className='px-0 md:px-5'>{patient.fullName}</td>
                            </tr>
                            <tr>
                                <td>العمر</td>
                                <td className='px-0 md:px-5'>{patient.age}</td>
                            </tr>
                            <tr>
                                <td>العنوان</td>
                                <td className='px-0 md:px-5'>{patient.address}</td>
                            </tr>
                            <tr>
                                <td>التلفون</td>
                                <td className='px-0 md:px-5'>{patient.phoneNumber}</td>
                            </tr>
                            <tr>
                                <td>النوع</td>
                                <td className='px-0 md:px-5'>{patient.gender}</td>
                            </tr>
                            <tr>
                                <td>فصيله الدم</td>
                                <td className='px-0 md:px-5'>{patient.blood}</td>
                            </tr>
                        </tbody>
                    </table>
                    <span className="hidden md:inline">
                        <AccountCircleIcon style={{ fontSize: "100px", color: "#59B8D0FF" }} />
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-3 lg:w-2/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-0 md:min-h-30">
                    {/* ... (الأمراض المزمنة والأدوية بدون تغيير) ... */}
                    <div className="bg-gray-100 rounded-xl p-3">
                        <h2 className="text-sm font-bold mb-2 text-gray-800">الأمراض المزمنة</h2>
                        {patient?.chronic_diseases?.length > 0 ? (
                            <ul className="space-y-1 text-gray-700 text-xs sm:text-sm">
                                {patient.chronic_diseases.map((disease, index) => (
                                    <li key={index}>{disease}</li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-0 lg:py-3">
                                <p className="text-gray-500 text-lg">لا توجد</p>
                            </div>
                        )}
                    </div>


                    <div className="bg-gray-100 rounded-xl p-3">
                        <h2 className="text-sm font-bold mb-2 text-gray-800">الأدورية الحالية</h2>
                        {patient?.visits?.length > 0 ? (
                            <ul className="space-y-1 text-gray-700 text-xs sm:text-sm">
                                {[...patient.visits]
                                    .sort((a, b) => new Date(b.time) - new Date(a.time))[0]
                                    ?.prescriptions?.flatMap(prescription =>
                                        prescription.prescription_medications?.map((med, index) => (
                                            <li key={index}>
                                                {med.medication?.name || 'غير متوفر'} - {med.dosage}
                                            </li>
                                        )) || []
                                    )
                                    .slice(0, 5)}
                            </ul>
                        ) : (
                            <div className="text-center py-0 lg:py-3">
                                <p className="text-gray-500 text-lg">لا توجد</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* كارت التحاليل والفحوصات (Realtime) */}
                <div className="bg-gray-100 rounded-xl p-3">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-sm font-bold text-gray-800">التحاليل والفحوصات</h2>
                        <button
                            onClick={() => onOpenTestsModal()}
                            className="text-white text-sm font-medium bg-teal-600 py-1 px-2 rounded-md transition-all active:scale-95"
                        >
                            عرض جميع التحاليل
                        </button>
                    </div>
                    {currentTests.length > 0 ? (
                        <ul className="space-y-1 text-gray-700 text-xs sm:text-sm">
                            {currentTests
                                .slice(0, 3)
                                .map((req, index) => (
                                    <li key={index} className="flex justify-between items-center bg-white/50 p-2 rounded-lg mb-1 border border-gray-100">
                                        <div className="truncate max-w-[140px]">
                                            <strong className="text-gray-800">{req.tests?.name || 'تحليل غير معروف'}</strong>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                            req.status === 'قيد التنفيذ' ? 'bg-amber-100 text-amber-700' :
                                            req.status === 'مكتمل' || req.status === 'تم' ? 'bg-emerald-100 text-emerald-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {req.status || 'قيد الانتظار'}
                                        </span>
                                    </li>
                                ))}
                        </ul>
                    ) : (
                        <div className="text-center py-3">
                            <p className="text-gray-400 text-xs italic">لا توجد تحاليل مسجلة</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


