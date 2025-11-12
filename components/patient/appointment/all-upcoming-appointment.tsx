import { useState } from "react"
import { View, FlatList } from "react-native"
import { appointmentProps } from "@/types/patient/appointment"
import { UpcomingAppointmentData } from "@/json-data/patient/appointment"
import UpcomingAppointments from "./upcoming-appointments"
import CancelAppointmentModal from "./cancel-appointment-modal"

const AllUpcomingAppointment = () => {

    const [modalVisible, setModalVisible] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState<appointmentProps | null>(null)

    const handleCancelPress = (item: appointmentProps) => {
        setSelectedAppointment(item)
        setModalVisible(true)
    }

    const handleConfirmCancel = () => {
        console.log('Appointment cancelled:', selectedAppointment)
        setSelectedAppointment(null)
    }

    const handleCloseModal = () => {
        setModalVisible(false)
        setSelectedAppointment(null)
    }

    const renderDoctorItem = ({ item } : { item: appointmentProps }) => {
        return (
            <UpcomingAppointments
                id={item.id}
                image={item.image}
                name={item.name}
                speciality={item.speciality}
                rating={item.rating}
                consultation_type={item.consultation_type}
                consultation_fee={item.consultation_fee}
                expercience={item.expercience}
                date={item.date}
                time={item.time}
                CancelSchedule={() => handleCancelPress(item)}
            />
        );
    };

    return(
        <>
            <FlatList
                data={UpcomingAppointmentData}
                renderItem={renderDoctorItem}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View className="h-5" />}
            />
            <CancelAppointmentModal
                visible={modalVisible}
                onClose={handleCloseModal}
                onConfirm={handleConfirmCancel}
                appointmentDetails={selectedAppointment ? {
                    doctorName: selectedAppointment.name,
                    date: selectedAppointment.date,
                    time: selectedAppointment.time
                } : undefined}
            />
        </>
    )
}

export default AllUpcomingAppointment