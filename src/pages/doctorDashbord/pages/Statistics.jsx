
import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { toast } from 'react-toastify';
import useDoctorDashboardStore from '../../../store/doctorDashboardStore';
import QuickStats from '../components/statistics/QuickStats';
import MonthlyPatientsChart from '../components/statistics/MonthlyPatientsChart';
import VisitTypePie from '../components/statistics/VisitTypePie';
import RevenueChart from '../components/statistics/RevenueChart';
import TopMedicationsChart from '../components/statistics/TopMedicationsChart';
import RevenueSummary from '../components/statistics/RevenueSummary';
import {
  fetchMonthlyPatients,
  fetchVisitTypes,
  fetchQuarterlyRevenue,
  fetchTopMedications,
  fetchQuickStats,
} from '../components/statistics/services/statisticsService';

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const setStatistics = useDoctorDashboardStore(state => state.setStatistics);
  const [timeRange, setTimeRange] = useState('monthly');

  const loadStatistics = async () => {
    try {
      const [monthlyPatients, visitTypes, revenue, topMedications, quickStats] = await Promise.all([
        fetchMonthlyPatients(),
        fetchVisitTypes(),
        fetchQuarterlyRevenue(),
        fetchTopMedications(),
        fetchQuickStats(),
      ]);

      setStatistics({
        monthlyPatients,
        visitTypes,
        revenue,
        topMedications,
        quickStats,
      });
    } catch (err) {
      console.error(err);
      toast.error('فشل في تحميل الإحصائيات');
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          <p>حدث خطأ في تحميل البيانات:</p>
          <p>{error.message}</p>
          <button onClick={() => window.location.reload()} className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 bg-white min-h-screen" dir="rtl">
      <div className='flex justify-between'>
        <div className="flex flex-col font-bold mx-2 sm:mx-4 lg:mx-6 my-3 mb-8">
          <span className="text-base sm:text-lg lg:text-xl">
            إحصائيات العياده <Activity className="text-cyan-600 inline" />{' '}
          </span>
        </div>
        <div className='pt-4'>
          <select
            className="border border-cyan-500 rounded-lg p-2 bg-white shadow-sm"
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
          >
            <option value="monthly">شهري</option>
            <option value="quarterly">ربع سنوي</option>
            <option value="yearly">سنوي</option>
          </select>
        </div>
      </div>

      <QuickStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <MonthlyPatientsChart />
        <VisitTypePie />
      </div>

      <RevenueSummary />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <TopMedicationsChart />
      </div>
    </div>
  );
};

export default Statistics;