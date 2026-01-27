import { Appointment } from "@/types/doctor/appointment";
import { ScrollView, View } from "react-native";
import UpcomingAppointmentCard from "./upcoming-appointment-card";

const AllUpcomingAppointment = ({ data }: { data?: Appointment[] }) => {
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
                        <UpcomingAppointmentCard
                            image={imageSource}
                            name={appointement.patient.name}
                            time={appointement.appointment_time_formatted}
                            date={appointement.appointment_date_formatted}
                            mode={
                                appointement.consultation_type === "video"
                                    ? "Video"
                                    : "In Person"
                            }
                            status="Scheduled"
                        />
                    </View>
                );
            })}
        </ScrollView>
    );
};

export default AllUpcomingAppointment;
