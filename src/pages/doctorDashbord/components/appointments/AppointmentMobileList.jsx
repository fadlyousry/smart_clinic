import AppointmentMobileCard from "./AppointmentMobileCard";
const AppointmentMobileList = ({ appointments, onViewDetails, onReceivePatient, onEndExam }) => {
  return (
    <div className="md:hidden space-y-4">
      {appointments.map((appointment) => (
        <AppointmentMobileCard 
          key={appointment.id} 
          appointment={appointment} 
          onViewDetails={onViewDetails}
          onReceivePatient={onReceivePatient}
          onEndExam={onEndExam}
        />
      ))}
    </div>
  );
};
export default AppointmentMobileList;