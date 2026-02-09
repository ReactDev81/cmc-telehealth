import { Appointment } from "@/types/doctor/appointment";
import { Link } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import UpcomingAppointmentCard from "./upcoming-appointment-card";

const AllUpcomingAppointment = ({ data }: { data?: Appointment[] }) => {
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/387/387561.png";
    const appointments = data || [];
    console.log("appointments", appointments)
    console.log("appointments", appointments[0].appointment_id)

    if (appointments.length === 0) {
        return (
            <View className="flex-1 items-center justify-center py-20">
                <Text className="text-neutral-500 text-lg font-medium">No upcoming appointments</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            {appointments.map((appointement) => {
                // Safeguard against missing patient data
                const patientName = appointement?.patient?.name || "Unknown Patient";
                const avatar = appointement?.patient?.avatar || appointement?.patient?.image;
                const imageSource = avatar
                    ? { uri: avatar as string }
                    : { uri: defaultAvatar };

                return (
                    <Link
                        href={`/doctor/patient-details/${appointement.appointment_id}`}
                        className="mb-5"
                        key={appointement.appointment_id || Math.random().toString()}
                    >
                        <UpcomingAppointmentCard
                            image={imageSource}
                            name={patientName}
                            time={appointement.appointment_time_formatted || appointement.appointment_time}
                            date={appointement.appointment_date_formatted || appointement.appointment_date}
                            mode={
                                (appointement.consultation_type || "").toLowerCase().includes("video")
                                    ? "Video"
                                    : "In Person"
                            }
                            status={appointement.status_label || "Scheduled"}
                        />
                    </Link>
                );
            })}
        </ScrollView>
    );
};

export default AllUpcomingAppointment;
