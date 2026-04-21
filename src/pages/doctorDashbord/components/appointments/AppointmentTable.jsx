
import AppointmentTableRow from "./AppointmentTableRow";
const AppointmentTable = ({ appointments, onViewDetails, onReceivePatient, onEndExam }) => {
  return (
    <div className="hidden md:block overflow-x-auto bg-white">
      <table className="min-w-full divide-y divide-gray-100 rounded-2xl">
        <thead className="bg-gray-10">
          <tr>
            <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المريض</th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ/الوقت</th>
            <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نوع الزيارة</th>
            <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
            <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <AppointmentTableRow 
              key={appointment.id} 
              appointment={appointment} 
              onViewDetails={onViewDetails}
              onReceivePatient={onReceivePatient}
              onEndExam={onEndExam}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AppointmentTable;