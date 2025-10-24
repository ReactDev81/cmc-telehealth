import { View, ScrollView, Text, Image } from 'react-native';
import { router } from 'expo-router';
import { NotificationCard } from '../../components/notification/notificationCard';
import { NotificationList } from '../../json-data/notification';

const Notifications = () =>  {
    return (
        <View className="flex-1 px-5 bg-white">
            <ScrollView>
                {NotificationList.length > 0 ? (
                    NotificationList.map((notification) => (
                        <NotificationCard
                            key={notification.id}
                            title={notification.title}
                            description={notification.description}
                            time={notification.time}
                            onPress={() => router.push('/notifications/notification-details')}
                        />
                    ))
                ) : (
                    <View className="flex-1 items-center justify-center max-w-80 w-full mx-auto px-5 py-8 mt-20">
                        <Image source={require('../../assets/images/notification.png')} />    
                        <Text className="text-lg font-semibold text-black text-center mt-4">
                            No notifications yet
                        </Text>
                        <Text className='text-base text-black-400 text-center mt-2'>
                            Your notification will appear here once you've received them.
                        </Text>
                    </View>
                )}   
            </ScrollView>
        </View>
    );
}

export default Notifications