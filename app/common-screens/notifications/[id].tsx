import { useNotificationDetail } from "@/queries/common/useNotificationDetail";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

const NotificationDetail = () => {

    const { id } = useLocalSearchParams<{
        id: string;
    }>();

    const { data, isLoading, isError, error } = useNotificationDetail(id);

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator />
            </View>
        );
    }

    if (isError || !data) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-danger">
                    {
                        ((error as any)?.response?.data?.message ??
                        (error as any)?.message ??
                        "Something went wrong. Please try again.")
                    }
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 p-5 bg-white">
            <Text className="text-base font-medium text-black">
                {data.data.title}
            </Text>

            <Text className="text-sm leading-6 text-black-400 mt-3">
                {data.data.message}
            </Text>
        </View>
    );
};

export default NotificationDetail;