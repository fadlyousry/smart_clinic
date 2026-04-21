import React, { useState } from 'react';
import { FilterList, Close, LocalHospital, Payment, EventNote, CheckCircle } from '@mui/icons-material';
import { getDoctorColor } from '../../utils/calendarHelpers';

const CalendarFilters = ({ filters, setFilters, doctors, appointments }) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeCount = Object.values(filters).filter(v => v !== 'all').length;

  const clearFilters = () => {
    setFilters({ doctor: 'all', status: 'all', payment: 'all', visitType: 'all' });
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const FilterChip = ({ label, active, onClick, color }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
        active
          ? 'text-white shadow-sm'
          : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50'
      }`}
      style={active ? { backgroundColor: color || 'var(--color-primary)', borderColor: color || 'var(--color-primary)' } : {}}
    >
      {label}
    </button>
  );

  return (
    <div className="relative">
      {/* زر الفلتر */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
          activeCount > 0
            ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm'
            : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
        }`}
      >
        <FilterList style={{ fontSize: 16 }} />
        فلتر
        {activeCount > 0 && (
          <span className="bg-white text-[var(--color-primary)] w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">
            {activeCount}
          </span>
        )}
      </button>

      {/* لوحة الفلاتر */}
      {isOpen && (
        <>
          {/* backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>

          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden" dir="rtl">
            {/* الهيدر */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                <FilterList style={{ fontSize: 16 }} className="text-[var(--color-primary)]" />
                فلاتر البحث
              </h3>
              <div className="flex items-center gap-2">
                {activeCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-[10px] font-bold text-rose-500 hover:text-rose-600 transition-colors"
                  >
                    مسح الكل
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                >
                  <Close style={{ fontSize: 16 }} />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-5 max-h-80 overflow-y-auto">
              {/* فلتر الطبيب */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <LocalHospital style={{ fontSize: 12 }} /> الطبيب
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <FilterChip
                    label="الكل"
                    active={filters.doctor === 'all'}
                    onClick={() => updateFilter('doctor', 'all')}
                    color="#64748B"
                  />
                  {doctors.map(doc => {
                    const color = getDoctorColor(doc.id);
                    return (
                      <FilterChip
                        key={doc.id}
                        label={doc.name}
                        active={String(filters.doctor) === String(doc.id)}
                        onClick={() => updateFilter('doctor', String(doc.id))}
                        color={color.bg}
                      />
                    );
                  })}
                </div>
              </div>

              {/* فلتر الحالة */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <CheckCircle style={{ fontSize: 12 }} /> الحالة
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { value: 'all', label: 'الكل', color: '#64748B' },
                    { value: 'في الإنتظار', label: 'في الانتظار', color: '#F59E0B' },
                    { value: 'وصل العيادة', label: 'وصل العيادة', color: '#3B82F6' },
                    { value: 'تم', label: 'تم الكشف', color: '#10B981' },
                    { value: 'ملغى', label: 'ملغى', color: '#EF4444' },
                  ].map(opt => (
                    <FilterChip
                      key={opt.value}
                      label={opt.label}
                      active={filters.status === opt.value}
                      onClick={() => updateFilter('status', opt.value)}
                      color={opt.color}
                    />
                  ))}
                </div>
              </div>

              {/* فلتر الدفع */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Payment style={{ fontSize: 12 }} /> الدفع
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { value: 'all', label: 'الكل', color: '#64748B' },
                    { value: 'paid', label: 'مدفوع', color: '#10B981' },
                    { value: 'unpaid', label: 'غير مدفوع', color: '#EF4444' },
                  ].map(opt => (
                    <FilterChip
                      key={opt.value}
                      label={opt.label}
                      active={filters.payment === opt.value}
                      onClick={() => updateFilter('payment', opt.value)}
                      color={opt.color}
                    />
                  ))}
                </div>
              </div>

              {/* فلتر نوع الزيارة */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <EventNote style={{ fontSize: 12 }} /> نوع الزيارة
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { value: 'all', label: 'الكل', color: '#64748B' },
                    { value: 'كشف', label: 'كشف', color: '#6366F1' },
                    { value: 'فحص', label: 'كشف (فحص)', color: '#6366F1' },
                    { value: 'استشارة', label: 'استشارة', color: '#8B5CF6' },
                    { value: 'متابعة', label: 'متابعة', color: '#0D9488' },
                  ].map(opt => (
                    <FilterChip
                      key={opt.value}
                      label={opt.label}
                      active={filters.visitType === opt.value}
                      onClick={() => updateFilter('visitType', opt.value)}
                      color={opt.color}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* عدد النتائج */}
            <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-center">
              <span className="text-xs font-bold text-gray-400">
                {appointments.length} نتيجة
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CalendarFilters;
