import { useState } from "react"
import { View, Text, Image, FlatList, TouchableOpacity } from "react-native"
import Button from "../../components/ui/Button"
import { Link, router } from "expo-router"
import { Calendar, Clock, Video } from 'lucide-react-native'
import { appointmentProps } from "../../types/appointment"
import { UpcomingAppointmentData } from "../../json-data/appointment"
import CancelAppointmentModal from "./cancel-appointment-modal"

const UpcomingAppointments = () => {

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

        const { link, image, name, speciality, date, time } = item;

        return (
            <Link href={link}>
                <View className="border border-black-300 rounded-xl p-4 flex-row gap-x-4">
                    <View className="w-24">
                        <Image source={image} className="w-full h-24 rounded-xl" />
                    </View>
                    <View className="flex-1">
                        <View className="flex-row justify-between">
                            <View>
                                <Text className="text-sm font-medium text-black">{name}</Text>
                                <Text className="text-xs text-black mt-1">{speciality}</Text>
                                <View className="flex-row items-center gap-x-3 mt-3">
                                    <View className="flex-row items-center gap-x-2">
                                        <Calendar size={12} className="text-black-400" />
                                        <Text className="text-sm text-black-400">{date}</Text>
                                    </View>
                                    <View className="flex-row items-center gap-x-2">
                                        <Clock size={12} className="text-black-400" />
                                        <Text className="text-sm text-black-400">{time}</Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity 
                                className="w-12 h-12 rounded-full items-center justify-center bg-primary-200"
                                activeOpacity={1}
                                onPress={() => router.push('/whereby')}
                            >
                                <Video size={20} color="#013220" />
                            </TouchableOpacity>
                        </View>
                       
                        <View className="flex-row items-center justify-between gap-x-3 mt-4">
                            <Button 
                                variant="outline" 
                                className="flex-1 [&]:py-3"
                                onPress={() => handleCancelPress(item)}
                            >
                                Cancel
                            </Button>
                            <Button className="flex-1 [&]:py-3">Reschedule</Button>
                        </View>
                    </View>
                </View>
            </Link>
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

export default UpcomingAppointments