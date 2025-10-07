import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaUserPlus, FaChild, FaVenus, FaMars, FaTrash, FaEdit, FaSave, FaSpinner, FaInfoCircle, FaExclamationTriangle, FaSearch, FaTimes, FaEye } from 'react-icons/fa';
import './FamilyProfile.css';

const FamilyProfile = ({ userType = 'patient' }) => {
    // States
    const [isLoading, setIsLoading] = useState(true);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [currentMember, setCurrentMember] = useState({
        fullName: '',
        address: '',
        age: '',
        phone: '',
        additionalNotes: '',
        relation: 'ابن',
        gender: 'male',
        image: null
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [activeTab, setActiveTab] = useState('list');
    const [formErrors, setFormErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [viewingMember, setViewingMember] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const fileInputRef = useRef(null);

    // Simulate API call
    useEffect(() => {
        const timer = setTimeout(() => {
            const userData = [
                {
                    fullName: 'أحمد محمد علي',
                    address: '123 شارع النخيل، القاهرة',
                    age: '35',
                    phone: '01012345678',
                    additionalNotes: 'لديه حساسية من البنسلين',
                    relation: 'زوج',
                    gender: 'male',
                    image: null
                },
                {
                    fullName: 'سارة أحمد محمد',
                    address: '123 شارع النخيل، القاهرة',
                    age: '12',
                    phone: '',
                    additionalNotes: 'تحتاج إلى متابعة نمو',
                    relation: 'ابنة',
                    gender: 'female',
                    image: null
                }
            ];

            setFamilyMembers(userData);
            setFilteredMembers(userData);
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Search functionality
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredMembers(familyMembers);
        } else {
            const results = familyMembers.filter(member =>
                member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.relation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.additionalNotes.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredMembers(results);
        }
    }, [searchTerm, familyMembers]);

    const relations = [
        { value: 'ابن', label: 'ابن', icon: <FaMars /> },
        { value: 'ابنة', label: 'ابنة', icon: <FaVenus /> },
        { value: 'زوج', label: 'زوج', icon: <FaUser /> },
        { value: 'زوجة', label: 'زوجة', icon: <FaUser /> },
        { value: 'أب', label: 'أب', icon: <FaUser /> },
        { value: 'أم', label: 'أم', icon: <FaUser /> }
    ];

    const validateForm = () => {
        const errors = {};
        if (!currentMember.fullName.trim()) errors.fullName = 'الاسم الكامل مطلوب';
        if (!currentMember.age.trim()) errors.age = 'العمر مطلوب';
        if (currentMember.age && (isNaN(currentMember.age) || currentMember.age < 0 || currentMember.age > 120)) {
            errors.age = 'العمر يجب أن يكون بين 0 و 120';
        }
        if (currentMember.phone && !/^[0-9]{10,15}$/.test(currentMember.phone)) {
            errors.phone = 'رقم الهاتف غير صحيح';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentMember(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCurrentMember(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleAddMember = () => {
        if (!validateForm()) return;

        let message = '';
        if (isEditing) {
            const updatedMembers = [...familyMembers];
            updatedMembers[editIndex] = currentMember;
            setFamilyMembers(updatedMembers);
            message = 'تم تحديث بيانات العضو بنجاح';
        } else {
            setFamilyMembers([currentMember, ...familyMembers]);
            message = 'تم إضافة العضو الجديد بنجاح';
        }

        setSuccessMessage(message);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);

        resetForm();
        setActiveTab('list');
    };

    const resetForm = () => {
        setCurrentMember({
            fullName: '',
            address: '',
            age: '',
            phone: '',
            additionalNotes: '',
            relation: 'ابن',
            gender: 'male',
            image: null
        });
        setEditIndex(null);
        setFormErrors({});
    };

    const handleEditMember = (index) => {
        setCurrentMember(familyMembers[index]);
        setIsEditing(true);
        setEditIndex(index);
        setActiveTab('add');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleViewMember = (member) => {
        setViewingMember(member);
        setShowViewModal(true);
    };

    const handleDeleteMember = (index) => {
        const isConfirmed = window.confirm('هل أنت متأكد من حذف هذا العضو؟ لا يمكن التراجع عن هذه العملية.');
        if (!isConfirmed) return;

        const memberName = familyMembers[index].fullName;
        const newMembers = familyMembers.filter((_, i) => i !== index);
        setFamilyMembers(newMembers);
        setFilteredMembers(newMembers.filter(member =>
            member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.relation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.additionalNotes.toLowerCase().includes(searchTerm.toLowerCase())
        ));

        setSuccessMessage(`تم حذف ${memberName} بنجاح`);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    if (isLoading) {
        return (
            <motion.div
                className="loading-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="loading-content">
                    <FaSpinner className="spinner" />
                    <p>جاري تحميل بيانات العائلة...</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="family-profile-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Success Notification */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        className="success-notification"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="success-content">
                            <FaInfoCircle className="success-icon" />
                            <span>{successMessage}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* View Member Modal */}
            <AnimatePresence>
                {showViewModal && viewingMember && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowViewModal(false)}
                    >
                        <motion.div
                            className="member-modal"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="close-modal" onClick={() => setShowViewModal(false)}>
                                <FaTimes />
                            </button>

                            <div className="modal-header">
                                <h2>تفاصيل العضو</h2>
                            </div>

                            <div className="modal-body">
                                {viewingMember.image && (
                                    <div className="member-image-container">
                                        <img src={viewingMember.image} alt={viewingMember.fullName} className="member-image" />
                                    </div>
                                )}

                                <div className="modal-info-grid">
                                    <div className="info-item">
                                        <span className="info-label">الاسم الكامل:</span>
                                        <span className="info-value">{viewingMember.fullName}</span>
                                    </div>

                                    <div className="info-item">
                                        <span className="info-label">صلة القرابة:</span>
                                        <span className="info-value">{viewingMember.relation}</span>
                                    </div>

                                    <div className="info-item">
                                        <span className="info-label">العمر:</span>
                                        <span className="info-value">{viewingMember.age} سنة</span>
                                    </div>

                                    {viewingMember.phone && (
                                        <div className="info-item">
                                            <span className="info-label">رقم الهاتف:</span>
                                            <span className="info-value">{viewingMember.phone}</span>
                                        </div>
                                    )}

                                    {viewingMember.address && (
                                        <div className="info-item">
                                            <span className="info-label">العنوان:</span>
                                            <span className="info-value">{viewingMember.address}</span>
                                        </div>
                                    )}

                                    {viewingMember.additionalNotes && (
                                        <div className="info-item full-width">
                                            <span className="info-label">ملاحظات:</span>
                                            <p className="info-value notes">{viewingMember.additionalNotes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button
                                    className="edit-btn"
                                    onClick={() => {
                                        handleEditMember(familyMembers.indexOf(viewingMember));
                                        setShowViewModal(false);
                                    }}
                                >
                                    <FaEdit /> تعديل البيانات
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="profile-header-section">
                <motion.h1
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {userType === 'patient' ? 'ملف العائلة الطبي' : 'إدارة ملف العائلة'}
                </motion.h1>
                <p className="header-description">إدارة المعلومات الشخصية والطبية لأفراد عائلتك</p>
            </div>

            <div className="navigation-tabs">
                <button
                    className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
                    onClick={() => setActiveTab('list')}
                >
                    <FaUser /> قائمة الأفراد ({familyMembers.length})
                </button>
                <button
                    className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('add');
                        setIsEditing(false);
                        resetForm();
                    }}
                >
                    <FaUserPlus /> {isEditing ? 'تعديل العضو' : 'إضافة فرد جديد'}
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'add' ? (
                    <motion.div
                        key="add-member"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="add-member-section"
                    >
                        <div className="form-header">
                            <h2>
                                {isEditing ? (
                                    <>
                                        <FaEdit /> تعديل بيانات العضو
                                    </>
                                ) : (
                                    <>
                                        <FaUserPlus /> إضافة عضو جديد للعائلة
                                    </>
                                )}
                            </h2>
                            <p className="form-subtitle">الرجاء ملء جميع الحقول المطلوبة</p>
                        </div>

                        <div className="form-grid-layout">
                            <div className="form-group">
                                <label>الاسم الكامل *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={currentMember.fullName}
                                    onChange={handleInputChange}
                                    placeholder="الاسم الثلاثي بالكامل"
                                    className={formErrors.fullName ? 'error' : ''}
                                />
                                {formErrors.fullName && (
                                    <div className="error-message">
                                        <FaExclamationTriangle /> {formErrors.fullName}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>العنوان</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={currentMember.address}
                                    onChange={handleInputChange}
                                    placeholder="عنوان السكن بالتفصيل"
                                />
                            </div>

                            <div className="form-group">
                                <label>العمر *</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={currentMember.age}
                                    onChange={handleInputChange}
                                    placeholder="بالسنوات"
                                    className={formErrors.age ? 'error' : ''}
                                />
                                {formErrors.age && (
                                    <div className="error-message">
                                        <FaExclamationTriangle /> {formErrors.age}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>رقم الهاتف</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={currentMember.phone}
                                    onChange={handleInputChange}
                                    placeholder="01XXXXXXXX"
                                    className={formErrors.phone ? 'error' : ''}
                                />
                                {formErrors.phone && (
                                    <div className="error-message">
                                        <FaExclamationTriangle /> {formErrors.phone}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>صورة العضو</label>
                                <div className="image-upload-container">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                    />
                                    <button
                                        className="upload-btn"
                                        onClick={triggerFileInput}
                                    >
                                        {currentMember.image ? 'تغيير الصورة' : 'اختيار صورة'}
                                    </button>
                                    {currentMember.image && (
                                        <div className="image-preview">
                                            <img
                                                src={currentMember.image}
                                                alt="Preview"
                                                className="preview-image"
                                            />
                                            <button
                                                className="remove-image"
                                                onClick={() => setCurrentMember(prev => ({ ...prev, image: null }))}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>صلة القرابة *</label>
                                <div className="relation-options-grid">
                                    {relations.map((rel) => (
                                        <motion.button
                                            key={rel.value}
                                            type="button"
                                            className={`relation-option ${currentMember.relation === rel.value ? 'active' : ''}`}
                                            onClick={() => {
                                                setCurrentMember(prev => ({
                                                    ...prev,
                                                    relation: rel.value,
                                                    gender: rel.value === 'ابنة' || rel.value === 'زوجة' || rel.value === 'أم' ? 'female' : 'male'
                                                }));
                                            }}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {rel.icon} {rel.label}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>ملاحظات إضافية</label>
                                <textarea
                                    name="additionalNotes"
                                    value={currentMember.additionalNotes}
                                    onChange={handleInputChange}
                                    placeholder="أي معلومات طبية مهمة أو ملاحظات إضافية..."
                                    rows="4"
                                />
                                <div className="hint-message">
                                    <FaInfoCircle /> هذه المعلومات تساعد الطبيب على تقديم رعاية أفضل
                                </div>
                            </div>
                        </div>

                        <div className="form-actions-container">
                            <motion.button
                                type="button"
                                className="secondary-action-button"
                                onClick={() => {
                                    setActiveTab('list');
                                    resetForm();
                                }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                رجوع للقائمة
                            </motion.button>
                            <motion.button
                                type="button"
                                className="primary-action-button"
                                onClick={handleAddMember}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FaSave /> {isEditing ? 'حفظ التعديلات' : 'حفظ العضو الجديد'}
                            </motion.button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="members-list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="members-list-section"
                    >
                        {familyMembers.length === 0 ? (
                            <div className="empty-state-container">
                                <div className="empty-state-content">
                                    <FaChild className="empty-state-icon" />
                                    <h3>لا يوجد أفراد مسجلين بعد</h3>
                                    <p>يمكنك البدء بإضافة أول فرد في العائلة</p>
                                    <motion.button
                                        className="primary-action-button"
                                        onClick={() => setActiveTab('add')}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FaUserPlus /> إضافة أول فرد
                                    </motion.button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="list-header">
                                    <h2>أفراد العائلة المسجلين</h2>
                                    <p>إجمالي {familyMembers.length} فرد</p>

                                    <div className="search-container">
                                        <FaSearch className="search-icon" />
                                        <input
                                            type="text"
                                            placeholder="ابحث عن عضو..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        {searchTerm && (
                                            <button className="clear-search" onClick={clearSearch}>
                                                <FaTimes />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {filteredMembers.length === 0 ? (
                                    <div className="no-results">
                                        <FaExclamationTriangle className="warning-icon" />
                                        <p>لا توجد نتائج مطابقة للبحث</p>
                                        <button className="clear-search-button" onClick={clearSearch}>
                                            مسح البحث
                                        </button>
                                    </div>
                                ) : (
                                    <div className="members-grid-layout">
                                        <AnimatePresence>
                                            {filteredMembers.map((member, index) => (
                                                <motion.div
                                                    key={index}
                                                    className="member-card"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    transition={{ duration: 0.3 }}
                                                    layout
                                                >
                                                    <div className="card-header">
                                                        <div className={`member-gender-icon ${member.gender}`}>
                                                            {member.gender === 'female' ? <FaVenus /> : <FaMars />}
                                                        </div>
                                                        <div className="member-main-info">
                                                            <h3>{member.fullName}</h3>
                                                            <div className="member-relation-badge">
                                                                {member.relation}
                                                            </div>
                                                        </div>
                                                        <button
                                                            className="view-member-btn"
                                                            onClick={() => handleViewMember(member)}
                                                        >
                                                            <FaEye />
                                                        </button>
                                                    </div>

                                                    {member.image && (
                                                        <div className="member-card-image">
                                                            <img
                                                                src={member.image}
                                                                alt={member.fullName}
                                                                className="card-image"
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="card-body">
                                                        <div className="info-row">
                                                            <span>العمر:</span>
                                                            <strong>{member.age} سنة</strong>
                                                        </div>

                                                        {member.phone && (
                                                            <div className="info-row">
                                                                <span>الهاتف:</span>
                                                                <strong>{member.phone}</strong>
                                                            </div>
                                                        )}

                                                        {member.address && (
                                                            <div className="info-row">
                                                                <span>العنوان:</span>
                                                                <strong className="truncate-text">{member.address}</strong>
                                                            </div>
                                                        )}

                                                        {member.additionalNotes && (
                                                            <div className="info-row notes-row">
                                                                <span>ملاحظات:</span>
                                                                <div className="notes-content">
                                                                    {member.additionalNotes}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="card-actions">
                                                        <motion.button
                                                            className="edit-action-button"
                                                            onClick={() => handleEditMember(familyMembers.indexOf(member))}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <FaEdit /> تعديل
                                                        </motion.button>
                                                        <motion.button
                                                            className="delete-action-button"
                                                            onClick={() => handleDeleteMember(familyMembers.indexOf(member))}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <FaTrash /> حذف
                                                        </motion.button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default FamilyProfile;