import React, { useState, useEffect } from 'react';
import { getQueuePosition } from '../Services/patientService';
import EventIcon from '@mui/icons-material/Event';
import RefreshIcon from '@mui/icons-material/Refresh';

function QueueStatus({ patientId, doctorId = null, refreshInterval = 30000 }) {
    const [queueInfo, setQueueInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [error, setError] = useState(null);
    const [initialQueuePosition, setInitialQueuePosition] = useState(null);

    const fetchQueueInfo = async () => {
        if (!patientId) return;
        try {
            setLoading(true);
            setError(null);
            const info = await getQueuePosition(patientId, doctorId);
            setQueueInfo(info);

            if (initialQueuePosition === null && info.queuePosition > 0) {
                setInitialQueuePosition(info.queuePosition);
            }

            setLastUpdate(new Date());
        } catch (err) {
            console.error('Error fetching queue info:', err);
            setError('حدث خطأ في جلب معلومات الانتظار');
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchQueueInfo();

        const interval = setInterval(fetchQueueInfo, refreshInterval);

        return () => clearInterval(interval);
    }, [patientId, doctorId, refreshInterval]);

    if (loading && !queueInfo) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600">
                    <RefreshIcon className="animate-spin" />
                    <span>جاري تحميل معلومات الانتظار...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-red-700 text-center">
                    <p>{error}</p>
                    <button
                        onClick={fetchQueueInfo}
                        className="mt-2 text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    if (!queueInfo?.nextAppointment) {
        return (
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 ">
                <div className="text-center text-cyan-700 flex items-center gap-2">
                    <EventIcon fontSize="large" className="mb-2" />
                    <p>لا توجد مواعيد حجز قادمة</p>
                </div>
            </div>
        );
    }

    const { nextAppointment, queuePosition, totalQueue } = queueInfo;
    const estimatedWaitTime = Math.max(0, queuePosition * 10);

    return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-lg p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <EventIcon className="text-teal-600" fontSize="large" />
                    <div>
                        <h3 className="font-bold text-teal-800 text-lg">الموعد القادم</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-teal-700 mt-1">
                            <span className="font-medium">
                                {new Date(nextAppointment.date).toLocaleDateString('ar-EG')}
                            </span>
                            <span className="font-medium">
                                {nextAppointment.time}
                            </span>
                            {nextAppointment.doctor?.name && (
                                <span className="font-medium">
                                    {nextAppointment.doctor.name}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Refresh Button */}
                <button
                    onClick={fetchQueueInfo}
                    disabled={loading}
                    className="p-2 text-teal-600 hover:bg-teal-100 rounded-full transition-colors"
                    title="تحديث معلومات الانتظار"
                >
                    <RefreshIcon className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Queue Status */}
            {queuePosition > 1 ? (
                <>
                    <div className="grid grid-cols-3 gap-3 mt-3">
                        <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                            <div className="text-2xl font-bold text-orange-600">
                                {queuePosition}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">مواعيد قبلك في الانتظار</div>
                        </div>
                        <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                            <div className="text-2xl font-bold text-blue-600">
                                {totalQueue}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">إجمالي المواعيد اليوم</div>
                        </div>
                        <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                            <div className="text-2xl font-bold text-teal-600">
                                {estimatedWaitTime} دقيقة
                            </div>
                            <div className="text-sm text-gray-600 font-medium">المعاد المتوقع بعد</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="flex justify-between text-sm text-teal-700 mb-1">
                            <span>تقدم الدور</span>
                            <span>
                                {initialQueuePosition ? (initialQueuePosition - queuePosition) : 0}
                                من {initialQueuePosition}
                            </span>
                        </div>
                        <div className="w-full bg-teal-200 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-teal-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                                style={{
                                    width: `${initialQueuePosition
                                        ? ((initialQueuePosition - queuePosition) / initialQueuePosition) * 100
                                        : 0}%`
                                }}
                            ></div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="mt-3 text-center">
                    <div className="bg-teal-100 text-teal-800 font-bold py-3 px-4 rounded-lg border border-teal-300">
                        موعدك هو التالي! يرجى الاستعداد والتوجه للطبيب
                    </div>
                </div>
            )}

            {/* Last Update */}
            {lastUpdate && (
                <div className="mt-3 pt-3 border-t border-teal-200 text-center text-sm text-teal-600">
                    آخر تحديث: {lastUpdate.toLocaleTimeString('ar-EG')}
                </div>
            )}
        </div>
    );
}

export default QueueStatus;