import { supabase } from '../../../../../supaBase/booking';

export const fetchMonthlyPatients = async () => {
  const { data, error } = await supabase.from('visits').select('date, patient_id').order('date', { ascending: true });
  if (error) throw error;

  const monthlyData = data.reduce((acc, visit) => {
    const date = new Date(visit.date);
    const month = date.toLocaleString('ar-EG', { month: 'long' });
    if (!acc[month]) acc[month] = { patients: 0 };
    acc[month].patients += 1;
    return acc;
  }, {});

  return Object.entries(monthlyData).map(([name, value]) => ({ name, patients: value.patients }));
};

export const fetchVisitTypes = async () => {
  const { data, error } = await supabase.from('appointments').select('visitType, id').not('visitType', 'is', null);
  if (error) throw error;

  const visitTypes = data.reduce((acc, item) => {
    const type = item.visitType || 'غير محدد';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(visitTypes).map(([name, value]) => ({ name, value }));
};

export const fetchQuarterlyRevenue = async () => {
  const { data, error } = await supabase.from('appointments').select('date, amount').eq('status', 'تم');
  if (error) throw error;

  const quarterlyData = data.reduce((acc, item) => {
    const date = new Date(item.date);
    const quarter = ` الشهر ${date.getMonth() + 1}`;
    if (!acc[quarter]) acc[quarter] = 0;
    acc[quarter] += item.amount || 0;
    return acc;
  }, {});

  return Object.entries(quarterlyData).map(([name, revenue]) => ({ name, revenue }));
};

export const fetchTopMedications = async () => {
  const { data, error } = await supabase.from('prescription_medications').select('medication_id (name), id');
  if (error) throw error;

  const medsCount = data.reduce((acc, med) => {
    const name = med.medication_id?.name || 'غير معروف';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(medsCount)
    .map(([name, prescriptions]) => ({ name, prescriptions }))
    .sort((a, b) => b.prescriptions - a.prescriptions)
      .slice(0, 5);

};

export const fetchQuickStats = async () => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);

  const [totalPatients, monthlyVisits, testRequests, prescriptionsCount] = await Promise.all([
    supabase.from('patients').select('id', { count: 'exact' }),
    supabase.from('visits').select('id', { count: 'exact' }).gte('date', startOfMonth.toISOString()).lt('date', endOfMonth.toISOString()),
    supabase.from('test_requests').select('id', { count: 'exact' }).gte('created_at', startOfMonth.toISOString()).lt('created_at', endOfMonth.toISOString()),
    supabase.from('prescriptions').select('id', { count: 'exact' })
  ]);

  return [
    { key: 'totalPatients', title: 'إجمالي المرضى', value: totalPatients.count || 0, change: '+12%' },
    { key: 'monthlyVisits', title: 'الزيارات هذا الشهر', value: monthlyVisits.count || 0, change: '+8%' },
    { key: 'testRequests', title: 'التحاليل هذا الشهر', value: testRequests.count || 0, change: '+5%' },
    { key: 'prescriptions', title: 'وصفات طبية', value: prescriptionsCount.count || 0, change: '+10%' },
  ];
};