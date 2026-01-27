import { Appointment } from "@/types/patient/appointment";
import { useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import demoImage from "../../../assets/images/demo.jpg";
import CancelAppointmentModal from "./cancel-appointment-modal";
import UpcomingAppointments from "./upcoming-appointments";

const AllUpcomingAppointment = ({
    appointments,
    isLoading,
}: {
    appointments: Appointment[];
    isLoading?: boolean;
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAppointment, setSelectedAppointment] =
        useState<Appointment | null>(null);

    const handleCancelPress = (item: Appointment) => {
        setSelectedAppointment(item);
        setModalVisible(true);
    };

    const handleConfirmCancel = () => {
        console.log("Appointment cancelled:", selectedAppointment);
        setSelectedAppointment(null);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedAppointment(null);
    };

    const renderDoctorItem = ({ item }: { item: Appointment }) => {
        return (
            <UpcomingAppointments
                appointment_id={item.appointment_id}
                image={item.doctor?.avatar || demoImage}
                name={item.doctor?.name}
                speciality={item.doctor?.department}
                rating={item.doctor?.average_rating}
                consultation_type={item.consultation_type_label}
                consultation_fee={item.fee_amount}
                experience={item.doctor?.years_experience}
                date={item.appointment_date_formatted}
                time={item.appointment_time_formatted}
                CancelSchedule={() => handleCancelPress(item)}
                call_now={item.can_start_consultation}
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
        <>
            <FlatList
                data={appointments}
                renderItem={renderDoctorItem}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View className="h-5" />}
                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center py-20">
                        <Text className="text-black-400 text-base">
                            No upcoming appointments
                        </Text>
                    </View>
                }
            />
            <CancelAppointmentModal
                visible={modalVisible}
                onClose={handleCloseModal}
                onConfirm={handleConfirmCancel}
                appointmentDetails={
                    selectedAppointment
                        ? {
                            doctorName: selectedAppointment.doctor?.name,
                            date: selectedAppointment.appointment_date_formatted,
                            time: selectedAppointment.appointment_time_formatted,
                        }
                        : undefined
                }
            />
        </>
    );
};

export default AllUpcomingAppointment;