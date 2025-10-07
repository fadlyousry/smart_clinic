import AccountCircleIcon from '@mui/icons-material/AccountCircle';


export default function PatientInfo({ patient, onOpenTestsModal }) {
    if (!patient) {
        return (
            <div className="bg-gray-100 rounded-2xl p-4 text-center text-gray-500">
                يرجى اختيار مريض لعرض سجله الطبي
            </div>
        );
    }


    return (
        <div className="flex flex-col lg:flex-row gap-5">
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
                        <h2 className="text-sm font-bold mb-2 text-gray-800">الأدوية الحالية</h2>
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


                <div className="bg-gray-100 rounded-xl p-3">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-sm font-bold text-gray-800">التحاليل والفحوصات</h2>
                        <button
                            onClick={() => onOpenTestsModal()}
                            className="text-white text-sm font-medium bg-teal-600 py-1 px-2 rounded-md"
                        >
                            عرض جميع التحاليل
                        </button>
                    </div>
                    {patient?.test_requests?.length > 0 ? (
                        <ul className="space-y-1 text-gray-700 text-xs sm:text-sm">
                            {patient.test_requests

                                .slice(0, 3)
                                .map((req, index) => (
                                    <li key={index} className="flex justify-between items-center">
                                        <div>
                                            <strong>{req.tests?.name || 'تحليل غير معروف'}</strong>
                                            {req.test?.description && ` - ${req.test.description}`}
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs ${req.status === 'قيد التنفيذ' ? 'bg-yellow-100 text-yellow-800' :
                                            req.status === 'جاهز' ? 'bg-blue-100 text-blue-800' :
                                                'bg-green-100 text-gray-800'
                                            }`}>
                                            {req.status || 'غير محدد'}
                                        </span>
                                    </li>
                                ))}
                        </ul>
                    ) : (
                        <div className="text-center py-3">
                            <p className="text-gray-500 text-lg">لا توجد تحاليل معلقة</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


