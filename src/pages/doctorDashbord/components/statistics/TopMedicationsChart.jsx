
import { memo } from 'react';
import {
    ResponsiveContainer,
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
    Cell,
} from 'recharts';
import { Pill } from 'lucide-react';
import useDoctorDashboardStore from '../../../../store/doctorDashboardStore';

const TopMedicationsChart = () => {
    const rawData = useDoctorDashboardStore((state) => state.statistics.topMedications);

    const data = [...rawData].sort((a, b) => b.prescriptions - a.prescriptions);

    const top5Names = data.slice(0, 5).map((item) => item.name);

    return (
        <div className="bg-gray-50 p-4 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Pill className="text-cyan-600" /> مقارنة صرف الأدوية
            </h2>
            <div className="h-96 bg-white rounded-2xl p-5 shadow-md">
                <ResponsiveContainer width="110%" height="100%">
                    <ComposedChart data={data}>
                        <CartesianGrid strokeDasharray="3 5" />
                        <XAxis dataKey="name" />
                        <YAxis tickMargin={10} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="prescriptions" barSize={40}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={top5Names.includes(entry.name) ? '#00C49F' : '#7222A0'}
                                />
                            ))}
                        </Bar>
                        <Line type="monotone" dataKey="prescriptions" stroke="#00C49F" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default memo(TopMedicationsChart);
