import Button from '@/components/ui/Button';
import { CalendarDays, Check, Video } from 'lucide-react-native';
import { Image, Modal, Text, View } from 'react-native';


type BookingConfirmationModalProps<T = any> = {
    visible: boolean;
    onClose: () => void;
    data: T;
};

const AppointmentConfirmation = ({ visible, onClose, data }: BookingConfirmationModalProps ) => { 

    return(
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/50 px-5">
                <View className="bg-white rounded-xl px-5 py-7 w-full max-w-sm">
                    
                    {/* Success Icon */}
                    <View className="items-center mb-5">
                        <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center">
                            <Check size={22} color="#013220" strokeWidth={3} />
                        </View>
                    </View>

                    {/* Title & Message */}
                    <Text className="text-lg font-semibold text-black text-center mb-2">
                        Thanks, your booking has been confirmed
                    </Text>
                    <Text className="text-base text-black-400 text-center mb-5">
                        Please check the My Appointments in the app for details.
                    </Text>

                    {/* Appointment Details Card */}
                    <View className="bg-primary-100 rounded-xl p-5 mb-6">
                        
                        {/* Doctor Info */}
                        <View className="flex-row items-center mb-5">
                            <Image
                                source={{ uri: data.doctor_avatar }}
                                className="w-12 h-12 rounded-lg"
                                resizeMode="cover"
                            />
                            <View className="ml-3 flex-1">
                                <Text className="text-base font-semibold text-black">
                                    {data.doctor_name}
                                </Text>
                                <Text className="text-sm text-black-400 mt-0.5">
                                    {data.doctor_department}
                                </Text>
                            </View>
                        </View>

                        {/* Appointment Type */}
                        <View className="flex-row mb-3">
                            <Video size={16} color="#4D4D4D" />
                            <Text className="text-sm text-black-400 ml-3">
                                {data.consultation_type_label}
                            </Text>
                        </View>

                        {/* Date & Time */}
                        <View className="flex-row">
                            <CalendarDays size={16} color="#4D4D4D" />
                            <Text className="text-sm text-black-400 ml-3">
                                {data.schedule_date}
                                {'\n'} 
                                {data.schedule_time}
                            </Text>
                        </View>

                        <Button className="mt-5" onPress={onClose}>Done</Button>

                    </View>

                </View>
            </View>
        </Modal>
    )
}

export default AppointmentConfirmation