import AppointmentMobileCard from "./AppointmentMobileCard";
const AppointmentMobileList = ({ appointments, onViewDetails }) => {
  return (
    <div className="md:hidden space-y-4">
      {appointments.map((appointment) => (
        <AppointmentMobileCard key={appointment.id} appointment={appointment} onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};
export default AppointmentMobileList;