import EmptyState from "@/components/ui/EmptyState";
import { Appointment } from "@/types/doctor/appointment";
import { Calendar } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import TodayAppointmentCard from "./today-appointment-card";

const AllTodayAppointment = ({ data }: { data?: Appointment[] }) => {

    const defaultAvatar = "./../../assets/images/doctor.jpg";
    const appointments = data || [];

    if (appointments.length === 0) {
        return (
            <EmptyState
                title="No appointments today"
                message="You don't have any appointments scheduled for today."
                icon={<Calendar size={40} color="#94A3B8" />}
                className="py-20"
            />
        );
    }

    return (
        <ScrollView>
            {appointments.map((appointment) => {
                const patientName = appointment?.patient?.name || "Unknown Patient";
                const avatar = appointment?.patient?.avatar || appointment?.patient?.image;
                const imageSource = avatar ? { uri: avatar as string } : { uri: defaultAvatar };
                return (
                    <View
                        className="mb-5"
                        key={appointment.appointment_id || Math.random()}
                    >
                        <TodayAppointmentCard
                            appointmentId={appointment.appointment_id}
                            image={imageSource}
                            name={patientName}
                            date={appointment.appointment_date_formatted}
                            time={
                                appointment.appointment_time_formatted ||
                                appointment.appointment_time
                            }
                            mode={
                                appointment.consultation_type_label?.toLowerCase() ===
                                "video consultation"
                                ? "Video"
                                : "In Person"
                            }
                            call_now={appointment.call_now}
                            status={appointment.status_label}
                        />
                    </View>
                );
            })}
        </ScrollView>
    );
};

export default AllTodayAppointment;