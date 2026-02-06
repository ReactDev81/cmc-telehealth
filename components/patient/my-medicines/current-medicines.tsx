import { useAuth } from "@/context/UserContext";
import { usePrescriptions } from "@/queries/patient/usePrescriptions";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MedicineCard from "./medicine-card";

const CurrentMedicines = () => {
    const { user } = useAuth(); // assuming patient id is here
    const patient_id = user?.patientId as string;
    // console.log("Patient ID:", patient_id);

    const { data, isLoading, error } = usePrescriptions(patient_id, "current");
    // console.log("x Data:", data?.data ?? []);

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
                    <Text className="text-black-400 text-base">No current medicines</Text>
                </View>
            }
        />
    );
};

export default CurrentMedicines;
