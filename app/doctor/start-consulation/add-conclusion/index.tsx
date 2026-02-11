import { useAuth } from "@/context/UserContext";
import { usePatientDetail } from "@/queries/doctor/usePatientDetail";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import ConclusionForm from "./conclusion-form";

interface Props {
    onClose: () => void;
}

const AddConclusion = ({ onClose }: Props) => {
    const { token } = useAuth();
    const { appointment_id } = useLocalSearchParams<{ appointment_id: string }>();
    const { data: patient, isLoading, isError } = usePatientDetail(appointment_id || "", token || "");

    if (isLoading) {
        return (
            <View className="py-10 items-center justify-center">
                <ActivityIndicator size="large" color="#013220" />
                <Text className="text-black-400 mt-4 font-medium">Loading details...</Text>
            </View>
        );
    }

    if (isError || !patient) {
        return (
            <View className="py-10 items-center justify-center px-5">
                <Text className="text-red-500 text-center font-medium">Failed to load patient context</Text>
            </View>
        );
    }

    const patientData = patient.data;

    return (
        <View>
            <View className="px-5">
                {/* patient info */}
                {/* <View className="mb-2">
                    <Text className="text-lg font-medium text-black">{patientData?.name}</Text>
                    <View className="flex-row items-center gap-x-2 mt-0.5">
                        <Text className="text-sm text-black-400">{patientData?.age_display || `${patientData?.age} Years`}</Text>
                        <View className="w-1 h-1 rounded-full bg-gray mt-0.5"></View>
                        <Text className="text-sm text-black-400">{patientData?.gender_label || patientData?.gender}</Text>
                    </View>
                </View> */}

                {/* <View className="h-[1px] bg-gray-100 w-full mt-4" /> */}
            </View>

            <ConclusionForm onClose={onClose} />
        </View>
    );
};

export default AddConclusion;
