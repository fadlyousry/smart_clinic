import { useState, useEffect } from 'react';
import { supabase } from '../../../supaBase/booking';
import useAuthStore from '../../../store/auth';
import useDoctorDashboardStore from '../../../store/doctorDashboardStore';
import Swal from 'sweetalert2';
import './DoctorManagement.css';

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import VerifiedIcon from '@mui/icons-material/Verified';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const initialFormData = {
  name: '',
  username: '',
  password: '',
  phone: '',
  specialization: '',
  fees: '',
};

const DoctorManagement = () => {
  const { CUisAdmin, CUdoctorId } = useAuthStore();
  const { fetchData } = useDoctorDashboardStore();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // التحقق من صلاحية الأدمن
  if (!CUisAdmin()) {
    return (
      <div className="dm-empty" style={{ marginTop: '4rem' }}>
        <div className="dm-empty-icon">🔒</div>
        <h3>غير مصرح لك</h3>
        <p>هذه الصفحة متاحة فقط لمدير المركز</p>
      </div>
    );
  }

  // جلب الدكاتره
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'فشل في جلب بيانات الأطباء',
        confirmButtonColor: '#0097A7',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // الإحصائيات
  const stats = {
    total: doctors.length,
    active: doctors.filter(d => d.is_active !== false).length,
    inactive: doctors.filter(d => d.is_active === false).length,
  };

  // فلترة البحث
  const filteredDoctors = doctors.filter(d =>
    d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.phone?.includes(searchQuery)
  );

  // فتح modal للإضافة
  const handleOpenAdd = () => {
    setEditingDoctor(null);
    setFormData(initialFormData);
    setFormErrors({});
    setShowModal(true);
  };

  // فتح modal للتعديل
  const handleOpenEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name || '',
      username: '',
      password: '',
      phone: doctor.phone || '',
      specialization: doctor.specialization || '',
      fees: doctor.fees || '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  // إغلاق الـ modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDoctor(null);
    setFormData(initialFormData);
    setFormErrors({});
  };

  // تحديث بيانات الفورم
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // التحقق من البيانات
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'اسم الطبيب مطلوب';
    if (!editingDoctor) {
      if (!formData.username.trim()) errors.username = 'اسم المستخدم (للدخول) مطلوب';
      else if (formData.username.includes(' ')) errors.username = 'اسم المستخدم يجب ألا يحتوي على مسافات';
      else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) errors.username = 'اسم المستخدم يجب أن يكون بالانجليزية ويحتوي على حروف وأرقام فقط (بدون مسافات أو رموز)';
      
      if (!formData.password) errors.password = 'كلمة المرور مطلوبة';
      else if (formData.password.length < 6) errors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }
    if (!formData.phone.trim()) errors.phone = 'رقم الهاتف مطلوب';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // إضافة دكتور جديد
  const handleAddDoctor = async () => {
    try {
      // حفظ session الأدمن الحالي
      const { data: { session: adminSession } } = await supabase.auth.getSession();
      if (!adminSession) throw new Error('جلسة الأدمن غير موجودة');

      // 1. إنشاء حساب Auth في Supabase
      // بنعمل إيميل وهمي للـ Supabase باستخدام الـ username
      const dummyEmail = `${formData.username.trim().toLowerCase()}@smartclinic.com`;
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: dummyEmail,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            phone: formData.phone,
            role: 'doctor',
          },
        },
      });

      if (authError) throw authError;

      // 2. إعادة تسجيل دخول الأدمن فوراً
      await supabase.auth.setSession({
        access_token: adminSession.access_token,
        refresh_token: adminSession.refresh_token,
      });

      // 3. إضافة سجل في جدول doctors
      const { error: doctorError } = await supabase
        .from('doctors')
        .insert({
          name: formData.name,
          phone: formData.phone,
          specialization: formData.specialization,
          fees: formData.fees ? parseFloat(formData.fees) : null,
          user_id: authData.user.id,
          is_admin: false,
          is_active: true,
        });

      if (doctorError) throw doctorError;

      Swal.fire({
        icon: 'success',
        title: 'تمت الإضافة',
        text: `تم إضافة د. ${formData.name} بنجاح`,
        confirmButtonColor: '#0097A7',
      });

      handleCloseModal();
      fetchDoctors();
      fetchData(); // تحديث بيانات الداشبورد
    } catch (error) {
      console.error('Error adding doctor:', error);
      let errorMsg = 'حدث خطأ أثناء إضافة الطبيب';
      if (error.message?.includes('already registered')) {
        errorMsg = 'اسم المستخدم هذا (Username) موجود بالفعل، جرب اسم آخر';
      }
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: errorMsg,
        confirmButtonColor: '#0097A7',
      });
    }
  };

  // تعديل بيانات دكتور
  const handleUpdateDoctor = async () => {
    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        specialization: formData.specialization,
        fees: formData.fees ? parseFloat(formData.fees) : null,
      };

      const { error } = await supabase
        .from('doctors')
        .update(updateData)
        .eq('id', editingDoctor.id);

      if (error) throw error;

      Swal.fire({
        icon: 'success',
        title: 'تم التحديث',
        text: `تم تحديث بيانات د. ${formData.name} بنجاح`,
        confirmButtonColor: '#0097A7',
      });

      handleCloseModal();
      fetchDoctors();
      fetchData();
    } catch (error) {
      console.error('Error updating doctor:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'فشل في تحديث بيانات الطبيب',
        confirmButtonColor: '#0097A7',
      });
    }
  };

  // تقديم الفورم
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      if (editingDoctor) {
        await handleUpdateDoctor();
      } else {
        await handleAddDoctor();
      }
    } finally {
      setSubmitting(false);
    }
  };

  // تفعيل/تعطيل دكتور
  const handleToggleActive = async (doctor) => {
    const newStatus = !doctor.is_active;
    const action = newStatus ? 'تفعيل' : 'تعطيل';

    const result = await Swal.fire({
      title: `${action} حساب الطبيب`,
      text: `هل تريد ${action} حساب د. ${doctor.name}؟`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: newStatus ? '#10b981' : '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `نعم، ${action}`,
      cancelButtonText: 'إلغاء',
    });

    if (!result.isConfirmed) return;

    try {
      const { error } = await supabase
        .from('doctors')
        .update({ is_active: newStatus })
        .eq('id', doctor.id);

      if (error) throw error;

      Swal.fire({
        icon: 'success',
        title: `تم ${action} الحساب`,
        text: `تم ${action} حساب د. ${doctor.name}`,
        confirmButtonColor: '#0097A7',
      });

      fetchDoctors();
    } catch (error) {
      console.error('Error toggling doctor status:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: `فشل في ${action} حساب الطبيب`,
        confirmButtonColor: '#0097A7',
      });
    }
  };

  // استخراج الحرف الأول من الاسم
  const getInitial = (name) => {
    if (!name) return '?';
    const parts = name.replace(/^د[\.\s\/]*/, '').trim().split(' ');
    return parts[0]?.[0] || '?';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="doctor-management">
      {/* Header */}
      <div className="dm-header">
        <h1>إدارة الأطباء</h1>
        <button className="dm-add-btn" onClick={handleOpenAdd}>
          <PersonAddIcon style={{ fontSize: 20 }} />
          إضافة طبيب جديد
        </button>
      </div>

      {/* Stats */}
      <div className="dm-stats">
        <div className="dm-stat-card">
          <div className="dm-stat-icon total">
            <GroupIcon />
          </div>
          <div className="dm-stat-info">
            <h3>{stats.total}</h3>
            <p>إجمالي الأطباء</p>
          </div>
        </div>
        <div className="dm-stat-card">
          <div className="dm-stat-icon active">
            <VerifiedIcon />
          </div>
          <div className="dm-stat-info">
            <h3>{stats.active}</h3>
            <p>أطباء نشطين</p>
          </div>
        </div>
        <div className="dm-stat-card">
          <div className="dm-stat-icon inactive">
            <PersonOffIcon />
          </div>
          <div className="dm-stat-info">
            <h3>{stats.inactive}</h3>
            <p>أطباء معطلين</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="dm-table-container">
        <div className="dm-table-header">
          <h2>قائمة الأطباء</h2>
          <div style={{ position: 'relative' }}>
            <SearchIcon style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#94a3b8' }} />
            <input
              className="dm-search-input"
              placeholder="بحث بالاسم أو التخصص أو الهاتف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingRight: '2.2rem' }}
            />
          </div>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="dm-empty">
            <div className="dm-empty-icon">👨‍⚕️</div>
            <h3>لا يوجد أطباء</h3>
            <p>{searchQuery ? 'لم يتم العثور على نتائج' : 'قم بإضافة أول طبيب للمركز'}</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="dm-table-wrapper">
              <table className="dm-table">
                <thead>
                  <tr>
                    <th>الطبيب</th>
                    <th>التخصص</th>
                    <th>الهاتف</th>
                    <th>رسوم الكشف</th>
                    <th>الحالة</th>
                    <th>الدور</th>
                    <th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map(doctor => (
                    <tr key={doctor.id}>
                      <td>
                        <div className="dm-doctor-cell">
                          <div className="dm-doctor-avatar">{getInitial(doctor.name)}</div>
                          <div>
                            <div className="dm-doctor-name">{doctor.name}</div>
                            {doctor.user_id && <div className="dm-doctor-email">حساب مربوط</div>}
                          </div>
                        </div>
                      </td>
                      <td>{doctor.specialization || 'غير محدد'}</td>
                      <td>{doctor.phone || '-'}</td>
                      <td>{doctor.fees ? `${doctor.fees} ج.م` : '-'}</td>
                      <td>
                        <span className={`dm-status-badge ${doctor.is_active !== false ? 'active' : 'inactive'}`}>
                          <span className="dm-status-dot"></span>
                          {doctor.is_active !== false ? 'نشط' : 'معطل'}
                        </span>
                      </td>
                      <td>
                        {doctor.is_admin ? (
                          <span className="dm-admin-badge">
                            <AdminPanelSettingsIcon style={{ fontSize: 14 }} />
                            مدير
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>طبيب</span>
                        )}
                      </td>
                      <td>
                        <div className="dm-actions">
                          <button
                            className="dm-action-btn edit"
                            title="تعديل"
                            onClick={() => handleOpenEdit(doctor)}
                          >
                            <EditIcon style={{ fontSize: 18 }} />
                          </button>
                          {!doctor.is_admin && (
                            <button
                              className={`dm-action-btn toggle ${doctor.is_active !== false ? 'deactivate' : ''}`}
                              title={doctor.is_active !== false ? 'تعطيل' : 'تفعيل'}
                              onClick={() => handleToggleActive(doctor)}
                            >
                              {doctor.is_active !== false ? (
                                <BlockIcon style={{ fontSize: 18 }} />
                              ) : (
                                <CheckCircleIcon style={{ fontSize: 18 }} />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="dm-mobile-cards">
              {filteredDoctors.map(doctor => (
                <div className="dm-mobile-card" key={doctor.id}>
                  <div className="dm-mobile-card-header">
                    <div className="dm-doctor-cell">
                      <div className="dm-doctor-avatar">{getInitial(doctor.name)}</div>
                      <div>
                        <div className="dm-doctor-name">{doctor.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {doctor.specialization || 'غير محدد'}
                        </div>
                      </div>
                    </div>
                    <span className={`dm-status-badge ${doctor.is_active !== false ? 'active' : 'inactive'}`}>
                      <span className="dm-status-dot"></span>
                      {doctor.is_active !== false ? 'نشط' : 'معطل'}
                    </span>
                  </div>
                  <div className="dm-mobile-card-info">
                    {doctor.phone && (
                      <span><PhoneIcon style={{ fontSize: 14 }} /> {doctor.phone}</span>
                    )}
                    {doctor.fees && (
                      <span><LocalHospitalIcon style={{ fontSize: 14 }} /> {doctor.fees} ج.م</span>
                    )}
                    {doctor.is_admin && (
                      <span className="dm-admin-badge" style={{ width: 'fit-content', marginTop: '0.25rem' }}>
                        <AdminPanelSettingsIcon style={{ fontSize: 14 }} />
                        مدير
                      </span>
                    )}
                  </div>
                  <div className="dm-mobile-card-actions">
                    <button className="dm-action-btn edit" onClick={() => handleOpenEdit(doctor)}>
                      <EditIcon style={{ fontSize: 18 }} />
                    </button>
                    {!doctor.is_admin && (
                      <button
                        className={`dm-action-btn toggle ${doctor.is_active !== false ? 'deactivate' : ''}`}
                        onClick={() => handleToggleActive(doctor)}
                      >
                        {doctor.is_active !== false ? (
                          <BlockIcon style={{ fontSize: 18 }} />
                        ) : (
                          <CheckCircleIcon style={{ fontSize: 18 }} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="dm-modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCloseModal()}>
          <div className="dm-modal">
            <div className="dm-modal-header">
              <h2>{editingDoctor ? `تعديل بيانات د. ${editingDoctor.name}` : 'إضافة طبيب جديد'}</h2>
              <button className="dm-modal-close" onClick={handleCloseModal}>
                <CloseIcon style={{ fontSize: 18 }} />
              </button>
            </div>

            <div className="dm-modal-body">
              <div className="dm-form-grid">
                {/* الاسم */}
                <div className="dm-form-group">
                  <label><BadgeIcon style={{ fontSize: 14, marginLeft: 4 }} /> اسم الطبيب *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="مثال: د. أحمد محمود"
                    className={formErrors.name ? 'error' : ''}
                  />
                  {formErrors.name && <span className="dm-form-error">{formErrors.name}</span>}
                </div>

                {/* التخصص */}
                <div className="dm-form-group">
                  <label><LocalHospitalIcon style={{ fontSize: 14, marginLeft: 4 }} /> التخصص</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    placeholder="مثال: باطنة، عظام، أسنان"
                  />
                </div>

                {/* اسم المستخدم (Username) - فقط عند الإضافة */}
                {!editingDoctor && (
                  <div className="dm-form-group">
                    <label><PersonAddIcon style={{ fontSize: 14, marginLeft: 4 }} /> اسم المستخدم (للدخول) *</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="مثال: dr_ahmed"
                      className={formErrors.username ? 'error' : ''}
                      dir="ltr"
                      style={{ textAlign: 'right' }}
                    />
                    {formErrors.username && <span className="dm-form-error">{formErrors.username}</span>}
                  </div>
                )}

                {/* كلمة المرور - فقط عند الإضافة */}
                {!editingDoctor && (
                  <div className="dm-form-group">
                    <label>🔒 كلمة المرور *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="6 أحرف على الأقل"
                      className={formErrors.password ? 'error' : ''}
                      style={{ direction: 'ltr', textAlign: 'right' }}
                    />
                    {formErrors.password && <span className="dm-form-error">{formErrors.password}</span>}
                  </div>
                )}

                {/* الهاتف */}
                <div className="dm-form-group">
                  <label><PhoneIcon style={{ fontSize: 14, marginLeft: 4 }} /> رقم الهاتف *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="01xxxxxxxxx"
                    className={formErrors.phone ? 'error' : ''}
                  />
                  {formErrors.phone && <span className="dm-form-error">{formErrors.phone}</span>}
                </div>

                {/* رسوم الكشف */}
                <div className="dm-form-group">
                  <label>💰 رسوم الكشف (ج.م)</label>
                  <input
                    type="number"
                    name="fees"
                    value={formData.fees}
                    onChange={handleInputChange}
                    placeholder="مثال: 300"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="dm-modal-footer">
              <button
                className="dm-submit-btn primary"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <span className="dm-spinner"></span>
                ) : editingDoctor ? (
                  'حفظ التعديلات'
                ) : (
                  'إضافة الطبيب'
                )}
              </button>
              <button className="dm-submit-btn secondary" onClick={handleCloseModal}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;
