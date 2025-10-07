import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';


const ManageMedicationsModal = ({
    show,
    onClose,
    medicationsData,
    newCategory,
    onNewCategoryChange,
    newMedication,
    onNewMedicationChange,
    onAddCategory,
    onAddMedication,
    onDeleteCategory,
    onDeleteMedication,
    onUpdateCategory,
    onUpdateMedication,
    prescriptionsData
}) => {
    const [expandedCategories, setExpandedCategories] = useState({});
    const [isDeleting, setIsDeleting] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        description: ''
    });
    const [activeTab, setActiveTab] = useState('add'); 

    if (!show) return null;

    const toggleCategory = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const isMedicationInUse = (medicationId) => {
        return prescriptionsData?.some(prescription => 
            prescription.medications?.some(med => med.id === medicationId)
        );
    };

    const isCategoryInUse = (categoryId) => {
        const category = medicationsData?.find(c => c.id === categoryId);
        return category?.medications?.some(med => 
            isMedicationInUse(med.id)
        );
    };

    const handleDelete = async (id, type) => {
        if (!id) {
            console.error(`Invalid ${type} ID`);
            return;
        }

        if (type === 'category' && isCategoryInUse(id)) {
            alert('لا يمكن حذف هذا التصنيف لأنه يحتوي على أدوية مستخدمة في وصفات طبية');
            return;
        }

        if (type === 'medication' && isMedicationInUse(id)) {
            alert('لا يمكن حذف هذا الدواء لأنه مستخدم في وصفات طبية سابقة');
            return;
        }

        const confirmMessage = type === 'category' 
            ? 'هل أنت متأكد من حذف هذا التصنيف؟ سيتم حذف جميع الأدوية التابعة له.' 
            : 'هل أنت متأكد من حذف هذا الدواء؟';

        if (!window.confirm(confirmMessage)) return;

        try {
            setIsDeleting(true);
            if (type === 'category') {
                await onDeleteCategory(id);
            } else {
                await onDeleteMedication(id);
            }
        } catch (error) {
            console.error(`Error deleting ${type}:`, error);
            toast.error(`حدث خطأ أثناء الحذف: ${error.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const startEditing = (item, type) => {
        setEditingItem({ id: item.id, type });
        setEditForm({
            name: item.name,
            description: item.description || ''
        });
    };

    const cancelEditing = () => {
        setEditingItem(null);
        setEditForm({ name: '', description: '' });
    };

    const handleEditSubmit = async () => {
        if (!editForm.name.trim()) {
            alert('الرجاء إدخال اسم صحيح');
            return;
        }

        try {
            setIsDeleting(true);
            if (editingItem.type === 'category') {
                await onUpdateCategory(editingItem.id, {
                    name: editForm.name
                });
            } else {
                await onUpdateMedication(editingItem.id, {
                    name: editForm.name,
                    description: editForm.description
                });
            }
            toast.success(`تم تعديل ${editingItem.type === 'category' ? 'التصنيف' : 'الدواء'} بنجاح`);
            setEditingItem(null);
        } catch (error) {
            console.error('Error updating:', error);
            toast.error(`حدث خطأ أثناء التعديل: ${error.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500/60 p-4">
            <div className="bg-white rounded-lg shadow-xl w-120 max-w-3xl border border-cyan-200 flex flex-col h-135">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-bold text-cyan-800">
                        إدارة الأدوية والتصنيفات
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={isDeleting}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b">
                    <button
                        className={`flex-1 py-3 px-4 font-medium ${activeTab === 'add' ? 'text-white border-b-2 border-cyan-600 bg-cyan-600' : 'text-gray-500 hover:text-cyan-500'}`}
                        onClick={() => setActiveTab('add')}
                    >
                        إضافة جديد
                    </button>
                    <button
                        className={`flex-1 py-3 px-4 font-medium ${activeTab === 'manage' ? 'text-white border-b-2 border-cyan-600 bg-cyan-600' : 'text-gray-500 hover:text-cyan-500'}`}
                        onClick={() => setActiveTab('manage')}
                    >
                        إدارة الحالي
                    </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {activeTab === 'add' ? (
                        <div className="space-y-6">
                            {/* Add Category Section */}
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h4 className="font-bold text-lg text-cyan-800 mb-3">إضافة تصنيف جديد</h4>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newCategory}
                                        onChange={(e) => onNewCategoryChange(e.target.value)}
                                        placeholder="اسم التصنيف الجديد"
                                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                        disabled={isDeleting}
                                    />
                                    <button
                                        onClick={onAddCategory}
                                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
                                        disabled={isDeleting || !newCategory.trim()}
                                    >
                                        إضافة التصنيف
                                    </button>
                                </div>
                            </div>

                            {/* Add Medication Section */}
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h4 className="font-bold text-lg text-cyan-800 mb-3">إضافة دواء جديد</h4>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={newMedication.name}
                                        onChange={(e) => onNewMedicationChange({ ...newMedication, name: e.target.value })}
                                        placeholder="اسم الدواء"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                        disabled={isDeleting}
                                    />
                                    <select
                                        value={newMedication.category_id}
                                        onChange={(e) => onNewMedicationChange({ ...newMedication, category_id: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                        disabled={isDeleting}
                                    >
                                        <option value="">اختر التصنيف</option>
                                        {medicationsData?.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={onAddMedication}
                                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
                                        disabled={isDeleting || !newMedication.name || !newMedication.category_id}
                                    >
                                        إضافة الدواء
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Edit Form */}
                            {editingItem && (
                                <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
                                    <h4 className="font-bold text-lg text-cyan-800 mb-2">
                                        تعديل {editingItem.type === 'category' ? 'التصنيف' : 'الدواء'}
                                    </h4>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                            placeholder={`اسم ${editingItem.type === 'category' ? 'التصنيف' : 'الدواء'}`}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                        />
                                        {editingItem.type === 'medication' && (
                                            <textarea
                                                value={editForm.description}
                                                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                                placeholder="وصف الدواء"
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                                rows="3"
                                            />
                                        )}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleEditSubmit}
                                                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg"
                                                disabled={!editForm.name.trim() || isDeleting}
                                            >
                                                {isDeleting ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                                            </button>
                                            <button
                                                onClick={cancelEditing}
                                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                                                disabled={isDeleting}
                                            >
                                                إلغاء
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Categories and Medications List */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-cyan-800">التصنيفات والأدوية الحالية</h3>
                                
                                {medicationsData?.length > 0 ? (
                                    medicationsData.map(category => (
                                        <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                            <div className="flex justify-between items-center p-3 bg-gray-100 cursor-pointer hover:bg-gray-200">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{category.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            startEditing(category, 'category');
                                                        }}
                                                        className="text-blue-600 hover:text-blue-800 p-1"
                                                        title="تعديل التصنيف"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(category.id, 'category');
                                                        }}
                                                        className="text-red-600 hover:text-red-800 p-1"
                                                        title="حذف التصنيف"
                                                        disabled={isCategoryInUse(category.id)}
                                                    >
                                                        {isCategoryInUse(category.id) ? (
                                                            <span className="text-xs text-gray-500">مستخدم</span>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                    <button onClick={() => toggleCategory(category.id)}>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className={`h-5 w-5 text-cyan-600 transform transition-transform ${expandedCategories[category.id] ? 'rotate-180' : ''}`}
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                            {expandedCategories[category.id] && (
                                                <div className="bg-white divide-y divide-gray-100">
                                                    {category.medications?.length > 0 ? (
                                                        category.medications.map(med => (
                                                            <div key={med.id} className="flex justify-between items-center p-3 hover:bg-gray-50">
                                                                <div>
                                                                    <span className="font-medium">{med.name}</span>
                                                                    {med.description && (
                                                                        <p className="text-xs text-gray-500 mt-1">{med.description}</p>
                                                                    )}
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => startEditing(med, 'medication')}
                                                                        className="text-blue-600 hover:text-blue-800 p-1"
                                                                        title="تعديل الدواء"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                        </svg>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(med.id, 'medication')}
                                                                        className="text-red-600 hover:text-red-800 p-1"
                                                                        title="حذف الدواء"
                                                                        disabled={isMedicationInUse(med.id)}
                                                                    >
                                                                        {isMedicationInUse(med.id) ? (
                                                                            <span className="text-xs text-gray-500">مستخدم</span>
                                                                        ) : (
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                            </svg>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-gray-500 text-sm p-3">لا توجد أدوية في هذا التصنيف</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">لا توجد تصنيفات</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageMedicationsModal;