import EmptyState from "@/components/ui/EmptyState";
import { Appointment } from "@/types/doctor/appointment";
import { History } from "lucide-react-native";
import { ScrollView } from "react-native";
import PastAppointmentCard from "./past-appointment-card";

const AllPastAppointment = ({ data }: { data?: Appointment[] }) => {

    const defaultAvatar = "./../../assets/images/doctor.jpg";
    const appointments = data || [];

    if (appointments.length === 0) {
        return (
            <EmptyState
                title="No past appointments"
                message="You haven't completed any appointments yet."
                icon={<History size={40} color="#94A3B8" />}
                className="py-20"
            />
        );
    }

    return (
        <ScrollView>
            {appointments.map((appointment) => {

                // Safeguard against missing patient data
                const patientName = appointment?.patient?.name || "Unknown Patient";
                const avatar = appointment?.patient?.avatar || appointment?.patient?.image;
                const imageSource = avatar ? { uri: avatar as string } : { uri: defaultAvatar };

                return (
                    <PastAppointmentCard
                        key={appointment.appointment_id}
                        image={imageSource}
                        name={patientName}
                        time={
                            appointment.appointment_time_formatted ||
                            appointment.appointment_time
                        }
                        date={
                            appointment.appointment_date_formatted ||
                            appointment.appointment_date
                        }
                        mode={
                            (appointment.consultation_type || "")
                            .toLowerCase()
                            .includes("video")
                            ? "Video"
                            : "In Person"
                        }
                        status={appointment.status_label || "Completed"}
                        appointmentId={appointment.appointment_id}
                    />
                );
            })}
        </ScrollView>
    );
};

export default AllPastAppointment;
