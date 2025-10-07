import { memo } from 'react';
import useDoctorDashboardStore from '../../../../store/doctorDashboardStore';

const RevenueSummary = () => {
  const revenueData = useDoctorDashboardStore(state => state.statistics.revenue);
  const medicationsData = useDoctorDashboardStore(state => state.statistics.topMedications);

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const topQuarter = revenueData.length > 0
    ? revenueData.reduce((max, item) => (item.revenue > max.revenue ? item : max), revenueData[0]).name
    : 'لا يوجد بيانات';

  const mostUsed = medicationsData[0]?.name || 'لا يوجد بيانات';
  const leastUsed = medicationsData[medicationsData.length - 1]?.name || 'لا يوجد بيانات';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-green-100 p-4 rounded-lg shadow-sm text-center">
        <p className="text-sm text-gray-500">إجمالي الإيرادات</p>
        <p className="text-xl font-bold text-green-600">{totalRevenue.toLocaleString()} ج.م</p>
      </div>
      <div className="bg-blue-100 p-4 rounded-lg shadow-sm text-center">
        <p className="text-sm text-gray-500">الشهر الأعلى</p>
        <p className="text-xl font-bold text-blue-600">{topQuarter}</p>
      </div>
      <div className="bg-purple-100 p-4 rounded-lg shadow-sm text-center">
        <p className="text-sm text-gray-500">الدواء الأكثر صرفاً</p>
        <p className="text-xl font-bold text-purple-600">{mostUsed}</p>
      </div>
      <div className="bg-orange-100 p-4 rounded-lg shadow-sm text-center">
        <p className="text-sm text-gray-500">الدواء الأقل صرفاً</p>
        <p className="text-xl font-bold text-orange-600">{leastUsed}</p>
      </div>
    </div>
  );
};

export default memo(RevenueSummary);