import { Appointment } from "@/types/doctor/appointment";
import { ScrollView, View } from "react-native";
import TodayAppointmentCard from "./today-appointment-card";

const AllTodayAppointment = ({ data }: { data?: Appointment[] }) => {
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/387/387561.png";
    const appointments = data || [];
    return (
        <ScrollView>
            {appointments.map((appointement) => {
                const imageSource = appointement.patient.avatar
                    ? { uri: appointement.patient.avatar }
                    : { uri: defaultAvatar };

                return (
                    <View className="mb-5" key={appointement.appointment_id}>
                        <TodayAppointmentCard
                            appointmentId={appointement.appointment_id}
                            image={imageSource}
                            name={appointement.patient.name}
                            time={appointement.appointment_time_formatted}
                            mode={
                                appointement.consultation_type_label.toLowerCase() ===
                                    "video consultation"
                                    ? "Video"
                                    : "In Person"
                            }
                        />
                    </View>
                );
            })}
        </ScrollView>
    );
};

export default AllTodayAppointment;
