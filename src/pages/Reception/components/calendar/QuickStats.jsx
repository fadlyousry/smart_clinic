import React, { useMemo, memo } from 'react';
import { CalendarToday, CheckCircle, HourglassEmpty, Cancel, AttachMoney } from '@mui/icons-material';

const StatCard = memo(({ icon, label, value, color, bgColor }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow">
    <div
      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0"
      style={{ backgroundColor: bgColor, color }}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black text-gray-800 leading-tight">{value}</p>
    </div>
  </div>
));

const QuickStats = memo(({ stats }) => {
  const cards = useMemo(() => [
    {
      icon: <CalendarToday fontSize="small" />,
      label: 'مواعيد اليوم',
      value: stats.total,
      color: '#0097A7',
      bgColor: '#E0F7FA',
    },
    {
      icon: <CheckCircle fontSize="small" />,
      label: 'وصلوا العيادة',
      value: stats.arrived,
      color: '#1D4ED8',
      bgColor: '#DBEAFE',
    },
    {
      icon: <HourglassEmpty fontSize="small" />,
      label: 'في الانتظار',
      value: stats.waiting,
      color: '#B45309',
      bgColor: '#FEF3C7',
    },
    {
      icon: <Cancel fontSize="small" />,
      label: 'ملغى',
      value: stats.cancelled,
      color: '#BE123C',
      bgColor: '#FFE4E6',
    },
    {
      icon: <AttachMoney fontSize="small" />,
      label: 'الإيرادات',
      value: `${stats.revenue} ج.م`,
      color: '#7C3AED',
      bgColor: '#EDE9FE',
    },
  ], [stats]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card, i) => (
        <StatCard key={i} {...card} />
      ))}
    </div>
  );
});

QuickStats.displayName = 'QuickStats';

export default QuickStats;
