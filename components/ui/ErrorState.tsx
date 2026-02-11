import { AlertCircle, RotateCcw } from 'lucide-react-native';
import { Text, View } from 'react-native';
import Button from './Button';

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    className?: string;
}

const ErrorState = ({
    title = "Something went wrong",
    message = "We couldn't load the information. Please check your connection and try again.",
    onRetry,
    className = ""
}: ErrorStateProps) => {
    return (
        <View className={`flex-1 items-center justify-center p-6 bg-white ${className}`}>
            <View className="bg-danger-400 p-4 rounded-full mb-4">
                <AlertCircle size={40} color="#EF4444" />
            </View>

            <Text className="text-xl font-semibold text-black text-center mb-2">
                {title}
            </Text>

            <Text className="text-black-400 text-center mb-8 leading-5">
                {message}
            </Text>

            {onRetry && (
                <Button
                    onPress={onRetry}
                    className="flex-row items-center justify-center gap-x-2 w-full max-w-xs"
                >
                    <RotateCcw size={18} color="white" />
                    <Text className="text-white font-medium">Try Again</Text>
                </Button>
            )}
        </View>
    );
};

export default ErrorState;
