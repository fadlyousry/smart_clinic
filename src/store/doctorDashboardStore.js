import { create } from 'zustand';
import { supabase } from '../supaBase/booking';

const removeDuplicates = (data, key = 'id') => {
  const seen = new Set();
  return data.filter(item => {
    const duplicate = seen.has(item[key]);
    seen.add(item[key]);
    return !duplicate;
  });
};

const useDoctorDashboardStore = create((set, get) => ({
  appointments: [],
  patients: [],
  currentVisit: null,
  loading: false,
  error: null,
  prescriptions: [],
  tests: [],
  doctors: [],
  drug_categories: [],
  dosage_options: [],
  duration_options: [],

  selectedMedications: [],
  setSelectedMedications: meds => set({ selectedMedications: meds }),
  selectedPatient: null,
  setSelectedPatient: patient => set({ selectedPatient: patient }),

  setPrescriptions: prescriptions => set({ prescriptions: removeDuplicates(prescriptions) }),
  setTests: tests => set({ tests: removeDuplicates(tests) }),
  setPatients: patients => set({ patients: removeDuplicates(patients) }),
  setAppointments: appointments => set({ appointments: removeDuplicates(appointments) }),
  setDoctors: doctors => set({ doctors: removeDuplicates(doctors) }),
  setDrug_categories: drug_categories => set({ drug_categories: removeDuplicates(drug_categories) }),
  setDosage_options: dosage_options => set({ dosage_options: removeDuplicates(dosage_options) }),
  setDuration_options: duration_options => set({ duration_options: removeDuplicates(duration_options) }),
  setVisits: visits => set({ visits: removeDuplicates(visits) }),
  setPrescriptionMedications: prescription_medications =>
    set({ prescription_medications: removeDuplicates(prescription_medications) }),
  setTestRequests: test_requests => set({ test_requests: removeDuplicates(test_requests) }),
  setRecords: records => set({ records: removeDuplicates(records) }),

  fetchData: async () => {
    const state = get();
    if (state.patients.length && state.doctors.length && !state.loading) {
      console.log('📊 Data already loaded, skipping fetch');
      return;
    }

    set({ loading: true, error: null });

    try {
      console.log('📊 Fetching all data...');

      const [
        { data: appointmentsData },
        { data: doctorsData },
        { data: patientsData },
        { data: visitsData },
        { data: recordsData },
        { data: prescriptionsData },
        { data: prescription_medicationsData },
        { data: testsData },
        { data: test_requestsData },
        { data: drug_categoriesData },
        { data: dosage_optionsData },
        { data: duration_optionsData },
      ] = await Promise.all([
        supabase.from('appointments').select('*'),
        supabase.from('doctors').select('*'),
        supabase.from('patients').select(`
          *,
          visits (
            *,
            medical_records (
              id,
              diagnosis,
              notes
            ),
            prescriptions (
              *,
              prescription_medications (
                *,
                medication:medications (*)
              )
            )
          ),
          test_requests (
            id,
            patient_id,
            test_id,
            result,
            status,
            created_at,
            tests!test_requests_test_id_fkey (
              id,
              name,
              duration,
              urgent,
              category_id,
              created_at
            )
          )
        `),

        supabase.from('visits').select('*'),
        supabase.from('medical_records').select('*'),
        supabase.from('prescriptions').select(`
          *,
          prescription_medications (
            *,
            medication:medications (id, name)
          )
        `),
        supabase.from('prescription_medications').select('*'),
        supabase.from('tests').select('*').order('created_at', { ascending: false }),
        supabase.from('test_requests').select(`
            id,
            patient_id,
            test_id,
            result,
            status,
            created_at,
            tests!test_requests_test_id_fkey (
              id,
              name,
              duration,
              urgent,
              category_id,
              created_at
            ),
            patients!test_requests_patient_id_fkey (
              id,
              fullName
            )
          `),

        supabase.from('drug_categories').select(`
          name,
          id,
          medications:medications (name)
        `),
        supabase.from('dosage_options').select('*'),
        supabase.from('duration_options').select('*'),
      ]);

      const processedPatientsData =
        patientsData?.map(patient => ({
          ...patient,
          visits: patient.visits?.sort((a, b) => new Date(b.time) - new Date(a.time)) || [],
          test_requests: patient.test_requests?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) || [],
        })) || [];

      set({
        appointments: removeDuplicates(appointmentsData || []),
        patients: removeDuplicates(processedPatientsData),
        visits: removeDuplicates(visitsData || []),
        records: removeDuplicates(recordsData || []),
        prescriptions: removeDuplicates(prescriptionsData || []),
        prescription_medications: removeDuplicates(prescription_medicationsData || []),
        tests: removeDuplicates(testsData || []),
        test_requests: removeDuplicates(test_requestsData || []),
        doctors: removeDuplicates(doctorsData || []),
        drug_categories: removeDuplicates(drug_categoriesData || []),
        dosage_options: removeDuplicates(dosage_optionsData || []),
        duration_options: removeDuplicates(duration_optionsData || []),
        loading: false,
      });

      const currentVisit = appointmentsData?.find(a => a.status === 'قيد الكشف');
      set({ currentVisit: currentVisit || null });

      console.log(' All data fetched successfully');
      console.log(
        ' Patients with test_requests:',
        processedPatientsData.filter(p => p.test_requests?.length > 0).length
      );
      console.log(' Total test_requests:', test_requestsData?.length || 0);
    } catch (error) {
      set({
        error: error.message,
        loading: false,
      });
      console.error(' Error fetching data:', error);
    }
  },
  fetchSelectedPatient: async patientId => {
    if (!patientId) return null;

    try {
      console.log(' Fetching patient data:', patientId);

      const { data, error } = await supabase
        .from('patients')
        .select(
          `
          *,
          visits (
            *,
            medical_records (
              id,
              diagnosis,
              notes
            ),
            prescriptions (
              *,
              prescription_medications (
                *,
                medication:medications (*)
              )
            )
          ),
          test_requests (
            id,
            patient_id,
            test_id,
            result,
            status,
            created_at,
            tests!test_requests_test_id_fkey (
              id,
              name,
              duration,
              urgent,
              category_id,
              created_at
            )
          )
        `
        )
        .eq('id', patientId)
        .single();

      if (error) throw error;

      if (data.visits) {
        data.visits.sort((a, b) => new Date(b.time) - new Date(a.time));
      }

      if (data.test_requests) {
        data.test_requests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }

      const currentPatients = get().patients;
      const updatedPatients = currentPatients.map(p => (p.id === patientId ? data : p));
      set({ patients: updatedPatients });

      console.log(' Patient data fetched successfully');
      console.log(' Test requests found:', data.test_requests?.length || 0);
      console.log(' Visits found:', data.visits?.length || 0);

      if (data.test_requests?.length > 0) {
        console.log('🔍 First test request structure:', data.test_requests[0]);
      }

      return data;
    } catch (error) {
      console.error(' Error fetching patient:', error);
      throw error;
    }
  },

  refreshSelectedPatient: async () => {
    const selectedPatient = get().selectedPatient;
    if (selectedPatient?.id) {
      const updated = await get().fetchSelectedPatient(selectedPatient.id);
      if (updated) {
        set({ selectedPatient: updated });
      }
    }
  },

  startVisit: async appointmentId => {
    try {
      const { error } = await supabase.from('appointments').update({ status: 'قيد الكشف' }).eq('id', appointmentId);

      if (error) throw error;

      set(state => {
        const updatedAppointments = state.appointments.map(app =>
          app.id === appointmentId ? { ...app, status: 'قيد الكشف' } : app
        );
        return {
          appointments: removeDuplicates(updatedAppointments),
          currentVisit: updatedAppointments.find(app => app.id === appointmentId),
        };
      });
    } catch (error) {
      console.error('خطأ في بدء الكشف:', error.message);
    }
  },

  endVisit: async appointmentId => {
    try {
      const { data: appointmentData, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single();

      if (fetchError || !appointmentData) throw fetchError;

      const { error: updateError } = await supabase
        .from('appointments')
        .update({ status: 'تم' })
        .eq('id', appointmentId);

      if (updateError) throw updateError;

      const { error: visitError } = await supabase.from('visits').insert([
        {
          appointment_id: appointmentData.id,
          patient_id: appointmentData.patient_id,
          doctor_id: appointmentData.doctor_id,
          date: new Date().toISOString(),
          notes: '',
        },
      ]);

      if (visitError) throw visitError;

      set(state => ({
        appointments: removeDuplicates(
          state.appointments.map(app => (app.id === appointmentId ? { ...app, status: 'تم' } : app))
        ),
        currentVisit: null,
      }));
    } catch (error) {
      console.error('فشل في إنهاء الزيارة:', error.message);
    }
  },

  fetchDrugCategories: async () => {
    try {
      const { data, error } = await supabase.from('drug_categories').select(`
          *,
          medications:medications (*)
        `);

      if (!error) set({ drug_categories: data });
    } catch (error) {
      console.error('Error fetching drug categories:', error);
    }
  },

  fetchMedications: async () => {
    try {
      const { data, error } = await supabase.from('medications').select('*');

      if (!error) set({ medications: data });
    } catch (error) {
      console.error('Error fetching medications:', error);
    }
  },

  exetVisit: async appointmentId => {
    try {
      const { error } = await supabase.from('appointments').update({ status: 'ملغي' }).eq('id', appointmentId);

      if (error) throw error;

      set(state => ({
        appointments: removeDuplicates(
          state.appointments.map(app => (app.id === appointmentId ? { ...app, status: 'ملغي' } : app))
        ),
        currentVisit: null,
      }));
    } catch (error) {
      console.error('خطأ في إلغاء الكشف:', error.message);
    }
  },

  updateAppointmentStatus: (appointmentId, newStatus) => {
    set(state => ({
      appointments: removeDuplicates(
        state.appointments.map(app => (app.id === appointmentId ? { ...app, status: newStatus } : app))
      ),
      currentVisit:
        newStatus === 'قيد الكشف'
          ? state.appointments.find(app => app.id === appointmentId)
          : state.currentVisit?.id === appointmentId
          ? null
          : state.currentVisit,
    }));
  },

  statistics: {
    monthlyPatients: [],
    visitTypes: [],
    revenue: [],
    topMedications: [],
    quickStats: [],
  },
  setStatistics: newStats =>
    set(state => ({
      statistics: {
        ...state.statistics,
        ...newStats,
      },
    })),
}));

export default useDoctorDashboardStore;
