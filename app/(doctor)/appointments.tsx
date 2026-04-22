import AllPastAppointment from "@/components/doctor/appointment/all-past-appointment";
import AllTodayAppointment from "@/components/doctor/appointment/all-today-appointment";
import AllUpcomingAppointment from "@/components/doctor/appointment/all-upcoming-appointment";
import Tab, { TabItem } from "@/components/ui/Tab";
import { useAuth } from "@/context/UserContext";
import { useAppointments } from "@/queries/doctor/useAppointments";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Appointments = () => {

    const { token } = useAuth();
    const { tab } = useLocalSearchParams<{ tab?: string }>();
    const todayQuery = useAppointments("today", token!);
    const upcomingQuery = useAppointments("upcoming", token!);
    const pastQuery = useAppointments("past", token!);
    const isLoading = todayQuery.isLoading || upcomingQuery.isLoading || pastQuery.isLoading;
    const isError = todayQuery.isError || upcomingQuery.isError || pastQuery.isError;
    

    if (isLoading) return <ActivityIndicator className="flex-1" />;

    if (isError) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-red-500">Failed to load appointments</Text>
            </View>
        );
    }

    const appointmentTabs: TabItem[] = [
        {
            key: "today",
            label: "Today",
            renderContent: () => <AllTodayAppointment data={todayQuery.data || []} />,
        },
        {
            key: "upcoming",
            label: "Upcoming",
            renderContent: () => <AllUpcomingAppointment data={upcomingQuery.data || []} />,
        },
        {
            key: "past",
            label: "Past",
            renderContent: () => <AllPastAppointment data={pastQuery.data || []} />,
        },
    ];

    // Use the tab from query params if available, otherwise default to "today"
    const defaultTab = tab && ["today", "upcoming", "past"].includes(tab) ? tab : "today";

    return (
        <SafeAreaView edges={["left", "right", "bottom"]} className="flex-1 bg-white p-5 pb-0">
            <Tab tabs={appointmentTabs} defaultTab={defaultTab} />
        </SafeAreaView>
    );
};

export default Appointments;
