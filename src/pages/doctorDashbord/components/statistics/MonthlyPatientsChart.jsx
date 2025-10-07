import { memo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { User } from 'lucide-react';
import useDoctorDashboardStore from '../../../../store/doctorDashboardStore';

const MonthlyPatientsChart = () => {
  const data = useDoctorDashboardStore(state => state.statistics.monthlyPatients);

  return (
    <div className="bg-gray-50 p-4 rounded-2xl shadow-md col-span-2">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <User className="text-cyan-600" /> توزيع الكشوفات شهرياً
      </h2>
      <div className="h-80 bg-white rounded-2xl p-4  shadow-md">
        <ResponsiveContainer width="105%" height="105%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis  tickMargin={20}/>
            <Tooltip />
            <Legend />
            <Bar dataKey="patients" fill="#06b6d4" name="عدد الكشوفات" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default memo(MonthlyPatientsChart);