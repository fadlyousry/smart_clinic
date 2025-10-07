import { User,Stethoscope } from "lucide-react";

const AppointmentTableRow = ({ appointment, onViewDetails }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-2 py-2 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-cyan-100 rounded-full flex items-center justify-center">
            <User style={{ color: "var(--color-primary-dark)" }} size={18} />
          </div>
          <div className="mr-4">
            <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
            <div className="text-sm text-gray-500">{appointment.phone}</div>
          </div>
        </div>
      </td>

      <td className="px-1 py-4 whitespace-nowrap">
        <div className="flex text-sm text-gray-900 items-center">
          {appointment.date}<br />{appointment.time}
        </div>
      </td>
      <td className="px-1 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Stethoscope className="text-gray-400 mr-2" size={16} />
          <span className="text-sm text-gray-900">{appointment.visitType}</span>
        </div>
      </td>
      <td className="px-1 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${appointment.status === "في الإنتظار"
            ? "bg-orange-100 text-yellow-800"
            : appointment.status === "ملغي"
              ? "bg-red-100 text-red-800"
              : appointment.status === "قيد الكشف"
                ? "bg-yellow-200 text-yellow-900"
                : appointment.status === "تم"
                  ? "bg-green-200 text-green-800"
                  : "bg-gray-100 text-yellow-800"
            }`}
        >
          {appointment.status}
        </span>
      </td>


      <td className="px-1 py-1 whitespace-nowrap text-sm font-medium">
        <button
          onClick={() => onViewDetails(appointment)}
          className="text-blue-600 hover:text-blue-900 p-2 hover:bg-cyan-100 rounded-2xl"
        >
          تفاصيل
        </button>
      </td>
    </tr>
  );
};
export default AppointmentTableRow;