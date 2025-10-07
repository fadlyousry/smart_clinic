const StatCard = ({ title, value, bgColor }) => {
  const bgClass = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
  }[bgColor] || "bg-gray-100 text-gray-800";

  return (
    <div className={`p-4 rounded-xl shadow ${bgClass}`}>
      <div className="text-sm font-semibold mb-1">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
};

const AppointmentStats = ({ appointments }) => {
  const completedCount = appointments.filter(a => a.status === "تم").length;
  const waitingCount = appointments.filter(a => a.status === "في الإنتظار").length;
  const cancelledCount = appointments.filter(a => a.status === "ملغي").length;

  return (
    <div className="bg-gray-50 p-4 rounded-2xl shadow-sm mt-6">
      <h2 className="text-lg font-semibold mb-4">ملخص إحصائي</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="مواعيد اليوم" value={appointments.length} bgColor="blue" />
        <StatCard title="مواعيد تمت" value={completedCount} bgColor="green" />
        <StatCard title="في الانتظار" value={waitingCount} bgColor="yellow" />
        <StatCard title="مواعيد ملغاه" value={cancelledCount} bgColor="red" />
      </div>
    </div>
  );
};

export default AppointmentStats;
