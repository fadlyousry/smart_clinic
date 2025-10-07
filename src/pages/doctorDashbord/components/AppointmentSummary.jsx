const statuses = [
    { label: "تم", color: "bg-green-500" },
    { label: "في الإنتظار", color: "bg-yellow-500" },
    { label: "ملغي", color: "bg-red-500" },
];

export const AppointmentSummary = ({ appointments }) => {
    return (
            <div className="flex space-x-4 space-x-reverse">
                {statuses.map((status, idx) => {
                    const count = appointments.filter((a) => a.status === status.label).length;
                    return (
                        <div key={idx} className="flex items-center text-sm">
                            <div className={`w-3 h-3 rounded-full ${status.color} ml-1 mr-5`} />
                            <span>
                                {status.label} ({count})
                            </span>
                        </div>
                    );
                })}
            </div>
    );
};

