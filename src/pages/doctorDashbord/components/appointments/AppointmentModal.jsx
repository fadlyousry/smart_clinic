const ModalHeader = ({ onClose }) => {
  return (
    <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
      <h3 className="text-lg font-semibold">تفاصيل الموعد</h3>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-red-600 text-xl font-bold"
      >
        &times;
      </button>
    </div>
  );
};

const ModalContent = ({ appointment }) => {
  return (
    <div className="p-4 space-y-2 text-sm">
      <div><strong>الاسم:</strong> {appointment.patientName}</div>
      <div><strong>رقم الهاتف:</strong> {appointment.phone}</div>
      <div><strong>التاريخ:</strong> {appointment.date}</div>
      <div><strong>الحالة:</strong> {appointment.status}</div>
      <div><strong>نوع الزيارة:</strong> {appointment.visitType}</div>
      <div><strong>سبب الزيارة:</strong> {appointment.reason}</div>
    </div>
  );
};

const ModalActions = ({ onClose}) => {
  return (
    <div className="px-4 py-2 border-t border-gray-200 flex justify-end gap-2">
      <button
        onClick={onClose}
        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1 rounded"
      >
        إغلاق
      </button>
    </div>
  );
};

const AppointmentModal = ({ isOpen, appointment, onClose }) => {
  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50">
          <ModalHeader onClose={onClose} />
          <ModalContent appointment={appointment} />
          <ModalActions onClose={onClose} appointment={appointment} />
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
