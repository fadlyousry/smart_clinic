import { useState, useEffect } from 'react';
import { supabase } from '../../../supaBase/booking';
import useAuthStore from '../../../store/auth';
import Swal from 'sweetalert2';
import './DoctorManagement.css'; // نستخدم نفس الستايلات لضمان التناسق

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import VerifiedIcon from '@mui/icons-material/Verified';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import ScienceIcon from '@mui/icons-material/Science';

const initialFormData = {
  name: '',
  username: '',
  password: '',
  phone: '',
};

const LabManagement = () => {
  const { CUisAdmin } = useAuthStore();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // جلب فنيين المعمل
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lab_users')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setStaff(data || []);
    } catch (error) {
      console.error('Error fetching lab staff:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'فشل في جلب بيانات المعمل',
        confirmButtonColor: '#0097A7',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (CUisAdmin()) {
      fetchStaff();
    }
  }, []);

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

  const stats = {
    total: staff.length,
    active: staff.filter(d => d.is_active !== false).length,
    inactive: staff.filter(d => d.is_active === false).length,
  };

  const filteredStaff = staff.filter(d =>
    d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.phone?.includes(searchQuery)
  );

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setFormData(initialFormData);
    setFormErrors({});
    setShowModal(true);
  };

  const handleOpenEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name || '',
      username: '',
      password: '',
      phone: staffMember.phone || '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStaff(null);
    setFormData(initialFormData);
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'اسم الفني مطلوب';
    if (!editingStaff) {
      if (!formData.username.trim()) errors.username = 'اسم المستخدم (للدخول) مطلوب';
      else if (formData.username.includes(' ')) errors.username = 'اسم المستخدم يجب ألا يحتوي على مسافات';
      else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) errors.username = 'اسم المستخدم يجب أن يكون بالانجليزية ويحتوي على حروف وأرقام فقط';
      
      if (!formData.password) errors.password = 'كلمة المرور مطلوبة';
      else if (formData.password.length < 6) errors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }
    if (!formData.phone.trim()) errors.phone = 'رقم الهاتف مطلوب';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddStaff = async () => {
    try {
      const { data: { session: adminSession } } = await supabase.auth.getSession();
      if (!adminSession) throw new Error('جلسة الأدمن غير موجودة');

      const dummyEmail = `${formData.username.trim().toLowerCase()}@smartclinic.com`;
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: dummyEmail,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            phone: formData.phone,
            role: 'lab', // تسجيل المستخدم برتبة (معمل)
          },
        },
      });

      if (authError) throw authError;

      await supabase.auth.setSession({
        access_token: adminSession.access_token,
        refresh_token: adminSession.refresh_token,
      });

      const { error: dbError } = await supabase
        .from('lab_users')
        .insert({
          name: formData.name,
          phone: formData.phone,
          user_id: authData.user.id,
          is_active: true,
        });

      if (dbError) throw dbError;

      Swal.fire({
        icon: 'success',
        title: 'تمت الإضافة',
        text: `تم إضافة فني المعمل: ${formData.name} بنجاح`,
        confirmButtonColor: '#0097A7',
      });

      handleCloseModal();
      fetchStaff();
    } catch (error) {
      console.error('Error adding lab staff:', error);
      let errorMsg = 'حدث خطأ أثناء إضافة فني المعمل';
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

  const handleUpdateStaff = async () => {
    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
      };

      const { error } = await supabase
        .from('lab_users')
        .update(updateData)
        .eq('id', editingStaff.id);

      if (error) throw error;

      Swal.fire({
        icon: 'success',
        title: 'تم التحديث',
        text: `تم تحديث بيانات ${formData.name} بنجاح`,
        confirmButtonColor: '#0097A7',
      });

      handleCloseModal();
      fetchStaff();
    } catch (error) {
      console.error('Error updating lab staff:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'فشل في تحديث بيانات ফني المعمل',
        confirmButtonColor: '#0097A7',
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      if (editingStaff) {
        await handleUpdateStaff();
      } else {
        await handleAddStaff();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (staffMember) => {
    const newStatus = !staffMember.is_active;
    const action = newStatus ? 'تفعيل' : 'تعطيل';

    const result = await Swal.fire({
      title: `${action} حساب الفني`,
      text: `هل تريد ${action} حساب ${staffMember.name}؟`,
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
        .from('lab_users')
        .update({ is_active: newStatus })
        .eq('id', staffMember.id);

      if (error) throw error;

      Swal.fire({
        icon: 'success',
        title: `تم ${action} الحساب`,
        text: `تم ${action} حساب ${staffMember.name}`,
        confirmButtonColor: '#0097A7',
      });

      fetchStaff();
    } catch (error) {
      console.error('Error toggling staff status:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: `فشل في ${action} حساب الفني`,
        confirmButtonColor: '#0097A7',
      });
    }
  };

  const getInitial = (name) => {
    if (!name) return '?';
    return name.trim()[0] || '?';
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
      <div className="dm-header">
        <h1>إدارة المعمل (Staff)</h1>
        <button className="dm-add-btn" onClick={handleOpenAdd}>
          <PersonAddIcon style={{ fontSize: 20 }} />
          إضافة مستخدم جديد
        </button>
      </div>

      <div className="dm-stats">
        <div className="dm-stat-card">
          <div className="dm-stat-icon total">
            <GroupIcon />
          </div>
          <div className="dm-stat-info">
            <h3>{stats.total}</h3>
            <p>إجمالي الفنيين</p>
          </div>
        </div>
        <div className="dm-stat-card">
          <div className="dm-stat-icon active">
            <VerifiedIcon />
          </div>
          <div className="dm-stat-info">
            <h3>{stats.active}</h3>
            <p>فنيين نشطين</p>
          </div>
        </div>
        <div className="dm-stat-card">
          <div className="dm-stat-icon inactive">
            <PersonOffIcon />
          </div>
          <div className="dm-stat-info">
            <h3>{stats.inactive}</h3>
            <p>حسابات معطلة</p>
          </div>
        </div>
      </div>

      <div className="dm-table-container">
        <div className="dm-table-header">
          <h2>قائمة فنيي الطب المخبري</h2>
          <div style={{ position: 'relative' }}>
            <SearchIcon style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#94a3b8' }} />
            <input
              className="dm-search-input"
              placeholder="بحث بالاسم أو الهاتف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingRight: '2.2rem' }}
            />
          </div>
        </div>

        {filteredStaff.length === 0 ? (
          <div className="dm-empty">
            <div className="dm-empty-icon"><ScienceIcon style={{ fontSize: 40 }} /></div>
            <h3>لا يوجد مستخدمين للمعمل</h3>
            <p>{searchQuery ? 'لم يتم العثور على نتائج' : 'قم بإضافة أول فني معمل للمركز'}</p>
          </div>
        ) : (
          <>
            <div className="dm-table-wrapper">
              <table className="dm-table">
                <thead>
                  <tr>
                    <th>الاسم</th>
                    <th>الهاتف</th>
                    <th>الدور</th>
                    <th>الحالة</th>
                    <th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map(staffMember => (
                    <tr key={staffMember.id}>
                      <td>
                        <div className="dm-doctor-cell">
                          <div className="dm-doctor-avatar bg-indigo-500">{getInitial(staffMember.name)}</div>
                          <div>
                            <div className="dm-doctor-name">{staffMember.name}</div>
                            {staffMember.user_id && <div className="dm-doctor-email">حساب مربوط</div>}
                          </div>
                        </div>
                      </td>
                      <td>{staffMember.phone || '-'}</td>
                      <td>
                        <span style={{ color: '#6366f1', fontSize: '0.82rem', fontWeight: 'bold' }}>فني معمل</span>
                      </td>
                      <td>
                        <span className={`dm-status-badge ${staffMember.is_active !== false ? 'active' : 'inactive'}`}>
                          <span className="dm-status-dot"></span>
                          {staffMember.is_active !== false ? 'نشط' : 'معطل'}
                        </span>
                      </td>
                      <td>
                        <div className="dm-actions">
                          <button
                            className="dm-action-btn edit"
                            title="تعديل"
                            onClick={() => handleOpenEdit(staffMember)}
                          >
                            <EditIcon style={{ fontSize: 18 }} />
                          </button>
                          <button
                            className={`dm-action-btn toggle ${staffMember.is_active !== false ? 'deactivate' : ''}`}
                            title={staffMember.is_active !== false ? 'تعطيل' : 'تفعيل'}
                            onClick={() => handleToggleActive(staffMember)}
                          >
                            {staffMember.is_active !== false ? (
                              <BlockIcon style={{ fontSize: 18 }} />
                            ) : (
                              <CheckCircleIcon style={{ fontSize: 18 }} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards (بسيطة) */}
            <div className="dm-mobile-cards">
              {filteredStaff.map(staffMember => (
                <div className="dm-mobile-card" key={staffMember.id}>
                  <div className="dm-mobile-card-header">
                    <div className="dm-doctor-cell">
                      <div className="dm-doctor-avatar bg-indigo-500">{getInitial(staffMember.name)}</div>
                      <div>
                        <div className="dm-doctor-name">{staffMember.name}</div>
                      </div>
                    </div>
                    <span className={`dm-status-badge ${staffMember.is_active !== false ? 'active' : 'inactive'}`}>
                      <span className="dm-status-dot"></span>
                      {staffMember.is_active !== false ? 'نشط' : 'معطل'}
                    </span>
                  </div>
                  <div className="dm-mobile-card-info">
                    {staffMember.phone && (
                      <span><PhoneIcon style={{ fontSize: 14 }} /> {staffMember.phone}</span>
                    )}
                  </div>
                  <div className="dm-mobile-card-actions">
                    <button className="dm-action-btn edit" onClick={() => handleOpenEdit(staffMember)}>
                      <EditIcon style={{ fontSize: 18 }} />
                    </button>
                    <button
                      className={`dm-action-btn toggle ${staffMember.is_active !== false ? 'deactivate' : ''}`}
                      onClick={() => handleToggleActive(staffMember)}
                    >
                      {staffMember.is_active !== false ? (
                        <BlockIcon style={{ fontSize: 18 }} />
                      ) : (
                        <CheckCircleIcon style={{ fontSize: 18 }} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div className="dm-modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCloseModal()}>
          <div className="dm-modal">
            <div className="dm-modal-header">
              <h2>{editingStaff ? `تعديل بيانات ${editingStaff.name}` : 'إضافة فني معمل جديد'}</h2>
              <button className="dm-modal-close" onClick={handleCloseModal}>
                <CloseIcon style={{ fontSize: 18 }} />
              </button>
            </div>

            <div className="dm-modal-body">
              <div className="dm-form-grid">
                <div className="dm-form-group">
                  <label><BadgeIcon style={{ fontSize: 14, marginLeft: 4 }} /> الاسم *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="مثال: أحمد عبد الله"
                    className={formErrors.name ? 'error' : ''}
                  />
                  {formErrors.name && <span className="dm-form-error">{formErrors.name}</span>}
                </div>

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

                {!editingStaff && (
                  <div className="dm-form-group">
                    <label><PersonAddIcon style={{ fontSize: 14, marginLeft: 4 }} /> اسم المستخدم (Username) *</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="مثال: lab_ahmed"
                      className={formErrors.username ? 'error' : ''}
                      dir="ltr"
                      style={{ textAlign: 'right' }}
                    />
                    {formErrors.username && <span className="dm-form-error">{formErrors.username}</span>}
                  </div>
                )}

                {!editingStaff && (
                  <div className="dm-form-group">
                    <label>🔒 كلمة المرور *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="6 أحرف على الأقل"
                      className={formErrors.password ? 'error' : ''}
                      dir="ltr"
                      style={{ textAlign: 'right' }}
                    />
                    {formErrors.password && <span className="dm-form-error">{formErrors.password}</span>}
                  </div>
                )}

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
                ) : editingStaff ? (
                  'حفظ التعديلات'
                ) : (
                  'إضافة مستخدم المعمل'
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

export default LabManagement;
