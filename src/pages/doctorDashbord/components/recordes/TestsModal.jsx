import { useState } from 'react';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle,
    DialogClose
} from './ui/dialog';
import { supabase } from '../../../../supaBase/booking';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PendingIcon from '@mui/icons-material/Pending';

export default function TestsModal({ isOpen, onClose, patient, testRequests }) {
    const [selectedTest, setSelectedTest] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        status: '',
        notes: '',
        result: ''
    });
    const [loading, setLoading] = useState(false);

    if (!patient) return null;

    const handleEditTest = (test) => {
        setSelectedTest(test);
        setEditForm({
            status: test.status || '',
            notes: test.notes || '',
            result: test.result || ''
        });
        setIsEditing(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedTest) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('test_requests')
                .update({
                    status: editForm.status,
                    result: editForm.result,

                    ...(editForm.result && { result: editForm.result })
                })
                .eq('id', selectedTest.id);

            if (error) throw error;


            window.dispatchEvent(new CustomEvent('testRequestUpdated', {
                detail: { testRequestId: selectedTest.id, patientId: patient.id }
            }));

            setIsEditing(false);
            setSelectedTest(null);
            

            setTimeout(() => {
                onClose();
            }, 500);

        } catch (error) {
            console.error('خطأ في تحديث التحليل:', error);
            alert('حدث خطأ في تحديث التحليل');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTest = async (testId) => {
        if (!confirm('هل أنت متأكد من حذف هذا التحليل؟')) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('test_requests')
                .delete()
                .eq('id', testId);

            if (error) throw error;


            window.dispatchEvent(new CustomEvent('testRequestDeleted', {
                detail: { testRequestId: testId, patientId: patient.id }
            }));


            setTimeout(() => {
                onClose();
            }, 500);

        } catch (error) {
            console.error('خطأ في حذف التحليل:', error);
            alert('حدث خطأ في حذف التحليل');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'تم':
                return <CheckCircleIcon className="text-green-600" fontSize="small" />;
            case 'قيد التنفيذ':
                return <HourglassEmptyIcon className="text-yellow-600" fontSize="small" />;
            case 'جاهز':
                return <PendingIcon className="text-blue-600" fontSize="small" />;
            default:
                return <PendingIcon className="text-gray-600" fontSize="small" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'تم':
                return 'bg-green-100 text-green-800';
            case 'قيد التنفيذ':
                return 'bg-yellow-100 text-yellow-800';
            case 'جاهز':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 border-2 border-cyan-600">
                <DialogHeader className="p-6 pb-4 border-b">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold">
                            تحاليل وفحوصات المريض - {patient.fullName}
                        </DialogTitle>
                        <DialogClose asChild>
                            <button className="p-2 hover:bg-gray-100 rounded-full"
                            onClick={onClose}>
                                <CloseIcon />
                            </button>
                        </DialogClose>
                    </div>
                </DialogHeader>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {testRequests.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">لا توجد تحاليل مطلوبة لهذا المريض</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {testRequests.map((test, index) => (
                                <div key={test.id || index} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                {getStatusIcon(test.status)}
                                                <h3 className="font-semibold text-lg">

                                                    {test.tests?.name || 'تحليل غير معروف'}
                                                </h3>
                                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(test.status)}`}>
                                                    {test.status || 'غير محدد'}
                                                </span>

                                                {test.tests?.urgent && (
                                                    <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                                                        عاجل
                                                    </span>
                                                )}
                                            </div>
                                            

                                            {test.tests?.duration && (
                                                <p className="text-gray-700 mb-2">
                                                    <strong>المدة المتوقعة:</strong> {test.tests.duration}
                                                </p>
                                            )}
                                            
                                            <p className="text-gray-600 text-sm mb-2">
                                                <strong>تاريخ الطلب:</strong> {' '}
                                                {new Date(test.created_at).toLocaleDateString('ar-EG', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>

                                            {test.result && (
                                                <div className="mb-2 p-3 bg-green-50 rounded-lg">
                                                    <p className="text-green-800">
                                                        <strong>النتيجة:</strong> {test.result}
                                                    </p>
                                                </div>
                                            )}

                        
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditTest(test)}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                                                title="تعديل"
                                                disabled={loading}
                                            >
                                                <EditIcon fontSize="small" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTest(test.id)}
                                                className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                                                title="حذف"
                                                disabled={loading}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>



                {isEditing && selectedTest && (
                    <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center z-50 ">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 border-2 border-cyan-600">
                            <h3 className="text-lg font-bold mb-4">
                                تعديل التحليل: {selectedTest.tests?.name}
                            </h3>
                            
                            <div className="space-y-4 ">
                                <div>
                                    <label className="block text-sm font-medium mb-2">حالة التحليل</label>
                                    <select
                                        value={editForm.status}
                                        onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    >
                                        <option value="">اختر الحالة</option>
                                        <option value="قيد التنفيذ">قيد التنفيذ</option>
                                        <option value="جاهز">جاهز</option>
                                        <option value="تم">تم</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">النتيجة</label>
                                    <textarea
                                        value={editForm.result}
                                        onChange={(e) => setEditForm({...editForm, result: e.target.value})}
                                        placeholder="أدخل نتيجة التحليل..."
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        rows="4"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={loading}
                                    className="flex-1 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                                </button>
                                <button
                                    onClick={() => {setIsEditing(false); setSelectedTest(null);}}
                                    disabled={loading}
                                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}