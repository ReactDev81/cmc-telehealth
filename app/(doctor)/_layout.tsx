import { router, Tabs } from 'expo-router';
import {  View, Platform, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from "expo-status-bar";
import { House, UserRound, CalendarDays, ClipboardClock, MessageSquareText, ChevronLeft } from 'lucide-react-native';

export default function TabLayout() {

    const insets = useSafeAreaInsets();

    return (
        <>
            <StatusBar style="dark" />
            <Tabs
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#FFFFFF',
                    },
                    headerTitleAlign: 'left',
                    headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: '500',
                        color: '#1F1E1E',
                    },
                    headerLeft: () => (
                        <TouchableOpacity 
                            onPress={() => router.back()}
                            className="ml-3 pr-2"
                        >
                            <ChevronLeft size={24} color="#1F1E1E" />
                        </TouchableOpacity>
                    ),
                    headerShadowVisible: true,
                    tabBarStyle: {
                        backgroundColor: '#FFFFFF',
                        borderTopWidth: 1,
                        borderTopColor: '#E5E7EB',
                        height: Platform.OS === 'ios' ? 88 : 80 + insets.bottom,
                        paddingBottom: Platform.OS === 'ios' ? 20 + insets.bottom : 10 + insets.bottom,
                        paddingTop: 5,
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                    tabBarActiveTintColor: '#013220',
                    tabBarInactiveTintColor: '#4D4D4D',
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: '400',
                        marginTop: 5,
                    },
                    tabBarIconStyle: {
                        marginTop: 0,
                    },
                }}
            >
                <Tabs.Screen 
                    name="index"
                    options={{
                        title: 'Home',
                        headerShown: false,
                        tabBarIcon: ({ color }) => (
                            <House size={24} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen 
                    name="schedules"
                    options={{
                        headerTitle: 'My Schedules',
                        tabBarLabel: 'Schedules',
                        tabBarIcon: ({ color }) => (
                            <ClipboardClock size={24} color={color} strokeWidth={1.8} />
                        ),
                    }}
                />
                <Tabs.Screen 
                    name="appointments"
                    options={{
                        headerTitle: 'My Appointments',
                        tabBarLabel: '',
                        tabBarIcon: () => (
                            <View className="bg-primary w-16 h-16 rounded-full items-center justify-center -mt-14">
                                <CalendarDays size={24} color="#FFFFFF" />
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen 
                    name="feedbacks"
                    options={{
                        headerTitle: 'Patients Feedback',
                        tabBarLabel: 'Feedbacks',
                        tabBarIcon: ({ color }) => (
                            <MessageSquareText size={24} color={color} strokeWidth={1.8} />
                        ),
                    }}
                />
                <Tabs.Screen 
                    name="profile"
                    options={{
                        title: 'Profile',
                        tabBarIcon: ({ color }) => (
                            <UserRound size={24} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </>
    );
}