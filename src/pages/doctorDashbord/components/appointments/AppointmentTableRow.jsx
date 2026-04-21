import { User, Stethoscope, UserCheck, CheckCircle } from "lucide-react";

const AppointmentTableRow = ({ appointment, onViewDetails, onReceivePatient, onEndExam }) => {
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
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            appointment.status === "في قاعة الانتظار"
              ? "bg-amber-100 text-amber-800"
              : appointment.status === "في الكشف"
                ? "bg-purple-100 text-purple-800"
                : appointment.status === "تم"
                  ? "bg-green-100 text-green-800"
                  : appointment.status === "ملغى"
                    ? "bg-red-100 text-red-800"
                    : appointment.status === "محجوز"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
          }`}
        >
          {appointment.status}
        </span>
      </td>

      <td className="px-1 py-1 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          {/* زر استقبال المريض */}
          {onReceivePatient && appointment.status === "في قاعة الانتظار" && (
            <button
              onClick={() => onReceivePatient(appointment)}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-xs font-medium"
            >
              <UserCheck size={14} />
              استقبال
            </button>
          )}
          {/* زر إنهاء الكشف */}
          {onEndExam && appointment.status === "في الكشف" && (
            <button
              onClick={() => onEndExam(appointment)}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs font-medium"
            >
              <CheckCircle size={14} />
              إنهاء الكشف
            </button>
          )}
          <button
            onClick={() => onViewDetails(appointment)}
            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-cyan-100 rounded-2xl"
          >
            تفاصيل
          </button>
        </div>
      </td>
    </tr>
  );
};
export default AppointmentTableRow;