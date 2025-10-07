import { memo } from 'react';
import useDoctorDashboardStore from '../../../../store/doctorDashboardStore';
import { User, Stethoscope, Droplet, Pill, Clock } from 'lucide-react';

const ICON_MAP = {
    totalPatients: <User className="w-6 h-6 text-cyan-600" />,
    monthlyVisits: <Stethoscope className="w-6 h-6 text-cyan-600" />,
    testRequests: <Droplet className="w-6 h-6 text-cyan-600" />,
    prescriptions: <Pill className="w-6 h-6 text-cyan-600" />,
};

const QuickStats = () => {
    const quickStats = useDoctorDashboardStore(state => state.statistics.quickStats);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {quickStats.map((stat, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-xl shadow-md ">
                    <div className="flex items-center justify-between">
                        <div className="p-2 rounded-full bg-cyan-100 text-cyan-600">
                            {ICON_MAP[stat.key] || <User className="w-6 h-6 text-cyan-600" />}
                        </div>
                        <span
                            className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                                }`}
                        >
                            {stat.change}
                        </span>
                    </div>
                    <h3 className="text-sm text-gray-500 mt-2">{stat.title}</h3>
                    <p className="text-xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
            ))}
        </div>
    );
};

export default memo(QuickStats);