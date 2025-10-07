
import React, { useEffect, useState } from 'react';
import PatientMedicalRecord from './PatientMedicalRecord';
import QueueStatus from './QueueStatus';
import { fetchPatientMedicalRecordByPhone } from '../Services/patientService';
import useAuthStore from '../../store/auth';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';


function PatientRecordContainer() {
    const [patientData, setPatientData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { CUphone } = useAuthStore();


    const goBack = () => {
        window.history.back();

    };
    const loadPatientDataByPhone = async (phone) => {
        try {
            setLoading(true);
            setError(null);

            console.log('Loading patient data for phone:', phone);

            const data = await fetchPatientMedicalRecordByPhone(phone);

            const formattedData = {
                ...data,
                allPrescriptions: data.visits?.flatMap(visit =>
                    (visit.prescriptions || []).map(prescription => ({
                        ...prescription,
                        visitDate: visit.date,
                        visitId: visit.id
                    }))
                ) || []
            };

            console.log('Formatted patient data:', formattedData);
            setPatientData(formattedData);

        } catch (err) {
            console.error('Error loading patient data:', err);
            if (err.message.includes('Patient not found')) {
                setError(`لم يتم العثور على مريض برقم الهاتف: ${phone}`);
            } else {
                setError(err.message || 'خطأ في تحميل بيانات المريض');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const userPhone = CUphone();
        console.log('User phone from store:', userPhone);

        if (userPhone) {
            loadPatientDataByPhone(userPhone);
        } else {
            setError('لا يوجد رقم هاتف مسجل في بياناتك');
        }
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">جاري تحميل بياناتك الطبية...</p>
                    <p className="text-gray-500 text-sm mt-2">يتم البحث برقم الهاتف: {CUphone()}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md text-center shadow-lg">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h3 className="text-red-800 font-bold text-xl mb-3">خطأ في تحميل البيانات</h3>
                    <p className="text-red-600 mb-6 leading-relaxed">{error}</p>
                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                const userPhone = CUphone();
                                if (userPhone) {
                                    loadPatientDataByPhone(userPhone);
                                }
                            }}
                            className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-medium"
                        >
                            إعادة المحاولة
                        </button>
                        <p className="text-sm text-gray-500">
                            رقم الهاتف المستخدم: {CUphone() || 'غير محدد'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4">
            {/* Header Info */}
            <div className="max-w-6xl mx-auto px-4 mb-6">
                <div className="bg-cyan-600  text-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2"> سجلك الطبي</h1>
                        </div>
                        <div
                            className="flex items-center justify-end space-x-2 space-x-reverse cursor-pointer text-cyan-100"
                            onClick={goBack}
                            role="button"
                            tabIndex={0}
                        >
                            <ArrowBackIosNewIcon fontSize="small" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Queue Status Section */}
            {patientData?.queueInfo && (
                <div className="max-w-6xl mx-auto px-4 mb-6">
                    <QueueStatus
                        patientId={patientData.id}
                        doctorId={patientData.queueInfo.nextAppointment?.doctor_id || null}
                    />
                </div>
            )}

            {/* Patient Data Display */}
            {patientData ? (
                <PatientMedicalRecord
                    patient={patientData}
                    records={{
                        visits: patientData.visits || [],
                        prescriptions: patientData.allPrescriptions || [],
                        tests: patientData.test_requests?.map(tr => ({
                            id: tr.id,
                            date: tr.created_at?.split('T')[0] || '',
                            type: tr.test?.name || 'تحليل غير محدد',
                            result: tr.result || 'في الانتظار',
                            status: tr.status || 'pending'
                        })) || [],
                        appointments: patientData.appointments || [],
                        notes: patientData.notes || patientData.medical_notes || '',
                    }}
                    queueInfo={patientData?.queueInfo}
                />
            ) : (
                <div className="max-w-6xl mx-auto px-4">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">👤</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            لا توجد بيانات طبية
                        </h3>
                        <p className="text-gray-500 mb-4">
                            لم يتم العثور على سجل طبي مرتبط برقم هاتفك
                        </p>
                        <p className="text-sm text-gray-400">
                            رقم الهاتف: {CUphone()}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PatientRecordContainer;