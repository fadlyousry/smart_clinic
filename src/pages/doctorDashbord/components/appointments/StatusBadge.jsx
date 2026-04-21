const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch(status) {
      case "محجوز": return "bg-blue-100 text-blue-800";
      case "في قاعة الانتظار": return "bg-amber-100 text-amber-800";
      case "في الكشف": return "bg-purple-100 text-purple-800";
      case "تم": return "bg-green-100 text-green-800";
      case "ملغى": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles(status)}`}>
      {status}
    </span>
  );
};
export default StatusBadge;