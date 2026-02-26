import { NotificationCard } from '@/components/common/notification/notificationCard';
import { useInfiniteNotifications } from '@/queries/common/useNotifications';
import { formatTimeAgo } from "@/utils/timeAgo";
import { useIsFocused } from "@react-navigation/native";
import { router } from 'expo-router';
import { useEffect } from "react";
import { FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Notifications = () =>  {

    const { data, fetchNextPage, refetch, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteNotifications(10);
    const notifications = data?.pages.flatMap((page) => page.data) ?? [];

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
          refetch();
        }
    }, [isFocused, refetch]);

    return (
        <SafeAreaView edges={["left", "right", "bottom"]}>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <NotificationCard
                        title={item.title}
                        description={item.desc}
                        time={formatTimeAgo(item.created_at)}
                        read={item.is_read}
                        onPress={() => router.push(`/common-screens/notifications/${item.id}`)}
                    />
                )}
                onEndReached={() => {
                    if (hasNextPage) fetchNextPage();
                }}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                    !isLoading ? (
                        <View className="flex-1 items-center justify-center max-w-80 w-full mx-auto px-5 py-8 mt-20">
                            <Image source={require("../../../assets/images/notification.png")} />
                            <Text className="text-lg font-semibold text-black text-center mt-4">
                                No notifications yet
                            </Text>
                            <Text className="text-base text-black-400 text-center mt-2">
                                Your notification will appear here once you've received them.
                            </Text>
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
        
    );
}

export default Notifications