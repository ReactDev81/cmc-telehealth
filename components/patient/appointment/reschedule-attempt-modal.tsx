import Button from "@/components/ui/Button"
import { X } from 'lucide-react-native'
import { Modal, Pressable, Text, TouchableOpacity } from "react-native"

interface RescheduleAttemptModalProps {
    visible: boolean
    onClose: () => void
}

const RescheduleAttemptModal = ({
    visible,
    onClose,
}: RescheduleAttemptModalProps) => {

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
                        Cannot Reschedule
                    </Text>

                    {/* Description */}
                    <Text className="text-base text-center text-black-400 max-w-72 w-full">
                        This appointment has already been rescheduled once. You can only reschedule an appointment once.
                    </Text>

                    {/* Confirm Button */}
                    <Button
                        onPress={onClose}
                        className="mt-6 mx-auto px-8"
                    >
                        Understood
                    </Button>
                </Pressable>
            </Pressable>
        </Modal>
    )
}

export default RescheduleAttemptModal
