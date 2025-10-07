import { memo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DollarSign } from 'lucide-react';
import useDoctorDashboardStore from '../../../../store/doctorDashboardStore';

const RevenueChart = () => {
  const data = useDoctorDashboardStore(state => state.statistics.revenue);

  return (
    <div className="bg-gray-50 p-4 rounded-2xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <DollarSign className="text-cyan-600" /> الإيرادات الشهرية
      </h2>
      <div className="h-96 bg-white rounded-2xl p-4 shadow-md">
        <ResponsiveContainer width="103%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 5" />
            <XAxis dataKey="name" />
            <YAxis tickMargin={30} />
            <Tooltip formatter={value => [`${value} ج.م`, 'الإيرادات']} />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#E5B711FF" strokeWidth={2} name="الإيرادات (ج.م)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default memo(RevenueChart);
