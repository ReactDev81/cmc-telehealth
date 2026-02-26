import { Appointment } from "@/types/patient/appointment";
import { FlatList, Text, View } from "react-native";
import UpcomingAppointments from "./upcoming-appointments";

const AllUpcomingAppointment = ({
    appointments,
    isLoading,
}: {
    appointments: Appointment[];
    isLoading?: boolean;
}) => {

    const renderDoctorItem = ({ item }: { item: Appointment }) => {
        return (
            <UpcomingAppointments
                // appointment_id={item.id}
                appointment_id={item.appointment_id}
                image={item.doctor?.avatar ? { uri: item.doctor.avatar } : require("../../../assets/images/demo.jpg")}
                name={item.doctor?.name}
                speciality={item.doctor?.department}
                consultation_type={item.consultation_type_label}
                consultation_fee={item.fee_amount}
                experience={item.doctor?.years_experience}
                average_rating={item.doctor?.average_rating}
                date={item.appointment_date_formatted}
                time={item.appointment_time_formatted}
                call_now={item.call_now}
                status={item.status}
                doctor_name={item.doctor?.name}
                doctor_id={item.doctor?.user_id}
                join_url={item.video_consultation?.join_url || item.join_url}
            />
        );
    };

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center py-20">
                <Text className="text-black-400 text-base">Loading appointments...</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={appointments}
            renderItem={renderDoctorItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
                <View className="flex-1 items-center justify-center py-20">
                    <Text className="text-black-400 text-base">No upcoming appointments</Text>
                </View>
            }
        />
    )
}

export default AllUpcomingAppointment