import { BookMarked } from 'lucide-react';
import React from 'react';

export function FormHeader() {
  return (
    <div
      className="px-8 py-6 bg-cyan-500 rounded-2xl shadow-md mb-10 text-center"
      style={{ backgroundColor: 'var(--color-primary-dark)' }}
    >
      <h2 className="text-3xl font-bold text-white mb-2 leading-snug">حجز موعد جديد</h2>
      <p className="text-white/90 text-lg">يرجى ملء بياناتك لحجز موعد</p>
    </div>
  );
}
