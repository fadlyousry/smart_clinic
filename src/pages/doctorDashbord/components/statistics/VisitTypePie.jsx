import { memo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { Stethoscope } from 'lucide-react';
import useDoctorDashboardStore from '../../../../store/doctorDashboardStore';

const COLORS = ['#8884D8', '#00C49F', '#FFBB28'];
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  name,
}) => {
  const RADIAN = Math.PI / 180;


  const config = {
    'إستشارة': { offset: 50, color: '#8884D8', fontWeight: 'bold' },
    'متابعة': { offset: 50, color: '#FFBB28', fontWeight: 'bold' },
    'فحص': { offset: 50, color: '#00C49F', fontWeight: 'bold' },
  };

  const { offset = 20, color = '#333', fontWeight = 'normal' } = config[name] || {};

  const radius = outerRadius + offset;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={color}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={fontWeight}
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


const VisitTypePie = () => {
  const data = useDoctorDashboardStore((state) => state.statistics.visitTypes);

  return (
    <div className="bg-gray-50 p-4 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Stethoscope className="text-cyan-600" /> توزيع أنواع الزيارات
      </h2>
      <div className="h-80 bg-white rounded-2xl p-4 shadow-md">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              nameKey="name"
              labelLine={true}
              label={renderCustomizedLabel}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default memo(VisitTypePie);
