import { Appointment } from "@/types/patient/appointment";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import PastAppointment from "./past-appointments";

const AllPastAppointment = ({
    appointments,
    isLoading,
}: {
    appointments: Appointment[];
    isLoading?: boolean;
}) => {
    const renderDoctorItem = ({ item }: { item: Appointment }) => {
        // console.log("Past Appointment Item :", item);
        // console.log("Doctor data:", item.doctor);
        // console.log("Average rating from doctor:", item.doctor?.average_rating);
        // console.log("Average rating from root:", item.average_rating);
        return (
            <PastAppointment
                appointment_id={item.appointment_id}
                status={item.status_label}
                image={item.doctor?.avatar || undefined}
                name={item.doctor?.name || ""}
                speciality={item.doctor?.department || ""}
                rating={item.doctor?.average_rating || item.average_rating || 0}
                consultation_type={item.consultation_type_label}
                consultation_fee={item.fee_amount}
                experience={item.doctor?.years_experience || ""}
                date={item.appointment_date_formatted}
                time={item.appointment_time_formatted}
            />
        );
    };

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center py-20">
                <ActivityIndicator size="large" color="#013220" />
                <Text className="text-black-400 mt-4">Loading appointments...</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={appointments}
            renderItem={renderDoctorItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="h-5" />}
            ListEmptyComponent={
                <View className="flex-1 items-center justify-center py-20">
                    <Text className="text-black-400 text-base">No past appointments</Text>
                </View>
            }
        />
    );
};

export default AllPastAppointment;
