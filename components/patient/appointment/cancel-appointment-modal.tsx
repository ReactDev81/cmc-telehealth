import { Text, Modal, Pressable, TouchableOpacity } from "react-native"
import { X } from 'lucide-react-native'
import Button from "@/components/ui/Button"

interface CancelAppointmentModalProps {
    visible: boolean
    onClose: () => void
    onConfirm: () => void
    appointmentDetails?: {
        doctorName?: string
        date?: string
        time?: string
    }
}

const CancelAppointmentModal = ({ 
    visible, 
    onClose, 
    onConfirm, 
}: CancelAppointmentModalProps) => {
    
    const handleConfirm = () => {
        onConfirm()
        onClose()
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <Pressable 
                className="flex-1 bg-black/60 justify-center items-center"
                onPress={onClose}
            >
                <Pressable 
                    className="bg-white rounded-xl p-8 w-fit mx-8"
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Close Icon */}
                    <TouchableOpacity 
                        onPress={onClose}
                        activeOpacity={1}
                        className="w-14 h-14 rounded-full bg-[#FDE9ED] items-center justify-center self-center"
                    >
                        <X size={24} color="#FF0000" />
                    </TouchableOpacity>

                    {/* Title */}
                    <Text className="text-lg font-semibold text-center text-black mt-5 mb-2">
                        Confirm Cancel
                    </Text>
                    
                    {/* Description */}
                    <Text className="text-base text-center text-black-400 max-w-72 w-full">
                        Cancel an existing appointment and free up the scheduled time slot.
                    </Text>

                    {/* Confirm Button */}
                    <Button 
                        onPress={handleConfirm}
                        className="mt-6 mx-auto px-8"
                    >
                        Yes, Cancel
                    </Button>
                </Pressable>
            </Pressable>
        </Modal>
    )
}

export default CancelAppointmentModal