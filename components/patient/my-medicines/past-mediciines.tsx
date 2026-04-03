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
    const { data, isLoading, isError, error, refetch } = usePrescriptions(patient_id, "past");

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

    if (isError) {
        return (
            <View className="flex-1 items-center justify-center p-5">
                <Text className="text-base text-red-500">
                    {((error as any)?.response?.data?.errors?.message ??
                        (error as any)?.message ??
                        "Something went wrong")}
                </Text>
            </View>
        );
    }

    const renderMedicines = ({ item }: { item: any }) => {
        return (
            <MedicineCard
                appointment_id={item.appointment_id}
                patient_symptoms={item.problem}
                doctor_name={item.doctor_name}
                consulated_date={item.timing}
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
