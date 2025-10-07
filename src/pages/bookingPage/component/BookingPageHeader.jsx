import React from 'react';
import { Stethoscope } from 'lucide-react';

export function BookingPageHeader() {
  return (
    <div className="py-8 px-4 bg-(--color-accent)" style={{ backgroundColor: '#0097A7' }}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-2xl font-bold text-white ml-3 mb-0">عيادة الرعاية الصحية</h1>
          <Stethoscope size={32} className="text-white" />
        </div>
        <p className="text-lg text-teal-100">احجز موعدك</p>
      </div>
    </div>
  );
}
