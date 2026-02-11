import { Modal, Text, TouchableOpacity, View } from 'react-native';
import Button from './Button';

interface ConfirmationModalProps {
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'primary';
}

const ConfirmationModal = ({
    visible,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    variant = 'primary'
}: ConfirmationModalProps) => {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onCancel}
        >
            <View className="flex-1 items-center justify-center bg-black/50 p-6">
                <View className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl">
                    <Text className="text-xl font-semibold text-black mb-2">
                        {title}
                    </Text>

                    <Text className="text-black-400 text-base mb-8 leading-5">
                        {message}
                    </Text>

                    <View className="flex-row gap-x-3">
                        <TouchableOpacity
                            onPress={onCancel}
                            className="flex-1 py-3 items-center justify-center rounded-xl bg-gray-100"
                        >
                            <Text className="text-black-400 font-medium">{cancelText}</Text>
                        </TouchableOpacity>

                        <Button
                            onPress={onConfirm}
                            className={`flex-1 ${variant === 'danger' ? 'bg-danger' : 'bg-primary'}`}
                        >
                            <Text className="text-white font-medium">{confirmText}</Text>
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ConfirmationModal;
