import { CheckCircle2 } from "lucide-react-native";
import { Modal, Text, View } from "react-native";
import Button from "../../ui/Button";

interface SuccessModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

const SuccessModal = ({
    visible,
    onClose,
    title = "Prescription Added",
    message = "The prescription has been successfully added to the patient's record."
}: SuccessModalProps) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-center items-center p-6">
                <View className="bg-white w-full max-w-sm rounded-[32px] p-8 items-center shadow-2xl">
                    <View className="w-20 h-20 bg-primary-100 rounded-full items-center justify-center mb-6">
                        <CheckCircle2 size={48} color="#013220" />
                    </View>

                    <Text className="text-2xl font-bold text-black text-center mb-3">
                        {title}
                    </Text>

                    <Text className="text-base text-black-400 text-center mb-8 leading-6">
                        {message}
                    </Text>

                    <Button
                        onPress={onClose}
                        className="w-full py-4 rounded-2xl"
                    >
                        Great, Thanks!
                    </Button>
                </View>
            </View>
        </Modal>
    );
};

export default SuccessModal;
