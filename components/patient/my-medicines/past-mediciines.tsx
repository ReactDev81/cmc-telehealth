import { useAuth } from "@/context/UserContext";
import { usePrescriptions } from "@/queries/patient/usePrescriptions";
import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import MedicineCard from "./medicine-card";

const PastMedicines = () => {
    const { user } = useAuth();
    const patient_id = user?.patientId as string;

    const isFocused = useIsFocused();
    const { data, isLoading, error, refetch } = usePrescriptions(patient_id, "past");

    // Refetch prescriptions when component comes into focus
    useEffect(() => {
        if (isFocused) {
            refetch();
        }
    }, [isFocused, refetch]);

    if (isLoading) return <Text>Loading...</Text>;
    if (error) return <Text>Something went wrong</Text>;

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
