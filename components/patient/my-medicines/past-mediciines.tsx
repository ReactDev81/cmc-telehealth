import { useAuth } from "@/context/UserContext";
import { usePrescriptions } from "@/queries/patient/usePrescriptions";
import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MedicineCard from "./medicine-card";

const PastMedicines = () => {
    
    const { user } = useAuth();
    const isFocused = useIsFocused();
    const patient_id = user?.patient_id as string;
    const { data, isLoading, error, refetch } = usePrescriptions(patient_id, "past");

    useEffect(() => {
        if (isFocused) {
          refetch();
        }
    }, [isFocused, refetch]);

    if (isLoading) return (
        <SafeAreaView className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="primary" />
        </SafeAreaView>
    );
    if (error) return (
        <SafeAreaView className="flex-1 items-center justify-center">
            <Text className="text-black">Something went wrong</Text>
        </SafeAreaView>
    );

    const renderMedicines = ({ item }: { item: any }) => {
        return (
            <MedicineCard
                appointment_id={item.appointment_id}
                patient_symptoms={item.problem}
                doctor_name={item.doctor_name}
                consulated_date={item.medician_timings}
            />
        );
    };

    return (
        <FlatList
            data={data?.data ?? []}
            renderItem={renderMedicines}
            keyExtractor={(item, index) => item.prescription_id || index.toString()}
            ItemSeparatorComponent={() => <View className="h-5" />}
            ListEmptyComponent={
                <View className="flex-1 items-center justify-center py-20">
                    <Text className="text-black-400 text-base">No past medicines</Text>
                </View>
            }
        />
    );
};

export default PastMedicines;
