import { supabase } from '../../supaBase/booking';

export async function fetchPatientByPhone(phone) {
  if (!phone) throw new Error('Phone number is required');

  try {
    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('phoneNumber', phone)
      .single();

    if (patientError) throw patientError;
    if (!patientData) throw new Error('Patient not found with this phone number');

    return patientData;
  } catch (error) {
    console.error('Error in fetchPatientByPhone:', error);
    throw error;
  }
}

export async function fetchPatientMedicalRecord(patientId) {
  if (!patientId) throw new Error('Patient ID is required');

  try {
    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();

    if (patientError) throw patientError;
    if (!patientData) throw new Error('Patient not found');

    const { data: visitsData, error: visitsError } = await supabase
      .from('visits')
      .select(
        `
        *,
        prescriptions (
          *,
          prescription_medications (
            *,
            medication:medication_id (*)
          )
        )
      `
      )
      .eq('patient_id', patientId)
      .order('date', { ascending: false });

    if (visitsError) {
      console.warn('Error fetching visits:', visitsError);
    }

    const { data: testRequestsData, error: testsError } = await supabase
      .from('test_requests')
      .select(
        `
        *,
        test: test_id (*)
      `
      )
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (testsError) {
      console.warn('Error fetching test requests:', testsError);
    }

    const { data: appointmentsData, error: appointmentsError } = await supabase
      .from('appointments')
      .select(
        `
        *,
        doctor: doctor_id (name)
      `
      )
      .eq('patient_id', patientId)
      .order('date', { ascending: false });

    if (appointmentsError) {
      console.warn('Error fetching appointments:', appointmentsError);
    }

    const result = {
      ...patientData,
      visits: visitsData || [],
      test_requests: testRequestsData || [],
      appointments: appointmentsData || [],
    };

    console.log('Fetched patient data:', result);
    return result;
  } catch (error) {
    console.error('Error in fetchPatientMedicalRecord:', error);
    throw error;
  }
}

export async function fetchPatientPrescriptions(patientId) {
  if (!patientId) throw new Error('Patient ID is required');

  const { data, error } = await supabase
    .from('visits')
    .select(
      `
      prescriptions (
        *,
        prescription_medications (
          *,
          medication:medication_id (*)
        )
      )
    `
    )
    .eq('patient_id', patientId);

  if (error) throw error;

  const prescriptions = data?.flatMap(visit => visit.prescriptions || []) || [];
  console.log('Prescriptions found:', prescriptions);

  return prescriptions;
}

export async function fetchPatientAppointments(patientId) {
  if (!patientId) throw new Error('Patient ID is required');

  const { data, error } = await supabase
    .from('appointments')
    .select(
      `
      *,
      doctor: doctor_id (name)
    `
    )
    .eq('patient_id', patientId)
    .order('date', { ascending: false });

  if (error) throw error;

  console.log('Appointments found:', data);
  return data || [];
}

export async function fetchPrescriptionDetails(prescriptionId) {
  const { data, error } = await supabase
    .from('prescriptions')
    .select(
      `
      *,
      prescription_medications (
        *,
        medication:medication_id (*)
      ),
      visit:visit_id (
        patient:patient_id (*)
      )
    `
    )
    .eq('id', prescriptionId)
    .single();

  if (error) throw error;
  return data;
}

export async function getQueuePosition(patientId, doctorId = null) {
  if (!patientId) throw new Error('Patient ID is required');

  try {
    let query = supabase
      .from('appointments')
      .select('*, doctor:doctor_id(name)')
      .eq('patient_id', patientId)
      .eq('status', 'في الإنتظار')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (doctorId) {
      query = query.eq('doctor_id', doctorId);
    }

    const { data: patientAppointments, error: patientError } = await query.limit(1);
    if (patientError) throw patientError;
    if (!patientAppointments || patientAppointments.length === 0) {
      return { nextAppointment: null, queuePosition: 0, totalQueue: 0 };
    }

    const nextAppointment = patientAppointments[0];
    const appointmentDate = nextAppointment.date;
    const appointmentTime = nextAppointment.time;

    const { data: allAppointments, error: allError } = await supabase
      .from('appointments')
      .select('*')
      .eq('date', appointmentDate)
      .eq('status', 'في الإنتظار')
      .eq('doctor_id', nextAppointment.doctor_id)
      .lt('time', appointmentTime)
      .order('time', { ascending: true });

    if (allError) throw allError;

    const { data: totalAppointments, error: totalError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact' })
      .eq('date', appointmentDate)
      .eq('status', 'في الإنتظار')
      .eq('doctor_id', nextAppointment.doctor_id);

    if (totalError) throw totalError;

    return {
      nextAppointment: nextAppointment,
      queuePosition: allAppointments?.length + 1 || 1,
      totalQueue: totalAppointments?.length || 0,
    };
  } catch (error) {
    console.error('Error in getQueuePosition:', error);
    throw error;
  }
}

export async function updateAppointmentStatus(appointmentId, newStatus) {
  if (!appointmentId || !newStatus) {
    throw new Error('Appointment ID and status are required');
  }

  const { data, error } = await supabase
    .from('appointments')
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', appointmentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getDoctorAppointmentsForToday(doctorId, date = null) {
  if (!doctorId) throw new Error('Doctor ID is required');

  const targetDate = date || new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('appointments')
    .select(
      `
      *,
      patient:patient_id (
        fullName,
        phoneNumber,
        age,
        gender
      )
    `
    )
    .eq('doctor_id', doctorId)
    .eq('date', targetDate)
    .eq('status', 'في الإنتظار')
    .order('time', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function fetchPatientMedicalRecordByPhone(phone) {
  if (!phone) throw new Error('Phone number is required');

  try {
    const patient = await fetchPatientByPhone(phone);

    const medicalRecord = await fetchPatientMedicalRecord(patient.id);

    const queueInfo = await getQueuePosition(patient.id);

    return {
      ...medicalRecord,
      queueInfo,
    };
  } catch (error) {
    console.error('Error in fetchPatientMedicalRecordByPhone:', error);
    throw error;
  }
}
