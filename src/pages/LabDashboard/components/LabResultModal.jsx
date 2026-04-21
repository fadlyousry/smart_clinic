import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supaBase/booking';
import useAuthStore from '../../../store/auth';
import Swal from 'sweetalert2';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import ScienceIcon from '@mui/icons-material/Science';
import LocalHospital from '@mui/icons-material/LocalHospital';

/**
 * مودال عرض وإدخال نتائج التحاليل
 * @param {Object} request - كائن الطلب (test_request)
 * @param {Function} onClose - وظيفة الإغلاق
 * @param {Function} onSuccess - وظيفة تُنفذ بعد الحفظ بنجاح
 */
const LabResultModal = ({ request, onClose, onSuccess }) => {
    const { current_user } = useAuthStore();
    const [submitting, setSubmitting] = useState(false);
    
    // دعم المجموعات (Batches)
    const isBatch = !!request?.isBatch;
    const batchRequests = isBatch ? request.requests : [request];
    const [selectedIndex, setSelectedIndex] = useState(0);
    const activeRequest = batchRequests[selectedIndex];

    const [resultData, setResultData] = useState({
        result_value: activeRequest?.result_value || '',
        lab_notes: activeRequest?.lab_notes || ''
    });

    // تحديث البيانات عند تغيير التحليل المختار في المجموعة
    useEffect(() => {
        setResultData({
            result_value: activeRequest?.result_value || '',
            lab_notes: activeRequest?.lab_notes || ''
        });
    }, [selectedIndex, activeRequest]);

    const isCompleted = activeRequest?.status === 'مكتمل' || activeRequest?.status === 'تم';

    const handleSave = async () => {
        if (!resultData.result_value.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'تنبيه',
                text: 'يرجى إدخال قيمة التحليل أولاً',
                confirmButtonColor: '#0097A7',
            });
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('test_requests')
                .update({
                    result_value: resultData.result_value,
                    lab_notes: resultData.lab_notes,
                    status: 'مكتمل',
                    completed_by: current_user?.lab_id || null,
                    completed_at: new Date().toISOString()
                })
                .eq('id', activeRequest.originalId || activeRequest.id);

            if (error) throw error;

            // تحديث الحالة محلياً للمجموعة
            activeRequest.status = 'مكتمل';
            activeRequest.result_value = resultData.result_value;
            activeRequest.lab_notes = resultData.lab_notes;

            Swal.fire({
                icon: 'success',
                title: 'تم الحفظ',
                text: 'تم تسجيل نتيجة التحليل بنجاح',
                confirmButtonColor: '#0097A7',
                timer: 1500,
                showConfirmButton: false
            });

            if (onSuccess) onSuccess();

            // لو في تحاليل تانية لسه مخلصتش في المجموعة، روح للي بعده تلقائياً
            if (isBatch) {
                const nextPendingIndex = batchRequests.findIndex((r, idx) => r.status !== 'مكتمل' && r.status !== 'تم');
                if (nextPendingIndex !== -1) {
                    setSelectedIndex(nextPendingIndex);
                } else {
                    // لو كله خلص، اقفل المودال
                    setTimeout(onClose, 1500);
                }
            } else {
                onClose();
            }

        } catch (error) {
            console.error('Error saving test result:', error);
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: 'فشل في حفظ النتيجة',
                confirmButtonColor: '#0097A7',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-[5000] p-4 font-sans">
            <div className={`bg-white/95 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] w-full ${isBatch ? 'max-w-5xl' : 'max-w-xl'} overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col md:flex-row border border-white/20`} dir="rtl">
                
                {/* القائمة الجانبية في حالة المجموعة */}
                {isBatch && (
                    <div className="w-full md:w-80 bg-gray-50/50 border-l border-gray-100 flex flex-col h-full max-h-[90vh]">
                        <div className="p-8 border-b border-gray-100">
                            <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
                                <ScienceIcon className="text-cyan-600" />
                                قائمة المهام
                            </h3>
                            <div className="mt-4">
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">
                                    <span>التقدم الإجمالي</span>
                                    <span>{Math.round((batchRequests.filter(r => r.status === 'مكتمل' || r.status === 'تم').length / batchRequests.length) * 100)}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-700 ease-out"
                                        style={{ width: `${(batchRequests.filter(r => r.status === 'مكتمل' || r.status === 'تم').length / batchRequests.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {batchRequests.map((req, idx) => {
                                const completed = req.status === 'مكتمل' || req.status === 'تم';
                                const urgent = req.tests?.urgent;
                                return (
                                    <button
                                        key={req.id}
                                        onClick={() => setSelectedIndex(idx)}
                                        className={`w-full text-right p-4 rounded-2xl transition-all duration-200 flex items-center justify-between gap-3 border ${
                                            selectedIndex === idx 
                                                ? 'bg-white border-cyan-500 shadow-lg shadow-cyan-100 scale-[1.02]' 
                                                : 'bg-transparent border-transparent text-gray-500 hover:bg-white/50'
                                        }`}
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className={`text-sm font-bold truncate ${selectedIndex === idx ? 'text-cyan-700' : 'text-gray-700'}`}>
                                                    {req.tests?.name || 'تحليل غير معروف'}
                                                </p>
                                                {urgent && (
                                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                                    completed ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                                                }`}>
                                                    {completed ? 'تم الاعتماد' : 'في الانتظار'}
                                                </span>
                                                {req.tests?.test_cat?.name && (
                                                  <span className="text-[9px] text-gray-300 font-bold">{req.tests.test_cat.name}</span>
                                                )}
                                            </div>
                                        </div>
                                        {completed ? (
                                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                                <CheckCircleIcon style={{ fontSize: 14 }} />
                                            </div>
                                        ) : (
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                selectedIndex === idx ? 'border-cyan-500 text-cyan-500' : 'border-gray-200 text-transparent'
                                            }`}>
                                                {idx + 1}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="flex-1 flex flex-col max-h-[90vh]">
                    {/* الرأس (Header) */}
                    <div className={`${isCompleted ? 'bg-emerald-600' : 'bg-cyan-700'} p-8 text-white flex justify-between items-start shrink-0 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                        <div className="relative z-10 flex items-center gap-5">
                            <div className="bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20 shadow-xl">
                                <ScienceIcon style={{ fontSize: 32 }} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">
                                    {isCompleted ? 'تقرير النتائج المعتمدة' : 'إصدار نتائج التحليل'}
                                </h2>
                                <div className="flex items-center gap-2 mt-2 opacity-80 text-xs font-bold">
                                    {isBatch && <span className="bg-white/20 px-2 py-0.5 rounded">تحليل {selectedIndex + 1} من {batchRequests.length}</span>}
                                    <span>#{activeRequest?.id}</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="bg-black/10 hover:bg-black/20 p-2.5 rounded-2xl transition-all backdrop-blur-sm relative z-10">
                            <CloseIcon />
                        </button>
                    </div>

                    {/* المحتوى (Body) */}
                    <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1 bg-gradient-to-b from-gray-50/50 to-white">
                        {/* كارت المريض */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-4 bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center shadow-inner">
                                    <PersonIcon style={{ fontSize: 28 }} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">المريض</p>
                                    <p className="font-bold text-gray-800 truncate text-lg">{request?.patients?.fullName || request?.patientName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
                                    <LocalHospital style={{ fontSize: 28 }} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">الطبيب المحول</p>
                                    <p className="font-bold text-gray-800 truncate text-lg">{activeRequest?.doctors?.name || activeRequest?.doctorName || 'طلب داخلي'}</p>
                                </div>
                            </div>
                        </div>

                        {/* إدخال النتيجة */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                              <label className="flex items-center gap-2 font-black text-gray-800 text-sm uppercase tracking-wider">
                                <AssignmentIcon style={{ fontSize: 18 }} className="text-cyan-600" />
                                النتائج المخبرية
                              </label>
                              {activeRequest?.tests?.name && (
                                <span className="text-xs font-bold text-cyan-600 px-3 py-1 bg-cyan-50 rounded-full">{activeRequest.tests.name}</span>
                              )}
                            </div>
                            
                            {isCompleted ? (
                                <div className="bg-emerald-50/50 backdrop-blur-sm border-2 border-emerald-100 rounded-[2rem] p-8 text-emerald-900 whitespace-pre-wrap leading-relaxed shadow-sm min-h-[200px] text-lg font-medium italic">
                                    {activeRequest.result_value}
                                </div>
                            ) : (
                                <div className="relative group">
                                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-[2rem] blur opacity-10 group-focus-within:opacity-30 transition duration-500"></div>
                                  <textarea
                                      className="relative w-full border-2 border-gray-100 rounded-[2rem] p-6 min-h-[220px] outline-none focus:border-cyan-500 transition-all text-gray-800 bg-white font-medium text-lg shadow-sm"
                                      placeholder="أدخل قيم التحاليل والنتائج النهائية هنا..."
                                      value={resultData.result_value}
                                      onChange={(e) => setResultData({ ...resultData, result_value: e.target.value })}
                                  ></textarea>
                                </div>
                            )}
                        </div>

                        {/* ملاحظات المعمل */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 font-black text-gray-800 text-sm uppercase tracking-wider opacity-60">
                                <AccessTimeIcon style={{ fontSize: 18 }} />
                                ملاحظات إضافية
                            </label>
                            {isCompleted ? (
                                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-gray-500 text-sm italic">
                                    {activeRequest.lab_notes || "لم يتم تسجيل ملاحظات إضافية."}
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    className="w-full border-2 border-gray-100 rounded-2xl p-5 outline-none focus:border-cyan-500 transition-all bg-white font-medium shadow-sm"
                                    placeholder="أي ملاحظات حول العينة أو الظروف المحيطة..."
                                    value={resultData.lab_notes}
                                    onChange={(e) => setResultData({ ...resultData, lab_notes: e.target.value })}
                                />
                            )}
                        </div>
                    </div>

                    {/* التذييل (Footer) */}
                    <div className="bg-white p-8 flex gap-4 justify-end border-t border-gray-50 shrink-0">
                        <button
                            onClick={onClose}
                            className="px-8 py-4 rounded-2xl font-black text-gray-400 hover:bg-gray-100 transition-all text-sm uppercase tracking-widest"
                        >
                            تراجع
                        </button>
                        {!isCompleted && (
                            <button
                                onClick={handleSave}
                                disabled={submitting}
                                className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white px-10 py-4 rounded-[1.5rem] font-black shadow-xl shadow-cyan-200/50 flex items-center gap-3 transition-all disabled:opacity-50 active:scale-95 group"
                            >
                                {submitting ? (
                                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <SaveIcon fontSize="small" className="group-hover:scale-125 transition-transform" />
                                        <span>اعتماد وحفظ</span>
                                    </>
                                )}
                            </button>
                        )}
                        {isCompleted && isBatch && (
                            <div className="flex-1 flex justify-start">
                                <button 
                                    onClick={() => {
                                        const nextIdx = (selectedIndex + 1) % batchRequests.length;
                                        setSelectedIndex(nextIdx);
                                    }}
                                    className="bg-cyan-50 text-cyan-600 font-black px-6 py-4 rounded-2xl hover:bg-cyan-100 transition-all text-sm uppercase tracking-wider flex items-center gap-2"
                                >
                                    عرض التحليل التالي <span className="text-xl">←</span>
                                </button>
                            </div>
                        )}
                        {isCompleted && !isBatch && (
                            <div className="flex items-center gap-3 px-6 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black border border-emerald-100 shadow-sm shadow-emerald-50">
                                <CheckCircleIcon style={{ fontSize: 20 }} />
                                <span className="text-sm uppercase tracking-wider">تم الاعتماد النهائي</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Imports for icons used in the simplified modal
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';


export default LabResultModal;
