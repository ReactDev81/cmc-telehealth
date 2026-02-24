import { AlertCircle } from "lucide-react-native";
import { Text, View } from "react-native";

interface ApiErrorProps {
  message?: string | null;
  className?: string;
}

/**
 * ApiError — displays a compact, styled error banner for API response errors.
 * Pass the error message string; renders nothing if message is null/undefined/empty.
 */
const ApiError = ({ message, className = "" }: ApiErrorProps) => {
  if (!message) return null;

  return (
    <View
      className={`flex-row items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-4 ${className}`}
    >
      <AlertCircle size={16} color="#DC2626" style={{ marginTop: 2 }} />
      <Text className="flex-1 text-sm font-medium text-red-600 leading-5">
        {message}
      </Text>
    </View>
  );
};

export default ApiError;
