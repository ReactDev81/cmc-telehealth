import { useAuth } from "@/context/UserContext";
import { usePrescriptions } from "@/queries/patient/usePrescriptions";
import { FlatList, Text, View } from "react-native";
import MedicineCard from "./medicine-card";

const CurrentMedicines = () => {
    const { user } = useAuth(); // assuming patient id is here
    const patient_id = user?.patientId as string;
    console.log("Patient ID:", patient_id);

    const { data, isLoading, error } = usePrescriptions(patient_id, "current");
    // console.log("x Data:", data?.data ?? []);

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
            keyExtractor={(item) => item.prescription_id}
            ItemSeparatorComponent={() => <View className="h-5" />}
        />
    );
};

export default CurrentMedicines;
