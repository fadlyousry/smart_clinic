import { User, Stethoscope, CalendarClock, Info } from "lucide-react";
import StatusBadge from "./StatusBadge";

const AppointmentMobileCard = ({ appointment, onViewDetails }) => {
  return (
    <div className="rounded-2xl p-4 shadow-sm bg-white mb-4">

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-100 text-cyan-600 rounded-full h-10 w-10 flex items-center justify-center">
            <User size={18} />
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">{appointment.patientName}</div>
            <div className="text-xs text-gray-500">{appointment.phone}</div>
          </div>
        </div>
        <StatusBadge status={appointment.status} />
      </div>


      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <CalendarClock size={16} className="text-gray-400" />
          <span>{appointment.date} - {appointment.time}</span>
        </div>

        <div className="flex items-center gap-2">
          <Stethoscope size={16} className="text-gray-400" />
          <span>{appointment.visitType}</span>
        </div>

        {appointment.reason && (
          <div className="flex items-center gap-2">
            <Info size={16} className="text-gray-400" />
            <span>{appointment.reason}</span>
          </div>
        )}
      </div>


      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onViewDetails?.(appointment)}
          className="text-blue-600 hover:text-blue-900 text-sm px-3 py-1 hover:bg-cyan-100 rounded-2xl"
        >
          تفاصيل
        </button>
      </div>
    </div>
  );
};

export default AppointmentMobileCard;
