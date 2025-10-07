const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch(status) {
      case "في الإنتظار": return "bg-orange-100 text-yellow-800";
      case "ملغي": return "bg-red-100 text-red-800";
      case "قيد الكشف": return "bg-yellow-200 text-yellow-900";
      case "تم": return "bg-green-200 text-green-800";
      default: return "bg-gray-100 text-yellow-800";
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles(status)}`}>
      {status}
    </span>
  );
};
export default StatusBadge;