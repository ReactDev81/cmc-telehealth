import { appointmentProps } from "@/types/patient/appointment"
import { useState } from "react"
import { FlatList, View } from "react-native"
import demoImage from "../../../assets/images/demo.jpg"
import CancelAppointmentModal from "./cancel-appointment-modal"
import UpcomingAppointments from "./upcoming-appointments"

const AllUpcomingAppointment = ({ appointments }: { appointments: appointmentProps[] }) => {

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

    const renderDoctorItem = ({ item }: { item: appointmentProps }) => {
        return (
            <UpcomingAppointments
                appointment_id={item.appointment_id}
                image={item.image || demoImage}
                name={item.doctor.name}
                speciality={item.doctor.department}
                rating={item.doctor?.average_rating}
                consultation_type={item.consultation_type_label}
                consultation_fee={item.fee_amount}
                experience={item.doctor?.years_experience}
                date={item.appointment_date_formatted}
                time={item.appointment_time_formatted}
                CancelSchedule={() => handleCancelPress(item)}
                call_now={item.call_now}
            />
        );
    };

    return (
        <>
            <FlatList
                data={appointments}
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
                    date: selectedAppointment.appointment_date_formatted,
                    time: selectedAppointment.time
                } : undefined}
            />
        </>
    )
}

export default AllUpcomingAppointment