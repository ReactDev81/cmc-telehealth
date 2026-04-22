import AllPastAppointment from "@/components/patient/appointment/all-past-appointment";
import AllUpcomingAppointment from "@/components/patient/appointment/all-upcoming-appointment";
import Tab, { TabItem } from "@/components/ui/Tab";
import { useAuth } from "@/context/UserContext";
import { useAppointments } from "@/queries/patient/useAppointments";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Appointments = () => {

    const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
    const { token } = useAuth();
    const isFocused = useIsFocused();
    const { data: appointments = [], isLoading, isError, error, refetch } = useAppointments(activeTab, token!);

    // ✅ Refetch appointments only when screen comes into focus (critical data)
    useEffect(() => {
        if (isFocused) {
            refetch();
        }
    }, [isFocused, refetch]);

    const appointmentTabs: TabItem[] = [
        {
            key: "upcoming",
            label: "Upcoming",
            renderContent: () => isLoading ? (
                <ActivityIndicator />
            ) : (
                <AllUpcomingAppointment appointments={appointments} isLoading={isLoading} />
            ),
        },
        {
            key: "past",
            label: "Past",
            renderContent: () => isLoading ? (
                <ActivityIndicator />
            ) : (
                <AllPastAppointment appointments={appointments} isLoading={isLoading} />
            ),
        },
    ];

    if (isError) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-white">
                <Text className="text-danger">
                    {((error as any)?.response?.data?.errors?.message ??
                        (error as any)?.message ??
                    "Failed to load appointments")}
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <View className="flex-1 bg-white p-5 pb-0">
            <Tab
                tabs={appointmentTabs}
                defaultTab="upcoming"
                onTabChange={(key) => setActiveTab(key as "upcoming" | "past")}
            />
        </View>
    );
};

export default Appointments;
