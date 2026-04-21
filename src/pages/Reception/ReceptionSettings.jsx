import React, { useState } from 'react';
import { Save, AccessTime, Timer, GridView } from '@mui/icons-material';
import { getSettings, saveSettings, DAY_NAMES_AR } from './utils/calendarHelpers';
import Swal from 'sweetalert2';

const DURATION_OPTIONS = [15, 20, 30, 45, 60];
const SLOT_OPTIONS = [15, 30, 60];

const ReceptionSettings = () => {
  const [settings, setSettings] = useState(getSettings());
  const [hasChanges, setHasChanges] = useState(false);

  const handleWorkingHourChange = (dayIndex, field, value) => {
    setSettings(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [dayIndex]: {
          ...prev.workingHours[dayIndex],
          [field]: field === 'enabled' ? value : value,
        },
      },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const saved = saveSettings(settings);
    if (saved) {
      setHasChanges(false);
      Swal.fire({
        icon: 'success',
        title: 'تم الحفظ',
        text: 'تم حفظ الإعدادات بنجاح!',
        confirmButtonColor: 'var(--color-primary)',
        confirmButtonText: 'حسناً',
        timer: 1500,
      });
    }
  };

  return (
    <div className="p-4 sm:p-6" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                <AccessTime />
              </div>
              إعدادات العيادة
            </h1>
            <p className="text-gray-400 text-sm mt-1">تحكم في ساعات العمل ومدة المواعيد</p>
          </div>
          {hasChanges && (
            <button
              onClick={handleSave}
              className="px-6 py-3 text-white font-bold rounded-xl shadow-lg transition-all hover:brightness-110 active:scale-95 flex items-center gap-2"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Save fontSize="small" />
              حفظ التغييرات
            </button>
          )}
        </div>

        {/* ساعات العمل */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <AccessTime className="text-[var(--color-primary)]" fontSize="small" />
              ساعات العمل
            </h2>
            <p className="text-xs text-gray-400 mt-1">حدد أوقات عمل العيادة لكل يوم من أيام الأسبوع</p>
          </div>

          <div className="divide-y divide-gray-50">
            {DAY_NAMES_AR.map((dayName, index) => {
              const day = settings.workingHours[index];
              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 px-6 py-4 transition-colors ${day.enabled ? 'bg-white' : 'bg-gray-50/80'}`}
                >
                  {/* Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={day.enabled}
                      onChange={e => handleWorkingHourChange(index, 'enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                  </label>

                  {/* Day Name */}
                  <span className={`font-bold text-sm w-20 ${day.enabled ? 'text-gray-800' : 'text-gray-400'}`}>
                    {dayName}
                  </span>

                  {day.enabled ? (
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-bold">من</span>
                        <input
                          type="time"
                          value={day.start}
                          onChange={e => handleWorkingHourChange(index, 'start', e.target.value)}
                          className="bg-transparent text-sm font-bold text-gray-700 focus:outline-none"
                        />
                      </div>
                      <span className="text-gray-300">←</span>
                      <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-bold">إلى</span>
                        <input
                          type="time"
                          value={day.end}
                          onChange={e => handleWorkingHourChange(index, 'end', e.target.value)}
                          className="bg-transparent text-sm font-bold text-gray-700 focus:outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 italic">إجازة</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* مدة الموعد + فترة الخانات */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* مدة الموعد */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
              <Timer className="text-[var(--color-primary)]" fontSize="small" />
              مدة الموعد الافتراضية
            </h2>
            <p className="text-xs text-gray-400 mb-4">يمكن تعديلها لكل موعد على حدة</p>
            <div className="flex flex-wrap gap-2">
              {DURATION_OPTIONS.map(duration => (
                <button
                  key={duration}
                  onClick={() => {
                    setSettings(prev => ({ ...prev, defaultDuration: duration }));
                    setHasChanges(true);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                    settings.defaultDuration === duration
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-lg'
                      : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                  }`}
                >
                  {duration} دقيقة
                </button>
              ))}
            </div>
          </div>

          {/* خانات زمنية */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
              <GridView className="text-[var(--color-primary)]" fontSize="small" />
              فترة الخانات الزمنية
            </h2>
            <p className="text-xs text-gray-400 mb-4">الفترة بين كل خانة في العرض اليومي والأسبوعي</p>
            <div className="flex flex-wrap gap-2">
              {SLOT_OPTIONS.map(slot => (
                <button
                  key={slot}
                  onClick={() => {
                    setSettings(prev => ({ ...prev, slotInterval: slot }));
                    setHasChanges(true);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                    settings.slotInterval === slot
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-lg'
                      : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                  }`}
                >
                  {slot === 60 ? 'ساعة' : `${slot} دقيقة`}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReceptionSettings;
