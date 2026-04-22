import { useState, useEffect } from 'react';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle,
    DialogClose
} from './ui/dialog';
import { supabase } from '../../../../supaBase/booking';
import useAuthStore from '../../../../store/auth';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PendingIcon from '@mui/icons-material/Pending';
import ScienceIcon from '@mui/icons-material/Science';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';

export default function TestsModal({ isOpen, onClose, patient, testRequests }) {
    const { CUdoctorId } = useAuthStore();

    // --- حالة عرض/تعديل التحاليل الحالية ---
    const [selectedTest, setSelectedTest] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ status: '', notes: '', result: '' });
    const [loading, setLoading] = useState(false);

    // --- حالة إضافة تحليل جديد ---
    const [showAddPanel, setShowAddPanel] = useState(false);
    const [availableTests, setAvailableTests] = useState([]);
    const [testCategories, setTestCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('الكل');
    const [testSearch, setTestSearch] = useState('');
    const [selectedNewTests, setSelectedNewTests] = useState([]);
    const [addingLoading, setAddingLoading] = useState(false);
    const [addSuccess, setAddSuccess] = useState(false);

    // جلب التحاليل المتاحة عند فتح لوحة الإضافة
    useEffect(() => {
        if (showAddPanel) {
            fetchAvailableTests();
        }
    }, [showAddPanel]);

    const fetchAvailableTests = async () => {
        const { data: tests } = await supabase
            .from('tests')
            .select('*, test_cat(name, color)')
            .order('name');
        
        const { data: cats } = await supabase
            .from('test_cat')
            .select('*')
            .order('name');

        if (tests) setAvailableTests(tests);
        if (cats) setTestCategories([{ name: 'الكل', color: '#6b7280' }, ...cats]);
    };

    const filteredAvailableTests = availableTests.filter(t =>
        (activeCategory === 'الكل' || t.test_cat?.name === activeCategory) &&
        t.name.toLowerCase().includes(testSearch.toLowerCase())
    );

    const toggleTestSelection = (testId) => {
        setSelectedNewTests(prev =>
            prev.includes(testId) ? prev.filter(id => id !== testId) : [...prev, testId]
        );
    };

    const handleAddNewTests = async () => {
        if (selectedNewTests.length === 0) {
            alert('يرجى اختيار تحليل واحد على الأقل');
            return;
        }
        setAddingLoading(true);
        try {
            const doctorId = CUdoctorId ? CUdoctorId() : null;
            const inserts = selectedNewTests.map(test_id => ({
                patient_id: patient.id,
                test_id,
                status: 'قيد التنفيذ',
                doctor_id: doctorId
            }));

            const { error } = await supabase.from('test_requests').insert(inserts);
            if (error) throw error;

            setAddSuccess(true);
            setSelectedNewTests([]);
            setTestSearch('');
            setTimeout(() => {
                setAddSuccess(false);
                setShowAddPanel(false);
            }, 1800);

            // إطلاق حدث للتحديث الفوري في Records.jsx
            window.dispatchEvent(new CustomEvent('testRequestUpdated', {
                detail: { patientId: patient.id }
            }));
        } catch (err) {
            console.error('خطأ في إضافة التحاليل:', err);
            alert('حدث خطأ أثناء إضافة التحاليل');
        } finally {
            setAddingLoading(false);
        }
    };

    // --- دوال تعديل/حذف التحاليل الحالية ---
    const handleEditTest = (test) => {
        setSelectedTest(test);
        setEditForm({ status: test.status || '', notes: test.notes || '', result: test.result || '' });
        setIsEditing(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedTest) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from('test_requests')
                .update({ status: editForm.status, result: editForm.result })
                .eq('id', selectedTest.id);
            if (error) throw error;
            setIsEditing(false);
            setSelectedTest(null);
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
            const { error } = await supabase.from('test_requests').delete().eq('id', testId);
            if (error) throw error;
        } catch (error) {
            console.error('خطأ في حذف التحليل:', error);
            alert('حدث خطأ في حذف التحليل');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'تم': case 'مكتمل':
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
            case 'تم': case 'مكتمل': return 'bg-green-100 text-green-800';
            case 'قيد التنفيذ': return 'bg-yellow-100 text-yellow-800';
            case 'جاهز': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (!patient) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 border-2 border-cyan-600">
                <DialogHeader className="p-5 pb-4 border-b bg-gradient-to-l from-cyan-50 to-white rounded-t-xl">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold text-cyan-800 flex items-center gap-2">
                            <ScienceIcon className="text-cyan-600" />
                            تحاليل وفحوصات — {patient.fullName}
                        </DialogTitle>
                        <div className="flex items-center gap-2">
                            {/* زر إضافة تحليل */}
                            <button
                                onClick={() => { setShowAddPanel(p => !p); setSelectedNewTests([]); setTestSearch(''); }}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                    showAddPanel
                                        ? 'bg-cyan-600 text-white'
                                        : 'bg-cyan-50 text-cyan-700 border border-cyan-300 hover:bg-cyan-100'
                                }`}
                            >
                                <AddIcon fontSize="small" />
                                {showAddPanel ? 'إخفاء' : 'إضافة تحليل'}
                            </button>
                            <DialogClose asChild>
                                <button className="p-1.5 hover:bg-gray-100 rounded-full" onClick={onClose}>
                                    <CloseIcon fontSize="small" />
                                </button>
                            </DialogClose>
                        </div>
                    </div>
                </DialogHeader>

                <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
                    {/* ===== لوحة إضافة تحليل جديد ===== */}
                    {showAddPanel && (
                        <div className="p-5 border-b bg-cyan-50/40">
                            <h3 className="font-bold text-cyan-800 mb-3 flex items-center gap-2">
                                <AddIcon fontSize="small" className="text-cyan-600" />
                                اختر التحاليل المطلوبة للمريض
                            </h3>

                            {/* بحث */}
                            <div className="relative mb-3">
                                <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
                                <input
                                    type="text"
                                    placeholder="ابحث عن تحليل..."
                                    value={testSearch}
                                    onChange={e => setTestSearch(e.target.value)}
                                    className="w-full pr-9 pl-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    dir="rtl"
                                />
                            </div>

                            {/* فلتر التصنيفات */}
                            {testCategories.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {testCategories.map((cat, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveCategory(cat.name)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                                                activeCategory === cat.name
                                                    ? 'text-white border-transparent'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                            }`}
                                            style={activeCategory === cat.name ? { backgroundColor: cat.color || '#0891b2', borderColor: cat.color } : {}}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* قائمة التحاليل */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                                {filteredAvailableTests.length === 0 ? (
                                    <p className="text-gray-400 text-sm col-span-2 text-center py-4">لا توجد تحاليل مطابقة</p>
                                ) : (
                                    filteredAvailableTests.map(test => {
                                        const isSelected = selectedNewTests.includes(test.id);
                                        return (
                                            <button
                                                key={test.id}
                                                onClick={() => toggleTestSelection(test.id)}
                                                className={`flex items-center justify-between p-3 rounded-xl border-2 text-right transition-all ${
                                                    isSelected
                                                        ? 'border-cyan-500 bg-cyan-50'
                                                        : 'border-gray-200 bg-white hover:border-cyan-300 hover:bg-cyan-50/30'
                                                }`}
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm text-gray-800">{test.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        {test.test_cat?.name && (
                                                            <span className="text-xs px-2 py-0.5 rounded-full" style={{
                                                                backgroundColor: (test.test_cat?.color || '#6b7280') + '20',
                                                                color: test.test_cat?.color || '#6b7280'
                                                            }}>
                                                                {test.test_cat.name}
                                                            </span>
                                                        )}
                                                        {test.duration && (
                                                            <span className="text-xs text-gray-400">{test.duration}</span>
                                                        )}
                                                        {test.urgent && (
                                                            <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">عاجل</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-2 flex-shrink-0 transition-all ${
                                                    isSelected ? 'border-cyan-500 bg-cyan-500' : 'border-gray-300'
                                                }`}>
                                                    {isSelected && <CheckIcon style={{ fontSize: '14px', color: 'white' }} />}
                                                </div>
                                            </button>
                                        );
                                    })
                                )}
                            </div>

                            {/* زر الحفظ */}
                            <div className="flex items-center gap-3 mt-4">
                                <button
                                    onClick={handleAddNewTests}
                                    disabled={addingLoading || selectedNewTests.length === 0}
                                    className="flex items-center gap-2 bg-cyan-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                                >
                                    {addingLoading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            جاري الإضافة...
                                        </span>
                                    ) : addSuccess ? (
                                        <span className="flex items-center gap-2">
                                            <CheckCircleIcon fontSize="small" /> تمت الإضافة!
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <AddIcon fontSize="small" />
                                            إضافة {selectedNewTests.length > 0 ? `(${selectedNewTests.length})` : ''} تحليل
                                        </span>
                                    )}
                                </button>
                                <span className="text-xs text-gray-400">
                                    {selectedNewTests.length > 0 ? `${selectedNewTests.length} تحليل محدد` : 'اختر تحليلاً أو أكثر'}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* ===== قائمة التحاليل الحالية للمريض ===== */}
                    <div className="p-5">
                        {testRequests.length === 0 ? (
                            <div className="text-center py-12">
                                <ScienceIcon className="text-gray-300 mb-3" style={{ fontSize: 48 }} />
                                <p className="text-gray-500 text-lg">لا توجد تحاليل مطلوبة لهذا المريض</p>
                                <p className="text-gray-400 text-sm mt-1">اضغط "إضافة تحليل" لطلب تحليل جديد</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {testRequests.map((test, index) => (
                                    <div key={test.id || index} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    {getStatusIcon(test.status)}
                                                    <h3 className="font-semibold text-lg">{test.tests?.name || 'تحليل غير معروف'}</h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(test.status)}`}>
                                                        {test.status || 'غير محدد'}
                                                    </span>
                                                    {test.tests?.urgent && (
                                                        <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">عاجل</span>
                                                    )}
                                                </div>

                                                {test.tests?.duration && (
                                                    <p className="text-gray-700 text-sm mb-2">
                                                        <strong>المدة المتوقعة:</strong> {test.tests.duration}
                                                    </p>
                                                )}

                                                <p className="text-gray-600 text-sm mb-2">
                                                    <strong>تاريخ الطلب:</strong>{' '}
                                                    {new Date(test.created_at).toLocaleDateString('ar-EG', {
                                                        year: 'numeric', month: 'long', day: 'numeric',
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </p>

                                                {test.result && (
                                                    <div className="mb-2 p-3 bg-blue-50 rounded-lg">
                                                        <p className="text-blue-800 text-sm">
                                                            <strong>ملاحظة الطبيب:</strong> {test.result}
                                                        </p>
                                                    </div>
                                                )}

                                                {test.result_value && (
                                                    <div className="mb-2 p-4 bg-green-50 border-r-4 border-green-500 rounded-lg shadow-sm">
                                                        <p className="text-green-900 font-bold mb-1 flex items-center gap-2 text-sm">
                                                            <ScienceIcon fontSize="small" /> نتيجة المعمل:
                                                        </p>
                                                        <p className="text-green-800 whitespace-pre-wrap text-sm">{test.result_value}</p>
                                                        {test.lab_notes && (
                                                            <p className="text-gray-500 text-xs mt-2 italic border-t pt-1">
                                                                ملاحظات المعمل: {test.lab_notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-1 flex-shrink-0">
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
                </div>

                {/* ===== مودال تعديل تحليل ===== */}
                {isEditing && selectedTest && (
                    <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 border-2 border-cyan-600">
                            <h3 className="text-lg font-bold mb-4">تعديل التحليل: {selectedTest.tests?.name}</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">حالة التحليل</label>
                                    <select
                                        value={editForm.status}
                                        onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    >
                                        <option value="">اختر الحالة</option>
                                        <option value="قيد التنفيذ">قيد التنفيذ</option>
                                        <option value="جاهز">جاهز</option>
                                        <option value="تم">تم</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">ملاحظة الطبيب</label>
                                    <textarea
                                        value={editForm.result}
                                        onChange={e => setEditForm({ ...editForm, result: e.target.value })}
                                        placeholder="أدخل ملاحظة على التحليل..."
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        rows="4"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={loading}
                                    className="flex-1 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 disabled:opacity-50"
                                >
                                    {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                                </button>
                                <button
                                    onClick={() => { setIsEditing(false); setSelectedTest(null); }}
                                    disabled={loading}
                                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
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