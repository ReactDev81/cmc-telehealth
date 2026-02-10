import { Appointment } from "@/types/doctor/appointment";
import { ScrollView, Text, View } from "react-native"; // Added Text import
import TodayAppointmentCard from "./today-appointment-card";

const AllTodayAppointment = ({ data }: { data?: Appointment[] }) => {
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/387/387561.png";
    const appointments = data || [];

    if (appointments.length === 0) {
        return (
            <View className="flex-1 items-center justify-center py-20">
                <Text className="text-neutral-500 text-lg font-medium">No appointments today</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            {appointments.map((appointment) => {
                // Safeguard against missing patient data
                const patientName = appointment?.patient?.name || "Unknown Patient";
                const avatar = appointment?.patient?.avatar || appointment?.patient?.image;
                const imageSource = avatar
                    ? { uri: avatar as string }
                    : { uri: defaultAvatar };

                return (
                    <View className="mb-5" key={appointment.appointment_id || Math.random()}>
                        <TodayAppointmentCard
                            appointmentId={appointment.appointment_id}
                            image={imageSource}
                            name={patientName}
                            time={appointment.appointment_time_formatted || appointment.appointment_time}
                            mode={
                                appointment.consultation_type_label?.toLowerCase() ===
                                    "video consultation"
                                    ? "Video"
                                    : "In Person"
                            }
                            callNow={appointment.call_now}
                        />
                    </View>
                );
            })}
        </ScrollView>
    );
};

export default AllTodayAppointment;
