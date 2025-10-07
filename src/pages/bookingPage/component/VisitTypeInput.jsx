import React from 'react';
import { Clock } from 'lucide-react';
import { Field, ErrorMessage } from 'formik';

export function VisitTypeInput() {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2 text-gray-800">
        <Clock className="inline w-5 h-5 mr-2 text-teal-600  mx-2" />
        نوع الزيارة *
      </label>
      <Field
        as="select"
        name="visitType"
        required
        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-right h-[50px]"
        style={{ direction: 'rtl' }}
      >
        <option value="">اختر نوع الزيارة</option>
        <option value="فحص">فحص عام</option>
        <option value="إستشارة">استشارة</option>
        <option value="متابعة">زيارة متابعة</option>
      </Field>
      <ErrorMessage name="visitType" component="div" className="text-red-600 text-sm mt-1" />
    </div>
  );
}
