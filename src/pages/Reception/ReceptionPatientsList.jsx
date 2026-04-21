import React, { useState, useEffect } from 'react';
import { supabase, addPatient } from '../../supaBase/ReceptionBooking';
import { Schema } from './receptionBookingSchema';
import Swal from 'sweetalert2';
import { useMediaQuery } from 'react-responsive';
import { PatientHelmet } from './components/PatientHelmet';
import { PatientSearchBar } from './components/PatientSearchBar';
import { PatientListHeader } from './components/PatientListHeader';
import { PatientTable } from './components/PatientTable';
import { PatientCards } from './components/PatientCards';
import { PatientModal } from './components/PatientModal';
import { ErrorMessage } from './components/ErrorMessage';
import { EmptyState } from './components/EmptyState';


const ReceptionPatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phoneNumber: '',
    address: '',
    bookingDate: '',
    visitType: '',
    notes: '',
    chronic_diseases: '',
    gender: '',
    email: '',
    blood: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const isTablet = useMediaQuery({ query: '(max-width: 1024px)' });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase
          .from('patients')
          .select(
            'id, fullName, age, phoneNumber, address, bookingDate, visitType, notes, chronic_diseases, gender, email, blood'
          )
          .order('id', { ascending: true });

        if (error) {
          setError(`فشل في جلب المرضى: ${error.message}`);
          return;
        }

        setPatients(data || []);
        setFilteredPatients(data || []);
        setError(null);
      } catch (err) {
        setError('حدث خطأ غير متوقع أثناء جلب المرضى.');
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const filtered = patients.filter(
      patient =>
        (patient.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient.phoneNumber || '').includes(searchTerm) ||
        (patient.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const openEditModal = patient => {
    setCurrentPatient(patient);
    setFormData({
      fullName: patient?.fullName || '',
      age: patient?.age.toString() || '',
      phoneNumber: patient?.phoneNumber || '',
      address: patient?.address || '',
      bookingDate: patient?.bookingDate || '',
      visitType: patient?.visitType || '',
      notes: patient?.notes || '',
      chronic_diseases: patient?.chronic_diseases ? patient.chronic_diseases.join(', ') : '',
      gender: patient?.gender || '',
      email: patient?.email || '',
      blood: patient?.blood || '',
    });
    setShowEditModal(true);
  };

  const handlePatientSubmit = async () => {
    try {
      const editSchema = Schema.omit(['amount', 'appointmentDateTime', 'visitType']);
      await editSchema.validate(
        {
          ...formData,
          chronic_diseases: formData.chronic_diseases
            ? formData.chronic_diseases
                .split(',')
                .map(item => item.trim())
                .filter(item => item)
            : null,
        },
        { abortEarly: false }
      );

      const patientData = {
        fullName: formData.fullName,
        age: parseInt(formData.age),
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        bookingDate: formData.bookingDate,
        visitType: formData.visitType,
        notes: formData.notes || null,
        chronic_diseases: formData.chronic_diseases
          ? formData.chronic_diseases
              .split(',')
              .map(item => item.trim())
              .filter(item => item)
          : null,
        gender: formData.gender || null,
        email: formData.email || null,
        blood: formData.blood || null,
      };

      if (currentPatient) {
        const { error } = await supabase.from('patients').update(patientData).eq('id', currentPatient.id);
        if (error) throw error;

        setPatients(prev => prev.map(p => (p.id === currentPatient.id ? { ...p, ...patientData } : p)));
        setFilteredPatients(prev => prev.map(p => (p.id === currentPatient.id ? { ...p, ...patientData } : p)));
        Swal.fire({ icon: 'success', title: 'تم التحديث', text: 'تم تحديث بيانات المريض بنجاح!' });
      } else {
        const success = await addPatient(patientData, () => {
          setFormData({ fullName: '', age: '', phoneNumber: '', address: '', bookingDate: '', visitType: '', notes: '', chronic_diseases: '', gender: '', email: '', blood: '' });
        });

        if (success) {
          const { data: newPatient } = await supabase.from('patients').select('*').eq('phoneNumber', patientData.phoneNumber).order('id', { ascending: false }).limit(1).single();
          setPatients(prev => [...prev, newPatient]);
          setFilteredPatients(prev => [...prev, newPatient]);
        }
      }

      setShowEditModal(false);
      setFormErrors({});
    } catch (err) {
      if (err.name === 'ValidationError') {
        const errors = {};
        err.inner.forEach(error => { errors[error.path] = error.message; });
        setFormErrors(errors);
      }
    }
  };

  const deletePatient = async id => {
    const result = await Swal.fire({
      title: 'تأكيد الحذف',
      text: 'هل أنت متأكد من حذف هذا المريض؟ سيتم حذف جميع المواعيد المرتبطة بهذا المريض.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#d33',
    });

    if (!result.isConfirmed) return;

    try {
      await supabase.from('appointments').delete().eq('patient_id', id);
      await supabase.from('patients').delete().eq('id', id);
      setPatients(prev => prev.filter(p => p.id !== id));
      setFilteredPatients(prev => prev.filter(p => p.id !== id));
      Swal.fire({ icon: 'success', title: 'تم الحذف', text: 'تم حذف المريض بنجاح!' });
    } catch (err) {
       Swal.fire({ icon: 'error', title: 'خطأ', text: 'حدث خطأ أثناء الحذف.' });
    }
  };

  return (
    <div className="p-4 sm:p-6" dir="rtl">
      <PatientHelmet />
      <div
        className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-100 flex flex-col h-[calc(100vh-120px)]"
      >
        <PatientListHeader />
        <PatientSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex-1 overflow-y-auto mt-4 custom-scrollbar">
          {error && <ErrorMessage error={error} />}
          {filteredPatients.length === 0 && !error ? (
            <EmptyState searchTerm={searchTerm} />
          ) : (
            <>
              <PatientTable
                filteredAppointments={filteredPatients}
                filteredPatients={filteredPatients}
                isTablet={isTablet}
                openEditModal={openEditModal}
                deletePatient={deletePatient}
              />
              <PatientCards
                filteredPatients={filteredPatients}
                isTablet={isTablet}
                openEditModal={openEditModal}
                deletePatient={deletePatient}
              />
            </>
          )}
        </div>
      </div>
      <PatientModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        currentPatient={currentPatient}
        formData={formData}
        formErrors={formErrors}
        handleChange={handleChange}
        handlePatientSubmit={handlePatientSubmit}
        setFormErrors={setFormErrors}
      />
    </div>
  );
};

export default ReceptionPatientsList;