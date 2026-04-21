import React, { useState, useEffect } from 'react';
import { Field, ErrorMessage, useFormikContext } from 'formik';
import { supabase } from '../../../supaBase/booking';

export function DoctorSelect() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data, error } = await supabase
          .from('doctors')
          .select('id, name, specialization, fees')
          .eq('is_active', true)
          .order('name');

        if (!error && data) {
          setDoctors(data);
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2 text-gray-800">
        <span className="inline-block w-5 h-5 mr-2 text-teal-600 mx-2">👨‍⚕️</span>
        اختر الطبيب *
      </label>
      <Field
        as="select"
        name="doctor_id"
        required
        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-right h-[50px]"
        style={{ direction: 'rtl' }}
      >
        <option value="">
          {loading ? 'جاري التحميل...' : 'اختر الطبيب المعالج'}
        </option>
        {doctors.map(doctor => (
          <option key={doctor.id} value={doctor.id}>
            {doctor.name}
            {doctor.specialization ? ` - ${doctor.specialization}` : ''}
            {doctor.fees ? ` (${doctor.fees} ج.م)` : ''}
          </option>
        ))}
      </Field>
      <ErrorMessage name="doctor_id" component="div" className="text-red-600 text-sm mt-1" />
    </div>
  );
}
