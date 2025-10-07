import React, { useState, useEffect } from 'react';
import { supabase, addPatient } from '../../supaBase/NursingBooking';
import { Schema } from './nursingBookingSchema';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useMediaQuery } from 'react-responsive';
import { NursingTopBar } from './components/NursingTopBar';
import NursingSidebar from './components/NursingSidebar';
import { PatientHelmet } from './components/PatientHelmet';
import { PatientSearchBar } from './components/PatientSearchBar';
import { PatientListHeader } from './components/PatientListHeader';
import { PatientTable } from './components/PatientTable';
import { PatientCards } from './components/PatientCards';
import { PatientModal } from './components/PatientModal';
import { ErrorMessage } from './components/ErrorMessage';
import { EmptyState } from './components/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';


const NursingPatientsList = () => {
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

  // Fetch patients from Supabase
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
          console.error('Error fetching patients:', error.message, error.details);
          setError(`فشل في جلب المرضى: ${error.message}`);
          Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: `فشل في جلب المرضى: ${error.message}`,
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#d33',
          });
          return;
        }

        setPatients(data || []);
        setFilteredPatients(data || []);
        setError(null);
      } catch (err) {
        console.error('Unexpected error fetching patients:', err);
        setError('حدث خطأ غير متوقع أثناء جلب المرضى.');
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'حدث خطأ غير متوقع أثناء جلب المرضى.',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#d33',
        });
      }
    };

    fetchPatients();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = patients.filter(
      patient =>
        patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phoneNumber.includes(searchTerm) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  // Handle form input changes
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Open edit modal with patient data
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

  // Add or update patient in Supabase
  const handlePatientSubmit = async () => {
    try {
      const editSchema = Schema.omit(['amount', 'appointmentDateTime']);
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
        // Update existing patient
        const { error } = await supabase.from('patients').update(patientData).eq('id', currentPatient.id);

        if (error) {
          console.error('Error updating patient:', error.message, error.details);
          Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: `فشل في تحديث المريض: ${error.message}`,
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#d33',
          });
          return;
        }

        setPatients(prev => prev.map(p => (p.id === currentPatient.id ? { ...p, ...patientData } : p)));
        setFilteredPatients(prev => prev.map(p => (p.id === currentPatient.id ? { ...p, ...patientData } : p)));
        Swal.fire({
          icon: 'success',
          title: 'تم التحديث',
          text: 'تم تحديث بيانات المريض بنجاح!',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#3085d6',
        });
      } else {
        // Add new patient
        const success = await addPatient(patientData, () => {
          setFormData({
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
        });

        if (success) {
          // Fetch the newly added patient to get the full data including ID
          const { data: newPatient, error: fetchError } = await supabase
            .from('patients')
            .select(
              'id, fullName, age, phoneNumber, address, bookingDate, visitType, notes, chronic_diseases, gender, email, blood'
            )
            .eq('phoneNumber', patientData.phoneNumber)
            .order('id', { ascending: false })
            .limit(1)
            .single();

          if (fetchError) {
            console.error('Error fetching new patient:', fetchError.message, fetchError.details);
            Swal.fire({
              icon: 'error',
              title: 'خطأ',
              text: `فشل في جلب بيانات المريض الجديد: ${fetchError.message}`,
              confirmButtonText: 'حسناً',
              confirmButtonColor: '#d33',
            });
            return;
          }

          setPatients(prev => [...prev, newPatient]);
          setFilteredPatients(prev => [...prev, newPatient]);
        }
      }

      setShowEditModal(false);
      setFormErrors({});
    } catch (err) {
      if (err.name === 'ValidationError') {
        const errors = {};
        err.inner.forEach(error => {
          errors[error.path] = error.message;
        });
        setFormErrors(errors);
      } else {
        console.error('Unexpected error handling patient:', err);
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'حدث خطأ غير متوقع أثناء معالجة بيانات المريض.',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#d33',
        });
      }
    }
  };

  // Delete patient from Supabase
  const deletePatient = async id => {
    const result = await Swal.fire({
      title: 'تأكيد الحذف',
      text: 'هل أنت متأكد من حذف هذا المريض؟ سيتم حذف جميع المواعيد المرتبطة بهذا المريض.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (!result.isConfirmed) return;

    try {
      const { error: appointmentError } = await supabase.from('appointments').delete().eq('patient_id', id);

      if (appointmentError) {
        console.error('Error deleting associated appointments:', appointmentError.message, appointmentError.details);
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: `فشل في حذف المواعيد المرتبطة: ${appointmentError.message}`,
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#d33',
        });
        return;
      }

      const { error: patientError } = await supabase.from('patients').delete().eq('id', id);

      if (patientError) {
        console.error('Error deleting patient:', patientError.message, patientError.details);
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: `فشل في حذف المريض: ${patientError.message}`,
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#d33',
        });
        return;
      }

      setPatients(prev => prev.filter(p => p.id !== id));
      setFilteredPatients(prev => prev.filter(p => p.id !== id));
      Swal.fire({
        icon: 'success',
        title: 'تم الحذف',
        text: 'تم حذف المريض وجميع مواعيده بنجاح!',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#3085d6',
      });
    } catch (err) {
      console.error('Unexpected error deleting patient:', err);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ غير متوقع أثناء حذف المريض.',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <div className="min-h-screen w-full pt-16 bg-gradient-to-br from-cyan-50 to-blue-50" dir="rtl">
      <PatientHelmet />
      <div className="flex flex-col lg:flex-row">
        <NursingTopBar />
        <div className="w-full lg:w-64 lg:min-h-screen">
          <NursingSidebar />
        </div>
        <main className="flex-1 p-4 sm:p-6 w-full">
          <nav className="bg-white p-3 mb-4 rounded-lg shadow-sm lg:hidden">
            <button
              className="text-gray-700"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#sidebarMenu"
              aria-controls="sidebarMenu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="inline-block w-6 h-6 bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 30 30%27%3E%3Cpath stroke=%27rgba(0, 0, 0, 0.5)%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-miterlimit=%2710%27 d=%27M4 7h22M4 15h22M4 23h22%27/%3E%3C/svg%3E')] bg-no-repeat bg-center" />
            </button>
          </nav>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-100"
          >
            <PatientListHeader />
            <PatientSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            {error && <ErrorMessage error={error} />}
            {filteredPatients.length === 0 && !error ? (
              <EmptyState searchTerm={searchTerm} />
            ) : (
              <>
                <PatientTable
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
          </motion.div>
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
        </main>
      </div>
    </div>
  );
};

export default NursingPatientsList;